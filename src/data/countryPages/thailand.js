/**
 * Country page: Thailand (bilingual inline, like romania.js).
 * Facts: population about 66 million (2024); area 513,120 km²; Doi Inthanon 2,565 m;
 * constitutional monarchy since 24 June 1932.
 */
export const THAILAND_PAGE = {
  id: 'th',
  flag: '🇹🇭',
  name: { en: 'Thailand', ro: 'Thailanda' },
  tagline: {
    en: 'Temples, islands and the Mekong: Bangkok and 76 provinces from Chiang Rai to the Malay border.',
    ro: 'Temple, insule și Mekongul: Bangkok și 76 de provincii, de la Chiang Rai la granița cu Malaysia.',
  },
  mapHint: { en: 'Hover or tap a province', ro: 'Treci cu mouse-ul sau atinge o provincie' },
  facts: [
    { icon: '🏛️', label: { en: 'Capital', ro: 'Capitala' }, value: { en: 'Bangkok', ro: 'Bangkok' } },
    { icon: '👥', label: { en: 'Population', ro: 'Populație' }, value: { en: 'about 66 million (2024)', ro: 'circa 66 de milioane (2024)' } },
    { icon: '📐', label: { en: 'Area', ro: 'Suprafață' }, value: { en: '513,120 km²', ro: '513.120 km²' } },
    { icon: '🗺️', label: { en: 'Divisions', ro: 'Diviziuni' }, value: { en: '76 provinces and Bangkok', ro: '76 de provincii și Bangkok' } },
    { icon: '⛰️', label: { en: 'Highest point', ro: 'Cel mai înalt punct' }, value: { en: 'Doi Inthanon, 2,565 m', ro: 'Doi Inthanon, 2.565 m' } },
    { icon: '💵', label: { en: 'Currency', ro: 'Moneda' }, value: { en: 'Baht (THB)', ro: 'Baht (THB)' } },
    { icon: '🗣️', label: { en: 'Language', ro: 'Limba' }, value: { en: 'Thai', ro: 'Thailandeză' } },
    { icon: '📅', label: { en: 'Constitutional monarchy', ro: 'Monarhie constituțională' }, value: { en: 'since 24 June 1932', ro: 'din 24 iunie 1932' } },
  ],
  neighbours: { en: 'Myanmar, Laos, Cambodia and Malaysia', ro: 'Myanmar, Laos, Cambodgia și Malaysia' },
  questions: [
    { id: 'capital', q: { en: 'Capital of Thailand', ro: 'Capitala Thailandei' }, answers: ['Bangkok'], show: { en: 'Bangkok', ro: 'Bangkok' } },
    { id: 'krung-thep', q: { en: 'What Thais call their capital (two words)', ro: 'Cum își numesc thailandezii capitala (două cuvinte)' }, answers: ['Krung Thep', 'Krung Thep Maha Nakhon'], show: { en: 'Krung Thep', ro: 'Krung Thep' } },
    { id: 'siam', q: { en: 'The country\'s name until 1939', ro: 'Numele țării până în 1939' }, answers: ['Siam', 'Siamul'], show: { en: 'Siam', ro: 'Siam' } },
    { id: 'baht', q: { en: 'Currency', ro: 'Moneda' }, answers: ['baht', 'THB'], show: { en: 'Baht', ro: 'Baht' } },
    { id: 'chiang-mai', q: { en: 'Biggest city of the north, full of old temples', ro: 'Cel mai mare oraș din nord, plin de temple vechi' }, answers: ['Chiang Mai', 'Chiangmai'], show: { en: 'Chiang Mai', ro: 'Chiang Mai' } },
    { id: 'phuket', q: { en: 'Largest island, on the Andaman coast', ro: 'Cea mai mare insulă, pe coasta Andaman' }, answers: ['Phuket'], show: { en: 'Phuket', ro: 'Phuket' } },
    { id: 'chao-phraya', q: { en: 'River flowing through Bangkok', ro: 'Râul care curge prin Bangkok' }, answers: ['Chao Phraya', 'Menam', 'Mae Nam Chao Phraya'], show: { en: 'Chao Phraya', ro: 'Chao Phraya' } },
    { id: 'mekong', q: { en: 'Great river along much of the border with Laos', ro: 'Marele râu de-a lungul unei mari părți a graniței cu Laos' }, answers: ['Mekong', 'Mekongul', 'Mae Nam Khong'], show: { en: 'Mekong', ro: 'Mekong' } },
    { id: 'ayutthaya', q: { en: 'Old royal capital destroyed in 1767, now ruins', ro: 'Vechea capitală regală distrusă în 1767, acum ruine' }, answers: ['Ayutthaya', 'Ayudhya', 'Phra Nakhon Si Ayutthaya'], show: { en: 'Ayutthaya', ro: 'Ayutthaya' } },
    { id: 'sukhothai', q: { en: 'First Thai kingdom, 13th century', ro: 'Primul regat thailandez, secolul XIII' }, answers: ['Sukhothai', 'Sukhotai'], show: { en: 'Sukhothai', ro: 'Sukhothai' } },
    { id: 'muay-thai', q: { en: 'National combat sport, "the art of eight limbs"', ro: 'Sportul național de luptă, „arta celor opt membre”' }, answers: ['Muay Thai', 'Thai boxing', 'box thailandez'], show: { en: 'Muay Thai', ro: 'Muay Thai' } },
    { id: 'pad-thai', q: { en: 'Stir-fried rice-noodle dish named after the country', ro: 'Tăiețeii de orez trași la tigaie, numiți după țară' }, answers: ['pad thai', 'phat thai', 'padthai'], show: { en: 'Pad thai', ro: 'Pad thai' } },
    { id: 'songkran', q: { en: 'Thai New Year, celebrated with water fights in April', ro: 'Anul Nou thailandez, sărbătorit cu bătăi cu apă în aprilie' }, answers: ['Songkran'], show: { en: 'Songkran', ro: 'Songkran' } },
    { id: 'loy-krathong', q: { en: 'Festival of floating baskets on rivers', ro: 'Festivalul coșulețelor plutitoare pe râuri' }, answers: ['Loy Krathong', 'Loi Krathong'], show: { en: 'Loy Krathong', ro: 'Loy Krathong' } },
    { id: 'gulf', q: { en: 'Gulf on its southern coast', ro: 'Golful de pe coasta sa de sud' }, answers: ['Gulf of Thailand', 'Golful Thailandei', 'Gulf of Siam', 'Golful Siam'], show: { en: 'Gulf of Thailand', ro: 'Golful Thailandei' } },
    { id: 'andaman', q: { en: 'Sea off the west coast', ro: 'Marea de pe coasta de vest' }, answers: ['Andaman Sea', 'Andaman', 'Marea Andaman'], show: { en: 'Andaman Sea', ro: 'Marea Andaman' } },
    { id: 'kwai', q: { en: 'Province of the Bridge on the River Kwai', ro: 'Provincia Podului de pe râul Kwai' }, answers: ['Kanchanaburi'], show: { en: 'Kanchanaburi', ro: 'Kanchanaburi' } },
    { id: 'golden-triangle', q: { en: 'Area where Thailand, Laos and Myanmar meet', ro: 'Zona unde se întâlnesc Thailanda, Laosul și Myanmarul' }, answers: ['Golden Triangle', 'Triunghiul de Aur'], show: { en: 'Golden Triangle', ro: 'Triunghiul de Aur' } },
    { id: 'buddhism', q: { en: 'Main religion', ro: 'Religia principală' }, answers: ['Buddhism', 'Theravada', 'Theravada Buddhism', 'budism', 'budismul'], show: { en: 'Buddhism', ro: 'Budism' } },
    { id: 'provinces', q: { en: 'How many provinces, counting Bangkok?', ro: 'Câte provincii are, cu tot cu Bangkok?' }, answers: ['77', 'seventy-seven', 'șaptezeci și șapte'], show: { en: '77', ro: '77' } },
  ],
}
