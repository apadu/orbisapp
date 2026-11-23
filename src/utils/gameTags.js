import { TRIPOINT_IDS } from '../quizzes/tripointQuizzes'
import { t } from '../i18n'
import { plain } from './plain'

/**
 * One tag per game, built the same way everywhere: how you answer + (optionally) how
 * the game runs. Shown at the bottom of every game card.
 */
const INPUT = {
  click:    () => t('🖱 Click'),
  type:     () => t('⌨️ Type'),
  choose:   () => t('🔘 Choose'),
  estimate: () => t('🎚 Estimate'),
}
const MODE = {
  timed:  () => t('⏱ Timed'),
  daily:  () => t('📅 Daily'),
  streak: () => t('🔥 Streak'),
}

// [input, mode?] — games not listed: typed answers with a timer (the quiz default)
const TAGS = {
  locate: ['click'], 'capital-drop': ['click'], 'landmark-drop': ['click'], antipodes: ['click'], 'time-zones': ['click'],
  neighbor: ['type'], spotlight: ['type'], seas: ['type'], 'line-up': ['type'], 'border-chain': ['type'], 'country-wordle': ['type'],
  missing: ['type', 'timed'], silhouette: ['type', 'timed'], mystery: ['type', 'daily'], 'daily-quiz': ['type', 'daily'],
  distance: ['estimate'],
  connections: ['choose'], 'true-false': ['choose'], 'higher-lower': ['choose', 'streak'],
  'flags-pick': ['choose'], 'flags-sprint': ['type', 'timed'], 'flags-survival': ['choose', 'streak'],
}

export function gameTag(id, { short = false } = {}) {
  const [input, mode] = TAGS[id] ?? ['type', 'timed']
  const parts = [input && INPUT[input](), mode && MODE[mode]()].filter(Boolean).map(plain)
  // short: only how you answer (cards that also show your best score)
  return short ? parts[0] ?? '' : parts.join(' · ')
}

