/**
 * Country page: Colombia (bilingual inline, like romania.js).
 * Facts: population about 52 million (2024, DANE projection); area 1,141,748 km²; Pico Cristóbal Colón about 5,730 m; independence declared 20 July 1810.
 */
export const COLOMBIA_PAGE = {
  id: 'co',
  flag: '🇨🇴',
  name: { en: "Colombia", ro: "Columbia" },
  tagline: {
    en: "Coffee, emeralds and two coasts: 32 departments and Bogotá, from the Caribbean to the Amazon.",
    ro: "Cafea, smaralde și două coaste: 32 de departamente și Bogotá, de la Caraibe la Amazon.",
  },
  mapHint: { en: "Hover or tap a department", ro: "Treci cu mouse-ul sau atinge un departament" },
  seatLabel: { en: 'capital', ro: 'capitala' },
  facts: [
    { icon: '🏛️', label: { en: "Capital", ro: "Capitala" }, value: { en: "Bogotá", ro: "Bogotá" } },
    { icon: '👥', label: { en: "Population", ro: "Populație" }, value: { en: "about 52 million (2024)", ro: "circa 52 de milioane (2024)" } },
    { icon: '📐', label: { en: "Area", ro: "Suprafață" }, value: { en: "1,141,748 km²", ro: "1.141.748 km²" } },
    { icon: '🗺️', label: { en: "Divisions", ro: "Diviziuni" }, value: { en: "32 departments and Bogotá", ro: "32 de departamente și Bogotá" } },
    { icon: '⛰️', label: { en: "Highest point", ro: "Cel mai înalt punct" }, value: { en: "Pico Cristóbal Colón, about 5,730 m", ro: "Pico Cristóbal Colón, circa 5.730 m" } },
    { icon: '💵', label: { en: "Currency", ro: "Moneda" }, value: { en: "Colombian peso (COP)", ro: "Pesoul columbian (COP)" } },
    { icon: '🗣️', label: { en: "Language", ro: "Limba" }, value: { en: "Spanish", ro: "Spaniolă" } },
    { icon: '📅', label: { en: "Independence", ro: "Independența" }, value: { en: "20 July 1810", ro: "20 iulie 1810" } },
  ],
  neighbours: { en: "Panama, Venezuela, Brazil, Peru and Ecuador", ro: "Panama, Venezuela, Brazilia, Peru și Ecuador" },
  questions: [
    { id: "capital", q: { en: "Capital of Colombia", ro: "Capitala Columbiei" }, answers: ["Bogotá", "Bogota", "Santa Fe de Bogotá"], show: { en: "Bogotá", ro: "Bogotá" } },
    { id: "medellin", q: { en: "Second-largest city, the \"City of Eternal Spring\"", ro: "Al doilea oraș ca mărime, „Orașul primăverii eterne”" }, answers: ["Medellín", "Medellin"], show: { en: "Medellín", ro: "Medellín" } },
    { id: "cartagena", q: { en: "Walled colonial port on the Caribbean", ro: "Portul colonial cu ziduri de la Caraibe" }, answers: ["Cartagena", "Cartagena de Indias"], show: { en: "Cartagena", ro: "Cartagena" } },
    { id: "marquez", q: { en: "Nobel-winning author from Aracataca", ro: "Scriitorul laureat Nobel din Aracataca" }, answers: ["García Márquez", "Gabriel García Márquez", "Garcia Marquez", "Gabo", "Marquez"], show: { en: "Gabriel García Márquez", ro: "Gabriel García Márquez" } },
    { id: "solitude", q: { en: "His most famous novel: \"One Hundred Years of …\"", ro: "Cel mai cunoscut roman al său: „Un veac de …”" }, answers: ["Solitude", "singurătate", "One Hundred Years of Solitude", "Un veac de singurătate", "soledad"], show: { en: "Solitude", ro: "Singurătate" } },
    { id: "coffee", q: { en: "Crop grown in its \"Coffee Axis\"", ro: "Planta cultivată în „Axa Cafelei”" }, answers: ["coffee", "cafea", "café", "cafe"], show: { en: "Coffee", ro: "Cafea" } },
    { id: "emerald", q: { en: "Green gemstone it produces more of than any other country", ro: "Piatra prețioasă verde pe care o produce mai mult decât orice altă țară" }, answers: ["emerald", "emeralds", "smarald", "smaralde", "esmeralda"], show: { en: "Emerald", ro: "Smarald" } },
    { id: "peso", q: { en: "Currency", ro: "Moneda" }, answers: ["peso", "Colombian peso", "pesoul columbian", "COP"], show: { en: "Peso", ro: "Peso" } },
    { id: "caribbean", q: { en: "Sea on its northern coast", ro: "Marea de pe coasta de nord" }, answers: ["Caribbean", "Caribbean Sea", "Marea Caraibelor", "Caraibe", "Marea Caraibilor"], show: { en: "Caribbean Sea", ro: "Marea Caraibelor" } },
    { id: "bolivar", q: { en: "\"The Liberator\" who led its fight for independence", ro: "„Eliberatorul” care a condus lupta pentru independență" }, answers: ["Bolívar", "Bolivar", "Simón Bolívar", "Simon Bolivar"], show: { en: "Simón Bolívar", ro: "Simón Bolívar" } },
    { id: "shakira", q: { en: "Singer from Barranquilla behind \"Hips Don't Lie\"", ro: "Cântăreața din Barranquilla din spatele „Hips Don't Lie”" }, answers: ["Shakira"], show: { en: "Shakira", ro: "Shakira" } },
    { id: "magdalena", q: { en: "Main river, flowing north to the Caribbean", ro: "Râul principal, care curge spre nord, în Caraibe" }, answers: ["Magdalena", "Río Magdalena", "Magdalena River", "râul Magdalena"], show: { en: "Magdalena", ro: "Magdalena" } },
    { id: "cali", q: { en: "City known as the world capital of salsa", ro: "Orașul numit capitala mondială a salsei" }, answers: ["Cali", "Santiago de Cali"], show: { en: "Cali", ro: "Cali" } },
    { id: "ciudad-perdida", q: { en: "Ancient city in the jungle, older than Machu Picchu", ro: "Orașul antic din junglă, mai vechi decât Machu Picchu" }, answers: ["Ciudad Perdida", "Lost City", "Orașul Pierdut", "Teyuna", "Buritaca"], show: { en: "Ciudad Perdida (Lost City)", ro: "Ciudad Perdida (Orașul Pierdut)" } },
    { id: "panama", q: { en: "Country that broke away from it in 1903", ro: "Țara care s-a desprins din ea în 1903" }, answers: ["Panama", "Panamá"], show: { en: "Panama", ro: "Panama" } },
    { id: "zipaquira", q: { en: "Town with a cathedral built inside a salt mine", ro: "Orașul cu o catedrală construită într-o salină" }, answers: ["Zipaquirá", "Zipaquira"], show: { en: "Zipaquirá", ro: "Zipaquirá" } },
    { id: "cumbia", q: { en: "Folk dance and music from the Caribbean coast", ro: "Dansul și muzica populară de pe coasta Caraibelor" }, answers: ["cumbia", "cumbiă"], show: { en: "Cumbia", ro: "Cumbia" } },
    { id: "el-dorado", q: { en: "Legend of a golden king, born near Bogotá", ro: "Legenda unui rege de aur, născută lângă Bogotá" }, answers: ["El Dorado", "Eldorado"], show: { en: "El Dorado", ro: "El Dorado" } },
    { id: "pacific", q: { en: "The other ocean on its coast", ro: "Celălalt ocean de pe coasta sa" }, answers: ["Pacific", "Pacific Ocean", "Oceanul Pacific", "Pacificul"], show: { en: "Pacific", ro: "Pacific" } },
    { id: "departments", q: { en: "How many departments?", ro: "Câte departamente are?" }, answers: ["32", "thirty-two", "treizeci și două", "treizeci și doi"], show: { en: "32", ro: "32" } },
  ],
}
