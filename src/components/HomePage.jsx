import { useEffect, useMemo, useState } from 'react'
import { QUIZ_ITEMS, QuizTile, summarize, timeAgo } from './QuizHub'
import { useAuth } from '../auth/AuthContext'
import { loadResults, subscribeResults } from '../utils/results'
import { levelForXp, levelTitle, computeXp } from '../utils/profileData'
import { gameMeta } from '../utils/gameCatalog'
import { DAILY_CHALLENGES, getChallengeProgress } from '../utils/dailyChallenges'
import DailyBanner from './DailyBanner'
import { t } from '../i18n'

import { GLOBE_ROWS as ROWS } from '../utils/gameRegistry'

const ALL_PLAYABLE = [...ROWS.flatMap(r => r.items.map(i => i.id)), ...QUIZ_ITEMS.map(q => q.id)]

function useResults() {
  const [results, setResults] = useState(loadResults)
  useEffect(() => subscribeResults(() => setResults(loadResults())), [])
  return results
}

export default function HomePage({ onEnter, onSelectMode, onEnterQuiz, onProfile, onDailyQuiz, countryNames = [], dailyProgress = {}, dailyStreak = 0 }) {
  const auth = useAuth()
  const results = useResults()
  const stats = useMemo(() => summarize(results), [results])
  const [dailyOpen, setDailyOpen] = useState(false)

  const xp = useMemo(() => computeXp(results), [results])
  const level = levelForXp(xp)
  const name = auth.profile?.username
  const isNew = results.length === 0

  const last = results[0] ? { result: results[0], meta: gameMeta(results[0].mode) } : null
  const recent = useMemo(() => {
    const out = []
    for (const r of results) { if (!out.includes(r.mode) && r.mode !== 'daily-quiz') out.push(r.mode); if (out.length >= 4) break }
    return out
  }, [results])

  const daily = DAILY_CHALLENGES.map(ch => ({ ...ch, ...getChallengeProgress(ch.id, dailyProgress) }))
  const dailyDone = daily.filter(d => d.done).length
  const mysteryDone = daily.find(d => d.id === 'mystery')?.done

  const quizPlayed = QUIZ_ITEMS.filter(q => stats[q.id]).length

  const quickPlay = () => onSelectMode(ALL_PLAYABLE[Math.floor(Math.random() * ALL_PLAYABLE.length)])

  return (
    <div className="home-overlay hp">
      {/* ── Hero ── */}
      <section className="hp-hero">
        <div className="hp-hero-text">
          <p className="hp-greet">
            {name ? t('Welcome back, {name}', { name: name }) : isNew ? t('Welcome to Orbis') : t('Welcome back, explorer')}
            {dailyStreak > 0 && <span className="hp-greet-streak">🔥 {dailyStreak} {t('day')}{dailyStreak === 1 ? '' : 's'}</span>}
          </p>
          <h1 className="hp-title">{t('How well do you')}<br /><span>{t('know the world?')}</span></h1>
          <p className="hp-tagline">
            {ALL_PLAYABLE.length} {t('geography games on a living globe — flags, capitals, borders, rivers and more.')}
          </p>
          <div className="hp-ctas">
            <button className="hp-cta-primary" onClick={() => onSelectMode('mystery')}>
              {mysteryDone ? t('✓ Daily mystery solved — play again') : t('🔍 Today\'s mystery country')}
            </button>
            <button className="hp-cta-secondary" onClick={quickPlay}>{t('🎲 Quick play')}</button>
            <button className="hp-cta-ghost" onClick={onEnter}>{t('Explore globe →')}</button>
          </div>
        </div>
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
            <span className="hp-card-sub">{t('Guess a country, get a distance hint, narrow it down. Takes a minute.')}</span>
          </button>
        ) : (
          <div className="hp-card hp-continue">
            <button className="hp-continue-main" onClick={() => onSelectMode(last.result.mode)}>
              <span className="hp-card-kicker">{t('Jump back in')}</span>
              <span className="hp-card-title">{last.meta.icon} {last.meta.label}</span>
              <span className="hp-card-sub">
                {last.result.correct}/{last.result.total} {t('correct ·')} {timeAgo(last.result.played_at)}
              </span>
            </button>
            {recent.length > 1 && (
              <div className="hp-continue-more">
                {recent.slice(1).map(m => {
                  const meta = gameMeta(m)
                  return <button key={m} className="hp-continue-chip" onClick={() => onSelectMode(m)} title={meta.label}>{meta.icon} {meta.label}</button>
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
                  <span>{d.icon}</span>
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

      {/* ── Globe game rows ── */}
      {ROWS.map((row, ri) => {
        const played = row.items.filter(i => stats[i.id]).length
        return (
          <section key={row.id} className="hp-row qh-section" style={{ '--cat': row.color, animationDelay: `${0.1 + ri * 0.08}s` }}>
            <div className="qh-section-head">
              <span className="qh-section-icon">{row.icon}</span>
              <h2>{row.label}</h2>
              <span className="qh-section-count">{played}/{row.items.length}</span>
            </div>
            <div className="qh-grid">
              {row.items.map(it => <QuizTile key={it.id} item={it} st={stats[it.id]} onSelect={onSelectMode} />)}
            </div>
          </section>
        )
      })}

      {/* ── Quiz Hub + Learn ── */}
      <section className="hp-bottom">
        <button className="hp-banner hp-banner-quiz" onClick={onEnterQuiz}>
          <span className="hp-banner-icon">🎯</span>
          <span className="hp-banner-body">
            <span className="hp-banner-title">{t('Quiz Hub')}</span>
            <span className="hp-banner-sub">{QUIZ_ITEMS.length} {t('quizzes, no globe needed ·')} {quizPlayed}/{QUIZ_ITEMS.length} {t('played')}</span>
            <span className="hp-banner-bar"><span style={{ width: `${(quizPlayed / QUIZ_ITEMS.length) * 100}%` }} /></span>
          </span>
          <span className="hp-banner-cta">{t('Open ▸')}</span>
        </button>
        <button className="hp-banner hp-banner-learn" onClick={() => onSelectMode('learn')}>
          <span className="hp-banner-icon">🎓</span>
          <span className="hp-banner-body">
            <span className="hp-banner-title">{t('Learn mode')}</span>
            <span className="hp-banner-sub">{t('Click any country on the globe to see its facts')}</span>
          </span>
          <span className="hp-banner-cta">{t('Explore ▸')}</span>
        </button>
      </section>
    </div>
  )
}
