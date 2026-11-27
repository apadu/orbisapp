/**
 * Country page: Ireland (bilingual inline, like romania.js).
 * Facts: population 5.15 million (2022 census, CSO); area 70,273 km²; Carrauntoohil 1,039 m; Irish Free State 6 December 1922.
 */
export const IRELAND_PAGE = {
  id: 'ie',
  flag: '🇮🇪',
  name: {"en": "Ireland", "ro": "Irlanda"},
  tagline: {
    en: "The Emerald Isle: green hills, Atlantic cliffs and 26 counties.",
    ro: "Insula de Smarald: dealuri verzi, faleze la Atlantic și 26 de comitate.",
  },
  mapHint: { en: "Hover or tap a county", ro: "Treci cu mouse-ul sau atinge un comitat" },
  facts: [
    { icon: '🏛️', label: { en: "Capital", ro: "Capitala" }, value: { en: "Dublin", ro: "Dublin" } },
    { icon: '👥', label: { en: "Population", ro: "Populație" }, value: { en: "5.15 million (2022 census)", ro: "5,15 milioane (recensământul din 2022)" } },
    { icon: '📐', label: { en: "Area", ro: "Suprafață" }, value: { en: "70,273 km²", ro: "70.273 km²" } },
    { icon: '🗺️', label: { en: "Divisions", ro: "Diviziuni" }, value: { en: "26 counties", ro: "26 de comitate" } },
    { icon: '⛰️', label: { en: "Highest point", ro: "Cel mai înalt punct" }, value: { en: "Carrauntoohil, 1,039 m", ro: "Carrauntoohil, 1.039 m" } },
    { icon: '💲', label: { en: "Currency", ro: "Moneda" }, value: { en: "Euro", ro: "Euro" } },
    { icon: '🗣️', label: { en: "Languages", ro: "Limbi" }, value: { en: "Irish, English", ro: "Irlandeză, engleză" } },
    { icon: '📅', label: { en: "Independence", ro: "Independența" }, value: { en: "6 December 1922", ro: "6 decembrie 1922" } },
  ],
  neighbours: { en: "United Kingdom (Northern Ireland)", ro: "Regatul Unit (Irlanda de Nord)" },
  questions: [
    { id: "capital", q: { en: "Capital of Ireland", ro: "Capitala Irlandei" }, answers: ["Dublin", "Baile Átha Cliath"], show: { en: "Dublin", ro: "Dublin" } },
    { id: "emerald", q: { en: "Nickname: \"the … Isle\"", ro: "Porecla: „Insula de …”" }, answers: ["Emerald", "Emerald Isle", "Smarald", "Insula de Smarald"], show: { en: "Emerald Isle", ro: "Insula de Smarald" } },
    { id: "shamrock", q: { en: "Three-leaved plant, the national emblem", ro: "Planta cu trei frunze, emblema națională" }, answers: ["shamrock", "clover", "trifoi", "trifoiul"], show: { en: "Shamrock", ro: "Trifoiul" } },
    { id: "patrick", q: { en: "Patron saint celebrated on 17 March", ro: "Sfântul patron sărbătorit pe 17 martie" }, answers: ["Saint Patrick", "St Patrick", "Patrick", "Sfântul Patrick", "Sfantul Patrick"], show: { en: "Saint Patrick", ro: "Sfântul Patrick" } },
    { id: "guinness", q: { en: "Dark stout brewed in Dublin since 1759", ro: "Berea neagră produsă la Dublin din 1759" }, answers: ["Guinness", "stout"], show: { en: "Guinness", ro: "Guinness" } },
    { id: "moher", q: { en: "Atlantic cliffs in County Clare, over 200 m high", ro: "Falezele de la Atlantic din comitatul Clare, de peste 200 m" }, answers: ["Cliffs of Moher", "Moher", "Falezele Moher"], show: { en: "Cliffs of Moher", ro: "Falezele Moher" } },
    { id: "shannon", q: { en: "Longest river in Ireland and the British Isles", ro: "Cel mai lung râu din Irlanda și din Insulele Britanice" }, answers: ["Shannon", "River Shannon", "Râul Shannon"], show: { en: "River Shannon", ro: "Shannon" } },
    { id: "carrauntoohil", q: { en: "Highest mountain, in Kerry", ro: "Cel mai înalt munte, în Kerry" }, answers: ["Carrauntoohil", "Carrantuohill", "Corrán Tuathail"], show: { en: "Carrauntoohil", ro: "Carrauntoohil" } },
    { id: "irish", q: { en: "First official language, also called Gaelic", ro: "Prima limbă oficială, numită și gaelică" }, answers: ["Irish", "Gaelic", "Irish Gaelic", "irlandeză", "irlandeza", "gaelică", "gaelica", "Gaeilge"], show: { en: "Irish (Gaelic)", ro: "Irlandeza (gaelica)" } },
    { id: "harp", q: { en: "Musical instrument on the coins and the coat of arms", ro: "Instrumentul muzical de pe monede și de pe stemă" }, answers: ["harp", "Celtic harp", "harpă", "harpa"], show: { en: "Harp", ro: "Harpa" } },
    { id: "kerry", q: { en: "Scenic drive around the Iveragh Peninsula: the Ring of …", ro: "Drumul panoramic în jurul peninsulei Iveragh: Ring of …" }, answers: ["Kerry", "Ring of Kerry"], show: { en: "Ring of Kerry", ro: "Ring of Kerry" } },
    { id: "newgrange", q: { en: "Passage tomb older than the pyramids, lit at the winter solstice", ro: "Mormântul cu coridor mai vechi decât piramidele, luminat la solstițiul de iarnă" }, answers: ["Newgrange", "Brú na Bóinne", "Bru na Boinne"], show: { en: "Newgrange", ro: "Newgrange" } },
    { id: "kells", q: { en: "Illuminated manuscript of the Gospels kept at Trinity College", ro: "Manuscrisul iluminat al Evangheliilor păstrat la Trinity College" }, answers: ["Book of Kells", "Kells", "Cartea din Kells"], show: { en: "Book of Kells", ro: "Cartea din Kells" } },
    { id: "joyce", q: { en: "Dublin author of \"Ulysses\"", ro: "Scriitorul dublinez al romanului „Ulise”" }, answers: ["James Joyce", "Joyce"], show: { en: "James Joyce", ro: "James Joyce" } },
    { id: "u2", q: { en: "Dublin rock band led by Bono", ro: "Formația rock din Dublin condusă de Bono" }, answers: ["U2"], show: { en: "U2", ro: "U2" } },
    { id: "famine", q: { en: "Disaster of 1845–1852 caused by potato blight", ro: "Dezastrul din 1845–1852 provocat de mana cartofului" }, answers: ["Great Famine", "Famine", "Potato Famine", "Irish Famine", "Marea Foamete", "Foametea", "Marea Foamete irlandeză"], show: { en: "Great Famine", ro: "Marea Foamete" } },
    { id: "hurling", q: { en: "Ancient stick-and-ball sport, played with a hurley", ro: "Sportul străvechi cu crosă și minge, jucat cu un hurley" }, answers: ["hurling", "camogie"], show: { en: "Hurling", ro: "Hurling" } },
    { id: "cork", q: { en: "Second-largest city, in the south", ro: "Al doilea oraș ca mărime, în sud" }, answers: ["Cork", "Corcaigh"], show: { en: "Cork", ro: "Cork" } },
    { id: "galway", q: { en: "West-coast city known for music and oysters", ro: "Orașul de pe coasta de vest cunoscut pentru muzică și stridii" }, answers: ["Galway", "Gaillimh"], show: { en: "Galway", ro: "Galway" } },
    { id: "1922", q: { en: "Year the Irish Free State was founded", ro: "Anul înființării Statului Liber Irlandez" }, answers: ["1922"], show: { en: "1922", ro: "1922" } },
  ],
}
