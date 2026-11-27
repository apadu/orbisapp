/**
 * Country page: Bolivia (bilingual inline, like romania.js).
 * Facts: population 11.3 million (2024 census, INE); area 1,098,581 km²; Nevado Sajama 6,542 m; independence 6 August 1825.
 */
export const BOLIVIA_PAGE = {
  id: 'bo',
  flag: '🇧🇴',
  name: {"en": "Bolivia", "ro": "Bolivia"},
  tagline: {
    en: "High Andes, salt flats and the Amazon: a landlocked country of 9 departments and two capitals.",
    ro: "Anzii înalți, saline și Amazonul: o țară fără ieșire la mare, cu 9 departamente și două capitale.",
  },
  mapHint: { en: "Hover or tap a department", ro: "Treci cu mouse-ul sau atinge un departament" },
  facts: [
    { icon: '🏛️', label: { en: "Capital", ro: "Capitala" }, value: { en: "Sucre (La Paz: seat of government)", ro: "Sucre (La Paz: sediul guvernului)" } },
    { icon: '👥', label: { en: "Population", ro: "Populație" }, value: { en: "11.3 million (2024 census)", ro: "11,3 milioane (recensământul din 2024)" } },
    { icon: '📐', label: { en: "Area", ro: "Suprafață" }, value: { en: "1,098,581 km²", ro: "1.098.581 km²" } },
    { icon: '🗺️', label: { en: "Divisions", ro: "Diviziuni" }, value: { en: "9 departments", ro: "9 departamente" } },
    { icon: '⛰️', label: { en: "Highest point", ro: "Cel mai înalt punct" }, value: { en: "Nevado Sajama, 6,542 m", ro: "Nevado Sajama, 6.542 m" } },
    { icon: '💲', label: { en: "Currency", ro: "Moneda" }, value: { en: "Boliviano (BOB)", ro: "Boliviano (BOB)" } },
    { icon: '🗣️', label: { en: "Languages", ro: "Limbi" }, value: { en: "Spanish and 36 indigenous languages", ro: "Spaniolă și 36 de limbi indigene" } },
    { icon: '📅', label: { en: "Independence", ro: "Independența" }, value: { en: "6 August 1825", ro: "6 august 1825" } },
  ],
  neighbours: { en: "Brazil, Paraguay, Argentina, Chile, Peru", ro: "Brazilia, Paraguay, Argentina, Chile, Peru" },
  questions: [
    { id: "sucre", q: { en: "Constitutional capital", ro: "Capitala constituțională" }, answers: ["Sucre"], show: { en: "Sucre", ro: "Sucre" } },
    { id: "lapaz", q: { en: "Seat of government, the highest of its kind in the world", ro: "Sediul guvernului, cel mai înalt de acest fel din lume" }, answers: ["La Paz"], show: { en: "La Paz", ro: "La Paz" } },
    { id: "titicaca", q: { en: "Lake shared with Peru, the highest navigable lake", ro: "Lacul împărțit cu Peru, cel mai înalt lac navigabil" }, answers: ["Titicaca", "Lake Titicaca", "Lacul Titicaca"], show: { en: "Lake Titicaca", ro: "Lacul Titicaca" } },
    { id: "uyuni", q: { en: "World's largest salt flat", ro: "Cea mai mare salină din lume" }, answers: ["Salar de Uyuni", "Uyuni", "Salar de Tunupa"], show: { en: "Salar de Uyuni", ro: "Salar de Uyuni" } },
    { id: "bolivar", q: { en: "Liberator the country is named after", ro: "Eliberatorul după care e numită țara" }, answers: ["Simón Bolívar", "Simon Bolivar", "Bolívar", "Bolivar"], show: { en: "Simón Bolívar", ro: "Simón Bolívar" } },
    { id: "boliviano", q: { en: "Currency", ro: "Moneda" }, answers: ["boliviano", "BOB", "Bs"], show: { en: "Boliviano", ro: "Boliviano" } },
    { id: "chile", q: { en: "Country it lost its coast to in the War of the Pacific", ro: "Țara căreia i-a pierdut coasta în Războiul Pacificului" }, answers: ["Chile"], show: { en: "Chile", ro: "Chile" } },
    { id: "potosi", q: { en: "Silver-mining city below the Cerro Rico", ro: "Orașul minelor de argint de sub Cerro Rico" }, answers: ["Potosí", "Potosi"], show: { en: "Potosí", ro: "Potosí" } },
    { id: "andes", q: { en: "Mountain range in the west", ro: "Lanțul muntos din vest" }, answers: ["Andes", "Anzi", "Anzii", "Cordillera de los Andes"], show: { en: "Andes", ro: "Anzii" } },
    { id: "sajama", q: { en: "Highest mountain", ro: "Cel mai înalt munte" }, answers: ["Sajama", "Nevado Sajama"], show: { en: "Nevado Sajama", ro: "Nevado Sajama" } },
    { id: "llama", q: { en: "Andean animal used to carry loads and for wool", ro: "Animalul andin folosit la transport și pentru lână" }, answers: ["llama", "lamă", "lama", "lame"], show: { en: "Llama", ro: "Lama" } },
    { id: "tiwanaku", q: { en: "Pre-Inca city near Lake Titicaca with the Gate of the Sun", ro: "Orașul preincaș de lângă Titicaca, cu Poarta Soarelui" }, answers: ["Tiwanaku", "Tiahuanaco", "Tiahuanacu"], show: { en: "Tiwanaku", ro: "Tiwanaku" } },
    { id: "che", q: { en: "Revolutionary killed in Bolivia in 1967", ro: "Revoluționarul ucis în Bolivia în 1967" }, answers: ["Che Guevara", "Guevara", "Che", "Ernesto Guevara"], show: { en: "Che Guevara", ro: "Che Guevara" } },
    { id: "elalto", q: { en: "City above La Paz linked to it by the world's largest urban cable-car network", ro: "Orașul de deasupra La Paz legat de el prin cea mai mare rețea urbană de telecabine" }, answers: ["El Alto"], show: { en: "El Alto", ro: "El Alto" } },
    { id: "aymara", q: { en: "Indigenous language of the Altiplano", ro: "Limba indigenă din Altiplano" }, answers: ["Aymara", "Aimara", "aymara"], show: { en: "Aymara", ro: "Aymara" } },
    { id: "quechua", q: { en: "Indigenous language once spoken across the Inca Empire", ro: "Limba indigenă vorbită odinioară în tot Imperiul Inca" }, answers: ["Quechua", "Kechua", "Quichua", "quechua"], show: { en: "Quechua", ro: "Quechua" } },
    { id: "deathroad", q: { en: "Mountain road nicknamed \"the world's most dangerous\"", ro: "Drumul de munte poreclit „cel mai periculos din lume”" }, answers: ["Death Road", "Yungas Road", "North Yungas Road", "Camino de la Muerte", "Drumul Morții", "Drumul Mortii"], show: { en: "Death Road (Yungas)", ro: "Drumul Morții (Yungas)" } },
    { id: "santacruz", q: { en: "Largest city, in the eastern lowlands", ro: "Cel mai mare oraș, în câmpiile din est" }, answers: ["Santa Cruz", "Santa Cruz de la Sierra"], show: { en: "Santa Cruz de la Sierra", ro: "Santa Cruz de la Sierra" } },
    { id: "coca", q: { en: "Leaf chewed or brewed as tea against altitude sickness", ro: "Frunza mestecată sau băută ca ceai contra răului de altitudine" }, answers: ["coca", "coca leaf", "frunze de coca", "mate de coca"], show: { en: "Coca leaf", ro: "Frunza de coca" } },
    { id: "1825", q: { en: "Year of independence", ro: "Anul independenței" }, answers: ["1825"], show: { en: "1825", ro: "1825" } },
  ],
}
