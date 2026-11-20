/**
 * Country page: Mexico (bilingual inline, like romania.js).
 * Facts: population ≈ 131 million (2025 estimate); area 1,964,375 km²; Pico de Orizaba 5,636 m;
 * independence proclaimed 16 September 1810 (recognised 1821).
 */
export const MEXICO_PAGE = {
  id: 'mx',
  flag: '🇲🇽',
  name: { en: 'Mexico', ro: 'Mexic' },
  tagline: {
    en: 'Aztec and Maya cities, two oceans and 31 states around one of the largest cities on Earth.',
    ro: 'Orașe aztece și maya, două oceane și 31 de state în jurul unuia dintre cele mai mari orașe de pe Pământ.',
  },
  mapHint: { en: 'Hover or tap a state', ro: 'Treci cu mouse-ul sau atinge un stat' },
  seatLabel: { en: 'capital', ro: 'capitala' },
  facts: [
    { icon: '🏛️', label: { en: 'Capital', ro: 'Capitala' }, value: { en: 'Mexico City', ro: 'Ciudad de México' } },
    { icon: '👥', label: { en: 'Population', ro: 'Populație' }, value: { en: '≈ 131 million (2025)', ro: '≈ 131 milioane (2025)' } },
    { icon: '📐', label: { en: 'Area', ro: 'Suprafață' }, value: { en: '1,964,375 km²', ro: '1.964.375 km²' } },
    { icon: '🗺️', label: { en: 'Divisions', ro: 'Diviziuni' }, value: { en: '31 states + Mexico City', ro: '31 de state + Ciudad de México' } },
    { icon: '⛰️', label: { en: 'Highest point', ro: 'Cel mai înalt punct' }, value: { en: 'Pico de Orizaba, 5,636 m', ro: 'Pico de Orizaba, 5.636 m' } },
    { icon: '💶', label: { en: 'Currency', ro: 'Moneda' }, value: { en: 'Mexican peso (MXN)', ro: 'Peso mexican (MXN)' } },
    { icon: '🗣️', label: { en: 'Language', ro: 'Limba' }, value: { en: 'Spanish (+ 68 indigenous languages)', ro: 'Spaniolă (+ 68 de limbi indigene)' } },
    { icon: '📅', label: { en: 'Independence', ro: 'Independență' }, value: { en: '16 September 1810 (proclaimed)', ro: '16 septembrie 1810 (proclamată)' } },
  ],
  neighbours: { en: 'United States, Guatemala and Belize', ro: 'Statele Unite, Guatemala și Belize' },
  questions: [
    { id: 'capital', q: { en: 'Capital of Mexico', ro: 'Capitala Mexicului' }, answers: ['Mexico City', 'Ciudad de México', 'Ciudad de Mexico', 'CDMX', 'Orașul Mexic'], show: { en: 'Mexico City', ro: 'Ciudad de México' } },
    { id: 'language', q: { en: 'Most spoken language', ro: 'Cea mai vorbită limbă' }, answers: ['Spanish', 'spaniolă', 'spaniola', 'español'], show: { en: 'Spanish', ro: 'Spaniolă' } },
    { id: 'peso', q: { en: 'Currency', ro: 'Moneda' }, answers: ['peso', 'pesos', 'peso mexican', 'Mexican peso', 'MXN'], show: { en: 'Peso', ro: 'Peso' } },
    { id: 'tenochtitlan', q: { en: 'Aztec capital on whose ruins the capital was built', ro: 'Capitala aztecă pe ale cărei ruine a fost construită capitala' }, answers: ['Tenochtitlan', 'Tenochtitlán'], show: { en: 'Tenochtitlan', ro: 'Tenochtitlan' } },
    { id: 'chichen', q: { en: 'Maya city with the El Castillo pyramid, in Yucatán', ro: 'Orașul maya cu piramida El Castillo, în Yucatán' }, answers: ['Chichén Itzá', 'Chichen Itza'], show: { en: 'Chichén Itzá', ro: 'Chichén Itzá' } },
    { id: 'teotihuacan', q: { en: 'Ancient city with the Pyramid of the Sun', ro: 'Orașul antic cu Piramida Soarelui' }, answers: ['Teotihuacán', 'Teotihuacan'], show: { en: 'Teotihuacán', ro: 'Teotihuacán' } },
    { id: 'dead', q: { en: 'Holiday on 1–2 November with sugar skulls', ro: 'Sărbătoarea din 1–2 noiembrie cu cranii de zahăr' }, answers: ['Day of the Dead', 'Día de Muertos', 'Dia de Muertos', 'Día de los Muertos', 'Ziua Morților'], show: { en: 'Day of the Dead', ro: 'Ziua Morților' } },
    { id: 'orizaba', q: { en: 'Highest peak (a volcano)', ro: 'Cel mai înalt vârf (un vulcan)' }, answers: ['Pico de Orizaba', 'Orizaba', 'Citlaltépetl', 'Citlaltepetl'], show: { en: 'Pico de Orizaba', ro: 'Pico de Orizaba' } },
    { id: 'popocatepetl', q: { en: 'Active volcano visible from the capital', ro: 'Vulcanul activ care se vede din capitală' }, answers: ['Popocatépetl', 'Popocatepetl', 'Popo'], show: { en: 'Popocatépetl', ro: 'Popocatépetl' } },
    { id: '1810', q: { en: 'Year independence was proclaimed', ro: 'Anul proclamării independenței' }, answers: ['1810'], show: { en: '1810', ro: '1810' } },
    { id: 'tequila', q: { en: 'Spirit made from blue agave', ro: 'Băutura distilată din agave albastră' }, answers: ['tequila'], show: { en: 'Tequila', ro: 'Tequila' } },
    { id: 'yucatan', q: { en: 'Peninsula with Cancún', ro: 'Peninsula cu Cancún' }, answers: ['Yucatán', 'Yucatan'], show: { en: 'Yucatán', ro: 'Yucatán' } },
    { id: 'frida', q: { en: 'Painter famous for her self-portraits', ro: 'Pictorița celebră pentru autoportretele ei' }, answers: ['Frida Kahlo', 'Frida', 'Kahlo'], show: { en: 'Frida Kahlo', ro: 'Frida Kahlo' } },
    { id: 'cortes', q: { en: 'Spanish conquistador who brought down the Aztecs', ro: 'Conchistadorul spaniol care i-a învins pe azteci' }, answers: ['Hernán Cortés', 'Hernan Cortes', 'Cortés', 'Cortes'], show: { en: 'Hernán Cortés', ro: 'Hernán Cortés' } },
    { id: 'usa', q: { en: 'Neighbour to the north', ro: 'Vecinul din nord' }, answers: ['United States', 'USA', 'US', 'Statele Unite', 'SUA', 'America'], show: { en: 'United States', ro: 'Statele Unite' } },
    { id: 'gulf', q: { en: 'Body of water on the east coast', ro: 'Apa de pe coasta de est' }, answers: ['Gulf of Mexico', 'Golful Mexic', 'Golfo de México', 'Gulf of America'], show: { en: 'Gulf of Mexico', ro: 'Golful Mexic' } },
    { id: 'cortez', q: { en: 'Sea between Baja California and the mainland', ro: 'Marea dintre Baja California și continent' }, answers: ['Gulf of California', 'Sea of Cortez', 'Golful California', 'Marea lui Cortés', 'Mar de Cortés'], show: { en: 'Gulf of California', ro: 'Golful California' } },
    { id: 'guadalajara', q: { en: 'Capital of Jalisco, home of mariachi', ro: 'Capitala statului Jalisco, casa muzicii mariachi' }, answers: ['Guadalajara'], show: { en: 'Guadalajara', ro: 'Guadalajara' } },
    { id: 'mariachi', q: { en: 'Band with trumpets, violins and big sombreros', ro: 'Formația cu trompete, viori și sombrerouri mari' }, answers: ['mariachi', 'mariachis'], show: { en: 'Mariachi', ro: 'Mariachi' } },
    { id: 'states', q: { en: 'How many states (besides Mexico City)?', ro: 'Câte state are (fără Ciudad de México)?' }, answers: ['31', 'treizeci și unu', 'thirty-one'], show: { en: '31', ro: '31' } },
  ],
}
