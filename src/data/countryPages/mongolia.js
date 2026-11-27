/**
 * Country page: Mongolia (bilingual inline, like romania.js).
 * Facts: population 3.3 million (2020 census, NSO); area 1,564,116 km²; Khüiten Peak 4,374 m; independence declared 29 December 1911.
 */
export const MONGOLIA_PAGE = {
  id: 'mn',
  flag: '🇲🇳',
  name: {"en": "Mongolia", "ro": "Mongolia"},
  tagline: {
    en: "Steppe, desert and the land of Genghis Khan: 21 aimags between Russia and China.",
    ro: "Stepă, deșert și țara lui Ginghis Han: 21 de aimaguri între Rusia și China.",
  },
  mapHint: { en: "Hover or tap an aimag", ro: "Treci cu mouse-ul sau atinge un aimag" },
  facts: [
    { icon: '🏛️', label: { en: "Capital", ro: "Capitala" }, value: { en: "Ulaanbaatar", ro: "Ulan Bator" } },
    { icon: '👥', label: { en: "Population", ro: "Populație" }, value: { en: "3.3 million (2020 census)", ro: "3,3 milioane (recensământul din 2020)" } },
    { icon: '📐', label: { en: "Area", ro: "Suprafață" }, value: { en: "1,564,116 km²", ro: "1.564.116 km²" } },
    { icon: '🗺️', label: { en: "Divisions", ro: "Diviziuni" }, value: { en: "21 aimags + Ulaanbaatar", ro: "21 de aimaguri + Ulan Bator" } },
    { icon: '⛰️', label: { en: "Highest point", ro: "Cel mai înalt punct" }, value: { en: "Khüiten Peak, 4,374 m", ro: "Vârful Khüiten, 4.374 m" } },
    { icon: '💲', label: { en: "Currency", ro: "Moneda" }, value: { en: "Tögrög (MNT)", ro: "Tugrik (MNT)" } },
    { icon: '🗣️', label: { en: "Language", ro: "Limba" }, value: { en: "Mongolian", ro: "Mongolă" } },
    { icon: '📅', label: { en: "Independence", ro: "Independența" }, value: { en: "29 December 1911", ro: "29 decembrie 1911" } },
  ],
  neighbours: { en: "Russia, China", ro: "Rusia, China" },
  questions: [
    { id: "capital", q: { en: "Capital, the coldest national capital", ro: "Capitala, cea mai rece capitală din lume" }, answers: ["Ulaanbaatar", "Ulan Bator", "Ulaan Baatar", "Ulan Bataar"], show: { en: "Ulaanbaatar", ro: "Ulan Bator" } },
    { id: "genghis", q: { en: "Founder of the Mongol Empire in 1206", ro: "Fondatorul Imperiului Mongol, în 1206" }, answers: ["Genghis Khan", "Chinggis Khan", "Ginghis Han", "Gingis Han", "Temujin", "Temüjin", "Genghis"], show: { en: "Genghis Khan", ro: "Ginghis Han" } },
    { id: "ger", q: { en: "Round felt tent of the nomads", ro: "Cortul rotund de pâslă al nomazilor" }, answers: ["ger", "yurt", "iurtă", "iurta"], show: { en: "Ger (yurt)", ro: "Ger (iurtă)" } },
    { id: "gobi", q: { en: "Desert in the south", ro: "Deșertul din sud" }, answers: ["Gobi", "Gobi Desert", "Deșertul Gobi"], show: { en: "Gobi", ro: "Gobi" } },
    { id: "naadam", q: { en: "July festival of wrestling, horse racing and archery", ro: "Festivalul din iulie cu lupte, curse de cai și tir cu arcul" }, answers: ["Naadam", "Nadaam"], show: { en: "Naadam", ro: "Naadam" } },
    { id: "togrog", q: { en: "Currency", ro: "Moneda" }, answers: ["tögrög", "togrog", "tugrik", "tugrug", "MNT"], show: { en: "Tögrög", ro: "Tugrik" } },
    { id: "cyrillic", q: { en: "Alphabet used for Mongolian today", ro: "Alfabetul folosit azi pentru limba mongolă" }, answers: ["Cyrillic", "chirilic", "chirilică", "chirilica", "alfabetul chirilic"], show: { en: "Cyrillic", ro: "Chirilic" } },
    { id: "khovsgol", q: { en: "Deep lake in the north, \"the Blue Pearl\"", ro: "Lacul adânc din nord, „Perla Albastră”" }, answers: ["Khövsgöl", "Khovsgol", "Hovsgol", "Lake Khövsgöl", "Lake Khovsgol", "Lacul Khövsgöl", "Huvsgul"], show: { en: "Lake Khövsgöl", ro: "Lacul Khövsgöl" } },
    { id: "karakorum", q: { en: "Capital of the Mongol Empire in the 13th century", ro: "Capitala Imperiului Mongol în secolul al XIII-lea" }, answers: ["Karakorum", "Kharkhorin", "Karakoram", "Qaraqorum"], show: { en: "Karakorum", ro: "Karakorum" } },
    { id: "takhi", q: { en: "Last truly wild horse, reintroduced in Hustai park", ro: "Ultimul cal cu adevărat sălbatic, reintrodus în parcul Hustai" }, answers: ["Przewalski's horse", "Przewalski", "takhi", "calul lui Przewalski", "Przewalski horse"], show: { en: "Przewalski's horse (takhi)", ro: "Calul lui Przewalski (takhi)" } },
    { id: "altai", q: { en: "Mountains in the far west, with the highest peak", ro: "Munții din extremul vest, cu cel mai înalt vârf" }, answers: ["Altai", "Altay", "Altai Mountains", "Munții Altai", "Mongol Altai"], show: { en: "Altai Mountains", ro: "Munții Altai" } },
    { id: "khoomei", q: { en: "Singing that produces two notes at once", ro: "Cântecul care produce două note în același timp" }, answers: ["throat singing", "khöömii", "khoomii", "khoomei", "cânt diftonic", "cant diftonic", "cântat gutural", "cantat gutural"], show: { en: "Throat singing (khöömii)", ro: "Cântatul gutural (khöömii)" } },
    { id: "flaming", q: { en: "Red cliffs in the Gobi where dinosaur eggs were first found (1923)", ro: "Falezele roșii din Gobi unde au fost găsite primele ouă de dinozaur (1923)" }, answers: ["Flaming Cliffs", "Bayanzag", "Bayan Zag"], show: { en: "Flaming Cliffs (Bayanzag)", ro: "Flaming Cliffs (Bayanzag)" } },
    { id: "kublai", q: { en: "Grandson of Genghis who founded China's Yuan dynasty", ro: "Nepotul lui Ginghis care a fondat dinastia Yuan în China" }, answers: ["Kublai Khan", "Kublai", "Khubilai", "Kubilai Han", "Kublai Han"], show: { en: "Kublai Khan", ro: "Kublai Han" } },
    { id: "camel", q: { en: "Two-humped animal of the Gobi", ro: "Animalul cu două cocoașe din Gobi" }, answers: ["Bactrian camel", "camel", "cămilă", "camila", "cămila bactriană", "camila bactriana"], show: { en: "Bactrian camel", ro: "Cămila bactriană" } },
    { id: "empire", q: { en: "Largest contiguous land empire in history", ro: "Cel mai mare imperiu continuu pe uscat din istorie" }, answers: ["Mongol Empire", "Imperiul Mongol", "Mongol"], show: { en: "Mongol Empire", ro: "Imperiul Mongol" } },
    { id: "buuz", q: { en: "Steamed meat dumplings, eaten at Lunar New Year", ro: "Colțunașii cu carne gătiți la abur, mâncați de Anul Nou lunar" }, answers: ["buuz", "buuzi"], show: { en: "Buuz", ro: "Buuz" } },
    { id: "eagle", q: { en: "Bird the Kazakh hunters of Bayan-Ölgii train", ro: "Pasărea pe care o dresează vânătorii kazahi din Bayan-Ölgii" }, answers: ["golden eagle", "eagle", "vultur", "acvilă", "acvila", "acvila de munte", "vulturul auriu"], show: { en: "Golden eagle", ro: "Acvila de munte" } },
    { id: "khuiten", q: { en: "Highest peak", ro: "Cel mai înalt vârf" }, answers: ["Khüiten", "Khuiten", "Khüiten Peak", "Khuiten Peak", "Vârful Khüiten"], show: { en: "Khüiten Peak", ro: "Vârful Khüiten" } },
    { id: "1911", q: { en: "Year it declared independence from the Qing dynasty", ro: "Anul în care și-a declarat independența față de dinastia Qing" }, answers: ["1911"], show: { en: "1911", ro: "1911" } },
  ],
}
