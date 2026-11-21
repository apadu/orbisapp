import { useEffect, useMemo, useState } from 'react'
import { QUIZ_ITEMS, QuizTile, summarize } from './QuizHub'
import { COUNTRY_PAGE_IDS } from '../data/countryPages'
import { useAuth } from '../auth/AuthContext'
import { loadResults, subscribeResults } from '../utils/results'
import { levelForXp, levelTitle, computeXp, feverTemp } from '../utils/profileData'
import { gameMeta } from '../utils/gameCatalog'
import { useDailyChallenges } from '../utils/useDailyChallenges'
import { dailyNumber, dailyQuizFor } from '../quizzes/daily'
import { useQuizOverview } from '../utils/quizOverview'
import Icon, { SECTION_ICON } from './Icon'
import { InfoLinks } from './InfoPage'
import { t, continentName } from '../i18n'

import { GLOBE_ROWS as ROWS, GAME_GROUPS, gamesOfTheDay, randomGame } from '../utils/gameRegistry'
import GameIcon from './GameIcon'

// First visit: four easy ways in (replaced by the most played quizzes once there's data)
const STARTERS = ['flag', 'capital', 'mystery', 'tripoints-1']
const tileItem = (id) => QUIZ_ITEMS.find(q => q.id === id) ?? { id, label: gameMeta(id).label }

function useResults() {
  const [results, setResults] = useState(loadResults)
  useEffect(() => subscribeResults(() => setResults(loadResults())), [])
  return results
}

