/**
 * Categories for "Don't Say What I Say" (Duel.jsx). Each one builds its items lazily:
 *   { id, show(): name in the site language, answers: spellings accepted in the site language }
 * Players can play in different languages: answers are compared by item id, never by text.
 */
import { t, isRo } from '../i18n'
import { COUNTRY_INFO } from './countryInfo'
import { countryAnswers, localName } from './aliases'
import { CAPITALS } from './capitals'
import { capitalAnswers, capName, rangeSpellings, rangeName, riverName, riverSpellings, curName, curSpellings, langName, langSpellings } from '../i18n/names'
import { COUNTRY_MAP_QUIZZES } from '../data/countryMaps'
import { inSiteLang } from './answerLang'
import { MOUNTAIN_RANGES } from './mountainRanges'
import { RIVER_NAMES } from './rivers'
import { COUNTRY_CURRENCY } from './countryCurrency'
import { COUNTRY_LANGUAGES } from './countryLanguages'
import { FLAG_COLORS } from './flagColors'

export const duelKey = (s) => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]/g, '')
// "Munții Carpați" / "Carpathian Mountains" → "carpat…": the generic words don't count
// "Fluviul Dunărea" / "Danube River" → "dunarea" / "danube"
const riverKey = (s) => duelKey(String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  .replace(/\b(river|rio|fluviul|raul)\b/g, ''))
const mountainKey = (s) => duelKey(String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/\b(mountains?|range|ranges|hills?|massif|muntii|munti|lantul|masivul)\b/g, ''))

const COUNTRIES = Object.keys(COUNTRY_INFO)
const inContinent = (c) => COUNTRIES.filter(n => !c || COUNTRY_INFO[n].continent === c)

const countryItems = (continent) => () => inContinent(continent).map(n => ({ id: n, show: () => localName(n), answers: countryAnswers(n) }))
const capitalItems = (continent) => () => inContinent(continent).filter(n => CAPITALS[n]).map(n => ({
  id: n, show: () => capName(CAPITALS[n][0]), answers: capitalAnswers(CAPITALS[n]),
}))
const divisionItems = (quizId) => () => COUNTRY_MAP_QUIZZES[quizId].map.divisions.map(d => ({
  id: d.id,
  show: () => (isRo && d.ro) || d.name,
  answers: inSiteLang([d.name, ...(d.ro ? [d.ro] : []), ...(d.alt ?? [])], { en: d.name, ro: d.ro ?? d.name }),
}))
const riverItems = () => RIVER_NAMES.map(n => ({ id: n, show: () => riverName(n), answers: riverSpellings(n), loose: riverKey }))
// each currency once (the euro is one answer, not 20)
const currencyItems = () => {
  const seen = new Map()
  for (const c of Object.values(COUNTRY_CURRENCY)) if (!seen.has(c.name)) seen.set(c.name, c)
  return [...seen.values()].map(c => ({ id: c.name, show: () => curName(c.name), answers: [...curSpellings(c.name), c.code] }))
}
const languageItems = () => [...new Set(Object.values(COUNTRY_LANGUAGES).flat())].map(l => ({ id: l, show: () => langName(l), answers: langSpellings(l) }))
// countries whose flag has a colour (by its main colours)
const FLAG_COLOR_NAMES = { red: ['Red', 'Maroon'], blue: ['Blue', 'Sky Blue', 'Aqua'], green: ['Green'], yellow: ['Yellow', 'Gold'] }
const flagItems = (color) => () => COUNTRIES.filter(n => FLAG_COLORS[n]?.some(c => FLAG_COLOR_NAMES[color].includes(c.name)))
  .map(n => ({ id: n, show: () => localName(n), answers: countryAnswers(n) }))
const mountainItems = () => MOUNTAIN_RANGES.features.map(f => f.properties.NAME).map(n => ({
  id: n, show: () => rangeName(n), answers: rangeSpellings(n), loose: mountainKey,
}))

