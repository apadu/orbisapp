import { COUNTRY_PAGES } from '../data/countryPages'
import { DONE_AT } from './countryProgress'
import { flagCode } from './flags'
import { t } from '../i18n'

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
    // when each type was reached (a citizenship visa was a residence and a tourist visa before)
    const dates = {}
    if (half.length) dates[1] = earliest(half.map(g => firstHalf[g]))
    if (games.length && half.length === games.length) dates[2] = latest(games.map(g => firstHalf[g]))
    if (games.length && games.every(g => g in firstFull)) dates[3] = latest(games.map(g => firstFull[g]))
    const tier = dates[3] ? 3 : dates[2] ? 2 : dates[1] ? 1 : 0
    return { id, code: flagCode(c.page.flag), page: c.page, games, done: half.length, total: games.length, tier, date: dates[tier] ?? null, dates }
  })
}

/**
 * Regional visas: one per continent, for holding a visa of every country page in it.
 * Its type is the lowest among those visas (all tourist → tourist, all residence → residence…).
 * Russia counts as Europe and Turkey as Asia (where most of their people live / as in Natural Earth).
 */
export const REGIONS = [
  { id: 'europe',   code: 'EUR', name: () => t('Europe'),        members: ['ro', 'md', 'hu', 'pl', 'de', 'fr', 'it', 'es', 'pt', 'gb', 'gr', 'se', 'ru', 'nl', 'ua', 'at', 'bg', 'ch', 'cz', 'be', 'sk', 'ie'] },
  { id: 'asia',     code: 'ASI', name: () => t('Asia'),          members: ['cn', 'in', 'ir', 'jp', 'kr', 'th', 'tr', 'sa', 'my', 'lk', 'mn'] },
  { id: 'africa',   code: 'AFR', name: () => t('Africa'),        members: ['eg', 'ng', 'za', 'ke', 'gh', 'tn', 'sn', 'cm'] },
  { id: 'namerica', code: 'NAM', name: () => t('North America'), members: ['us', 'ca', 'mx'] },
  { id: 'samerica', code: 'SAM', name: () => t('South America'), members: ['ar', 'br', 'co', 'pe', 'cl', 'ec', 'bo'] },
  { id: 'oceania',  code: 'OCE', name: () => t('Oceania'),       members: ['au', 'nz'] },
]

export function computeRegionalVisas(visas) {
  const byPage = Object.fromEntries(visas.map(v => [v.id.replace(/^country-/, ''), v]))
  return REGIONS.map(r => {
    const members = r.members.map(m => byPage[m]).filter(Boolean)
    const tier = members.length ? Math.min(...members.map(v => v.tier)) : 0
    const date = tier ? members.map(v => v.dates[tier]).reduce((a, b) => (a > b ? a : b)) : null
    return { ...r, members, tier, date, done: members.filter(v => v.tier > 0).length, total: members.length }
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
