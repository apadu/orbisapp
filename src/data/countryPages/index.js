import { t, isRo } from '../../i18n'
import { ROMANIA_PAGE } from './romania'
import { MOLDOVA_PAGE } from './moldova'
import { USA_PAGE } from './usa'
import { ROMANIA } from '../countryMaps/romania'
import { MOLDOVA } from '../countryMaps/moldova'
import { USA } from '../countryMaps/usa'

/**
 * Country pages: one hub per country (facts, an explorable map, its games) plus its
 * 20-question quiz. Add a country: write ./<country>.js like romania.js, build its map
 * (see data/countryMaps), add its 20-question table quiz in quizzes/tableQuizzes.js and list it
 * here (page + its games) and in GAME_CATALOG.
 */
export const COUNTRY_PAGES = {
  'country-ro': { slug: 'romania', page: ROMANIA_PAGE, map: ROMANIA, games: ['ro-counties', 'ro-seats', 'ro-quiz'] },
  'country-md': { slug: 'moldova', page: MOLDOVA_PAGE, map: MOLDOVA, games: ['md-raions', 'md-quiz'] },
  'country-us': { slug: 'usa', page: USA_PAGE, map: USA, games: ['us-states', 'us-capitals', 'us-quiz'] },
}
export const COUNTRY_PAGE_IDS = new Set(Object.keys(COUNTRY_PAGES))

/** The games of each country, as shown on its page (and in search / the side rail) */
export const COUNTRY_GAMES = [
  { id: 'ro-counties', icon: '🗺️', label: t('Counties of Romania'), difficulty: 'Medium', desc: t('41 counties plus Bucharest. Can you fill in the whole map of Romania?') },
  { id: 'ro-seats',    icon: '🏙️', label: t('Romanian County Seats'), difficulty: 'Hard', desc: t('From Alba Iulia to Zalău — every county seat lights up its county.') },
  { id: 'ro-quiz',     icon: '❓', label: t('Quiz: Romania'), difficulty: 'Medium', desc: t('20 questions, from the heaviest building on Earth to the first perfect 10.') },
  { id: 'md-raions',   icon: '🗺️', label: t('Districts of Moldova'), difficulty: 'Hard', desc: t('32 districts, 3 cities, Gagauzia and Transnistria. Can you fill in the map?') },
  { id: 'md-quiz',     icon: '❓', label: t('Quiz: Moldova'), difficulty: 'Medium', desc: t('20 questions, from the Prut to the world\'s largest wine collection.') },
  { id: 'us-states',   icon: '🗺️', label: t('US States'), difficulty: 'Medium', desc: t('All 50 states and D.C. — the tiny ones in the Northeast are the hard part.') },
  { id: 'us-capitals', icon: '🏛️', label: t('US State Capitals'), difficulty: 'Hard', desc: t('Sacramento, not Los Angeles. Albany, not New York. Name all 50.') },
  { id: 'us-quiz',     icon: '❓', label: t('Quiz: United States'), difficulty: 'Medium', desc: t('20 questions, from the Big Apple to the first national park.') },
]
const gameById = Object.fromEntries(COUNTRY_GAMES.map(g => [g.id, g]))
export const countryGame = (id) => gameById[id] ?? null

/** game id → the country page it belongs to ('ro-counties' → 'country-ro') */
export const COUNTRY_GAME_HOME = Object.fromEntries(
  Object.entries(COUNTRY_PAGES).flatMap(([pageId, c]) => c.games.map(g => [g, pageId])))

/** Country name in the current language */
export const countryName = (pageId) => {
  const n = COUNTRY_PAGES[pageId]?.page.name
  return n ? (isRo ? n.ro : n.en) : ''
}
export const pageIdForSlug = (slug) => Object.keys(COUNTRY_PAGES).find(id => COUNTRY_PAGES[id].slug === slug) ?? null
