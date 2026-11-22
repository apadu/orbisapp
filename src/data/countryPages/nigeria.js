/**
 * Country page: Nigeria (bilingual inline, like romania.js).
 * Facts: population about 230 million (2024 UN estimate); area 923,768 km²; Chappal Waddi 2,419 m;
 * independence 1 October 1960.
 */
export const NIGERIA_PAGE = {
  id: 'ng',
  flag: '🇳🇬',
  name: { en: 'Nigeria', ro: 'Nigeria' },
  tagline: {
    en: 'Africa\'s most populous country: Lagos, the Niger Delta and 36 states around a capital built in the 1980s.',
    ro: 'Cea mai populată țară din Africa: Lagos, Delta Nigerului și 36 de state în jurul unei capitale construite în anii 1980.',
  },
  mapHint: { en: 'Hover or tap a state', ro: 'Treci cu mouse-ul sau atinge un stat' },
  seatLabel: { en: 'capital', ro: 'capitala' },
  facts: [
    { icon: '🏛️', label: { en: 'Capital', ro: 'Capitala' }, value: { en: 'Abuja', ro: 'Abuja' } },
    { icon: '👥', label: { en: 'Population', ro: 'Populație' }, value: { en: 'about 230 million (2024)', ro: 'circa 230 de milioane (2024)' } },
    { icon: '📐', label: { en: 'Area', ro: 'Suprafață' }, value: { en: '923,768 km²', ro: '923.768 km²' } },
    { icon: '🗺️', label: { en: 'Divisions', ro: 'Diviziuni' }, value: { en: '36 states and the Federal Capital Territory', ro: '36 de state și Teritoriul Capitalei Federale' } },
    { icon: '⛰️', label: { en: 'Highest point', ro: 'Cel mai înalt punct' }, value: { en: 'Chappal Waddi, 2,419 m', ro: 'Chappal Waddi, 2.419 m' } },
    { icon: '💵', label: { en: 'Currency', ro: 'Moneda' }, value: { en: 'Naira (NGN)', ro: 'Naira (NGN)' } },
    { icon: '🗣️', label: { en: 'Languages', ro: 'Limbi' }, value: { en: 'English (official), Hausa, Yoruba, Igbo and 500 more', ro: 'Engleză (oficială), hausa, yoruba, igbo și încă 500' } },
    { icon: '📅', label: { en: 'Independence', ro: 'Independența' }, value: { en: '1 October 1960', ro: '1 octombrie 1960' } },
  ],
  neighbours: { en: 'Benin, Niger, Chad and Cameroon', ro: 'Benin, Niger, Ciad și Camerun' },
  questions: [
    { id: 'capital', q: { en: 'Capital of Nigeria', ro: 'Capitala Nigeriei' }, answers: ['Abuja'], show: { en: 'Abuja', ro: 'Abuja' } },
    { id: 'lagos', q: { en: 'Largest city, on the Atlantic coast', ro: 'Cel mai mare oraș, pe coasta Atlanticului' }, answers: ['Lagos'], show: { en: 'Lagos', ro: 'Lagos' } },
    { id: '1991', q: { en: 'Year Abuja officially replaced Lagos as the capital', ro: 'Anul în care Abuja a înlocuit oficial Lagosul drept capitală' }, answers: ['1991'], show: { en: '1991', ro: '1991' } },
    { id: 'niger', q: { en: 'River the country is named after', ro: 'Râul după care e numită țara' }, answers: ['Niger', 'River Niger', 'râul Niger', 'Nigerul'], show: { en: 'Niger', ro: 'Niger' } },
    { id: 'benue', q: { en: 'Its main tributary, which joins it at Lokoja', ro: 'Principalul său afluent, care se varsă în el la Lokoja' }, answers: ['Benue', 'Benoue', 'râul Benue'], show: { en: 'Benue', ro: 'Benue' } },
    { id: 'naira', q: { en: 'Currency', ro: 'Moneda' }, answers: ['naira', 'NGN'], show: { en: 'Naira', ro: 'Naira' } },
    { id: 'nollywood', q: { en: 'Nickname of its huge film industry', ro: 'Porecla uriașei sale industrii de film' }, answers: ['Nollywood'], show: { en: 'Nollywood', ro: 'Nollywood' } },
    { id: '1960', q: { en: 'Year of independence', ro: 'Anul independenței' }, answers: ['1960'], show: { en: '1960', ro: '1960' } },
    { id: 'uk', q: { en: 'Former colonial power', ro: 'Fosta putere colonială' }, answers: ['United Kingdom', 'Britain', 'Great Britain', 'UK', 'England', 'Marea Britanie', 'Regatul Unit', 'Anglia'], show: { en: 'United Kingdom', ro: 'Marea Britanie' } },
    { id: 'hausa', q: { en: 'Main language of the north, around Kano', ro: 'Limba principală din nord, în jurul orașului Kano' }, answers: ['Hausa'], show: { en: 'Hausa', ro: 'Hausa' } },
    { id: 'yoruba', q: { en: 'Main language of the south-west, around Lagos and Ibadan', ro: 'Limba principală din sud-vest, în jurul Lagosului și Ibadanului' }, answers: ['Yoruba'], show: { en: 'Yoruba', ro: 'Yoruba' } },
    { id: 'igbo', q: { en: 'Main language of the south-east, around Enugu', ro: 'Limba principală din sud-est, în jurul orașului Enugu' }, answers: ['Igbo', 'Ibo'], show: { en: 'Igbo', ro: 'Igbo' } },
    { id: 'delta', q: { en: 'Oil-rich region where the great river meets the sea', ro: 'Regiunea bogată în petrol unde marele râu se varsă în mare' }, answers: ['Niger Delta', 'Delta Nigerului', 'Delta'], show: { en: 'Niger Delta', ro: 'Delta Nigerului' } },
    { id: 'oil', q: { en: 'Main export', ro: 'Principalul produs de export' }, answers: ['oil', 'petroleum', 'crude oil', 'petrol', 'țiței'], show: { en: 'Oil', ro: 'Petrol' } },
    { id: 'achebe', q: { en: 'Author of "Things Fall Apart"', ro: 'Autorul romanului „Totul se destramă” („Things Fall Apart”)' }, answers: ['Achebe', 'Chinua Achebe'], show: { en: 'Chinua Achebe', ro: 'Chinua Achebe' } },
    { id: 'soyinka', q: { en: 'Africa\'s first Nobel laureate in literature (1986)', ro: 'Primul laureat african al Nobelului pentru literatură (1986)' }, answers: ['Soyinka', 'Wole Soyinka'], show: { en: 'Wole Soyinka', ro: 'Wole Soyinka' } },
    { id: 'jollof', q: { en: 'Tomato rice dish fought over with Ghana', ro: 'Mâncarea de orez cu roșii disputată cu Ghana' }, answers: ['jollof', 'jollof rice', 'orez jollof'], show: { en: 'Jollof rice', ro: 'Orez jollof' } },
    { id: 'chad', q: { en: 'Shrinking lake in the far north-east', ro: 'Lacul care se micșorează, în extremul nord-est' }, answers: ['Chad', 'Lake Chad', 'Lacul Ciad', 'Ciad'], show: { en: 'Lake Chad', ro: 'Lacul Ciad' } },
    { id: 'colours', q: { en: 'The two colours of the flag', ro: 'Cele două culori ale steagului' }, answers: ['green and white', 'green white', 'white and green', 'verde și alb', 'verde alb', 'alb și verde'], show: { en: 'Green and white', ro: 'Verde și alb' } },
    { id: 'states', q: { en: 'How many states?', ro: 'Câte state are?' }, answers: ['36', 'thirty-six', 'treizeci și șase'], show: { en: '36', ro: '36' } },
  ],
}
