/**
 * Quiz of the day — the same quiz for every player on a given UTC day.
 *
 * The pool is every (quiz, region) combination of a playable size. Each "cycle"
 * through the pool is shuffled with a fixed seed, so nothing repeats until the
 * whole pool has been used, and every client computes the same schedule.
 */
import { TABLE_QUIZZES, REGIONS } from './tableQuizzes'

export const DAILY_EPOCH = Date.UTC(2026, 9, 26)   // 26 Oct 2026 = Daily #1
const DAY_MS = 86_400_000
const MIN_ROWS = 8
const MAX_ROWS = 60
const SAMPLE_SIZE = 20

export function dailyNumber(now = Date.now()) {
  return Math.floor((now - DAILY_EPOCH) / DAY_MS) + 1
}

export function msToNextDaily(now = Date.now()) {
  const next = DAILY_EPOCH + dailyNumber(now) * DAY_MS
  return next - now
}

export function utcDayStartISO(now = Date.now()) {
  return new Date(DAILY_EPOCH + (dailyNumber(now) - 1) * DAY_MS).toISOString()
}

function seeded(seed) {
  let t = seed >>> 0
  return () => {
    t += 0x6D2B79F5
    let r = Math.imul(t ^ (t >>> 15), 1 | t)
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r)
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}

let poolCache = null
function buildPool(countries) {
  const key = countries.length
  if (poolCache?.key === key) return poolCache.pool
  const pool = []
  for (const id of Object.keys(TABLE_QUIZZES).sort()) {
    const q = TABLE_QUIZZES[id]
    const regions = q.regions === false ? ['World'] : REGIONS
    for (const region of regions) {
      const n = q.build({ countries, region }).length
      if (q.sample) {
        if (n >= SAMPLE_SIZE) pool.push({ quizId: id, region, size: SAMPLE_SIZE })
      } else if (n >= MIN_ROWS && n <= MAX_ROWS) {
        pool.push({ quizId: id, region, size: n })
      }
    }
  }
  poolCache = { key, pool }
  return pool
}

/** The quiz for daily #n: { day, quizId, region, size, seed, title, icon } */
export function dailyQuizFor(n, countries) {
  const pool = buildPool(countries)
  if (!pool.length) return null
  const cycle = Math.floor((n - 1) / pool.length)
  const order = [...pool]
  const rnd = seeded(1000 + cycle * 7919)
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]]
  }
  const pick = order[(n - 1) % pool.length]
  const q = TABLE_QUIZZES[pick.quizId]
  return { day: n, ...pick, seed: n * 2654435761, title: q.title, icon: q.icon, prompt: q.prompt }
}

/** Wordle-style share text. */
export function dailyShareText({ day, title, region }, { score, total, durationMs }) {
  const pct = total ? score / total : 0
  const filled = Math.round(pct * 10)
  const bar = '🟩'.repeat(filled) + '⬛'.repeat(10 - filled)
  const s = Math.round(durationMs / 1000)
  const time = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
  const where = typeof window !== 'undefined' ? (window.location?.origin ?? '') : ''
  return [
    `Orbis Daily #${day} 🌍`,
    `${title}${region && region !== 'World' ? ` · ${region}` : ''}`,
    `${score}/${total} · ⏱ ${time}`,
    bar,
    where,
  ].filter(Boolean).join('\n')
}
