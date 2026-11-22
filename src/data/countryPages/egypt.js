/**
 * Country page: Egypt (bilingual inline, like romania.js).
 * Facts: population about 107 million (2024, CAPMAS); area 1,001,450 km²; Mount Catherine 2,629 m;
 * independence 28 February 1922.
 */
export const EGYPT_PAGE = {
  id: 'eg',
  flag: '🇪🇬',
  name: { en: 'Egypt', ro: 'Egipt' },
  tagline: {
    en: 'The Nile, the Pyramids and the Suez Canal: 27 governorates from the Mediterranean to Aswan.',
    ro: 'Nilul, Piramidele și Canalul Suez: 27 de guvernorate, de la Mediterana la Aswan.',
  },
  mapHint: { en: 'Hover or tap a governorate', ro: 'Treci cu mouse-ul sau atinge un guvernorat' },
  seatLabel: { en: 'capital', ro: 'capitala' },
  facts: [
    { icon: '🏛️', label: { en: 'Capital', ro: 'Capitala' }, value: { en: 'Cairo', ro: 'Cairo' } },
    { icon: '👥', label: { en: 'Population', ro: 'Populație' }, value: { en: 'about 107 million (2024)', ro: 'circa 107 milioane (2024)' } },
    { icon: '📐', label: { en: 'Area', ro: 'Suprafață' }, value: { en: '1,001,450 km²', ro: '1.001.450 km²' } },
    { icon: '🗺️', label: { en: 'Divisions', ro: 'Diviziuni' }, value: { en: '27 governorates', ro: '27 de guvernorate' } },
    { icon: '⛰️', label: { en: 'Highest point', ro: 'Cel mai înalt punct' }, value: { en: 'Mount Catherine, 2,629 m', ro: 'Muntele Sfânta Ecaterina, 2.629 m' } },
    { icon: '💵', label: { en: 'Currency', ro: 'Moneda' }, value: { en: 'Egyptian pound (EGP)', ro: 'Lira egipteană (EGP)' } },
    { icon: '🗣️', label: { en: 'Language', ro: 'Limba' }, value: { en: 'Arabic', ro: 'Arabă' } },
    { icon: '📅', label: { en: 'Independence', ro: 'Independența' }, value: { en: '28 February 1922', ro: '28 februarie 1922' } },
  ],
  neighbours: { en: 'Libya, Sudan, Israel and the Gaza Strip', ro: 'Libia, Sudan, Israel și Fâșia Gaza' },
  questions: [
    { id: 'capital', q: { en: 'Capital of Egypt', ro: 'Capitala Egiptului' }, answers: ['Cairo', 'Kairo', 'Al Qahirah'], show: { en: 'Cairo', ro: 'Cairo' } },
    { id: 'nile', q: { en: 'River almost every Egyptian lives along', ro: 'Râul de-a lungul căruia trăiesc aproape toți egiptenii' }, answers: ['Nile', 'Nil', 'Nilul'], show: { en: 'Nile', ro: 'Nil' } },
    { id: 'giza', q: { en: 'City across the Nile from Cairo with the Great Pyramids', ro: 'Orașul de peste Nil de Cairo, cu Marile Piramide' }, answers: ['Giza', 'Gizeh', 'Al Jizah'], show: { en: 'Giza', ro: 'Giza' } },
    { id: 'khufu', q: { en: 'Pharaoh of the Great Pyramid', ro: 'Faraonul Marii Piramide' }, answers: ['Khufu', 'Cheops', 'Keops', 'Kheops'], show: { en: 'Khufu (Cheops)', ro: 'Keops (Khufu)' } },
    { id: 'sphinx', q: { en: 'Statue with a lion\'s body and a human head', ro: 'Statuia cu trup de leu și cap de om' }, answers: ['Sphinx', 'Great Sphinx', 'Sfinx', 'Sfinxul', 'Marele Sfinx'], show: { en: 'Great Sphinx', ro: 'Marele Sfinx' } },
    { id: 'suez', q: { en: 'Canal linking the Mediterranean and the Red Sea', ro: 'Canalul care leagă Mediterana de Marea Roșie' }, answers: ['Suez', 'Suez Canal', 'Canalul Suez'], show: { en: 'Suez Canal', ro: 'Canalul Suez' } },
    { id: '1869', q: { en: 'Year that canal opened', ro: 'Anul deschiderii acestui canal' }, answers: ['1869'], show: { en: '1869', ro: '1869' } },
    { id: 'alexandria', q: { en: 'Port city founded by Alexander the Great', ro: 'Orașul-port fondat de Alexandru cel Mare' }, answers: ['Alexandria', 'Iskandariya'], show: { en: 'Alexandria', ro: 'Alexandria' } },
    { id: 'pharos', q: { en: 'Name of its ancient lighthouse, a wonder of the world', ro: 'Numele farului antic, una dintre minunile lumii' }, answers: ['Pharos', 'Pharos of Alexandria', 'Farul din Alexandria', 'Faros'], show: { en: 'Pharos', ro: 'Pharos' } },
    { id: 'aswan', q: { en: 'City of the High Dam on the Nile, finished in 1970', ro: 'Orașul Marelui Baraj de pe Nil, terminat în 1970' }, answers: ['Aswan', 'Assuan'], show: { en: 'Aswan', ro: 'Aswan' } },
    { id: 'nasser', q: { en: 'Huge reservoir lake behind that dam', ro: 'Lacul uriaș de acumulare din spatele barajului' }, answers: ['Nasser', 'Lake Nasser', 'Lacul Nasser'], show: { en: 'Lake Nasser', ro: 'Lacul Nasser' } },
    { id: 'abu-simbel', q: { en: 'Temples of Ramesses II moved uphill in the 1960s', ro: 'Templele lui Ramses al II-lea mutate mai sus în anii 1960' }, answers: ['Abu Simbel'], show: { en: 'Abu Simbel', ro: 'Abu Simbel' } },
    { id: 'valley-kings', q: { en: 'Burial valley of the New Kingdom pharaohs', ro: 'Valea de înmormântare a faraonilor Regatului Nou' }, answers: ['Valley of the Kings', 'Valea Regilor'], show: { en: 'Valley of the Kings', ro: 'Valea Regilor' } },
    { id: 'tutankhamun', q: { en: 'Boy pharaoh whose tomb was found intact in 1922', ro: 'Faraonul-copil al cărui mormânt a fost găsit intact în 1922' }, answers: ['Tutankhamun', 'Tutankhamon', 'Tutankamon', 'King Tut', 'Tutankhamen'], show: { en: 'Tutankhamun', ro: 'Tutankamon' } },
    { id: 'rosetta', q: { en: 'Stone that unlocked the hieroglyphs', ro: 'Piatra care a dezlegat hieroglifele' }, answers: ['Rosetta', 'Rosetta Stone', 'Piatra de la Rosetta'], show: { en: 'Rosetta Stone', ro: 'Piatra de la Rosetta' } },
    { id: 'sinai', q: { en: 'Peninsula that puts part of Egypt in Asia', ro: 'Peninsula care aduce o parte din Egipt în Asia' }, answers: ['Sinai', 'Sinai Peninsula', 'Peninsula Sinai'], show: { en: 'Sinai', ro: 'Sinai' } },
    { id: 'pound', q: { en: 'Currency', ro: 'Moneda' }, answers: ['pound', 'Egyptian pound', 'lira', 'lira egipteană', 'EGP', 'gineih'], show: { en: 'Egyptian pound', ro: 'Lira egipteană' } },
    { id: 'sahara', q: { en: 'Desert covering most of the country', ro: 'Deșertul care acoperă cea mai mare parte a țării' }, answers: ['Sahara', 'Saharan', 'Deșertul Sahara'], show: { en: 'Sahara', ro: 'Sahara' } },
    { id: 'luxor', q: { en: 'City of the Karnak temples, ancient Thebes', ro: 'Orașul templelor de la Karnak, vechea Teba' }, answers: ['Luxor', 'Thebes', 'Teba'], show: { en: 'Luxor', ro: 'Luxor' } },
    { id: 'cleopatra', q: { en: 'Last active ruler of the Ptolemaic kingdom', ro: 'Ultima conducătoare efectivă a regatului ptolemeic' }, answers: ['Cleopatra', 'Cleopatra VII', 'Kleopatra'], show: { en: 'Cleopatra', ro: 'Cleopatra' } },
  ],
}
