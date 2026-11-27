/**
 * Country page: Chile (bilingual inline, like romania.js).
 * Facts: population 18.5 million (2024 census, INE); area 756,102 km² (without the Antarctic claim); Ojos del Salado 6,893 m; independence declared 12 February 1818.
 */
export const CHILE_PAGE = {
  id: 'cl',
  flag: '🇨🇱',
  name: {"en": "Chile", "ro": "Chile"},
  tagline: {
    en: "4,300 km of coast between the Andes and the Pacific: 16 regions from the Atacama Desert to Cape Horn.",
    ro: "4.300 km de coastă între Anzi și Pacific: 16 regiuni, de la deșertul Atacama la Capul Horn.",
  },
  mapHint: { en: "Hover or tap a region", ro: "Treci cu mouse-ul sau atinge o regiune" },
  facts: [
    { icon: '🏛️', label: { en: "Capital", ro: "Capitala" }, value: { en: "Santiago", ro: "Santiago" } },
    { icon: '👥', label: { en: "Population", ro: "Populație" }, value: { en: "18.5 million (2024 census)", ro: "18,5 milioane (recensământul din 2024)" } },
    { icon: '📐', label: { en: "Area", ro: "Suprafață" }, value: { en: "756,102 km²", ro: "756.102 km²" } },
    { icon: '🗺️', label: { en: "Divisions", ro: "Diviziuni" }, value: { en: "16 regions", ro: "16 regiuni" } },
    { icon: '⛰️', label: { en: "Highest point", ro: "Cel mai înalt punct" }, value: { en: "Ojos del Salado, 6,893 m", ro: "Ojos del Salado, 6.893 m" } },
    { icon: '💲', label: { en: "Currency", ro: "Moneda" }, value: { en: "Chilean peso (CLP)", ro: "Peso chilian (CLP)" } },
    { icon: '🗣️', label: { en: "Language", ro: "Limba" }, value: { en: "Spanish", ro: "Spaniolă" } },
    { icon: '📅', label: { en: "Independence", ro: "Independența" }, value: { en: "12 February 1818", ro: "12 februarie 1818" } },
  ],
  neighbours: { en: "Peru, Bolivia, Argentina", ro: "Peru, Bolivia, Argentina" },
  questions: [
    { id: "capital", q: { en: "Capital of Chile", ro: "Capitala statului Chile" }, answers: ["Santiago", "Santiago de Chile"], show: { en: "Santiago", ro: "Santiago" } },
    { id: "atacama", q: { en: "Driest non-polar desert on Earth", ro: "Cel mai arid deșert nepolar de pe Pământ" }, answers: ["Atacama", "Atacama Desert", "Deșertul Atacama", "Desertul Atacama"], show: { en: "Atacama", ro: "Atacama" } },
    { id: "easter", q: { en: "Pacific island of the moai statues", ro: "Insula din Pacific cu statuile moai" }, answers: ["Easter Island", "Rapa Nui", "Insula Paștelui", "Insula Pastelui", "Isla de Pascua"], show: { en: "Easter Island (Rapa Nui)", ro: "Insula Paștelui (Rapa Nui)" } },
    { id: "neruda", q: { en: "Poet who won the 1971 Nobel Prize (\"Canto General\")", ro: "Poetul laureat al Premiului Nobel în 1971 („Canto General”)" }, answers: ["Pablo Neruda", "Neruda"], show: { en: "Pablo Neruda", ro: "Pablo Neruda" } },
    { id: "mistral", q: { en: "Poet, first Latin American Nobel laureate in literature (1945)", ro: "Poeta, primul laureat Nobel pentru literatură din America Latină (1945)" }, answers: ["Gabriela Mistral", "Mistral"], show: { en: "Gabriela Mistral", ro: "Gabriela Mistral" } },
    { id: "ojos", q: { en: "Highest volcano on Earth, on the Argentine border", ro: "Cel mai înalt vulcan de pe Pământ, la granița cu Argentina" }, answers: ["Ojos del Salado", "Nevado Ojos del Salado"], show: { en: "Ojos del Salado", ro: "Ojos del Salado" } },
    { id: "valparaiso", q: { en: "Port of colourful hillsides and funiculars near Santiago", ro: "Portul cu dealuri colorate și funiculare de lângă Santiago" }, answers: ["Valparaíso", "Valparaiso"], show: { en: "Valparaíso", ro: "Valparaíso" } },
    { id: "puntaarenas", q: { en: "Southern city on the Strait of Magellan", ro: "Orașul din sud de pe Strâmtoarea Magellan" }, answers: ["Punta Arenas"], show: { en: "Punta Arenas", ro: "Punta Arenas" } },
    { id: "magellan", q: { en: "Strait named after a Portuguese navigator", ro: "Strâmtoarea numită după un navigator portughez" }, answers: ["Strait of Magellan", "Magellan", "Strâmtoarea Magellan", "Stramtoarea Magellan", "Magallanes", "Estrecho de Magallanes"], show: { en: "Strait of Magellan", ro: "Strâmtoarea Magellan" } },
    { id: "paine", q: { en: "Patagonian national park with granite towers", ro: "Parcul național din Patagonia cu turnuri de granit" }, answers: ["Torres del Paine", "Paine"], show: { en: "Torres del Paine", ro: "Torres del Paine" } },
    { id: "copper", q: { en: "Metal of which it is the world's largest producer", ro: "Metalul al cărui cel mai mare producător mondial este" }, answers: ["copper", "cupru", "Cu", "cobre"], show: { en: "Copper", ro: "Cupru" } },
    { id: "pisco", q: { en: "Grape brandy also claimed by Peru", ro: "Rachiul din struguri revendicat și de Peru" }, answers: ["pisco"], show: { en: "Pisco", ro: "Pisco" } },
    { id: "mapuche", q: { en: "Indigenous people of the south who resisted Spain for centuries", ro: "Poporul indigen din sud care a rezistat spaniolilor secole întregi" }, answers: ["Mapuche", "Mapuches", "Araucanians"], show: { en: "Mapuche", ro: "Mapuche" } },
    { id: "ohiggins", q: { en: "Independence leader and first Supreme Director", ro: "Liderul independenței și primul Director Suprem" }, answers: ["Bernardo O'Higgins", "O'Higgins", "OHiggins", "O Higgins"], show: { en: "Bernardo O'Higgins", ro: "Bernardo O'Higgins" } },
    { id: "1960", q: { en: "Year of the strongest earthquake ever recorded (Valdivia)", ro: "Anul celui mai puternic cutremur înregistrat vreodată (Valdivia)" }, answers: ["1960"], show: { en: "1960", ro: "1960" } },
    { id: "juanfernandez", q: { en: "Archipelago where the real Robinson Crusoe was marooned", ro: "Arhipelagul unde a fost abandonat adevăratul Robinson Crusoe" }, answers: ["Juan Fernández", "Juan Fernandez", "Juan Fernández Islands"], show: { en: "Juan Fernández", ro: "Juan Fernández" } },
    { id: "capehorn", q: { en: "Cape at the southern tip of the Americas", ro: "Capul din extremitatea sudică a Americilor" }, answers: ["Cape Horn", "Horn", "Capul Horn", "Cabo de Hornos"], show: { en: "Cape Horn", ro: "Capul Horn" } },
    { id: "pinochet", q: { en: "General who seized power in 1973 and ruled until 1990", ro: "Generalul care a preluat puterea în 1973 și a condus până în 1990" }, answers: ["Pinochet", "Augusto Pinochet"], show: { en: "Augusto Pinochet", ro: "Augusto Pinochet" } },
    { id: "allende", q: { en: "President overthrown in the 1973 coup", ro: "Președintele răsturnat de lovitura de stat din 1973" }, answers: ["Allende", "Salvador Allende"], show: { en: "Salvador Allende", ro: "Salvador Allende" } },
    { id: "andes", q: { en: "Mountain range along the whole eastern border", ro: "Lanțul muntos de-a lungul întregii granițe estice" }, answers: ["Andes", "Anzi", "Anzii", "Cordillera de los Andes"], show: { en: "Andes", ro: "Anzii" } },
  ],
}
