/**
 * JetPunk-style table quizzes.
 *
 * Every quiz is just data: a list of rows, each with a hint and the accepted answers.
 * One engine (TableQuiz.jsx) plays all of them: one input box, type answers in any order,
 * matching rows fill in, timer + give up, missed rows revealed in red.
 *
 * build(ctx) → rows: [{
 *   id, country,              // country feeds the knowledge map / XP
 *   hint: { type, value, sub } // 'text' | 'flag' | 'emoji' | 'colors' | 'script'
 *   extra?,                   // optional middle column (rank value, population…)
 *   answers: string[],        // accepted spellings
 *   display,                  // canonical answer shown when filled / revealed
 * }]
 *
 * sample: N → each play draws a random N rows (for puzzle-style quizzes with big pools)
 */
import { COUNTRY_INFO } from '../utils/countryInfo'
import { CAPITALS } from '../utils/capitals'
import { COUNTRY_CURRENCY } from '../utils/countryCurrency'
import { COUNTRY_LANGUAGES } from '../utils/countryLanguages'
import { POPULATION } from '../utils/population'
import { COUNTRY_AREA } from '../utils/countryArea'
import { ENDONYMS } from '../utils/endonyms'
import { EMOJI_CLUES } from '../utils/emojiClues'
import { COUNTRY_FACTS } from '../utils/countryFacts'
import { FLAG_COLORS } from '../utils/flagColors'
import { ALIASES, roAnswers } from '../utils/aliases'
import { LIST_QUIZZES } from './listQuizzes'
import { t, cn, isRo, locale } from '../i18n'

export const REGIONS = ['World', 'Africa', 'Americas', 'Asia', 'Europe', 'Oceania']

/** Lower-case, strip accents/punctuation/spaces — used for every comparison. */
export function norm(s) {
  return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]/g, '')
}

// Country name + every alias that maps to it
const aliasesByCountry = {}
for (const [alias, canonical] of Object.entries(ALIASES)) {
  (aliasesByCountry[canonical] ??= []).push(alias)
}
const countryAnswers = (name) => [name, ...(aliasesByCountry[name] ?? []), ...roAnswers(name)]

// Word puzzles use the name in the current language
const word = (n) => isRo ? cn(n) : n

const inRegion = (name, region) => region === 'World' || COUNTRY_INFO[name]?.continent === region

