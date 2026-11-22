/**
 * Tiny i18n: English source strings are the keys.
 *   t('Play again')                → 'Joacă din nou' (in Romanian)
 *   t('Round {n}/{total}', { n })  → interpolation with {name} placeholders
 * Switching language reloads the page, so module-level constants (catalogues,
 * rules arrays…) are translated once at load time and everything stays consistent.
 */
// The dictionaries are loaded only for the language in use (main.jsx waits for loadLanguage()
// before importing the app), so English players don't download the Romanian strings.
import { COUNTRY_RO } from './countriesRo'
let DICT = {}
let COUNTRY = COUNTRY_RO
/** Per-language name tables for capitals, currencies, seas… (see names.js); filled by loadLanguage(). */
export const langData = { names: null, countries: null, countryAliases: null }

const KEY = 'orbis-lang'
export const LANGS = [{ id: 'en', label: 'English', flag: '🇬🇧' }, { id: 'ro', label: 'Română', flag: '🇷🇴' }, { id: 'es', label: 'Español', flag: '🇪🇸', beta: true }]   // beta: the country pages and their quizzes are still in English

function readLang() {
  try { const l = localStorage.getItem(KEY); return l === 'ro' || l === 'es' ? l : 'en' } catch { return 'en' }
}
export const lang = readLang()
export const isRo = lang === 'ro'
export const isEs = lang === 'es'

if (typeof document !== 'undefined') document.documentElement.lang = lang

export function setLang(l) {
  try { localStorage.setItem(KEY, l) } catch {}
  if (typeof window !== 'undefined') window.location.reload()
}

/** Load the current language's dictionaries. Must finish before any module calls t() at load time. */
export async function loadLanguage() {
  if (lang === 'ro') {
    const [ro, names] = await Promise.all([import('./ro'), import('./namesRo')])
    DICT = ro.RO
    langData.names = names
    langData.countries = COUNTRY_RO
  } else if (lang === 'es') {
    // Spanish: interface and country names; quiz content without a Spanish version stays in English
    const [es, countries] = await Promise.all([import('./es'), import('./countriesEs')])
    DICT = es.ES
    COUNTRY = countries.COUNTRY_ES
    langData.countries = countries.COUNTRY_ES
    langData.countryAliases = countries.ES_ALIASES
  }
}

const fill = (s, vars) => vars ? s.replace(/\{(\w+)\}/g, (m, k) => (vars[k] ?? m)) : s

export function t(s, vars) {
  if (s == null) return s
  if (lang === 'en') return fill(s, vars)
  return fill(DICT[s] ?? s, vars)
}

/** Country name for display in the current language (keys stay English everywhere). */
export function cn(name) {
  if (lang === 'en' || !name) return name
  return COUNTRY[name] ?? name
}

/** Continent label. */
const CONT_RO = { Africa: 'Africa', Americas: 'Americi', Asia: 'Asia', Europe: 'Europa', Oceania: 'Oceania', World: 'Lume', 'North America': 'America de Nord', 'South America': 'America de Sud', Antarctica: 'Antarctica' }
const CONT_ES = { Africa: 'África', Americas: 'América', Asia: 'Asia', Europe: 'Europa', Oceania: 'Oceanía', World: 'Mundo', 'North America': 'América del Norte', 'South America': 'América del Sur', Antarctica: 'Antártida' }
export function continentName(c) {
  return isRo ? (CONT_RO[c] ?? c) : isEs ? (CONT_ES[c] ?? c) : c
}

/** Locale for number/date formatting. */
export const locale = isRo ? 'ro-RO' : isEs ? 'es-ES' : 'en-US'
