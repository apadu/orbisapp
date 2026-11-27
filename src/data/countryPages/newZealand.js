/**
 * Country page: New Zealand (bilingual inline, like romania.js).
 * Facts: population 5.3 million (2025, Stats NZ); area 268,021 km²; Aoraki / Mount Cook 3,724 m; Treaty of Waitangi 6 February 1840.
 */
export const NEW_ZEALAND_PAGE = {
  id: 'nz',
  flag: '🇳🇿',
  name: {"en": "New Zealand", "ro": "Noua Zeelandă"},
  tagline: {
    en: "Two main islands, fjords, volcanoes and Māori culture: 16 regions at the far end of the Pacific.",
    ro: "Două insule mari, fiorduri, vulcani și cultura maori: 16 regiuni la capătul Pacificului.",
  },
  mapHint: { en: "Hover or tap a region", ro: "Treci cu mouse-ul sau atinge o regiune" },
  facts: [
    { icon: '🏛️', label: { en: "Capital", ro: "Capitala" }, value: { en: "Wellington", ro: "Wellington" } },
    { icon: '👥', label: { en: "Population", ro: "Populație" }, value: { en: "5.3 million (2025)", ro: "5,3 milioane (2025)" } },
    { icon: '📐', label: { en: "Area", ro: "Suprafață" }, value: { en: "268,021 km²", ro: "268.021 km²" } },
    { icon: '🗺️', label: { en: "Divisions", ro: "Diviziuni" }, value: { en: "16 regions", ro: "16 regiuni" } },
    { icon: '⛰️', label: { en: "Highest point", ro: "Cel mai înalt punct" }, value: { en: "Aoraki / Mount Cook, 3,724 m", ro: "Aoraki / Muntele Cook, 3.724 m" } },
    { icon: '💲', label: { en: "Currency", ro: "Moneda" }, value: { en: "New Zealand dollar (NZD)", ro: "Dolarul neozeelandez (NZD)" } },
    { icon: '🗣️', label: { en: "Languages", ro: "Limbi" }, value: { en: "English, Māori, NZ Sign Language", ro: "Engleză, maori, limbajul semnelor NZ" } },
    { icon: '📅', label: { en: "Founding treaty", ro: "Tratatul fondator" }, value: { en: "Waitangi, 6 February 1840", ro: "Waitangi, 6 februarie 1840" } },
  ],
  neighbours: { en: "none by land (Australia is about 2,000 km west)", ro: "niciunul pe uscat (Australia e la circa 2.000 km vest)" },
  questions: [
    { id: "capital", q: { en: "Capital of New Zealand", ro: "Capitala Noii Zeelande" }, answers: ["Wellington"], show: { en: "Wellington", ro: "Wellington" } },
    { id: "auckland", q: { en: "Largest city", ro: "Cel mai mare oraș" }, answers: ["Auckland"], show: { en: "Auckland", ro: "Auckland" } },
    { id: "maori", q: { en: "Indigenous Polynesian people", ro: "Poporul polinezian indigen" }, answers: ["Māori", "Maori", "Maorii", "maori"], show: { en: "Māori", ro: "Maori" } },
    { id: "waitangi", q: { en: "Treaty signed in 1840 between the British Crown and Māori chiefs", ro: "Tratatul semnat în 1840 între Coroana britanică și căpeteniile maori" }, answers: ["Waitangi", "Treaty of Waitangi", "Tratatul de la Waitangi"], show: { en: "Treaty of Waitangi", ro: "Tratatul de la Waitangi" } },
    { id: "aoraki", q: { en: "Highest mountain", ro: "Cel mai înalt munte" }, answers: ["Aoraki", "Mount Cook", "Aoraki / Mount Cook", "Cook", "Muntele Cook", "Aoraki Mount Cook"], show: { en: "Aoraki / Mount Cook", ro: "Aoraki / Muntele Cook" } },
    { id: "kiwi", q: { en: "Flightless national bird", ro: "Pasărea națională care nu zboară" }, answers: ["kiwi"], show: { en: "Kiwi", ro: "Kiwi" } },
    { id: "allblacks", q: { en: "National rugby team known for the haka", ro: "Echipa națională de rugby cunoscută pentru haka" }, answers: ["All Blacks", "All Black"], show: { en: "All Blacks", ro: "All Blacks" } },
    { id: "hillary", q: { en: "New Zealander who first climbed Everest with Tenzing Norgay", ro: "Neozeelandezul care a urcat primul pe Everest, cu Tenzing Norgay" }, answers: ["Edmund Hillary", "Hillary", "Sir Edmund Hillary"], show: { en: "Edmund Hillary", ro: "Edmund Hillary" } },
    { id: "cookstrait", q: { en: "Strait between the North and South Islands", ro: "Strâmtoarea dintre Insula de Nord și Insula de Sud" }, answers: ["Cook Strait", "Cook", "Strâmtoarea Cook", "Stramtoarea Cook"], show: { en: "Cook Strait", ro: "Strâmtoarea Cook" } },
    { id: "lotr", q: { en: "Film trilogy shot across the country (2001–2003)", ro: "Trilogia filmată în toată țara (2001–2003)" }, answers: ["The Lord of the Rings", "Lord of the Rings", "LOTR", "Stăpânul Inelelor", "Stapanul Inelelor"], show: { en: "The Lord of the Rings", ro: "Stăpânul Inelelor" } },
    { id: "1893", q: { en: "Year it became the first country where women could vote", ro: "Anul în care a devenit prima țară în care femeile puteau vota" }, answers: ["1893"], show: { en: "1893", ro: "1893" } },
    { id: "milford", q: { en: "Famous fjord in Fiordland", ro: "Fiordul celebru din Fiordland" }, answers: ["Milford Sound", "Milford", "Piopiotahi"], show: { en: "Milford Sound", ro: "Milford Sound" } },
    { id: "rotorua", q: { en: "Geothermal city of geysers and Māori culture", ro: "Orașul geotermal al gheizerelor și al culturii maori" }, answers: ["Rotorua"], show: { en: "Rotorua", ro: "Rotorua" } },
    { id: "taupo", q: { en: "Largest lake, in a volcanic caldera", ro: "Cel mai mare lac, într-o calderă vulcanică" }, answers: ["Taupō", "Taupo", "Lake Taupō", "Lake Taupo", "Lacul Taupo"], show: { en: "Lake Taupō", ro: "Lacul Taupō" } },
    { id: "tasman", q: { en: "Dutch explorer who reached it in 1642", ro: "Exploratorul olandez care a ajuns aici în 1642" }, answers: ["Abel Tasman", "Tasman"], show: { en: "Abel Tasman", ro: "Abel Tasman" } },
    { id: "tasmansea", q: { en: "Sea between New Zealand and Australia", ro: "Marea dintre Noua Zeelandă și Australia" }, answers: ["Tasman Sea", "Tasman", "Marea Tasman", "Marea Tasmaniei"], show: { en: "Tasman Sea", ro: "Marea Tasman" } },
    { id: "christchurch", q: { en: "South Island city hit by the 2011 earthquake", ro: "Orașul de pe Insula de Sud lovit de cutremurul din 2011" }, answers: ["Christchurch"], show: { en: "Christchurch", ro: "Christchurch" } },
    { id: "rutherford", q: { en: "Physicist born here, father of nuclear physics", ro: "Fizicianul născut aici, părintele fizicii nucleare" }, answers: ["Ernest Rutherford", "Rutherford"], show: { en: "Ernest Rutherford", ro: "Ernest Rutherford" } },
    { id: "aotearoa", q: { en: "Māori name of the country", ro: "Numele maori al țării" }, answers: ["Aotearoa"], show: { en: "Aotearoa", ro: "Aotearoa" } },
    { id: "stewart", q: { en: "Third-largest island, south of the South Island", ro: "A treia insulă ca mărime, la sud de Insula de Sud" }, answers: ["Stewart Island", "Stewart", "Rakiura", "Insula Stewart"], show: { en: "Stewart Island (Rakiura)", ro: "Insula Stewart (Rakiura)" } },
  ],
}
