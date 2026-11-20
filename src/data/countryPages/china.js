/**
 * Country page: China (bilingual inline, like romania.js).
 * Facts: population 1.408 billion (end of 2024, NBS); area ≈ 9.6 million km²; Everest 8,849 m
 * (on the border with Nepal); People's Republic proclaimed 1 October 1949.
 * The map shows the 31 provincial-level divisions of the mainland (no Hong Kong, Macau).
 */
export const CHINA_PAGE = {
  id: 'cn',
  flag: '🇨🇳',
  name: { en: 'China', ro: 'China' },
  tagline: {
    en: 'The Great Wall, the Yangtze and 31 provinces, regions and cities — from Tibet to Shanghai.',
    ro: 'Marele Zid, Yangtze și 31 de provincii, regiuni și municipii — de la Tibet la Shanghai.',
  },
  mapHint: { en: 'Hover or tap a province', ro: 'Treci cu mouse-ul sau atinge o provincie' },
  seatLabel: { en: 'capital', ro: 'capitala' },
  facts: [
    { icon: '🏛️', label: { en: 'Capital', ro: 'Capitala' }, value: { en: 'Beijing', ro: 'Beijing' } },
    { icon: '👥', label: { en: 'Population', ro: 'Populație' }, value: { en: '1.41 billion (2024)', ro: '1,41 miliarde (2024)' } },
    { icon: '📐', label: { en: 'Area', ro: 'Suprafață' }, value: { en: '≈ 9.6 million km²', ro: '≈ 9,6 milioane km²' } },
    { icon: '🗺️', label: { en: 'Divisions', ro: 'Diviziuni' }, value: { en: '22 provinces, 5 autonomous regions, 4 municipalities (+ Hong Kong, Macau)', ro: '22 de provincii, 5 regiuni autonome, 4 municipii (+ Hong Kong, Macao)' } },
    { icon: '⛰️', label: { en: 'Highest point', ro: 'Cel mai înalt punct' }, value: { en: 'Everest, 8,849 m', ro: 'Everest, 8.849 m' } },
    { icon: '💶', label: { en: 'Currency', ro: 'Moneda' }, value: { en: 'Renminbi / yuan (CNY)', ro: 'Renminbi / yuan (CNY)' } },
    { icon: '🗣️', label: { en: 'Language', ro: 'Limba' }, value: { en: 'Standard Chinese (Mandarin)', ro: 'Chineza standard (mandarina)' } },
    { icon: '📅', label: { en: 'Founded', ro: 'Proclamare' }, value: { en: '1 October 1949 (People\'s Republic)', ro: '1 octombrie 1949 (Republica Populară)' } },
  ],
  neighbours: { en: '14 countries — tied with Russia for the most in the world', ro: '14 țări — la egalitate cu Rusia pentru cele mai multe din lume' },
  questions: [
    { id: 'capital', q: { en: 'Capital of China', ro: 'Capitala Chinei' }, answers: ['Beijing', 'Peking', 'Pekin', 'Beijing'], show: { en: 'Beijing', ro: 'Beijing' } },
    { id: 'shanghai', q: { en: 'Largest city', ro: 'Cel mai mare oraș' }, answers: ['Shanghai'], show: { en: 'Shanghai', ro: 'Shanghai' } },
    { id: 'wall', q: { en: 'Fortification thousands of kilometres long', ro: 'Fortificația lungă de mii de kilometri' }, answers: ['Great Wall', 'Great Wall of China', 'Marele Zid', 'Marele Zid Chinezesc'], show: { en: 'Great Wall', ro: 'Marele Zid' } },
    { id: 'yangtze', q: { en: 'Longest river', ro: 'Cel mai lung râu' }, answers: ['Yangtze', 'Yangtse', 'Chang Jiang', 'Fluviul Albastru'], show: { en: 'Yangtze', ro: 'Yangtze' } },
    { id: 'yellow', q: { en: '"Mother river" of Chinese civilisation', ro: '„Râul-mamă” al civilizației chineze' }, answers: ['Yellow River', 'Huang He', 'Huanghe', 'Fluviul Galben'], show: { en: 'Yellow River', ro: 'Fluviul Galben' } },
    { id: 'yuan', q: { en: 'Currency', ro: 'Moneda' }, answers: ['yuan', 'renminbi', 'RMB', 'CNY'], show: { en: 'Yuan', ro: 'Yuan' } },
    { id: '1949', q: { en: 'Year the People\'s Republic was proclaimed', ro: 'Anul proclamării Republicii Populare' }, answers: ['1949'], show: { en: '1949', ro: '1949' } },
    { id: 'xian', q: { en: 'City of the Terracotta Army', ro: 'Orașul Armatei de Teracotă' }, answers: ["Xi'an", 'Xian', 'Xi an'], show: { en: "Xi'an", ro: "Xi'an" } },
    { id: 'panda', q: { en: 'Bamboo-eating national symbol', ro: 'Simbolul național care mănâncă bambus' }, answers: ['panda', 'giant panda', 'urs panda', 'panda uriaș'], show: { en: 'Giant panda', ro: 'Panda uriaș' } },
    { id: 'everest', q: { en: 'Highest peak, on the border with Nepal', ro: 'Cel mai înalt vârf, la granița cu Nepalul' }, answers: ['Everest', 'Mount Everest', 'Qomolangma', 'Chomolungma'], show: { en: 'Everest', ro: 'Everest' } },
    { id: 'gobi', q: { en: 'Desert shared with Mongolia', ro: 'Deșertul împărțit cu Mongolia' }, answers: ['Gobi'], show: { en: 'Gobi', ro: 'Gobi' } },
    { id: 'mandarin', q: { en: 'Official language', ro: 'Limba oficială' }, answers: ['Mandarin', 'mandarina', 'Chinese', 'chineză', 'chineza', 'Putonghua'], show: { en: 'Mandarin', ro: 'Mandarina' } },
    { id: 'hong-kong', q: { en: 'Former British colony returned in 1997', ro: 'Fosta colonie britanică retrocedată în 1997' }, answers: ['Hong Kong'], show: { en: 'Hong Kong', ro: 'Hong Kong' } },
    { id: 'macau', q: { en: 'Former Portuguese colony returned in 1999', ro: 'Fosta colonie portugheză retrocedată în 1999' }, answers: ['Macau', 'Macao'], show: { en: 'Macau', ro: 'Macao' } },
    { id: 'forbidden', q: { en: 'Imperial palace in the capital', ro: 'Palatul imperial din capitală' }, answers: ['Forbidden City', 'Orașul Interzis', 'Palace Museum'], show: { en: 'Forbidden City', ro: 'Orașul Interzis' } },
    { id: 'three-gorges', q: { en: 'World\'s largest hydroelectric dam', ro: 'Cel mai mare baraj hidroelectric din lume' }, answers: ['Three Gorges', 'Three Gorges Dam', 'Barajul celor Trei Defileuri', 'Trei Defileuri', 'Trei Chei'], show: { en: 'Three Gorges Dam', ro: 'Barajul celor Trei Defileuri' } },
    { id: 'confucius', q: { en: 'Philosopher of the 5th century BC', ro: 'Filozoful din secolul al V-lea î.Hr.' }, answers: ['Confucius', 'Confucius', 'Kong Fuzi', 'Confucius'], show: { en: 'Confucius', ro: 'Confucius' } },
    { id: '2008', q: { en: 'Year Beijing hosted the Summer Olympics', ro: 'Anul în care Beijingul a găzduit Jocurile Olimpice de vară' }, answers: ['2008'], show: { en: '2008', ro: '2008' } },
    { id: 'silk', q: { en: 'Ancient trade route to Europe', ro: 'Vechiul drum comercial spre Europa' }, answers: ['Silk Road', 'Drumul Mătăsii', 'Silk Route'], show: { en: 'Silk Road', ro: 'Drumul Mătăsii' } },
    { id: 'tea', q: { en: 'Drink first grown in China', ro: 'Băutura cultivată pentru prima dată în China' }, answers: ['tea', 'ceai'], show: { en: 'Tea', ro: 'Ceai' } },
  ],
}
