/**
 * Country page: Peru (bilingual inline, like romania.js).
 * Facts: population about 34 million (2024, INEI); area 1,285,216 km²; Huascarán 6,768 m; independence 28 July 1821.
 */
export const PERU_PAGE = {
  id: 'pe',
  flag: '🇵🇪',
  name: { en: "Peru", ro: "Peru" },
  tagline: {
    en: "Machu Picchu, Lake Titicaca and the Amazon: 24 departments, Lima and Callao, from the desert coast to the Andes.",
    ro: "Machu Picchu, Lacul Titicaca și Amazonul: 24 de departamente, Lima și Callao, de la coasta deșertică la Anzi.",
  },
  mapHint: { en: "Hover or tap a region", ro: "Treci cu mouse-ul sau atinge o regiune" },
  seatLabel: { en: 'capital', ro: 'capitala' },
  facts: [
    { icon: '🏛️', label: { en: "Capital", ro: "Capitala" }, value: { en: "Lima", ro: "Lima" } },
    { icon: '👥', label: { en: "Population", ro: "Populație" }, value: { en: "about 34 million (2024)", ro: "circa 34 de milioane (2024)" } },
    { icon: '📐', label: { en: "Area", ro: "Suprafață" }, value: { en: "1,285,216 km²", ro: "1.285.216 km²" } },
    { icon: '🗺️', label: { en: "Divisions", ro: "Diviziuni" }, value: { en: "24 departments, Lima and Callao", ro: "24 de departamente, Lima și Callao" } },
    { icon: '⛰️', label: { en: "Highest point", ro: "Cel mai înalt punct" }, value: { en: "Huascarán, 6,768 m", ro: "Huascarán, 6.768 m" } },
    { icon: '💵', label: { en: "Currency", ro: "Moneda" }, value: { en: "Sol (PEN)", ro: "Sol (PEN)" } },
    { icon: '🗣️', label: { en: "Languages", ro: "Limbi" }, value: { en: "Spanish, Quechua, Aymara", ro: "Spaniolă, quechua, aymara" } },
    { icon: '📅', label: { en: "Independence", ro: "Independența" }, value: { en: "28 July 1821", ro: "28 iulie 1821" } },
  ],
  neighbours: { en: "Ecuador, Colombia, Brazil, Bolivia and Chile", ro: "Ecuador, Columbia, Brazilia, Bolivia și Chile" },
  questions: [
    { id: "capital", q: { en: "Capital of Peru", ro: "Capitala statului Peru" }, answers: ["Lima"], show: { en: "Lima", ro: "Lima" } },
    { id: "machu-picchu", q: { en: "Inca citadel high in the Andes, rediscovered in 1911", ro: "Cetatea incașă din Anzi, redescoperită în 1911" }, answers: ["Machu Picchu", "Machu Pichu"], show: { en: "Machu Picchu", ro: "Machu Picchu" } },
    { id: "cusco", q: { en: "Old capital of the Inca Empire", ro: "Vechea capitală a Imperiului Inca" }, answers: ["Cusco", "Cuzco", "Qosqo"], show: { en: "Cusco", ro: "Cusco" } },
    { id: "titicaca", q: { en: "Lake on the Bolivian border, the highest navigable in the world", ro: "Lacul de la granița cu Bolivia, cel mai înalt navigabil din lume" }, answers: ["Titicaca", "Lake Titicaca", "Lacul Titicaca"], show: { en: "Lake Titicaca", ro: "Lacul Titicaca" } },
    { id: "sol", q: { en: "Currency", ro: "Moneda" }, answers: ["sol", "nuevo sol", "soles", "PEN"], show: { en: "Sol", ro: "Sol" } },
    { id: "incas", q: { en: "Empire that ruled the Andes before the Spanish came", ro: "Imperiul care a condus Anzii înainte de venirea spaniolilor" }, answers: ["Inca", "Incas", "Inca Empire", "Imperiul Inca", "incaș", "incași", "Tawantinsuyu"], show: { en: "Inca Empire", ro: "Imperiul Inca" } },
    { id: "nazca", q: { en: "Giant figures drawn on the desert floor, best seen from the air", ro: "Figurile uriașe desenate pe deșert, văzute cel mai bine din aer" }, answers: ["Nazca", "Nazca Lines", "Nasca", "Liniile Nazca"], show: { en: "Nazca Lines", ro: "Liniile Nazca" } },
    { id: "iquitos", q: { en: "Biggest city in the world that can't be reached by road", ro: "Cel mai mare oraș din lume la care nu se poate ajunge pe șosea" }, answers: ["Iquitos"], show: { en: "Iquitos", ro: "Iquitos" } },
    { id: "huascaran", q: { en: "Highest peak", ro: "Cel mai înalt vârf" }, answers: ["Huascarán", "Huascaran", "Nevado Huascarán"], show: { en: "Huascarán", ro: "Huascarán" } },
    { id: "pacific", q: { en: "Ocean along its coast", ro: "Oceanul de pe coasta sa" }, answers: ["Pacific", "Pacific Ocean", "Oceanul Pacific", "Pacificul"], show: { en: "Pacific", ro: "Pacific" } },
    { id: "potato", q: { en: "Tuber first grown here, with over 3,000 local varieties", ro: "Tuberculul cultivat prima dată aici, cu peste 3.000 de soiuri locale" }, answers: ["potato", "potatoes", "cartof", "cartofi", "cartoful", "papa"], show: { en: "Potato", ro: "Cartoful" } },
    { id: "ceviche", q: { en: "Dish of raw fish \"cooked\" in lime juice", ro: "Mâncarea de pește crud „gătit” în suc de lămâie verde" }, answers: ["ceviche", "cebiche", "seviche"], show: { en: "Ceviche", ro: "Ceviche" } },
    { id: "quechua", q: { en: "Language of the Incas, still spoken by millions", ro: "Limba incașilor, vorbită încă de milioane de oameni" }, answers: ["Quechua", "Kechua", "Runasimi"], show: { en: "Quechua", ro: "Quechua" } },
    { id: "pizarro", q: { en: "Spanish conquistador who defeated the Incas", ro: "Conchistadorul spaniol care i-a învins pe incași" }, answers: ["Pizarro", "Francisco Pizarro"], show: { en: "Francisco Pizarro", ro: "Francisco Pizarro" } },
    { id: "1821", q: { en: "Year of independence", ro: "Anul independenței" }, answers: ["1821"], show: { en: "1821", ro: "1821" } },
    { id: "colca", q: { en: "One of the deepest canyons on Earth, near Arequipa", ro: "Unul dintre cele mai adânci canioane de pe Pământ, lângă Arequipa" }, answers: ["Colca", "Colca Canyon", "Canionul Colca"], show: { en: "Colca Canyon", ro: "Canionul Colca" } },
    { id: "arequipa", q: { en: "Second-largest city, the \"White City\"", ro: "Al doilea oraș ca mărime, „Orașul Alb”" }, answers: ["Arequipa"], show: { en: "Arequipa", ro: "Arequipa" } },
    { id: "pisco", q: { en: "Grape brandy, its national drink", ro: "Rachiul din struguri, băutura sa națională" }, answers: ["pisco", "pisco sour"], show: { en: "Pisco", ro: "Pisco" } },
    { id: "llama", q: { en: "Andean animal used to carry loads, cousin of the alpaca", ro: "Animalul andin folosit la cărat, văr cu alpaca" }, answers: ["llama", "lama", "llamas"], show: { en: "Llama", ro: "Lama" } },
    { id: "amazon", q: { en: "Great river that starts in the Peruvian Andes", ro: "Marele fluviu care izvorăște din Anzii peruani" }, answers: ["Amazon", "Amazonas", "Amazonul", "Amazon River"], show: { en: "Amazon", ro: "Amazon" } },
  ],
}
