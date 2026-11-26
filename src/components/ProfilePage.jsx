import { useEffect, useMemo, useState } from 'react'
import AvatarPicker from './AvatarPicker'
import { useAuth } from '../auth/AuthContext'
import { loadResults, subscribeResults } from '../utils/results'
import { computeProfile } from '../utils/profileData'
import { GAME_CATALOG, gameMeta } from '../utils/gameCatalog'
import Leaderboard from './profile/Leaderboard'
import Passport from './profile/Passport'
import { t, locale, lang, LANGS, setLang } from '../i18n'
import GameIcon from './GameIcon'
import { plain } from '../utils/plain'
import Icon from './Icon'
import StateNote from './StateNote'
import { QuestRing } from './StreakBadge'
import { computeVisas } from '../utils/visas'
import IdentityPage from './profile/IdentityPage'
import PassportCover from './profile/PassportCover'
import Visas from './profile/Visas'

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
  { id: 'visas',        label: t('Visas') },
  { id: 'passport',     label: t('Stamps') },
  { id: 'achievements', label: t('Achievements') },
  { id: 'games',        label: t('My games') },
  { id: 'leaderboards', label: t('Leaderboards') },
]

const isQuiz = (mode) => (GAME_CATALOG[mode]?.cat ?? 'quiz') === 'quiz'
const scoreText = (mode, r) => (r ? (isQuiz(mode) ? `${r.correct}/${r.total}` : r.score.toLocaleString(locale)) : '—')

// ── Page ───────────────────────────────────────────────────────────────────
export default function ProfilePage({ onBack, onPlay }) {
  const auth = useAuth()
  const results = useResults()
  const p = useMemo(() => computeProfile(results), [results])
  const [tab, setTab] = useState('visas')
  const [settings, setSettings] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [picking, setPicking] = useState(false)

  const username = auth.profile?.username ?? t('Guest')
  const joined = auth.profile?.created_at ?? results[results.length - 1]?.played_at
  const unlocked = p.achievements.filter(a => a.unlocked)
  const visaCount = useMemo(() => {
    const v = computeVisas(results)
    return { held: v.filter(x => x.tier > 0).length, total: v.length }
  }, [results])

  return (
    <div className="profile-page pp">
      <button className="profile-back" onClick={onBack}>{t('← Back')}</button>

      <PassportCover>
        <IdentityPage auth={auth} p={p} username={username} joined={joined} visas={visaCount}
          onPickAvatar={() => setPicking(true)} onAccount={() => setSettings(true)} />
      </PassportCover>

      {/* ── Passport pages ── */}
      <nav className="pp-tabs pp-tabs-passport" role="tablist">
        {TABS.map(x => (
          <button key={x.id} role="tab" aria-selected={tab === x.id} className={`pp-tab${tab === x.id ? ' active' : ''}`} onClick={() => setTab(x.id)}>
            {x.label}
            {x.id === 'visas' && <span className="pp-tab-count">{visaCount.held}/{visaCount.total}</span>}
            {x.id === 'achievements' && <span className="pp-tab-count">{unlocked.length}/{p.achievements.length}</span>}
          </button>
        ))}
      </nav>

      {tab === 'visas'        && <Visas results={results} holder={username} onOpen={onPlay} />}
      {tab === 'games'        && <GamesTab p={p} results={results} onPlay={onPlay} />}
      {tab === 'passport'     && <Passport />}
      {tab === 'achievements' && <AchievementsTab p={p} />}
      {tab === 'leaderboards' && <Leaderboard initialMode={mostPlayed(p) ?? 'flag'} />}

      {picking && <AvatarPicker onClose={() => setPicking(false)} />}
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
              {LANGS.map(l => <button key={l.id} className={lang === l.id ? 'active' : ''} onClick={() => { if (lang !== l.id) setLang(l.id) }}>{l.label}{l.beta && <sup className="um-beta">beta</sup>}</button>)}
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

/** Achievements as a travel journal: a lined notebook page, one entry per achievement. */
function AchievementsTab({ p }) {
  const sorted = [...p.achievements].sort((a, b) => Number(b.unlocked) - Number(a.unlocked))
  const done = sorted.filter(a => a.unlocked).length
  return (
    <section className="journal">
      <div className="journal-head">
        <span>{t('TRAVEL JOURNAL')}</span>
        <span>{t('{n} of {m} entries', { n: done, m: sorted.length })}</span>
      </div>
      <ol className="journal-list">
        {sorted.map(a => (
          <li key={a.id} className={`jr-entry${a.unlocked ? ' unlocked' : ''}`}>
            <span className="jr-sticker" aria-hidden="true">{a.icon}</span>
            <span className="jr-body">
              <strong className="jr-title">{a.label}</strong>
              <span className="jr-desc">{a.desc}</span>
              {!a.unlocked && a.target > 1 && (
                <span className="jr-progress"><span style={{ width: `${Math.min(100, (a.value / a.target) * 100)}%` }} /></span>
              )}
            </span>
            {a.unlocked
              ? <span className="jr-check" aria-label={t('Done')}>✓</span>
              : a.target > 1 && <span className="jr-count">{a.value}/{a.target}</span>}
          </li>
        ))}
      </ol>
    </section>
  )
}
