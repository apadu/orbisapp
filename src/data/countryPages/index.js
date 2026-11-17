import { t, isRo } from '../../i18n'
import { ROMANIA_PAGE } from './romania'
import { MOLDOVA_PAGE } from './moldova'
import { USA_PAGE } from './usa'
import { ITALY_PAGE } from './italy'
import { FRANCE_PAGE } from './france'
import { GERMANY_PAGE } from './germany'
import { SPAIN_PAGE } from './spain'
import { JAPAN_PAGE } from './japan'
import { UNITED_KINGDOM_PAGE } from './unitedKingdom'
import { POLAND_PAGE } from './poland'
import { HUNGARY_PAGE } from './hungary'
import { BRAZIL_PAGE } from './brazil'
import { CANADA_PAGE } from './canada'
import { AUSTRALIA_PAGE } from './australia'
import { ROMANIA } from '../countryMaps/romania'
import { MOLDOVA } from '../countryMaps/moldova'
import { USA } from '../countryMaps/usa'
import { ITALY } from '../countryMaps/italy'
import { FRANCE } from '../countryMaps/france'
import { GERMANY } from '../countryMaps/germany'
import { SPAIN } from '../countryMaps/spain'
import { JAPAN } from '../countryMaps/japan'
import { UNITED_KINGDOM } from '../countryMaps/unitedKingdom'
import { POLAND } from '../countryMaps/poland'
import { HUNGARY } from '../countryMaps/hungary'
import { BRAZIL } from '../countryMaps/brazil'
import { CANADA } from '../countryMaps/canada'
import { AUSTRALIA } from '../countryMaps/australia'

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
  'country-it': { slug: 'italy', page: ITALY_PAGE, map: ITALY, games: ['it-regions', 'it-capitals', 'it-quiz'] },
  'country-fr': { slug: 'france', page: FRANCE_PAGE, map: FRANCE, games: ['fr-regions', 'fr-capitals', 'fr-quiz'] },
  'country-de': { slug: 'germany', page: GERMANY_PAGE, map: GERMANY, games: ['de-states', 'de-capitals', 'de-quiz'] },
  'country-es': { slug: 'spain', page: SPAIN_PAGE, map: SPAIN, games: ['es-regions', 'es-capitals', 'es-quiz'] },
  'country-jp': { slug: 'japan', page: JAPAN_PAGE, map: JAPAN, games: ['jp-prefectures', 'jp-capitals', 'jp-quiz'] },
  'country-gb': { slug: 'united-kingdom', page: UNITED_KINGDOM_PAGE, map: UNITED_KINGDOM, games: ['gb-regions', 'gb-quiz'] },
  'country-pl': { slug: 'poland', page: POLAND_PAGE, map: POLAND, games: ['pl-voivodeships', 'pl-capitals', 'pl-quiz'] },
  'country-hu': { slug: 'hungary', page: HUNGARY_PAGE, map: HUNGARY, games: ['hu-counties', 'hu-seats', 'hu-quiz'] },
  'country-br': { slug: 'brazil', page: BRAZIL_PAGE, map: BRAZIL, games: ['br-states', 'br-capitals', 'br-quiz'] },
  'country-ca': { slug: 'canada', page: CANADA_PAGE, map: CANADA, games: ['ca-provinces', 'ca-capitals', 'ca-quiz'] },
  'country-au': { slug: 'australia', page: AUSTRALIA_PAGE, map: AUSTRALIA, games: ['au-states', 'au-capitals', 'au-quiz'] },
}
export const COUNTRY_PAGE_IDS = new Set(Object.keys(COUNTRY_PAGES))

