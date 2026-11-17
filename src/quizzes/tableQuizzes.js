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
// Greek and Cyrillic are readable enough: their romanization only shows once the game is over.
// Scripts you can't sound out (Arabic, Chinese, Thai, Georgian…) keep it while playing.
const GREEK_CYRILLIC = /[\u0370-\u03FF\u0400-\u04FF]/
import { EMOJI_CLUES } from '../utils/emojiClues'
import { COUNTRY_FACTS } from '../utils/countryFacts'
import { FLAG_COLORS } from '../utils/flagColors'
import { countryAnswers } from '../utils/aliases'
import { inSiteLang } from '../utils/answerLang'
import { capName, capitalAnswers, curName, curSpellings, langName, langSpellings } from '../i18n/names'
import { LIST_QUIZZES } from './listQuizzes'
import { ROMANIA_PAGE } from '../data/countryPages/romania'
import { MOLDOVA_PAGE } from '../data/countryPages/moldova'
import { USA_PAGE } from '../data/countryPages/usa'
import { ITALY_PAGE } from '../data/countryPages/italy'
import { FRANCE_PAGE } from '../data/countryPages/france'
import { GERMANY_PAGE } from '../data/countryPages/germany'
import { SPAIN_PAGE } from '../data/countryPages/spain'
import { JAPAN_PAGE } from '../data/countryPages/japan'
import { UNITED_KINGDOM_PAGE } from '../data/countryPages/unitedKingdom'
import { POLAND_PAGE } from '../data/countryPages/poland'
import { HUNGARY_PAGE } from '../data/countryPages/hungary'
import { BRAZIL_PAGE } from '../data/countryPages/brazil'
import { CANADA_PAGE } from '../data/countryPages/canada'
import { AUSTRALIA_PAGE } from '../data/countryPages/australia'
import { WAR_QUIZZES } from './warQuizzes'
import { t, cn, isRo, locale } from '../i18n'

export const REGIONS = ['World', 'Africa', 'Americas', 'Asia', 'Europe', 'Oceania']

/** Lower-case, strip accents/punctuation/spaces — used for every comparison. */
export function norm(s) {
  return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]/g, '')
}

// Country answers follow the site language (utils/aliases.js)
export { countryAnswers }

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

