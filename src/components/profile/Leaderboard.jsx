import { useEffect, useState } from 'react'
import { fetchLeaderboard, fetchWeeklyBoard } from '../../utils/results'
import { GAME_CATALOG, CAT_LABELS } from '../../utils/gameCatalog'
import { useAuth } from '../../auth/AuthContext'
import { t, locale } from '../../i18n'
import StateNote from '../StateNote'

const PERIODS = [
  { id: 'today', label: t('Today') },
  { id: 'week',  label: t('This week') },
  { id: 'all',   label: t('All time') },
]

function fmtTime(ms) {
  if (ms == null) return '—'
  const s = Math.round(ms / 1000)
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

/** Time left until Monday 00:00 UTC, when the weekly board starts over. */
function untilMonday() {
  const now = new Date()
  const next = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + ((8 - now.getUTCDay()) % 7 || 7)))
  const h = Math.max(0, Math.floor((next - now) / 3_600_000))
  return { d: Math.floor(h / 24), h: h % 24 }
}

function Player({ r }) {
  return (
    <span className="lb-player">
      {r.avatar_url
        ? <img src={r.avatar_url} alt="" referrerPolicy="no-referrer" />
        : <span className="lb-avatar-letter">{r.username.charAt(0).toUpperCase()}</span>}
      {r.username}
    </span>
  )
}

/** Everyone's points this week across all games; starts over every Monday. */
function WeeklyBoard() {
  const { user, openAuth } = useAuth()
  const [rows, setRows] = useState([])
  const [state, setState] = useState('loading') // loading | idle | error | missing
  const [tries, setTries] = useState(0)
  useEffect(() => {
    let live = true
    setState('loading')
    fetchWeeklyBoard(50).then(({ rows, error, missing }) => {
      if (!live) return
      setRows(rows)
      setState(missing ? 'missing' : error ? 'error' : 'idle')
    })
    return () => { live = false }
  }, [tries])
  const left = untilMonday()
  const me = rows.find(r => r.user_id === user?.id)
  return (
    <div className="lb-weekly">
      <div className="lb-weekly-head">
        <div>
          <h3>{t('Fever of the week')}</h3>
          <p>{t('Points from every game you play: 2 per correct answer, 15 per finished game.')}</p>
        </div>
        <span className="lb-reset">{t('Starts over in {d}d {h}h', left)}</span>
      </div>
      {!user && <div className="lb-signin-hint">{t('You\'re not on the board yet.')} <button onClick={openAuth}>{t('Sign in')}</button> {t('to submit your scores.')}</div>}
      {user && me && <div className="lb-me-line">{t('You are #{rank} this week with {points} points', { rank: me.rank, points: Number(me.points).toLocaleString(locale) })}</div>}
      {state === 'loading' && <StateNote kind="loading" compact>{t('Loading…')}</StateNote>}
      {state === 'missing' && <StateNote compact>{t('The weekly board will appear here soon.')}</StateNote>}
      {state === 'error' && <StateNote kind="error" compact action={{ label: t('Try again'), onClick: () => setTries(n => n + 1) }}>{t('Couldn\'t load the leaderboard. Try again in a moment.')}</StateNote>}
      {state === 'idle' && rows.length === 0 && <StateNote compact>{t('Nobody has played this week yet. The top spot is yours for the taking!')}</StateNote>}
      {state === 'idle' && rows.length > 0 && (
        <div className="lb-table">
          <div className="lb-row lb-header"><span>#</span><span>{t('Player')}</span><span>{t('Points')}</span><span>{t('Games')}</span></div>
          {rows.map(r => (
            <div key={r.user_id} className={`lb-row${r.user_id === user?.id ? ' lb-me' : ''}${r.rank <= 3 ? ` lb-top${r.rank}` : ''}`}>
              <span className="lb-rank">{r.rank <= 3 ? ['🥇', '🥈', '🥉'][r.rank - 1] : r.rank}</span>
              <Player r={r} />
              <span className="lb-score">{Number(r.points).toLocaleString(locale)}</span>
              <span className="lb-extra">{Number(r.games).toLocaleString(locale)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function Leaderboard({ initialMode = 'flag' }) {
  const { backendEnabled } = useAuth()
  const [view, setView] = useState('week')
  if (!backendEnabled) {
    return <StateNote>{t('Leaderboards need the online backend — it isn\'t configured yet.')}</StateNote>
  }
  return (
    <>
      <div className="lb-views">
        <button className={`lb-view${view === 'week' ? ' active' : ''}`} onClick={() => setView('week')}>{t('Fever of the week')}</button>
        <button className={`lb-view${view === 'games' ? ' active' : ''}`} onClick={() => setView('games')}>{t('By game')}</button>
      </div>
      {view === 'week' ? <WeeklyBoard /> : <GameBoard initialMode={initialMode} />}
    </>
  )
}

function GameBoard({ initialMode }) {
  const { user, backendEnabled, openAuth } = useAuth()
  const [mode,   setMode]   = useState(initialMode)
  const [period, setPeriod] = useState('week')
  const [rows,   setRows]   = useState([])
  const [state,  setState]  = useState('idle') // idle | loading | error
  const [tries,  setTries]  = useState(0)

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
  }, [mode, period, backendEnabled, tries])

  if (!backendEnabled) {
    return <StateNote>{t('Leaderboards need the online backend — it isn\'t configured yet.')}</StateNote>
  }

  const timed = GAME_CATALOG[mode]?.timed
  const unit = GAME_CATALOG[mode]?.unit
  const isQuiz = GAME_CATALOG[mode]?.cat === 'quiz' && !unit
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
          {t('You\'re not on the board yet.')} <button onClick={openAuth}>{t('Sign in')}</button> {t('to submit your scores.')}
        </div>
      )}

      {state === 'loading' && <StateNote kind="loading" compact>{t('Loading…')}</StateNote>}
      {state === 'error'   && <StateNote kind="error" compact action={{ label: t('Try again'), onClick: () => setTries(n => n + 1) }}>{t('Couldn\'t load the leaderboard. Try again in a moment.')}</StateNote>}
      {state === 'idle' && rows.length === 0 && <StateNote compact>{t('No scores yet — be the first!')}</StateNote>}

      {state === 'idle' && rows.length > 0 && (
        <div className="lb-table">
          <div className="lb-row lb-header">
            <span>#</span><span>{t('Player')}</span><span>{unit ?? (isQuiz ? t('Correct') : t('Score'))}</span>
            <span>{timed ? t('Time') : t('Accuracy')}</span>
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
