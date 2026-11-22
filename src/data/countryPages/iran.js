/**
 * Country page: Iran (bilingual inline, like romania.js).
 * Facts: population about 90 million (2024 estimate); area 1,648,195 km²; Damavand 5,610 m; Islamic Republic proclaimed 1 April 1979.
 */
export const IRAN_PAGE = {
  id: 'ir',
  flag: '🇮🇷',
  name: { en: "Iran", ro: "Iran" },
  tagline: {
    en: "Ancient Persia: Persepolis, Isfahan and the Caspian, 31 provinces between the mountains and the Gulf.",
    ro: "Vechea Persie: Persepolis, Isfahan și Marea Caspică, 31 de provincii între munți și Golf.",
  },
  mapHint: { en: "Hover or tap a province", ro: "Treci cu mouse-ul sau atinge o provincie" },
  seatLabel: { en: 'capital', ro: 'capitala' },
  facts: [
    { icon: '🏛️', label: { en: "Capital", ro: "Capitala" }, value: { en: "Tehran", ro: "Teheran" } },
    { icon: '👥', label: { en: "Population", ro: "Populație" }, value: { en: "about 90 million (2024)", ro: "circa 90 de milioane (2024)" } },
    { icon: '📐', label: { en: "Area", ro: "Suprafață" }, value: { en: "1,648,195 km²", ro: "1.648.195 km²" } },
    { icon: '🗺️', label: { en: "Divisions", ro: "Diviziuni" }, value: { en: "31 provinces", ro: "31 de provincii" } },
    { icon: '⛰️', label: { en: "Highest point", ro: "Cel mai înalt punct" }, value: { en: "Damavand, 5,610 m", ro: "Damavand, 5.610 m" } },
    { icon: '💵', label: { en: "Currency", ro: "Moneda" }, value: { en: "Iranian rial (IRR)", ro: "Rialul iranian (IRR)" } },
    { icon: '🗣️', label: { en: "Language", ro: "Limba" }, value: { en: "Persian (Farsi)", ro: "Persană (farsi)" } },
    { icon: '📅', label: { en: "Islamic Republic", ro: "Republica Islamică" }, value: { en: "1 April 1979", ro: "1 aprilie 1979" } },
  ],
  neighbours: { en: "Iraq, Turkey, Armenia, Azerbaijan, Turkmenistan, Afghanistan and Pakistan", ro: "Irak, Turcia, Armenia, Azerbaidjan, Turkmenistan, Afganistan și Pakistan" },
  questions: [
    { id: "capital", q: { en: "Capital of Iran", ro: "Capitala Iranului" }, answers: ["Tehran", "Teheran"], show: { en: "Tehran", ro: "Teheran" } },
    { id: "persia", q: { en: "The country's name abroad until 1935", ro: "Numele țării în străinătate până în 1935" }, answers: ["Persia", "Persia"], show: { en: "Persia", ro: "Persia" } },
    { id: "farsi", q: { en: "Main language", ro: "Limba principală" }, answers: ["Persian", "Farsi", "persană", "persana", "Parsi"], show: { en: "Persian (Farsi)", ro: "Persană (farsi)" } },
    { id: "rial", q: { en: "Currency", ro: "Moneda" }, answers: ["rial", "Iranian rial", "rialul", "IRR", "toman"], show: { en: "Rial", ro: "Rial" } },
    { id: "damavand", q: { en: "Highest peak, a volcano near Tehran", ro: "Cel mai înalt vârf, un vulcan lângă Teheran" }, answers: ["Damavand", "Demavend", "Mount Damavand"], show: { en: "Damavand", ro: "Damavand" } },
    { id: "caspian", q: { en: "Sea on its northern coast", ro: "Marea de pe coasta de nord" }, answers: ["Caspian", "Caspian Sea", "Marea Caspică", "Marea Caspica"], show: { en: "Caspian Sea", ro: "Marea Caspică" } },
    { id: "gulf", q: { en: "Gulf on its southern coast", ro: "Golful de pe coasta de sud" }, answers: ["Persian Gulf", "Golful Persic", "Gulf"], show: { en: "Persian Gulf", ro: "Golful Persic" } },
    { id: "hormuz", q: { en: "Strait every Gulf oil tanker sails through", ro: "Strâmtoarea prin care trece fiecare petrolier din Golf" }, answers: ["Hormuz", "Strait of Hormuz", "Strâmtoarea Ormuz", "Ormuz", "Hormoz"], show: { en: "Strait of Hormuz", ro: "Strâmtoarea Ormuz" } },
    { id: "persepolis", q: { en: "Ceremonial capital of the Achaemenid kings", ro: "Capitala ceremonială a regilor ahemenizi" }, answers: ["Persepolis", "Takht-e Jamshid"], show: { en: "Persepolis", ro: "Persepolis" } },
    { id: "cyrus", q: { en: "King who founded the Persian Empire", ro: "Regele care a fondat Imperiul Persan" }, answers: ["Cyrus", "Cyrus the Great", "Cirus", "Cirus cel Mare", "Kourosh"], show: { en: "Cyrus the Great", ro: "Cirus cel Mare" } },
    { id: "shiraz", q: { en: "City of poets Hafez and Saadi", ro: "Orașul poeților Hafez și Saadi" }, answers: ["Shiraz", "Șiraz", "Siraz"], show: { en: "Shiraz", ro: "Shiraz" } },
    { id: "isfahan", q: { en: "City once called \"half of the world\"", ro: "Orașul numit odinioară „jumătate din lume”" }, answers: ["Isfahan", "Esfahan", "Ispahan"], show: { en: "Isfahan", ro: "Isfahan" } },
    { id: "mashhad", q: { en: "Second-largest city and biggest pilgrimage site", ro: "Al doilea oraș ca mărime și cel mai mare loc de pelerinaj" }, answers: ["Mashhad", "Meshed", "Mashad"], show: { en: "Mashhad", ro: "Mashhad" } },
    { id: "1979", q: { en: "Year of the revolution", ro: "Anul revoluției" }, answers: ["1979"], show: { en: "1979", ro: "1979" } },
    { id: "carpet", q: { en: "Hand-knotted craft it's famous for", ro: "Meșteșugul înnodat de mână pentru care e celebru" }, answers: ["carpet", "carpets", "rug", "rugs", "covor", "covoare", "Persian carpet", "covor persan"], show: { en: "Persian carpets", ro: "Covoarele persane" } },
    { id: "saffron", q: { en: "Red spice it grows more of than any other country", ro: "Condimentul roșu pe care îl cultivă mai mult decât orice altă țară" }, answers: ["saffron", "șofran", "sofran"], show: { en: "Saffron", ro: "Șofran" } },
    { id: "nowruz", q: { en: "Persian New Year, at the spring equinox", ro: "Anul Nou persan, la echinocțiul de primăvară" }, answers: ["Nowruz", "Norouz", "Nauruz", "Novruz", "Nawruz"], show: { en: "Nowruz", ro: "Nowruz" } },
    { id: "ferdowsi", q: { en: "Poet of the epic \"Shahnameh\"", ro: "Poetul epopeii „Shahnameh”" }, answers: ["Ferdowsi", "Firdousi", "Firdusi", "Ferdausi"], show: { en: "Ferdowsi", ro: "Ferdowsi" } },
    { id: "zagros", q: { en: "Long mountain range in the west", ro: "Lanțul muntos lung din vest" }, answers: ["Zagros", "Zagros Mountains", "Munții Zagros"], show: { en: "Zagros", ro: "Zagros" } },
    { id: "lut", q: { en: "Desert with some of the hottest ground on Earth", ro: "Deșertul cu unele dintre cele mai fierbinți suprafețe de pe Pământ" }, answers: ["Lut", "Dasht-e Lut", "Lut Desert", "Deșertul Lut"], show: { en: "Lut Desert", ro: "Deșertul Lut" } },
  ],
}
