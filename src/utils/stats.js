const KEY = 'orbis_mystery_stats'

function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) ?? {}
  } catch { return {} }
}

function save(data) {
  try { localStorage.setItem(KEY, JSON.stringify(data)) } catch {}
}

function today() {
  return new Date().toISOString().slice(0, 10)
}

// Prune calendar to last 90 days to keep storage small
function pruneCalendar(cal) {
  const cutoff = new Date(Date.now() - 90 * 864e5).toISOString().slice(0, 10)
  const result = {}
  for (const [date, val] of Object.entries(cal)) {
    if (date >= cutoff) result[date] = val
  }
  return result
}

export function getStats() {
  const d = load()
  return {
    played:      d.played      ?? 0,
    won:         d.won         ?? 0,
    streak:      d.streak      ?? 0,
    bestStreak:  d.bestStreak  ?? 0,
    lastWinDate: d.lastWinDate ?? null,
    calendar:    d.calendar    ?? {},
  }
}

export function recordWin() {
  const d = load()
  const t = today()
  const yesterday = new Date(Date.now() - 864e5).toISOString().slice(0, 10)

  // Don't double-count if already played today
  const alreadyPlayed = d.calendar?.[t]
  const prevStreak = d.streak ?? 0
  const newStreak  = d.lastWinDate === yesterday ? prevStreak + 1
                   : d.lastWinDate === t          ? prevStreak   // same day re-win (practice?)
                   : 1

  const calendar = pruneCalendar({ ...(d.calendar ?? {}), [t]: 'won' })

  const updated = {
    played:      (d.played ?? 0) + (alreadyPlayed ? 0 : 1),
    won:         (d.won    ?? 0) + 1,
    streak:      newStreak,
    bestStreak:  Math.max(newStreak, d.bestStreak ?? 0),
    lastWinDate: t,
    calendar,
  }
  save(updated)
  return updated
}

export function recordGiveUp() {
  const d = load()
  const t = today()
  const alreadyPlayed = d.calendar?.[t]

  // Only mark as lost if not already won today
  const result = alreadyPlayed === 'won' ? 'won' : 'lost'
  const calendar = pruneCalendar({ ...(d.calendar ?? {}), [t]: result })

  const updated = {
    ...d,
    played:  (d.played ?? 0) + (alreadyPlayed ? 0 : 1),
    streak:  alreadyPlayed ? (d.streak ?? 0) : 0,
    calendar,
  }
  save(updated)
  return updated
}

export function getCalendar(days = 30) {
  const cal = load().calendar ?? {}
  const result = []
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(Date.now() - i * 864e5).toISOString().slice(0, 10)
    result.push({ date, result: cal[date] ?? null })
  }
  return result
}
