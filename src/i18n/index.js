/**
 * Tiny i18n: English source strings are the keys.
 *   t('Play again')                → 'Joacă din nou' (in Romanian)
 *   t('Round {n}/{total}', { n })  → interpolation with {name} placeholders
 * Switching language reloads the page, so module-level constants (catalogues,
 * rules arrays…) are translated once at load time and everything stays consistent.
 */
import { RO } from './ro'
import { COUNTRY_RO } from './countriesRo'

const KEY = 'orbis-lang'
export const LANGS = [{ id: 'en', label: 'English', flag: '🇬🇧' }, { id: 'ro', label: 'Română', flag: '🇷🇴' }]

function readLang() {
  try { return localStorage.getItem(KEY) === 'ro' ? 'ro' : 'en' } catch { return 'en' }
}
export const lang = readLang()
export const isRo = lang === 'ro'

if (typeof document !== 'undefined') document.documentElement.lang = lang

export function setLang(l) {
  try { localStorage.setItem(KEY, l) } catch {}
  if (typeof window !== 'undefined') window.location.reload()
}

const fill = (s, vars) => vars ? s.replace(/\{(\w+)\}/g, (m, k) => (vars[k] ?? m)) : s

export function t(s, vars) {
  if (s == null) return s
  if (!isRo) return fill(s, vars)
  return fill(RO[s] ?? s, vars)
}

/** Country name for display in the current language (keys stay English everywhere). */
export function cn(name) {
  if (!isRo || !name) return name
  return COUNTRY_RO[name] ?? name
}

/** Continent label. */
const CONT_RO = { Africa: 'Africa', Americas: 'Americi', Asia: 'Asia', Europe: 'Europa', Oceania: 'Oceania', World: 'Lume', 'North America': 'America de Nord', 'South America': 'America de Sud', Antarctica: 'Antarctica' }
export function continentName(c) {
  return isRo ? (CONT_RO[c] ?? c) : c
}

/** Locale for number/date formatting. */
export const locale = isRo ? 'ro-RO' : 'en-US'
