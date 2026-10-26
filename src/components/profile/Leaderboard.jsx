import { useEffect, useState } from 'react'
import { fetchLeaderboard } from '../../utils/results'
import { GAME_CATALOG, CAT_LABELS } from '../../utils/gameCatalog'
import { useAuth } from '../../auth/AuthContext'

const PERIODS = [
  { id: 'today', label: 'Today' },
  { id: 'week',  label: 'This week' },
  { id: 'all',   label: 'All time' },
]

function fmtTime(ms) {
  if (ms == null) return '—'
  const s = Math.round(ms / 1000)
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

export default function Leaderboard({ initialMode = 'flag' }) {
  const { user, backendEnabled, openAuth } = useAuth()
  const [mode,   setMode]   = useState(initialMode)
  const [period, setPeriod] = useState('week')
  const [rows,   setRows]   = useState([])
  const [state,  setState]  = useState('idle') // idle | loading | error

  useEffect(() => {
    if (!backendEnabled) return
    let live = true
    setState('loading')
    fetchLeaderboard(mode, period).then(({ rows, error }) => {
      if (!live) return
      setRows(rows)
      setState(error ? 'error' : 'idle')
    })
    return () => { live = false }
  }, [mode, period, backendEnabled])

  if (!backendEnabled) {
    return <div className="lb-empty">Leaderboards need the online backend — it isn't configured yet.</div>
  }

  const timed = GAME_CATALOG[mode]?.timed
  const isQuiz = GAME_CATALOG[mode]?.cat === 'quiz'
  const groups = Object.entries(CAT_LABELS).map(([cat, label]) => ({
    label, items: Object.entries(GAME_CATALOG).filter(([, g]) => g.cat === cat),
  }))

  return (
    <div className="lb-wrap">
      <div className="lb-controls">
        <select className="lb-select" value={mode} onChange={e => setMode(e.target.value)}>
          {groups.map(g => (
            <optgroup key={g.label} label={g.label}>
              {g.items.map(([id, gm]) => <option key={id} value={id}>{gm.icon} {gm.label}</option>)}
            </optgroup>
          ))}
        </select>
        <div className="lb-periods">
          {PERIODS.map(p => (
            <button key={p.id} className={`lb-period${period === p.id ? ' active' : ''}`} onClick={() => setPeriod(p.id)}>
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {!user && (
        <div className="lb-signin-hint">
          You're not on the board yet. <button onClick={openAuth}>Sign in</button> to submit your scores.
        </div>
      )}

      {state === 'loading' && <div className="lb-empty">Loading…</div>}
      {state === 'error'   && <div className="lb-empty">Couldn't load the leaderboard. Try again in a moment.</div>}
      {state === 'idle' && rows.length === 0 && <div className="lb-empty">No scores yet — be the first!</div>}

      {state === 'idle' && rows.length > 0 && (
        <div className="lb-table">
          <div className="lb-row lb-header">
            <span>#</span><span>Player</span><span>{isQuiz ? "Correct" : "Score"}</span>
            <span>{timed ? 'Time' : 'Accuracy'}</span>
          </div>
          {rows.map(r => (
            <div key={r.user_id} className={`lb-row${r.user_id === user?.id ? ' lb-me' : ''}${r.rank <= 3 ? ` lb-top${r.rank}` : ''}`}>
              <span className="lb-rank">{r.rank <= 3 ? ['🥇', '🥈', '🥉'][r.rank - 1] : r.rank}</span>
              <span className="lb-player">
                {r.avatar_url
                  ? <img src={r.avatar_url} alt="" referrerPolicy="no-referrer" />
                  : <span className="lb-avatar-letter">{r.username.charAt(0).toUpperCase()}</span>}
                {r.username}
              </span>
              <span className="lb-score">{isQuiz ? `${r.correct}/${r.total}` : r.score.toLocaleString()}</span>
              <span className="lb-extra">
                {timed ? fmtTime(r.duration_ms) : r.total ? `${Math.round((r.correct / r.total) * 100)}%` : '—'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
