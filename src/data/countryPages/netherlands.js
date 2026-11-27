/**
 * Country page: Netherlands (bilingual inline, like romania.js).
 * Facts: population 18.0 million (1 Jan 2025, CBS); area 41,850 km²; Vaalserberg 322 m (European part); independence recognised in the Peace of Münster, 1648.
 */
export const NETHERLANDS_PAGE = {
  id: 'nl',
  flag: '🇳🇱',
  name: {"en": "Netherlands", "ro": "Țările de Jos"},
  tagline: {
    en: "Tulips, windmills and land won from the sea: 12 provinces, a quarter of them below sea level.",
    ro: "Lalele, mori de vânt și pământ smuls mării: 12 provincii, din care o bună parte sub nivelul mării.",
  },
  mapHint: { en: "Hover or tap a province", ro: "Treci cu mouse-ul sau atinge o provincie" },
  facts: [
    { icon: '🏛️', label: { en: "Capital", ro: "Capitala" }, value: { en: "Amsterdam (government in The Hague)", ro: "Amsterdam (guvernul la Haga)" } },
    { icon: '👥', label: { en: "Population", ro: "Populație" }, value: { en: "18.0 million (2025)", ro: "18,0 milioane (2025)" } },
    { icon: '📐', label: { en: "Area", ro: "Suprafață" }, value: { en: "41,850 km²", ro: "41.850 km²" } },
    { icon: '🗺️', label: { en: "Divisions", ro: "Diviziuni" }, value: { en: "12 provinces", ro: "12 provincii" } },
    { icon: '⛰️', label: { en: "Highest point", ro: "Cel mai înalt punct" }, value: { en: "Vaalserberg, 322 m", ro: "Vaalserberg, 322 m" } },
    { icon: '💶', label: { en: "Currency", ro: "Moneda" }, value: { en: "Euro (EUR)", ro: "Euro (EUR)" } },
    { icon: '🗣️', label: { en: "Languages", ro: "Limbi" }, value: { en: "Dutch (and Frisian in Friesland)", ro: "Neerlandeză (și frizona în Frizia)" } },
    { icon: '📅', label: { en: "Independence", ro: "Independența" }, value: { en: "Recognised in 1648 (Peace of Münster)", ro: "Recunoscută în 1648 (Pacea de la Münster)" } },
  ],
  neighbours: { en: "Germany, Belgium", ro: "Germania, Belgia" },
  questions: [
    { id: "capital", q: { en: "Capital of the Netherlands", ro: "Capitala Țărilor de Jos" }, answers: ["Amsterdam"], show: { en: "Amsterdam", ro: "Amsterdam" } },
    { id: "hague", q: { en: "City of the government and parliament", ro: "Orașul guvernului și al parlamentului" }, answers: ["The Hague", "Hague", "Den Haag", "Haga", "'s-Gravenhage"], show: { en: "The Hague", ro: "Haga" } },
    { id: "rotterdam", q: { en: "Largest seaport in Europe", ro: "Cel mai mare port maritim din Europa" }, answers: ["Rotterdam"], show: { en: "Rotterdam", ro: "Rotterdam" } },
    { id: "rembrandt", q: { en: "Painter of The Night Watch", ro: "Pictorul „Rondului de noapte”" }, answers: ["Rembrandt", "Rembrandt van Rijn"], show: { en: "Rembrandt", ro: "Rembrandt" } },
    { id: "vangogh", q: { en: "Painter of The Starry Night and Sunflowers", ro: "Pictorul „Nopții înstelate” și al „Florilor-soarelui”" }, answers: ["Van Gogh", "Vincent van Gogh", "Vincent"], show: { en: "Vincent van Gogh", ro: "Vincent van Gogh" } },
    { id: "vermeer", q: { en: "Painter of Girl with a Pearl Earring", ro: "Pictorul „Fetei cu cercel de perlă”" }, answers: ["Vermeer", "Johannes Vermeer", "Jan Vermeer"], show: { en: "Johannes Vermeer", ro: "Johannes Vermeer" } },
    { id: "annefrank", q: { en: "Teenage diarist who hid in Amsterdam during WWII", ro: "Adolescenta care și-a scris jurnalul ascunsă în Amsterdam în al Doilea Război Mondial" }, answers: ["Anne Frank", "Anne", "Frank"], show: { en: "Anne Frank", ro: "Anne Frank" } },
    { id: "tulip", q: { en: "Flower whose bulbs caused a price mania in the 1630s", ro: "Floarea ale cărei bulbi au provocat o manie a prețurilor în anii 1630" }, answers: ["tulip", "tulips", "lalea", "lalele", "tulp"], show: { en: "Tulip", ro: "Laleaua" } },
    { id: "orange", q: { en: "Royal house whose colour the fans wear", ro: "Casa regală a cărei culoare o poartă suporterii" }, answers: ["Orange", "Oranje", "Orange-Nassau", "Orania", "Orania-Nassau"], show: { en: "Orange-Nassau", ro: "Orania-Nassau" } },
    { id: "kingsday", q: { en: "National holiday on 27 April", ro: "Sărbătoarea națională din 27 aprilie" }, answers: ["King's Day", "Kings Day", "Koningsdag", "Ziua Regelui"], show: { en: "King's Day", ro: "Ziua Regelui" } },
    { id: "king2013", q: { en: "King who took the throne in 2013", ro: "Regele care a urcat pe tron în 2013" }, answers: ["Willem-Alexander", "Willem Alexander", "Willem"], show: { en: "Willem-Alexander", ro: "Willem-Alexander" } },
    { id: "afsluitdijk", q: { en: "32 km dam that closed off the Zuiderzee in 1932", ro: "Digul de 32 km care a închis Zuiderzee în 1932" }, answers: ["Afsluitdijk", "Afsluitdijk dam"], show: { en: "Afsluitdijk", ro: "Afsluitdijk" } },
    { id: "flevoland", q: { en: "Newest province, built on land reclaimed from the sea (1986)", ro: "Cea mai nouă provincie, pe pământ smuls mării (1986)" }, answers: ["Flevoland"], show: { en: "Flevoland", ro: "Flevoland" } },
    { id: "edam", q: { en: "Round cheese in red wax, named after a town north of Amsterdam", ro: "Brânza rotundă în ceară roșie, numită după un oraș de la nord de Amsterdam" }, answers: ["Edam"], show: { en: "Edam", ro: "Edam" } },
    { id: "wadden", q: { en: "Island chain in the north (Texel, Terschelling…)", ro: "Lanțul de insule din nord (Texel, Terschelling…)" }, answers: ["Wadden Islands", "Wadden", "Frisian Islands", "West Frisian Islands", "Insulele Frizone", "Insulele Frizice", "Waddeneilanden"], show: { en: "Wadden Islands", ro: "Insulele Frizone" } },
    { id: "cruyff", q: { en: "Footballer behind \"total football\", the famous number 14", ro: "Fotbalistul „fotbalului total”, celebrul număr 14" }, answers: ["Johan Cruyff", "Cruyff", "Cruijff"], show: { en: "Johan Cruyff", ro: "Johan Cruyff" } },
    { id: "clogs", q: { en: "Traditional wooden shoes", ro: "Încălțămintea tradițională din lemn" }, answers: ["clogs", "clog", "klompen", "klomp", "saboți", "saboti", "sabot"], show: { en: "Clogs (klompen)", ro: "Saboți (klompen)" } },
    { id: "frisian", q: { en: "Second official language, spoken in Friesland", ro: "A doua limbă oficială, vorbită în Frizia" }, answers: ["Frisian", "West Frisian", "Fries", "frizonă", "frizona", "frizică"], show: { en: "Frisian", ro: "Frizona" } },
    { id: "maastricht", q: { en: "City where the 1992 treaty founding the European Union was signed", ro: "Orașul unde s-a semnat în 1992 tratatul de înființare a Uniunii Europene" }, answers: ["Maastricht"], show: { en: "Maastricht", ro: "Maastricht" } },
    { id: "zeeland", q: { en: "Province hit hardest by the 1953 North Sea flood, now behind the Delta Works", ro: "Provincia cea mai lovită de inundația din 1953, protejată azi de Lucrările Delta" }, answers: ["Zeeland", "Zeelanda", "Zealand"], show: { en: "Zeeland", ro: "Zeelanda" } },
  ],
}