/** The games of each country, as shown on its page (and in search / the side rail) */
export const COUNTRY_GAMES = [
  { id: 'ro-counties', icon: '🗺️', label: t('Counties of Romania'), desc: t('41 counties plus Bucharest. Can you fill in the whole map of Romania?') },
  { id: 'ro-seats',    icon: '🏙️', label: t('Romanian County Seats'), desc: t('From Alba Iulia to Zalău — every county seat lights up its county.') },
  { id: 'ro-quiz',     icon: '❓', label: t('Quiz: Romania'), desc: t('20 questions, from the heaviest building on Earth to the first perfect 10.') },
  { id: 'md-raions',   icon: '🗺️', label: t('Districts of Moldova'), desc: t('32 districts, 3 cities, Gagauzia and Transnistria. Can you fill in the map?') },
  { id: 'md-quiz',     icon: '❓', label: t('Quiz: Moldova'), desc: t('20 questions, from the Prut to the world\'s largest wine collection.') },
  { id: 'us-states',   icon: '🗺️', label: t('US States'), desc: t('All 50 states and D.C. — the tiny ones in the Northeast are the hard part.') },
  { id: 'us-capitals', icon: '🏛️', label: t('US State Capitals'), desc: t('Sacramento, not Los Angeles. Albany, not New York. Name all 50.') },
  { id: 'us-quiz',     icon: '❓', label: t('Quiz: United States'), desc: t('20 questions, from the Big Apple to the first national park.') },
  { id: 'it-regions', icon: '🗺️', label: t('Regions of Italy'), desc: t('From Aosta Valley to Sicily — 20 regions on the boot.') },
  { id: 'it-capitals', icon: '🏛️', label: t('Regional Capitals of Italy'), desc: t('Turin, Milan, Venice… and Catanzaro. Every regional capital.') },
  { id: 'it-quiz', icon: '❓', label: t('Quiz: Italy'), desc: t('20 questions, from Vesuvius to the Colosseum.') },
  { id: 'fr-regions', icon: '🗺️', label: t('Regions of France'), desc: t('13 regions since 2016. Grand Est, Occitania, Hauts-de-France…') },
  { id: 'fr-capitals', icon: '🏛️', label: t('Regional Capitals of France'), desc: t('Lyon, Rennes, Ajaccio — the prefecture of every region.') },
  { id: 'fr-quiz', icon: '❓', label: t('Quiz: France'), desc: t('20 questions, from the Bastille to the Channel Tunnel.') },
  { id: 'de-states', icon: '🗺️', label: t('States of Germany'), desc: t('16 Länder, three of them cities. Can you fill in the map?') },
  { id: 'de-capitals', icon: '🏛️', label: t('State Capitals of Germany'), desc: t('Düsseldorf, not Cologne. Wiesbaden, not Frankfurt. Name all 13.') },
  { id: 'de-quiz', icon: '❓', label: t('Quiz: Germany'), desc: t('20 questions, from the Zugspitze to the Brandenburg Gate.') },
  { id: 'es-regions', icon: '🗺️', label: t('Autonomous Communities of Spain'), desc: t('17 communities from Galicia to the Canary Islands, plus Ceuta and Melilla.') },
  { id: 'es-capitals', icon: '🏛️', label: t('Regional Capitals of Spain'), desc: t('Mérida, Vitoria-Gasteiz, Santiago de Compostela — every regional capital.') },
  { id: 'es-quiz', icon: '❓', label: t('Quiz: Spain'), desc: t('20 questions, from the Alhambra to the Sagrada Família.') },
  { id: 'jp-prefectures', icon: '🗺️', label: t('Prefectures of Japan'), desc: t('47 prefectures from Hokkaido to Okinawa. The small ones are the hard part.') },
  { id: 'jp-capitals', icon: '🏯', label: t('Prefectural Capitals of Japan'), desc: t('Kanagawa → Yokohama, Aichi → Nagoya, Hyogo → Kobe… name all 47.') },
  { id: 'jp-quiz', icon: '❓', label: t('Quiz: Japan'), desc: t('20 questions, from Mount Fuji to the bullet train.') },
  { id: 'gb-regions', icon: '🗺️', label: t('Regions of the United Kingdom'), desc: t('London, Scotland, the Midlands… the 12 regions of the UK.') },
  { id: 'gb-quiz', icon: '❓', label: t('Quiz: United Kingdom'), desc: t('20 questions, from Big Ben to Loch Ness.') },
  { id: 'pl-voivodeships', icon: '🗺️', label: t('Voivodeships of Poland'), desc: t('Masovia, Silesia, Pomerania… the 16 voivodeships of Poland.') },
  { id: 'pl-capitals', icon: '🏛️', label: t('Voivodeship Capitals of Poland'), desc: t('Kraków, Gdańsk, Wrocław… and Gorzów. Every voivodeship capital.') },
  { id: 'pl-quiz', icon: '❓', label: t('Quiz: Poland'), desc: t('20 questions, from Chopin to the Wieliczka salt mine.') },
  { id: 'hu-counties', icon: '🗺️', label: t('Counties of Hungary'), desc: t('19 counties around Budapest. Can you fill in the map?') },
  { id: 'hu-seats', icon: '🏛️', label: t('County Seats of Hungary'), desc: t('Debrecen, Szeged, Pécs… the seat of every Hungarian county.') },
  { id: 'hu-quiz', icon: '❓', label: t('Quiz: Hungary'), desc: t('20 questions, from Lake Balaton to the Rubik\'s cube.') },
  { id: 'br-states', icon: '🗺️', label: t('States of Brazil'), desc: t('26 states from Amazonas to Rio Grande do Sul. Fill in the map.') },
  { id: 'br-capitals', icon: '🏛️', label: t('State Capitals of Brazil'), desc: t('Manaus, Salvador, Curitiba… the capital of every Brazilian state.') },
  { id: 'br-quiz', icon: '❓', label: t('Quiz: Brazil'), desc: t('20 questions, from the Amazon to the Copacabana.') },
  { id: 'ca-provinces', icon: '🗺️', label: t('Provinces and Territories of Canada'), desc: t('10 provinces and 3 territories, from Yukon to Newfoundland.') },
  { id: 'ca-capitals', icon: '🏛️', label: t('Provincial Capitals of Canada'), desc: t('Victoria, not Vancouver. Iqaluit, Whitehorse, Yellowknife… name all 13.') },
  { id: 'ca-quiz', icon: '❓', label: t('Quiz: Canada'), desc: t('20 questions, from Niagara Falls to poutine.') },
  { id: 'au-states', icon: '🗺️', label: t('States and Territories of Australia'), desc: t('6 states and 2 territories. The easiest map in the game — or is it?') },
  { id: 'au-capitals', icon: '🏛️', label: t('State Capitals of Australia'), desc: t('Canberra, not Sydney. Then Perth, Darwin, Hobart…') },
  { id: 'au-quiz', icon: '❓', label: t('Quiz: Australia'), desc: t('20 questions, from Uluru to the platypus.') },
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
