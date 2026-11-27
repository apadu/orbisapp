/**
 * Country page: Tunisia (bilingual inline, like romania.js).
 * Facts: population 12.0 million (2024 census, INS); area 163,610 km²; Jebel ech Chambi 1,544 m; independence 20 March 1956.
 */
export const TUNISIA_PAGE = {
  id: 'tn',
  flag: '🇹🇳',
  name: {"en": "Tunisia", "ro": "Tunisia"},
  tagline: {
    en: "Carthage, olive groves and the Sahara: 24 governorates on the tip of North Africa.",
    ro: "Cartagina, livezi de măslini și Sahara: 24 de guvernorate în vârful Africii de Nord.",
  },
  mapHint: { en: "Hover or tap a governorate", ro: "Treci cu mouse-ul sau atinge un guvernorat" },
  facts: [
    { icon: '🏛️', label: { en: "Capital", ro: "Capitala" }, value: { en: "Tunis", ro: "Tunis" } },
    { icon: '👥', label: { en: "Population", ro: "Populație" }, value: { en: "12.0 million (2024 census)", ro: "12,0 milioane (recensământul din 2024)" } },
    { icon: '📐', label: { en: "Area", ro: "Suprafață" }, value: { en: "163,610 km²", ro: "163.610 km²" } },
    { icon: '🗺️', label: { en: "Divisions", ro: "Diviziuni" }, value: { en: "24 governorates", ro: "24 de guvernorate" } },
    { icon: '⛰️', label: { en: "Highest point", ro: "Cel mai înalt punct" }, value: { en: "Jebel ech Chambi, 1,544 m", ro: "Jebel ech Chambi, 1.544 m" } },
    { icon: '💲', label: { en: "Currency", ro: "Moneda" }, value: { en: "Tunisian dinar (TND)", ro: "Dinarul tunisian (TND)" } },
    { icon: '🗣️', label: { en: "Language", ro: "Limba" }, value: { en: "Arabic", ro: "Arabă" } },
    { icon: '📅', label: { en: "Independence", ro: "Independența" }, value: { en: "20 March 1956", ro: "20 martie 1956" } },
  ],
  neighbours: { en: "Algeria, Libya", ro: "Algeria, Libia" },
  questions: [
    { id: "capital", q: { en: "Capital of Tunisia", ro: "Capitala Tunisiei" }, answers: ["Tunis"], show: { en: "Tunis", ro: "Tunis" } },
    { id: "carthage", q: { en: "Ancient city near Tunis, destroyed by Rome in 146 BC", ro: "Orașul antic de lângă Tunis, distrus de Roma în 146 î.Hr." }, answers: ["Carthage", "Cartagina", "Carthago"], show: { en: "Carthage", ro: "Cartagina" } },
    { id: "hannibal", q: { en: "Carthaginian general who crossed the Alps with elephants", ro: "Generalul cartaginez care a trecut Alpii cu elefanți" }, answers: ["Hannibal", "Hanibal", "Hannibal Barca"], show: { en: "Hannibal", ro: "Hannibal" } },
    { id: "jasmine", q: { en: "2010–2011 revolution named after a flower", ro: "Revoluția din 2010–2011 numită după o floare" }, answers: ["Jasmine Revolution", "Jasmine", "Revoluția Iasomiei", "Revolutia Iasomiei", "iasomie"], show: { en: "Jasmine Revolution", ro: "Revoluția Iasomiei" } },
    { id: "eldjem", q: { en: "Town with a huge Roman amphitheatre (UNESCO)", ro: "Orașul cu un imens amfiteatru roman (UNESCO)" }, answers: ["El Djem", "El Jem", "Thysdrus"], show: { en: "El Djem", ro: "El Djem" } },
    { id: "djerba", q: { en: "Largest island, a resort in the Gulf of Gabès", ro: "Cea mai mare insulă, stațiune în Golful Gabès" }, answers: ["Djerba", "Jerba"], show: { en: "Djerba", ro: "Djerba" } },
    { id: "matmata", q: { en: "Village of underground houses, used in Star Wars", ro: "Satul cu case subterane, folosit în Războiul stelelor" }, answers: ["Matmata"], show: { en: "Matmata", ro: "Matmata" } },
    { id: "chott", q: { en: "Vast salt lake in the south", ro: "Vastul lac sărat din sud" }, answers: ["Chott el Djerid", "Chott el Jerid", "Chott", "Shatt al-Jarid"], show: { en: "Chott el Djerid", ro: "Chott el Djerid" } },
    { id: "sahara", q: { en: "Desert covering the south", ro: "Deșertul care acoperă sudul" }, answers: ["Sahara", "Saharan Desert", "Deșertul Sahara"], show: { en: "Sahara", ro: "Sahara" } },
    { id: "dinar", q: { en: "Currency", ro: "Moneda" }, answers: ["dinar", "Tunisian dinar", "dinar tunisian", "TND"], show: { en: "Dinar", ro: "Dinar" } },
    { id: "harissa", q: { en: "Hot chilli paste", ro: "Pasta iute de ardei" }, answers: ["harissa", "harisa"], show: { en: "Harissa", ro: "Harissa" } },
    { id: "kairouan", q: { en: "Holy city of the Great Mosque, founded in 670", ro: "Orașul sfânt al Marii Moschei, fondat în 670" }, answers: ["Kairouan", "Kairuan", "Qairawan"], show: { en: "Kairouan", ro: "Kairouan" } },
    { id: "sidibousaid", q: { en: "Blue-and-white clifftop village near Tunis", ro: "Satul alb-albastru de pe faleză, lângă Tunis" }, answers: ["Sidi Bou Said", "Sidi Bou Saïd", "Sidi Bousaid"], show: { en: "Sidi Bou Said", ro: "Sidi Bou Said" } },
    { id: "bourguiba", q: { en: "Independence leader and first president", ro: "Liderul independenței și primul președinte" }, answers: ["Habib Bourguiba", "Bourguiba"], show: { en: "Habib Bourguiba", ro: "Habib Bourguiba" } },
    { id: "quartet", q: { en: "Group that won the 2015 Nobel Peace Prize", ro: "Grupul laureat al Nobelului pentru Pace în 2015" }, answers: ["National Dialogue Quartet", "Quartet", "Tunisian National Dialogue Quartet", "Cvartetul", "Cvartetul pentru Dialog Național"], show: { en: "National Dialogue Quartet", ro: "Cvartetul pentru Dialog Național" } },
    { id: "chambi", q: { en: "Highest mountain", ro: "Cel mai înalt munte" }, answers: ["Jebel ech Chambi", "Chambi", "Jebel Chambi", "Djebel Chambi"], show: { en: "Jebel ech Chambi", ro: "Jebel ech Chambi" } },
    { id: "olive", q: { en: "Tree of the famous groves around Sfax, a top oil exporter", ro: "Arborele livezilor celebre din jurul Sfaxului, mare exportator de ulei" }, answers: ["olive", "olive tree", "olives", "măslin", "maslin", "măsline"], show: { en: "Olive", ro: "Măslinul" } },
    { id: "sfax", q: { en: "Second-largest city, an industrial port", ro: "Al doilea oraș ca mărime, port industrial" }, answers: ["Sfax"], show: { en: "Sfax", ro: "Sfax" } },
    { id: "couscous", q: { en: "National dish of steamed semolina", ro: "Felul național din griș gătit la abur" }, answers: ["couscous", "cuscus", "kuskus"], show: { en: "Couscous", ro: "Cuscus" } },
    { id: "1956", q: { en: "Year of independence from France", ro: "Anul independenței față de Franța" }, answers: ["1956"], show: { en: "1956", ro: "1956" } },
  ],
}
