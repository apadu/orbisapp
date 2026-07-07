/** Simple seeded pseudo-random (mulberry32) */
function mulberry32(seed) {
  return function () {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed)
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t
    return ((t ^ t >>> 14) >>> 0) / 4294967296
  }
}

/** Returns a numeric seed for today's date (YYYYMMDD as integer) */
export function todaySeed() {
  const d = new Date()
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate()
}

/** Pick today's mystery country deterministically from the feature list */
export function pickDailyCountry(features) {
  if (!features.length) return null
  const rand = mulberry32(todaySeed())
  const idx  = Math.floor(rand() * features.length)
  return features[idx]
}

/** Return today's date as a readable string e.g. "July 3, 2026" */
export function todayLabel() {
  return new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}
