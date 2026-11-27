/**
 * Country page: Senegal (bilingual inline, like romania.js).
 * Facts: population about 18 million (2023 census, ANSD); area 196,722 km²; 648 m near Népen Diakha; independence 4 April 1960.
 */
export const SENEGAL_PAGE = {
  id: 'sn',
  flag: '🇸🇳',
  name: {"en": "Senegal", "ro": "Senegal"},
  tagline: {
    en: "Africa's westernmost point: Dakar, Gorée and the Senegal River, in 14 regions.",
    ro: "Cel mai vestic punct al Africii: Dakar, Gorée și fluviul Senegal, în 14 regiuni.",
  },
  mapHint: { en: "Hover or tap a region", ro: "Treci cu mouse-ul sau atinge o regiune" },
  facts: [
    { icon: '🏛️', label: { en: "Capital", ro: "Capitala" }, value: { en: "Dakar", ro: "Dakar" } },
    { icon: '👥', label: { en: "Population", ro: "Populație" }, value: { en: "about 18 million (2023 census)", ro: "circa 18 milioane (recensământul din 2023)" } },
    { icon: '📐', label: { en: "Area", ro: "Suprafață" }, value: { en: "196,722 km²", ro: "196.722 km²" } },
    { icon: '🗺️', label: { en: "Divisions", ro: "Diviziuni" }, value: { en: "14 regions", ro: "14 regiuni" } },
    { icon: '⛰️', label: { en: "Highest point", ro: "Cel mai înalt punct" }, value: { en: "648 m, near Népen Diakha", ro: "648 m, lângă Népen Diakha" } },
    { icon: '💲', label: { en: "Currency", ro: "Moneda" }, value: { en: "West African CFA franc (XOF)", ro: "Francul CFA vest-african (XOF)" } },
    { icon: '🗣️', label: { en: "Languages", ro: "Limbi" }, value: { en: "French (Wolof widely spoken)", ro: "Franceză (wolof foarte răspândită)" } },
    { icon: '📅', label: { en: "Independence", ro: "Independența" }, value: { en: "4 April 1960", ro: "4 aprilie 1960" } },
  ],
  neighbours: { en: "Mauritania, Mali, Guinea, Guinea-Bissau, The Gambia", ro: "Mauritania, Mali, Guineea, Guineea-Bissau, Gambia" },
  questions: [
    { id: "capital", q: { en: "Capital of Senegal", ro: "Capitala statului Senegal" }, answers: ["Dakar"], show: { en: "Dakar", ro: "Dakar" } },
    { id: "goree", q: { en: "Island off Dakar, memorial of the slave trade (UNESCO)", ro: "Insula de lângă Dakar, memorial al comerțului cu sclavi (UNESCO)" }, answers: ["Gorée", "Goree", "Gorée Island", "Ile de Gorée", "Insula Gorée"], show: { en: "Gorée", ro: "Gorée" } },
    { id: "capvert", q: { en: "Peninsula where Africa's mainland reaches furthest west", ro: "Peninsula unde Africa continentală ajunge cel mai departe spre vest" }, answers: ["Cap-Vert", "Cape Verde Peninsula", "Cap Vert", "Almadies", "Pointe des Almadies", "Capul Verde"], show: { en: "Cap-Vert peninsula", ro: "Peninsula Cap-Vert" } },
    { id: "retba", q: { en: "Pink lake near Dakar", ro: "Lacul roz de lângă Dakar" }, answers: ["Lake Retba", "Retba", "Lac Rose", "Lac Retba", "Lacul Roz", "Pink Lake"], show: { en: "Lake Retba (Lac Rose)", ro: "Lacul Retba (Lac Rose)" } },
    { id: "senghor", q: { en: "First president, poet of Négritude", ro: "Primul președinte, poetul negritudinii" }, answers: ["Léopold Sédar Senghor", "Senghor", "Leopold Senghor", "Leopold Sedar Senghor"], show: { en: "Léopold Sédar Senghor", ro: "Léopold Sédar Senghor" } },
    { id: "wolof", q: { en: "Most widely spoken language", ro: "Cea mai vorbită limbă" }, answers: ["Wolof", "wolof"], show: { en: "Wolof", ro: "Wolof" } },
    { id: "river", q: { en: "River along the northern border", ro: "Fluviul de-a lungul graniței de nord" }, answers: ["Senegal River", "Senegal", "Fluviul Senegal", "Râul Senegal"], show: { en: "Senegal River", ro: "Fluviul Senegal" } },
    { id: "gambia", q: { en: "Country almost entirely surrounded by Senegal", ro: "Țara înconjurată aproape în întregime de Senegal" }, answers: ["The Gambia", "Gambia"], show: { en: "The Gambia", ro: "Gambia" } },
    { id: "cfa", q: { en: "Currency", ro: "Moneda" }, answers: ["CFA franc", "franc CFA", "CFA", "West African CFA franc", "franc", "XOF"], show: { en: "CFA franc", ro: "Franc CFA" } },
    { id: "rally", q: { en: "Famous desert rally that finished in Dakar until 2007", ro: "Celebrul raliu prin deșert care se termina la Dakar până în 2007" }, answers: ["Paris–Dakar", "Paris-Dakar", "Dakar Rally", "Paris Dakar", "Raliul Dakar"], show: { en: "Paris–Dakar Rally", ro: "Raliul Paris–Dakar" } },
    { id: "thieb", q: { en: "National dish of rice and fish", ro: "Felul național din orez și pește" }, answers: ["thieboudienne", "ceebu jën", "ceebu jen", "thiéboudienne", "thieboudienn", "tiebou dienne"], show: { en: "Thieboudienne", ro: "Thieboudienne" } },
    { id: "renaissance", q: { en: "49 m bronze statue unveiled in Dakar in 2010", ro: "Statuia de bronz de 49 m inaugurată la Dakar în 2010" }, answers: ["African Renaissance Monument", "African Renaissance", "Monument de la Renaissance africaine", "Monumentul Renașterii Africane", "Renaissance"], show: { en: "African Renaissance Monument", ro: "Monumentul Renașterii Africane" } },
    { id: "stlouis", q: { en: "Former colonial capital at the mouth of the Senegal River", ro: "Fosta capitală colonială de la gura fluviului Senegal" }, answers: ["Saint-Louis", "Saint Louis", "St-Louis", "St. Louis", "Ndar"], show: { en: "Saint-Louis", ro: "Saint-Louis" } },
    { id: "casamance", q: { en: "Green southern region beyond The Gambia", ro: "Regiunea verde din sud, dincolo de Gambia" }, answers: ["Casamance"], show: { en: "Casamance", ro: "Casamance" } },
    { id: "baobab", q: { en: "Giant tree, the national emblem", ro: "Arborele uriaș, emblema națională" }, answers: ["baobab", "baobabul"], show: { en: "Baobab", ro: "Baobab" } },
    { id: "mane", q: { en: "Footballer who won the 2021 Africa Cup of Nations", ro: "Fotbalistul care a câștigat Cupa Africii pe Națiuni 2021" }, answers: ["Sadio Mané", "Sadio Mane", "Mané", "Mane"], show: { en: "Sadio Mané", ro: "Sadio Mané" } },
    { id: "france2002", q: { en: "Defending champions they beat in the 2002 World Cup opener", ro: "Campioana en-titre pe care au învins-o în meciul de deschidere al Mondialului din 2002" }, answers: ["France", "Franța", "Franta"], show: { en: "France", ro: "Franța" } },
    { id: "laamb", q: { en: "Traditional wrestling, the most popular sport after football", ro: "Lupta tradițională, cel mai popular sport după fotbal" }, answers: ["laamb", "lamb", "Senegalese wrestling", "lutte sénégalaise", "lupte senegaleze", "lupta senegaleză"], show: { en: "Laamb (Senegalese wrestling)", ro: "Laamb (lupta senegaleză)" } },
    { id: "touba", q: { en: "Holy city of the Mouride brotherhood", ro: "Orașul sfânt al confreriei Mouride" }, answers: ["Touba"], show: { en: "Touba", ro: "Touba" } },
    { id: "1960", q: { en: "Year of independence", ro: "Anul independenței" }, answers: ["1960"], show: { en: "1960", ro: "1960" } },
  ],
}
