import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../auth/AuthContext'
import { loadResults, subscribeResults } from '../utils/results'
import { computeProfile, levelTitle } from '../utils/profileData'
import { GAME_CATALOG, CAT_LABELS, gameMeta } from '../utils/gameCatalog'
import { useDailyChallenges } from '../utils/useDailyChallenges'
import KnowledgeMap from './profile/KnowledgeMap'
import ActivityHeatmap from './profile/ActivityHeatmap'
import Leaderboard from './profile/Leaderboard'
import { t, cn, locale } from '../i18n'

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
  if (s < 7 * 86400) return t('{v}d ago', { v: Math.floor(s / 86400) })
  return new Date(iso).toLocaleDateString(locale, { month: 'short', day: 'numeric' })
}

const pct = (x) => `${Math.round(x * 100)}%`

function Sparkline({ values }) {
  if (values.length < 2) return <div className="spark-empty" />
  const w = 96, h = 28
  const max = Math.max(...values), min = Math.min(...values)
  const span = max - min || 1
  const pts = values.map((v, i) => `${(i / (values.length - 1)) * w},${h - 3 - ((v - min) / span) * (h - 6)}`).join(' ')
  return (
    <svg className="spark" viewBox={`0 0 ${w} ${h}`} width={w} height={h}>
      <polyline points={pts} fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  )
}

const TABS = [
  { id: 'overview',     label: t('📈 Overview') },
  { id: 'games',        label: t('🎮 Games') },
  { id: 'map',          label: t('🗺️ Knowledge Map') },
  { id: 'achievements', label: t('🏅 Achievements') },
  { id: 'leaderboards', label: t('🏆 Leaderboards') },
]

