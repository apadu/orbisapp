/**
 * Data + logic for the arcade games: Higher or Lower, True or False, Country Wordle.
 * Everything is generated from the data we already ship (no extra files).
 */
import { COUNTRY_INFO } from '../utils/countryInfo'
import { CAPITALS } from '../utils/capitals'
import { COUNTRY_CURRENCY } from '../utils/countryCurrency'
import { COUNTRY_LANGUAGES } from '../utils/countryLanguages'
import { POPULATION } from '../utils/population'
import { COUNTRY_AREA } from '../utils/countryArea'
import { ALIASES } from '../utils/aliases'
import { dailyNumber } from './daily'
import { t, cn, isRo, continentName, locale } from '../i18n'

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]
const DISPLAY = isRo ? { 'United States of America': 'SUA' } : { 'United States of America': 'United States' }
export const shortName = (n) => DISPLAY[n] ?? cn(n)

// ── Higher or Lower ────────────────────────────────────────────────────────
export const HL_STATS = {
  population: {
    label: t('Population'), icon: '👥', verb: 'people',
    value: (n) => POPULATION[n] != null ? POPULATION[n] * 1e6 : null,
    fmt: (v) => v >= 1e9 ? t('{n} billion', { n: (v / 1e9).toLocaleString(locale, { maximumFractionDigits: 2 }) }) : v >= 1e6 ? t('{n} million', { n: (v / 1e6).toLocaleString(locale, { maximumFractionDigits: 1 }) }) : t('{n} thousand', { n: Math.round(v / 1000).toLocaleString(locale) }),
  },
  area: {
    label: t('Area'), icon: '📏', verb: 'km²',
    value: (n) => COUNTRY_AREA[n] ?? null,
    fmt: (v) => `${(v < 10 ? v.toLocaleString(locale, { maximumFractionDigits: 1 }) : Math.round(v).toLocaleString(locale))} km²`,
  },
}

/** Countries that have the stat (and a flag). */
export function hlPool(countries, stat) {
  return countries.filter(n => COUNTRY_INFO[n]?.flag && HL_STATS[stat].value(n) > 0)
}

/** Next challenger: gets closer in value as the streak grows. */
export function hlNext(pool, current, stat, streak, exclude = new Set()) {
  const v = HL_STATS[stat].value(current)
  const minRatio = streak < 4 ? 2.5 : streak < 10 ? 1.4 : streak < 20 ? 1.15 : 1.03
  const ok = (n) => {
    if (n === current || exclude.has(n)) return false
    const w = HL_STATS[stat].value(n)
    if (!w) return false
    return Math.max(v, w) / Math.min(v, w) >= minRatio
  }
  const cands = pool.filter(ok)
  return cands.length ? pick(cands) : pick(pool.filter(n => n !== current && HL_STATS[stat].value(n) !== v))
}

// ── True or False ──────────────────────────────────────────────────────────
const sameContinent = (n, pool) => pool.filter(m => m !== n && COUNTRY_INFO[m]?.continent === COUNTRY_INFO[n]?.continent)
const CONTINENTS = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania']
const contLabel = (c) => isRo ? continentName(c) : (c === 'Americas' ? 'the Americas' : c)
const continentOf = (n) => COUNTRY_INFO[n]?.continent
// Debatable continent → never used in "X is in <continent>" statements
const TRANSCONTINENTAL = new Set(['Russia', 'Turkey', 'Cyprus', 'Georgia', 'Armenia', 'Azerbaijan', 'Kazakhstan', 'Egypt', 'Panama', 'Indonesia', 'Papua New Guinea', 'Timor-Leste', 'East Timor', 'Trinidad and Tobago', 'Greenland'])

