/**
 * Country page: Greece (bilingual inline, like romania.js).
 * Facts: population 10.4 million (2024, ELSTAT); area 131,957 km²; Mount Olympus (Mytikas) 2,918 m; War of Independence began 25 March 1821.
 */
export const GREECE_PAGE = {
  id: 'gr',
  flag: '🇬🇷',
  name: { en: "Greece", ro: "Grecia" },
  tagline: {
    en: "The Acropolis, Olympus and some 6,000 islands: 13 regions and the monks' republic of Mount Athos.",
    ro: "Acropola, Olimpul și circa 6.000 de insule: 13 regiuni și republica monahală de pe Muntele Athos.",
  },
  mapHint: { en: "Hover or tap a region", ro: "Treci cu mouse-ul sau atinge o regiune" },
  seatLabel: { en: 'capital', ro: 'capitala' },
  facts: [
    { icon: '🏛️', label: { en: "Capital", ro: "Capitala" }, value: { en: "Athens", ro: "Atena" } },
    { icon: '👥', label: { en: "Population", ro: "Populație" }, value: { en: "10.4 million (2024)", ro: "10,4 milioane (2024)" } },
    { icon: '📐', label: { en: "Area", ro: "Suprafață" }, value: { en: "131,957 km²", ro: "131.957 km²" } },
    { icon: '🗺️', label: { en: "Divisions", ro: "Diviziuni" }, value: { en: "13 regions and Mount Athos", ro: "13 regiuni și Muntele Athos" } },
    { icon: '⛰️', label: { en: "Highest point", ro: "Cel mai înalt punct" }, value: { en: "Mount Olympus, 2,918 m", ro: "Muntele Olimp, 2.918 m" } },
    { icon: '💶', label: { en: "Currency", ro: "Moneda" }, value: { en: "Euro (EUR)", ro: "Euro (EUR)" } },
    { icon: '🗣️', label: { en: "Language", ro: "Limba" }, value: { en: "Greek", ro: "Greacă" } },
    { icon: '📅', label: { en: "Independence Day", ro: "Ziua Independenței" }, value: { en: "25 March 1821", ro: "25 martie 1821" } },
  ],
  neighbours: { en: "Albania, North Macedonia, Bulgaria and Turkey", ro: "Albania, Macedonia de Nord, Bulgaria și Turcia" },
  questions: [
    { id: "capital", q: { en: "Capital of Greece", ro: "Capitala Greciei" }, answers: ["Athens", "Atena", "Athina"], show: { en: "Athens", ro: "Atena" } },
    { id: "parthenon", q: { en: "Temple of Athena on the Acropolis", ro: "Templul Atenei de pe Acropole" }, answers: ["Parthenon", "Partenon", "Partenonul"], show: { en: "Parthenon", ro: "Partenonul" } },
    { id: "olympus", q: { en: "Highest mountain, home of the gods", ro: "Cel mai înalt munte, casa zeilor" }, answers: ["Olympus", "Mount Olympus", "Olimp", "Olimpul", "Muntele Olimp"], show: { en: "Mount Olympus", ro: "Muntele Olimp" } },
    { id: "crete", q: { en: "Largest island, home of the Minoans", ro: "Cea mai mare insulă, casa minoicilor" }, answers: ["Crete", "Creta", "Kriti"], show: { en: "Crete", ro: "Creta" } },
    { id: "olympia", q: { en: "Site of the ancient Olympic Games", ro: "Locul Jocurilor Olimpice antice" }, answers: ["Olympia", "Olimpia"], show: { en: "Olympia", ro: "Olympia" } },
    { id: "1896", q: { en: "Year Athens hosted the first modern Olympics", ro: "Anul în care Atena a găzduit primele Olimpiade moderne" }, answers: ["1896"], show: { en: "1896", ro: "1896" } },
    { id: "thessaloniki", q: { en: "Second-largest city", ro: "Al doilea oraș ca mărime" }, answers: ["Thessaloniki", "Salonic", "Salonica", "Saloniki"], show: { en: "Thessaloniki", ro: "Salonic" } },
    { id: "meteora", q: { en: "Monasteries perched on top of rock pillars", ro: "Mănăstirile cocoțate pe stâlpi de stâncă" }, answers: ["Meteora", "Meteore"], show: { en: "Meteora", ro: "Meteora" } },
    { id: "santorini", q: { en: "Volcanic island with white villages on a caldera", ro: "Insula vulcanică cu sate albe pe o calderă" }, answers: ["Santorini", "Thira", "Thera", "Santorin"], show: { en: "Santorini", ro: "Santorini" } },
    { id: "peloponnese", q: { en: "Big peninsula in the south, home of Sparta", ro: "Marea peninsulă din sud, unde era Sparta" }, answers: ["Peloponnese", "Peloponez", "Peloponnesus", "Peloponnisos"], show: { en: "Peloponnese", ro: "Peloponez" } },
    { id: "delphi", q: { en: "Site of the most famous ancient oracle", ro: "Locul celui mai celebru oracol antic" }, answers: ["Delphi", "Delfi", "Delfi"], show: { en: "Delphi", ro: "Delfi" } },
    { id: "corinth", q: { en: "Narrow canal cut through an isthmus in 1893", ro: "Canalul îngust tăiat printr-un istm în 1893" }, answers: ["Corinth", "Corinth Canal", "Canalul Corint", "Corint", "Korinthos"], show: { en: "Corinth Canal", ro: "Canalul Corint" } },
    { id: "aristotle", q: { en: "Philosopher who taught Alexander the Great", ro: "Filozoful care l-a învățat pe Alexandru cel Mare" }, answers: ["Aristotle", "Aristotel", "Aristoteles"], show: { en: "Aristotle", ro: "Aristotel" } },
    { id: "aegean", q: { en: "Sea between Greece and Turkey", ro: "Marea dintre Grecia și Turcia" }, answers: ["Aegean", "Aegean Sea", "Marea Egee", "Egee", "Egeea"], show: { en: "Aegean Sea", ro: "Marea Egee" } },
    { id: "ionian", q: { en: "Sea off the west coast", ro: "Marea de pe coasta de vest" }, answers: ["Ionian", "Ionian Sea", "Marea Ionică", "Marea Ionica"], show: { en: "Ionian Sea", ro: "Marea Ionică" } },
    { id: "homer", q: { en: "Poet of the Iliad and the Odyssey", ro: "Poetul Iliadei și Odiseei" }, answers: ["Homer", "Homer"], show: { en: "Homer", ro: "Homer" } },
    { id: "ithaca", q: { en: "Island home of Odysseus", ro: "Insula lui Odiseu" }, answers: ["Ithaca", "Itaca", "Ithaki"], show: { en: "Ithaca", ro: "Itaca" } },
    { id: "feta", q: { en: "Brined white cheese of sheep's milk", ro: "Brânza albă în saramură, din lapte de oaie" }, answers: ["feta", "brânză feta"], show: { en: "Feta", ro: "Feta" } },
    { id: "athos", q: { en: "Peninsula where only monks live and women can't enter", ro: "Peninsula unde trăiesc doar călugări și femeile nu au voie" }, answers: ["Athos", "Mount Athos", "Muntele Athos", "Agion Oros", "Holy Mountain"], show: { en: "Mount Athos", ro: "Muntele Athos" } },
    { id: "ottoman", q: { en: "Empire it won independence from", ro: "Imperiul de la care și-a câștigat independența" }, answers: ["Ottoman", "Ottoman Empire", "Imperiul Otoman", "otoman", "Turkey", "Turks"], show: { en: "Ottoman Empire", ro: "Imperiul Otoman" } },
  ],
}
