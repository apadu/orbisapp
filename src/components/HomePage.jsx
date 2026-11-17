import { useEffect, useMemo, useState } from 'react'
import { QUIZ_ITEMS, QuizTile, summarize, timeAgo } from './QuizHub'
import { COUNTRY_PAGE_IDS } from '../data/countryPages'
import { useAuth } from '../auth/AuthContext'
import { loadResults, subscribeResults } from '../utils/results'
import { levelForXp, levelTitle, computeXp } from '../utils/profileData'
import { gameMeta } from '../utils/gameCatalog'
import { useDailyChallenges } from '../utils/useDailyChallenges'
import DailyBanner from './DailyBanner'
import Icon, { SECTION_ICON } from './Icon'
import { InfoLinks } from './InfoPage'
import { t } from '../i18n'

import { GLOBE_ROWS as ROWS, GAME_GROUPS } from '../utils/gameRegistry'
import GameIcon from './GameIcon'

const ALL_PLAYABLE = [...ROWS.flatMap(r => r.items.map(i => i.id)), ...QUIZ_ITEMS.map(q => q.id)]

function useResults() {
  const [results, setResults] = useState(loadResults)
  useEffect(() => subscribeResults(() => setResults(loadResults())), [])
  return results
}

export default function HomePage({ onEnter, onSelectMode, onProfile, onDailyQuiz, onOpenInfo, countryNames = [] }) {
  const { list: daily, streak: dailyStreak } = useDailyChallenges()
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

  const last = results[0] ? { result: results[0], meta: gameMeta(results[0].mode) } : null
  const recent = useMemo(() => {
    const out = []
    for (const r of results) { if (!out.includes(r.mode) && r.mode !== 'daily-quiz') out.push(r.mode); if (out.length >= 4) break }
    return out
  }, [results])

  const dailyDone = daily.filter(d => d.done).length
  const mysteryDone = useMemo(() => {
    const today = new Date().toDateString()
    return results.some(r => r.mode === 'mystery' && r.correct > 0 && !r.details?.practice && new Date(r.played_at).toDateString() === today)
  }, [results])


  const quickPlay = () => onSelectMode(ALL_PLAYABLE[Math.floor(Math.random() * ALL_PLAYABLE.length)])

  return (
    <div className="home-overlay hp">
      {/* ── Hero ── */}
      <section className="hp-hero">
        <div className="hp-hero-text">
          <p className="hp-greet">
            {name ? t('Welcome back, {name}', { name: name }) : isNew ? t('Welcome to Orbis') : t('Welcome back, explorer')}
            {dailyStreak > 0 && <span className="hp-greet-streak"><Icon name="flame" size={14} /> {dailyStreak} {t('day')}{dailyStreak === 1 ? '' : 's'}</span>}
          </p>
          <h1 className="hp-title">{t('How well do you')}<br /><span>{t('know the world?')}</span></h1>
          <p className="hp-tagline">
            {ALL_PLAYABLE.length} {t('geography games on a spinning globe — from flags you know to capitals you\'ve never heard of.')}
          </p>
          <div className="hp-ctas">
            <button className="hp-cta-primary" onClick={() => onSelectMode('mystery')}>
              {mysteryDone ? <><Icon name="check" size={18} /> {t('Daily mystery solved — play again')}</> : <>{t('Today\'s mystery country')} <Icon name="arrow" size={18} /></>}
            </button>
            <button className="hp-cta-secondary" onClick={quickPlay}><Icon name="dice" size={18} /> {t('Quick play')}</button>
            <button className="hp-cta-ghost" onClick={onEnter}>{t('Explore globe →')}</button>
          </div>
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
            {sec.total > 0 && (
              <span className="hp-sec-progress">
                <span className="hp-sec-bar"><span style={{ width: `${(sec.played / sec.total) * 100}%` }} /></span>
                <span className="hp-sec-played">{t('{played}/{n} played', { played: sec.played, n: sec.total })}</span>
              </span>
            )}
          </button>
        ))}
      </section>

      {/* ── Quiz of the day ── */}
      <section className="hp-daily-quiz">
        <DailyBanner countryNames={countryNames} onOpen={onDailyQuiz} />
      </section>

      {/* ── Personal strip ── */}
      <section className="hp-strip">
        {isNew ? (
          <button className="hp-card hp-card-wide" onClick={() => onSelectMode('mystery')}>
            <span className="hp-card-kicker">{t('New here?')}</span>
            <span className="hp-card-title">{t('Start with Mystery Country')}</span>
            <span className="hp-card-sub">{t('One hidden country. Every guess tells you how far off you are and which way to go.')}</span>
          </button>
        ) : (
          <div className="hp-card hp-continue">
            <button className="hp-continue-main" onClick={() => onSelectMode(last.result.mode)}>
              <span className="hp-card-kicker">{t('Jump back in')}</span>
              <span className="hp-card-title"><GameIcon id={last.result.mode} size={20} /> {last.meta.label}</span>
              <span className="hp-card-sub">
                {last.result.correct}/{last.result.total} {t('correct ·')} {timeAgo(last.result.played_at)}
              </span>
            </button>
            {recent.length > 1 && (
              <div className="hp-continue-more">
                {recent.slice(1).map(m => {
                  const meta = gameMeta(m)
                  return <button key={m} className="hp-continue-chip" onClick={() => onSelectMode(m)} title={meta.label}><GameIcon id={m} size={15} /> {meta.label}</button>
                })}
              </div>
            )}
          </div>
        )}

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
          <span className="hp-card-kicker">{t('Level')} {level.level} · {levelTitle(level.level)}</span>
          <span className="hp-card-title">{xp.toLocaleString()} {t('XP')}</span>
          <span className="hp-xp"><span style={{ width: `${level.pct}%` }} /></span>
          <span className="hp-card-sub">{(level.next - xp).toLocaleString()} {t('XP to level')} {level.level + 1}</span>
        </button>
      </section>

      {/* ── Learn ── */}
      <section className="hp-bottom hp-bottom-single">
        <button className="hp-banner hp-banner-learn" onClick={() => onSelectMode('learn')}>
          <span className="hp-banner-icon"><Icon name="book" size={30} strokeWidth={1.4} /></span>
          <span className="hp-banner-body">
            <span className="hp-banner-title">{t('Learn mode')}</span>
            <span className="hp-banner-sub">{t('Spin the globe, click a country, learn something you didn\'t know.')}</span>
          </span>
          <span className="hp-banner-cta">{t('Explore ▸')}</span>
        </button>
      </section>

      {onOpenInfo && <InfoLinks onOpen={onOpenInfo} />}
    </div>
  )
}
