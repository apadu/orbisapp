/**
 * Country page: Romania. Content is bilingual inline ({ en, ro }) instead of going through
 * ro.js, because each country page carries a lot of its own text.
 *
 * Facts checked Nov 2026: population = INS resident population on 1 Jan 2025 (19.04 M);
 * full Schengen from 1 Jan 2025; Cluj-Napoca second city at the 2021 census (286,598);
 * Moldoveanu 2,544 m; Olt 615 km, the longest river entirely inside Romania;
 * Palace of the Parliament = Guinness "heaviest building".
 */
export const ROMANIA_PAGE = {
  id: 'ro',
  flag: '🇷🇴',
  name: { en: 'Romania', ro: 'România' },
  tagline: {
    en: 'Carpathians in the middle, the Danube in the south, the Black Sea in the east.',
    ro: 'Carpații la mijloc, Dunărea la sud, Marea Neagră la est.',
  },
  facts: [
    { icon: '🏛️', label: { en: 'Capital', ro: 'Capitala' }, value: { en: 'Bucharest', ro: 'București' } },
    { icon: '👥', label: { en: 'Population', ro: 'Populație' }, value: { en: '19.0 million (2025)', ro: '19,0 milioane (2025)' } },
    { icon: '📐', label: { en: 'Area', ro: 'Suprafață' }, value: { en: '238,397 km²', ro: '238.397 km²' } },
    { icon: '🗺️', label: { en: 'Counties', ro: 'Județe' }, value: { en: '41 + Bucharest', ro: '41 + București' } },
    { icon: '⛰️', label: { en: 'Highest peak', ro: 'Cel mai înalt vârf' }, value: { en: 'Moldoveanu, 2,544 m', ro: 'Moldoveanu, 2.544 m' } },
    { icon: '💶', label: { en: 'Currency', ro: 'Moneda' }, value: { en: 'Leu (RON)', ro: 'Leu (RON)' } },
    { icon: '🗣️', label: { en: 'Language', ro: 'Limba' }, value: { en: 'Romanian', ro: 'Română' } },
    { icon: '🤝', label: { en: 'EU · NATO', ro: 'UE · NATO' }, value: { en: '2007 · 2004', ro: '2007 · 2004' } },
  ],
  neighbours: { en: 'Ukraine, Moldova, Bulgaria, Serbia, Hungary', ro: 'Ucraina, Moldova, Bulgaria, Serbia, Ungaria' },
  // The 20-question table quiz (TableQuiz, id 'ro-quiz'): type the answers in any order.
  // `answers` = every spelling accepted (compared without diacritics, spaces or punctuation),
  // `show` = what fills in once found. Answers must not repeat between questions.
  questions: [
    { id: 'second-city', q: { en: 'Second-largest city in Romania (2021 census)', ro: 'Al doilea oraș ca mărime (recensământul 2021)' },
      answers: ['Cluj-Napoca', 'Cluj'], show: { en: 'Cluj-Napoca', ro: 'Cluj-Napoca' } },
    { id: 'peak', q: { en: 'Highest peak (2,544 m)', ro: 'Cel mai înalt vârf (2.544 m)' },
      answers: ['Moldoveanu', 'Vârful Moldoveanu', 'Moldoveanu Peak'], show: { en: 'Moldoveanu', ro: 'Moldoveanu' } },
    { id: 'olt', q: { en: 'Longest river that flows only through Romania', ro: 'Cel mai lung râu care curge doar prin România' },
      answers: ['Olt', 'Oltul'], show: { en: 'Olt', ro: 'Olt' } },
    { id: 'neighbours', q: { en: 'How many countries border Romania?', ro: 'Cu câte țări se învecinează România?' },
      answers: ['5', 'cinci', 'five'], show: { en: '5', ro: '5' } },
    { id: 'delta', q: { en: 'County of the Danube Delta', ro: 'Județul în care se află Delta Dunării' },
      answers: ['Tulcea'], show: { en: 'Tulcea', ro: 'Tulcea' } },
    { id: 'eu', q: { en: 'Year Romania joined the EU', ro: 'Anul intrării în Uniunea Europeană' },
      answers: ['2007'], show: { en: '2007', ro: '2007' } },
    { id: 'nato', q: { en: 'Year Romania joined NATO', ro: 'Anul intrării în NATO' },
      answers: ['2004'], show: { en: '2004', ro: '2004' } },
    { id: 'schengen', q: { en: 'Year Romania became a full Schengen member', ro: 'Anul intrării depline în Schengen' },
      answers: ['2025'], show: { en: '2025', ro: '2025' } },
    { id: 'national-day', q: { en: 'Date of the National Day (Great Union, 1918)', ro: 'Data Zilei Naționale (Marea Unire, 1918)' },
      answers: ['1 Decembrie', '1 December', 'December 1', '1 Dec', '01.12'], show: { en: '1 December', ro: '1 Decembrie' } },
    { id: 'cuza', q: { en: 'Prince who united Moldavia and Wallachia in 1859', ro: 'Domnitorul care a unit Moldova și Țara Românească în 1859' },
      answers: ['Alexandru Ioan Cuza', 'Cuza', 'Al. I. Cuza', 'Ioan Cuza', 'Alexandru Cuza'], show: { en: 'Alexandru Ioan Cuza', ro: 'Alexandru Ioan Cuza' } },
    { id: 'leu', q: { en: 'Romania\'s currency', ro: 'Moneda României' },
      answers: ['leu', 'lei', 'RON', 'leul'], show: { en: 'Leu (RON)', ro: 'Leu (RON)' } },
    { id: 'parliament', q: { en: 'The heaviest building in the world, in Bucharest', ro: 'Cea mai grea clădire din lume, în București' },
      answers: ['Palatul Parlamentului', 'Palace of the Parliament', 'Parliament Palace', 'Casa Poporului', "People's House", 'Palatul Parlamentului din București'], show: { en: 'Palace of the Parliament', ro: 'Palatul Parlamentului' } },
    { id: 'dracula', q: { en: 'Castle famous as "Dracula\'s Castle"', ro: 'Castelul celebru drept „Castelul lui Dracula”' },
      answers: ['Bran', 'Castelul Bran', 'Bran Castle'], show: { en: 'Bran', ro: 'Bran' } },
    { id: 'peles', q: { en: 'Town where Peleș Castle stands', ro: 'Orașul în care se află Castelul Peleș' },
      answers: ['Sinaia'], show: { en: 'Sinaia', ro: 'Sinaia' } },
    { id: 'nadia', q: { en: 'Gymnast who scored the first perfect 10 (Montreal 1976)', ro: 'Gimnasta care a luat primul 10 perfect (Montreal 1976)' },
      answers: ['Nadia Comăneci', 'Comăneci', 'Nadia'], show: { en: 'Nadia Comăneci', ro: 'Nadia Comăneci' } },
    { id: 'brancusi', q: { en: 'Sculptor of the Endless Column in Târgu Jiu', ro: 'Sculptorul Coloanei Infinitului de la Târgu Jiu' },
      answers: ['Constantin Brâncuși', 'Brâncuși'], show: { en: 'Constantin Brâncuși', ro: 'Constantin Brâncuși' } },
    { id: 'merry-cemetery', q: { en: 'County of the Merry Cemetery (Săpânța)', ro: 'Județul Cimitirului Vesel (Săpânța)' },
      answers: ['Maramureș'], show: { en: 'Maramureș', ro: 'Maramureș' } },
    { id: 'transfagarasan', q: { en: 'Mountains crossed by the Transfăgărășan road', ro: 'Munții traversați de Transfăgărășan' },
      answers: ['Făgăraș', 'Munții Făgăraș', 'Fagaras Mountains', 'Făgărașului'], show: { en: 'Făgăraș Mountains', ro: 'Munții Făgăraș' } },
    { id: 'monasteries', q: { en: 'Historical region of the painted monasteries (Voroneț)', ro: 'Regiunea istorică a mănăstirilor pictate (Voroneț)' },
      answers: ['Bucovina', 'Bukovina'], show: { en: 'Bukovina', ro: 'Bucovina' } },
    { id: 'language', q: { en: 'Language family of Romanian', ro: 'Familia de limbi din care face parte româna' },
      answers: ['romanică', 'romance', 'latină', 'latin', 'neolatină', 'romanice', 'limbi romanice', 'romanic'], show: { en: 'Romance (Latin)', ro: 'Romanică (latină)' } },
  ],
}
