/**
 * Country page: Czechia (bilingual inline, like romania.js).
 * Facts: population 10.9 million (2024, CZSO); area 78,871 km²; Sněžka 1,603 m; independent since 1 January 1993.
 */
export const CZECHIA_PAGE = {
  id: 'cz',
  flag: '🇨🇿',
  name: {"en": "Czechia", "ro": "Cehia"},
  tagline: {
    en: "Bohemia and Moravia: castles, spa towns and the world's keenest beer drinkers, in 14 regions.",
    ro: "Boemia și Moravia: castele, stațiuni balneare și cei mai pasionați băutori de bere, în 14 regiuni.",
  },
  mapHint: { en: "Hover or tap a region", ro: "Treci cu mouse-ul sau atinge o regiune" },
  facts: [
    { icon: '🏛️', label: { en: "Capital", ro: "Capitala" }, value: { en: "Prague", ro: "Praga" } },
    { icon: '👥', label: { en: "Population", ro: "Populație" }, value: { en: "10.9 million (2024)", ro: "10,9 milioane (2024)" } },
    { icon: '📐', label: { en: "Area", ro: "Suprafață" }, value: { en: "78,871 km²", ro: "78.871 km²" } },
    { icon: '🗺️', label: { en: "Divisions", ro: "Diviziuni" }, value: { en: "13 regions + Prague", ro: "13 regiuni + Praga" } },
    { icon: '⛰️', label: { en: "Highest point", ro: "Cel mai înalt punct" }, value: { en: "Sněžka, 1,603 m", ro: "Sněžka, 1.603 m" } },
    { icon: '💲', label: { en: "Currency", ro: "Moneda" }, value: { en: "Czech koruna (CZK)", ro: "Coroana cehă (CZK)" } },
    { icon: '🗣️', label: { en: "Language", ro: "Limba" }, value: { en: "Czech", ro: "Cehă" } },
    { icon: '📅', label: { en: "Independence", ro: "Independența" }, value: { en: "1 January 1993", ro: "1 ianuarie 1993" } },
  ],
  neighbours: { en: "Germany, Poland, Slovakia, Austria", ro: "Germania, Polonia, Slovacia, Austria" },
  questions: [
    { id: "capital", q: { en: "Capital of Czechia", ro: "Capitala Cehiei" }, answers: ["Prague", "Praha", "Praga"], show: { en: "Prague", ro: "Praga" } },
    { id: "charles", q: { en: "14th-century stone bridge over the river in the capital", ro: "Podul de piatră din secolul al XIV-lea peste râul din capitală" }, answers: ["Charles Bridge", "Karlův most", "Karluv most", "Podul Carol"], show: { en: "Charles Bridge", ro: "Podul Carol" } },
    { id: "vltava", q: { en: "River through the capital, the subject of Smetana's symphonic poem", ro: "Râul care trece prin capitală, subiectul poemului simfonic al lui Smetana" }, answers: ["Vltava", "Moldau", "Vltava River"], show: { en: "Vltava", ro: "Vltava" } },
    { id: "pilsner", q: { en: "City that gave its name to pale lager beer", ro: "Orașul care a dat numele berii blonde lager" }, answers: ["Plzeň", "Plzen", "Pilsen"], show: { en: "Plzeň (Pilsen)", ro: "Plzeň (Pilsen)" } },
    { id: "brno", q: { en: "Second-largest city, capital of Moravia", ro: "Al doilea oraș ca mărime, capitala Moraviei" }, answers: ["Brno", "Brünn"], show: { en: "Brno", ro: "Brno" } },
    { id: "havel", q: { en: "Playwright who became president after 1989", ro: "Dramaturgul devenit președinte după 1989" }, answers: ["Václav Havel", "Vaclav Havel", "Havel"], show: { en: "Václav Havel", ro: "Václav Havel" } },
    { id: "velvet", q: { en: "Peaceful 1989 revolution that ended communist rule", ro: "Revoluția pașnică din 1989 care a pus capăt comunismului" }, answers: ["Velvet Revolution", "Velvet", "Revoluția de Catifea", "Revolutia de Catifea", "Sametová revoluce"], show: { en: "Velvet Revolution", ro: "Revoluția de Catifea" } },
    { id: "czechoslovakia", q: { en: "Country that split peacefully in 1993", ro: "Țara care s-a despărțit pașnic în 1993" }, answers: ["Czechoslovakia", "Cehoslovacia"], show: { en: "Czechoslovakia", ro: "Cehoslovacia" } },
    { id: "bohemia", q: { en: "Historic region in the west, around the capital", ro: "Regiunea istorică din vest, din jurul capitalei" }, answers: ["Bohemia", "Boemia", "Čechy", "Cechy"], show: { en: "Bohemia", ro: "Boemia" } },
    { id: "moravia", q: { en: "Historic region in the east, famous for its wine", ro: "Regiunea istorică din est, celebră pentru vin" }, answers: ["Moravia", "Morava"], show: { en: "Moravia", ro: "Moravia" } },
    { id: "koruna", q: { en: "Currency", ro: "Moneda" }, answers: ["koruna", "crown", "Czech koruna", "coroană", "coroana", "coroana cehă", "CZK"], show: { en: "Czech koruna", ro: "Coroana cehă" } },
    { id: "karlovy", q: { en: "Spa town of hot springs and an international film festival", ro: "Stațiunea balneară cu izvoare calde și festival internațional de film" }, answers: ["Karlovy Vary", "Carlsbad", "Karlsbad"], show: { en: "Karlovy Vary", ro: "Karlovy Vary" } },
    { id: "orloj", q: { en: "Medieval astronomical clock on the Old Town Square", ro: "Ceasul astronomic medieval din Piața Orașului Vechi" }, answers: ["Orloj", "Prague Orloj", "astronomical clock", "ceasul astronomic", "Pražský orloj"], show: { en: "Prague Orloj", ro: "Orloj (ceasul astronomic)" } },
    { id: "snezka", q: { en: "Highest mountain, on the Polish border", ro: "Cel mai înalt munte, la granița cu Polonia" }, answers: ["Sněžka", "Snezka", "Śnieżka", "Sniezka"], show: { en: "Sněžka", ro: "Sněžka" } },
    { id: "kafka", q: { en: "Prague-born author of \"The Metamorphosis\"", ro: "Autorul născut la Praga al „Metamorfozei”" }, answers: ["Franz Kafka", "Kafka"], show: { en: "Franz Kafka", ro: "Franz Kafka" } },
    { id: "dvorak", q: { en: "Composer of the \"New World\" Symphony", ro: "Compozitorul Simfoniei „Lumii Noi”" }, answers: ["Antonín Dvořák", "Antonin Dvorak", "Dvořák", "Dvorak"], show: { en: "Antonín Dvořák", ro: "Antonín Dvořák" } },
    { id: "krumlov", q: { en: "Riverside town with a huge castle (UNESCO) in South Bohemia", ro: "Orașul de pe malul râului cu un castel imens (UNESCO), în Boemia de Sud" }, answers: ["Český Krumlov", "Cesky Krumlov", "Krumlov"], show: { en: "Český Krumlov", ro: "Český Krumlov" } },
    { id: "skoda", q: { en: "Car maker from Mladá Boleslav", ro: "Constructorul de mașini din Mladá Boleslav" }, answers: ["Škoda", "Skoda"], show: { en: "Škoda", ro: "Škoda" } },
    { id: "defenestration", q: { en: "Event of 1618, when officials were thrown out of a castle window", ro: "Evenimentul din 1618, când oficiali au fost aruncați pe fereastra castelului" }, answers: ["Defenestration of Prague", "Defenestration", "Defenestrația", "Defenestratia", "Defenestrarea", "Defenestrarea de la Praga"], show: { en: "Defenestration of Prague", ro: "Defenestrarea de la Praga" } },
    { id: "1993", q: { en: "Year it became an independent state", ro: "Anul în care a devenit stat independent" }, answers: ["1993"], show: { en: "1993", ro: "1993" } },
  ],
}