function seededShuffle(arr, seed = 7) {
  const a = [...arr]
  let s = seed
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280
    const j = Math.floor((s / 233280) * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function scramble(word, seed) {
  const letters = word.toUpperCase().split('')
  for (let t = 0; t < 20; t++) {
    const s = seededShuffle(letters, seed + t * 31).join('')
    if (s !== word.toUpperCase()) return s
  }
  return letters.reverse().join('')
}

const fmtPop = (m) => m >= 1000 ? `${(m / 1000).toFixed(2)} bn` : m >= 1 ? `${m.toFixed(1)} M` : `${Math.round(m * 1000)} k`
const fmtArea = (km2) => `${Math.round(km2).toLocaleString(locale)} km²`

// Currency: accept the full name, the ISO code, and the last word when it's unambiguous
const lastWordCount = {}
for (const c of Object.values(COUNTRY_CURRENCY)) {
  const w = c.name.split(' ').pop()
  lastWordCount[w] = (lastWordCount[w] ?? 0) + 1
}

// ── Catalogue ──────────────────────────────────────────────────────────────
export const TABLE_QUIZZES = {
  capital: {
    title: t('Capitals'), icon: '🏛️',
    prompt: t('Type the capital of each country'),
    columns: { hint: t('Country'), answer: t('Capital') },
    build: ({ countries, region }) => countries
      .filter(n => CAPITALS[n] && inRegion(n, region))
      .sort()
      .map(n => ({ id: n, country: n, hint: { type: 'text', value: n, flag: COUNTRY_INFO[n]?.flag }, answers: CAPITALS[n], display: CAPITALS[n][0] })),
  },

  'cap-to-country': {
    title: t('Countries by Capital'), icon: '🗺️',
    prompt: t('Name the country for each capital'),
    columns: { hint: t('Capital'), answer: t('Country') },
    build: ({ countries, region }) => countries
      .filter(n => CAPITALS[n] && inRegion(n, region))
      .sort((a, b) => CAPITALS[a][0].localeCompare(CAPITALS[b][0]))
      .map(n => ({ id: n, country: n, hint: { type: 'text', value: CAPITALS[n][0] }, answers: countryAnswers(n), display: n })),
  },

  flag: {
    title: t('Flags'), icon: '🚩', layout: 'grid',
    // One flag at a time: your answer only counts for the highlighted flag, so you
    // can't just type every country you know. Random world selection, no regions.
    focus: true, regions: false, sample: 30,
    sizes: [
      { value: '20', label: t('20 random'), hint: t('20 random flags from around the world') },
      { value: '30', label: t('30 random'), hint: t('30 random flags from around the world') },
    ],
    prompt: t('Name the highlighted flag — Tab to skip, click any flag to jump to it'),
    columns: { hint: t('Flag'), answer: t('Country') },
    build: ({ countries, region }) => seededShuffle(countries.filter(n => COUNTRY_INFO[n]?.flag && inRegion(n, region)), 11)
      .map(n => ({ id: n, country: n, hint: { type: 'flag', value: COUNTRY_INFO[n].flag }, answers: countryAnswers(n), display: n })),
  },

  currency: {
    title: t('Currencies'), icon: '💰',
    prompt: t('Type the currency of each country (name or code)'),
    columns: { hint: t('Country'), answer: t('Currency') },
    build: ({ countries, region }) => countries
      .filter(n => COUNTRY_CURRENCY[n] && inRegion(n, region))
      .sort()
      .map(n => {
        const c = COUNTRY_CURRENCY[n]
        const last = c.name.split(' ').pop()
        const answers = [c.name, c.code]
        if (lastWordCount[last] === 1 && last !== c.name) answers.push(last)
        return { id: n, country: n, hint: { type: 'text', value: n, flag: COUNTRY_INFO[n]?.flag }, answers, display: c.name }
      }),
  },

  language: {
    title: t('Languages'), icon: '🗣️',
    prompt: t('Type the main official language of each country'),
    columns: { hint: t('Country'), answer: t('Language') },
    build: ({ countries, region }) => countries
      .filter(n => COUNTRY_LANGUAGES[n]?.length && inRegion(n, region))
      .sort()
      .map(n => ({ id: n, country: n, hint: { type: 'text', value: n, flag: COUNTRY_INFO[n]?.flag }, answers: [COUNTRY_LANGUAGES[n][0]], display: COUNTRY_LANGUAGES[n][0] })),
  },

  endonyms: {
    title: t('Endonyms'), icon: '🔠', sample: 30,
    prompt: t('Name each country from what it calls itself'),
    columns: { hint: t('Endonym'), answer: t('Country') },
    build: ({ countries, region }) => ENDONYMS
      .filter(e => countries.includes(e.country) && inRegion(e.country, region))
      .map(e => ({ id: e.country, country: e.country, hint: { type: 'script', value: e.endonym, sub: e.roman }, answers: countryAnswers(e.country), display: e.country })),
  },

  'emoji-quiz': {
    title: t('Country Emoji'), icon: '🌍', sample: 30,
    prompt: t('Name the country behind each emoji combo'),
    columns: { hint: t('Emojis'), answer: t('Country') },
    build: ({ countries, region }) => {
      const seen = new Set()
      return EMOJI_CLUES
        .filter(e => countries.includes(e.country) && inRegion(e.country, region) && !seen.has(e.country) && seen.add(e.country))
        .map(e => ({ id: e.country, country: e.country, hint: { type: 'emoji', value: e.emojis.join(' ') }, answers: countryAnswers(e.country), display: e.country }))
    },
  },

  'missing-vowels': {
    title: t('Missing Vowels'), icon: '🔡', sample: 30,
    prompt: t('Only the consonants are left — name each country'),
    columns: { hint: t('Consonants'), answer: t('Country') },
    build: ({ countries, region }) => seededShuffle(countries.filter(n => !word(n).includes(' ') && word(n).length >= 4 && inRegion(n, region)), 5)
      .map(n => ({ id: n, country: n, hint: { type: 'text', value: word(n).toUpperCase().replace(/[AEIOUĂÂÎ]/g, ''), mono: true }, answers: [n, word(n)], display: word(n) })),
  },

  scramble: {
    title: t('Scramble'), icon: '🔀', sample: 30,
    prompt: t('Unscramble every country name'),
    columns: { hint: t('Scrambled'), answer: t('Country') },
    build: ({ countries, region }) => seededShuffle(countries.filter(n => !word(n).includes(' ') && word(n).length >= 5 && inRegion(n, region)), 3)
      .map((n, i) => ({ id: n, country: n, hint: { type: 'text', value: scramble(word(n), i + 1), mono: true }, answers: [n, word(n)], display: word(n) })),
  },

  'country-fact': {
    title: t('Country by Fact'), icon: '📖', sample: 30,
    prompt: t('Name the country each fact describes'),
    columns: { hint: t('Fact'), answer: t('Country') },
    build: ({ countries, region }) => {
      const seen = new Set()
      return COUNTRY_FACTS
        .filter(f => countries.includes(f.country) && inRegion(f.country, region) && !seen.has(f.country) && seen.add(f.country))
        .map(f => ({ id: f.country, country: f.country, hint: { type: 'text', value: f.facts[0], long: true }, answers: countryAnswers(f.country), display: f.country }))
    },
  },

  'flag-colors': {
    title: t('Flag Colors'), icon: '🎨', sample: 30,
    prompt: t('Name the country from its flag\'s colour mix'),
    columns: { hint: t('Colours'), answer: t('Country') },
    build: ({ countries, region }) => seededShuffle(Object.keys(FLAG_COLORS).filter(n => countries.includes(n) && inRegion(n, region)), 9)
      .map(n => ({ id: n, country: n, hint: { type: 'colors', value: FLAG_COLORS[n] }, answers: countryAnswers(n), display: n })),
  },

  'pop-order': {
    title: t('Most Populous Countries'), icon: '📊', ranked: true, limit: 30,
    prompt: t('Name the most populous countries — ranks and populations are your clues'),
    columns: { hint: '#', extra: t('Population'), answer: t('Country') },
    build: ({ countries, region }) => countries
      .filter(n => POPULATION[n] && inRegion(n, region))
      .sort((a, b) => POPULATION[b] - POPULATION[a])
      .slice(0, 30)
      .map((n, i) => ({ id: n, country: n, hint: { type: 'text', value: `${i + 1}` }, extra: fmtPop(POPULATION[n]), answers: countryAnswers(n), display: n })),
  },

  area: {
    title: t('Largest Countries'), icon: '📏', ranked: true, limit: 30,
    prompt: t('Name the largest countries by area'),
    columns: { hint: '#', extra: t('Area'), answer: t('Country') },
    build: ({ countries, region }) => countries
      .filter(n => COUNTRY_AREA[n] && inRegion(n, region))
      .sort((a, b) => COUNTRY_AREA[b] - COUNTRY_AREA[a])
      .slice(0, 30)
      .map((n, i) => ({ id: n, country: n, hint: { type: 'text', value: `${i + 1}` }, extra: fmtArea(COUNTRY_AREA[n]), answers: countryAnswers(n), display: n })),
  },
}

// Merge in the list / smaller-target quizzes (they get the shared helpers via ctx)
for (const [id, q] of Object.entries(LIST_QUIZZES)) {
  TABLE_QUIZZES[id] = { ...q, build: (ctx) => q.build({ ...ctx, countryAnswers, inRegion, currency: COUNTRY_CURRENCY, languages: COUNTRY_LANGUAGES, area: COUNTRY_AREA, population: POPULATION, capitals: CAPITALS }) }
}

// Localise country names shown in the tables (keys / ids stay English)
if (isRo) {
  for (const q of Object.values(TABLE_QUIZZES)) {
    const build = q.build
    q.build = (ctx) => build(ctx).map(r => ({
      ...r,
      display: r.display === r.country ? cn(r.country) : r.display,
      hint: r.hint?.type === 'text' && r.hint.value === r.country ? { ...r.hint, value: cn(r.country) }
        : r.hint?.type === 'text' && ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'].includes(r.hint.value) ? { ...r.hint, value: t(r.hint.value) }
        : r.hint,
    }))
  }
}

export const TABLE_QUIZ_IDS = new Set(Object.keys(TABLE_QUIZZES))

/** Seconds on the clock: ~6 s per answer, between 1:30 and 15:00. */
export function timeLimitFor(n) {
  return Math.max(90, Math.min(15 * 60, Math.round(n * 6 / 30) * 30))
}
