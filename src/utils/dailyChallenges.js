/**
 * Daily challenges — 3 new ones every day (easy · medium · hard), built from templates
 * over the whole game catalogue with a seed based on the local date, so everyone gets the
 * same set and it changes at midnight.
 *
 * Progress isn't stored separately: it's computed from that day's saved game results.
 * That keeps it honest and lets XP / streaks be recomputed from history at any time.
 *
 * Days before NEW_FROM keep the original fixed pool (LEGACY_POOL), so past XP doesn't move.
 */
import { t } from '../i18n'
import { playableGames, gamesOfTheDay, dayNumber } from './gameRegistry'
import { QUIZ_ITEMS, QUIZ_CATEGORIES, QUIZ_FAMILIES } from '../components/QuizHub'

// ── Dates ──────────────────────────────────────────────────────────────────
export const dateKey = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
export const todayKey = () => dateKey(new Date())
const resultDay = (r) => dateKey(new Date(r.played_at))

// ── Measures over one day's results ────────────────────────────────────────
const ofMode = (R, mode) => R.filter(r => r.mode === mode)
const sumCorrect = (R, mode) => ofMode(R, mode).reduce((s, r) => s + (r.correct ?? 0), 0)
const bestScore = (R, mode) => ofMode(R, mode).reduce((m, r) => Math.max(m, r.score ?? 0), 0)
const bestCorrect = (R, mode) => ofMode(R, mode).reduce((m, r) => Math.max(m, r.correct ?? 0), 0)
const QUIZ_EXCLUDE = new Set(['daily-quiz', 'country-grid', 'connections', 'border-chain', 'higher-lower', 'true-false', 'country-wordle'])