export default function HomePage({ onSelectMode, onProfile, onDailyQuiz, onOpenInfo }) {
  const { list: daily } = useDailyChallenges()
  const auth = useAuth()
  const results = useResults()
  const stats = useMemo(() => summarize(results), [results])
  const [dailyOpen, setDailyOpen] = useState(false)

  const xp = useMemo(() => computeXp(results), [results])

  // Section cards: Globe · Name them all · Quizzes · Countries
  const sections = useMemo(() => {
    const ids = (g) => g.id === 'quizzes' ? QUIZ_ITEMS.map(q => q.id)
      : ROWS.filter(r => g.rows?.includes(r.id)).flatMap(r => r.items.map(i => i.id))
    return ['globe', 'nameall', 'quizzes', 'countries'].map(id => {
      const g = GAME_GROUPS.find(x => x.id === id)
      if (id === 'countries') return { ...g, count: t('{n} countries', { n: COUNTRY_PAGE_IDS.size }), total: 0 }
      const list = ids(g)
      return { ...g, count: t('{n} games', { n: list.length }), total: list.length, played: list.filter(m => stats[m]).length }
    })
  }, [stats])
  const level = levelForXp(xp)
  const name = auth.profile?.username
  const isNew = results.length === 0

  const recent = useMemo(() => {
    const out = []
    for (const r of results) { if (!out.includes(r.mode) && r.mode !== 'daily-quiz') out.push(r.mode); if (out.length >= 4) break }
    return out
  }, [results])

  const dailyDone = daily.filter(d => d.done).length


  const overview = useQuizOverview()
  const today = dailyNumber()
  const todaysGames = useMemo(() => gamesOfTheDay(), [today]) // eslint-disable-line react-hooks/exhaustive-deps
  const dailyInfo = useMemo(() => dailyQuizFor(today), [today])
  const dailyPlayed = results.find(r => r.mode === 'daily-quiz' && r.details?.day === today)
  // "Start here" for newcomers (popular quizzes when we know them), "Continue" for everyone else
  const picks = useMemo(() => {
    if (!isNew) return recent
    const popular = Object.entries(overview).filter(([id, o]) => o.playsWeek > 0 && QUIZ_ITEMS.some(q => q.id === id))
      .sort((a, b) => b[1].playsWeek - a[1].playsWeek).map(([id]) => id)
    return [...new Set([...popular, ...STARTERS])].slice(0, 4)
  }, [isNew, recent, overview])

  return (
    <div className="home-overlay hp">
      {/* ── Hero: one clear first step ── */}
      <section className="hp-hero">
        <div className="hp-hero-text">
          <p className="hp-greet">
            {name ? t('Welcome back, {name}', { name: name }) : isNew ? t('Welcome to GeoFeverr') : t('Welcome back, explorer')}
          </p>
          <h1 className="hp-title">{t('Geography fever.')}<br /><span>{t('No cure.')}</span></h1>
          <p className="hp-tagline">{t('Flags, capitals, maps, mountains, empires and planets: hundreds of games on a 3D globe. Play every day and watch your temperature rise.')}</p>
          <div className="hp-ctas">
            <button className="hp-cta-primary" onClick={() => onSelectMode('mystery')}>
              {t('Guess the Mystery Country')} <Icon name="arrow" size={18} />
            </button>
            <button className="hp-cta-secondary" onClick={onDailyQuiz}>
              {dailyPlayed ? <><Icon name="check" size={18} /> {t('Today\'s fever: {s}', { s: `${dailyPlayed.correct}/${dailyPlayed.total}` })}</> : <><Icon name="calendar" size={18} /> {t('Daily Fever')}</>}
            </button>
          </div>
          {dailyInfo && (
            <p className="hp-daily-line">
              <span className="hp-daily-num">{t('Daily Fever')} #{dailyInfo.day}</span>
              {dailyInfo.title}{dailyInfo.region !== 'World' ? ` · ${continentName(dailyInfo.region)}` : ''}
            </p>
          )}
        </div>
      </section>

      {/* ── Start here / Continue ── */}
      {picks.length > 0 && (
        <section className="hp-picks">
          <div className="hp-picks-head">
            <h2>{isNew ? t('Start here') : t('Continue playing')}</h2>
            <button className="pp-link" onClick={() => onSelectMode('quiz-hub')}>{t('All quizzes →')}</button>
          </div>
          <div className="qh-grid hp-picks-grid">
            {picks.map(id => <QuizTile key={id} item={tileItem(id)} st={stats[id]} onSelect={onSelectMode} rating={overview[id]} />)}
          </div>
        </section>
      )}

      {/* ── Games of the day: ten picks, the same for everyone today ── */}
      <section className="hp-today">
        <div className="hp-picks-head">
          <h2>{t('Games of the day')}</h2>
          <button className="hp-random-btn" onClick={() => { const g = randomGame(); if (g) onSelectMode(g.id) }}>
            <Icon name="dice" size={16} /> {t('Surprise me')}
          </button>
        </div>
        <div className="hp-today-grid">
          {todaysGames.map((g, i) => {
            const sec = GAME_GROUPS.find(x => x.id === g.group)
            return (
              <button key={g.id} className="hp-today-card" style={{ '--cat': sec?.color, animationDelay: `${0.03 + i * 0.03}s` }} onClick={() => onSelectMode(g.id)}>
                <span className="hp-today-icon"><GameIcon id={g.id} size={22} /></span>
                <span className="hp-today-body">
                  <span className="hp-today-name">{g.label}</span>
                  <span className="hp-today-sec">{g.sub ?? sec?.short ?? ''}</span>
                </span>
              </button>
            )
          })}
        </div>
      </section>

      {/* ── The four sections ── */}
      <section className="hp-sections" aria-label={t('Sections')}>
        {sections.map((sec, i) => (
          <button key={sec.id} className="hp-sec" style={{ '--cat': sec.color, animationDelay: `${0.05 + i * 0.06}s` }} onClick={() => onSelectMode(sec.page)}>
            <span className="hp-sec-top">
              <span className="hp-sec-icon"><Icon name={SECTION_ICON[sec.id]} size={34} strokeWidth={1.4} /></span>
              <span className="hp-sec-count">{sec.count}</span>
            </span>
            <span className="hp-sec-title">{sec.label}</span>
            <span className="hp-sec-desc">{sec.desc}</span>
            {sec.total > 0 && sec.played > 0 && (
              <span className="hp-sec-progress">
                <span className="hp-sec-bar"><span style={{ width: `${(sec.played / sec.total) * 100}%` }} /></span>
                <span className="hp-sec-played">{t('{played}/{n} played', { played: sec.played, n: sec.total })}</span>
              </span>
            )}
          </button>
        ))}
      </section>

      {/* ── Personal strip ── */}
      {!isNew && (
      <section className="hp-strip">
        <div className={`hp-card hp-daily${dailyOpen ? ' open' : ''}${dailyDone === daily.length ? ' all-done' : ''}`}>
          <button className="hp-daily-head" onClick={() => setDailyOpen(o => !o)} aria-expanded={dailyOpen}>
            <span className="hp-card-kicker">{t('Today\'s challenges')}</span>
            <span className="hp-card-title">{dailyDone === daily.length ? t('All done ✓') : t('{dailyDone}/{length} complete', { dailyDone: dailyDone, length: daily.length })}</span>
            <span className="hp-daily-bars">
              {daily.map(d => (
                <span key={d.id} className="hp-daily-bar">
                  <span style={{ width: `${Math.min(100, (d.value / d.target) * 100)}%` }} className={d.done ? 'done' : ''} />
                </span>
              ))}
            </span>
          </button>
          {dailyOpen && (
            <div className="hp-daily-list">
              {daily.map(d => (
                <button key={d.id} className={`hp-daily-item${d.done ? ' done' : ''}`} onClick={() => onSelectMode(d.mode)}>
                  <GameIcon id={d.mode} size={16} />
                  <span className="hp-daily-task">{d.task}</span>
                  <span className="hp-daily-count">{d.done ? '✓' : `${d.value}/${d.target}`}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <button className="hp-card" onClick={onProfile}>
          <span className="hp-card-kicker">🌡️ {feverTemp(level.level)} · {levelTitle(level.level)}</span>
          <span className="hp-card-title">{xp.toLocaleString()} {t('XP')}</span>
          <span className="hp-xp"><span style={{ width: `${level.pct}%` }} /></span>
          <span className="hp-card-sub">{t('{v} XP to {temp}', { v: (level.next - xp).toLocaleString(), temp: feverTemp(level.level + 1) })}</span>
        </button>
      </section>
      )}

      {onOpenInfo && <InfoLinks onOpen={onOpenInfo} />}
    </div>
  )
}
