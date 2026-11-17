/**
 * One place that knows every game: the globe rows shown on Home, the quizzes from the
 * Quiz Hub, and the categories used by the left rail and the search palette (Ctrl/⌘ K).
 */
import { t } from '../i18n'
import { QUIZ_ITEMS, QUIZ_CATEGORIES } from '../components/QuizHub'
import { COUNTRY_PAGES, COUNTRY_GAMES, COUNTRY_GAME_HOME, countryName } from '../data/countryPages'

// Globe-based games, grouped into rows
export const GLOBE_ROWS = [
  {
    id: 'guess', label: t('Guess on the globe'), icon: '🔍', color: '#FF7A3D',
    items: [
      { id: 'locate',    icon: '📍', label: t('Pinpoint Country'),        desc: t('A name, a globe, one click. Land inside the borders for a perfect 1000.') },
      { id: 'neighbor',  icon: '📌', label: t('Neighbors'),       desc: t('One country lights up. Name every neighbour it shares a land border with.') },
      { id: 'missing',   icon: '🗺️', label: t('Blind Map'),       desc: t('20 countries vanish from the globe. You have 4 minutes to bring them back.') },
      { id: 'spotlight', icon: '🔦', label: t('Spotlight'),        desc: t('An empty globe lights up one country at a time. Name it to reveal the next.') },
      { id: 'seas',      icon: '🌊', label: t('Name the Sea'),    desc: t('A patch of ocean lights up. Sea, gulf or bay — which one is it?') },
    ],
  },
  {
    id: 'challenges', label: t('Globe challenges'), icon: '🎯', color: '#E2B65C',
    items: [
      { id: 'mystery',   icon: '🔍', label: t('Mystery Country'), desc: t('One hidden country. Every wrong guess tells you how far and which way.') },
      { id: 'silhouette',   icon: '🌀', label: t('Silhouette Spin'), desc: t('Just the outline. The clock shrinks with every right answer.') },
      { id: 'capital-drop', icon: '📍', label: t('Capital Drop'),    desc: t('Pin 10 capitals on the globe. Land within 25 km for a perfect 1000.') },
      { id: 'landmark-drop', icon: '🗽', label: t('Landmark Drop'),   desc: t('Machu Picchu, Petra, Angkor Wat… pin famous places from a pool of 112.') },
      { id: 'distance',     icon: '📏', label: t('How Far?'),        desc: t('Lisbon to Moscow: 1,000 km or 4,000? Guess the distance between capitals.') },
      { id: 'antipodes',    icon: '🔄', label: t('Antipodes'),       desc: t('Dig straight through the Earth from a capital. Where do you come out?') },
      { id: 'line-up',      icon: '📐', label: t('Line Up'),         desc: t('A parallel or meridian cuts across the globe. Name every country it touches.') },
      { id: 'time-zones',   icon: '🕰️', label: t('Time Zones'),      desc: t('It\'s 9 AM in Tokyo. Where in the world is it midnight right now?') },
    ],
  },
  {
    id: 'nameall', label: t('Name them all'), icon: '📝', color: '#8CC18F',
    items: [
      { id: 'name-all',            icon: '🌍', label: t('Name All Countries'), desc: t('196 countries, one text box. Watch the globe fill in as you type.') },
      { id: 'name-all-caps',       icon: '🏙️', label: t('Name All Capitals'), desc: t('Every capital on Earth. Careful: South Africa has three.') },
      { id: 'name-all-currencies', icon: '💰', label: t('Name All Currencies'), desc: t('143 currencies. Name one and every country using it lights up.') },
      { id: 'name-all-languages',  icon: '🗣️', label: t('Name All Languages'), desc: t('153 official languages, from Spanish to Tok Pisin.') },
      { id: 'mountains',           icon: '⛰️', label: t('Name All Mountain Ranges'), desc: t('40 mountain ranges, from the Himalayas to the Andes. Name them all.') },
      { id: 'name-all-seas',       icon: '🌊', label: t('Name All Seas'), desc: t('Oceans, seas, gulfs and bays. Each one you name turns the globe bluer.') },
      { id: 'name-all-rivers',     icon: '🏞️', label: t('Name All Rivers'), desc: t('68 rivers, from the Danube to the Mekong. Each one flows onto the globe.') },
  // HIDDEN until ready — uncomment to bring History Maps back:
  // { id: 'history-maps',        icon: '🏛️', label: 'History Maps', desc: 'Name countries across historical eras' },
    ],
  },
]


// Extra entries that aren't on the Home rows
const EXTRA = [
  { id: 'daily-quiz', icon: '📅', label: t('Daily Quiz'), desc: t('Quiz of the day'), group: 'quizzes' },
  { id: 'quiz-hub',   icon: '🎯', label: t('Quiz Hub'),   desc: t('Open Hub →'), group: 'quizzes' },
  { id: 'learn',      icon: '🎓', label: t('Learn'),      desc: t('Spin the globe, click a country, learn something you didn\'t know.'), group: 'learn' },
]

