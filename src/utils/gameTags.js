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
  learn: [],
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
}
const NEW_DAYS = 21
export function isNewGame(id, now = Date.now()) {
  const d = ADDED[id]
  return !!d && now - Date.parse(d) < NEW_DAYS * 864e5
}
