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
import { SOUTH_KOREA } from '../countryMaps/southKorea'
import { EGYPT } from '../countryMaps/egypt'
import { NIGERIA } from '../countryMaps/nigeria'
import { SOUTH_AFRICA } from '../countryMaps/southAfrica'
import { THAILAND } from '../countryMaps/thailand'
import { PERU } from '../countryMaps/peru'
import { COLOMBIA } from '../countryMaps/colombia'
import { IRAN } from '../countryMaps/iran'
import { GREECE } from '../countryMaps/greece'
import { SWEDEN } from '../countryMaps/sweden'
import { PORTUGAL } from '../countryMaps/portugal'
import { SWITZERLAND } from '../countryMaps/switzerland'
import { CZECHIA } from '../countryMaps/czechia'
import { BELGIUM } from '../countryMaps/belgium'
import { SLOVAKIA } from '../countryMaps/slovakia'
import { IRELAND } from '../countryMaps/ireland'
import { MALAYSIA } from '../countryMaps/malaysia'
import { SRI_LANKA } from '../countryMaps/sriLanka'
import { MONGOLIA } from '../countryMaps/mongolia'
import { ECUADOR } from '../countryMaps/ecuador'
import { BOLIVIA } from '../countryMaps/bolivia'
import { BULGARIA } from '../countryMaps/bulgaria'
import { KENYA } from '../countryMaps/kenya'
import { GHANA } from '../countryMaps/ghana'
import { TUNISIA } from '../countryMaps/tunisia'
import { SENEGAL } from '../countryMaps/senegal'
import { CAMEROON } from '../countryMaps/cameroon'
import { NETHERLANDS } from '../countryMaps/netherlands'
import { UKRAINE } from '../countryMaps/ukraine'
import { AUSTRIA } from '../countryMaps/austria'
import { CHILE } from '../countryMaps/chile'
import { NEW_ZEALAND } from '../countryMaps/newZealand'
import { SAUDI_ARABIA } from '../countryMaps/saudiArabia'

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
  kr: { flag: "🇰🇷", name: {"en": "South Korea", "ro": "Coreea de Sud"}, tagline: {"en": "Seoul, Busan and the volcanic island of Jeju: 17 provinces and cities on the southern half of a peninsula.", "ro": "Seul, Busan și insula vulcanică Jeju: 17 provincii și orașe pe jumătatea de sud a unei peninsule."} },
  eg: { flag: "🇪🇬", name: {"en": "Egypt", "ro": "Egipt"}, tagline: {"en": "The Nile, the Pyramids and the Suez Canal: 27 governorates from the Mediterranean to Aswan.", "ro": "Nilul, Piramidele și Canalul Suez: 27 de guvernorate, de la Mediterana la Aswan."} },
  ng: { flag: "🇳🇬", name: {"en": "Nigeria", "ro": "Nigeria"}, tagline: {"en": "Africa's most populous country: Lagos, the Niger Delta and 36 states around a capital built in the 1980s.", "ro": "Cea mai populată țară din Africa: Lagos, Delta Nigerului și 36 de state în jurul unei capitale construite în anii 1980."} },
  za: { flag: "🇿🇦", name: {"en": "South Africa", "ro": "Africa de Sud"}, tagline: {"en": "Three capitals, 12 official languages and two oceans: 9 provinces from Table Mountain to Kruger.", "ro": "Trei capitale, 12 limbi oficiale și două oceane: 9 provincii, de la Muntele Masă la Kruger."} },
  th: { flag: "🇹🇭", name: {"en": "Thailand", "ro": "Thailanda"}, tagline: {"en": "Temples, islands and the Mekong: Bangkok and 76 provinces from Chiang Rai to the Malay border.", "ro": "Temple, insule și Mekongul: Bangkok și 76 de provincii, de la Chiang Rai la granița cu Malaysia."} },
  pe: { flag: "🇵🇪", name: {"en": "Peru", "ro": "Peru"}, tagline: {"en": "Machu Picchu, Lake Titicaca and the Amazon: 24 departments, Lima and Callao, from the desert coast to the Andes.", "ro": "Machu Picchu, Lacul Titicaca și Amazonul: 24 de departamente, Lima și Callao, de la coasta deșertică la Anzi."} },
  co: { flag: "🇨🇴", name: {"en": "Colombia", "ro": "Columbia"}, tagline: {"en": "Coffee, emeralds and two coasts: 32 departments and Bogotá, from the Caribbean to the Amazon.", "ro": "Cafea, smaralde și două coaste: 32 de departamente și Bogotá, de la Caraibe la Amazon."} },
  ir: { flag: "🇮🇷", name: {"en": "Iran", "ro": "Iran"}, tagline: {"en": "Ancient Persia: Persepolis, Isfahan and the Caspian, 31 provinces between the mountains and the Gulf.", "ro": "Vechea Persie: Persepolis, Isfahan și Marea Caspică, 31 de provincii între munți și Golf."} },
  gr: { flag: "🇬🇷", name: {"en": "Greece", "ro": "Grecia"}, tagline: {"en": "The Acropolis, Olympus and some 6,000 islands: 13 regions and the monks' republic of Mount Athos.", "ro": "Acropola, Olimpul și circa 6.000 de insule: 13 regiuni și republica monahală de pe Muntele Athos."} },
  se: { flag: "🇸🇪", name: {"en": "Sweden", "ro": "Suedia"}, tagline: {"en": "From the Øresund Bridge to Lapland: 21 counties of lakes, forests and the midnight sun.", "ro": "De la Podul Øresund la Laponia: 21 de comitate cu lacuri, păduri și soarele de la miezul nopții."} },
  pt: { flag: "🇵🇹", name: {"en": "Portugal", "ro": "Portugalia"}, tagline: {"en": "Lisbon, Porto and the Atlantic islands: 18 districts plus the Azores and Madeira.", "ro": "Lisabona, Porto și insulele din Atlantic: 18 districte plus Azorele și Madeira."} },
  ch: { flag: "🇨🇭", name: {"en": "Switzerland", "ro": "Elveția"}, tagline: {"en": "Alps, lakes and four languages: 26 cantons in the heart of Europe.", "ro": "Alpi, lacuri și patru limbi: 26 de cantoane în inima Europei."} },
  cz: { flag: "🇨🇿", name: {"en": "Czechia", "ro": "Cehia"}, tagline: {"en": "Bohemia and Moravia: castles, spa towns and the world's keenest beer drinkers, in 14 regions.", "ro": "Boemia și Moravia: castele, stațiuni balneare și cei mai pasionați băutori de bere, în 14 regiuni."} },
  be: { flag: "🇧🇪", name: {"en": "Belgium", "ro": "Belgia"}, tagline: {"en": "Flemish, French and German, the EU's capital and great chocolate: 10 provinces plus Brussels.", "ro": "Flamandă, franceză și germană, capitala UE și ciocolată bună: 10 provincii plus Bruxelles."} },
  sk: { flag: "🇸🇰", name: {"en": "Slovakia", "ro": "Slovacia"}, tagline: {"en": "The Tatras, castles and the Danube: 8 regions in the heart of Central Europe.", "ro": "Munții Tatra, castele și Dunărea: 8 regiuni în inima Europei Centrale."} },
  ie: { flag: "🇮🇪", name: {"en": "Ireland", "ro": "Irlanda"}, tagline: {"en": "The Emerald Isle: green hills, Atlantic cliffs and 26 counties.", "ro": "Insula de Smarald: dealuri verzi, faleze la Atlantic și 26 de comitate."} },
  my: { flag: "🇲🇾", name: {"en": "Malaysia", "ro": "Malaezia"}, tagline: {"en": "Two halves across the South China Sea: the peninsula and northern Borneo, in 13 states and 3 federal territories.", "ro": "Două jumătăți despărțite de Marea Chinei de Sud: peninsula și nordul Borneo, în 13 state și 3 teritorii federale."} },
  lk: { flag: "🇱🇰", name: {"en": "Sri Lanka", "ro": "Sri Lanka"}, tagline: {"en": "The teardrop island off India: tea hills, ancient cities and 9 provinces.", "ro": "Insula în formă de lacrimă de lângă India: dealuri cu ceai, orașe antice și 9 provincii."} },
  mn: { flag: "🇲🇳", name: {"en": "Mongolia", "ro": "Mongolia"}, tagline: {"en": "Steppe, desert and the land of Genghis Khan: 21 aimags between Russia and China.", "ro": "Stepă, deșert și țara lui Ginghis Han: 21 de aimaguri între Rusia și China."} },
  ec: { flag: "🇪🇨", name: {"en": "Ecuador", "ro": "Ecuador"}, tagline: {"en": "Named after the Equator: Andes volcanoes, the Amazon and the Galápagos, in 24 provinces.", "ro": "Numit după Ecuator: vulcani în Anzi, Amazonul și Insulele Galápagos, în 24 de provincii."} },
  bo: { flag: "🇧🇴", name: {"en": "Bolivia", "ro": "Bolivia"}, tagline: {"en": "High Andes, salt flats and the Amazon: a landlocked country of 9 departments and two capitals.", "ro": "Anzii înalți, saline și Amazonul: o țară fără ieșire la mare, cu 9 departamente și două capitale."} },
  bg: { flag: "🇧🇬", name: {"en": "Bulgaria", "ro": "Bulgaria"}, tagline: {"en": "Romania's southern neighbour across the Danube: Black Sea beaches, mountain monasteries and 28 provinces.", "ro": "Vecina de la sud a României, peste Dunăre: plaje la Marea Neagră, mănăstiri în munți și 28 de regiuni."} },
  ke: { flag: "🇰🇪", name: {"en": "Kenya", "ro": "Kenya"}, tagline: {"en": "Savannah, the Great Rift Valley and the Indian Ocean coast: 47 counties astride the equator.", "ro": "Savană, Marele Rift și coasta Oceanului Indian: 47 de comitate de-a lungul ecuatorului."} },
  gh: { flag: "🇬🇭", name: {"en": "Ghana", "ro": "Ghana"}, tagline: {"en": "The old Gold Coast: cocoa, castles and Lake Volta, in 16 regions on the Gulf of Guinea.", "ro": "Fosta Coastă de Aur: cacao, castele și Lacul Volta, în 16 regiuni la Golful Guineei."} },
  tn: { flag: "🇹🇳", name: {"en": "Tunisia", "ro": "Tunisia"}, tagline: {"en": "Carthage, olive groves and the Sahara: 24 governorates on the tip of North Africa.", "ro": "Cartagina, livezi de măslini și Sahara: 24 de guvernorate în vârful Africii de Nord."} },
  sn: { flag: "🇸🇳", name: {"en": "Senegal", "ro": "Senegal"}, tagline: {"en": "Africa's westernmost point: Dakar, Gorée and the Senegal River, in 14 regions.", "ro": "Cel mai vestic punct al Africii: Dakar, Gorée și fluviul Senegal, în 14 regiuni."} },
  cm: { flag: "🇨🇲", name: {"en": "Cameroon", "ro": "Camerun"}, tagline: {"en": "\"Africa in miniature\": rainforest, savannah, volcanoes and two official languages, in 10 regions.", "ro": "„Africa în miniatură”: pădure tropicală, savană, vulcani și două limbi oficiale, în 10 regiuni."} },
  nl: { flag: "🇳🇱", name: {"en": "Netherlands", "ro": "Țările de Jos"}, tagline: {"en": "Tulips, windmills and land won from the sea: 12 provinces, a quarter of them below sea level.", "ro": "Lalele, mori de vânt și pământ smuls mării: 12 provincii, din care o bună parte sub nivelul mării."} },
  ua: { flag: "🇺🇦", name: {"en": "Ukraine", "ro": "Ucraina"}, tagline: {"en": "Wheat fields, the Dnieper and the Carpathians: 24 oblasts, Crimea, Kyiv and Sevastopol.", "ro": "Lanuri de grâu, Niprul și Carpații: 24 de regiuni, Crimeea, Kievul și Sevastopolul."} },
  at: { flag: "🇦🇹", name: {"en": "Austria", "ro": "Austria"}, tagline: {"en": "Alps, the Danube and Vienna's coffee houses: 9 states from Lake Constance to the Pannonian plain.", "ro": "Alpii, Dunărea și cafenelele Vienei: 9 landuri, de la Lacul Constanța la câmpia Panonică."} },
  cl: { flag: "🇨🇱", name: {"en": "Chile", "ro": "Chile"}, tagline: {"en": "4,300 km of coast between the Andes and the Pacific: 16 regions from the Atacama Desert to Cape Horn.", "ro": "4.300 km de coastă între Anzi și Pacific: 16 regiuni, de la deșertul Atacama la Capul Horn."} },
  nz: { flag: "🇳🇿", name: {"en": "New Zealand", "ro": "Noua Zeelandă"}, tagline: {"en": "Two main islands, fjords, volcanoes and Māori culture: 16 regions at the far end of the Pacific.", "ro": "Două insule mari, fiorduri, vulcani și cultura maori: 16 regiuni la capătul Pacificului."} },
  sa: { flag: "🇸🇦", name: {"en": "Saudi Arabia", "ro": "Arabia Saudită"}, tagline: {"en": "Most of the Arabian Peninsula: Mecca, Medina, the Empty Quarter and 13 regions from the Red Sea to the Gulf.", "ro": "Cea mai mare parte a Peninsulei Arabice: Mecca, Medina, Sfertul Gol și 13 regiuni de la Marea Roșie la Golf."} },
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
  kr: () => import('./southKorea').then(m => m.SOUTH_KOREA_PAGE),
  eg: () => import('./egypt').then(m => m.EGYPT_PAGE),
  ng: () => import('./nigeria').then(m => m.NIGERIA_PAGE),
  za: () => import('./southAfrica').then(m => m.SOUTH_AFRICA_PAGE),
  th: () => import('./thailand').then(m => m.THAILAND_PAGE),
  pe: () => import('./peru').then(m => m.PERU_PAGE),
  co: () => import('./colombia').then(m => m.COLOMBIA_PAGE),
  ir: () => import('./iran').then(m => m.IRAN_PAGE),
  gr: () => import('./greece').then(m => m.GREECE_PAGE),
  se: () => import('./sweden').then(m => m.SWEDEN_PAGE),
  pt: () => import('./portugal').then(m => m.PORTUGAL_PAGE),
  ch: () => import('./switzerland').then(m => m.SWITZERLAND_PAGE),
  cz: () => import('./czechia').then(m => m.CZECHIA_PAGE),
  be: () => import('./belgium').then(m => m.BELGIUM_PAGE),
  sk: () => import('./slovakia').then(m => m.SLOVAKIA_PAGE),
  ie: () => import('./ireland').then(m => m.IRELAND_PAGE),
  my: () => import('./malaysia').then(m => m.MALAYSIA_PAGE),
  lk: () => import('./sriLanka').then(m => m.SRI_LANKA_PAGE),
  mn: () => import('./mongolia').then(m => m.MONGOLIA_PAGE),
  ec: () => import('./ecuador').then(m => m.ECUADOR_PAGE),
  bo: () => import('./bolivia').then(m => m.BOLIVIA_PAGE),
  bg: () => import('./bulgaria').then(m => m.BULGARIA_PAGE),
  ke: () => import('./kenya').then(m => m.KENYA_PAGE),
  gh: () => import('./ghana').then(m => m.GHANA_PAGE),
  tn: () => import('./tunisia').then(m => m.TUNISIA_PAGE),
  sn: () => import('./senegal').then(m => m.SENEGAL_PAGE),
  cm: () => import('./cameroon').then(m => m.CAMEROON_PAGE),
  nl: () => import('./netherlands').then(m => m.NETHERLANDS_PAGE),
  ua: () => import('./ukraine').then(m => m.UKRAINE_PAGE),
  at: () => import('./austria').then(m => m.AUSTRIA_PAGE),
  cl: () => import('./chile').then(m => m.CHILE_PAGE),
  nz: () => import('./newZealand').then(m => m.NEW_ZEALAND_PAGE),
  sa: () => import('./saudiArabia').then(m => m.SAUDI_ARABIA_PAGE),
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
  'country-kr': { slug: 'south-korea', page: META.kr, load: LOAD_PAGE.kr, map: SOUTH_KOREA, games: ['kr-provinces', 'kr-capitals', 'kr-quiz'] },
  'country-eg': { slug: 'egypt', page: META.eg, load: LOAD_PAGE.eg, map: EGYPT, games: ['eg-governorates', 'eg-capitals', 'eg-quiz'] },
  'country-ng': { slug: 'nigeria', page: META.ng, load: LOAD_PAGE.ng, map: NIGERIA, games: ['ng-states', 'ng-capitals', 'ng-quiz'] },
  'country-za': { slug: 'south-africa', page: META.za, load: LOAD_PAGE.za, map: SOUTH_AFRICA, games: ['za-provinces', 'za-capitals', 'za-quiz'] },
  'country-th': { slug: 'thailand', page: META.th, load: LOAD_PAGE.th, map: THAILAND, games: ['th-provinces', 'th-quiz'] },
  'country-pe': { slug: 'peru', page: META.pe, load: LOAD_PAGE.pe, map: PERU, games: ['pe-regions', 'pe-capitals', 'pe-quiz'] },
  'country-co': { slug: 'colombia', page: META.co, load: LOAD_PAGE.co, map: COLOMBIA, games: ['co-departments', 'co-capitals', 'co-quiz'] },
  'country-ir': { slug: 'iran', page: META.ir, load: LOAD_PAGE.ir, map: IRAN, games: ['ir-provinces', 'ir-capitals', 'ir-quiz'] },
  'country-gr': { slug: 'greece', page: META.gr, load: LOAD_PAGE.gr, map: GREECE, games: ['gr-regions', 'gr-capitals', 'gr-quiz'] },
  'country-se': { slug: 'sweden', page: META.se, load: LOAD_PAGE.se, map: SWEDEN, games: ['se-counties', 'se-capitals', 'se-quiz'] },
  'country-pt': { slug: 'portugal', page: META.pt, load: LOAD_PAGE.pt, map: PORTUGAL, games: ['pt-districts', 'pt-quiz'] },
  'country-ch': { slug: 'switzerland', page: META.ch, load: LOAD_PAGE.ch, map: SWITZERLAND, games: ['ch-cantons', 'ch-capitals', 'ch-quiz'] },
  'country-cz': { slug: 'czechia', page: META.cz, load: LOAD_PAGE.cz, map: CZECHIA, games: ['cz-regions', 'cz-capitals', 'cz-quiz'] },
  'country-be': { slug: 'belgium', page: META.be, load: LOAD_PAGE.be, map: BELGIUM, games: ['be-provinces', 'be-capitals', 'be-quiz'] },
  'country-sk': { slug: 'slovakia', page: META.sk, load: LOAD_PAGE.sk, map: SLOVAKIA, games: ['sk-regions', 'sk-quiz'] },
  'country-ie': { slug: 'ireland', page: META.ie, load: LOAD_PAGE.ie, map: IRELAND, games: ['ie-counties', 'ie-quiz'] },
  'country-my': { slug: 'malaysia', page: META.my, load: LOAD_PAGE.my, map: MALAYSIA, games: ['my-states', 'my-capitals', 'my-quiz'] },
  'country-lk': { slug: 'sri-lanka', page: META.lk, load: LOAD_PAGE.lk, map: SRI_LANKA, games: ['lk-provinces', 'lk-capitals', 'lk-quiz'] },
  'country-mn': { slug: 'mongolia', page: META.mn, load: LOAD_PAGE.mn, map: MONGOLIA, games: ['mn-aimags', 'mn-capitals', 'mn-quiz'] },
  'country-ec': { slug: 'ecuador', page: META.ec, load: LOAD_PAGE.ec, map: ECUADOR, games: ['ec-provinces', 'ec-capitals', 'ec-quiz'] },
  'country-bo': { slug: 'bolivia', page: META.bo, load: LOAD_PAGE.bo, map: BOLIVIA, games: ['bo-departments', 'bo-quiz'] },
  'country-bg': { slug: 'bulgaria', page: META.bg, load: LOAD_PAGE.bg, map: BULGARIA, games: ['bg-provinces', 'bg-quiz'] },
  'country-ke': { slug: 'kenya', page: META.ke, load: LOAD_PAGE.ke, map: KENYA, games: ['ke-counties', 'ke-quiz'] },
  'country-gh': { slug: 'ghana', page: META.gh, load: LOAD_PAGE.gh, map: GHANA, games: ['gh-regions', 'gh-capitals', 'gh-quiz'] },
  'country-tn': { slug: 'tunisia', page: META.tn, load: LOAD_PAGE.tn, map: TUNISIA, games: ['tn-governorates', 'tn-quiz'] },
  'country-sn': { slug: 'senegal', page: META.sn, load: LOAD_PAGE.sn, map: SENEGAL, games: ['sn-regions', 'sn-quiz'] },
  'country-cm': { slug: 'cameroon', page: META.cm, load: LOAD_PAGE.cm, map: CAMEROON, games: ['cm-regions', 'cm-capitals', 'cm-quiz'] },
  'country-nl': { slug: 'netherlands', page: META.nl, load: LOAD_PAGE.nl, map: NETHERLANDS, games: ['nl-provinces', 'nl-capitals', 'nl-quiz'] },
  'country-ua': { slug: 'ukraine', page: META.ua, load: LOAD_PAGE.ua, map: UKRAINE, games: ['ua-oblasts', 'ua-capitals', 'ua-quiz'] },
  'country-at': { slug: 'austria', page: META.at, load: LOAD_PAGE.at, map: AUSTRIA, games: ['at-states', 'at-capitals', 'at-quiz'] },
  'country-cl': { slug: 'chile', page: META.cl, load: LOAD_PAGE.cl, map: CHILE, games: ['cl-regions', 'cl-capitals', 'cl-quiz'] },
  'country-nz': { slug: 'new-zealand', page: META.nz, load: LOAD_PAGE.nz, map: NEW_ZEALAND, games: ['nz-regions', 'nz-quiz'] },
  'country-sa': { slug: 'saudi-arabia', page: META.sa, load: LOAD_PAGE.sa, map: SAUDI_ARABIA, games: ['sa-regions', 'sa-capitals', 'sa-quiz'] },
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
  { id: 'kr-provinces', icon: '🗺️', label: t("Provinces of South Korea"), desc: t("9 provinces and 8 big cities, from Seoul to Jeju.") },
  { id: 'kr-capitals', icon: '🏛️', label: t("Provincial Capitals of South Korea"), desc: t("Suwon, Jeonju, Andong… the capital of every province.") },
  { id: 'kr-quiz', icon: '❓', label: t("Quiz: South Korea"), desc: t("20 questions, from kimchi to the DMZ.") },
  { id: 'eg-governorates', icon: '🗺️', label: t("Governorates of Egypt"), desc: t("27 governorates, from Alexandria to the New Valley.") },
  { id: 'eg-capitals', icon: '🏛️', label: t("Governorate Capitals of Egypt"), desc: t("Hurghada, Mansoura, Tanta… the capital of every governorate.") },
  { id: 'eg-quiz', icon: '❓', label: t("Quiz: Egypt"), desc: t("20 questions, from the Pyramids to the Suez Canal.") },
  { id: 'ng-states', icon: '🗺️', label: t("States of Nigeria"), desc: t("36 states and the capital territory, from Sokoto to Rivers.") },
  { id: 'ng-capitals', icon: '🏛️', label: t("State Capitals of Nigeria"), desc: t("Ikeja, not Lagos. Then Ibadan, Enugu, Maiduguri…") },
  { id: 'ng-quiz', icon: '❓', label: t("Quiz: Nigeria"), desc: t("20 questions, from Nollywood to the Niger Delta.") },
  { id: 'za-provinces', icon: '🗺️', label: t("Provinces of South Africa"), desc: t("9 provinces from the Western Cape to Limpopo.") },
  { id: 'za-capitals', icon: '🏛️', label: t("Provincial Capitals of South Africa"), desc: t("Johannesburg, Pietermaritzburg, Bhisho… every provincial capital.") },
  { id: 'za-quiz', icon: '❓', label: t("Quiz: South Africa"), desc: t("20 questions, from Table Mountain to Robben Island.") },
  { id: 'th-provinces', icon: '🗺️', label: t("Provinces of Thailand"), desc: t("Bangkok and 76 provinces, each named after its capital.") },
  { id: 'th-quiz', icon: '❓', label: t("Quiz: Thailand"), desc: t("20 questions, from Ayutthaya to Songkran.") },
  { id: 'pe-regions', icon: '🗺️', label: t("Regions of Peru"), desc: t("24 departments plus Lima and Callao, from Tumbes to Tacna.") },
  { id: 'pe-capitals', icon: '🏛️', label: t("Regional Capitals of Peru"), desc: t("Trujillo, Iquitos, Huancayo… the capital of every department.") },
  { id: 'pe-quiz', icon: '❓', label: t("Quiz: Peru"), desc: t("20 questions, from Machu Picchu to ceviche.") },
  { id: 'co-departments', icon: '🗺️', label: t("Departments of Colombia"), desc: t("32 departments and Bogotá, from La Guajira to Amazonas.") },
  { id: 'co-capitals', icon: '🏛️', label: t("Departmental Capitals of Colombia"), desc: t("Medellín, Cali, Barranquilla… and Mitú. Every departmental capital.") },
  { id: 'co-quiz', icon: '❓', label: t("Quiz: Colombia"), desc: t("20 questions, from coffee to García Márquez.") },
  { id: 'ir-provinces', icon: '🗺️', label: t("Provinces of Iran"), desc: t("31 provinces, from Gilan on the Caspian to Hormozgan on the Gulf.") },
  { id: 'ir-capitals', icon: '🏛️', label: t("Provincial Capitals of Iran"), desc: t("Tabriz, Shiraz, Mashhad… the capital of every province.") },
  { id: 'ir-quiz', icon: '❓', label: t("Quiz: Iran"), desc: t("20 questions, from Persepolis to Nowruz.") },
  { id: 'gr-regions', icon: '🗺️', label: t("Regions of Greece"), desc: t("13 regions and Mount Athos, from Thrace to Crete.") },
  { id: 'gr-capitals', icon: '🏛️', label: t("Regional Capitals of Greece"), desc: t("Thessaloniki, Patras, Heraklion… and Ermoupoli. Every regional capital.") },
  { id: 'gr-quiz', icon: '❓', label: t("Quiz: Greece"), desc: t("20 questions, from the Parthenon to Santorini.") },
  { id: 'se-counties', icon: '🗺️', label: t("Counties of Sweden"), desc: t("21 counties, from Skåne to Norrbotten.") },
  { id: 'se-capitals', icon: '🏛️', label: t("County Seats of Sweden"), desc: t("Malmö, Umeå, Visby… the seat of every county.") },
  { id: 'se-quiz', icon: '❓', label: t("Quiz: Sweden"), desc: t("20 questions, from ABBA to the Nobel Prize.") },
  { id: 'pt-districts', icon: '🗺️', label: t("Districts of Portugal"), desc: t("18 districts plus the Azores and Madeira.") },
  { id: 'pt-quiz', icon: '❓', label: t("Quiz: Portugal"), desc: t("20 questions, from Vasco da Gama to fado.") },
  { id: 'ch-cantons', icon: '🗺️', label: t("Cantons of Switzerland"), desc: t("26 cantons, in German, French or Italian.") },
  { id: 'ch-capitals', icon: '🏛️', label: t("Cantonal Capitals of Switzerland"), desc: t("Chur, Sion, Bellinzona… every cantonal capital.") },
  { id: 'ch-quiz', icon: '❓', label: t("Quiz: Switzerland"), desc: t("20 questions, from the Matterhorn to William Tell.") },
  { id: 'cz-regions', icon: '🗺️', label: t("Regions of Czechia"), desc: t("13 regions and Prague, across Bohemia and Moravia.") },
  { id: 'cz-capitals', icon: '🏛️', label: t("Regional Capitals of Czechia"), desc: t("Brno, Ostrava, Jihlava… every regional capital.") },
  { id: 'cz-quiz', icon: '❓', label: t("Quiz: Czechia"), desc: t("20 questions, from Charles Bridge to Kafka.") },
  { id: 'be-provinces', icon: '🗺️', label: t("Provinces of Belgium"), desc: t("10 provinces and Brussels, in Dutch or French.") },
  { id: 'be-capitals', icon: '🏛️', label: t("Provincial Capitals of Belgium"), desc: t("Ghent, Mons, Arlon… every provincial capital.") },
  { id: 'be-quiz', icon: '❓', label: t("Quiz: Belgium"), desc: t("20 questions, from the Atomium to Tintin.") },
  { id: 'sk-regions', icon: '🗺️', label: t("Regions of Slovakia"), desc: t("8 regions, from Bratislava to Košice.") },
  { id: 'sk-quiz', icon: '❓', label: t("Quiz: Slovakia"), desc: t("20 questions, from the Tatras to Spiš Castle.") },
  { id: 'ie-counties', icon: '🗺️', label: t("Counties of Ireland"), desc: t("26 counties, from Donegal to Cork.") },
  { id: 'ie-quiz', icon: '❓', label: t("Quiz: Ireland"), desc: t("20 questions, from the Cliffs of Moher to James Joyce.") },
  { id: 'my-states', icon: '🗺️', label: t("States of Malaysia"), desc: t("13 states and 3 federal territories, on both sides of the sea.") },
  { id: 'my-capitals', icon: '🏛️', label: t("State Capitals of Malaysia"), desc: t("Ipoh, Kuching, George Town… every state capital.") },
  { id: 'my-quiz', icon: '❓', label: t("Quiz: Malaysia"), desc: t("20 questions, from the Petronas Towers to Borneo.") },
  { id: 'lk-provinces', icon: '🗺️', label: t("Provinces of Sri Lanka"), desc: t("9 provinces, from Northern to Uva.") },
  { id: 'lk-capitals', icon: '🏛️', label: t("Provincial Capitals of Sri Lanka"), desc: t("Kandy, Galle, Jaffna… every provincial capital.") },
  { id: 'lk-quiz', icon: '❓', label: t("Quiz: Sri Lanka"), desc: t("20 questions, from Ceylon tea to Sigiriya.") },
  { id: 'mn-aimags', icon: '🗺️', label: t("Aimags of Mongolia"), desc: t("21 aimags and the capital, from the Altai to the eastern steppe.") },
  { id: 'mn-capitals', icon: '🏛️', label: t("Aimag Centres of Mongolia"), desc: t("Erdenet, Mörön, Choibalsan… every aimag centre.") },
  { id: 'mn-quiz', icon: '❓', label: t("Quiz: Mongolia"), desc: t("20 questions, from Genghis Khan to the Gobi.") },
  { id: 'ec-provinces', icon: '🗺️', label: t("Provinces of Ecuador"), desc: t("24 provinces, from the coast to the Galápagos.") },
  { id: 'ec-capitals', icon: '🏛️', label: t("Provincial Capitals of Ecuador"), desc: t("Quito, Guayaquil, Cuenca… every provincial capital.") },
  { id: 'ec-quiz', icon: '❓', label: t("Quiz: Ecuador"), desc: t("20 questions, from Chimborazo to Darwin.") },
  { id: 'bo-departments', icon: '🗺️', label: t("Departments of Bolivia"), desc: t("9 departments, from Pando to Tarija.") },
  { id: 'bo-quiz', icon: '❓', label: t("Quiz: Bolivia"), desc: t("20 questions, from Lake Titicaca to the salt flats.") },
  { id: 'bg-provinces', icon: '🗺️', label: t("Provinces of Bulgaria"), desc: t("28 provinces, from Vidin to Burgas.") },
  { id: 'bg-quiz', icon: '❓', label: t("Quiz: Bulgaria"), desc: t("20 questions, from Rila to the martenitsa.") },
  { id: 'ke-counties', icon: '🗺️', label: t("Counties of Kenya"), desc: t("47 counties, from Turkana to Mombasa.") },
  { id: 'ke-quiz', icon: '❓', label: t("Quiz: Kenya"), desc: t("20 questions, from the Maasai Mara to Mount Kenya.") },
  { id: 'gh-regions', icon: '🗺️', label: t("Regions of Ghana"), desc: t("16 regions, six of them new since 2018.") },
  { id: 'gh-capitals', icon: '🏛️', label: t("Regional Capitals of Ghana"), desc: t("Kumasi, Tamale, Ho… every regional capital.") },
  { id: 'gh-quiz', icon: '❓', label: t("Quiz: Ghana"), desc: t("20 questions, from the Gold Coast to Lake Volta.") },
  { id: 'tn-governorates', icon: '🗺️', label: t("Governorates of Tunisia"), desc: t("24 governorates, from Bizerte to Tataouine.") },
  { id: 'tn-quiz', icon: '❓', label: t("Quiz: Tunisia"), desc: t("20 questions, from Carthage to the Sahara.") },
  { id: 'sn-regions', icon: '🗺️', label: t("Regions of Senegal"), desc: t("14 regions, from Saint-Louis to Ziguinchor.") },
  { id: 'sn-quiz', icon: '❓', label: t("Quiz: Senegal"), desc: t("20 questions, from Gorée to the pink lake.") },
  { id: 'cm-regions', icon: '🗺️', label: t("Regions of Cameroon"), desc: t("10 regions — English or French names.") },
  { id: 'cm-capitals', icon: '🏛️', label: t("Regional Capitals of Cameroon"), desc: t("Douala, Bamenda, Maroua… every regional capital.") },
  { id: 'cm-quiz', icon: '❓', label: t("Quiz: Cameroon"), desc: t("20 questions, from Mount Cameroon to makossa.") },
  { id: 'nl-provinces', icon: '🗺️', label: t("Provinces of the Netherlands"), desc: t("12 provinces, from Groningen to Limburg.") },
  { id: 'nl-capitals', icon: '🏛️', label: t("Provincial Capitals of the Netherlands"), desc: t("Haarlem, not Amsterdam. Every provincial capital.") },
  { id: 'nl-quiz', icon: '❓', label: t("Quiz: Netherlands"), desc: t("20 questions, from Rembrandt to the Afsluitdijk.") },
  { id: 'ua-oblasts', icon: '🗺️', label: t("Oblasts of Ukraine"), desc: t("24 oblasts, Crimea, Kyiv and Sevastopol.") },
  { id: 'ua-capitals', icon: '🏛️', label: t("Oblast Centres of Ukraine"), desc: t("Lutsk, Uzhhorod, Kropyvnytskyi… every oblast centre.") },
  { id: 'ua-quiz', icon: '❓', label: t("Quiz: Ukraine"), desc: t("20 questions, from the Dnieper to borscht.") },
  { id: 'at-states', icon: '🗺️', label: t("States of Austria"), desc: t("9 states, from Vorarlberg to Vienna.") },
  { id: 'at-capitals', icon: '🏛️', label: t("State Capitals of Austria"), desc: t("Graz, Linz, Bregenz… every state capital.") },
  { id: 'at-quiz', icon: '❓', label: t("Quiz: Austria"), desc: t("20 questions, from Mozart to the Sachertorte.") },
  { id: 'cl-regions', icon: '🗺️', label: t("Regions of Chile"), desc: t("16 regions along 4,300 km of coast.") },
  { id: 'cl-capitals', icon: '🏛️', label: t("Regional Capitals of Chile"), desc: t("From Arica to Punta Arenas — every regional capital.") },
  { id: 'cl-quiz', icon: '❓', label: t("Quiz: Chile"), desc: t("20 questions, from the Atacama to Cape Horn.") },
  { id: 'nz-regions', icon: '🗺️', label: t("Regions of New Zealand"), desc: t("16 regions on two main islands.") },
  { id: 'nz-quiz', icon: '❓', label: t("Quiz: New Zealand"), desc: t("20 questions, from the kiwi to Aoraki.") },
  { id: 'sa-regions', icon: '🗺️', label: t("Regions of Saudi Arabia"), desc: t("13 regions, from Tabuk to Najran.") },
  { id: 'sa-capitals', icon: '🏛️', label: t("Regional Capitals of Saudi Arabia"), desc: t("Dammam, Abha, Sakakah… every regional capital.") },
  { id: 'sa-quiz', icon: '❓', label: t("Quiz: Saudi Arabia"), desc: t("20 questions, from the Empty Quarter to the Kaaba.") },
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