/**
 * The five sections of the site, in display order. Used by the side rail, the mobile
 * menu, the Home section cards and search. `page` = the section's own page (its id
 * is opened with openGame), `rows` = which GLOBE_ROWS it gathers (globe sections).
 */
export const GAME_GROUPS = [
  { id: 'globe',     icon: '🌍', label: t('Globe games'),   short: t('Globe'),     color: '#FF7A3D', page: 'globe-hub',   rows: ['guess', 'challenges'],
    desc: t('Find, pin and guess places right on the 3D globe') },
  { id: 'nameall',   icon: '📝', label: t('Name them all'), short: t('Name all'),  color: '#8CC18F', page: 'nameall-hub', rows: ['nameall'],
    desc: t('Every country, capital, river or sea — as many as you can') },
  { id: 'countries', icon: '🗺️', label: t('Countries'),     short: t('Countries'), color: '#6FA8DC', page: 'countries',
    desc: t('A country at a time: its map by county or state and a quiz') },
  { id: 'quizzes',   icon: '🧩', label: t('Quizzes'),       short: t('Quizzes'),   color: '#E2B65C', page: 'quiz-hub',
    desc: t('Flags, capitals, lists, puzzles — no globe needed') },
  { id: 'learn',     icon: '🎓', label: t('Learn'),         short: t('Learn'),     color: '#9BB3CF', page: 'learn',
    desc: t('Spin the globe, click a country, learn something new') },
]
/** Section pages that list games (the Quiz Hub and Countries have their own components) */
export const SECTION_HUBS = { 'globe-hub': 'globe', 'nameall-hub': 'nameall' }
const ROW_GROUP = { guess: 'globe', challenges: 'globe', nameall: 'nameall' }

const catLabel = Object.fromEntries(QUIZ_CATEGORIES.map(c => [c.id, c.label]))

/** Every playable thing: { id, icon, label, desc, group, sub } */
export const ALL_GAMES = [
  ...GLOBE_ROWS.flatMap(r => r.items.map(i => ({ ...i, group: ROW_GROUP[r.id] }))),
  ...EXTRA.filter(e => e.group !== 'quizzes' || e.id === 'daily-quiz'),
  ...QUIZ_ITEMS.map(q => ({ id: q.id, icon: q.icon, label: q.label, desc: q.desc, group: 'quizzes', sub: catLabel[q.cat] })),
  ...EXTRA.filter(e => e.id === 'quiz-hub'),
  { id: 'countries', icon: '🗺️', label: t('All countries'), desc: t('Maps by county and state, and a quiz for every country'), group: 'countries' },
  ...Object.entries(COUNTRY_PAGES).map(([id, c]) => ({ id, icon: c.page.flag, label: countryName(id), desc: t('Country page: facts, map and games'), group: 'countries' })),
  ...COUNTRY_GAMES.map(g => ({ id: g.id, icon: g.icon, label: g.label, desc: g.desc, group: 'countries', sub: countryName(COUNTRY_GAME_HOME[g.id]) })),
]

export const gamesInGroup = (g) => ALL_GAMES.filter(x => x.group === g)
// Quick links for the Quizzes menus (the full list lives in the Quiz Hub)
const QUIZ_QUICK = ['daily-quiz', 'country-wordle', 'higher-lower', 'true-false', 'connections', 'border-chain', 'flag', 'capital']
/** What a section's menu (rail flyout, mobile menu) lists: its games, minus its own page.
 *  Quizzes → a short pick (all of them live in the Quiz Hub) · Countries → the countries. */
export function menuGames(groupId) {
  const page = GAME_GROUPS.find(g => g.id === groupId)?.page
  const all = gamesInGroup(groupId).filter(g => g.id !== page)
  if (groupId === 'quizzes') return QUIZ_QUICK.map(id => all.find(g => g.id === id)).filter(Boolean)
  if (groupId === 'countries') return all.filter(g => !g.sub)
  return all
}
export const groupOf = (id) => ALL_GAMES.find(x => x.id === id)?.group ?? null

const norm = (s) => String(s ?? '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

/** Search: every word must match the label, description, category or id. Label hits rank first. */
export function searchGames(q) {
  const words = norm(q).split(/\s+/).filter(Boolean)
  if (!words.length) return ALL_GAMES
  const scored = []
  for (const g of ALL_GAMES) {
    const label = norm(g.label), hay = `${label} ${norm(g.desc)} ${norm(g.sub)} ${norm(g.id)} ${norm(GAME_GROUPS.find(x => x.id === g.group)?.label)}`
    if (!words.every(w => hay.includes(w))) continue
    const score = (label.startsWith(words[0]) ? 0 : label.includes(words[0]) ? 1 : 2)
    scored.push([score, g])
  }
  return scored.sort((a, b) => a[0] - b[0]).map(x => x[1])
}
