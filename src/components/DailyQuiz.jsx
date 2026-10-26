import { useEffect, useMemo, useState } from 'react'
import TableQuiz from './TableQuiz'
import { dailyNumber, dailyQuizFor, msToNextDaily, dailyShareText, utcDayStartISO } from '../quizzes/daily'
import { loadResults, subscribeResults, fetchLeaderboard } from '../utils/results'
import { useAuth } from '../auth/AuthContext'

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
      <div className="dq-lb-head">🏆 Today's leaderboard</div>
      {!user && <div className="dq-lb-hint"><button onClick={openAuth}>Sign in</button> to appear on it.</div>}
      {rows === null ? <div className="dq-lb-empty">Loading…</div>
        : rows.length === 0 ? <div className="dq-lb-empty">No scores yet today — be the first!</div>
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

function ResultCard({ info, res, streak, onPractice }) {
  const [copied, setCopied] = useState(false)
  const left = useCountdown()
  const text = dailyShareText(info, res)
  const pct = res.total ? Math.round((res.score / res.total) * 100) : 0
  const share = async () => {
    try {
      if (navigator.share && /Mobi|Android/i.test(navigator.userAgent)) await navigator.share({ text })
      else { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000) }
    } catch { /* cancelled */ }
  }
  return (
    <div className="dq-result">
      <div className="dq-result-top">
        <div className="dq-result-score">
          <span className="dq-big">{res.score}<small>/{res.total}</small></span>
          <span className="dq-sub">{pct}% · ⏱ {fmtTime(res.durationMs)}{streak > 1 ? ` · 🔥 ${streak}-day streak` : ''}</span>
        </div>
        <div className="dq-result-btns">
          <button className="tq-btn tq-btn-primary" onClick={share}>{copied ? '✅ Copied!' : '📋 Share result'}</button>
          <button className="tq-btn" onClick={onPractice}>Practice this quiz</button>
        </div>
      </div>
      <pre className="dq-share-preview">{text}</pre>
      <div className="dq-next">Next daily quiz in <strong>{fmtClock(left)}</strong></div>
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
    onFinish: (res) => setJustFinished(res),
    renderResult: (res) => (
      <ResultCard info={info} res={res} streak={dailyStreak(loadResults(), today)} onPractice={() => onPlayQuiz(info.quizId)} />
    ),
  }), [info, today, onPlayQuiz])

  if (!info) return <div className="game-intro-wait">Loading today's quiz…</div>

  // Playing (or just finished — TableQuiz shows the table + our result card)
  if (playing || justFinished) {
    return <TableQuiz quizId={info.quizId} countryNames={countryNames} daily={daily} />
  }

  // Already played today
  if (previous) {
    const res = { score: previous.correct, total: previous.total, durationMs: previous.duration_ms }
    return (
      <div className="dq">
        <DailyHeader info={info} streak={streak} />
        <div className="dq-done-note">You've played today's quiz{previous.completed ? '' : ' (you left before the end)'}. Come back tomorrow for a new one!</div>
        <ResultCard info={info} res={res} streak={streak} onPractice={() => onPlayQuiz(info.quizId)} />
      </div>
    )
  }

  // Intro
  return (
    <div className="dq">
      <DailyHeader info={info} streak={streak} />
      <div className="dq-intro">
        <span className="dq-intro-icon">{info.icon}</span>
        <h2>{info.title}{info.region !== 'World' && <span> · {info.region}</span>}</h2>
        <p>{info.prompt}</p>
        <div className="dq-facts">
          <span>📋 {info.size} answers</span>
          <span>🎯 One attempt</span>
          <span>🌍 Same quiz for everyone</span>
        </div>
        <button className="dq-start" onClick={() => setPlaying(true)}>▶ Start daily #{info.day}</button>
        <span className="dq-warn">Leaving mid-game counts as your attempt.</span>
      </div>
    </div>
  )
}

function DailyHeader({ info, streak }) {
  return (
    <div className="dq-header">
      <span className="dq-badge">📅 Daily #{info.day}</span>
      <span className="dq-date">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
      {streak > 0 && <span className="dq-streak">🔥 {streak}</span>}
    </div>
  )
}
