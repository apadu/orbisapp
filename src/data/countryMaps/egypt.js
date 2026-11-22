/**
 * Egypt: the 27 governorates, keyed by ISO 3166-2 code (= `id` in public/data/maps/eg.json).
 * `seat` = the governorate's capital.
 */
export const EGYPT = {
  id: 'eg',
  file: 'eg.json',
  country: 'Egypt',
  divisions: [
    { id: 'EG-ALX', name: 'Alexandria', alt: ['Al Iskandariyah', 'Iskandariya'], seat: 'Alexandria', seatAlt: ['Iskandariya', 'Al Iskandariyah'] },
    { id: 'EG-ASN', name: 'Aswan', alt: ['Assuan'], seat: 'Aswan', seatAlt: ['Assuan'] },
    { id: 'EG-AST', name: 'Asyut', alt: ['Assiut', 'Asiut'], seat: 'Asyut', seatAlt: ['Assiut', 'Asiut'] },
    { id: 'EG-BA', name: 'Red Sea', ro: 'Marea Roșie', alt: ['Al Bahr al Ahmar'], seat: 'Hurghada', seatAlt: ['Al Ghardaqah', 'Ghardaqa'] },
    { id: 'EG-BH', name: 'Beheira', alt: ['Al Buhayrah', 'Buhayra'], seat: 'Damanhur', seatAlt: ['Damanhour'] },
    { id: 'EG-BNS', name: 'Beni Suef', alt: ['Bani Suwayf', 'Beni Sueif'], seat: 'Beni Suef', seatAlt: ['Bani Suwayf', 'Beni Sueif'] },
    { id: 'EG-C', name: 'Cairo', ro: 'Cairo', alt: ['Al Qahirah', 'Kairo'], seat: 'Cairo', seatAlt: ['Al Qahirah', 'Kairo'], city: true },
    { id: 'EG-DK', name: 'Dakahlia', alt: ['Ad Daqahliyah', 'Daqahliya'], seat: 'Mansoura', seatAlt: ['Al Mansurah', 'Mansura'] },
    { id: 'EG-DT', name: 'Damietta', alt: ['Dumyat'], seat: 'Damietta', seatAlt: ['Dumyat'] },
    { id: 'EG-FYM', name: 'Faiyum', alt: ['Fayoum', 'Fayum', 'Al Fayyum'], seat: 'Faiyum', seatAlt: ['Fayoum', 'Fayum', 'Al Fayyum'] },
    { id: 'EG-GH', name: 'Gharbia', alt: ['Al Gharbiyah', 'Gharbiya'], seat: 'Tanta' },
    { id: 'EG-GZ', name: 'Giza', alt: ['Al Jizah', 'Gizeh'], seat: 'Giza', seatAlt: ['Al Jizah', 'Gizeh'] },
    { id: 'EG-IS', name: 'Ismailia', alt: ['Al Ismailiyah'], seat: 'Ismailia', seatAlt: ['Al Ismailiyah'] },
    { id: 'EG-JS', name: 'South Sinai', ro: 'Sinaiul de Sud', alt: ['Janub Sina'], seat: 'El Tor', seatAlt: ['Tor', 'At Tur', 'El-Tor'] },
    { id: 'EG-KB', name: 'Qalyubia', alt: ['Al Qalyubiyah', 'Qalyubiya'], seat: 'Banha', seatAlt: ['Benha'] },
    { id: 'EG-KFS', name: 'Kafr el-Sheikh', alt: ['Kafr ash Shaykh', 'Kafr El Sheikh'], seat: 'Kafr el-Sheikh', seatAlt: ['Kafr ash Shaykh', 'Kafr El Sheikh'] },
    { id: 'EG-KN', name: 'Qena', alt: ['Qina', 'Kena'], seat: 'Qena', seatAlt: ['Qina', 'Kena'] },
    { id: 'EG-LX', name: 'Luxor', alt: ['Al Uqsur'], seat: 'Luxor', seatAlt: ['Al Uqsur'] },
    { id: 'EG-MN', name: 'Minya', alt: ['Al Minya', 'El Minya'], seat: 'Minya', seatAlt: ['Al Minya', 'El Minya'] },
    { id: 'EG-MNF', name: 'Monufia', alt: ['Al Minufiyah', 'Menoufia', 'Minufiya'], seat: 'Shibin El Kom', seatAlt: ['Shibin al Kawm', 'Shebin El Kom', 'Shibin el-Kom'] },
    { id: 'EG-MT', name: 'Matrouh', alt: ['Matruh', 'Marsa Matruh'], seat: 'Marsa Matruh', seatAlt: ['Mersa Matruh', 'Marsa Matrouh'] },
    { id: 'EG-PTS', name: 'Port Said', alt: ['Bur Said'], seat: 'Port Said', seatAlt: ['Bur Said'] },
    { id: 'EG-SHG', name: 'Sohag', alt: ['Suhaj', 'Souhag'], seat: 'Sohag', seatAlt: ['Suhaj', 'Souhag'] },
    { id: 'EG-SHR', name: 'Sharqia', alt: ['Al Sharqia', 'Ash Sharqiyah', 'Sharkia'], seat: 'Zagazig', seatAlt: ['Az Zaqaziq'] },
    { id: 'EG-SIN', name: 'North Sinai', ro: 'Sinaiul de Nord', alt: ['Shamal Sina'], seat: 'Arish', seatAlt: ['El Arish', 'Al Arish', 'El-Arish'] },
    { id: 'EG-SUZ', name: 'Suez', alt: ['As Suways'], seat: 'Suez', seatAlt: ['As Suways'] },
    { id: 'EG-WAD', name: 'New Valley', ro: 'Noua Vale', alt: ['Al Wadi al Jadid', 'Wadi el Gedid'], seat: 'Kharga', seatAlt: ['El Kharga', 'Al Kharijah'] },
  ],
}
