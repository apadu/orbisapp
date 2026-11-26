import { supabase } from '../lib/supabase'
import { t } from '../i18n'

/**
 * Passport stamps. Awarded by the database (supabase/stamps.sql), never by the browser;
 * this file only describes them for display. Keep the thresholds in sync with the SQL.
 *
 * tier 1 · black ink   tier 2 · blue ink   tier 3 · red ink with gold foil
 */
const min = (m) => m * 60000

export const STAMPS = [
  { id: 'name-all',            shape: 'round',   icon: 'globe',    kicker: () => t('ALL COUNTRIES'),  label: () => t('Name All Countries'),       kind: 'time',  items: 196, blue: min(15), red: min(8) },
  { id: 'name-all-caps',       shape: 'rect',    icon: 'city',     kicker: () => t('ALL CAPITALS'),   label: () => t('Name All Capitals'),        kind: 'time',  items: 196, blue: min(15), red: min(8) },
  { id: 'name-all-currencies', shape: 'octagon', icon: 'coin',     kicker: () => t('CURRENCIES'),     label: () => t('Name All Currencies'),      kind: 'time',  items: 141, blue: min(15), red: min(8) },
  { id: 'name-all-languages',  shape: 'oval',    icon: 'speech',   kicker: () => t('LANGUAGES'),      label: () => t('Name All Languages'),       kind: 'time',  items: 89,  blue: min(10), red: min(5) },
  { id: 'mountains',           shape: 'round',   icon: 'mountain', kicker: () => t('MOUNTAIN RANGES'), label: () => t('Name All Mountain Ranges'), kind: 'time',  items: 40,  blue: min(8),  red: min(4) },
  { id: 'name-all-seas',       shape: 'oval',    icon: 'wave',     kicker: () => t('SEAS'),           label: () => t('Name All Seas'),            kind: 'time',  items: 67,  blue: min(10), red: min(5) },
  { id: 'name-all-rivers',     shape: 'rect',    icon: 'river',    kicker: () => t('RIVERS'),         label: () => t('Name All Rivers'),          kind: 'time',  items: 68,  blue: min(10), red: min(5) },
  { id: 'daily-streak',        shape: 'octagon', icon: 'thermo',   kicker: () => t('DAILY FEVER'),    label: () => t('Daily Fever streak'),       kind: 'count', unit: 'days', steps: [30, 100, 365] },
  { id: 'duel-wins',           shape: 'round',   icon: 'people',   kicker: () => t('MIND READER'),    label: () => t('Don\'t Say What I Say'),   kind: 'count', unit: 'wins', steps: [25, 100, 300] },
]
export const STAMP_BY_ID = Object.fromEntries(STAMPS.map(s => [s.id, s]))

export const fmtMinutes = (ms) => {
  const s = Math.round(ms / 1000)
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

/** What each ink asks for, in words */
export function stampNeeds(s) {
  if (s.kind === 'time') {
    return [
      t('Find all {n}', { n: s.items }),
      t('All {n} in under {m} min', { n: s.items, m: s.blue / 60000 }),
      t('All {n} in under {m} min', { n: s.items, m: s.red / 60000 }),
    ]
  }
  const word = s.unit === 'days' ? '{n} days in a row' : '{n} wins'
  return s.steps.map(n => t(word, { n }))
}

/** The big line on a stamp: 196/196 · 7:42 · 31 days */
export function stampValue(s, row) {
  if (s.kind === 'time') return `${s.items}/${s.items}`
  return t(s.unit === 'days' ? '{n} days' : '{n} wins', { n: row.value })
}

export async function fetchStamps(userId) {
  if (!supabase || !userId) return []
  const { data, error } = await supabase.from('player_stamps').select('stamp, tier, value, earned_at').eq('user_id', userId)
  if (error) throw error
  return data ?? []
}
