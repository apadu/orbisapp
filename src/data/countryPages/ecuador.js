/**
 * Country page: Ecuador (bilingual inline, like romania.js).
 * Facts: population 16.9 million (2022 census, INEC); area 256,370 km²; Chimborazo 6,263 m; Battle of Pichincha 24 May 1822; US dollar since 2000.
 */
export const ECUADOR_PAGE = {
  id: 'ec',
  flag: '🇪🇨',
  name: {"en": "Ecuador", "ro": "Ecuador"},
  tagline: {
    en: "Named after the Equator: Andes volcanoes, the Amazon and the Galápagos, in 24 provinces.",
    ro: "Numit după Ecuator: vulcani în Anzi, Amazonul și Insulele Galápagos, în 24 de provincii.",
  },
  mapHint: { en: "Hover or tap a province", ro: "Treci cu mouse-ul sau atinge o provincie" },
  facts: [
    { icon: '🏛️', label: { en: "Capital", ro: "Capitala" }, value: { en: "Quito", ro: "Quito" } },
    { icon: '👥', label: { en: "Population", ro: "Populație" }, value: { en: "16.9 million (2022 census)", ro: "16,9 milioane (recensământul din 2022)" } },
    { icon: '📐', label: { en: "Area", ro: "Suprafață" }, value: { en: "256,370 km²", ro: "256.370 km²" } },
    { icon: '🗺️', label: { en: "Divisions", ro: "Diviziuni" }, value: { en: "24 provinces", ro: "24 de provincii" } },
    { icon: '⛰️', label: { en: "Highest point", ro: "Cel mai înalt punct" }, value: { en: "Chimborazo, 6,263 m", ro: "Chimborazo, 6.263 m" } },
    { icon: '💲', label: { en: "Currency", ro: "Moneda" }, value: { en: "US dollar (since 2000)", ro: "Dolarul american (din 2000)" } },
    { icon: '🗣️', label: { en: "Language", ro: "Limba" }, value: { en: "Spanish (Kichwa and Shuar also official in their areas)", ro: "Spaniolă (kichwa și shuar oficiale în zonele lor)" } },
    { icon: '📅', label: { en: "Independence", ro: "Independența" }, value: { en: "24 May 1822 (Battle of Pichincha)", ro: "24 mai 1822 (Bătălia de la Pichincha)" } },
  ],
  neighbours: { en: "Colombia, Peru", ro: "Columbia, Peru" },
  questions: [
    { id: "capital", q: { en: "Capital of Ecuador", ro: "Capitala statului Ecuador" }, answers: ["Quito"], show: { en: "Quito", ro: "Quito" } },
    { id: "guayaquil", q: { en: "Largest city and main port", ro: "Cel mai mare oraș și principalul port" }, answers: ["Guayaquil"], show: { en: "Guayaquil", ro: "Guayaquil" } },
    { id: "galapagos", q: { en: "Islands in the Pacific famous for unique wildlife", ro: "Insulele din Pacific celebre pentru fauna unică" }, answers: ["Galápagos", "Galapagos", "Galápagos Islands", "Insulele Galápagos"], show: { en: "Galápagos Islands", ro: "Insulele Galápagos" } },
    { id: "darwin", q: { en: "Naturalist who visited the islands in 1835", ro: "Naturalistul care a vizitat insulele în 1835" }, answers: ["Charles Darwin", "Darwin"], show: { en: "Charles Darwin", ro: "Charles Darwin" } },
    { id: "chimborazo", q: { en: "Volcano whose summit is the farthest point from Earth's centre", ro: "Vulcanul al cărui vârf e cel mai îndepărtat punct de centrul Pământului" }, answers: ["Chimborazo"], show: { en: "Chimborazo", ro: "Chimborazo" } },
    { id: "cotopaxi", q: { en: "Snow-capped active volcano south of Quito", ro: "Vulcanul activ acoperit de zăpadă de la sud de Quito" }, answers: ["Cotopaxi"], show: { en: "Cotopaxi", ro: "Cotopaxi" } },
    { id: "equator", q: { en: "Line the country is named after", ro: "Linia după care e numită țara" }, answers: ["Equator", "the Equator", "Ecuator", "Ecuatorul"], show: { en: "Equator", ro: "Ecuatorul" } },
    { id: "dollar", q: { en: "Currency since 2000", ro: "Moneda din 2000" }, answers: ["US dollar", "dollar", "dolar", "dolarul american", "dolar american", "USD"], show: { en: "US dollar", ro: "Dolarul american" } },
    { id: "hat", q: { en: "Woven toquilla-straw hat, named after another country", ro: "Pălăria împletită din paie de toquilla, numită după altă țară" }, answers: ["Panama hat", "Panama", "pălărie Panama", "palarie panama", "Montecristi"], show: { en: "Panama hat", ro: "Pălăria Panama" } },
    { id: "banana", q: { en: "Fruit of which it is the world's largest exporter", ro: "Fructul la care e cel mai mare exportator din lume" }, answers: ["banana", "bananas", "banane", "banană"], show: { en: "Bananas", ro: "Bananele" } },
    { id: "amazon", q: { en: "Rainforest in the east, the Oriente", ro: "Pădurea tropicală din est, Oriente" }, answers: ["Amazon", "Amazon rainforest", "Amazonia", "Amazonul", "pădurea amazoniană", "padurea amazoniana"], show: { en: "Amazon rainforest", ro: "Pădurea amazoniană" } },
    { id: "cuenca", q: { en: "Colonial city in the southern Andes (UNESCO)", ro: "Orașul colonial din sudul Anzilor (UNESCO)" }, answers: ["Cuenca"], show: { en: "Cuenca", ro: "Cuenca" } },
    { id: "tortoise", q: { en: "Giant animal the islands are named after", ro: "Animalul uriaș după care sunt numite insulele" }, answers: ["giant tortoise", "tortoise", "turtle", "galápago", "galapago", "broască țestoasă", "broasca testoasa", "țestoasă", "testoasa", "țestoasa uriașă"], show: { en: "Giant tortoise", ro: "Țestoasa uriașă" } },
    { id: "mitad", q: { en: "Monument on the Equator near Quito, \"Middle of the World\"", ro: "Monumentul de pe Ecuator de lângă Quito, „Mijlocul Lumii”" }, answers: ["Mitad del Mundo", "Ciudad Mitad del Mundo", "Middle of the World", "Mijlocul Lumii"], show: { en: "Mitad del Mundo", ro: "Mitad del Mundo" } },
    { id: "kichwa", q: { en: "Indigenous language of the Andes, official in its regions", ro: "Limba indigenă din Anzi, oficială în regiunile ei" }, answers: ["Kichwa", "Quichua", "Quechua", "kichwa"], show: { en: "Kichwa (Quichua)", ro: "Kichwa (Quichua)" } },
    { id: "otavalo", q: { en: "Andean town with a famous crafts market", ro: "Orașul andin cu o celebră piață de artizanat" }, answers: ["Otavalo"], show: { en: "Otavalo", ro: "Otavalo" } },
    { id: "pacific", q: { en: "Ocean on its coast", ro: "Oceanul de pe coasta sa" }, answers: ["Pacific", "Pacific Ocean", "Oceanul Pacific", "Pacificul"], show: { en: "Pacific Ocean", ro: "Oceanul Pacific" } },
    { id: "cacao", q: { en: "Bean behind its fine \"Arriba\" chocolate", ro: "Boabele din care se face ciocolata fină „Arriba”" }, answers: ["cacao", "cocoa", "cocoa beans", "boabe de cacao"], show: { en: "Cacao", ro: "Cacao" } },
    { id: "grancolombia", q: { en: "Republic it left in 1830", ro: "Republica din care s-a desprins în 1830" }, answers: ["Gran Colombia", "Great Colombia", "Marea Columbie", "Marea Columbia"], show: { en: "Gran Colombia", ro: "Marea Columbie" } },
    { id: "1822", q: { en: "Year of the Battle of Pichincha that freed Quito", ro: "Anul bătăliei de la Pichincha, care a eliberat Quito" }, answers: ["1822"], show: { en: "1822", ro: "1822" } },
  ],
}
