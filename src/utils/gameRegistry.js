/**
 * One place that knows every game: the globe rows shown on Home, the quizzes from the
 * Quiz Hub, and the categories used by the left rail and the search palette (Ctrl/⌘ K).
 */
import { t } from '../i18n'
import { QUIZ_ITEMS, QUIZ_CATEGORIES } from '../components/QuizHub'

// Globe-based games, grouped into rows
export const GLOBE_ROWS = [
  {
    id: 'guess', label: t('Guess on the globe'), icon: '🔍', color: '#c77dff',
    items: [
      { id: 'locate',    icon: '📍', label: t('Pinpoint'),        tag: t('Click'),     desc: t('Drop the pin on the given country') },
      { id: 'neighbor',  icon: '📌', label: t('Neighbors'),       tag: t('Type'),      desc: t('Name every country sharing a border') },
      { id: 'missing',   icon: '🗺️', label: t('Blind Map'),       tag: t('Timed'),     desc: t('20 countries vanish — name them before time runs out') },
      { id: 'spotlight', icon: '🔦', label: t('Solo Map'),        tag: t('Relaxed'),   desc: t('Fill in a blank map at your own pace') },
    ],
  },
  {
    id: 'challenges', label: t('Globe challenges'), icon: '🎯', color: '#f97316',
    items: [
      { id: 'mystery',   icon: '🔍', label: t('Mystery Country'), tag: t('Daily'),     desc: t('Guess the hidden country — distance and direction are your clues') },
      { id: 'silhouette',   icon: '🌀', label: t('Silhouette Spin'), tag: t('Arcade'), desc: t('One country glows — name it before the clock runs out') },
      { id: 'capital-drop', icon: '📍', label: t('Capital Drop'),    tag: t('Click'),  desc: t('Drop a pin on each capital — scored by real distance') },
      { id: 'landmark-drop', icon: '🗽', label: t('Landmark Drop'),   tag: t('Click'),  desc: t('Find famous places on the globe — Eiffel Tower, Machu Picchu, Uluru…') },
      { id: 'distance',     icon: '📏', label: t('How Far?'),        tag: t('Guess'),  desc: t('Guess the distance between two capitals') },
      { id: 'antipodes',    icon: '🔄', label: t('Antipodes'),       tag: t('Click'),  desc: t('Find the point on the exact other side of the world') },
      { id: 'line-up',      icon: '📐', label: t('Line Up'),         tag: t('Type'),   desc: t('Name every country a parallel or meridian crosses') },
      { id: 'time-zones',   icon: '🕰️', label: t('Time Zones'),      tag: t('Click'),  desc: t('Find where it\'s that time right now') },
    ],
  },
  {
    id: 'nameall', label: t('Name them all'), icon: '📝', color: '#39ff14',
    items: [
      { id: 'name-all',            icon: '🌍', label: t('Countries'),    tag: '196',  desc: t('Name every country in the world') },
      { id: 'name-all-caps',       icon: '🏙️', label: t('Capitals'),     tag: '196',  desc: t('Name every capital city') },
      { id: 'name-all-currencies', icon: '💰', label: t('Currencies'),   tag: t('All'),  desc: t('Name every currency') },
      { id: 'name-all-languages',  icon: '🗣️', label: t('Languages'),    tag: t('All'),  desc: t('Name the official languages') },
      { id: 'mountains',           icon: '⛰️', label: t('Mountains'),    tag: t('Ranges'), desc: t('Name every major mountain range') },
      { id: 'name-all-seas',       icon: '🌊', label: t('Seas'),         tag: t('Water'), desc: t('Name every sea') },
      { id: 'name-all-rivers',     icon: '🏞️', label: t('Rivers'),       tag: t('Water'), desc: t('Name every major river worldwide') },
  // HIDDEN until ready — uncomment to bring History Maps back:
  // { id: 'history-maps',        icon: '🏛️', label: 'History Maps', tag: 'Eras', desc: 'Name countries across historical eras' },
    ],
  },
]


// Extra entries that aren't on the Home rows
const EXTRA = [
  { id: 'seas',       icon: '🌊', label: t('Seas Quiz'),  desc: t('A body of water is highlighted on the globe — name it.'), group: 'guess' },
  { id: 'daily-quiz', icon: '📅', label: t('Daily Quiz'), desc: t('Quiz of the day'), group: 'quizzes' },
  { id: 'quiz-hub',   icon: '🎯', label: t('Quiz Hub'),   desc: t('Open Hub →'), group: 'quizzes' },
  { id: 'learn',      icon: '🎓', label: t('Learn'),      desc: t('Click any country on the globe to see its facts'), group: 'learn' },
]

/** Rail / palette categories, in display order. */
export const GAME_GROUPS = [
  { id: 'guess',      icon: '🔍', label: t('Guess on the globe'), short: t('Guess'), color: '#c77dff' },
  { id: 'challenges', icon: '🎯', label: t('Globe challenges'),   short: t('Challenges'), color: '#f97316' },
  { id: 'nameall',    icon: '📝', label: t('Name them all'),      short: t('Name all'), color: '#39ff14' },
  { id: 'quizzes',    icon: '🧩', label: t('Quizzes'),            short: t('Quizzes'), color: '#facc15' },
  { id: 'learn',      icon: '🎓', label: t('Learn'),              short: t('Learn'), color: '#38bdf8' },
]

const catLabel = Object.fromEntries(QUIZ_CATEGORIES.map(c => [c.id, c.label]))

/** Every playable thing: { id, icon, label, desc, group, sub } */
export const ALL_GAMES = [
  ...GLOBE_ROWS.flatMap(r => r.items.map(i => ({ ...i, group: r.id }))),
  ...EXTRA.filter(e => e.group !== 'quizzes' || e.id === 'daily-quiz'),
  ...QUIZ_ITEMS.map(q => ({ id: q.id, icon: q.icon, label: q.label, desc: q.desc, group: 'quizzes', sub: catLabel[q.cat] })),
  ...EXTRA.filter(e => e.id === 'quiz-hub'),
]

export const gamesInGroup = (g) => ALL_GAMES.filter(x => x.group === g)
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
