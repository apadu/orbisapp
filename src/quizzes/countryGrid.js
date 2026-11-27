/**
 * Country Grid: a daily 3×3 board. Each row and each column is a criterion ("in Africa",
 * "landlocked", "flag with green"…); a cell takes a country that meets both.
 *
 * The board is generated from the day number (the same for everyone): six criteria from six
 * different families, and every cell must have at least MIN_ANSWERS countries that fit.
 * Criteria never depend on the language of the name, so the board is fair in every language.
 */
import { t } from '../i18n'
import { COUNTRY_INFO } from '../utils/countryInfo'
import { POPULATION } from '../utils/population'
import { COUNTRY_AREA } from '../utils/countryArea'
import { FLAG_COLORS } from '../utils/flagColors'
import { COUNTRY_LANGUAGES } from '../utils/countryLanguages'
import { GRID_SETS } from './listQuizzes'
import { dailyNumber } from './daily'

export const GRID_TRIES = 9
const MIN_ANSWERS = 3

/** Grid #1 is 27 November 2026 (Daily Fever #33). */
const GRID_OFFSET = 32
export const gridNumber = (now = Date.now()) => dailyNumber(now) - GRID_OFFSET

// Flags missing from FLAG_COLORS (main colours, emblems left out)
const EXTRA_FLAG_COLORS = {
  'Cabo Verde': ['Blue', 'White', 'Red', 'Yellow'], Congo: ['Green', 'Yellow', 'Red'],
  'Guinea-Bissau': ['Red', 'Yellow', 'Green', 'Black'], Seychelles: ['Blue', 'Yellow', 'Red', 'White', 'Green'],
  'Antigua and Barbuda': ['Red', 'Black', 'Blue', 'White', 'Yellow'], Barbados: ['Blue', 'Yellow', 'Black'],
  Dominica: ['Green', 'Yellow', 'Black', 'White', 'Red'], Grenada: ['Red', 'Yellow', 'Green'],
  Guyana: ['Green', 'White', 'Yellow', 'Black', 'Red'], Haiti: ['Blue', 'Red', 'White'],
  'Saint Kitts and Nevis': ['Green', 'Red', 'Black', 'Yellow', 'White'], 'Saint Lucia': ['Blue', 'Yellow', 'Black', 'White'],
  'Saint Vincent and the Grenadines': ['Blue', 'Yellow', 'Green'], 'United States of America': ['Red', 'White', 'Blue'],
  Palestine: ['Black', 'White', 'Green', 'Red'], Singapore: ['Red', 'White'], Andorra: ['Blue', 'Yellow', 'Red'],
  Monaco: ['Red', 'White'], 'San Marino': ['White', 'Blue'], Vatican: ['Yellow', 'White'],
  Kiribati: ['Red', 'Yellow', 'Blue', 'White'], 'Marshall Islands': ['Blue', 'Orange', 'White'],
  'Federated States of Micronesia': ['Blue', 'White'], Nauru: ['Blue', 'Yellow', 'White'], Palau: ['Blue', 'Yellow'],
  'Solomon Islands': ['Blue', 'Green', 'Yellow', 'White'], Tuvalu: ['Blue', 'Red', 'White', 'Yellow'],
}
const COLOR_GROUP = { Red: 'red', Maroon: 'red', Green: 'green', Blue: 'blue', 'Sky Blue': 'blue', Aqua: 'blue', Yellow: 'yellow', Gold: 'yellow' }
function flagHas(name, color) {
  const list = FLAG_COLORS[name]?.map(c => c.name) ?? EXTRA_FLAG_COLORS[name]
  return !!list?.some(c => COLOR_GROUP[c] === color)
}

// Language data is keyed by a few other spellings
const LANG_KEY = { 'Czech Republic': 'Czechia', 'Sao Tome and Principe': 'São Tomé and Príncipe' }
const EXTRA_LANGS = { Palestine: ['Arabic'], Vatican: ['Italian', 'Latin'] }
const speaks = (name, lang) => (COUNTRY_LANGUAGES[name] ?? COUNTRY_LANGUAGES[LANG_KEY[name]] ?? EXTRA_LANGS[name] ?? []).includes(lang)

const inSet = (key) => { const s = new Set(GRID_SETS[key]); return (n) => s.has(n) }
const continent = (c) => (n) => COUNTRY_INFO[n]?.continent === c

