/**
 * Daily challenges — 3 new ones every day, picked from a pool with a seed based on
 * the local date (so everyone gets the same set, and it changes at midnight).
 *
 * Progress isn't stored separately: it's computed from that day's saved game results.
 * That keeps it honest and lets XP / streaks be recomputed from history at any time.
 */
import { t } from '../i18n'

// ── Dates ──────────────────────────────────────────────────────────────────
export const dateKey = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
export const todayKey = () => dateKey(new Date())
const resultDay = (r) => dateKey(new Date(r.played_at))

// ── Measures over one day's results ────────────────────────────────────────
const ofMode = (R, mode) => R.filter(r => r.mode === mode)
const sumCorrect = (R, mode) => ofMode(R, mode).reduce((s, r) => s + (r.correct ?? 0), 0)
const bestScore = (R, mode) => ofMode(R, mode).reduce((m, r) => Math.max(m, r.score ?? 0), 0)
const bestCorrect = (R, mode) => ofMode(R, mode).reduce((m, r) => Math.max(m, r.correct ?? 0), 0)
const QUIZ_EXCLUDE = new Set(['daily-quiz', 'connections', 'border-chain', 'higher-lower', 'true-false', 'country-wordle'])

// ── The pool ───────────────────────────────────────────────────────────────
// slot: 'daily' (a once-a-day game) | 'skill' (a specific game) | 'general' (any game)
const POOL = [
  // Once-a-day games
  { id: 'mystery', slot: 'daily', icon: '🔍', mode: 'mystery', target: 1,
    task: () => t('Solve today\'s Mystery Country'),
    value: R => ofMode(R, 'mystery').some(r => r.correct > 0 && !r.details?.practice && !r.details?.gaveUp) ? 1 : 0 },
  { id: 'daily-quiz', slot: 'daily', icon: '📅', mode: 'daily-quiz', target: 1,
    task: () => t('Play today\'s Daily Quiz'),
    value: R => ofMode(R, 'daily-quiz').length ? 1 : 0 },
  { id: 'wordle', slot: 'daily', icon: '🟩', mode: 'country-wordle', target: 1,
    task: () => t('Solve today\'s Country Wordle'),
    value: R => ofMode(R, 'country-wordle').some(r => r.details?.daily && r.correct > 0) ? 1 : 0 },

  // Specific games
  { id: 'flags-15', slot: 'skill', icon: '🚩', mode: 'flag', target: 15,
    task: n => t('Name {n} flags', { n }), value: R => sumCorrect(R, 'flag') },
  { id: 'capitals-20', slot: 'skill', icon: '🏛️', mode: 'capital', target: 20,
    task: n => t('Get {n} capitals right in the Capitals quiz', { n }), value: R => sumCorrect(R, 'capital') },
  { id: 'name-all-40', slot: 'skill', icon: '🌍', mode: 'name-all', target: 40,
    task: n => t('Name {n} countries in Name All', { n }), value: R => sumCorrect(R, 'name-all') },
  { id: 'caps-all-25', slot: 'skill', icon: '🏙️', mode: 'name-all-caps', target: 25,
    task: n => t('Name {n} capitals in Name All Capitals', { n }), value: R => sumCorrect(R, 'name-all-caps') },
  { id: 'capital-drop', slot: 'skill', icon: '📍', mode: 'capital-drop', target: 6000,
    task: n => t('Score {n} points in one Capital Drop game', { n: n.toLocaleString() }), value: R => bestScore(R, 'capital-drop') },
  { id: 'landmarks', slot: 'skill', icon: '🗽', mode: 'landmark-drop', target: 5000,
    task: n => t('Score {n} points in one Landmark Drop game', { n: n.toLocaleString() }), value: R => bestScore(R, 'landmark-drop') },
  { id: 'distance', slot: 'skill', icon: '📏', mode: 'distance', target: 4500,
    task: n => t('Score {n} points in one How Far? game', { n: n.toLocaleString() }), value: R => bestScore(R, 'distance') },
  { id: 'higher-lower', slot: 'skill', icon: '⚖️', mode: 'higher-lower', target: 10,
    task: n => t('Reach a streak of {n} in Higher or Lower', { n }), value: R => bestScore(R, 'higher-lower') },
  { id: 'true-false', slot: 'skill', icon: '✅', mode: 'true-false', target: 20,
    task: n => t('Get {n} right in one True or False round', { n }), value: R => bestCorrect(R, 'true-false') },
  { id: 'silhouette', slot: 'skill', icon: '🌀', mode: 'silhouette', target: 12,
    task: n => t('Name {n} countries in one Silhouette Spin run', { n }), value: R => bestScore(R, 'silhouette') },
  { id: 'pinpoint', slot: 'skill', icon: '📌', mode: 'locate', target: 8,
    task: n => t('Pinpoint {n} countries', { n }), value: R => sumCorrect(R, 'locate') },
  { id: 'neighbors', slot: 'skill', icon: '📌', mode: 'neighbor', target: 15,
    task: n => t('Name {n} neighbouring countries', { n }), value: R => sumCorrect(R, 'neighbor') },
  { id: 'time-zones', slot: 'skill', icon: '🕰️', mode: 'time-zones', target: 6,
    task: n => t('Get {n} right in one Time Zones game', { n }), value: R => bestCorrect(R, 'time-zones') },
  { id: 'line-up', slot: 'skill', icon: '📐', mode: 'line-up', target: 10,
    task: n => t('Find {n} countries on Line Up lines', { n }), value: R => sumCorrect(R, 'line-up') },

  // Anything goes
  { id: 'variety', slot: 'general', icon: '🎲', mode: 'quiz-hub', target: 3,
    task: n => t('Play {n} different games', { n }), value: R => new Set(R.map(r => r.mode)).size },
  { id: 'answers-60', slot: 'general', icon: '✔️', mode: 'quiz-hub', target: 60,
    task: n => t('Give {n} correct answers in any games', { n }), value: R => R.reduce((s, r) => s + (r.correct ?? 0), 0) },
  { id: 'quiz-80', slot: 'general', icon: '🎯', mode: 'quiz-hub', target: 1,
    task: () => t('Finish a quiz (10+ questions) with 80% or more'),
    value: R => R.some(r => !QUIZ_EXCLUDE.has(r.mode) && r.completed && r.total >= 10 && r.correct / r.total >= 0.8 && !r.details?.untimed) ? 1 : 0 },
  { id: 'games-5', slot: 'general', icon: '🎮', mode: 'quiz-hub', target: 5,
    task: n => t('Finish {n} games', { n }), value: R => R.filter(r => r.completed).length },
]

