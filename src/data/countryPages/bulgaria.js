/**
 * Country page: Bulgaria (bilingual inline, like romania.js).
 * Facts: population 6.52 million (2021 census, NSI); area 110,994 km²; Musala 2,925 m; euro since 1 January 2026; independence 22 September 1908.
 */
export const BULGARIA_PAGE = {
  id: 'bg',
  flag: '🇧🇬',
  name: {"en": "Bulgaria", "ro": "Bulgaria"},
  tagline: {
    en: "Romania's southern neighbour across the Danube: Black Sea beaches, mountain monasteries and 28 provinces.",
    ro: "Vecina de la sud a României, peste Dunăre: plaje la Marea Neagră, mănăstiri în munți și 28 de regiuni.",
  },
  mapHint: { en: "Hover or tap a province", ro: "Treci cu mouse-ul sau atinge o regiune" },
  facts: [
    { icon: '🏛️', label: { en: "Capital", ro: "Capitala" }, value: { en: "Sofia", ro: "Sofia" } },
    { icon: '👥', label: { en: "Population", ro: "Populație" }, value: { en: "6.5 million (2021 census)", ro: "6,5 milioane (recensământul din 2021)" } },
    { icon: '📐', label: { en: "Area", ro: "Suprafață" }, value: { en: "110,994 km²", ro: "110.994 km²" } },
    { icon: '🗺️', label: { en: "Divisions", ro: "Diviziuni" }, value: { en: "28 provinces", ro: "28 de regiuni" } },
    { icon: '⛰️', label: { en: "Highest point", ro: "Cel mai înalt punct" }, value: { en: "Musala, 2,925 m", ro: "Musala, 2.925 m" } },
    { icon: '💲', label: { en: "Currency", ro: "Moneda" }, value: { en: "Euro (since 2026; before: lev)", ro: "Euro (din 2026; înainte: leva)" } },
    { icon: '🗣️', label: { en: "Language", ro: "Limba" }, value: { en: "Bulgarian", ro: "Bulgară" } },
    { icon: '📅', label: { en: "Independence", ro: "Independența" }, value: { en: "22 September 1908", ro: "22 septembrie 1908" } },
  ],
  neighbours: { en: "Romania, Serbia, North Macedonia, Greece, Turkey", ro: "România, Serbia, Macedonia de Nord, Grecia, Turcia" },
  questions: [
    { id: "capital", q: { en: "Capital of Bulgaria", ro: "Capitala Bulgariei" }, answers: ["Sofia", "Sofiya"], show: { en: "Sofia", ro: "Sofia" } },
    { id: "danube", q: { en: "River on the border with Romania", ro: "Fluviul de la granița cu România" }, answers: ["Danube", "Dunărea", "Dunarea", "Dunăre", "Dunare"], show: { en: "Danube", ro: "Dunărea" } },
    { id: "blacksea", q: { en: "Sea on its east coast", ro: "Marea de pe coasta de est" }, answers: ["Black Sea", "Marea Neagră", "Marea Neagra"], show: { en: "Black Sea", ro: "Marea Neagră" } },
    { id: "plovdiv", q: { en: "Second city, one of Europe's oldest continuously inhabited", ro: "Al doilea oraș, unul dintre cele mai vechi locuite continuu din Europa" }, answers: ["Plovdiv", "Philippopolis", "Filipopol"], show: { en: "Plovdiv", ro: "Plovdiv" } },
    { id: "rila", q: { en: "Famous monastery in the mountains south of Sofia (UNESCO)", ro: "Celebra mănăstire din munții de la sud de Sofia (UNESCO)" }, answers: ["Rila", "Rila Monastery", "Mănăstirea Rila", "Manastirea Rila"], show: { en: "Rila Monastery", ro: "Mănăstirea Rila" } },
    { id: "musala", q: { en: "Highest peak of the Balkans", ro: "Cel mai înalt vârf din Balcani" }, answers: ["Musala", "Vârful Musala", "Varful Musala", "Mount Musala"], show: { en: "Musala", ro: "Musala" } },
    { id: "rose", q: { en: "Flower grown in the Kazanlak valley for its oil", ro: "Floarea cultivată în valea Kazanlak pentru ulei" }, answers: ["rose", "roses", "trandafir", "trandafiri", "oil-bearing rose", "Damask rose"], show: { en: "Rose", ro: "Trandafirul" } },
    { id: "cyrillic", q: { en: "Alphabet developed in the First Bulgarian Empire", ro: "Alfabetul dezvoltat în Primul Țarat Bulgar" }, answers: ["Cyrillic", "chirilic", "chirilică", "chirilica", "alfabetul chirilic"], show: { en: "Cyrillic", ro: "Chirilic" } },
    { id: "euro", q: { en: "Currency since 1 January 2026", ro: "Moneda din 1 ianuarie 2026" }, answers: ["euro", "EUR", "€"], show: { en: "Euro", ro: "Euro" } },
    { id: "lev", q: { en: "Currency it replaced", ro: "Moneda pe care a înlocuit-o" }, answers: ["lev", "leva", "lev bulgar", "BGN"], show: { en: "Lev", ro: "Leva" } },
    { id: "yogurt", q: { en: "Food whose bacteria is named Lactobacillus bulgaricus", ro: "Alimentul a cărui bacterie se numește Lactobacillus bulgaricus" }, answers: ["yogurt", "yoghurt", "iaurt", "kiselo mlyako"], show: { en: "Yogurt", ro: "Iaurtul" } },
    { id: "varna", q: { en: "Largest city on the coast", ro: "Cel mai mare oraș de pe litoral" }, answers: ["Varna"], show: { en: "Varna", ro: "Varna" } },
    { id: "balkan", q: { en: "Mountains crossing the country west to east, Stara Planina", ro: "Munții care traversează țara de la vest la est, Stara Planina" }, answers: ["Balkan Mountains", "Balkans", "Stara Planina", "Munții Balcani", "Muntii Balcani", "Balcani"], show: { en: "Balkan Mountains", ro: "Munții Balcani" } },
    { id: "stoichkov", q: { en: "Striker, 1994 Ballon d'Or winner", ro: "Atacantul câștigător al Balonului de Aur în 1994" }, answers: ["Hristo Stoichkov", "Stoichkov", "Hristo Stoicikov", "Stoicikov", "Stoichkov Hristo"], show: { en: "Hristo Stoichkov", ro: "Hristo Stoichkov" } },
    { id: "sevenlakes", q: { en: "Group of glacial lakes in the Rila mountains", ro: "Grupul de lacuri glaciare din munții Rila" }, answers: ["Seven Rila Lakes", "Seven Lakes", "Rila Lakes", "Cele Șapte Lacuri", "Cele Sapte Lacuri", "Șapte Lacuri", "Sapte Lacuri"], show: { en: "Seven Rila Lakes", ro: "Cele Șapte Lacuri din Rila" } },
    { id: "shopska", q: { en: "Salad of tomatoes, cucumbers and grated white cheese", ro: "Salata din roșii, castraveți și brânză albă rasă" }, answers: ["Shopska", "Shopska salad", "salata Shopska", "salată șopska", "sopska", "șopska"], show: { en: "Shopska salad", ro: "Salata șopska" } },
    { id: "martenitsa", q: { en: "Red-and-white thread worn from 1 March (like the Romanian mărțișor)", ro: "Șnurul roșu-alb purtat din 1 martie (ca mărțișorul)" }, answers: ["martenitsa", "martenitsi", "mărțișor", "martisor", "martenița", "martenita"], show: { en: "Martenitsa", ro: "Martenița" } },
    { id: "tarnovo", q: { en: "Medieval capital of the Second Bulgarian Empire", ro: "Capitala medievală a celui de-al Doilea Țarat Bulgar" }, answers: ["Veliko Tarnovo", "Tarnovo", "Veliko Târnovo", "Târnovo", "Tărnovo", "Turnovo"], show: { en: "Veliko Tarnovo", ro: "Veliko Târnovo" } },
    { id: "nod", q: { en: "A nod of the head here usually means…", ro: "Aici, o mișcare a capului de sus în jos înseamnă de obicei…" }, answers: ["no", "nu"], show: { en: "No", ro: "Nu" } },
    { id: "2007", q: { en: "Year it joined the EU, together with Romania", ro: "Anul aderării la UE, împreună cu România" }, answers: ["2007"], show: { en: "2007", ro: "2007" } },
  ],
}
