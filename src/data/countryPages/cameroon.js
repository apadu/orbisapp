/**
 * Country page: Cameroon (bilingual inline, like romania.js).
 * Facts: population about 29 million (2024 UN estimate); area 475,442 km²; Mount Cameroon about 4,040 m; independence 1 January 1960.
 */
export const CAMEROON_PAGE = {
  id: 'cm',
  flag: '🇨🇲',
  name: {"en": "Cameroon", "ro": "Camerun"},
  tagline: {
    en: "\"Africa in miniature\": rainforest, savannah, volcanoes and two official languages, in 10 regions.",
    ro: "„Africa în miniatură”: pădure tropicală, savană, vulcani și două limbi oficiale, în 10 regiuni.",
  },
  mapHint: { en: "Hover or tap a region", ro: "Treci cu mouse-ul sau atinge o regiune" },
  facts: [
    { icon: '🏛️', label: { en: "Capital", ro: "Capitala" }, value: { en: "Yaoundé", ro: "Yaoundé" } },
    { icon: '👥', label: { en: "Population", ro: "Populație" }, value: { en: "about 29 million (2024 estimate)", ro: "circa 29 de milioane (estimare 2024)" } },
    { icon: '📐', label: { en: "Area", ro: "Suprafață" }, value: { en: "475,442 km²", ro: "475.442 km²" } },
    { icon: '🗺️', label: { en: "Divisions", ro: "Diviziuni" }, value: { en: "10 regions", ro: "10 regiuni" } },
    { icon: '⛰️', label: { en: "Highest point", ro: "Cel mai înalt punct" }, value: { en: "Mount Cameroon, about 4,040 m", ro: "Muntele Camerun, circa 4.040 m" } },
    { icon: '💲', label: { en: "Currency", ro: "Moneda" }, value: { en: "Central African CFA franc (XAF)", ro: "Francul CFA central-african (XAF)" } },
    { icon: '🗣️', label: { en: "Languages", ro: "Limbi" }, value: { en: "French, English", ro: "Franceză, engleză" } },
    { icon: '📅', label: { en: "Independence", ro: "Independența" }, value: { en: "1 January 1960", ro: "1 ianuarie 1960" } },
  ],
  neighbours: { en: "Nigeria, Chad, Central African Republic, Republic of the Congo, Gabon, Equatorial Guinea", ro: "Nigeria, Ciad, Republica Centrafricană, Republica Congo, Gabon, Guineea Ecuatorială" },
  questions: [
    { id: "capital", q: { en: "Capital of Cameroon", ro: "Capitala Camerunului" }, answers: ["Yaoundé", "Yaounde"], show: { en: "Yaoundé", ro: "Yaoundé" } },
    { id: "douala", q: { en: "Largest city and main port", ro: "Cel mai mare oraș și principalul port" }, answers: ["Douala"], show: { en: "Douala", ro: "Douala" } },
    { id: "mtcameroon", q: { en: "Highest mountain, an active volcano near the coast", ro: "Cel mai înalt munte, un vulcan activ lângă coastă" }, answers: ["Mount Cameroon", "Cameroon", "Muntele Camerun", "Mongo ma Ndemi", "Fako"], show: { en: "Mount Cameroon", ro: "Muntele Camerun" } },
    { id: "miniature", q: { en: "Nickname: \"Africa in …\"", ro: "Porecla: „Africa în …”" }, answers: ["miniature", "Africa in miniature", "miniatură", "miniatura", "Africa în miniatură"], show: { en: "Africa in miniature", ro: "Africa în miniatură" } },
    { id: "english", q: { en: "Official language besides French", ro: "Limba oficială pe lângă franceză" }, answers: ["English", "engleză", "engleza"], show: { en: "English", ro: "Engleza" } },
    { id: "milla", q: { en: "Striker whose corner-flag dance lit up the 1990 World Cup", ro: "Atacantul al cărui dans la steagul de colț a făcut senzație la Mondialul din 1990" }, answers: ["Roger Milla", "Milla"], show: { en: "Roger Milla", ro: "Roger Milla" } },
    { id: "etoo", q: { en: "Striker, four-time African Footballer of the Year", ro: "Atacantul de patru ori fotbalistul african al anului" }, answers: ["Samuel Eto'o", "Eto o", "Etoo", "Eto'o", "Samuel Etoo"], show: { en: "Samuel Eto'o", ro: "Samuel Eto'o" } },
    { id: "lions", q: { en: "Nickname of the national football team", ro: "Porecla echipei naționale de fotbal" }, answers: ["Indomitable Lions", "Lions", "Lions Indomptables", "Leii Neîmblânziți", "Leii Neimblanziti"], show: { en: "Indomitable Lions", ro: "Leii Neîmblânziți" } },
    { id: "nyos", q: { en: "Crater lake whose gas cloud killed about 1,700 people in 1986", ro: "Lacul de crater al cărui nor de gaz a ucis circa 1.700 de oameni în 1986" }, answers: ["Lake Nyos", "Nyos", "Lacul Nyos"], show: { en: "Lake Nyos", ro: "Lacul Nyos" } },
    { id: "chad", q: { en: "Shrinking lake in the far north, shared with three neighbours", ro: "Lacul care se micșorează în extremul nord, împărțit cu trei vecini" }, answers: ["Lake Chad", "Chad", "Lacul Ciad", "Ciad"], show: { en: "Lake Chad", ro: "Lacul Ciad" } },
    { id: "cfa", q: { en: "Currency", ro: "Moneda" }, answers: ["CFA franc", "franc CFA", "CFA", "Central African CFA franc", "franc", "XAF"], show: { en: "CFA franc", ro: "Franc CFA" } },
    { id: "kamerun", q: { en: "Name of the German colony (1884–1916)", ro: "Numele coloniei germane (1884–1916)" }, answers: ["Kamerun"], show: { en: "Kamerun", ro: "Kamerun" } },
    { id: "shrimp", q: { en: "Crustaceans the Portuguese saw in the Wouri river, behind the country's name", ro: "Crustaceele văzute de portughezi în râul Wouri, de la care vine numele țării" }, answers: ["shrimp", "shrimps", "prawns", "prawn", "creveți", "creveti", "camarões", "camaroes"], show: { en: "Shrimp (camarões)", ro: "Creveți (camarões)" } },
    { id: "bakassi", q: { en: "Oil-rich peninsula handed over by Nigeria in 2008", ro: "Peninsula bogată în petrol cedată de Nigeria în 2008" }, answers: ["Bakassi", "Bakassi Peninsula", "Peninsula Bakassi"], show: { en: "Bakassi", ro: "Bakassi" } },
    { id: "dja", q: { en: "Rainforest reserve on the UNESCO list, in the south", ro: "Rezervația de pădure tropicală din sud, pe lista UNESCO" }, answers: ["Dja", "Dja Faunal Reserve", "Dja Reserve"], show: { en: "Dja Faunal Reserve", ro: "Rezervația Dja" } },
    { id: "makossa", q: { en: "Dance music born in Douala (Manu Dibango's \"Soul Makossa\")", ro: "Muzica de dans născută la Douala („Soul Makossa” a lui Manu Dibango)" }, answers: ["makossa"], show: { en: "Makossa", ro: "Makossa" } },
    { id: "ndole", q: { en: "National dish of bitterleaf stew with peanuts", ro: "Felul național: tocană de frunze amare cu arahide" }, answers: ["ndolé", "ndole"], show: { en: "Ndolé", ro: "Ndolé" } },
    { id: "buea", q: { en: "Capital of the Southwest Region, at the foot of Mount Cameroon", ro: "Capitala regiunii de Sud-Vest, la poalele Muntelui Camerun" }, answers: ["Buea", "Buéa"], show: { en: "Buea", ro: "Buea" } },
    { id: "guinea", q: { en: "Gulf on its coast", ro: "Golful de pe coasta sa" }, answers: ["Gulf of Guinea", "Guinea", "Golful Guineei", "Bight of Biafra", "Bight of Bonny"], show: { en: "Gulf of Guinea", ro: "Golful Guineei" } },
    { id: "1960", q: { en: "Year of independence (French part)", ro: "Anul independenței (partea franceză)" }, answers: ["1960"], show: { en: "1960", ro: "1960" } },
  ],
}
