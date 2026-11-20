import Icon from './Icon'
import FlagImg from './FlagImg'
import { COUNTRY_PAGES, COUNTRY_GAME_HOME } from '../data/countryPages'
import { QUIZ_ITEMS } from './QuizHub'

/** One line icon per game (no emoji). Country games show their country's flag. */
const BY_ID = {
  // globe
  locate: 'pin', neighbor: 'borders', missing: 'eyeOff', spotlight: 'focus', seas: 'wave', mystery: 'question',
  silhouette: 'shape', 'capital-drop': 'building', 'landmark-drop': 'landmark', distance: 'ruler', antipodes: 'swap',
  'line-up': 'meridian', 'time-zones': 'clock',
  // name them all
  'name-all': 'globe', 'name-all-caps': 'building', 'name-all-currencies': 'coin', 'name-all-languages': 'speech',
  mountains: 'mountain', 'name-all-seas': 'wave', 'name-all-rivers': 'river', 'history-maps': 'history',
  // quizzes
  flag: 'flag', 'flag-colors': 'palette', 'flags-pick': 'flag', 'flags-sprint': 'bolt', 'flags-survival': 'flame', 'flags-crescent': 'flag', 'flags-cross': 'flag', 'flags-sun': 'flag',
  capital: 'building', 'capitals-europe': 'building', 'capitals-asia': 'building', 'capitals-africa': 'building', 'capitals-americas': 'building', 'capitals-oceania': 'building', 'cap-to-country': 'pin', 'capitals-a-z': 'letters', 'capital-same-name': 'copy',
  scramble: 'shuffle', 'missing-vowels': 'letters', endonyms: 'speech', alphabet: 'letters',
  'country-fact': 'book', currency: 'coin', 'euro-users': 'coin', 'dollar-users': 'coin', language: 'speech',
  'spanish-speaking': 'speech', 'portuguese-speaking': 'speech', 'french-speaking': 'speech', 'english-speaking': 'speech', 'arabic-speaking': 'speech',
  'pop-order': 'people', 'least-populous': 'person', area: 'expand', smallest: 'shrink',
  landlocked: 'lock', 'island-nations': 'island', 'eu-members': 'stars', 'nato-members': 'shield', g20: 'briefcase',
  'former-ussr': 'history', 'former-yugoslavia': 'puzzle', equator: 'equator', stans: 'map', 'named-after': 'person',
  'former-names': 'scroll', monarchies: 'crown', 'drive-left': 'car', ww1: 'sword', ww2: 'sword',
  caribbean: 'island', 'central-america': 'mountain', nordic: 'snow', 'gulf-states': 'drop',
  'higher-lower': 'scale', 'true-false': 'checkx', 'country-wordle': 'grid', connections: 'link', 'border-chain': 'link',
  'volcanoes': 'mountain', 'ocean-floor': 'wave', 'currents': 'wave', 'earth-lines': 'meridian', 'volcano': 'flame', 'water-cycle': 'drop', 'plate-boundaries': 'puzzle', 'climate-zones': 'equator', 'earth-orbit': 'globe', 'landscape': 'mountain', 'minerals': 'shape', 'earth-records': 'crown', 'phenomena': 'bolt', 'geologic-time': 'clock', 'biomes': 'map',
  'solar-system': 'globe', 'planets': 'stars', 'moon-phases': 'clock', 'eclipses': 'target', 'sun-anatomy': 'layers', 'moons': 'stars',
  'sky-map': 'stars', 'stars-constellations': 'stars', 'missions': 'flame', 'rivers-world': 'river', 'wonders-ancient': 'landmark', 'wonders-new': 'landmark', 'phys-europe': 'mountain', 'phys-asia': 'mountain', 'phys-africa': 'mountain', 'phys-namerica': 'mountain', 'phys-samerica': 'mountain', 'phys-oceania': 'mountain',
  'cities-world': 'building', 'cities-europe': 'building', 'cities-romania': 'building', 'hist-100': 'history', 'hist-1279': 'history', 'hist-1700': 'crown', 'hist-1914': 'history',
  'flags-historical': 'flag',
  'peaks': 'mountain', 'waterfalls': 'drop', 'natural-wonders': 'globe', 'extreme-points': 'pin', 'clouds': 'drop', 'climates': 'snow', 'scales': 'ruler',
  'earth-layers': 'layers', 'rock-cycle': 'cycle', plates: 'puzzle', rocks: 'mountain',
  islands: 'island', peninsulas: 'map', lakes: 'map', deserts: 'map', 'seas-map': 'map', straits: 'map',
  'daily-quiz': 'calendar', 'quiz-hub': 'flag', countries: 'map', 'globe-hub': 'globe', 'nameall-hub': 'list',
}
const BY_CAT = { tripoints: 'tripoint', flags: 'flag', capitals: 'building', words: 'letters', culture: 'book', numbers: 'chart', lists: 'list', arcade: 'bolt', puzzles: 'puzzle', maps: 'map', science: 'layers', space: 'stars', history: 'history' }

export function gameIconName(id) {
  if (BY_ID[id]) return BY_ID[id]
  if (id?.startsWith('tripoints-')) return 'tripoint'
  if (id?.endsWith('-quiz')) return 'question'
  if (id?.endsWith('-capitals') || id?.endsWith('-seats')) return 'building'
  return BY_CAT[QUIZ_ITEMS.find(q => q.id === id)?.cat] ?? 'globe'
}

export default function GameIcon({ id, size = 22, strokeWidth = 1.6, className = '' }) {
  // A country page or its map game: the country's flag
  const page = COUNTRY_PAGES[id] ?? (COUNTRY_GAME_HOME[id] && !id.endsWith('-quiz') && !id.endsWith('-capitals') && !id.endsWith('-seats') ? COUNTRY_PAGES[COUNTRY_GAME_HOME[id]] : null)
  if (page) return <FlagImg emoji={page.page.flag} className={`game-flag ${className}`} />
  return <Icon name={gameIconName(id)} size={size} strokeWidth={strokeWidth} className={className} />
}
