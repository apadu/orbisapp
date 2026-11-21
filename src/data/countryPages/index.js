import { t, isRo } from '../../i18n'
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
import { MEXICO } from '../countryMaps/mexico'
import { INDIA } from '../countryMaps/india'
import { CHINA } from '../countryMaps/china'
import { RUSSIA } from '../countryMaps/russia'
import { ARGENTINA } from '../countryMaps/argentina'
import { TURKEY } from '../countryMaps/turkey'

// What the hubs, menus and icons need is here; the full page (facts, the 20 questions…) is
// loaded only when the country page or its quiz is opened (see LOAD), to keep it out of the
// first download.
const META = {
  ro: { flag: "🇷🇴", name: {"en": "Romania", "ro": "România"}, tagline: {"en": "Carpathians in the middle, the Danube in the south, the Black Sea in the east.", "ro": "Carpații la mijloc, Dunărea la sud, Marea Neagră la est."} },
  md: { flag: "🇲🇩", name: {"en": "Moldova", "ro": "Republica Moldova"}, tagline: {"en": "Between the Prut and the Dniester: hills, vineyards and the world's largest wine collection.", "ro": "Între Prut și Nistru: dealuri, podgorii și cea mai mare colecție de vinuri din lume."} },
  us: { flag: "🇺🇸", name: {"en": "United States", "ro": "Statele Unite ale Americii"}, tagline: {"en": "From Alaska's glaciers to the Florida Keys: 50 states across six time zones.", "ro": "De la ghețarii din Alaska la insulele Floridei: 50 de state, pe șase fusuri orare."} },
  it: { flag: "🇮🇹", name: {"en": "Italy", "ro": "Italia"}, tagline: {"en": "The boot of Europe: 20 regions, two microstates inside it and Europe's highest active volcano.", "ro": "Cizma Europei: 20 de regiuni, două microstate în interior și cel mai înalt vulcan activ din Europa."} },
  fr: { flag: "🇫🇷", name: {"en": "France", "ro": "Franța"}, tagline: {"en": "From the Channel to the Riviera: 13 regions, Western Europe's highest peak and the world's most visited city.", "ro": "De la Canalul Mânecii la Coasta de Azur: 13 regiuni, cel mai înalt vârf din Europa de Vest și cel mai vizitat oraș din lume."} },
  de: { flag: "🇩🇪", name: {"en": "Germany", "ro": "Germania"}, tagline: {"en": "From the North Sea to the Alps: 16 states, nine neighbours and the most people in the EU.", "ro": "De la Marea Nordului la Alpi: 16 landuri, nouă vecini și cea mai mare populație din UE."} },
  es: { flag: "🇪🇸", name: {"en": "Spain", "ro": "Spania"}, tagline: {"en": "From the Pyrenees to the Canary Islands: 17 autonomous communities, four languages and Gaudí's unfinished basilica.", "ro": "De la Pirinei la Insulele Canare: 17 comunități autonome, patru limbi și bazilica neterminată a lui Gaudí."} },
  jp: { flag: "🇯🇵", name: {"en": "Japan", "ro": "Japonia"}, tagline: {"en": "Four main islands and thousands of small ones: 47 prefectures from snowy Hokkaido to tropical Okinawa.", "ro": "Patru insule mari și mii de insule mici: 47 de prefecturi, de la Hokkaido cel înzăpezit la Okinawa cea tropicală."} },
  gb: { flag: "🇬🇧", name: {"en": "United Kingdom", "ro": "Regatul Unit"}, tagline: {"en": "Four nations on two islands: from the Scottish Highlands to the white cliffs of Dover.", "ro": "Patru națiuni pe două insule: din Highlands-ul scoțian până la falezele albe din Dover."} },
  pl: { flag: "🇵🇱", name: {"en": "Poland", "ro": "Polonia"}, tagline: {"en": "From the Baltic dunes to the Tatra peaks: 16 voivodeships, seven neighbours and a thousand years of history.", "ro": "De la dunele Balticii la vârfurile Tatra: 16 voievodate, șapte vecini și o mie de ani de istorie."} },
  hu: { flag: "🇭🇺", name: {"en": "Hungary", "ro": "Ungaria"}, tagline: {"en": "Lake Balaton, the Danube through Budapest and the great plain: 19 counties and a capital in the middle.", "ro": "Lacul Balaton, Dunărea prin Budapesta și marea câmpie: 19 comitate și o capitală la mijloc."} },
  br: { flag: "🇧🇷", name: {"en": "Brazil", "ro": "Brazilia"}, tagline: {"en": "Half of South America: the Amazon, Rio's beaches and 26 states around a capital built from scratch.", "ro": "Jumătate din America de Sud: Amazonul, plajele din Rio și 26 de state în jurul unei capitale construite de la zero."} },
  ca: { flag: "🇨🇦", name: {"en": "Canada", "ro": "Canada"}, tagline: {"en": "The second-largest country on Earth: 10 provinces, 3 northern territories and the longest coastline in the world.", "ro": "A doua cea mai mare țară de pe Pământ: 10 provincii, 3 teritorii nordice și cea mai lungă coastă din lume."} },
  au: { flag: "🇦🇺", name: {"en": "Australia", "ro": "Australia"}, tagline: {"en": "A country the size of a continent: six states, two territories, the Outback and the Great Barrier Reef.", "ro": "O țară cât un continent: șase state, două teritorii, Outback-ul și Marea Barieră de Corali."} },
  mx: { flag: "🇲🇽", name: {"en": "Mexico", "ro": "Mexic"}, tagline: {"en": "Aztec and Maya cities, two oceans and 31 states around one of the largest cities on Earth.", "ro": "Orașe aztece și maya, două oceane și 31 de state în jurul unuia dintre cele mai mari orașe de pe Pământ."} },
  in: { flag: "🇮🇳", name: {"en": "India", "ro": "India"}, tagline: {"en": "The most populous country on Earth: from the Himalayas to Kerala, 28 states and 8 union territories.", "ro": "Cea mai populată țară de pe Pământ: de la Himalaya la Kerala, 28 de state și 8 teritorii unionale."} },
  cn: { flag: "🇨🇳", name: {"en": "China", "ro": "China"}, tagline: {"en": "The Great Wall, the Yangtze and 31 provinces, regions and cities — from Tibet to Shanghai.", "ro": "Marele Zid, Yangtze și 31 de provincii, regiuni și municipii — de la Tibet la Shanghai."} },
  ru: { flag: "🇷🇺", name: {"en": "Russia", "ro": "Rusia"}, tagline: {"en": "The largest country on Earth: 11 time zones, from the Baltic to the Bering Strait.", "ro": "Cea mai mare țară de pe Pământ: 11 fusuri orare, de la Marea Baltică la Strâmtoarea Bering."} },
  ar: { flag: "🇦🇷", name: {"en": "Argentina", "ro": "Argentina"}, tagline: {"en": "Tango, the Andes and Patagonia: 23 provinces from the Iguazú Falls to Tierra del Fuego.", "ro": "Tango, Anzii și Patagonia: 23 de provincii, de la Cascadele Iguazú la Țara de Foc."} },
  tr: { flag: "🇹🇷", name: {"en": "Turkey", "ro": "Turcia"}, tagline: {"en": "Between Europe and Asia: Istanbul, Cappadocia and 81 provinces from Edirne to Ararat.", "ro": "Între Europa și Asia: Istanbul, Cappadocia și 81 de provincii, de la Edirne la Ararat."} },
}
/** The full page data of each country, loaded on demand */
export const LOAD_PAGE = {
  ro: () => import('./romania').then(m => m.ROMANIA_PAGE),
  md: () => import('./moldova').then(m => m.MOLDOVA_PAGE),
  us: () => import('./usa').then(m => m.USA_PAGE),
  it: () => import('./italy').then(m => m.ITALY_PAGE),
  fr: () => import('./france').then(m => m.FRANCE_PAGE),
  de: () => import('./germany').then(m => m.GERMANY_PAGE),
  es: () => import('./spain').then(m => m.SPAIN_PAGE),
  jp: () => import('./japan').then(m => m.JAPAN_PAGE),
  gb: () => import('./unitedKingdom').then(m => m.UNITED_KINGDOM_PAGE),
  pl: () => import('./poland').then(m => m.POLAND_PAGE),
  hu: () => import('./hungary').then(m => m.HUNGARY_PAGE),
  br: () => import('./brazil').then(m => m.BRAZIL_PAGE),
  ca: () => import('./canada').then(m => m.CANADA_PAGE),
  au: () => import('./australia').then(m => m.AUSTRALIA_PAGE),
  mx: () => import('./mexico').then(m => m.MEXICO_PAGE),
  in: () => import('./india').then(m => m.INDIA_PAGE),
  cn: () => import('./china').then(m => m.CHINA_PAGE),
  ru: () => import('./russia').then(m => m.RUSSIA_PAGE),
  ar: () => import('./argentina').then(m => m.ARGENTINA_PAGE),
  tr: () => import('./turkey').then(m => m.TURKEY_PAGE),
}

