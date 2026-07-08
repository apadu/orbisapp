import { useState } from 'react'
import { ACHIEVEMENTS, getUnlockedAchievements, saveProfile } from '../utils/profileStats'
import { getCalendar, getStats } from '../utils/stats'

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function StreakCalendar() {
  const calData = getCalendar(90) // fetch enough to cover any month
  const stats   = getStats()
  const todayStr = new Date().toISOString().slice(0, 10)

  // Build a lookup: date string → result
  const resultMap = {}
  for (const d of calData) if (d.result) resultMap[d.date] = d.result

  // Current month bounds
  const now         = new Date()
  const year        = now.getFullYear()
  const month       = now.getMonth()
  const monthLabel  = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  // Day-of-week of the 1st (0=Sun…6=Sat → convert to Mon-based 0–6)
  const firstDow = new Date(year, month, 1).getDay()
  const startPad = (firstDow + 6) % 7 // blanks before the 1st

  // Build grid cells: nulls for padding, then 1…daysInMonth
  const cells = [
    ...Array(startPad).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  const dateStr = day => {
    const m = String(month + 1).padStart(2, '0')
    const d = String(day).padStart(2, '0')
    return `${year}-${m}-${d}`
  }

  return (
    <div className="streak-cal-wrap">
      <div className="streak-cal-header">
        <span className="streak-cal-title">🔥 {monthLabel}</span>
        <div className="streak-cal-nums">
          <span className="streak-cal-stat"><strong>{stats.streak}</strong> streak</span>
          <span className="streak-cal-sep">·</span>
          <span className="streak-cal-stat"><strong>{stats.bestStreak}</strong> best</span>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="streak-cal-grid">
        {WEEKDAYS.map(w => (
          <div key={w} className="streak-cal-wday">{w}</div>
        ))}

        {/* Day cells */}
        {cells.map((day, i) => {
          if (!day) return <div key={`pad-${i}`} className="streak-cal-blank" />
          const ds  = dateStr(day)
          const res = resultMap[ds] ?? null
          const isFuture = ds > todayStr
          return (
            <div
              key={ds}
              className={[
                'streak-cal-day',
                res === 'won'  ? 'cal-won'  : '',
                res === 'lost' ? 'cal-lost' : '',
                ds === todayStr ? 'cal-today' : '',
                isFuture ? 'cal-future' : '',
              ].filter(Boolean).join(' ')}
              title={isFuture ? '' : res ? `${ds} — ${res}` : `${ds} — not played`}
            >
              {day}
            </div>
          )
        })}
      </div>

      <div className="streak-cal-legend">
        <span className="cal-legend-item"><span className="cal-dot cal-won" />Win</span>
        <span className="cal-legend-item"><span className="cal-dot cal-lost" />Loss</span>
        <span className="cal-legend-item"><span className="cal-dot" />No play</span>
      </div>
    </div>
  )
}

function formatTime(secs) {
  if (!secs && secs !== 0) return '—'
  const m = Math.floor(secs / 60).toString().padStart(2, '0')
  const s = (secs % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

function pct(correct, total) {
  if (!total) return '—'
  return `${Math.round((correct / total) * 100)}%`
}

const CONTINENTS = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania']

const MODE_STATS = [
  {
    id: 'mystery',
    icon: '🔍',
    label: 'Mystery Country',
    rows: p => [
      { label: 'Games played',  value: p.mystery.gamesPlayed },
      { label: 'Wins',          value: p.mystery.wins },
      { label: 'Win rate',      value: pct(p.mystery.wins, p.mystery.gamesPlayed) },
      { label: 'Best streak',   value: p.mystery.bestStreak },
    ],
  },
  {
    id: 'nameAll',
    icon: '🌍',
    label: 'All Countries',
    rows: p => [
      { label: 'World completions', value: p.nameAll.completions },
      { label: 'Best world time',   value: formatTime(p.nameAll.bestTimeWorld) },
      ...CONTINENTS.map(c => ({
        label: `${c} PB`,
        value: formatTime(p.nameAll.continentPBs?.[c] ?? null),
      })),
    ],
  },
  {
    id: 'flag',
    icon: '🚩',
    label: 'Flag Quiz',
    rows: p => [
      { label: 'Rounds played', value: p.flag.roundsPlayed },
      { label: 'Correct',       value: p.flag.correct },
      { label: 'Accuracy',      value: pct(p.flag.correct, p.flag.roundsPlayed) },
      { label: 'Best streak',   value: p.flag.bestStreak },
      { label: 'High score',    value: p.flag.highScore },
    ],
  },
  {
    id: 'capitals',
    icon: '🏛️',
    label: 'Capitals Quiz',
    rows: p => [
      { label: 'Games played', value: p.capitals.gamesPlayed },
      { label: 'Correct',      value: p.capitals.correct },
      { label: 'Accuracy',     value: pct(p.capitals.correct, p.capitals.gamesPlayed) },
      { label: 'Best streak',  value: p.capitals.bestStreak },
    ],
  },
  {
    id: 'capToCountry',
    icon: '🗺️',
    label: 'Capital to Country',
    rows: p => [
      { label: 'Games played', value: p.capToCountry.gamesPlayed },
      { label: 'Correct',      value: p.capToCountry.correct },
      { label: 'Accuracy',     value: pct(p.capToCountry.correct, p.capToCountry.gamesPlayed) },
      { label: 'Best streak',  value: p.capToCountry.bestStreak },
    ],
  },
  {
    id: 'locate',
    icon: '📍',
    label: 'Pinpoint Country',
    rows: p => [
      { label: 'Rounds played',   value: p.locate.roundsPlayed },
      { label: 'High score',      value: p.locate.highScore },
      { label: 'Perfect rounds',  value: p.locate.perfectRounds },
    ],
  },
  {
    id: 'borderChain',
    icon: '🔗',
    label: 'Border Chain',
    rows: p => [
      { label: 'Rounds played',   value: p.borderChain.roundsPlayed },
      { label: 'High score',      value: p.borderChain.highScore },
      { label: 'Optimal solves',  value: p.borderChain.optimalSolves },
    ],
  },
  {
    id: 'popOrder',
    icon: '📊',
    label: 'Population Order',
    rows: p => [
      { label: 'Rounds played',  value: p.popOrder.roundsPlayed },
      { label: 'High score',     value: p.popOrder.highScore },
      { label: 'Perfect rounds', value: p.popOrder.perfectRounds },
    ],
  },
]

export default function ProfilePage({ profile, onBack, onProfileUpdate }) {
  const [editingName, setEditingName] = useState(false)
  const [nameInput, setNameInput]     = useState(profile.username)
  const [activeTab, setActiveTab]     = useState('stats') // 'stats' | 'achievements' | 'friends'

  const unlocked = getUnlockedAchievements(profile)
  const unlockedIds = new Set(unlocked.map(a => a.id))

  const saveName = () => {
    const name = nameInput.trim() || 'Explorer'
    const updated = { ...profile, username: name }
    saveProfile(updated)
    onProfileUpdate(updated)
    setEditingName(false)
  }

  const joinDate = profile.joinedAt
    ? new Date(profile.joinedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : 'Unknown'

  const totalGames =
    profile.mystery.gamesPlayed +
    profile.flag.roundsPlayed +
    profile.capitals.gamesPlayed +
    profile.capToCountry.gamesPlayed +
    profile.locate.roundsPlayed +
    profile.borderChain.roundsPlayed +
    profile.popOrder.roundsPlayed

  return (
    <div className="profile-page">
      {/* Back button */}
      <button className="profile-back" onClick={onBack}>← Back to game</button>

      {/* Hero */}
      <div className="profile-hero">
        <div className="profile-avatar">
          {profile.username.charAt(0).toUpperCase()}
        </div>
        <div className="profile-info">
          {editingName ? (
            <div className="profile-name-edit">
              <input
                className="profile-name-input"
                value={nameInput}
                onChange={e => setNameInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') saveName(); if (e.key === 'Escape') setEditingName(false) }}
                autoFocus
                maxLength={24}
              />
              <button className="profile-name-save" onClick={saveName}>Save</button>
              <button className="profile-name-cancel" onClick={() => setEditingName(false)}>✕</button>
            </div>
          ) : (
            <div className="profile-name-row">
              <h1 className="profile-username">{profile.username}</h1>
              <button className="profile-edit-btn" onClick={() => setEditingName(true)} title="Edit name">✏️</button>
            </div>
          )}
          <p className="profile-meta">Explorer · Joined {joinDate}</p>
          <div className="profile-summary">
            <div className="profile-summary-item">
              <span className="profile-summary-num">{totalGames}</span>
              <span className="profile-summary-label">Games</span>
            </div>
            <div className="profile-summary-item">
              <span className="profile-summary-num">{profile.mystery.wins}</span>
              <span className="profile-summary-label">Mystery Wins</span>
            </div>
            <div className="profile-summary-item">
              <span className="profile-summary-num">{unlocked.length}</span>
              <span className="profile-summary-label">Achievements</span>
            </div>
            <div className="profile-summary-item">
              <span className="profile-summary-num">{profile.nameAll.completions}</span>
              <span className="profile-summary-label">World Clears</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="profile-tabs">
        {['stats', 'achievements', 'friends'].map(t => (
          <button
            key={t}
            className={`profile-tab ${activeTab === t ? 'active' : ''}`}
            onClick={() => setActiveTab(t)}
          >
            {t === 'stats' ? '📈 Stats' : t === 'achievements' ? '🏅 Achievements' : '👥 Friends'}
          </button>
        ))}
      </div>

      {/* Stats tab */}
      {activeTab === 'stats' && (
        <>
        <StreakCalendar />
        <div className="profile-stats-grid">
          {MODE_STATS.map(({ id, icon, label, rows }) => (
            <div key={id} className="profile-stat-card">
              <div className="psc-header">
                <span className="psc-icon">{icon}</span>
                <span className="psc-label">{label}</span>
              </div>
              <div className="psc-rows">
                {rows(profile).map(({ label: l, value }) => (
                  <div key={l} className="psc-row">
                    <span className="psc-row-label">{l}</span>
                    <span className="psc-row-value">{value ?? '—'}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        </>
      )}

      {/* Achievements tab */}
      {activeTab === 'achievements' && (
        <div className="profile-achievements">
          <p className="achievements-summary">
            {unlocked.length} / {ACHIEVEMENTS.length} unlocked
          </p>
          <div className="achievements-grid">
            {ACHIEVEMENTS.map(a => {
              const done = unlockedIds.has(a.id)
              return (
                <div key={a.id} className={`achievement-card ${done ? 'unlocked' : 'locked'}`}>
                  <span className="ach-icon">{done ? a.icon : '🔒'}</span>
                  <span className="ach-label">{a.label}</span>
                  <span className="ach-desc">{a.desc}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Friends tab */}
      {activeTab === 'friends' && (
        <div className="profile-friends">
          <div className="friends-placeholder">
            <span className="friends-placeholder-icon">👥</span>
            <h3>Friends & Challenges</h3>
            <p>Multiplayer and 1v1 challenges are coming soon.<br />You'll be able to invite friends, compare scores, and race head-to-head.</p>
            <button className="friends-invite-btn" disabled>Invite a friend (coming soon)</button>
          </div>
        </div>
      )}
    </div>
  )
}
