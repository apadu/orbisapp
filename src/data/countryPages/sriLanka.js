/**
 * Country page: Sri Lanka (bilingual inline, like romania.js).
 * Facts: population about 21.8 million (2024 census, DCS); area 65,610 km²; Pidurutalagala 2,524 m; independence 4 February 1948.
 */
export const SRI_LANKA_PAGE = {
  id: 'lk',
  flag: '🇱🇰',
  name: {"en": "Sri Lanka", "ro": "Sri Lanka"},
  tagline: {
    en: "The teardrop island off India: tea hills, ancient cities and 9 provinces.",
    ro: "Insula în formă de lacrimă de lângă India: dealuri cu ceai, orașe antice și 9 provincii.",
  },
  mapHint: { en: "Hover or tap a province", ro: "Treci cu mouse-ul sau atinge o provincie" },
  facts: [
    { icon: '🏛️', label: { en: "Capital", ro: "Capitala" }, value: { en: "Sri Jayawardenepura Kotte (Colombo: largest city)", ro: "Sri Jayawardenepura Kotte (Colombo: cel mai mare oraș)" } },
    { icon: '👥', label: { en: "Population", ro: "Populație" }, value: { en: "about 21.8 million (2024 census)", ro: "circa 21,8 milioane (recensământul din 2024)" } },
    { icon: '📐', label: { en: "Area", ro: "Suprafață" }, value: { en: "65,610 km²", ro: "65.610 km²" } },
    { icon: '🗺️', label: { en: "Divisions", ro: "Diviziuni" }, value: { en: "9 provinces", ro: "9 provincii" } },
    { icon: '⛰️', label: { en: "Highest point", ro: "Cel mai înalt punct" }, value: { en: "Pidurutalagala, 2,524 m", ro: "Pidurutalagala, 2.524 m" } },
    { icon: '💲', label: { en: "Currency", ro: "Moneda" }, value: { en: "Sri Lankan rupee (LKR)", ro: "Rupia srilankeză (LKR)" } },
    { icon: '🗣️', label: { en: "Languages", ro: "Limbi" }, value: { en: "Sinhala, Tamil", ro: "Singaleză, tamilă" } },
    { icon: '📅', label: { en: "Independence", ro: "Independența" }, value: { en: "4 February 1948", ro: "4 februarie 1948" } },
  ],
  neighbours: { en: "India and the Maldives, across the sea", ro: "India și Maldive, peste mare" },
  questions: [
    { id: "colombo", q: { en: "Largest city and commercial capital", ro: "Cel mai mare oraș și capitala comercială" }, answers: ["Colombo"], show: { en: "Colombo", ro: "Colombo" } },
    { id: "kotte", q: { en: "Official capital, seat of parliament", ro: "Capitala oficială, sediul parlamentului" }, answers: ["Sri Jayawardenepura Kotte", "Kotte", "Sri Jayawardenapura Kotte", "Jayawardenepura"], show: { en: "Sri Jayawardenepura Kotte", ro: "Sri Jayawardenepura Kotte" } },
    { id: "ceylon", q: { en: "Name of the country until 1972", ro: "Numele țării până în 1972" }, answers: ["Ceylon", "Ceilon", "Ceylan"], show: { en: "Ceylon", ro: "Ceylon" } },
    { id: "tea", q: { en: "Drink it is famous for, grown in the hill country", ro: "Băutura pentru care e celebră, cultivată în zona deluroasă" }, answers: ["tea", "ceai", "Ceylon tea", "ceai de Ceylon"], show: { en: "Tea", ro: "Ceaiul" } },
    { id: "sigiriya", q: { en: "Rock fortress with a lion gate and frescoes", ro: "Fortăreața de pe stâncă, cu poarta leului și fresce" }, answers: ["Sigiriya", "Lion Rock", "Sigiri"], show: { en: "Sigiriya", ro: "Sigiriya" } },
    { id: "kandy", q: { en: "Hill city of the Temple of the Tooth", ro: "Orașul de deal al Templului Dintelui" }, answers: ["Kandy", "Mahanuwara"], show: { en: "Kandy", ro: "Kandy" } },
    { id: "adams", q: { en: "Sacred mountain with a \"footprint\" at the top", ro: "Muntele sacru cu o „urmă de picior” în vârf" }, answers: ["Adam's Peak", "Adams Peak", "Sri Pada", "Sri Paada", "Vârful lui Adam", "Varful lui Adam"], show: { en: "Adam's Peak (Sri Pada)", ro: "Vârful lui Adam (Sri Pada)" } },
    { id: "sinhala", q: { en: "Language of the majority", ro: "Limba majorității" }, answers: ["Sinhala", "Sinhalese", "singaleză", "singaleza"], show: { en: "Sinhala", ro: "Singaleza" } },
    { id: "tamil", q: { en: "Second official language, also spoken in southern India", ro: "A doua limbă oficială, vorbită și în sudul Indiei" }, answers: ["Tamil", "tamilă", "tamila"], show: { en: "Tamil", ro: "Tamila" } },
    { id: "rupee", q: { en: "Currency", ro: "Moneda" }, answers: ["rupee", "Sri Lankan rupee", "rupie", "rupia", "LKR"], show: { en: "Rupee", ro: "Rupia" } },
    { id: "palk", q: { en: "Strait between the island and India", ro: "Strâmtoarea dintre insulă și India" }, answers: ["Palk Strait", "Palk", "Strâmtoarea Palk"], show: { en: "Palk Strait", ro: "Strâmtoarea Palk" } },
    { id: "galle", q: { en: "Southern port with a fort built by the Dutch (UNESCO)", ro: "Portul din sud cu un fort construit de olandezi (UNESCO)" }, answers: ["Galle"], show: { en: "Galle", ro: "Galle" } },
    { id: "sirimavo", q: { en: "In 1960 she became the world's first woman prime minister", ro: "În 1960 a devenit prima femeie prim-ministru din lume" }, answers: ["Sirimavo Bandaranaike", "Bandaranaike", "Sirimavo"], show: { en: "Sirimavo Bandaranaike", ro: "Sirimavo Bandaranaike" } },
    { id: "cricket", q: { en: "Sport whose World Cup it won in 1996", ro: "Sportul la care a câștigat Cupa Mondială în 1996" }, answers: ["cricket", "crichet"], show: { en: "Cricket", ro: "Crichet" } },
    { id: "yala", q: { en: "National park with one of the densest leopard populations", ro: "Parcul național cu una dintre cele mai dense populații de leoparzi" }, answers: ["Yala", "Yala National Park"], show: { en: "Yala", ro: "Yala" } },
    { id: "anuradhapura", q: { en: "First ancient capital, with giant stupas", ro: "Prima capitală antică, cu stupe uriașe" }, answers: ["Anuradhapura"], show: { en: "Anuradhapura", ro: "Anuradhapura" } },
    { id: "cinnamon", q: { en: "Spice native to the island", ro: "Mirodenia originară de pe insulă" }, answers: ["cinnamon", "scorțișoară", "scortisoara"], show: { en: "Cinnamon", ro: "Scorțișoara" } },
    { id: "pidurutalagala", q: { en: "Highest mountain", ro: "Cel mai înalt munte" }, answers: ["Pidurutalagala", "Mount Pedro"], show: { en: "Pidurutalagala", ro: "Pidurutalagala" } },
    { id: "elephant", q: { en: "Animal of the Pinnawala orphanage", ro: "Animalul de la orfelinatul din Pinnawala" }, answers: ["elephant", "elephants", "elefant", "elefanți", "elefanti", "Asian elephant"], show: { en: "Elephant", ro: "Elefantul" } },
    { id: "1948", q: { en: "Year of independence", ro: "Anul independenței" }, answers: ["1948"], show: { en: "1948", ro: "1948" } },
  ],
}
