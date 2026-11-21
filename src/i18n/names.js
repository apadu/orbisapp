/**
 * Names in the site language for capitals, currencies, languages, seas, rivers and
 * mountain ranges. Data files stay in English; these helpers give the display name and
 * the spellings accepted when typing (only the current language's — see utils/aliases.js).
 */
import { isRo, langData } from './index'

const list = (v) => (v == null ? [] : Array.isArray(v) ? v : [v])
// The tables (namesRo.js) are loaded with the language, so they're looked up on each call
const table = (name) => langData.names?.[name] ?? {}
const shown = (name) => (en) => (isRo && en != null ? list(table(name)[en])[0] ?? en : en)
const spellings = (name) => (en) => { if (!isRo) return [en]; const m = table(name); return m[en] != null ? list(m[en]) : [en] }

export const capName = shown('CAPITAL_RO')
export const curName = shown('CURRENCY_RO')
export const langName = shown('LANGUAGE_RO')
export const seaName = shown('SEA_RO')
export const riverName = shown('RIVER_RO')
export const rangeName = shown('MOUNTAIN_RO')

export const capSpellings = spellings('CAPITAL_RO')
export const curSpellings = spellings('CURRENCY_RO')
export const langSpellings = spellings('LANGUAGE_RO')
export const seaSpellings = spellings('SEA_RO')
export const riverSpellings = spellings('RIVER_RO')
export const rangeSpellings = spellings('MOUNTAIN_RO')

/** Every accepted capital for a country (its CAPITALS list), in the site language, deduplicated. */
export function capitalAnswers(capitals = []) {
  const seen = new Set(), out = []
  for (const c of capitals) for (const s of capSpellings(c)) {
    const k = s.toLowerCase()
    if (!seen.has(k)) { seen.add(k); out.push(s) }
  }
  return out
}

const fold = (s) => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')

/** Sea/gulf/bay name with the generic words dropped, in either language: "Gulf of Mexico" → "mexico", "Marea Neagră" → "neagra". */
export function seaKey(s) {
  return fold(s)
    .replace(/\b(the|of|ocean|sea|gulf|bay|channel|strait|sound|passage|bight|lake|marea|mare|marele|oceanul|golful|golf|stramtoarea|canalul|pasajul|lacul|a|al|ale|de|din)\b/g, '')
    .replace(/[^a-z]/g, '')
}
export const plainKey = (s) => fold(s).replace(/[^a-z0-9]/g, '')