// ── Page ───────────────────────────────────────────────────────────────────
export default function ProfilePage({ countries = [], onBack, onPlay }) {
  const auth = useAuth()
  const results = useResults()
  const p = useMemo(() => computeProfile(results), [results])
  const [tab, setTab] = useState('overview')
  const [deleting, setDeleting] = useState(false)

  const username = auth.profile?.username ?? t('Guest')
  const joined = auth.profile?.created_at ?? results[results.length - 1]?.played_at
  const unlocked = p.achievements.filter(a => a.unlocked)


  return (
    <div className="profile-page pp">
      <button className="profile-back" onClick={onBack}>{t('← Back')}</button>

      {/* ── Guest banner ── */}
      {!auth.user && auth.backendEnabled && (
        <div className="pp-guest-banner">
          <span>{t('👋 You\'re playing as a guest. Your progress is saved on this device only.')}</span>
          <button onClick={auth.openAuth}>{t('Sign in to save it')}</button>
        </div>
      )}

      {/* ── Hero ── */}
      <section className="pp-hero">
        <div className="pp-avatar-wrap">
          {auth.profile?.avatar_url
            ? <img className="pp-avatar" src={auth.profile.avatar_url} alt="" referrerPolicy="no-referrer" />
            : <div className="pp-avatar pp-avatar-letter">{username.charAt(0).toUpperCase()}</div>}
          <span className="pp-level-badge">{p.level.level}</span>
        </div>

        <div className="pp-hero-main">
          <div className="pp-name-row">
            <h1>{username}</h1>
          </div>
          <div className="pp-meta">
            <span className="pp-title-chip">{levelTitle(p.level.level)}</span>
            {joined && <span>{t('Joined')} {new Date(joined).toLocaleDateString(locale, { month: 'long', year: 'numeric' })}</span>}
            {auth.user && <button className="pp-link" onClick={auth.signOut}>{t('Sign out')}</button>}
          </div>

          <div className="pp-xp">
            <div className="pp-xp-bar"><div className="pp-xp-fill" style={{ width: `${p.level.pct}%` }} /></div>
            <span className="pp-xp-label">
              {t('Level')} {p.level.level} · {p.xp.toLocaleString()} {t('XP ·')} {(p.level.next - p.xp).toLocaleString()} {t('to level')} {p.level.level + 1}
            </span>
          </div>
        </div>

      </section>

      {/* ── Tabs ── */}
      <nav className="pp-tabs">
        {TABS.map(t => (
          <button key={t.id} className={`pp-tab${tab === t.id ? ' active' : ''}`} onClick={() => setTab(t.id)}>
            {t.label}
            {t.id === 'achievements' && <span className="pp-tab-count">{unlocked.length}/{p.achievements.length}</span>}
          </button>
        ))}
      </nav>

      {tab === 'overview'     && <Overview p={p} results={results} onPlay={onPlay} goTo={setTab} />}
      {tab === 'games'        && <GamesTab p={p} onPlay={onPlay} />}
      {tab === 'map'          && <MapTab p={p} countries={countries} />}
      {tab === 'achievements' && <AchievementsTab p={p} />}
      {tab === 'leaderboards' && <Leaderboard initialMode={mostPlayed(p) ?? 'flag'} />}

      {/* ── Account: danger zone ── */}
      {auth.user && (
        <section className="pp-danger">
          <div>
            <h3>{t('Delete account')}</h3>
            <p>{t('Permanently deletes your account, username and all your saved games. This can\'t be undone.')}</p>
          </div>
          <button className="pp-danger-btn" onClick={() => setDeleting(true)}>{t('Delete account')}</button>
        </section>
      )}
      {deleting && <DeleteAccountDialog username={username} onCancel={() => setDeleting(false)} onDelete={auth.deleteAccount} onDone={() => { setDeleting(false); onBack() }} />}
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
  const nextAch = p.achievements
    .filter(a => !a.unlocked)
    .sort((a, b) => b.value / b.target - a.value / a.target)
    .slice(0, 3)

  return (
    <div className="pp-overview">
      <div className="pp-card pp-span-2">
        <ActivityHeatmap heatmap={p.heatmap} />
        <div className="pp-mini-stats">
          <span><strong>{p.activeDays}</strong> {t('active days')}</span>
          <span><strong>{p.streak.best}</strong> {t('best streak')}</span>
          <span><strong>{fmtHours(p.totals.timeMs)}</strong> {t('played')}</span>
          <span><strong>{p.totals.correct.toLocaleString()}</strong> {t('correct answers')}</span>
        </div>
      </div>

      <div className="pp-card">
        <div className="pp-card-head">
          <h3>{t('📅 Today\'s challenges')}</h3>
          {dailyStreak > 0 && <span className="pp-chip">🔥 {dailyStreak}</span>}
        </div>
        <div className="profile-daily-list">
          {daily.map(ch => {
            const { done, value, target } = ch
            return (
              <div key={ch.id} className={`profile-daily-ch${done ? ' pdc-done' : ''}`}>
                <span className="pdc-icon">{ch.icon}</span>
                <div className="pdc-body">
                  <span className="pdc-label">{ch.task}</span>
                  {!done && target > 1 && (
                    <div className="pdc-bar"><div className="pdc-bar-fill" style={{ width: `${Math.min((value / target) * 100, 100)}%` }} /></div>
                  )}
                </div>
                <span className={`pdc-status${done ? ' pdc-check' : ''}`}>{done ? '✓' : `${value}/${target}`}</span>
              </div>
            )
          })}
        </div>
      </div>

      <div className="pp-card">
        <div className="pp-card-head">
          <h3>{t('🏅 Almost there')}</h3>
          <button className="pp-link" onClick={() => goTo('achievements')}>{t('All achievements →')}</button>
        </div>
        {nextAch.length === 0
          ? <p className="pp-muted">{t('You\'ve unlocked everything. Legend.')}</p>
          : nextAch.map(a => <AchievementRow key={a.id} a={a} />)}
      </div>

      <div className="pp-card">
        <div className="pp-card-head"><h3>{t('🕑 Recent games')}</h3></div>
        {results.length === 0
          ? <p className="pp-muted">{t('No games yet. Go play something!')}</p>
          : (
            <div className="pp-recent">
              {results.slice(0, 8).map(r => {
                const g = gameMeta(r.mode)
                return (
                  <button key={r.client_id} className="pp-recent-row" onClick={() => onPlay(r.mode)} title={t('Play {label}', { label: g.label })}>
                    <span className="pp-recent-icon">{g.icon}</span>
                    <span className="pp-recent-name">{g.label}</span>
                    <span className="pp-recent-score">{g.cat === 'quiz' ? `${r.correct}/${r.total}` : r.score.toLocaleString()}</span>
                    <span className="pp-recent-acc">{r.correct}/{r.total}</span>
                    <span className="pp-recent-ago">{timeAgo(r.played_at)}</span>
                  </button>
                )
              })}
            </div>
          )}
      </div>
    </div>
  )
}

// ── Games ──────────────────────────────────────────────────────────────────
function GamesTab({ p, onPlay }) {
  return (
    <div className="pp-games">
      {Object.entries(CAT_LABELS).map(([cat, label]) => {
        const items = Object.entries(GAME_CATALOG).filter(([, g]) => g.cat === cat)
        return (
          <section key={cat}>
            <h3 className="pp-section-title">{label}</h3>
            <div className="pp-game-grid">
              {items.map(([id, g]) => {
                const m = p.perMode[id]
                return (
                  <div key={id} className={`pp-game-card${m ? '' : ' pp-game-unplayed'}`}>
                    <div className="pp-game-head">
                      <span className="pp-game-icon">{g.icon}</span>
                      <span className="pp-game-name">{g.label}</span>
                      <button className="pp-play" onClick={() => onPlay(id)}>{t('Play')}</button>
                    </div>
                    {m ? (
                      <>
                        <div className="pp-game-stats">
                          <div><span className="pp-gs-num">{g.cat === 'quiz' ? (m.best ? `${m.best.correct}/${m.best.total}` : '—') : (m.best?.score.toLocaleString() ?? '—')}</span><span className="pp-gs-label">{t('best')}</span></div>
                          <div><span className="pp-gs-num">{pct(m.accuracy)}</span><span className="pp-gs-label">{t('accuracy')}</span></div>
                          <div>
                            <span className="pp-gs-num">{g.timed ? fmtDuration(m.bestTime) : m.plays}</span>
                            <span className="pp-gs-label">{g.timed ? t('best clear') : t('played')}</span>
                          </div>
                        </div>
                        <div className="pp-game-foot">
                          <Sparkline values={m.recent} />
                          <span className="pp-muted">{timeAgo(m.lastPlayed)}</span>
                        </div>
                      </>
                    ) : (
                      <p className="pp-muted pp-game-empty">{t('Not played yet')}</p>
                    )}
                  </div>
                )
              })}
            </div>
          </section>
        )
      })}
    </div>
  )
}

// ── Knowledge map ──────────────────────────────────────────────────────────
function MapTab({ p, countries }) {
  const list = Object.entries(p.mastery).map(([name, s]) => ({ name, ...s, pct: s.ok / s.total }))
  const strongest = list.filter(c => c.total >= 2).sort((a, b) => b.pct - a.pct || b.total - a.total).slice(0, 8)

  return (
    <div className="pp-map-tab">
      <div className="pp-card">
        <div className="pp-card-head">
          <h3>{t('Your world')}</h3>
          <span className="pp-muted">{p.countriesKnown} {t('known ·')} {p.countriesMastered} {t('mastered')}</span>
        </div>
        <KnowledgeMap countries={countries} mastery={p.mastery} />
      </div>
      <div className="pp-map-lists">
        <div className="pp-card">
          <h3>{t('💪 Strongest')}</h3>
          {strongest.length === 0 ? <p className="pp-muted">{t('Not enough data yet.')}</p> : strongest.map(c => (
            <div key={c.name} className="pp-weak"><span>{cn(c.name)}</span><span className="pp-strong-pct">{pct(c.pct)}</span></div>
          ))}
        </div>
        <div className="pp-card">
          <h3>{t('🎯 Weakest')}</h3>
          {p.weakest.length === 0 ? <p className="pp-muted">{t('Nothing below 70% yet.')}</p> : p.weakest.slice(0, 8).map(c => (
            <div key={c.name} className="pp-weak"><span>{cn(c.name)}</span><span className="pp-weak-pct">{pct(c.pct)}</span></div>
          ))}
        </div>
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