const GENERATORS = [
  // Capital
  (pool) => {
    const n = pick(pool.filter(c => CAPITALS[c]))
    const truth = Math.random() < 0.5
    const others = sameContinent(n, pool).filter(m => CAPITALS[m])
    const cap = truth || !others.length ? CAPITALS[n][0] : CAPITALS[pick(others)][0]
    return { country: n, text: t('The capital of {c} is {cap}.', { c: shortName(n), cap }), truth: cap === CAPITALS[n][0], fix: t('Capital of {c}: {cap}', { c: shortName(n), cap: CAPITALS[n][0] }) }
  },
  // Continent
  (pool) => {
    const n = pick(pool.filter(c => !TRANSCONTINENTAL.has(c)))
    const real = continentOf(n)
    const truth = Math.random() < 0.5
    const cont = truth ? real : pick(CONTINENTS.filter(c => c !== real))
    return { country: n, text: t('{c} is in {cont}.', { c: shortName(n), cont: contLabel(cont) }), truth: cont === real, fix: t('{c} is in {cont}', { c: shortName(n), cont: contLabel(real) }) }
  },
  // Currency
  (pool) => {
    const n = pick(pool.filter(c => COUNTRY_CURRENCY[c]))
    const real = COUNTRY_CURRENCY[n].name
    const others = pool.filter(m => COUNTRY_CURRENCY[m] && COUNTRY_CURRENCY[m].name !== real)
    const near = others.filter(m => continentOf(m) === continentOf(n))
    const cur = Math.random() < 0.5 ? real : COUNTRY_CURRENCY[pick(near.length ? near : others)].name
    return { country: n, text: t('{c} uses the {cur}.', { c: shortName(n), cur }), truth: cur === real, fix: t('{c} uses the {cur}', { c: shortName(n), cur: real }) }
  },
  // Language
  (pool) => {
    const n = pick(pool.filter(c => COUNTRY_LANGUAGES[c]?.length))
    const langs = COUNTRY_LANGUAGES[n]
    let lang
    if (Math.random() < 0.5) lang = langs[0]
    else {
      const near = sameContinent(n, pool).flatMap(m => COUNTRY_LANGUAGES[m] ?? []).filter(l => !langs.includes(l))
      lang = near.length ? pick(near) : langs[0]
    }
    return { country: n, text: t('{lang} is an official language of {c}.', { lang, c: shortName(n) }), truth: langs.includes(lang), fix: `${shortName(n)}: ${langs.slice(0, 3).join(', ')}` }
  },
  // Population compare
  (pool) => compare(pool, 'population', (a, b) => t('{a} has more people than {b}.', { a: shortName(a), b: shortName(b) })),
  // Area compare
  (pool) => compare(pool, 'area', (a, b) => t('{a} is bigger than {b}.', { a: shortName(a), b: shortName(b) })),
  // Flag
  (pool) => {
    const n = pick(pool.filter(c => COUNTRY_INFO[c]?.flag))
    const others = sameContinent(n, pool).filter(m => COUNTRY_INFO[m]?.flag)
    const shown = Math.random() < 0.5 || !others.length ? n : pick(others)
    return { country: n, flag: COUNTRY_INFO[shown].flag, text: t('This is the flag of {c}.', { c: shortName(n) }), truth: shown === n, fix: shown === n ? null : t("That was {c}'s flag", { c: shortName(shown) }) }
  },
]

function compare(pool, stat, say) {
  const s = HL_STATS[stat]
  const ps = pool.filter(n => s.value(n) > 0)
  for (let k = 0; k < 30; k++) {
    const a = pick(ps), b = pick(ps)
    const va = s.value(a), vb = s.value(b)
    if (a === b || Math.max(va, vb) / Math.min(va, vb) < 1.25) continue
    return { country: a, text: say(a, b), truth: va > vb, fix: `${shortName(a)}: ${s.fmt(va)} · ${shortName(b)}: ${s.fmt(vb)}` }
  }
  return GENERATORS[1](pool)
}

/** A fresh statement, never repeating one in `seen` (by text). */
export function tfStatement(countries, seen = new Set()) {
  const pool = countries.filter(n => COUNTRY_INFO[n])
  for (let k = 0; k < 40; k++) {
    const s = pick(GENERATORS)(pool)
    if (s && !seen.has(s.text)) return s
  }
  return pick(GENERATORS)(pool)
}

// ── Country Wordle ─────────────────────────────────────────────────────────
export const WORDLE_TRIES = 6
export const letters = (s) => String(s).toUpperCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^A-Z]/g, '')

/** The word to guess for a country in the current language. */
export const wordleWord = (n) => letters(isRo ? cn(n) : n)

/** Possible answers: single-word country names, 4–9 letters. */
export function wordleTargets(countries) {
  return countries
    .filter(n => { const w = isRo ? cn(n) : n; return /^[\p{L}]+$/u.test(w) && letters(w).length >= 4 && letters(w).length <= 9 })
    .sort()
}

/** Every accepted guess (country names + aliases) by letter count → Map(LETTERS → country). */
export function wordleGuessMap(countries) {
  const map = new Map()
  for (const n of countries) map.set(letters(n), n)
  for (const n of countries) { const w = letters(cn(n)); if (!map.has(w)) map.set(w, n) }
  for (const [alias, canonical] of Object.entries(ALIASES)) {
    if (countries.includes(canonical) && !map.has(letters(alias))) map.set(letters(alias), canonical)
  }
  return map
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

/** Same country for everyone on a given UTC day; no repeats until the list is used up. */
export function dailyWordle(countries, n = dailyNumber()) {
  const targets = wordleTargets(countries)
  if (!targets.length) return null
  const cycle = Math.floor((n - 1) / targets.length)
  const order = [...targets]
  const rnd = seeded(424242 + cycle * 104729)
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]]
  }
  return { day: n, country: order[(n - 1) % order.length] }
}

/** Wordle colouring with correct handling of repeated letters. → ['hit'|'near'|'miss'] */
export function scoreGuess(guess, target) {
  const g = guess.split(''), t = target.split('')
  const res = Array(g.length).fill('miss')
  const left = {}
  t.forEach((ch, i) => { if (g[i] === ch) res[i] = 'hit'; else left[ch] = (left[ch] ?? 0) + 1 })
  g.forEach((ch, i) => {
    if (res[i] !== 'hit' && left[ch] > 0) { res[i] = 'near'; left[ch]-- }
  })
  return res
}

export function wordleShareText(day, rows, solved) {
  const grid = rows.map(r => r.map(c => c === 'hit' ? '🟩' : c === 'near' ? '🟨' : '⬛').join('')).join('\n')
  const where = typeof window !== 'undefined' ? (window.location?.origin ?? '') : ''
  return [`Orbis Wordle #${day} ${solved ? rows.length : 'X'}/${WORDLE_TRIES} 🌍`, grid, where].filter(Boolean).join('\n')
}