/**
 * Country pages: one hub per country (facts, an explorable map, its games) plus its
 * 20-question quiz. Add a country: write ./<country>.js like romania.js, build its map
 * (see data/countryMaps), add its 20-question table quiz in quizzes/tableQuizzes.js and list it
 * here (page + its games) and in GAME_CATALOG.
 */
export const COUNTRY_PAGES = {
  'country-ro': { slug: 'romania', page: META.ro, load: LOAD_PAGE.ro, map: ROMANIA, games: ['ro-counties', 'ro-seats', 'ro-quiz'] },
  'country-md': { slug: 'moldova', page: META.md, load: LOAD_PAGE.md, map: MOLDOVA, games: ['md-raions', 'md-quiz'] },
  'country-us': { slug: 'usa', page: META.us, load: LOAD_PAGE.us, map: USA, games: ['us-states', 'us-capitals', 'us-quiz'] },
  'country-it': { slug: 'italy', page: META.it, load: LOAD_PAGE.it, map: ITALY, games: ['it-regions', 'it-capitals', 'it-quiz'] },
  'country-fr': { slug: 'france', page: META.fr, load: LOAD_PAGE.fr, map: FRANCE, games: ['fr-regions', 'fr-capitals', 'fr-quiz'] },
  'country-de': { slug: 'germany', page: META.de, load: LOAD_PAGE.de, map: GERMANY, games: ['de-states', 'de-capitals', 'de-quiz'] },
  'country-es': { slug: 'spain', page: META.es, load: LOAD_PAGE.es, map: SPAIN, games: ['es-regions', 'es-capitals', 'es-quiz'] },
  'country-jp': { slug: 'japan', page: META.jp, load: LOAD_PAGE.jp, map: JAPAN, games: ['jp-prefectures', 'jp-capitals', 'jp-quiz'] },
  'country-gb': { slug: 'united-kingdom', page: META.gb, load: LOAD_PAGE.gb, map: UNITED_KINGDOM, games: ['gb-regions', 'gb-quiz'] },
  'country-pl': { slug: 'poland', page: META.pl, load: LOAD_PAGE.pl, map: POLAND, games: ['pl-voivodeships', 'pl-capitals', 'pl-quiz'] },
  'country-hu': { slug: 'hungary', page: META.hu, load: LOAD_PAGE.hu, map: HUNGARY, games: ['hu-counties', 'hu-seats', 'hu-quiz'] },
  'country-br': { slug: 'brazil', page: META.br, load: LOAD_PAGE.br, map: BRAZIL, games: ['br-states', 'br-capitals', 'br-quiz'] },
  'country-ca': { slug: 'canada', page: META.ca, load: LOAD_PAGE.ca, map: CANADA, games: ['ca-provinces', 'ca-capitals', 'ca-quiz'] },
  'country-au': { slug: 'australia', page: META.au, load: LOAD_PAGE.au, map: AUSTRALIA, games: ['au-states', 'au-capitals', 'au-quiz'] },
  'country-mx': { slug: 'mexico', page: META.mx, load: LOAD_PAGE.mx, map: MEXICO, games: ['mx-states', 'mx-capitals', 'mx-quiz'] },
  'country-in': { slug: 'india', page: META.in, load: LOAD_PAGE.in, map: INDIA, games: ['in-states', 'in-capitals', 'in-quiz'] },
  'country-cn': { slug: 'china', page: META.cn, load: LOAD_PAGE.cn, map: CHINA, games: ['cn-provinces', 'cn-capitals', 'cn-quiz'] },
  'country-ru': { slug: 'russia', page: META.ru, load: LOAD_PAGE.ru, map: RUSSIA, games: ['ru-subjects', 'ru-quiz'] },
  'country-ar': { slug: 'argentina', page: META.ar, load: LOAD_PAGE.ar, map: ARGENTINA, games: ['ar-provinces', 'ar-capitals', 'ar-quiz'] },
  'country-tr': { slug: 'turkey', page: META.tr, load: LOAD_PAGE.tr, map: TURKEY, games: ['tr-provinces', 'tr-quiz'] },
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
  { id: 'mx-states', icon: '🗺️', label: t("States of Mexico"), desc: t("From Baja California to Yucat\u00e1n \u2014 31 states and the capital.") },
  { id: 'mx-capitals', icon: '🏛️', label: t("State Capitals of Mexico"), desc: t("Monterrey, Guadalajara, M\u00e9rida\u2026 and Toluca. Every state capital.") },
  { id: 'mx-quiz', icon: '❓', label: t("Quiz: Mexico"), desc: t("20 questions, from the Aztecs to the Day of the Dead.") },
  { id: 'in-states', icon: '🗺️', label: t("States and Territories of India"), desc: t("28 states and 8 union territories, from Ladakh to Kerala.") },
  { id: 'in-capitals', icon: '🏛️', label: t("State Capitals of India"), desc: t("Mumbai, Kolkata, Chennai\u2026 and Dispur. Punjab and Haryana share one.") },
  { id: 'in-quiz', icon: '❓', label: t("Quiz: India"), desc: t("20 questions, from the Taj Mahal to Diwali.") },
  { id: 'cn-provinces', icon: '🗺️', label: t("Provinces of China"), desc: t("22 provinces, 5 autonomous regions and 4 cities, from Tibet to Shanghai.") },
  { id: 'cn-capitals', icon: '🏛️', label: t("Provincial Capitals of China"), desc: t("Guangzhou, Chengdu, Wuhan\u2026 and Hohhot. 27 provincial capitals.") },
  { id: 'cn-quiz', icon: '❓', label: t("Quiz: China"), desc: t("20 questions, from the Great Wall to the giant panda.") },
  { id: 'ru-subjects', icon: '🗺️', label: t("Federal Subjects of Russia"), desc: t("83 republics, krais and oblasts across 11 time zones. A real challenge.") },
  { id: 'ru-quiz', icon: '❓', label: t("Quiz: Russia"), desc: t("20 questions, from Lake Baikal to Sputnik.") },
  { id: 'ar-provinces', icon: '🗺️', label: t("Provinces of Argentina"), desc: t("23 provinces from Jujuy to Tierra del Fuego, plus the capital.") },
  { id: 'ar-capitals', icon: '🏛️', label: t("Provincial Capitals of Argentina"), desc: t("La Plata, not Buenos Aires. Then Rawson, Viedma, Ushuaia\u2026") },
  { id: 'ar-quiz', icon: '❓', label: t("Quiz: Argentina"), desc: t("20 questions, from tango to Patagonia.") },
  { id: 'tr-provinces', icon: '🗺️', label: t("Provinces of Turkey"), desc: t("81 provinces from Edirne to Hakk\u00e2ri. Most share their capital's name.") },
  { id: 'tr-quiz', icon: '❓', label: t("Quiz: Turkey"), desc: t("20 questions, from Cappadocia to Hagia Sophia.") },
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
