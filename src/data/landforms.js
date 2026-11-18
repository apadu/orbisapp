/**
 * Famous islands and peninsulas for the world-map quizzes (see src/quizzes/landformQuizzes.js).
 * Pure data, also read by scripts/build-landforms.mjs, which pre-renders the maps into
 * public/data/landforms/<quiz>.json.
 *
 * name = English, ro = Romanian (when different).
 * alt = other spellings accepted in English (plus native names), roAlt = the same in Romanian;
 * without roAlt, Romanian accepts `alt` too. "Peninsula X" / "X Peninsula" / "Insula X" also
 * work as plain "X" (see landformQuizzes.js).
 * Geometry (only used by the build script):
 *   at:     [lon, lat] — the island is the Natural Earth 1:10m land polygon under this point
 *   ne:     name of a Natural Earth "geography regions" polygon (peninsulas)
 *   clip:   polygon [[lon, lat]…] cut out of the land; the biggest piece is kept
 */
export const LANDFORMS = {
  islands: [
    { id: 'greenland', name: 'Greenland', ro: 'Groenlanda', alt: ['Kalaallit Nunaat'], at: [-42, 72] },
    { id: 'new-guinea', name: 'New Guinea', ro: 'Noua Guinee', alt: ['Papua'], at: [142, -6] },
    { id: 'borneo', name: 'Borneo', alt: ['Kalimantan'], at: [114, 1] },
    { id: 'madagascar', name: 'Madagascar', at: [47, -19] },
    { id: 'baffin', name: 'Baffin Island', ro: 'Insula Baffin', alt: ['Baffin'], at: [-72, 68] },
    { id: 'sumatra', name: 'Sumatra', alt: ['Sumatera'], at: [101, 0] },
    { id: 'honshu', name: 'Honshu', alt: ['Honshū', 'Hondo'], at: [139, 36.5] },
    { id: 'great-britain', name: 'Great Britain', ro: 'Marea Britanie', alt: ['Britain'], roAlt: ['Britania'], at: [-2, 53] },
    { id: 'sulawesi', name: 'Sulawesi', alt: ['Celebes'], at: [120.2, -1.8] },
    { id: 'java', name: 'Java', alt: ['Jawa'], at: [110, -7.3] },
    { id: 'cuba', name: 'Cuba', at: [-79, 22] },
    { id: 'newfoundland', name: 'Newfoundland', alt: ['Terre-Neuve'], roAlt: ['Terra Nova', 'Terre-Neuve'], at: [-56, 48.5] },
    { id: 'luzon', name: 'Luzon', at: [121, 16] },
    { id: 'iceland', name: 'Iceland', ro: 'Islanda', alt: ['Ísland'], at: [-19, 65] },
    { id: 'mindanao', name: 'Mindanao', at: [125, 7.5] },
    { id: 'ireland', name: 'Ireland', ro: 'Irlanda', alt: ['Éire', 'Eire'], at: [-8, 53] },
    { id: 'hokkaido', name: 'Hokkaido', alt: ['Hokkaidō'], at: [143, 43.5] },
    { id: 'hispaniola', name: 'Hispaniola', alt: ['Española', 'Espanola', 'Haiti'], at: [-71, 19] },
    { id: 'sri-lanka', name: 'Sri Lanka', alt: ['Ceylon'], roAlt: ['Ceylon', 'Ceilon'], at: [80.7, 7.8] },
    { id: 'tasmania', name: 'Tasmania', at: [146.5, -42] },
    { id: 'tierra-del-fuego', name: 'Tierra del Fuego', ro: 'Țara de Foc', alt: ['Isla Grande de Tierra del Fuego', 'Isla Grande'], roAlt: ['Tierra del Fuego', 'Isla Grande'], at: [-68.5, -54] },
    { id: 'taiwan', name: 'Taiwan', alt: ['Formosa'], at: [121, 23.7] },
    { id: 'hainan', name: 'Hainan', at: [109.7, 19.2] },
    { id: 'sicily', name: 'Sicily', ro: 'Sicilia', alt: ['Sicilia'], at: [14, 37.5] },
    { id: 'sardinia', name: 'Sardinia', alt: ['Sardegna'], at: [9, 40] },
    { id: 'cyprus', name: 'Cyprus', ro: 'Cipru', alt: ['Kypros', 'Kıbrıs'], at: [33, 35] },
    { id: 'corsica', name: 'Corsica', alt: ['Corse'], at: [9.1, 42.1] },
    { id: 'crete', name: 'Crete', ro: 'Creta', alt: ['Kriti', 'Kreta'], at: [24.9, 35.25] },
    { id: 'jamaica', name: 'Jamaica', at: [-77.3, 18.1] },
    { id: 'mallorca', name: 'Mallorca', alt: ['Majorca'], roAlt: ['Maiorca', 'Majorca'], at: [2.95, 39.6] },
  ],
  peninsulas: [
    { id: 'arabian', name: 'Arabian Peninsula', ro: 'Peninsula Arabică', alt: ['Arabia'], roAlt: ['Arabia'], ne: 'ARABIAN PENINSULA' },
    { id: 'indian', name: 'Indian Peninsula', ro: 'Peninsula Hindustan', alt: ['Hindustan', 'Indian subcontinent', 'Deccan', 'India'], roAlt: ['Peninsula Indiei', 'Peninsula Indiană', 'Hindustan', 'Deccan', 'Dekkan', 'India'], ne: 'INDIA' },
    { id: 'indochina', name: 'Indochina', ro: 'Peninsula Indochina', alt: ['Indochinese Peninsula'], roAlt: ['Indochina', 'Peninsula Indochineză'], ne: 'INDOCHINA PENINSULA' },
    { id: 'scandinavian', name: 'Scandinavian Peninsula', ro: 'Peninsula Scandinavă', alt: ['Scandinavia'], roAlt: ['Scandinavia'], ne: 'SCANDINAVIA' },
    { id: 'iberian', name: 'Iberian Peninsula', ro: 'Peninsula Iberică', alt: ['Iberia'], roAlt: ['Iberia'],
      clip: [[-10.5, 44.2], [-1.75, 43.42], [3.2, 42.5], [3.6, 41.5], [3.6, 36.05], [-5.6, 36.0], [-10.5, 36.0]] },
    { id: 'balkan', name: 'Balkan Peninsula', ro: 'Peninsula Balcanică', alt: ['Balkans'], roAlt: ['Balcani', 'Balcanii', 'Peninsula Balcanilor'], ne: 'BALKAN PEN.' },
    { id: 'italian', name: 'Italian Peninsula', ro: 'Peninsula Italică', alt: ['Apennine Peninsula', 'Italy'], roAlt: ['Peninsula Apenină', 'Peninsula Apeninică', 'Italia'],
      clip: [[7.4, 44.3], [10.0, 44.15], [12.4, 44.2], [13.6, 44.2], [19.5, 40.4], [16.2, 37.85], [15.6, 37.95], [11.5, 41.1], [7.4, 41.5]] },
    { id: 'anatolia', name: 'Anatolia', alt: ['Asia Minor', 'Anatolian Peninsula'], roAlt: ['Asia Mică', 'Peninsula Anatolia'],
      clip: [[25.4, 39.0], [26.12, 39.95], [26.45, 40.25], [26.75, 40.42], [27.6, 40.62], [28.9, 40.95], [29.02, 41.08], [29.12, 41.24], [29.3, 41.6], [41.6, 41.6], [36.2, 36.5], [36.0, 35.5], [25.4, 35.5]] },
    { id: 'crimea', name: 'Crimea', ro: 'Crimeea', alt: ['Krym', 'Crimean Peninsula'], roAlt: ['Peninsula Crimeea', 'Krym'], ne: 'CRIMEA' },
    { id: 'jutland', name: 'Jutland', ro: 'Iutlanda', alt: ['Jylland', 'Cimbrian Peninsula'], roAlt: ['Jutland', 'Jylland', 'Peninsula Iutlanda'],
      clip: [[7.6, 54.35], [9.4, 54.35], [10.1, 54.45], [10.6, 56.0], [11.0, 57.9], [7.6, 57.9]] },
    { id: 'peloponnese', name: 'Peloponnese', ro: 'Peloponez', alt: ['Peloponnesus', 'Peloponnisos', 'Morea'], roAlt: ['Peloponnesos', 'Peloponnisos', 'Moreea'],
      clip: [[20.9, 38.0], [22.88, 38.02], [22.98, 37.95], [23.1, 37.86], [23.7, 36.2], [20.9, 36.2]] },
    { id: 'sinai', name: 'Sinai Peninsula', ro: 'Peninsula Sinai',
      clip: [[32.28, 31.32], [34.25, 31.32], [34.93, 29.5], [34.5, 27.6], [33.85, 27.6], [32.58, 29.9], [32.33, 30.2]] },
    { id: 'kola', name: 'Kola Peninsula', ro: 'Peninsula Kola', ne: 'KOLA PENINSULA' },
    { id: 'taymyr', name: 'Taymyr Peninsula', ro: 'Peninsula Taimîr', alt: ['Taimyr'], roAlt: ['Taimir', 'Taimyr', 'Taymyr'], ne: 'TAYMYR PENINSULA' },
    { id: 'kamchatka', name: 'Kamchatka', ro: 'Kamceatka', alt: ['Kamchatka Peninsula'], roAlt: ['Kamciatka', 'Peninsula Kamceatka', 'Kamchatka'], ne: 'KAMCHATKA PENINSULA' },
    { id: 'korean', name: 'Korean Peninsula', ro: 'Peninsula Coreeană', alt: ['Korea'], roAlt: ['Coreea'], ne: 'KOREA' },
    { id: 'malay', name: 'Malay Peninsula', ro: 'Peninsula Malaya', alt: ['Malaya', 'Malacca'], roAlt: ['Peninsula Malacca', 'Malaya', 'Malacca'], ne: 'MALAY PENINSULA' },
    { id: 'somali', name: 'Horn of Africa', ro: 'Cornul Africii', alt: ['Somali Peninsula', 'Somalia'], roAlt: ['Peninsula Somalia', 'Somalia'], ne: 'SOMALI PENINSULA' },
    { id: 'florida', name: 'Florida', alt: ['Florida Peninsula'], ne: 'FLORIDA' },
    { id: 'baja', name: 'Baja California', alt: ['Lower California'], roAlt: ['California de Jos'], ne: 'BAJA CALIFORNIA' },
    { id: 'yucatan', name: 'Yucatán', alt: ['Yucatan Peninsula'], ne: 'PEN. DE YUCATÁN' },
  ],
}