// ── The pool ───────────────────────────────────────────────────────────────
// slot: 'daily' (a once-a-day game) | 'skill' (a specific game) | 'general' (any game)
const LEGACY_POOL = [
  // Once-a-day games
  { id: 'mystery', slot: 'daily', icon: '🔍', mode: 'mystery', target: 1,
    task: () => t('Solve today\'s Mystery Country'),
    value: R => ofMode(R, 'mystery').some(r => r.correct > 0 && !r.details?.practice && !r.details?.gaveUp) ? 1 : 0 },
  { id: 'daily-quiz', slot: 'daily', icon: '📅', mode: 'daily-quiz', target: 1,
    task: () => t('Play today\'s Daily Fever'),
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

// ── Seeded random ──────────────────────────────────────────────────────────
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
const pickOf = (rand, xs) => xs[Math.floor(rand() * xs.length)]

// ── XP ─────────────────────────────────────────────────────────────────────
export const TIER_XP = { easy: 20, medium: 35, hard: 60 }
export const ALL_DONE_BONUS = 40
const LEGACY_XP = 30
export const NEW_FROM = '2026-11-21'

// ── Building blocks for the new templates ──────────────────────────────────
const finished = (R, mode) => R.some(r => r.mode === mode && r.completed)
const ratio = (r) => (r.total ? r.correct / r.total : 0)
const bestRatio = (R, mode) => R.filter(r => r.mode === mode && r.completed).reduce((m, r) => Math.max(m, ratio(r)), 0)
// Built on first use: QuizHub ↔ results ↔ this file import each other, so nothing at load time
let catMap = null
const catOf = (id) => (catMap ??= Object.fromEntries(QUIZ_ITEMS.map(q => [q.id, q.cat])))[id]
const famOf = (id) => QUIZ_CATEGORIES.find(c => c.id === catOf(id))?.family
// Quizzes with a clear right/wrong count (no arcade or puzzle scoring)
const SCORED = () => QUIZ_ITEMS.filter(q => !['arcade', 'puzzles'].includes(q.cat) && !QUIZ_EXCLUDE.has(q.id))
const gameLabel = (id) => playableGames().find(g => g.id === id)?.label ?? id
const daysGames = (day) => gamesOfTheDay(dayNumber(day)).map(g => g.id)
const pct = (x) => `${Math.round(x * 100)}%`

/**
 * Templates. make(rand, day) → a challenge: { key, tier, mode, target, task(), value(R, ctx) }
 *   key   — unique per day, so the same template can't show up twice
 *   ctx   — { played: Set of modes played before that day, best: Map mode → best score before }
 *   needsHistory — only offered to players who've played something before
 */
const TEMPLATES = {
  easy: [
    { w: 3, make: (rand) => { const c = pickOf(rand, LEGACY_POOL.filter(x => x.slot === 'daily')); return { ...c, key: 'once-a-day', task: () => c.task(1) } } },
    { w: 3, make: (rand, day) => { const id = pickOf(rand, daysGames(day)); return {
      key: 'game', mode: id, target: 1, task: () => t('Finish a round of “{game}”', { game: gameLabel(id) }), value: R => finished(R, id) ? 1 : 0 } } },
    { w: 2, make: (rand) => { const c = pickOf(rand, QUIZ_CATEGORIES); return {
      key: 'category', mode: 'quiz-hub', target: 1, task: () => t('Finish a quiz from {cat}', { cat: c.label }),
      value: R => R.some(r => r.completed && catOf(r.mode) === c.id) ? 1 : 0 } } },
    { w: 2, make: (rand) => { const n = pickOf(rand, [25, 30, 40]); return {
      key: 'answers', mode: 'quiz-hub', target: n, task: () => t('Give {n} correct answers in any games', { n }), value: R => R.reduce((s, r) => s + (r.correct ?? 0), 0) } } },
  ],
  medium: [
    { w: 4, make: (rand) => { const q = pickOf(rand, SCORED()); return {
      key: 'game', mode: q.id, target: 1, task: () => t('Score {p} or more in “{game}”', { p: pct(0.8), game: q.label }), value: R => bestRatio(R, q.id) >= 0.8 ? 1 : 0 } } },
    { w: 2, make: (rand, day) => { const ids = daysGames(day); return {
      key: 'today', mode: ids[0], modes: ids, target: 3, task: () => t('Play {n} of the Games of the day', { n: 3 }), value: R => ids.filter(id => R.some(r => r.mode === id)).length } } },
    { w: 2, make: (rand) => { const f = pickOf(rand, QUIZ_FAMILIES); return {
      key: 'category', mode: 'quiz-hub', target: 2, task: () => t('Finish {n} different quizzes from {cat}', { n: 2, cat: f.label }),
      value: R => new Set(R.filter(r => r.completed && famOf(r.mode) === f.id).map(r => r.mode)).size } } },
    { w: 2, make: () => ({ key: 'new', mode: null, target: 1, task: () => t('Try a game you\'ve never played'),
      value: (R, ctx) => R.some(r => !ctx.played.has(r.mode)) ? 1 : 0 }) },
    { w: 3, make: (rand) => { const c = pickOf(rand, LEGACY_POOL.filter(x => x.slot === 'skill')); return { ...c, key: 'skill', task: () => c.task(c.target) } } },
    { w: 1, make: () => ({ key: 'variety', mode: 'quiz-hub', target: 3, task: () => t('Play {n} different games', { n: 3 }), value: R => new Set(R.map(r => r.mode)).size }) },
  ],
  hard: [
    { w: 3, make: (rand) => { const q = pickOf(rand, SCORED()); return {
      key: 'game', mode: q.id, target: 1, task: () => t('Score {p} or more in “{game}”', { p: pct(0.9), game: q.label }), value: R => bestRatio(R, q.id) >= 0.9 ? 1 : 0 } } },
    { w: 2, needsHistory: true, make: () => ({ key: 'record', mode: null, target: 1, task: () => t('Beat your best score in a game you\'ve played before'),
      value: (R, ctx) => R.some(r => r.completed && ctx.best.get(r.mode) > 0 && r.score > ctx.best.get(r.mode)) ? 1 : 0 }) },
    { w: 2, make: (rand, day) => { const ids = daysGames(day); return {
      key: 'today', mode: ids[0], modes: ids, target: 6, task: () => t('Play {n} of the Games of the day', { n: 6 }), value: R => ids.filter(id => R.some(r => r.mode === id)).length } } },
    { w: 2, make: (rand) => { const n = pickOf(rand, [80, 100, 120]); return {
      key: 'answers', mode: 'quiz-hub', target: n, task: () => t('Give {n} correct answers in any games', { n }), value: R => R.reduce((s, r) => s + (r.correct ?? 0), 0) } } },
    { w: 1, make: (rand) => { const n = pickOf(rand, [5, 6]); return {
      key: 'variety', mode: 'quiz-hub', target: n, task: () => t('Finish {n} games', { n }), value: R => R.filter(r => r.completed).length } } },
    { w: 2, make: (rand) => { const c = pickOf(rand, LEGACY_POOL.filter(x => HARD_SKILLS.has(x.id))); const n = Math.round(c.target * 1.6 / 5) * 5; return { ...c, key: 'skill', target: n, task: () => c.task(n) } } },
  ],
}

// Count-based skills that still make sense with a ×1.6 target
const HARD_SKILLS = new Set(['flags-15', 'capitals-20', 'name-all-40', 'caps-all-25', 'neighbors', 'higher-lower'])

function weighted(rand, xs) {
  const total = xs.reduce((s, x) => s + x.w, 0)
  let r = rand() * total
  for (const x of xs) { if ((r -= x.w) < 0) return x }
  return xs[xs.length - 1]
}

const cache = new Map()
/** The three challenges for a date key "YYYY-MM-DD" (the same for everyone). */
export function challengesFor(day, hasHistory = true) {
  const ck = `${day}|${hasHistory}`
  if (cache.has(ck)) return cache.get(ck)
  let list
  if (day < NEW_FROM) {
    const rand = rng(`orbis-challenges-${day}`)
    const pick = (slot) => { const xs = LEGACY_POOL.filter(c => c.slot === slot); return xs[Math.floor(rand() * xs.length)] }
    list = [pick('daily'), pick('skill'), pick('general')].map(c => ({ ...c, tier: null, xp: LEGACY_XP, task: () => c.task(c.target) }))
  } else {
    const rand = rng(`geofeverr-quests-${day}`)
    const used = new Set()
    list = ['easy', 'medium', 'hard'].map(tier => {
      let c
      for (let tries = 0; tries < 20; tries++) {
        const tpl = weighted(rand, TEMPLATES[tier])
        if (tpl.needsHistory && !hasHistory) continue
        c = tpl.make(rand, day)
        if (!used.has(c.key)) break
      }
      used.add(c.key)
      return { ...c, id: `${tier}-${c.key}-${c.id ?? c.mode ?? ''}`, tier, xp: TIER_XP[tier] }
    })
  }
  cache.set(ck, list)
  return list
}

// ── History context ────────────────────────────────────────────────────────
/** For each day with results (ascending): that day's results and what was played before it. */
function daysWithContext(results) {
  const byDay = new Map()
  for (const r of results) {
    if (r.details?.untimed) continue
    const d = resultDay(r)
    if (!byDay.has(d)) byDay.set(d, [])
    byDay.get(d).push(r)
  }
  const days = [...byDay.keys()].sort()
  const played = new Set(), best = new Map()
  const out = []
  for (const d of days) {
    const R = byDay.get(d)
    out.push({ day: d, R, ctx: { played: new Set(played), best: new Map(best) } })
    for (const r of R) {
      played.add(r.mode)
      if (r.completed) best.set(r.mode, Math.max(best.get(r.mode) ?? 0, r.score ?? 0))
    }
  }
  return out
}

function statusOf(day, R, ctx) {
  const hasHistory = ctx.played.size > 0
  return challengesFor(day, hasHistory).map(c => {
    const value = Math.min(c.value(R, ctx), c.target)
    // Where the button takes you: for "something new" — the first never-played game of the day
    let mode = c.mode
    if (!mode) {
      const fresh = daysGames(day).filter(id => !ctx.played.has(id))
      mode = c.key === 'record' ? ([...ctx.best.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'quiz-hub') : (fresh[0] ?? 'quiz-hub')
    }
    return { id: c.id, icon: c.icon, tier: c.tier, xp: c.xp, mode, target: c.target, task: c.task(), value, done: value >= c.target }
  })
}

/** Progress of a day's challenges given ALL results (newest first). */
export function challengeStatus(results, day = todayKey()) {
  const ctxDays = daysWithContext(results)
  const hit = ctxDays.find(x => x.day === day)
  if (hit) return statusOf(day, hit.R, hit.ctx)
  // No results that day yet: context = everything before it
  const played = new Set(), best = new Map()
  for (const { day: d, R } of ctxDays) {
    if (d >= day) break
    for (const r of R) { played.add(r.mode); if (r.completed) best.set(r.mode, Math.max(best.get(r.mode) ?? 0, r.score ?? 0)) }
  }
  return statusOf(day, [], { played, best })
}

/** { day: { done, xp } } for every day with results. */
export function challengeHistory(results) {
  const out = {}
  for (const { day, R, ctx } of daysWithContext(results)) {
    const st = statusOf(day, R, ctx)
    const done = st.filter(c => c.done)
    out[day] = { done: done.length, xp: done.reduce((s, c) => s + c.xp, 0) + (done.length === st.length ? ALL_DONE_BONUS : 0) }
  }
  return out
}

// ── Streak ─────────────────────────────────────────────────────────────────
// A day counts when at least one challenge is done. One missed day every 7 is forgiven
// (the "shield"), so a long streak doesn't die over a single busy evening.
const SHIELD_EVERY = 7
const shift = (key, n) => { const [y, m, d] = key.split('-').map(Number); return dateKey(new Date(y, m - 1, d + n)) }

export function streakInfo(results, hist = challengeHistory(results)) {
  const active = (k) => (hist[k]?.done ?? 0) > 0
  const today = todayKey()
  let d = active(today) ? today : shift(today, -1)
  let streak = 0, lastShield = null
  const shielded = []
  const first = Object.keys(hist).sort()[0]
  while (first && d >= first) {
    if (active(d)) { streak++; d = shift(d, -1); continue }
    // A gap: forgiven if the day before it was played and no shield was used in the 7 days after
    const prev = shift(d, -1)
    const recentShield = lastShield && dayNumber(lastShield) - dayNumber(d) < SHIELD_EVERY
    if ((streak > 0 || d === shift(today, -1)) && active(prev) && !recentShield) { shielded.push(d); lastShield = d; d = prev; continue }
    break
  }
  // Is a shield ready for the next miss? (none used in the last 7 days)
  const lastUsed = shielded[0]
  const shieldIn = lastUsed ? Math.max(0, SHIELD_EVERY - (dayNumber(today) - dayNumber(lastUsed))) : 0
  return { streak, shielded: new Set(shielded), shieldReady: shieldIn === 0, shieldIn }
}

/** Kept for older callers: just the number. */
export function challengeStreak(results) { return streakInfo(results).streak }