const CONTINENT_LABEL = {
  Europe: () => t('Countries of Europe'), Asia: () => t('Countries of Asia'), Africa: () => t('Countries of Africa'),
  Americas: () => t('Countries of the Americas'), Oceania: () => t('Countries of Oceania'),
}
const CAPITAL_LABEL = {
  Europe: () => t('Capitals of Europe'), Asia: () => t('Capitals of Asia'), Africa: () => t('Capitals of Africa'), Americas: () => t('Capitals of the Americas'),
}

/** { id, group, label(), build() } — the order here is the order in the picker */
export const DUEL_CATEGORIES = [
  { id: 'countries', group: 'countries', label: () => t('Any country in the world'), build: countryItems(null) },
  ...Object.entries(CONTINENT_LABEL).map(([c, label]) => ({ id: `countries-${c.toLowerCase()}`, group: 'countries', label, build: countryItems(c) })),
  { id: 'capitals', group: 'capitals', label: () => t('Any capital city'), build: capitalItems(null) },
  ...Object.entries(CAPITAL_LABEL).map(([c, label]) => ({ id: `capitals-${c.toLowerCase()}`, group: 'capitals', label, build: capitalItems(c) })),
  // the subdivisions of the country pages with at least 15 of them (counties of Romania, US states…)
  ...Object.entries(COUNTRY_MAP_QUIZZES)
    .filter(([, q]) => q.kind === 'divisions' && q.map.divisions.length >= 15)
    .map(([id, q]) => ({ id: `div-${id}`, group: 'regions', label: () => q.title, build: divisionItems(id) })),
  { id: 'mountains', group: 'nature', label: () => t('Mountain ranges'), build: mountainItems },
  { id: 'rivers', group: 'nature', label: () => t('Rivers of the world'), build: riverItems },
  { id: 'flag-red', group: 'flags', label: () => t('Countries with red in the flag'), build: flagItems('red') },
  { id: 'flag-blue', group: 'flags', label: () => t('Countries with blue in the flag'), build: flagItems('blue') },
  { id: 'flag-green', group: 'flags', label: () => t('Countries with green in the flag'), build: flagItems('green') },
  { id: 'flag-yellow', group: 'flags', label: () => t('Countries with yellow in the flag'), build: flagItems('yellow') },
  { id: 'currencies', group: 'culture', label: () => t('Currencies of the world'), build: currencyItems },
  { id: 'languages', group: 'culture', label: () => t('Official languages'), build: languageItems },
]
export const DUEL_GROUPS = [
  { id: 'countries', label: () => t('Countries') },
  { id: 'capitals', label: () => t('Capitals') },
  { id: 'regions', label: () => t('Counties, states and regions') },
  { id: 'flags', label: () => t('Flags') },
  { id: 'nature', label: () => t('Nature') },
  { id: 'culture', label: () => t('Money and languages') },
]
/** A category picked elsewhere (a country page's "Play with friends") for the next room you open */
export function presetDuelCategory(cat) { try { sessionStorage.setItem('duel-cat', cat) } catch {} }
/** The duel category of a country's map game ('ro-counties' → 'div-ro-counties'), if there is one */
export const duelCategoryFor = (gameId) => (DUEL_CATEGORIES.some(c => c.id === `div-${gameId}`) ? `div-${gameId}` : null)

const byId = Object.fromEntries(DUEL_CATEGORIES.map(c => [c.id, c]))

const cache = new Map()
/** → { items, total, resolve(typed) → item id | null, show(id) → name } */
export function duelCategory(id) {
  if (cache.has(id)) return cache.get(id)
  const cat = byId[id] ?? byId.countries
  const items = cat.build()
  const index = new Map()
  for (const it of items) for (const a of it.answers) {
    const k = duelKey(a)
    if (k && !index.has(k)) index.set(k, it.id)
    if (it.loose) { const m = it.loose(a); if (m && !index.has(m)) index.set(m, it.id) }
  }
  const showById = Object.fromEntries(items.map(it => [it.id, it.show]))
  const out = {
    id: cat.id,
    label: cat.label(),
    total: items.length,
    resolve: (typed) => index.get(duelKey(typed)) ?? (items[0]?.loose ? index.get(items[0].loose(typed)) : null) ?? null,
    show: (key) => showById[key]?.() ?? key,
  }
  cache.set(id, out)
  return out
}
