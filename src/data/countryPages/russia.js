/**
 * Country page: Russia (bilingual inline, like romania.js).
 * Facts: population ≈ 144 million (UN estimate, recognised borders); area 17,098,246 km²;
 * Elbrus 5,642 m; Russia Day 12 June (1990 declaration of sovereignty).
 * The map shows the 83 federal subjects within its internationally recognised borders.
 */
export const RUSSIA_PAGE = {
  id: 'ru',
  flag: '🇷🇺',
  name: { en: 'Russia', ro: 'Rusia' },
  tagline: {
    en: 'The largest country on Earth: 11 time zones, from the Baltic to the Bering Strait.',
    ro: 'Cea mai mare țară de pe Pământ: 11 fusuri orare, de la Marea Baltică la Strâmtoarea Bering.',
  },
  mapHint: { en: 'Hover or tap a region', ro: 'Treci cu mouse-ul sau atinge o regiune' },
  seatLabel: { en: 'capital', ro: 'capitala' },
  facts: [
    { icon: '🏛️', label: { en: 'Capital', ro: 'Capitala' }, value: { en: 'Moscow', ro: 'Moscova' } },
    { icon: '👥', label: { en: 'Population', ro: 'Populație' }, value: { en: '≈ 144 million', ro: '≈ 144 milioane' } },
    { icon: '📐', label: { en: 'Area', ro: 'Suprafață' }, value: { en: '17,098,246 km²', ro: '17.098.246 km²' } },
    { icon: '🗺️', label: { en: 'Divisions', ro: 'Diviziuni' }, value: { en: '83 federal subjects (recognised borders)', ro: '83 de subiecți federali (granițe recunoscute)' } },
    { icon: '⛰️', label: { en: 'Highest point', ro: 'Cel mai înalt punct' }, value: { en: 'Elbrus, 5,642 m', ro: 'Elbrus, 5.642 m' } },
    { icon: '💶', label: { en: 'Currency', ro: 'Moneda' }, value: { en: 'Russian ruble (RUB)', ro: 'Rubla rusească (RUB)' } },
    { icon: '🗣️', label: { en: 'Language', ro: 'Limba' }, value: { en: 'Russian', ro: 'Rusă' } },
    { icon: '📅', label: { en: 'National day', ro: 'Ziua națională' }, value: { en: '12 June', ro: '12 iunie' } },
  ],
  neighbours: { en: '14 countries — tied with China for the most in the world', ro: '14 țări — la egalitate cu China pentru cele mai multe din lume' },
  questions: [
    { id: 'capital', q: { en: 'Capital of Russia', ro: 'Capitala Rusiei' }, answers: ['Moscow', 'Moscova', 'Moskva'], show: { en: 'Moscow', ro: 'Moscova' } },
    { id: 'petersburg', q: { en: 'Second city, the former imperial capital', ro: 'Al doilea oraș, fosta capitală imperială' }, answers: ['Saint Petersburg', 'St Petersburg', 'Sankt Petersburg', 'Petersburg', 'Leningrad', 'Petrograd'], show: { en: 'Saint Petersburg', ro: 'Sankt Petersburg' } },
    { id: 'volga', q: { en: 'Longest river in Europe', ro: 'Cel mai lung râu din Europa' }, answers: ['Volga'], show: { en: 'Volga', ro: 'Volga' } },
    { id: 'baikal', q: { en: 'Deepest lake in the world', ro: 'Cel mai adânc lac din lume' }, answers: ['Baikal', 'Lake Baikal', 'Lacul Baikal', 'Baical'], show: { en: 'Lake Baikal', ro: 'Lacul Baikal' } },
    { id: 'elbrus', q: { en: 'Highest peak, in the Caucasus', ro: 'Cel mai înalt vârf, în Caucaz' }, answers: ['Elbrus', 'Mount Elbrus', 'Elbrus'], show: { en: 'Elbrus', ro: 'Elbrus' } },
    { id: 'ruble', q: { en: 'Currency', ro: 'Moneda' }, answers: ['ruble', 'rouble', 'rubla', 'ruble rusești', 'RUB'], show: { en: 'Ruble', ro: 'Rubla' } },
    { id: 'urals', q: { en: 'Mountains between Europe and Asia', ro: 'Munții dintre Europa și Asia' }, answers: ['Urals', 'Ural', 'Ural Mountains', 'Munții Ural'], show: { en: 'Urals', ro: 'Munții Ural' } },
    { id: 'transsib', q: { en: 'Railway from Moscow to Vladivostok', ro: 'Calea ferată de la Moscova la Vladivostok' }, answers: ['Trans-Siberian', 'Trans-Siberian Railway', 'Transsiberian', 'Transsiberianul'], show: { en: 'Trans-Siberian', ro: 'Transsiberianul' } },
    { id: 'gagarin', q: { en: 'First man in space (1961)', ro: 'Primul om în spațiu (1961)' }, answers: ['Yuri Gagarin', 'Gagarin', 'Iuri Gagarin'], show: { en: 'Yuri Gagarin', ro: 'Iuri Gagarin' } },
    { id: 'sputnik', q: { en: 'First artificial satellite (1957)', ro: 'Primul satelit artificial (1957)' }, answers: ['Sputnik', 'Sputnik 1'], show: { en: 'Sputnik', ro: 'Sputnik' } },
    { id: 'tolstoy', q: { en: 'Author of War and Peace', ro: 'Autorul romanului Război și pace' }, answers: ['Leo Tolstoy', 'Tolstoy', 'Lev Tolstoi', 'Tolstoi'], show: { en: 'Leo Tolstoy', ro: 'Lev Tolstoi' } },
    { id: 'tchaikovsky', q: { en: 'Composer of Swan Lake', ro: 'Compozitorul baletului Lacul lebedelor' }, answers: ['Tchaikovsky', 'Ceaikovski', 'Pyotr Tchaikovsky', 'Piotr Ceaikovski'], show: { en: 'Tchaikovsky', ro: 'Ceaikovski' } },
    { id: 'basil', q: { en: 'Cathedral with onion domes on Red Square', ro: 'Catedrala cu cupole-ceapă din Piața Roșie' }, answers: ["Saint Basil's", "St Basil's", "Saint Basil's Cathedral", 'Sfântul Vasile', 'Catedrala Sfântul Vasile', 'Vasili Blajennîi'], show: { en: "Saint Basil's Cathedral", ro: 'Catedrala Sfântul Vasile' } },
    { id: 'kaliningrad', q: { en: 'Exclave on the Baltic, between Poland and Lithuania', ro: 'Exclava de la Marea Baltică, între Polonia și Lituania' }, answers: ['Kaliningrad', 'Königsberg', 'Konigsberg'], show: { en: 'Kaliningrad', ro: 'Kaliningrad' } },
    { id: 'kamchatka', q: { en: 'Far-eastern peninsula full of volcanoes', ro: 'Peninsula din Extremul Orient plină de vulcani' }, answers: ['Kamchatka', 'Kamceatka', 'Kamciatka'], show: { en: 'Kamchatka', ro: 'Kamceatka' } },
    { id: 'oymyakon', q: { en: 'Village called the coldest inhabited place on Earth', ro: 'Satul numit cel mai rece loc locuit de pe Pământ' }, answers: ['Oymyakon', 'Oimiakon', 'Oimekon'], show: { en: 'Oymyakon', ro: 'Oimiakon' } },
    { id: 'matryoshka', q: { en: 'Wooden dolls nested inside each other', ro: 'Păpușile de lemn puse una în alta' }, answers: ['matryoshka', 'matrioșka', 'matrioska', 'matryoshka dolls', 'babushka'], show: { en: 'Matryoshka', ro: 'Matrioșka' } },
    { id: 'time-zones', q: { en: 'How many time zones?', ro: 'Câte fusuri orare are?' }, answers: ['11', 'unsprezece', 'eleven'], show: { en: '11', ro: '11' } },
    { id: 'bering', q: { en: 'Strait between Russia and Alaska', ro: 'Strâmtoarea dintre Rusia și Alaska' }, answers: ['Bering Strait', 'Bering', 'Strâmtoarea Bering'], show: { en: 'Bering Strait', ro: 'Strâmtoarea Bering' } },
    { id: 'romanov', q: { en: 'Last ruling dynasty of the tsars', ro: 'Ultima dinastie de țari' }, answers: ['Romanov', 'Romanovs', 'Romanovii'], show: { en: 'Romanov', ro: 'Romanov' } },
  ],
}