/** Every criterion: id, family (no two from one family on a board), label, icon, test(name). */
export const CRITERIA = [
  { id: 'africa',   fam: 'continent', icon: 'globe', label: () => t('Africa'), test: continent('Africa') },
  { id: 'americas', fam: 'continent', icon: 'globe', label: () => t('Americas'), test: continent('Americas') },
  { id: 'asia',     fam: 'continent', icon: 'globe', label: () => t('Asia'), test: continent('Asia') },
  { id: 'europe',   fam: 'continent', icon: 'globe', label: () => t('Europe'), test: continent('Europe') },

  { id: 'landlocked', fam: 'geo', icon: 'mountain', label: () => t('Landlocked'), test: inSet('landlocked') },
  { id: 'island',     fam: 'geo', icon: 'island', label: () => t('Island nation'), test: inSet('island') },
  { id: 'equator',    fam: 'geo', icon: 'equator', label: () => t('On the Equator'), test: inSet('equator') },

  { id: 'red',    fam: 'flag', icon: 'flag', label: () => t('Red in the flag'), test: n => flagHas(n, 'red') },
  { id: 'green',  fam: 'flag', icon: 'flag', label: () => t('Green in the flag'), test: n => flagHas(n, 'green') },
  { id: 'blue',   fam: 'flag', icon: 'flag', label: () => t('Blue in the flag'), test: n => flagHas(n, 'blue') },
  { id: 'yellow', fam: 'flag', icon: 'flag', label: () => t('Yellow in the flag'), test: n => flagHas(n, 'yellow') },

  { id: 'cross',    fam: 'symbol', icon: 'flag', label: () => t('Cross on the flag'), test: inSet('flagCross') },
  { id: 'crescent', fam: 'symbol', icon: 'flag', label: () => t('Crescent on the flag'), test: inSet('flagCrescent') },
  { id: 'sun',      fam: 'symbol', icon: 'flag', label: () => t('Sun on the flag'), test: inSet('flagSun') },

  { id: 'pop-big',   fam: 'pop', icon: 'people', label: () => t('Over 50 million people'), test: n => (POPULATION[n] ?? 0) > 50 },
  { id: 'pop-small', fam: 'pop', icon: 'people', label: () => t('Under 5 million people'), test: n => (POPULATION[n] ?? Infinity) < 5 },

  { id: 'area-big',   fam: 'area', icon: 'expand', label: () => t('Over 1 million km²'), test: n => (COUNTRY_AREA[n] ?? 0) > 1e6 },
  { id: 'area-small', fam: 'area', icon: 'expand', label: () => t('Under 50,000 km²'), test: n => (COUNTRY_AREA[n] ?? Infinity) < 50000 },

  { id: 'eu',   fam: 'club', icon: 'star', label: () => t('EU member'), test: inSet('eu') },
  { id: 'nato', fam: 'club', icon: 'shield', label: () => t('NATO member'), test: inSet('nato') },
  { id: 'g20',  fam: 'club', icon: 'star', label: () => t('In the G20'), test: inSet('g20') },
  { id: 'euro', fam: 'club', icon: 'coin', label: () => t('Uses the euro'), test: inSet('euro') },

  { id: 'monarchy', fam: 'state', icon: 'crown', label: () => t('Has a monarch'), test: inSet('monarchy') },
  { id: 'left',     fam: 'state', icon: 'car', label: () => t('Drives on the left'), test: inSet('driveLeft') },

  { id: 'english', fam: 'lang', icon: 'speech', label: () => t('English is official'), test: n => speaks(n, 'English') },
  { id: 'french',  fam: 'lang', icon: 'speech', label: () => t('French is official'), test: inSet('french') },
  { id: 'spanish', fam: 'lang', icon: 'speech', label: () => t('Spanish is official'), test: inSet('spanish') },
  { id: 'arabic',  fam: 'lang', icon: 'speech', label: () => t('Arabic is official'), test: n => speaks(n, 'Arabic') },
]
const BY_ID = Object.fromEntries(CRITERIA.map(c => [c.id, c]))
export const criterion = (id) => BY_ID[id]

function mulberry(seed) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6D2B79F5) >>> 0
    let r = Math.imul(a ^ (a >>> 15), 1 | a)
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}

/** Countries that fit a cell. */
export const fits = (names, rowId, colId) => names.filter(n => BY_ID[rowId].test(n) && BY_ID[colId].test(n))

/**
 * The board for grid #n: { n, rows: [id×3], cols: [id×3] }. Deterministic: the same n and
 * country list always give the same board.
 */
export function gridFor(n, names) {
  const rnd = mulberry(n * 7919 + 17)
  for (let attempt = 0; attempt < 4000; attempt++) {
    const pool = [...CRITERIA]
    const pick = [], fams = new Set()
    while (pick.length < 6 && pool.length) {
      const c = pool.splice(Math.floor(rnd() * pool.length), 1)[0]
      if (fams.has(c.fam)) continue
      fams.add(c.fam); pick.push(c.id)
    }
    if (pick.length < 6) continue
    const rows = pick.slice(0, 3), cols = pick.slice(3)
    // a continent reads best as a row
    const ci = cols.findIndex(id => BY_ID[id].fam === 'continent')
    if (ci >= 0) { const r = rows[0]; rows[0] = cols[ci]; cols[ci] = r }
    if (rows.every(r => cols.every(c => fits(names, r, c).length >= MIN_ANSWERS))) return { n, rows, cols }
  }
  return null
}

/** Text for the share button: a 3×3 of squares. */
export function gridShareText(n, cells, link) {
  const rows = [0, 1, 2].map(r => [0, 1, 2].map(c => (cells[r * 3 + c] ? '🟩' : '⬜')).join(''))
  const filled = cells.filter(Boolean).length
  return [`GeoFeverr ${t('Country Grid')} #${n} · ${filled}/9`, ...rows, link].join('\n')
}
