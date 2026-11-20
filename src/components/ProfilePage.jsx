import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../auth/AuthContext'
import { loadResults, subscribeResults } from '../utils/results'
import { computeProfile, levelTitle, feverTemp } from '../utils/profileData'
import { GAME_CATALOG, gameMeta } from '../utils/gameCatalog'
import { useDailyChallenges } from '../utils/useDailyChallenges'
import Leaderboard from './profile/Leaderboard'
import { t, locale, lang, LANGS, setLang } from '../i18n'
import GameIcon from './GameIcon'
import { plain } from '../utils/plain'
import Icon from './Icon'
import StateNote from './StateNote'

// ── helpers ────────────────────────────────────────────────────────────────
function useResults() {
  const [results, setResults] = useState(loadResults)
  useEffect(() => subscribeResults(() => setResults(loadResults())), [])
  return results
}

function fmtDuration(ms) {
  if (ms == null) return '—'
  const s = Math.round(ms / 1000)
  if (s >= 3600) return `${Math.floor(s / 3600)}h ${Math.floor((s % 3600) / 60)}m`
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

function fmtHours(ms) {
  const m = Math.round(ms / 60000)
  return m >= 60 ? `${Math.floor(m / 60)}h ${m % 60}m` : `${m}m`
}

function timeAgo(iso) {
  const s = (Date.now() - new Date(iso)) / 1000
  if (s < 60) return t('just now')
  if (s < 3600) return t('{v}m ago', { v: Math.floor(s / 60) })
  if (s < 86400) return t('{v}h ago', { v: Math.floor(s / 3600) })
  if (s < 2 * 86400) return t('yesterday')
  if (s < 7 * 86400) return t('{v}d ago', { v: Math.floor(s / 86400) })
  return new Date(iso).toLocaleDateString(locale, { month: 'short', day: 'numeric' })
}

const TABS = [
  { id: 'overview',     label: t('Overview') },
  { id: 'games',        label: t('My games') },
  { id: 'achievements', label: t('Achievements') },
  { id: 'leaderboards', label: t('Leaderboards') },
]

const isQuiz = (mode) => (GAME_CATALOG[mode]?.cat ?? 'quiz') === 'quiz'
const scoreText = (mode, r) => (r ? (isQuiz(mode) ? `${r.correct}/${r.total}` : r.score.toLocaleString(locale)) : '—')

// ── Page ───────────────────────────────────────────────────────────────────
export default function ProfilePage({ onBack, onPlay }) {
  const auth = useAuth()
  const results = useResults()
  const p = useMemo(() => computeProfile(results), [results])
  const [tab, setTab] = useState('overview')
  const [settings, setSettings] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const username = auth.profile?.username ?? t('Guest')
  const joined = auth.profile?.created_at ?? results[results.length - 1]?.played_at
  const unlocked = p.achievements.filter(a => a.unlocked)

  return (
    <div className="profile-page pp">
      <button className="profile-back" onClick={onBack}>{t('← Back')}</button>

      {/* ── Header: who you are + level ── */}
      <section className="pp-hero">
        <div className="pp-avatar-wrap">
          {auth.profile?.avatar_url
            ? <img className="pp-avatar" src={auth.profile.avatar_url} alt="" referrerPolicy="no-referrer" />
            : <div className="pp-avatar pp-avatar-letter">{username.charAt(0).toUpperCase()}</div>}
          <span className="pp-level-badge pp-temp-badge">{feverTemp(p.level.level)}</span>
        </div>
        <div className="pp-hero-main">
          <div className="pp-name-row">
            <h1>{username}</h1>
            <span className="pp-hero-sub">
              {levelTitle(p.level.level)}
              {joined && <> · {t('since {when}', { when: new Date(joined).toLocaleDateString(locale, { month: 'long', year: 'numeric' }) })}</>}
            </span>
          </div>
          <div className="pp-xp">
            <div className="pp-xp-bar"><div className="pp-xp-fill" style={{ width: `${p.level.pct}%` }} /></div>
            <span className="pp-xp-label">{t('{temp} · {n} XP to {next}', { temp: feverTemp(p.level.level), n: (p.level.next - p.xp).toLocaleString(locale), next: feverTemp(p.level.level + 1) })}</span>
          </div>
        </div>
        {auth.user
          ? <button className="pp-account-btn" onClick={() => setSettings(true)}><Icon name="user" size={16} /> {t('Account')}</button>
          : auth.backendEnabled && <button className="pp-account-btn pp-account-cta" onClick={auth.openAuth}>{t('Sign in to save your progress')}</button>}
      </section>

      {/* ── Key numbers ── */}
      <section className="pp-stats">
        <div className="pp-stat"><span className="pp-stat-label">{t('Games played')}</span><span className="pp-stat-num">{p.totals.games.toLocaleString(locale)}</span></div>
        <div className="pp-stat"><span className="pp-stat-label">{t('Correct answers')}</span><span className="pp-stat-num">{p.totals.correct.toLocaleString(locale)}</span></div>
        <div className="pp-stat"><span className="pp-stat-label">{t('Time played')}</span><span className="pp-stat-num">{fmtHours(p.totals.timeMs)}</span></div>
        <div className="pp-stat"><span className="pp-stat-label">{t('Fever streak')}</span><span className="pp-stat-num">{t(p.streak.current === 1 ? '{n} day' : '{n} days', { n: p.streak.current })}</span></div>
      </section>

      {/* ── Tabs ── */}
      <nav className="pp-tabs" role="tablist">
        {TABS.map(x => (
          <button key={x.id} role="tab" aria-selected={tab === x.id} className={`pp-tab${tab === x.id ? ' active' : ''}`} onClick={() => setTab(x.id)}>
            {x.label}
            {x.id === 'achievements' && <span className="pp-tab-count">{unlocked.length}/{p.achievements.length}</span>}
          </button>
        ))}
      </nav>

      {tab === 'overview'     && <Overview p={p} results={results} onPlay={onPlay} goTo={setTab} />}
      {tab === 'games'        && <GamesTab p={p} results={results} onPlay={onPlay} />}
      {tab === 'achievements' && <AchievementsTab p={p} />}
      {tab === 'leaderboards' && <Leaderboard initialMode={mostPlayed(p) ?? 'flag'} />}

      {settings && <AccountDialog auth={auth} username={username} onClose={() => setSettings(false)} onDelete={() => { setSettings(false); setDeleting(true) }} />}
      {deleting && <DeleteAccountDialog username={username} onCancel={() => setDeleting(false)} onDelete={auth.deleteAccount} onDone={() => { setDeleting(false); onBack() }} />}
    </div>
  )
}

/** Account settings: who you're signed in as, language, sign out — and, at the very bottom, deleting the account. */
function AccountDialog({ auth, username, onClose, onDelete }) {
  useEffect(() => {
    const esc = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', esc)
    return () => window.removeEventListener('keydown', esc)
  }, [onClose])
  return (
    <div className="cl-backdrop" onMouseDown={onClose}>
      <div className="cl pp-account" role="dialog" aria-modal="true" aria-label={t('Account')} onMouseDown={e => e.stopPropagation()}>
        <div className="pp-account-head">
          <h3>{t('Account')}</h3>
          <button className="pp-account-close" onClick={onClose} aria-label={t('Close')}>✕</button>
        </div>
        <div className="pp-account-rows">
          <div className="pp-account-row"><span>{t('Username')}</span><strong>{username}</strong></div>
          {auth.user?.email && <div className="pp-account-row"><span>{t('Email')}</span><strong>{auth.user.email}</strong></div>}
          <div className="pp-account-row">
            <span>{t('Language')}</span>
            <span className="pp-account-lang">
              {LANGS.map(l => <button key={l.id} className={lang === l.id ? 'active' : ''} onClick={() => { if (lang !== l.id) setLang(l.id) }}>{l.label}</button>)}
            </span>
          </div>
          <div className="pp-account-row"><span>{t('Sign out of this device')}</span><button className="tq-btn" onClick={() => { onClose(); auth.signOut() }}>{t('Sign out')}</button></div>
        </div>
        <details className="pp-account-danger">
          <summary>{t('Delete account')}</summary>
          <p>{t('Permanently deletes your account, username and all your saved games. This can\'t be undone.')}</p>
          <button className="pp-danger-link" onClick={onDelete}>{t('Delete my account…')}</button>
        </details>
      </div>
    </div>
  )
}

function DeleteAccountDialog({ username, onCancel, onDelete, onDone }) {
  const [typed, setTyped] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)
  const ok = typed.trim().toLowerCase() === username.toLowerCase()

  useEffect(() => {
    const esc = (e) => { if (e.key === 'Escape' && !busy) onCancel() }
    window.addEventListener('keydown', esc)
    return () => window.removeEventListener('keydown', esc)
  }, [busy, onCancel])

  const run = async () => {
    if (!ok || busy) return
    setBusy(true); setError(null)
    const { error: err } = await onDelete()
    setBusy(false)
    if (err) { setError(/delete_my_account|function|schema cache/i.test(err.message) ? t('Account deletion isn\'t set up on the server yet.') : err.message); return }
    onDone()
  }

  return (
    <div className="cl-backdrop" onMouseDown={() => !busy && onCancel()}>
      <div className="cl" role="alertdialog" aria-modal="true" onMouseDown={e => e.stopPropagation()}>
        <div className="cl-icon">⚠️</div>
        <h3>{t('Delete your account?')}</h3>
        <p>{t('Your profile, username, XP, achievements and every saved game will be deleted for good. Leaderboard entries disappear too.')}</p>
        <p className="pp-danger-type">{t('Type your username to confirm:')} <b>{username}</b></p>
        <input
          className="auth-input" value={typed} autoFocus autoComplete="off" spellCheck={false}
          onChange={e => setTyped(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') run() }}
          placeholder={username}
        />
        {error && <div className="auth-error">{error}</div>}
        <div className="cl-btns">
          <button className="arc-secondary" onClick={onCancel} disabled={busy}>{t('Cancel')}</button>
          <button className="pp-danger-btn" onClick={run} disabled={!ok || busy}>{busy ? '…' : t('Delete forever')}</button>
        </div>
      </div>
    </div>
  )
}

function mostPlayed(p) {
  return Object.entries(p.perMode).sort((a, b) => b[1].plays - a[1].plays)[0]?.[0]
}

// ── Overview ───────────────────────────────────────────────────────────────
function Overview({ p, results, onPlay, goTo }) {
  const { list: daily, streak: dailyStreak } = useDailyChallenges()
  // one row per game, most recent first
  const recent = []
  const seen = new Set()
  for (const r of results) {
    if (seen.has(r.mode) || !GAME_CATALOG[r.mode]) continue
    seen.add(r.mode); recent.push(r)
    if (recent.length === 6) break
  }
  const unlocked = p.achievements.filter(a => a.unlocked)
  const next = p.achievements.filter(a => !a.unlocked).sort((a, b) => b.value / b.target - a.value / a.target)[0]

  return (
    <div className="pp-overview">
      <div className="pp-card">
        <div className="pp-card-head">
          <h3>{t('Played recently')}</h3>
          {recent.length > 0 && <button className="pp-link" onClick={() => goTo('games')}>{t('All my games →')}</button>}
        </div>
        {recent.length === 0
          ? <StateNote compact>{t('No games yet. Go play something!')}</StateNote>
          : (
            <div className="pp-rows">
              {recent.map(r => {
                const g = gameMeta(r.mode)
                const m = p.perMode[r.mode]
                return (
                  <button key={r.mode} className="pp-row" onClick={() => onPlay(r.mode)} title={t('Play {label}', { label: g.label })}>
                    <span className="pp-row-icon"><GameIcon id={r.mode} size={20} /></span>
                    <span className="pp-row-name">{g.label}</span>
                    <span className="pp-row-best">{t('best {s}', { s: scoreText(r.mode, m?.best) })}</span>
                    <span className="pp-row-ago">{timeAgo(r.played_at)}</span>
                  </button>
                )
              })}
            </div>
          )}
      </div>

      <div className="pp-side">
        <div className="pp-card">
          <div className="pp-card-head">
            <h3>{t('Achievements')}</h3>
            <button className="pp-link" onClick={() => goTo('achievements')}>{unlocked.length}/{p.achievements.length} →</button>
          </div>
          {unlocked.length > 0
            ? <div className="pp-badges">{unlocked.slice(-8).map(a => <span key={a.id} className="pp-badge" title={a.label}>{a.icon}</span>)}</div>
            : <StateNote compact>{t('Nothing unlocked yet — your first one is close.')}</StateNote>}
          {next && (
            <div className="pp-next">
              <span className="pp-next-label">{t('Next')}: <strong>{next.label}</strong> <span className="pp-muted">· {next.desc}</span></span>
              {next.target > 1 && <span className="pp-next-bar"><span style={{ width: `${(next.value / next.target) * 100}%` }} /></span>}
            </div>
          )}
        </div>

        <div className="pp-card">
          <div className="pp-card-head">
            <h3>{t('Today\'s challenges')}</h3>
            {dailyStreak > 0 && <span className="pp-chip"><Icon name="flame" size={13} /> {dailyStreak}</span>}
          </div>
          <div className="profile-daily-list">
            {daily.map(ch => (
              <div key={ch.id} className={`profile-daily-ch${ch.done ? ' pdc-done' : ''}`}>
                <span className="pdc-icon">{ch.icon}</span>
                <div className="pdc-body">
                  <span className="pdc-label">{ch.task}</span>
                  {!ch.done && ch.target > 1 && <div className="pdc-bar"><div className="pdc-bar-fill" style={{ width: `${Math.min((ch.value / ch.target) * 100, 100)}%` }} /></div>}
                </div>
                <span className={`pdc-status${ch.done ? ' pdc-check' : ''}`}>{ch.done ? '✓' : `${ch.value}/${ch.target}`}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── My games ───────────────────────────────────────────────────────────────
function GamesTab({ p, results, onPlay }) {
  const rows = Object.entries(p.perMode)
    .filter(([id]) => GAME_CATALOG[id])
    .sort((a, b) => (b[1].lastPlayed ?? '').localeCompare(a[1].lastPlayed ?? ''))
  if (!rows.length) return <div className="pp-card"><StateNote compact>{t('No games yet. Go play something!')}</StateNote></div>
  return (
    <div className="pp-card">
      <div className="pp-table">
        <div className="pp-table-head">
          <span />
          <span>{t('Game')}</span>
          <span>{t('Last')}</span>
          <span>{t('Best')}</span>
          <span>{t('Played')}</span>
          <span />
        </div>
        {rows.map(([id, m]) => {
          const last = results.find(r => r.mode === id)
          return (
            <div key={id} className="pp-table-row">
              <span className="pp-row-icon"><GameIcon id={id} size={20} /></span>
              <span className="pp-row-name">{gameMeta(id).label}<small>{timeAgo(m.lastPlayed)}</small></span>
              <span>{scoreText(id, last)}</span>
              <span className="pp-row-strong">{scoreText(id, m.best)}{GAME_CATALOG[id]?.timed && m.bestTime != null && <small> · {fmtDuration(m.bestTime)}</small>}</span>
              <span>{m.plays}×</span>
              <button className="tq-btn" onClick={() => onPlay(id)}>{t('Play')}</button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Achievements ───────────────────────────────────────────────────────────
function AchievementRow({ a }) {
  return (
    <div className={`pp-ach-row${a.unlocked ? ' unlocked' : ''}`}>
      <span className="pp-ach-icon">{a.unlocked ? a.icon : '🔒'}</span>
      <div className="pp-ach-body">
        <span className="pp-ach-label">{a.label}</span>
        <span className="pp-ach-desc">{a.desc}</span>
        {!a.unlocked && a.target > 1 && (
          <div className="pp-ach-bar"><div style={{ width: `${(a.value / a.target) * 100}%` }} /></div>
        )}
      </div>
      {!a.unlocked && a.target > 1 && <span className="pp-ach-count">{a.value}/{a.target}</span>}
    </div>
  )
}

function AchievementsTab({ p }) {
  const sorted = [...p.achievements].sort((a, b) => Number(b.unlocked) - Number(a.unlocked))
  return (
    <div className="pp-ach-grid">
      {sorted.map(a => <AchievementRow key={a.id} a={a} />)}
    </div>
  )
}
