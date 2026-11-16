import { t } from '../../i18n'
import { ROMANIA } from './romania'
import { MOLDOVA } from './moldova'
import { USA } from './usa'

/**
 * "Country maps" quizzes: a flat 2D map of one country split into its subdivisions.
 *   kind 'divisions' → type the subdivision names (counties, states…)
 *   kind 'seats'     → type each subdivision's capital / county seat; its area lights up
 * Adding a country = build its map (npm run country-maps -- XX), add a data file like
 * ./romania.js and list its quizzes here (plus QUIZ_ITEMS / GAME_CATALOG entries).
 */
export const COUNTRY_MAP_QUIZZES = {
  'ro-counties': {
    map: ROMANIA, kind: 'divisions', icon: '🇷🇴',
    title: t('Counties of Romania'),
    prompt: t('Type every county — and Bucharest'),
    example: { plain: 'Timis', exact: 'Timiș' },
  },
  'ro-seats': {
    map: ROMANIA, kind: 'seats', icon: '🏙️',
    title: t('Romanian County Seats'),
    prompt: t('Type the seat of every county — its county lights up'),
    example: { plain: 'Pitesti', exact: 'Pitești' },
  },
  'md-raions': {
    map: MOLDOVA, kind: 'divisions', icon: '🇲🇩',
    title: t('Districts of Moldova'),
    prompt: t('Type every district — plus Chișinău, Bălți, Bender, Gagauzia and Transnistria'),
    placeholder: t('Type a district…'),
    example: { plain: 'Causeni', exact: 'Căușeni' },
  },
  'us-states': {
    map: USA, kind: 'divisions', icon: '🇺🇸',
    title: t('US States'),
    prompt: t('Type all 50 states — and Washington, D.C.'),
    placeholder: t('Type a state…'),
  },
  'us-capitals': {
    map: USA, kind: 'seats', icon: '🏛️',
    title: t('US State Capitals'),
    prompt: t('Type the capital of every state — its state lights up'),
    placeholder: t('Type a state capital…'),
  },
}
export const COUNTRY_MAP_IDS = new Set(Object.keys(COUNTRY_MAP_QUIZZES))
