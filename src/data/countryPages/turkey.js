/**
 * Country page: Turkey (bilingual inline, like romania.js).
 * Facts: population 85.7 million (end of 2024, TÜİK); area 783,562 km²; Ararat 5,137 m;
 * Republic proclaimed 29 October 1923.
 */
export const TURKEY_PAGE = {
  id: 'tr',
  flag: '🇹🇷',
  name: { en: 'Turkey', ro: 'Turcia' },
  tagline: {
    en: 'Between Europe and Asia: Istanbul, Cappadocia and 81 provinces from Edirne to Ararat.',
    ro: 'Între Europa și Asia: Istanbul, Cappadocia și 81 de provincii, de la Edirne la Ararat.',
  },
  mapHint: { en: 'Hover or tap a province', ro: 'Treci cu mouse-ul sau atinge o provincie' },
  seatLabel: { en: 'capital', ro: 'capitala' },
  facts: [
    { icon: '🏛️', label: { en: 'Capital', ro: 'Capitala' }, value: { en: 'Ankara', ro: 'Ankara' } },
    { icon: '👥', label: { en: 'Population', ro: 'Populație' }, value: { en: '85.7 million (2024)', ro: '85,7 milioane (2024)' } },
    { icon: '📐', label: { en: 'Area', ro: 'Suprafață' }, value: { en: '783,562 km²', ro: '783.562 km²' } },
    { icon: '🗺️', label: { en: 'Divisions', ro: 'Diviziuni' }, value: { en: '81 provinces', ro: '81 de provincii' } },
    { icon: '⛰️', label: { en: 'Highest point', ro: 'Cel mai înalt punct' }, value: { en: 'Mount Ararat, 5,137 m', ro: 'Muntele Ararat, 5.137 m' } },
    { icon: '💶', label: { en: 'Currency', ro: 'Moneda' }, value: { en: 'Turkish lira (TRY)', ro: 'Lira turcească (TRY)' } },
    { icon: '🗣️', label: { en: 'Language', ro: 'Limba' }, value: { en: 'Turkish', ro: 'Turcă' } },
    { icon: '📅', label: { en: 'Republic', ro: 'Republica' }, value: { en: '29 October 1923', ro: '29 octombrie 1923' } },
  ],
  neighbours: { en: 'Greece, Bulgaria, Georgia, Armenia, Azerbaijan, Iran, Iraq and Syria', ro: 'Grecia, Bulgaria, Georgia, Armenia, Azerbaidjan, Iran, Irak și Siria' },
  questions: [
    { id: 'capital', q: { en: 'Capital of Turkey', ro: 'Capitala Turciei' }, answers: ['Ankara'], show: { en: 'Ankara', ro: 'Ankara' } },
    { id: 'istanbul', q: { en: 'Largest city, on two continents', ro: 'Cel mai mare oraș, pe două continente' }, answers: ['Istanbul', 'İstanbul', 'Constantinople', 'Constantinopol'], show: { en: 'Istanbul', ro: 'Istanbul' } },
    { id: 'bosphorus', q: { en: 'Strait running through it', ro: 'Strâmtoarea care îl traversează' }, answers: ['Bosphorus', 'Bosporus', 'Bosfor', 'Strâmtoarea Bosfor'], show: { en: 'Bosphorus', ro: 'Bosfor' } },
    { id: 'lira', q: { en: 'Currency', ro: 'Moneda' }, answers: ['lira', 'Turkish lira', 'lira turcească', 'TRY'], show: { en: 'Lira', ro: 'Lira' } },
    { id: 'ataturk', q: { en: 'Founder of the Republic', ro: 'Fondatorul Republicii' }, answers: ['Atatürk', 'Ataturk', 'Mustafa Kemal', 'Mustafa Kemal Atatürk', 'Kemal Atatürk'], show: { en: 'Mustafa Kemal Atatürk', ro: 'Mustafa Kemal Atatürk' } },
    { id: '1923', q: { en: 'Year the Republic was proclaimed', ro: 'Anul proclamării Republicii' }, answers: ['1923'], show: { en: '1923', ro: '1923' } },
    { id: 'ararat', q: { en: 'Highest peak, where Noah\'s Ark is said to have landed', ro: 'Cel mai înalt vârf, unde se spune că s-a oprit Arca lui Noe' }, answers: ['Ararat', 'Mount Ararat', 'Muntele Ararat', 'Ağrı Dağı'], show: { en: 'Ararat', ro: 'Ararat' } },
    { id: 'cappadocia', q: { en: 'Region of "fairy chimneys" and hot-air balloons', ro: 'Regiunea „hornurilor zânelor” și a baloanelor cu aer cald' }, answers: ['Cappadocia', 'Capadocia', 'Kapadokya'], show: { en: 'Cappadocia', ro: 'Cappadocia' } },
    { id: 'pamukkale', q: { en: 'White travertine terraces ("cotton castle")', ro: 'Terasele albe de travertin („castelul de bumbac”)' }, answers: ['Pamukkale'], show: { en: 'Pamukkale', ro: 'Pamukkale' } },
    { id: 'troy', q: { en: 'City of the Trojan Horse legend', ro: 'Orașul legendei Calului Troian' }, answers: ['Troy', 'Troia', 'Truva', 'Ilion'], show: { en: 'Troy', ro: 'Troia' } },
    { id: 'ephesus', q: { en: 'Ancient city with the Library of Celsus', ro: 'Orașul antic cu Biblioteca lui Celsus' }, answers: ['Ephesus', 'Efes', 'Efes', 'Ephesos'], show: { en: 'Ephesus', ro: 'Efes' } },
    { id: 'black-sea', q: { en: 'Sea along the northern coast', ro: 'Marea de pe coasta de nord' }, answers: ['Black Sea', 'Marea Neagră', 'Karadeniz'], show: { en: 'Black Sea', ro: 'Marea Neagră' } },
    { id: 'tigris', q: { en: 'River that flows past Diyarbakır towards Baghdad', ro: 'Râul care trece pe lângă Diyarbakır spre Bagdad' }, answers: ['Tigris', 'Tigru', 'Dicle'], show: { en: 'Tigris', ro: 'Tigru' } },
    { id: 'euphrates', q: { en: 'The other great river of Mesopotamia, which rises in Turkey', ro: 'Celălalt mare râu al Mesopotamiei, care izvorăște în Turcia' }, answers: ['Euphrates', 'Eufrat', 'Fırat'], show: { en: 'Euphrates', ro: 'Eufrat' } },
    { id: 'hagia-sophia', q: { en: 'Byzantine church turned mosque in Istanbul', ro: 'Biserica bizantină devenită moschee în Istanbul' }, answers: ['Hagia Sophia', 'Ayasofya', 'Sfânta Sofia', 'Aya Sofia'], show: { en: 'Hagia Sophia', ro: 'Sfânta Sofia' } },
    { id: 'lokum', q: { en: 'Sweet known abroad as "Turkish delight"', ro: 'Dulciurile cunoscute ca „rahat turcesc”' }, answers: ['lokum', 'Turkish delight', 'rahat', 'rahat turcesc'], show: { en: 'Lokum', ro: 'Rahat (lokum)' } },
    { id: 'ottoman', q: { en: 'Empire that ruled until 1922', ro: 'Imperiul care a condus până în 1922' }, answers: ['Ottoman', 'Ottoman Empire', 'Imperiul Otoman', 'otoman'], show: { en: 'Ottoman Empire', ro: 'Imperiul Otoman' } },
    { id: 'provinces', q: { en: 'How many provinces?', ro: 'Câte provincii are?' }, answers: ['81', 'optzeci și unu', 'eighty-one'], show: { en: '81', ro: '81' } },
    { id: 'antalya', q: { en: 'Biggest resort city on the Mediterranean coast', ro: 'Cea mai mare stațiune de pe coasta mediteraneeană' }, answers: ['Antalya'], show: { en: 'Antalya', ro: 'Antalya' } },
    { id: 'bazaar', q: { en: 'Covered market in Istanbul with 4,000 shops', ro: 'Piața acoperită din Istanbul cu 4.000 de magazine' }, answers: ['Grand Bazaar', 'Kapalıçarşı', 'Marele Bazar', 'Kapali Carsi'], show: { en: 'Grand Bazaar', ro: 'Marele Bazar' } },
  ],
}