// Currency: accept the full name, the ISO code, and the bare noun when it's unambiguous
const curNoun = (name) => (isRo ? name.split(' ')[0] : name.split(' ').pop())
const nounCount = {}
for (const c of new Set(Object.values(COUNTRY_CURRENCY).map(c => c.name))) {
  const k = norm(curNoun(curName(c)))
  nounCount[k] = (nounCount[k] ?? 0) + 1
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
      .map(n => ({ id: n, country: n, hint: { type: 'text', value: n, flag: COUNTRY_INFO[n]?.flag }, answers: capitalAnswers(CAPITALS[n]), display: capName(CAPITALS[n][0]) })),
  },

  'cap-to-country': {
    title: t('Countries by Capital'), icon: '🗺️',
    prompt: t('Name the country for each capital'),
    columns: { hint: t('Capital'), answer: t('Country') },
    build: ({ countries, region }) => countries
      .filter(n => CAPITALS[n] && inRegion(n, region))
      .sort((a, b) => capName(CAPITALS[a][0]).localeCompare(capName(CAPITALS[b][0]), locale))
      .map(n => ({ id: n, country: n, hint: { type: 'text', value: capName(CAPITALS[n][0]) }, answers: countryAnswers(n), display: n })),
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
        const answers = [...curSpellings(c.name), c.code]
        // the bare noun when it's unambiguous: "lek", "forint" (English: last word, Romanian: first)
        const noun = curNoun(curName(c.name))
        if (nounCount[norm(noun)] === 1 && norm(noun) !== norm(curName(c.name))) answers.push(noun)
        return { id: n, country: n, hint: { type: 'text', value: n, flag: COUNTRY_INFO[n]?.flag }, answers, display: curName(c.name) }
      }),
  },

  language: {
    title: t('Languages'), icon: '🗣️',
    prompt: t('Type the main official language of each country'),
    columns: { hint: t('Country'), answer: t('Language') },
    build: ({ countries, region }) => countries
      .filter(n => COUNTRY_LANGUAGES[n]?.length && inRegion(n, region))
      .sort()
      .map(n => ({ id: n, country: n, hint: { type: 'text', value: n, flag: COUNTRY_INFO[n]?.flag }, answers: langSpellings(COUNTRY_LANGUAGES[n][0]), display: langName(COUNTRY_LANGUAGES[n][0]) })),
  },

  endonyms: {
    title: t('Endonyms'), icon: '🔠', sample: 30,
    prompt: t('Name each country from what it calls itself'),
    columns: { hint: t('Endonym'), answer: t('Country') },
    build: ({ countries, region }) => ENDONYMS
      .filter(e => countries.includes(e.country) && inRegion(e.country, region))
      .map(e => ({ id: e.country, country: e.country, hint: { type: 'script', value: e.endonym, sub: e.roman, subAlways: !GREEK_CYRILLIC.test(e.endonym) }, answers: countryAnswers(e.country), display: e.country })),
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

// Capitals in the site language, for the list quizzes (A to Z…)
const CAPITALS_LOCAL = Object.fromEntries(Object.entries(CAPITALS).map(([n, caps]) => [n, capitalAnswers(caps)]))

// Merge in the list / smaller-target quizzes (they get the shared helpers via ctx)
for (const [id, q] of Object.entries({ ...LIST_QUIZZES, ...WAR_QUIZZES })) {
  TABLE_QUIZZES[id] = { ...q, build: (ctx) => q.build({ ...ctx, countryAnswers, inRegion, currency: COUNTRY_CURRENCY, languages: COUNTRY_LANGUAGES, area: COUNTRY_AREA, population: POPULATION, capitals: CAPITALS_LOCAL }) }
}

// Country quizzes: 20 questions about one country, typed answers (data/countryPages)
const countryQuiz = (page, title, prompt) => ({
  title, prompt, icon: '❓', regions: false, timeLimit: 5 * 60,
  columns: { hint: t('Question'), answer: t('Answer') },
  build: () => page.questions.map(q => ({
    id: q.id,
    hint: { type: 'text', value: isRo ? q.q.ro : q.q.en, long: true },
    answers: inSiteLang(q.answers, q.show),
    display: isRo ? q.show.ro : q.show.en,
  })),
})
TABLE_QUIZZES['ro-quiz'] = countryQuiz(ROMANIA_PAGE, t('Quiz: Romania'), t('Answer 20 questions about Romania'))
TABLE_QUIZZES['md-quiz'] = countryQuiz(MOLDOVA_PAGE, t('Quiz: Moldova'), t('Answer 20 questions about Moldova'))
TABLE_QUIZZES['us-quiz'] = countryQuiz(USA_PAGE, t('Quiz: United States'), t('Answer 20 questions about the United States'))
TABLE_QUIZZES['it-quiz'] = countryQuiz(ITALY_PAGE, t('Quiz: Italy'), t('Answer 20 questions about Italy'))
TABLE_QUIZZES['fr-quiz'] = countryQuiz(FRANCE_PAGE, t('Quiz: France'), t('Answer 20 questions about France'))
TABLE_QUIZZES['de-quiz'] = countryQuiz(GERMANY_PAGE, t('Quiz: Germany'), t('Answer 20 questions about Germany'))
TABLE_QUIZZES['es-quiz'] = countryQuiz(SPAIN_PAGE, t('Quiz: Spain'), t('Answer 20 questions about Spain'))
TABLE_QUIZZES['jp-quiz'] = countryQuiz(JAPAN_PAGE, t('Quiz: Japan'), t('Answer 20 questions about Japan'))
TABLE_QUIZZES['gb-quiz'] = countryQuiz(UNITED_KINGDOM_PAGE, t('Quiz: United Kingdom'), t('Answer 20 questions about the United Kingdom'))
TABLE_QUIZZES['pl-quiz'] = countryQuiz(POLAND_PAGE, t('Quiz: Poland'), t('Answer 20 questions about Poland'))
TABLE_QUIZZES['hu-quiz'] = countryQuiz(HUNGARY_PAGE, t('Quiz: Hungary'), t('Answer 20 questions about Hungary'))
TABLE_QUIZZES['br-quiz'] = countryQuiz(BRAZIL_PAGE, t('Quiz: Brazil'), t('Answer 20 questions about Brazil'))
TABLE_QUIZZES['ca-quiz'] = countryQuiz(CANADA_PAGE, t('Quiz: Canada'), t('Answer 20 questions about Canada'))
TABLE_QUIZZES['au-quiz'] = countryQuiz(AUSTRALIA_PAGE, t('Quiz: Australia'), t('Answer 20 questions about Australia'))

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
