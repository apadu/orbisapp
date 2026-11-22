/**
 * Country page: South Korea (bilingual inline, like romania.js).
 * Facts: population 51.7 million (2024, KOSIS); area 100,413 km²; Hallasan 1,947 m;
 * Republic of Korea founded 15 August 1948.
 */
export const SOUTH_KOREA_PAGE = {
  id: 'kr',
  flag: '🇰🇷',
  name: { en: 'South Korea', ro: 'Coreea de Sud' },
  tagline: {
    en: 'Seoul, Busan and the volcanic island of Jeju: 17 provinces and cities on the southern half of a peninsula.',
    ro: 'Seul, Busan și insula vulcanică Jeju: 17 provincii și orașe pe jumătatea de sud a unei peninsule.',
  },
  mapHint: { en: 'Hover or tap a province or city', ro: 'Treci cu mouse-ul sau atinge o provincie sau un oraș' },
  seatLabel: { en: 'capital', ro: 'capitala' },
  facts: [
    { icon: '🏛️', label: { en: 'Capital', ro: 'Capitala' }, value: { en: 'Seoul', ro: 'Seul' } },
    { icon: '👥', label: { en: 'Population', ro: 'Populație' }, value: { en: '51.7 million (2024)', ro: '51,7 milioane (2024)' } },
    { icon: '📐', label: { en: 'Area', ro: 'Suprafață' }, value: { en: '100,413 km²', ro: '100.413 km²' } },
    { icon: '🗺️', label: { en: 'Divisions', ro: 'Diviziuni' }, value: { en: '9 provinces and 8 cities', ro: '9 provincii și 8 orașe' } },
    { icon: '⛰️', label: { en: 'Highest point', ro: 'Cel mai înalt punct' }, value: { en: 'Hallasan, 1,947 m', ro: 'Hallasan, 1.947 m' } },
    { icon: '💴', label: { en: 'Currency', ro: 'Moneda' }, value: { en: 'South Korean won (KRW)', ro: 'Wonul sud-coreean (KRW)' } },
    { icon: '🗣️', label: { en: 'Language', ro: 'Limba' }, value: { en: 'Korean', ro: 'Coreeană' } },
    { icon: '📅', label: { en: 'Republic', ro: 'Republica' }, value: { en: '15 August 1948', ro: '15 august 1948' } },
  ],
  neighbours: { en: 'North Korea by land; China and Japan across the sea', ro: 'Coreea de Nord pe uscat; China și Japonia peste mare' },
  questions: [
    { id: 'capital', q: { en: 'Capital of South Korea', ro: 'Capitala Coreei de Sud' }, answers: ['Seoul', 'Seul'], show: { en: 'Seoul', ro: 'Seul' } },
    { id: 'busan', q: { en: 'Second-largest city and biggest port', ro: 'Al doilea oraș ca mărime și cel mai mare port' }, answers: ['Busan', 'Pusan'], show: { en: 'Busan', ro: 'Busan' } },
    { id: 'won', q: { en: 'Currency', ro: 'Moneda' }, answers: ['won', 'South Korean won', 'wonul', 'KRW'], show: { en: 'Won', ro: 'Won' } },
    { id: 'hangul', q: { en: 'The Korean alphabet', ro: 'Alfabetul coreean' }, answers: ['Hangul', 'Hangeul', 'Hanguel', 'Chosongul'], show: { en: 'Hangul', ro: 'Hangul' } },
    { id: 'sejong', q: { en: 'King who created that alphabet in the 15th century', ro: 'Regele care a creat acest alfabet în secolul XV' }, answers: ['Sejong', 'Sejong the Great', 'King Sejong', 'regele Sejong'], show: { en: 'Sejong the Great', ro: 'Sejong cel Mare' } },
    { id: 'jeju', q: { en: 'Volcanic island in the south, a top holiday spot', ro: 'Insula vulcanică din sud, destinație de vacanță' }, answers: ['Jeju', 'Jeju Island', 'Jejudo', 'Cheju', 'insula Jeju'], show: { en: 'Jeju', ro: 'Jeju' } },
    { id: 'hallasan', q: { en: 'Highest peak, the volcano on that island', ro: 'Cel mai înalt vârf, vulcanul de pe acea insulă' }, answers: ['Hallasan', 'Halla', 'Mount Halla', 'Muntele Halla'], show: { en: 'Hallasan', ro: 'Hallasan' } },
    { id: 'dmz', q: { en: 'Buffer zone along the border with the North (3 letters)', ro: 'Zona tampon de la granița cu Nordul (3 litere)' }, answers: ['DMZ', 'Demilitarized Zone', 'Zona Demilitarizată'], show: { en: 'DMZ', ro: 'DMZ' } },
    { id: 'kimchi', q: { en: 'Spicy fermented cabbage, eaten with almost every meal', ro: 'Varza fermentată picantă, mâncată la aproape orice masă' }, answers: ['kimchi', 'kimchee'], show: { en: 'Kimchi', ro: 'Kimchi' } },
    { id: 'samsung', q: { en: 'Electronics giant whose name means "three stars"', ro: 'Gigantul electronic al cărui nume înseamnă „trei stele”' }, answers: ['Samsung'], show: { en: 'Samsung', ro: 'Samsung' } },
    { id: 'pyeongchang', q: { en: 'Host of the 2018 Winter Olympics', ro: 'Gazda Jocurilor Olimpice de iarnă din 2018' }, answers: ['Pyeongchang', 'PyeongChang', 'Pyongchang'], show: { en: 'Pyeongchang', ro: 'Pyeongchang' } },
    { id: '1988', q: { en: 'Year Seoul hosted the Summer Olympics', ro: 'Anul în care Seulul a găzduit Olimpiada de vară' }, answers: ['1988'], show: { en: '1988', ro: '1988' } },
    { id: 'han', q: { en: 'River flowing through Seoul', ro: 'Râul care curge prin Seul' }, answers: ['Han', 'Han River', 'Hangang', 'râul Han'], show: { en: 'Han', ro: 'Han' } },
    { id: 'taekwondo', q: { en: 'Korean martial art, an Olympic sport', ro: 'Arta marțială coreeană, sport olimpic' }, answers: ['taekwondo', 'tae kwon do', 'taekwon-do'], show: { en: 'Taekwondo', ro: 'Taekwondo' } },
    { id: 'bts', q: { en: 'K-pop band behind "Dynamite" and "Butter"', ro: 'Trupa K-pop din spatele „Dynamite” și „Butter”' }, answers: ['BTS', 'Bangtan Boys', 'Bangtan Sonyeondan'], show: { en: 'BTS', ro: 'BTS' } },
    { id: '1953', q: { en: 'Year the Korean War armistice was signed', ro: 'Anul semnării armistițiului din Războiul Coreei' }, answers: ['1953'], show: { en: '1953', ro: '1953' } },
    { id: 'yellow-sea', q: { en: 'Sea to the west, between Korea and China', ro: 'Marea de la vest, între Coreea și China' }, answers: ['Yellow Sea', 'Marea Galbenă', 'West Sea'], show: { en: 'Yellow Sea', ro: 'Marea Galbenă' } },
    { id: 'north', q: { en: 'The only country it borders by land', ro: 'Singura țară cu care se învecinează pe uscat' }, answers: ['North Korea', 'Coreea de Nord', 'DPRK', 'RPDC'], show: { en: 'North Korea', ro: 'Coreea de Nord' } },
    { id: 'incheon', q: { en: 'City with the main international airport, west of Seoul', ro: 'Orașul cu principalul aeroport internațional, la vest de Seul' }, answers: ['Incheon', 'Inchon'], show: { en: 'Incheon', ro: 'Incheon' } },
    { id: 'hanbok', q: { en: 'Traditional Korean dress', ro: 'Costumul tradițional coreean' }, answers: ['hanbok'], show: { en: 'Hanbok', ro: 'Hanbok' } },
  ],
}
