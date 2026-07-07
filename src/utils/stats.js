const KEY = 'orbis_mystery_stats'

function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) ?? {}
  } catch { return {} }
}

function save(data) {
  try { localStorage.setItem(KEY, JSON.stringify(data)) } catch {}
}

export function getStats() {
  const d = load()
  return {
    played:      d.played      ?? 0,
    won:         d.won         ?? 0,
    streak:      d.streak      ?? 0,
    bestStreak:  d.bestStreak  ?? 0,
    lastWinDate: d.lastWinDate ?? null,
  }
}

export function recordWin() {
  const d = load()
  const today = new Date().toISOString().slice(0, 10)
  const yesterday = new Date(Date.now() - 864e5).toISOString().slice(0, 10)

  const prevStreak = d.streak ?? 0
  const newStreak  = d.lastWinDate === yesterday ? prevStreak + 1 : 1

  const updated = {
    played:      (d.played ?? 0) + 1,
    won:         (d.won    ?? 0) + 1,
    streak:      newStreak,
    bestStreak:  Math.max(newStreak, d.bestStreak ?? 0),
    lastWinDate: today,
  }
  save(updated)
  return updated
}

export function recordLoss() {
  const d = load()
  const updated = {
    ...d,
    played: (d.played ?? 0) + 1,
    streak: 0,
  }
  save(updated)
  return updated
}