// ── Today's three ──────────────────────────────────────────────────────────
function rng(seedStr) {
  let h = 2166136261
  for (let i = 0; i < seedStr.length; i++) { h ^= seedStr.charCodeAt(i); h = Math.imul(h, 16777619) }
  return () => {
    h += 0x6D2B79F5
    let r = Math.imul(h ^ (h >>> 15), 1 | h)
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r)
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}

const cache = new Map()
/** The three challenges for a date key "YYYY-MM-DD": one once-a-day game, one specific game, one general. */
export function challengesFor(day) {
  if (cache.has(day)) return cache.get(day)
  const rand = rng(`orbis-challenges-${day}`)
  const pick = (slot) => { const xs = POOL.filter(c => c.slot === slot); return xs[Math.floor(rand() * xs.length)] }
  const list = [pick('daily'), pick('skill'), pick('general')]
  cache.set(day, list)
  return list
}

/** Progress of a day's challenges given ALL results (newest first). */
export function challengeStatus(results, day = todayKey()) {
  const R = results.filter(r => resultDay(r) === day && !r.details?.untimed)
  return challengesFor(day).map(c => {
    const value = Math.min(c.value(R), c.target)
    return { id: c.id, icon: c.icon, mode: c.mode, target: c.target, task: c.task(c.target), value, done: value >= c.target }
  })
}

/** Days (keys) on which a given number of challenges were completed: { day: doneCount } */
export function challengeHistory(results) {
  const days = new Set(results.map(resultDay))
  const out = {}
  for (const d of days) out[d] = challengeStatus(results, d).filter(c => c.done).length
  return out
}

/** Consecutive days with all three challenges done, ending today (or yesterday if today isn't done yet). */
export function challengeStreak(results) {
  const hist = challengeHistory(results)
  const d = new Date(); d.setHours(0, 0, 0, 0)
  if (hist[dateKey(d)] !== 3) d.setDate(d.getDate() - 1)
  let n = 0
  while (hist[dateKey(d)] === 3) { n++; d.setDate(d.getDate() - 1) }
  return n
}