// When games were added (only ones added after the October relaunch). "NEW" shows
// for NEW_DAYS after that, and only until you've played the game once.
const ADDED = {
  'landmark-drop': '2026-10-28', distance: '2026-10-28', antipodes: '2026-10-28',
  ww1: '2026-10-28', ww2: '2026-10-28', 'former-names': '2026-10-28', monarchies: '2026-10-28', 'drive-left': '2026-10-28', 'named-after': '2026-10-28',
  'ro-counties': '2026-11-16', 'ro-seats': '2026-11-16', 'ro-quiz': '2026-11-16',
  'md-raions': '2026-11-16', 'md-quiz': '2026-11-16',
  'us-states': '2026-11-16', 'us-capitals': '2026-11-16', 'us-quiz': '2026-11-16',
  'country-ro': '2026-11-16', 'country-md': '2026-11-16', 'country-us': '2026-11-16',
  'it-regions': '2026-11-16', 'it-capitals': '2026-11-16', 'it-quiz': '2026-11-16', 'country-it': '2026-11-16', 'fr-regions': '2026-11-16', 'fr-capitals': '2026-11-16', 'fr-quiz': '2026-11-16', 'country-fr': '2026-11-16', 'de-states': '2026-11-16', 'de-capitals': '2026-11-16', 'de-quiz': '2026-11-16', 'country-de': '2026-11-16', 'es-regions': '2026-11-16', 'es-capitals': '2026-11-16', 'es-quiz': '2026-11-16', 'country-es': '2026-11-16', 'jp-prefectures': '2026-11-16', 'jp-capitals': '2026-11-16', 'jp-quiz': '2026-11-16', 'country-jp': '2026-11-16',
  ...Object.fromEntries([...TRIPOINT_IDS].map(id => [id, '2026-11-17'])),
  'gb-regions': '2026-11-17', 'gb-quiz': '2026-11-17', 'country-gb': '2026-11-17', 'pl-voivodeships': '2026-11-17', 'pl-capitals': '2026-11-17', 'pl-quiz': '2026-11-17', 'country-pl': '2026-11-17', 'hu-counties': '2026-11-17', 'hu-seats': '2026-11-17', 'hu-quiz': '2026-11-17', 'country-hu': '2026-11-17', 'br-states': '2026-11-17', 'br-capitals': '2026-11-17', 'br-quiz': '2026-11-17', 'country-br': '2026-11-17', 'ca-provinces': '2026-11-17', 'ca-capitals': '2026-11-17', 'ca-quiz': '2026-11-17', 'country-ca': '2026-11-17', 'au-states': '2026-11-17', 'au-capitals': '2026-11-17', 'au-quiz': '2026-11-17', 'country-au': '2026-11-17',
  islands: '2026-11-18', peninsulas: '2026-11-18',
  lakes: '2026-11-20', deserts: '2026-11-20', 'seas-map': '2026-11-20', straits: '2026-11-20',
  'capitals-europe': '2026-11-20', 'capitals-asia': '2026-11-20', 'capitals-africa': '2026-11-20', 'capitals-americas': '2026-11-20', 'capitals-oceania': '2026-11-20',
  'mx-states': '2026-11-20', 'mx-capitals': '2026-11-20', 'mx-quiz': '2026-11-20', 'country-mx': '2026-11-20', 'in-states': '2026-11-20', 'in-capitals': '2026-11-20', 'in-quiz': '2026-11-20', 'country-in': '2026-11-20', 'cn-provinces': '2026-11-20', 'cn-capitals': '2026-11-20', 'cn-quiz': '2026-11-20', 'country-cn': '2026-11-20', 'ru-subjects': '2026-11-20', 'ru-quiz': '2026-11-20', 'country-ru': '2026-11-20', 'ar-provinces': '2026-11-20', 'ar-capitals': '2026-11-20', 'ar-quiz': '2026-11-20', 'country-ar': '2026-11-20', 'tr-provinces': '2026-11-20', 'tr-quiz': '2026-11-20', 'country-tr': '2026-11-20',
  'ports': '2026-11-23',
  'kr-provinces': '2026-11-22', 'kr-capitals': '2026-11-22', 'kr-quiz': '2026-11-22', 'country-kr': '2026-11-22', 'eg-governorates': '2026-11-22', 'eg-capitals': '2026-11-22', 'eg-quiz': '2026-11-22', 'country-eg': '2026-11-22', 'ng-states': '2026-11-22', 'ng-capitals': '2026-11-22', 'ng-quiz': '2026-11-22', 'country-ng': '2026-11-22', 'za-provinces': '2026-11-22', 'za-capitals': '2026-11-22', 'za-quiz': '2026-11-22', 'country-za': '2026-11-22', 'th-provinces': '2026-11-22', 'th-quiz': '2026-11-22', 'country-th': '2026-11-22',
  'pe-regions': '2026-11-22', 'pe-capitals': '2026-11-22', 'pe-quiz': '2026-11-22', 'country-pe': '2026-11-22', 'co-departments': '2026-11-22', 'co-capitals': '2026-11-22', 'co-quiz': '2026-11-22', 'country-co': '2026-11-22', 'ir-provinces': '2026-11-22', 'ir-capitals': '2026-11-22', 'ir-quiz': '2026-11-22', 'country-ir': '2026-11-22', 'gr-regions': '2026-11-22', 'gr-capitals': '2026-11-22', 'gr-quiz': '2026-11-22', 'country-gr': '2026-11-22', 'se-counties': '2026-11-22', 'se-capitals': '2026-11-22', 'se-quiz': '2026-11-22', 'country-se': '2026-11-22', 'pt-districts': '2026-11-22', 'pt-quiz': '2026-11-22', 'country-pt': '2026-11-22',
  'volcanoes': '2026-11-21', 'volcano': '2026-11-21', 'plate-boundaries': '2026-11-21', 'ocean-floor': '2026-11-21', 'water-cycle': '2026-11-21', 'currents': '2026-11-21', 'climate-zones': '2026-11-21', 'earth-lines': '2026-11-21', 'earth-orbit': '2026-11-21', 'landscape': '2026-11-21', 'biomes': '2026-11-21', 'minerals': '2026-11-21', 'phenomena': '2026-11-21', 'earth-records': '2026-11-21', 'geologic-time': '2026-11-21',
  'solar-system': '2026-11-21', 'planets': '2026-11-21', 'moon-phases': '2026-11-21', 'eclipses': '2026-11-21', 'sun-anatomy': '2026-11-21', 'moons': '2026-11-21',
  'sky-map': '2026-11-21', 'stars-constellations': '2026-11-21', 'missions': '2026-11-21', 'phys-europe': '2026-11-21', 'phys-asia': '2026-11-21', 'phys-africa': '2026-11-21', 'phys-namerica': '2026-11-21', 'phys-samerica': '2026-11-21', 'phys-oceania': '2026-11-21', 'rivers-world': '2026-11-21', 'wonders-ancient': '2026-11-21', 'wonders-new': '2026-11-21',
  'cities-world': '2026-11-21', 'cities-europe': '2026-11-21', 'cities-romania': '2026-11-21', 'hist-100': '2026-11-21', 'hist-1279': '2026-11-21', 'hist-1700': '2026-11-21', 'hist-1914': '2026-11-21',
  'flags-historical': '2026-11-21',
  'river-coast': '2026-11-21', 'atmosphere': '2026-11-21', 'volcano-types': '2026-11-21', 'milky-way': '2026-11-21', 'star-life': '2026-11-21', 'moon-map': '2026-11-21', 'mars-map': '2026-11-21', 'bright-stars': '2026-11-21', 'zodiac': '2026-11-21', 'glaciers': '2026-11-21', 'records-map': '2026-11-21', 'scale-sort': '2026-11-21',
  'peaks': '2026-11-21', 'waterfalls': '2026-11-21', 'natural-wonders': '2026-11-21', 'extreme-points': '2026-11-21', 'clouds': '2026-11-21', 'climates': '2026-11-21', 'scales': '2026-11-21',
  plates: '2026-11-20', 'earth-layers': '2026-11-20', 'rock-cycle': '2026-11-20', rocks: '2026-11-20',
  'flags-pick': '2026-11-20', 'flags-sprint': '2026-11-20', 'flags-survival': '2026-11-20',
}
const NEW_DAYS = 21
/** The day a game was added (YYYY-MM-DD), or null for the original games. */
export const addedOn = (id) => ADDED[id] ?? null
export function isNewGame(id, now = Date.now()) {
  const d = ADDED[id]
  return !!d && now - Date.parse(d) < NEW_DAYS * 864e5
}
