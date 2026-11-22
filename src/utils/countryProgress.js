import { loadResults } from './results'
import { COUNTRY_PAGES } from '../data/countryPages'

/** A game counts as done from this share of correct answers (a give-up at 2/20 doesn't). */
export const DONE_AT = 0.5

/** Best accuracy per mode from saved results (untimed games don't count) */
export function bestByMode(results = loadResults()) {
  const best = {}
  for (const r of results) {
    if (!r.total || r.details?.untimed) continue
    const acc = r.correct / r.total
    if (!(r.mode in best) || acc > best[r.mode]) best[r.mode] = acc
  }
  return best
}

/**
 * Progress of one country page: { done, total, status }
 * status: 'none' (nothing played) · 'partial' · 'done' (every game ≥ DONE_AT) · 'perfect' (every game 100%)
 */
export function countryProgress(pageId, best = bestByMode()) {
  const games = COUNTRY_PAGES[pageId]?.games ?? []
  const done = games.filter(g => (best[g] ?? -1) >= DONE_AT).length
  const played = games.some(g => g in best)
  const perfect = games.length > 0 && games.every(g => best[g] === 1)
  const status = perfect ? 'perfect' : games.length && done === games.length ? 'done' : played ? 'partial' : 'none'
  return { done, total: games.length, status }
}
