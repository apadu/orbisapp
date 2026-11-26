import { COUNTRY_PAGES } from '../data/countryPages'
import { DONE_AT } from './countryProgress'
import { flagCode } from './flags'

/**
 * Visas in the passport, one per country page, worked out from the saved results
 * (they're shown only to their owner, like the progress map, so the browser's word is enough).
 *
 * tier 1 · tourist visa   at least one of the country's games finished (≥ half right)
 * tier 2 · residence      every game of the country finished
 * tier 3 · citizenship    every game of the country at 100%
 * date: when the current tier was reached.
 */
export const VISA_TIERS = 3

export function computeVisas(results) {
  // earliest date each game first reached half right / 100% (untimed practice doesn't count)
  const firstHalf = {}, firstFull = {}
  for (let i = results.length - 1; i >= 0; i--) {           // oldest first
    const r = results[i]
    if (!r.total || r.details?.untimed) continue
    const acc = r.correct / r.total
    if (acc >= DONE_AT && !(r.mode in firstHalf)) firstHalf[r.mode] = r.played_at
    if (acc >= 1 && !(r.mode in firstFull)) firstFull[r.mode] = r.played_at
  }
  const latest = (dates) => dates.reduce((a, b) => (a > b ? a : b))
  const earliest = (dates) => dates.reduce((a, b) => (a < b ? a : b))

  return Object.entries(COUNTRY_PAGES).map(([id, c]) => {
    const games = c.games ?? []
    const half = games.filter(g => g in firstHalf)
    let tier = 0, date = null
    if (games.length && games.every(g => g in firstFull)) { tier = 3; date = latest(games.map(g => firstFull[g])) }
    else if (games.length && half.length === games.length) { tier = 2; date = latest(games.map(g => firstHalf[g])) }
    else if (half.length) { tier = 1; date = earliest(half.map(g => firstHalf[g])) }
    return { id, code: flagCode(c.page.flag), page: c.page, games, done: half.length, total: games.length, tier, date }
  })
}

/** A stable, passport-looking number from any id: GF·1234567 */
export function docNumber(seed, prefix = 'GF') {
  let h = 2166136261
  for (const ch of String(seed ?? 'guest')) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619) }
  return `${prefix}${String((h >>> 0) % 10000000).padStart(7, '0')}`
}

/** The machine-readable lines at the bottom of the identity page (44 characters each). */
export function mrzLines({ name, number, level, joined }) {
  const clean = (s) => (s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase().replace(/[^A-Z0-9]/g, '<')
  const pad = (s) => (s + '<'.repeat(44)).slice(0, 44)
  const d = joined ? new Date(joined) : null
  const yymmdd = d ? `${String(d.getUTCFullYear()).slice(2)}${String(d.getUTCMonth() + 1).padStart(2, '0')}${String(d.getUTCDate()).padStart(2, '0')}` : '000000'
  return [
    pad(`P<GFV${clean(name)}<<EXPLORER`),
    pad(`${clean(number)}<GFV${yymmdd}<<LVL${String(level).padStart(3, '0')}`),
  ]
}
