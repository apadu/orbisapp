/**
 * "Tripoints" quizzes: a zoomed-in 2D map around a point where three countries meet —
 * name all three. 10 tripoints per quiz, numbered #1, #2…
 */
import { TRIPOINTS } from '../data/tripoints'
import { t } from '../i18n'

export const PER_QUIZ = 10

function seeded(seed) {
  let s = seed
  return () => { s = (s * 9301 + 49297) % 233280; return s / 233280 }
}

// Fixed shuffle (the same #3 for everyone), then fill each quiz so no country shows up
// more than twice in it — otherwise a quiz could be half China.
const pool = [...TRIPOINTS].sort((a, b) => a.countries.join().localeCompare(b.countries.join()))
const rnd = seeded(2026)
for (let i = pool.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [pool[i], pool[j]] = [pool[j], pool[i]] }
const count = Math.floor(pool.length / PER_QUIZ)
const sets = []
for (let q = 0; q < count; q++) {
  const set = [], uses = {}
  for (let pass = 0; set.length < PER_QUIZ && pass < 2; pass++) {
    for (let i = 0; i < pool.length && set.length < PER_QUIZ; i++) {
      const tp = pool[i]
      if (pass === 0 && tp.countries.some(n => (uses[n] ?? 0) >= 2)) continue
      set.push(tp); pool.splice(i--, 1)
      for (const n of tp.countries) uses[n] = (uses[n] ?? 0) + 1
    }
  }
  sets.push(set)
}

export const TRIPOINT_QUIZZES = Object.fromEntries(sets.map((points, i) => [`tripoints-${i + 1}`, {
  id: `tripoints-${i + 1}`,
  num: i + 1,
  title: `${t('Tripoints')} #${i + 1}`,
  prompt: t('Name the three countries that meet at each point'),
  // file: the pre-rendered map, public/data/tripoints/<index in TRIPOINTS>.json
  points: points.map((p, k) => ({ ...p, id: `${i + 1}-${k}`, file: TRIPOINTS.indexOf(p) })),
}]))
export const TRIPOINT_IDS = new Set(Object.keys(TRIPOINT_QUIZZES))
