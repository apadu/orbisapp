import { t } from '../../i18n'
import { ROMANIA } from './romania'
import { MOLDOVA } from './moldova'
import { USA } from './usa'
import { ITALY } from './italy'
import { FRANCE } from './france'
import { GERMANY } from './germany'
import { SPAIN } from './spain'
import { JAPAN } from './japan'
import { UNITED_KINGDOM } from './unitedKingdom'
import { POLAND } from './poland'
import { HUNGARY } from './hungary'
import { BRAZIL } from './brazil'
import { CANADA } from './canada'
import { AUSTRALIA } from './australia'
import { MEXICO } from './mexico'
import { INDIA } from './india'
import { CHINA } from './china'
import { RUSSIA } from './russia'
import { ARGENTINA } from './argentina'
import { TURKEY } from './turkey'
import { SOUTH_KOREA } from './southKorea'
import { EGYPT } from './egypt'
import { NIGERIA } from './nigeria'
import { SOUTH_AFRICA } from './southAfrica'
import { THAILAND } from './thailand'
import { PERU } from './peru'
import { COLOMBIA } from './colombia'
import { IRAN } from './iran'
import { GREECE } from './greece'
import { SWEDEN } from './sweden'
import { PORTUGAL } from './portugal'
import { SWITZERLAND } from './switzerland'
import { CZECHIA } from './czechia'
import { BELGIUM } from './belgium'
import { SLOVAKIA } from './slovakia'
import { IRELAND } from './ireland'
import { MALAYSIA } from './malaysia'
import { SRI_LANKA } from './sriLanka'
import { MONGOLIA } from './mongolia'
import { ECUADOR } from './ecuador'
import { BOLIVIA } from './bolivia'
import { BULGARIA } from './bulgaria'
import { KENYA } from './kenya'
import { GHANA } from './ghana'
import { TUNISIA } from './tunisia'
import { SENEGAL } from './senegal'
import { CAMEROON } from './cameroon'
import { NETHERLANDS } from './netherlands'
import { UKRAINE } from './ukraine'
import { AUSTRIA } from './austria'
import { CHILE } from './chile'
import { NEW_ZEALAND } from './newZealand'
import { SAUDI_ARABIA } from './saudiArabia'

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
  'it-regions': {
    map: ITALY, kind: 'divisions', icon: '🇮🇹',
    title: t('Regions of Italy'),
    prompt: t('Type all 20 regions of Italy'),
    placeholder: t('Type a region…'),
  },
  'it-capitals': {
    map: ITALY, kind: 'seats', icon: '🏛️',
    title: t('Regional Capitals of Italy'),
    prompt: t('Type the capital of every region — its region lights up'),
    placeholder: t('Type a regional capital…'),
  },
  'fr-regions': {
    map: FRANCE, kind: 'divisions', icon: '🇫🇷',
    title: t('Regions of France'),
    prompt: t('Type the 13 regions of metropolitan France'),
    placeholder: t('Type a region…'),
  },
  'fr-capitals': {
    map: FRANCE, kind: 'seats', icon: '🏛️',
    title: t('Regional Capitals of France'),
    prompt: t('Type the prefecture of every region — its region lights up'),
    placeholder: t('Type a city…'),
  },
  'de-states': {
    map: GERMANY, kind: 'divisions', icon: '🇩🇪',
    title: t('States of Germany'),
    prompt: t('Type all 16 German states'),
    placeholder: t('Type a state…'),
  },
  'de-capitals': {
    map: GERMANY, kind: 'seats', icon: '🏛️',
    title: t('State Capitals of Germany'),
    prompt: t('Type the capital of every state (the city-states have none)'),
    placeholder: t('Type a state capital…'),
  },
  'es-regions': {
    map: SPAIN, kind: 'divisions', icon: '🇪🇸',
    title: t('Autonomous Communities of Spain'),
    prompt: t('Type the 17 communities — and Ceuta and Melilla'),
    placeholder: t('Type a community…'),
  },
  'es-capitals': {
    map: SPAIN, kind: 'seats', icon: '🏛️',
    title: t('Regional Capitals of Spain'),
    prompt: t('Type the capital of every community — its area lights up'),
    placeholder: t('Type a city…'),
  },
  'jp-prefectures': {
    map: JAPAN, kind: 'divisions', icon: '🇯🇵',
    title: t('Prefectures of Japan'),
    prompt: t('Type all 47 prefectures of Japan'),
    placeholder: t('Type a prefecture…'),
  },
  'jp-capitals': {
    map: JAPAN, kind: 'seats', icon: '🏯',
    title: t('Prefectural Capitals of Japan'),
    prompt: t('Type the capital of every prefecture — many share its name'),
    placeholder: t('Type a city…'),
  },
  'gb-regions': {
    map: UNITED_KINGDOM, kind: 'divisions', icon: '🇬🇧',
    title: t('Regions of the United Kingdom'),
    prompt: t('Type the 12 regions — the 9 of England, plus Scotland, Wales and Northern Ireland'),
    placeholder: t('Type a region…'),
  },
  'pl-voivodeships': {
    map: POLAND, kind: 'divisions', icon: '🇵🇱',
    title: t('Voivodeships of Poland'),
    prompt: t('Type all 16 voivodeships'),
    placeholder: t('Type a voivodeship…'),
  },
  'pl-capitals': {
    map: POLAND, kind: 'seats', icon: '🏛️',
    title: t('Voivodeship Capitals of Poland'),
    prompt: t('Type the capital of every voivodeship — its area lights up'),
    placeholder: t('Type a city…'),
  },
  'hu-counties': {
    map: HUNGARY, kind: 'divisions', icon: '🇭🇺',
    title: t('Counties of Hungary'),
    prompt: t('Type all 19 counties — and Budapest'),
    placeholder: t('Type a county…'),
  },
  'hu-seats': {
    map: HUNGARY, kind: 'seats', icon: '🏛️',
    title: t('County Seats of Hungary'),
    prompt: t('Type the seat of every county — its county lights up'),
    placeholder: t('Type a city…'),
  },
  'br-states': {
    map: BRAZIL, kind: 'divisions', icon: '🇧🇷',
    title: t('States of Brazil'),
    prompt: t('Type all 26 states — and the Federal District'),
    placeholder: t('Type a state…'),
  },
  'br-capitals': {
    map: BRAZIL, kind: 'seats', icon: '🏛️',
    title: t('State Capitals of Brazil'),
    prompt: t('Type the capital of every state — its state lights up'),
    placeholder: t('Type a city…'),
  },
  'ca-provinces': {
    map: CANADA, kind: 'divisions', icon: '🇨🇦',
    title: t('Provinces and Territories of Canada'),
    prompt: t('Type the 10 provinces and 3 territories'),
    placeholder: t('Type a province…'),
  },
  'ca-capitals': {
    map: CANADA, kind: 'seats', icon: '🏛️',
    title: t('Provincial Capitals of Canada'),
    prompt: t('Type the capital of every province and territory'),
    placeholder: t('Type a city…'),
  },
  'au-states': {
    map: AUSTRALIA, kind: 'divisions', icon: '🇦🇺',
    title: t('States and Territories of Australia'),
    prompt: t('Type the 6 states and 2 territories'),
    placeholder: t('Type a state…'),
  },
  'au-capitals': {
    map: AUSTRALIA, kind: 'seats', icon: '🏛️',
    title: t('State Capitals of Australia'),
    prompt: t('Type the capital of every state and territory'),
    placeholder: t('Type a city…'),
  },
  'mx-states': {
    map: MEXICO, kind: 'divisions', icon: '🇲🇽',
    title: t("States of Mexico"),
    prompt: t("Type all 31 states \u2014 and Mexico City"),
    placeholder: t("Type a state\u2026"),
  },
  'mx-capitals': {
    map: MEXICO, kind: 'seats', icon: '🏛️',
    title: t("State Capitals of Mexico"),
    prompt: t("Type the capital of every state \u2014 its state lights up"),
    placeholder: t("Type a city\u2026"),
  },
  'in-states': {
    map: INDIA, kind: 'divisions', icon: '🇮🇳',
    title: t("States and Territories of India"),
    prompt: t("Type the 28 states and 8 union territories"),
    placeholder: t("Type a state\u2026"),
  },
  'in-capitals': {
    map: INDIA, kind: 'seats', icon: '🏛️',
    title: t("State Capitals of India"),
    prompt: t("Type the capital of every state and territory \u2014 its area lights up"),
    placeholder: t("Type a city\u2026"),
  },
  'cn-provinces': {
    map: CHINA, kind: 'divisions', icon: '🇨🇳',
    title: t("Provinces of China"),
    prompt: t("Type all 31 provinces, autonomous regions and municipalities"),
    placeholder: t("Type a province\u2026"),
  },
  'cn-capitals': {
    map: CHINA, kind: 'seats', icon: '🏛️',
    title: t("Provincial Capitals of China"),
    prompt: t("Type the capital of every province and region (the 4 municipalities have none)"),
    placeholder: t("Type a city\u2026"),
  },
  'ru-subjects': {
    map: RUSSIA, kind: 'divisions', icon: '🇷🇺',
    title: t("Federal Subjects of Russia"),
    prompt: t("Type all 83 federal subjects \u2014 republics, krais, oblasts and more"),
    placeholder: t("Type a region\u2026"),
  },
  'ar-provinces': {
    map: ARGENTINA, kind: 'divisions', icon: '🇦🇷',
    title: t("Provinces of Argentina"),
    prompt: t("Type the 23 provinces \u2014 and Buenos Aires City"),
    placeholder: t("Type a province\u2026"),
  },
  'ar-capitals': {
    map: ARGENTINA, kind: 'seats', icon: '🏛️',
    title: t("Provincial Capitals of Argentina"),
    prompt: t("Type the capital of every province \u2014 its province lights up"),
    placeholder: t("Type a city\u2026"),
  },
  'tr-provinces': {
    map: TURKEY, kind: 'divisions', icon: '🇹🇷',
    title: t("Provinces of Turkey"),
    prompt: t("Type all 81 provinces"),
    placeholder: t("Type a province\u2026"),
  },
  'kr-provinces': {
    map: SOUTH_KOREA, kind: 'divisions', icon: '🇰🇷',
    title: t("Provinces of South Korea"),
    prompt: t("Type the 9 provinces and 8 cities"),
    placeholder: t("Type a province or city…"),
  },
  'kr-capitals': {
    map: SOUTH_KOREA, kind: 'seats', icon: '🏛️',
    title: t("Provincial Capitals of South Korea"),
    prompt: t("Type the capital of every province (the cities have none)"),
    placeholder: t("Type a city…"),
  },
  'eg-governorates': {
    map: EGYPT, kind: 'divisions', icon: '🇪🇬',
    title: t("Governorates of Egypt"),
    prompt: t("Type all 27 governorates"),
    placeholder: t("Type a governorate…"),
  },
  'eg-capitals': {
    map: EGYPT, kind: 'seats', icon: '🏛️',
    title: t("Governorate Capitals of Egypt"),
    prompt: t("Type the capital of every governorate — its area lights up"),
    placeholder: t("Type a city…"),
  },
  'ng-states': {
    map: NIGERIA, kind: 'divisions', icon: '🇳🇬',
    title: t("States of Nigeria"),
    prompt: t("Type the 36 states — and the Federal Capital Territory"),
    placeholder: t("Type a state…"),
  },
  'ng-capitals': {
    map: NIGERIA, kind: 'seats', icon: '🏛️',
    title: t("State Capitals of Nigeria"),
    prompt: t("Type the capital of every state — its state lights up"),
    placeholder: t("Type a city…"),
  },
  'za-provinces': {
    map: SOUTH_AFRICA, kind: 'divisions', icon: '🇿🇦',
    title: t("Provinces of South Africa"),
    prompt: t("Type the 9 provinces"),
    placeholder: t("Type a province…"),
  },
  'za-capitals': {
    map: SOUTH_AFRICA, kind: 'seats', icon: '🏛️',
    title: t("Provincial Capitals of South Africa"),
    prompt: t("Type the capital of every province — its province lights up"),
    placeholder: t("Type a city…"),
  },
  'th-provinces': {
    map: THAILAND, kind: 'divisions', icon: '🇹🇭',
    title: t("Provinces of Thailand"),
    prompt: t("Type Bangkok and all 76 provinces"),
    placeholder: t("Type a province…"),
  },
  'pe-regions': {
    map: PERU, kind: 'divisions', icon: '🇵🇪',
    title: t("Regions of Peru"),
    prompt: t("Type the 24 departments — and Lima and Callao"),
    placeholder: t("Type a region…"),
  },
  'pe-capitals': {
    map: PERU, kind: 'seats', icon: '🏛️',
    title: t("Regional Capitals of Peru"),
    prompt: t("Type the capital of every department — its area lights up"),
    placeholder: t("Type a city…"),
  },
  'co-departments': {
    map: COLOMBIA, kind: 'divisions', icon: '🇨🇴',
    title: t("Departments of Colombia"),
    prompt: t("Type the 32 departments — and Bogotá"),
    placeholder: t("Type a department…"),
  },
  'co-capitals': {
    map: COLOMBIA, kind: 'seats', icon: '🏛️',
    title: t("Departmental Capitals of Colombia"),
    prompt: t("Type the capital of every department — its area lights up"),
    placeholder: t("Type a city…"),
  },
  'ir-provinces': {
    map: IRAN, kind: 'divisions', icon: '🇮🇷',
    title: t("Provinces of Iran"),
    prompt: t("Type all 31 provinces"),
    placeholder: t("Type a province…"),
  },
  'ir-capitals': {
    map: IRAN, kind: 'seats', icon: '🏛️',
    title: t("Provincial Capitals of Iran"),
    prompt: t("Type the capital of every province — its province lights up"),
    placeholder: t("Type a city…"),
  },
  'gr-regions': {
    map: GREECE, kind: 'divisions', icon: '🇬🇷',
    title: t("Regions of Greece"),
    prompt: t("Type the 13 regions — and Mount Athos"),
    placeholder: t("Type a region…"),
  },
  'gr-capitals': {
    map: GREECE, kind: 'seats', icon: '🏛️',
    title: t("Regional Capitals of Greece"),
    prompt: t("Type the capital of every region — its area lights up"),
    placeholder: t("Type a city…"),
  },
  'se-counties': {
    map: SWEDEN, kind: 'divisions', icon: '🇸🇪',
    title: t("Counties of Sweden"),
    prompt: t("Type all 21 counties"),
    placeholder: t("Type a county…"),
  },
  'se-capitals': {
    map: SWEDEN, kind: 'seats', icon: '🏛️',
    title: t("County Seats of Sweden"),
    prompt: t("Type the seat of every county — its county lights up"),
    placeholder: t("Type a city…"),
  },
  'pt-districts': {
    map: PORTUGAL, kind: 'divisions', icon: '🇵🇹',
    title: t("Districts of Portugal"),
    prompt: t("Type the 18 districts — and the Azores and Madeira"),
    placeholder: t("Type a district…"),
  },
  'nl-provinces': {
    map: NETHERLANDS, kind: 'divisions', icon: '🇳🇱',
    title: t("Provinces of the Netherlands"),
    prompt: t("Type all 12 provinces"),
    placeholder: t("Type a province…"),
  },
  'nl-capitals': {
    map: NETHERLANDS, kind: 'seats', icon: '🏛️',
    title: t("Provincial Capitals of the Netherlands"),
    prompt: t("Type the capital of every province — its province lights up"),
    placeholder: t("Type a city…"),
  },
  'ua-oblasts': {
    map: UKRAINE, kind: 'divisions', icon: '🇺🇦',
    title: t("Oblasts of Ukraine"),
    prompt: t("Type the 24 oblasts — plus Crimea, Kyiv and Sevastopol"),
    placeholder: t("Type an oblast…"),
  },
  'ua-capitals': {
    map: UKRAINE, kind: 'seats', icon: '🏛️',
    title: t("Oblast Centres of Ukraine"),
    prompt: t("Type the centre of every oblast — its oblast lights up"),
    placeholder: t("Type a city…"),
  },
  'at-states': {
    map: AUSTRIA, kind: 'divisions', icon: '🇦🇹',
    title: t("States of Austria"),
    prompt: t("Type all 9 states"),
    placeholder: t("Type a state…"),
  },
  'at-capitals': {
    map: AUSTRIA, kind: 'seats', icon: '🏛️',
    title: t("State Capitals of Austria"),
    prompt: t("Type the capital of every state — its state lights up"),
    placeholder: t("Type a city…"),
  },
  'cl-regions': {
    map: CHILE, kind: 'divisions', icon: '🇨🇱',
    title: t("Regions of Chile"),
    prompt: t("Type all 16 regions"),
    placeholder: t("Type a region…"),
  },
  'cl-capitals': {
    map: CHILE, kind: 'seats', icon: '🏛️',
    title: t("Regional Capitals of Chile"),
    prompt: t("Type the capital of every region — its region lights up"),
    placeholder: t("Type a city…"),
  },
  'nz-regions': {
    map: NEW_ZEALAND, kind: 'divisions', icon: '🇳🇿',
    title: t("Regions of New Zealand"),
    prompt: t("Type all 16 regions"),
    placeholder: t("Type a region…"),
  },
  'sa-regions': {
    map: SAUDI_ARABIA, kind: 'divisions', icon: '🇸🇦',
    title: t("Regions of Saudi Arabia"),
    prompt: t("Type all 13 regions"),
    placeholder: t("Type a region…"),
  },
  'sa-capitals': {
    map: SAUDI_ARABIA, kind: 'seats', icon: '🏛️',
    title: t("Regional Capitals of Saudi Arabia"),
    prompt: t("Type the capital of every region — its region lights up"),
    placeholder: t("Type a city…"),
  },
  'ke-counties': {
    map: KENYA, kind: 'divisions', icon: '🇰🇪',
    title: t("Counties of Kenya"),
    prompt: t("Type all 47 counties"),
    placeholder: t("Type a county…"),
  },
  'gh-regions': {
    map: GHANA, kind: 'divisions', icon: '🇬🇭',
    title: t("Regions of Ghana"),
    prompt: t("Type all 16 regions"),
    placeholder: t("Type a region…"),
  },
  'gh-capitals': {
    map: GHANA, kind: 'seats', icon: '🏛️',
    title: t("Regional Capitals of Ghana"),
    prompt: t("Type the capital of every region — its region lights up"),
    placeholder: t("Type a city…"),
  },
  'tn-governorates': {
    map: TUNISIA, kind: 'divisions', icon: '🇹🇳',
    title: t("Governorates of Tunisia"),
    prompt: t("Type all 24 governorates"),
    placeholder: t("Type a governorate…"),
  },
  'sn-regions': {
    map: SENEGAL, kind: 'divisions', icon: '🇸🇳',
    title: t("Regions of Senegal"),
    prompt: t("Type all 14 regions"),
    placeholder: t("Type a region…"),
  },
  'cm-regions': {
    map: CAMEROON, kind: 'divisions', icon: '🇨🇲',
    title: t("Regions of Cameroon"),
    prompt: t("Type all 10 regions"),
    placeholder: t("Type a region…"),
  },
  'cm-capitals': {
    map: CAMEROON, kind: 'seats', icon: '🏛️',
    title: t("Regional Capitals of Cameroon"),
    prompt: t("Type the capital of every region — its region lights up"),
    placeholder: t("Type a city…"),
  },
  'my-states': {
    map: MALAYSIA, kind: 'divisions', icon: '🇲🇾',
    title: t("States of Malaysia"),
    prompt: t("Type all 13 states and 3 federal territories"),
    placeholder: t("Type a state…"),
  },
  'my-capitals': {
    map: MALAYSIA, kind: 'seats', icon: '🏛️',
    title: t("State Capitals of Malaysia"),
    prompt: t("Type the capital of every state — its state lights up"),
    placeholder: t("Type a city…"),
  },
  'lk-provinces': {
    map: SRI_LANKA, kind: 'divisions', icon: '🇱🇰',
    title: t("Provinces of Sri Lanka"),
    prompt: t("Type all 9 provinces"),
    placeholder: t("Type a province…"),
  },
  'lk-capitals': {
    map: SRI_LANKA, kind: 'seats', icon: '🏛️',
    title: t("Provincial Capitals of Sri Lanka"),
    prompt: t("Type the capital of every province — its province lights up"),
    placeholder: t("Type a city…"),
  },
  'mn-aimags': {
    map: MONGOLIA, kind: 'divisions', icon: '🇲🇳',
    title: t("Aimags of Mongolia"),
    prompt: t("Type all 21 aimags and Ulaanbaatar"),
    placeholder: t("Type an aimag…"),
  },
  'mn-capitals': {
    map: MONGOLIA, kind: 'seats', icon: '🏛️',
    title: t("Aimag Centres of Mongolia"),
    prompt: t("Type the centre of every aimag — its aimag lights up"),
    placeholder: t("Type a town…"),
  },
  'ec-provinces': {
    map: ECUADOR, kind: 'divisions', icon: '🇪🇨',
    title: t("Provinces of Ecuador"),
    prompt: t("Type all 24 provinces"),
    placeholder: t("Type a province…"),
  },
  'ec-capitals': {
    map: ECUADOR, kind: 'seats', icon: '🏛️',
    title: t("Provincial Capitals of Ecuador"),
    prompt: t("Type the capital of every province — its province lights up"),
    placeholder: t("Type a city…"),
  },
  'bo-departments': {
    map: BOLIVIA, kind: 'divisions', icon: '🇧🇴',
    title: t("Departments of Bolivia"),
    prompt: t("Type all 9 departments"),
    placeholder: t("Type a department…"),
  },
  'bg-provinces': {
    map: BULGARIA, kind: 'divisions', icon: '🇧🇬',
    title: t("Provinces of Bulgaria"),
    prompt: t("Type all 28 provinces"),
    placeholder: t("Type a province…"),
  },
  'ch-cantons': {
    map: SWITZERLAND, kind: 'divisions', icon: '🇨🇭',
    title: t("Cantons of Switzerland"),
    prompt: t("Type all 26 cantons"),
    placeholder: t("Type a canton…"),
  },
  'ch-capitals': {
    map: SWITZERLAND, kind: 'seats', icon: '🏛️',
    title: t("Cantonal Capitals of Switzerland"),
    prompt: t("Type the capital of every canton — its canton lights up"),
    placeholder: t("Type a city…"),
  },
  'cz-regions': {
    map: CZECHIA, kind: 'divisions', icon: '🇨🇿',
    title: t("Regions of Czechia"),
    prompt: t("Type all 13 regions and Prague"),
    placeholder: t("Type a region…"),
  },
  'cz-capitals': {
    map: CZECHIA, kind: 'seats', icon: '🏛️',
    title: t("Regional Capitals of Czechia"),
    prompt: t("Type the capital of every region — its region lights up"),
    placeholder: t("Type a city…"),
  },
  'be-provinces': {
    map: BELGIUM, kind: 'divisions', icon: '🇧🇪',
    title: t("Provinces of Belgium"),
    prompt: t("Type all 10 provinces and Brussels"),
    placeholder: t("Type a province…"),
  },
  'be-capitals': {
    map: BELGIUM, kind: 'seats', icon: '🏛️',
    title: t("Provincial Capitals of Belgium"),
    prompt: t("Type the capital of every province — its province lights up"),
    placeholder: t("Type a city…"),
  },
  'sk-regions': {
    map: SLOVAKIA, kind: 'divisions', icon: '🇸🇰',
    title: t("Regions of Slovakia"),
    prompt: t("Type all 8 regions"),
    placeholder: t("Type a region…"),
  },
  'ie-counties': {
    map: IRELAND, kind: 'divisions', icon: '🇮🇪',
    title: t("Counties of Ireland"),
    prompt: t("Type all 26 counties"),
    placeholder: t("Type a county…"),
  },
}
export const COUNTRY_MAP_IDS = new Set(Object.keys(COUNTRY_MAP_QUIZZES))
