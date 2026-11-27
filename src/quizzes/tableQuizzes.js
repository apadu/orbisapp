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
import { COUNTRY_FACTS } from '../utils/countryFacts'
import { FLAG_COLORS } from '../utils/flagColors'
import { countryAnswers } from '../utils/aliases'
import { inSiteLang } from '../utils/answerLang'
import { capName, capitalAnswers, curName, curSpellings, langName, langSpellings } from '../i18n/names'
import { LIST_QUIZZES } from './listQuizzes'
import { WAR_QUIZZES } from './warQuizzes'
import { t, cn, isRo, lang, locale } from '../i18n'
import { LOAD_PAGE } from '../data/countryPages'

export const REGIONS = ['World', 'Africa', 'Americas', 'Asia', 'Europe', 'Oceania']

/** Lower-case, strip accents/punctuation/spaces — used for every comparison. */
export function norm(s) {
  return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]/g, '')
}

// Country answers follow the site language (utils/aliases.js)
export { countryAnswers }

// Word puzzles use the name in the current language
const word = (n) => cn(n)

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
    title: t('Capital Fever'), icon: '🏛️', regions: false,   // all 196 — each continent has its own quiz below
    prompt: t('Type the capital of each country'),
    columns: { hint: t('Country'), answer: t('Capital') },
    build: ({ countries, region }) => countries
      .filter(n => CAPITALS[n] && inRegion(n, region))
      .sort()
      .map(n => ({ id: n, country: n, hint: { type: 'text', value: n, flag: COUNTRY_INFO[n]?.flag }, answers: capitalAnswers(CAPITALS[n]), display: capName(CAPITALS[n][0]) })),
  },

  'cap-to-country': {
    title: t('Countries by Capital'), icon: '🗺️', regions: false, sample: 20, sizes: false, keepOrder: true,   // 20 random capitals, a fresh set every game
    prompt: t('20 random capitals from around the world — a new set every game'),
    columns: { hint: t('Capital'), answer: t('Country') },
    build: ({ countries, region }) => countries
      .filter(n => CAPITALS[n] && inRegion(n, region))
      .sort((a, b) => capName(CAPITALS[a][0]).localeCompare(capName(CAPITALS[b][0]), locale))
      .map(n => ({ id: n, country: n, hint: { type: 'text', value: capName(CAPITALS[n][0]) }, answers: countryAnswers(n), display: n })),
  },

  flag: {
    title: t('Flag Fever'), icon: '🚩', layout: 'grid',
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
    title: t('Currencies'), icon: '💰', regions: false, sample: 20, sizes: false, keepOrder: true,
    prompt: t('Type the currency of 20 random countries (name or code) — a new set every game'),
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
    title: t('Languages'), icon: '🗣️', regions: false, sample: 20, sizes: false, keepOrder: true,
    prompt: t('Type the main official language of 20 random countries — a new set every game'),
    columns: { hint: t('Country'), answer: t('Language') },
    build: ({ countries, region }) => countries
      .filter(n => COUNTRY_LANGUAGES[n]?.length && inRegion(n, region))
      .sort()
      .map(n => ({ id: n, country: n, hint: { type: 'text', value: n, flag: COUNTRY_INFO[n]?.flag }, answers: langSpellings(COUNTRY_LANGUAGES[n][0]), display: langName(COUNTRY_LANGUAGES[n][0]) })),
  },

  endonyms: {
    title: t('Endonyms'), icon: '🔠', regions: false, sample: 20, sizes: false, keepOrder: true,
    prompt: t('Name 20 random countries from what they call themselves — a new set every game'),
    columns: { hint: t('Endonym'), answer: t('Country') },
    build: ({ countries, region }) => ENDONYMS
      .filter(e => countries.includes(e.country) && inRegion(e.country, region))
      .map(e => ({ id: e.country, country: e.country, hint: { type: 'script', value: e.endonym, sub: e.roman, subAlways: !GREEK_CYRILLIC.test(e.endonym) }, answers: countryAnswers(e.country), display: e.country })),
  },

  'missing-vowels': {
    title: t('Missing Vowels'), icon: '🔡', regions: false, sample: 20, sizes: false,
    prompt: t('Only the consonants are left — name 20 random countries, a new set every game'),
    columns: { hint: t('Consonants'), answer: t('Country') },
    build: ({ countries, region }) => seededShuffle(countries.filter(n => !word(n).includes(' ') && word(n).length >= 4 && inRegion(n, region)), 5)
      .map(n => ({ id: n, country: n, hint: { type: 'text', value: word(n).toUpperCase().replace(/[AEIOUĂÂÎ]/g, ''), mono: true }, answers: [n, word(n)], display: word(n) })),
  },

  scramble: {
    title: t('Scramble'), icon: '🔀', regions: false, sample: 20, sizes: false,
    prompt: t('Unscramble 20 random country names — a new set every game'),
    columns: { hint: t('Scrambled'), answer: t('Country') },
    build: ({ countries, region }) => seededShuffle(countries.filter(n => !word(n).includes(' ') && word(n).length >= 5 && inRegion(n, region)), 3)
      .map((n, i) => ({ id: n, country: n, hint: { type: 'text', value: scramble(word(n), i + 1), mono: true }, answers: [n, word(n)], display: word(n) })),
  },

  'country-fact': {
    title: t('Country by Fact'), icon: '📖', regions: false, sample: 20, sizes: false,
    prompt: t('Name the country each fact describes — 20 random facts, a new set every game'),
    columns: { hint: t('Fact'), answer: t('Country') },
    build: ({ countries, region }) => {
      const seen = new Set()
      return COUNTRY_FACTS
        .filter(f => countries.includes(f.country) && inRegion(f.country, region) && !seen.has(f.country) && seen.add(f.country))
        .map(f => ({ id: f.country, country: f.country, hint: { type: 'text', value: f.facts[0], long: true }, answers: countryAnswers(f.country), display: f.country }))
    },
  },

  'flag-colors': {
    title: t('Flag Colors'), icon: '🎨', regions: false, sample: 20, sizes: false,
    prompt: t('Name the country from its flag\'s colour mix — 20 random flags, a new set every game'),
    columns: { hint: t('Colours'), answer: t('Country') },
    build: ({ countries, region }) => seededShuffle(Object.keys(FLAG_COLORS).filter(n => countries.includes(n) && inRegion(n, region)), 9)
      .map(n => ({ id: n, country: n, hint: { type: 'colors', value: FLAG_COLORS[n] }, answers: countryAnswers(n), display: n })),
  },

  'pop-order': {
    title: t('Most Populous Countries'), icon: '📊', ranked: true, limit: 30, regions: false,   // the world; each continent has its own quiz below
    prompt: t('Name the most populous countries — ranks and populations are your clues'),
    columns: { hint: '#', extra: t('Population'), answer: t('Country') },
    build: ({ countries, region }) => countries
      .filter(n => POPULATION[n] && inRegion(n, region))
      .sort((a, b) => POPULATION[b] - POPULATION[a])
      .slice(0, 30)
      .map((n, i) => ({ id: n, country: n, hint: { type: 'text', value: `${i + 1}` }, extra: fmtPop(POPULATION[n]), answers: countryAnswers(n), display: n })),
  },

  area: {
    title: t('Largest Countries'), icon: '📏', ranked: true, limit: 30, regions: false,   // the world; each continent has its own quiz below
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
// The questions live in each country's page file, loaded when the quiz opens (TableQuiz waits for load)
const countryQuiz = (loadPage, title, prompt) => ({
  title, prompt, icon: '❓', regions: false, timeLimit: 5 * 60,
  columns: { hint: t('Question'), answer: t('Answer') },
  build: () => [],
  load: () => loadPage().then(page => () => page.questions.map(q => ({
    id: q.id,
    hint: { type: 'text', value: isRo ? q.q.ro : q.q.en, long: true },
    answers: inSiteLang(q.answers, q.show),
    display: isRo ? q.show.ro : q.show.en,
  }))),
})
TABLE_QUIZZES['ro-quiz'] = countryQuiz(LOAD_PAGE.ro, t('Quiz: Romania'), t('Answer 20 questions about Romania'))
TABLE_QUIZZES['md-quiz'] = countryQuiz(LOAD_PAGE.md, t('Quiz: Moldova'), t('Answer 20 questions about Moldova'))
TABLE_QUIZZES['us-quiz'] = countryQuiz(LOAD_PAGE.us, t('Quiz: United States'), t('Answer 20 questions about the United States'))
TABLE_QUIZZES['it-quiz'] = countryQuiz(LOAD_PAGE.it, t('Quiz: Italy'), t('Answer 20 questions about Italy'))
TABLE_QUIZZES['fr-quiz'] = countryQuiz(LOAD_PAGE.fr, t('Quiz: France'), t('Answer 20 questions about France'))
TABLE_QUIZZES['de-quiz'] = countryQuiz(LOAD_PAGE.de, t('Quiz: Germany'), t('Answer 20 questions about Germany'))
TABLE_QUIZZES['es-quiz'] = countryQuiz(LOAD_PAGE.es, t('Quiz: Spain'), t('Answer 20 questions about Spain'))
TABLE_QUIZZES['jp-quiz'] = countryQuiz(LOAD_PAGE.jp, t('Quiz: Japan'), t('Answer 20 questions about Japan'))
TABLE_QUIZZES['gb-quiz'] = countryQuiz(LOAD_PAGE.gb, t('Quiz: United Kingdom'), t('Answer 20 questions about the United Kingdom'))
TABLE_QUIZZES['pl-quiz'] = countryQuiz(LOAD_PAGE.pl, t('Quiz: Poland'), t('Answer 20 questions about Poland'))
TABLE_QUIZZES['hu-quiz'] = countryQuiz(LOAD_PAGE.hu, t('Quiz: Hungary'), t('Answer 20 questions about Hungary'))
TABLE_QUIZZES['br-quiz'] = countryQuiz(LOAD_PAGE.br, t('Quiz: Brazil'), t('Answer 20 questions about Brazil'))
TABLE_QUIZZES['ca-quiz'] = countryQuiz(LOAD_PAGE.ca, t('Quiz: Canada'), t('Answer 20 questions about Canada'))
TABLE_QUIZZES['au-quiz'] = countryQuiz(LOAD_PAGE.au, t('Quiz: Australia'), t('Answer 20 questions about Australia'))
TABLE_QUIZZES['mx-quiz'] = countryQuiz(LOAD_PAGE.mx, t("Quiz: Mexico"), t("Answer 20 questions about Mexico"))
TABLE_QUIZZES['in-quiz'] = countryQuiz(LOAD_PAGE.in, t("Quiz: India"), t("Answer 20 questions about India"))
TABLE_QUIZZES['cn-quiz'] = countryQuiz(LOAD_PAGE.cn, t("Quiz: China"), t("Answer 20 questions about China"))
TABLE_QUIZZES['ru-quiz'] = countryQuiz(LOAD_PAGE.ru, t("Quiz: Russia"), t("Answer 20 questions about Russia"))
TABLE_QUIZZES['ar-quiz'] = countryQuiz(LOAD_PAGE.ar, t("Quiz: Argentina"), t("Answer 20 questions about Argentina"))
TABLE_QUIZZES['tr-quiz'] = countryQuiz(LOAD_PAGE.tr, t("Quiz: Turkey"), t("Answer 20 questions about Turkey"))
TABLE_QUIZZES['kr-quiz'] = countryQuiz(LOAD_PAGE.kr, t("Quiz: South Korea"), t("Answer 20 questions about South Korea"))
TABLE_QUIZZES['eg-quiz'] = countryQuiz(LOAD_PAGE.eg, t("Quiz: Egypt"), t("Answer 20 questions about Egypt"))
TABLE_QUIZZES['ng-quiz'] = countryQuiz(LOAD_PAGE.ng, t("Quiz: Nigeria"), t("Answer 20 questions about Nigeria"))
TABLE_QUIZZES['za-quiz'] = countryQuiz(LOAD_PAGE.za, t("Quiz: South Africa"), t("Answer 20 questions about South Africa"))
TABLE_QUIZZES['th-quiz'] = countryQuiz(LOAD_PAGE.th, t("Quiz: Thailand"), t("Answer 20 questions about Thailand"))
TABLE_QUIZZES['pe-quiz'] = countryQuiz(LOAD_PAGE.pe, t("Quiz: Peru"), t("Answer 20 questions about Peru"))
TABLE_QUIZZES['co-quiz'] = countryQuiz(LOAD_PAGE.co, t("Quiz: Colombia"), t("Answer 20 questions about Colombia"))
TABLE_QUIZZES['ir-quiz'] = countryQuiz(LOAD_PAGE.ir, t("Quiz: Iran"), t("Answer 20 questions about Iran"))
TABLE_QUIZZES['gr-quiz'] = countryQuiz(LOAD_PAGE.gr, t("Quiz: Greece"), t("Answer 20 questions about Greece"))
TABLE_QUIZZES['se-quiz'] = countryQuiz(LOAD_PAGE.se, t("Quiz: Sweden"), t("Answer 20 questions about Sweden"))
TABLE_QUIZZES['pt-quiz'] = countryQuiz(LOAD_PAGE.pt, t("Quiz: Portugal"), t("Answer 20 questions about Portugal"))
TABLE_QUIZZES['ch-quiz'] = countryQuiz(LOAD_PAGE.ch, t("Quiz: Switzerland"), t("Answer 20 questions about Switzerland"))
TABLE_QUIZZES['cz-quiz'] = countryQuiz(LOAD_PAGE.cz, t("Quiz: Czechia"), t("Answer 20 questions about Czechia"))
TABLE_QUIZZES['be-quiz'] = countryQuiz(LOAD_PAGE.be, t("Quiz: Belgium"), t("Answer 20 questions about Belgium"))
TABLE_QUIZZES['sk-quiz'] = countryQuiz(LOAD_PAGE.sk, t("Quiz: Slovakia"), t("Answer 20 questions about Slovakia"))
TABLE_QUIZZES['ie-quiz'] = countryQuiz(LOAD_PAGE.ie, t("Quiz: Ireland"), t("Answer 20 questions about Ireland"))
TABLE_QUIZZES['my-quiz'] = countryQuiz(LOAD_PAGE.my, t("Quiz: Malaysia"), t("Answer 20 questions about Malaysia"))
TABLE_QUIZZES['lk-quiz'] = countryQuiz(LOAD_PAGE.lk, t("Quiz: Sri Lanka"), t("Answer 20 questions about Sri Lanka"))
TABLE_QUIZZES['mn-quiz'] = countryQuiz(LOAD_PAGE.mn, t("Quiz: Mongolia"), t("Answer 20 questions about Mongolia"))
TABLE_QUIZZES['ec-quiz'] = countryQuiz(LOAD_PAGE.ec, t("Quiz: Ecuador"), t("Answer 20 questions about Ecuador"))
TABLE_QUIZZES['bo-quiz'] = countryQuiz(LOAD_PAGE.bo, t("Quiz: Bolivia"), t("Answer 20 questions about Bolivia"))
TABLE_QUIZZES['bg-quiz'] = countryQuiz(LOAD_PAGE.bg, t("Quiz: Bulgaria"), t("Answer 20 questions about Bulgaria"))
TABLE_QUIZZES['ke-quiz'] = countryQuiz(LOAD_PAGE.ke, t("Quiz: Kenya"), t("Answer 20 questions about Kenya"))
TABLE_QUIZZES['gh-quiz'] = countryQuiz(LOAD_PAGE.gh, t("Quiz: Ghana"), t("Answer 20 questions about Ghana"))
TABLE_QUIZZES['tn-quiz'] = countryQuiz(LOAD_PAGE.tn, t("Quiz: Tunisia"), t("Answer 20 questions about Tunisia"))
TABLE_QUIZZES['sn-quiz'] = countryQuiz(LOAD_PAGE.sn, t("Quiz: Senegal"), t("Answer 20 questions about Senegal"))
TABLE_QUIZZES['cm-quiz'] = countryQuiz(LOAD_PAGE.cm, t("Quiz: Cameroon"), t("Answer 20 questions about Cameroon"))
TABLE_QUIZZES['nl-quiz'] = countryQuiz(LOAD_PAGE.nl, t("Quiz: Netherlands"), t("Answer 20 questions about the Netherlands"))
TABLE_QUIZZES['ua-quiz'] = countryQuiz(LOAD_PAGE.ua, t("Quiz: Ukraine"), t("Answer 20 questions about Ukraine"))
TABLE_QUIZZES['at-quiz'] = countryQuiz(LOAD_PAGE.at, t("Quiz: Austria"), t("Answer 20 questions about Austria"))
TABLE_QUIZZES['cl-quiz'] = countryQuiz(LOAD_PAGE.cl, t("Quiz: Chile"), t("Answer 20 questions about Chile"))
TABLE_QUIZZES['nz-quiz'] = countryQuiz(LOAD_PAGE.nz, t("Quiz: New Zealand"), t("Answer 20 questions about New Zealand"))
TABLE_QUIZZES['sa-quiz'] = countryQuiz(LOAD_PAGE.sa, t("Quiz: Saudi Arabia"), t("Answer 20 questions about Saudi Arabia"))

// Localise country names shown in the tables (keys / ids stay English)
if (lang !== 'en') {
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

// Science & history tables: their rows live in scienceTables.js and load when the quiz opens
// (TableQuiz waits for quiz.load). Only the titles, prompts and columns are here.
const lazyTable = (id, def) => ({ regions: false, timeLimit: 5 * 60, ...def, build: () => [], load: () => import('./scienceTables').then(m => m.SCIENCE_BUILDS[id]) })
Object.assign(TABLE_QUIZZES, {
  rocks: lazyTable('rocks', { title: t('Rock Types'), icon: '🪨', prompt: t('Name each rock from its description'), columns: { hint: t('Description'), extra: t('Type'), answer: t('Rock') } }),
  minerals: lazyTable('minerals', { title: t('Minerals'), icon: '💎', prompt: t('Name each mineral — its Mohs hardness is in the middle'), columns: { hint: t('Description'), extra: t('Hardness'), answer: t('Mineral') } }),
  'earth-records': lazyTable('earth-records', { title: t('Records of the Earth'), icon: '🏆', prompt: t('Name the place that holds each record'), columns: { hint: t('Record'), extra: t('Value'), answer: t('Place') } }),
  phenomena: lazyTable('phenomena', { title: t('Natural Phenomena'), icon: '🌪️', prompt: t('Name each natural phenomenon from its description'), columns: { hint: t('Description'), answer: t('Phenomenon') } }),
  'geologic-time': lazyTable('geologic-time', { title: t('Geological Time'), icon: '🦕', prompt: t('Name the periods of Earth\'s history, oldest first'), columns: { hint: t('What happened'), extra: t('Million years ago'), answer: t('Period') } }),
  planets: lazyTable('planets', { title: t('Planets by Clues'), icon: '🪐', prompt: t('Name each planet, dwarf planet or other body of the Solar System'), columns: { hint: t('Clue'), extra: t('Diameter'), answer: t('Name') } }),
  moons: lazyTable('moons', { title: t('Moons of the Solar System'), icon: '🌙', prompt: t('Name each moon — the planet it orbits is in the middle'), columns: { hint: t('Description'), extra: t('Planet'), answer: t('Moon') } }),
  missions: lazyTable('missions', { title: t('Space Exploration'), icon: '🚀', prompt: t('Name each mission, spacecraft or space traveller'), columns: { hint: t('Description'), extra: t('Year'), answer: t('Answer') } }),
  'stars-constellations': lazyTable('stars-constellations', { title: t('Stars and Constellations'), icon: '✨', prompt: t('Name each star, constellation or galaxy'), columns: { hint: t('Description'), extra: t('Type'), answer: t('Name') } }),
  biomes: lazyTable('biomes', { title: t('Biomes'), icon: '🌳', prompt: t('Name each biome from its description and an example place'), columns: { hint: t('Description'), extra: t('Example'), answer: t('Biome') } }),
  'extreme-points': lazyTable('extreme-points', { title: t('Extreme Points of the Continents'), icon: '🧭', prompt: t('Name the northernmost, southernmost, easternmost and westernmost points of each continent'), columns: { hint: t('Description'), extra: t('Country'), answer: t('Place') } }),
  climates: lazyTable('climates', { title: t('Climate Types'), icon: '🌦️', prompt: t('Name each type of climate from its description and two example cities'), columns: { hint: t('Description'), extra: t('Example'), answer: t('Climate') } }),
  scales: lazyTable('scales', { title: t('Scales and Units'), icon: '📐', prompt: t('Name the scale or unit from its description — what it measures is in the middle'), columns: { hint: t('Description'), extra: t('Measures'), answer: t('Scale') } }),
  'bright-stars': lazyTable('bright-stars', { title: t('The Brightest Stars'), icon: '🌟', prompt: t('Name the brightest stars of the night sky, from Sirius down'), columns: { hint: t('Description'), extra: t('Constellation'), answer: t('Star') } }),
  zodiac: lazyTable('zodiac', { title: t('Constellations of the Zodiac'), icon: '♈', prompt: t('Name the constellations the Sun passes in front of during the year'), columns: { hint: t('Description'), extra: t('Symbol'), answer: t('Constellation') } }),
  'flags-historical': lazyTable('flags-historical', { title: t('Historical Flags'), icon: '🏴', prompt: t('Name the country or state that flew each flag'), columns: { hint: t('Flag'), extra: t('Years'), answer: t('Country') } }),
})

// Capitals, one quiz per continent (same rows as `capital`, region fixed — no region picker)
for (const [slug, region, title, icon] of [
  ['europe', 'Europe', t('Capitals of Europe'), '🏰'],
  ['asia', 'Asia', t('Capitals of Asia'), '🏯'],
  ['africa', 'Africa', t('Capitals of Africa'), '🦁'],
  ['americas', 'Americas', t('Capitals of the Americas'), '🗽'],
  ['oceania', 'Oceania', t('Capitals of Oceania'), '🌊'],
]) {
  TABLE_QUIZZES[`capitals-${slug}`] = { ...TABLE_QUIZZES.capital, title, icon, region, regions: false }
}

// Most populous countries, one quiz per continent (no Oceania: it has too few countries)
for (const [slug, region, title] of [
  ['africa', 'Africa', t('Most Populous Countries of Africa')],
  ['americas', 'Americas', t('Most Populous Countries of the Americas')],
  ['asia', 'Asia', t('Most Populous Countries of Asia')],
  ['europe', 'Europe', t('Most Populous Countries of Europe')],
]) {
  TABLE_QUIZZES[`pop-${slug}`] = { ...TABLE_QUIZZES['pop-order'], title, region, regions: false }
}

// Largest countries by area, one quiz per continent (no Oceania)
for (const [slug, region, title] of [
  ['africa', 'Africa', t('Largest Countries of Africa')],
  ['americas', 'Americas', t('Largest Countries of the Americas')],
  ['asia', 'Asia', t('Largest Countries of Asia')],
  ['europe', 'Europe', t('Largest Countries of Europe')],
]) {
  TABLE_QUIZZES[`area-${slug}`] = { ...TABLE_QUIZZES.area, title, region, regions: false }
}

export const TABLE_QUIZ_IDS = new Set(Object.keys(TABLE_QUIZZES))

/** Seconds on the clock: ~6 s per answer, between 1:30 and 15:00. */
export function timeLimitFor(n) {
  return Math.max(90, Math.min(15 * 60, Math.round(n * 6 / 30) * 30))
}
