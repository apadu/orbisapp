import { todaySeed } from './daily'

// Deterministic today key: "YYYY-MM-DD"
export function todayKey() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const PROGRESS_KEY = () => `orbis-daily-${todayKey()}`
const STREAK_KEY   = 'orbis-daily-streak-days'

export const DAILY_CHALLENGES = [
  {
    id:     'mystery',
    mode:   'mystery',
    icon:   '🔍',
    label:  'Mystery Country',
    task:   'Solve today\'s mystery',
    type:   'boolean',
    target: 1,
  },
  {
    id:     'flags',
    mode:   'flag',
    icon:   '🚩',
    label:  'Flags Quiz',
    task:   'Identify 5 flags correctly',
    type:   'count',
    target: 5,
  },
  {
    id:     'countries',
    mode:   'name-all',
    icon:   '🌍',
    label:  'Name All Countries',
    task:   'Name 30 countries',
    type:   'count',
    target: 30,
  },
]

export function loadDailyProgress() {
  try { return JSON.parse(localStorage.getItem(PROGRESS_KEY()) ?? '{}') }
  catch { return {} }
}

function saveDailyProgress(p) {
  localStorage.setItem(PROGRESS_KEY(), JSON.stringify(p))
}

/** Mark a boolean challenge (e.g. mystery) as complete */
export function markDailyComplete(id) {
  const p = loadDailyProgress()
  if (p[id]) return // already done
  p[id] = true
  saveDailyProgress(p)
  _checkAllComplete(p)
}

/** Increment a count-based challenge (flags, countries) by 1 */
export function incrementDailyCount(id) {
  const ch = DAILY_CHALLENGES.find(c => c.id === id)
  if (!ch) return
  const p = loadDailyProgress()
  const current = typeof p[id] === 'number' ? p[id] : 0
  if (current >= ch.target) return // already maxed
  p[id] = current + 1
  saveDailyProgress(p)
  if (p[id] >= ch.target) _checkAllComplete(p)
}

function _checkAllComplete(progress) {
  const allDone = DAILY_CHALLENGES.every(c => {
    if (c.type === 'boolean') return progress[c.id] === true
    return (progress[c.id] ?? 0) >= c.target
  })
  if (allDone) _recordCompletedDay()
}

function _recordCompletedDay() {
  const today = todayKey()
  try {
    const days = JSON.parse(localStorage.getItem(STREAK_KEY) ?? '[]')
    if (!days.includes(today)) {
      days.push(today)
      localStorage.setItem(STREAK_KEY, JSON.stringify(days))
    }
  } catch {}
}

/** Returns the current daily streak (consecutive completed days up to today) */
export function getDailyStreak() {
  try {
    const days = new Set(JSON.parse(localStorage.getItem(STREAK_KEY) ?? '[]'))
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    // If today isn't done yet, start counting from yesterday
    const todayStr = todayKey()
    if (!days.has(todayStr)) d.setDate(d.getDate() - 1)
    let streak = 0
    for (let i = 0; i < 365; i++) {
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
      if (days.has(key)) { streak++; d.setDate(d.getDate() - 1) }
      else break
    }
    return streak
  } catch { return 0 }
}

/** Helper: get progress for a single challenge */
export function getChallengeProgress(id, progress) {
  const ch = DAILY_CHALLENGES.find(c => c.id === id)
  if (!ch) return { done: false, value: 0, target: 1 }
  if (ch.type === 'boolean') {
    return { done: progress[id] === true, value: progress[id] ? 1 : 0, target: 1 }
  }
  const value = Math.min(progress[id] ?? 0, ch.target)
  return { done: value >= ch.target, value, target: ch.target }
}
