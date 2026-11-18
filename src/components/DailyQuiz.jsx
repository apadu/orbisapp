import { useEffect, useMemo, useState } from 'react'
import TableQuiz from './TableQuiz'
import { dailyNumber, dailyQuizFor, msToNextDaily, dailyShareText, utcDayStartISO } from '../quizzes/daily'
import { loadResults, subscribeResults, fetchLeaderboard } from '../utils/results'
import { useAuth } from '../auth/AuthContext'
import { t, locale } from '../i18n'
import GameIcon from './GameIcon'
import { plain } from '../utils/plain'
import Icon from './Icon'
import { shareText } from '../utils/share'
import { supabase } from '../lib/supabase'
import StateNote from './StateNote'

function fmtClock(ms) {
  const s = Math.max(0, Math.floor(ms / 1000))
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60
  return `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
}
function fmtTime(ms) {
  const s = Math.round((ms ?? 0) / 1000)
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

function useResults() {
  const [results, setResults] = useState(loadResults)
  useEffect(() => subscribeResults(() => setResults(loadResults())), [])
  return results
}

function useCountdown() {
  const [left, setLeft] = useState(msToNextDaily())
  useEffect(() => {
    const t = setInterval(() => setLeft(msToNextDaily()), 1000)
    return () => clearInterval(t)
  }, [])
  return left
}

/** Consecutive days (ending today or yesterday) with a daily played. */
function dailyStreak(results, today) {
  const days = new Set(results.filter(r => r.mode === 'daily-quiz').map(r => r.details?.day))
  let d = days.has(today) ? today : today - 1
  let n = 0
  while (days.has(d)) { n++; d-- }
  return n
}

function DailyLeaderboard() {
  const { backendEnabled, user, openAuth } = useAuth()
  const [rows, setRows] = useState(null)
  useEffect(() => {
    if (!backendEnabled) return
    let live = true
    fetchLeaderboard('daily-quiz', 'all', utcDayStartISO()).then(({ rows }) => { if (live) setRows(rows) })
    return () => { live = false }
  }, [backendEnabled])

  if (!backendEnabled) return null
  return (
    <div className="dq-lb">
      <div className="dq-lb-head">{plain(t('🏆 Today\'s leaderboard'))}</div>
      {!user && <div className="dq-lb-hint"><button onClick={openAuth}>{t('Sign in')}</button> {t('to appear on it.')}</div>}
      {rows === null ? <StateNote kind="loading" compact>{t('Loading…')}</StateNote>
        : rows.length === 0 ? <StateNote compact>{t('No scores yet today — be the first!')}</StateNote>
        : rows.slice(0, 10).map(r => (
          <div key={r.user_id} className={`dq-lb-row${r.user_id === user?.id ? ' me' : ''}`}>
            <span className="dq-lb-rank">{r.rank <= 3 ? ['🥇', '🥈', '🥉'][r.rank - 1] : r.rank}</span>
            <span className="dq-lb-name">{r.username}</span>
            <span className="dq-lb-score">{r.correct}/{r.total}</span>
            <span className="dq-lb-time">{fmtTime(r.duration_ms)}</span>
          </div>
        ))}
    </div>
  )
}

/**
 * "Better than 64% of today's players": everyone plays the same daily, so the comparison is exact.
 * The round is counted once per device and day (quiz_plays, see supabase/quiz_stats.sql).
 */
function DailyRank({ day, score, total, record }) {
  const [stats, setStats] = useState(null)
  useEffect(() => {
    if (!supabase || !total) return
    let alive = true
    const variant = `day-${day}`
    const flag = `orbis-dq-counted-${day}`
    ;(async () => {
      let counted = false
      try { counted = localStorage.getItem(flag) === '1' } catch { /* private mode */ }
      if (record && !counted) {
        const { error } = await supabase.from('quiz_plays').insert({ mode: 'daily-quiz', variant, correct: score, total })
        if (!error) { try { localStorage.setItem(flag, '1') } catch { /* private mode */ } counted = true }
      }
      const { data, error } = await supabase.rpc('quiz_stats', { p_mode: 'daily-quiz', p_variant: variant, p_correct: score, p_total: total })
      if (alive && !error && data) setStats({ ...data, others: data.plays - (counted ? 1 : 0) })
    })()
    return () => { alive = false }
  }, [day, score, total, record])
  if (!stats) return null
  return (
    <div className="dq-rank">
      {stats.others > 0
        ? <>{t('Better than {p}% of today\'s players', { p: Math.round((stats.below / stats.others) * 100) })} <span className="dq-rank-sub">· {t(stats.plays === 1 ? '{n} player today' : '{n} players today', { n: stats.plays })}{stats.avg_pct != null && <> · {t('average {p}%', { p: stats.avg_pct })}</>}</span></>
        : t('You\'re the first to play today\'s quiz!')}
    </div>
  )
}

function ResultCard({ info, res, streak, onPractice, record = false }) {
  const [copied, setCopied] = useState(false)
  const left = useCountdown()
  const text = dailyShareText(info, res)
  const pct = res.total ? Math.round((res.score / res.total) * 100) : 0
  const share = async () => {
    try {
      if (await shareText(text) === 'copied') { setCopied(true); setTimeout(() => setCopied(false), 2000) }
    } catch { /* cancelled */ }
  }
  return (
    <div className="dq-result">
      <div className="dq-result-top">
        <div className="dq-result-score">
          <span className="dq-big">{res.score}<small>/{res.total}</small></span>
          <span className="dq-sub">{pct}% · ⏱ {fmtTime(res.durationMs)}{streak > 1 ? t(' · 🔥 {streak}-day streak', { streak: streak }) : ''}</span>
        </div>
        <div className="dq-result-btns">
          <button className="tq-btn tq-btn-primary" onClick={share}>{copied ? plain(t('✅ Copied!')) : plain(t('📋 Share result'))}</button>
          <button className="tq-btn" onClick={onPractice}>{t('Practice this quiz')}</button>
        </div>
      </div>
      <DailyRank day={info.day} score={res.score} total={res.total} record={record} />
      <pre className="dq-share-preview">{text}</pre>
      <div className="dq-next">{t('Next daily quiz in')} <strong>{fmtClock(left)}</strong></div>
      <DailyLeaderboard />
    </div>
  )
}

export default function DailyQuiz({ countryNames, onPlayQuiz }) {
  const results = useResults()
  const today = dailyNumber()
  const info = useMemo(() => dailyQuizFor(today, countryNames), [today, countryNames])
  const [playing, setPlaying] = useState(false)
  const [justFinished, setJustFinished] = useState(null)

  const previous = results.find(r => r.mode === 'daily-quiz' && r.details?.day === today)
  const streak = dailyStreak(results, today)

  const daily = useMemo(() => info && ({
    day: info.day, region: info.region, size: info.size, seed: info.seed,
    onStart: () => setPlaying(true),
    onFinish: (res) => setJustFinished(res),
    renderResult: (res) => (
      <ResultCard info={info} res={res} streak={dailyStreak(loadResults(), today)} onPractice={() => onPlayQuiz(info.quizId)} record />
    ),
  }), [info, today, onPlayQuiz])

  if (!info) return <StateNote kind="loading">{t('Loading today\'s quiz…')}</StateNote>

  // Already played today (and not the round that just ended)
  if (previous && !playing && !justFinished) {
    const res = { score: previous.correct, total: previous.total, durationMs: previous.duration_ms }
    return (
      <div className="dq">
        <DailyHeader info={info} streak={streak} />
        <div className="dq-done-note">{t('You\'ve played today\'s quiz')}{previous.completed ? '' : t(' (you left before the end)')}{t('. Come back tomorrow for a new one!')}</div>
        <ResultCard info={info} res={res} streak={streak} onPractice={() => onPlayQuiz(info.quizId)} />
      </div>
    )
  }

  // Board first, like every other quiz — Start / typing begins it
  return (
    <div className="dq dq-board">
      <DailyHeader info={info} streak={streak} />
      <TableQuiz quizId={info.quizId} countryNames={countryNames} daily={daily} />
    </div>
  )
}

function DailyHeader({ info, streak }) {
  return (
    <div className="dq-header">
      <span className="dq-badge">{plain(t('📅 Daily #'))}{info.day}</span>
      <span className="dq-date">{new Date().toLocaleDateString(locale, { weekday: 'long', month: 'long', day: 'numeric' })}</span>
      {streak > 0 && <span className="dq-streak"><Icon name="flame" size={15} /> {streak}</span>}
    </div>
  )
}
