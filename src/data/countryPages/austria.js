/**
 * Country page: Austria (bilingual inline, like romania.js).
 * Facts: population 9.2 million (1 Jan 2025, Statistik Austria); area 83,879 km²; Grossglockner 3,798 m; republic proclaimed 12 November 1918.
 */
export const AUSTRIA_PAGE = {
  id: 'at',
  flag: '🇦🇹',
  name: {"en": "Austria", "ro": "Austria"},
  tagline: {
    en: "Alps, the Danube and Vienna's coffee houses: 9 states from Lake Constance to the Pannonian plain.",
    ro: "Alpii, Dunărea și cafenelele Vienei: 9 landuri, de la Lacul Constanța la câmpia Panonică.",
  },
  mapHint: { en: "Hover or tap a state", ro: "Treci cu mouse-ul sau atinge un land" },
  facts: [
    { icon: '🏛️', label: { en: "Capital", ro: "Capitala" }, value: { en: "Vienna", ro: "Viena" } },
    { icon: '👥', label: { en: "Population", ro: "Populație" }, value: { en: "9.2 million (2025)", ro: "9,2 milioane (2025)" } },
    { icon: '📐', label: { en: "Area", ro: "Suprafață" }, value: { en: "83,879 km²", ro: "83.879 km²" } },
    { icon: '🗺️', label: { en: "Divisions", ro: "Diviziuni" }, value: { en: "9 federal states", ro: "9 landuri federale" } },
    { icon: '⛰️', label: { en: "Highest point", ro: "Cel mai înalt punct" }, value: { en: "Grossglockner, 3,798 m", ro: "Grossglockner, 3.798 m" } },
    { icon: '💶', label: { en: "Currency", ro: "Moneda" }, value: { en: "Euro (EUR)", ro: "Euro (EUR)" } },
    { icon: '🗣️', label: { en: "Language", ro: "Limba" }, value: { en: "German", ro: "Germană" } },
    { icon: '📅', label: { en: "Republic", ro: "Republica" }, value: { en: "12 November 1918", ro: "12 noiembrie 1918" } },
  ],
  neighbours: { en: "Germany, Czechia, Slovakia, Hungary, Slovenia, Italy, Switzerland, Liechtenstein", ro: "Germania, Cehia, Slovacia, Ungaria, Slovenia, Italia, Elveția, Liechtenstein" },
  questions: [
    { id: "capital", q: { en: "Capital of Austria", ro: "Capitala Austriei" }, answers: ["Vienna", "Viena", "Wien"], show: { en: "Vienna", ro: "Viena" } },
    { id: "mozart", q: { en: "Composer born in Salzburg in 1756", ro: "Compozitorul născut la Salzburg în 1756" }, answers: ["Mozart", "Wolfgang Amadeus Mozart", "Wolfgang Mozart"], show: { en: "Wolfgang Amadeus Mozart", ro: "Wolfgang Amadeus Mozart" } },
    { id: "grossglockner", q: { en: "Highest mountain", ro: "Cel mai înalt munte" }, answers: ["Grossglockner", "Großglockner", "Glockner"], show: { en: "Grossglockner", ro: "Grossglockner" } },
    { id: "sisi", q: { en: "Habsburg empress nicknamed Sisi", ro: "Împărăteasa habsburgică poreclită Sisi" }, answers: ["Elisabeth", "Sisi", "Sissi", "Empress Elisabeth", "Elisabeta", "Elisabeth of Austria"], show: { en: "Elisabeth (Sisi)", ro: "Elisabeta (Sisi)" } },
    { id: "schonbrunn", q: { en: "Imperial summer palace in Vienna", ro: "Palatul imperial de vară din Viena" }, answers: ["Schönbrunn", "Schonbrunn", "Schoenbrunn", "Schönbrunn Palace"], show: { en: "Schönbrunn", ro: "Schönbrunn" } },
    { id: "danube", q: { en: "River that flows through Vienna and Linz", ro: "Fluviul care trece prin Viena și Linz" }, answers: ["Danube", "Dunărea", "Dunarea", "Donau", "Dunăre"], show: { en: "Danube", ro: "Dunărea" } },
    { id: "freud", q: { en: "Founder of psychoanalysis, who lived in Vienna", ro: "Fondatorul psihanalizei, care a trăit la Viena" }, answers: ["Freud", "Sigmund Freud"], show: { en: "Sigmund Freud", ro: "Sigmund Freud" } },
    { id: "schnitzel", q: { en: "Breaded veal cutlet named after the capital", ro: "Șnițelul de vițel pane numit după capitală" }, answers: ["Wiener Schnitzel", "Schnitzel", "șnițel vienez", "snitel vienez", "șnițel", "snitel"], show: { en: "Wiener Schnitzel", ro: "Șnițel vienez" } },
    { id: "sacher", q: { en: "Chocolate cake from the Hotel Sacher", ro: "Tortul de ciocolată de la Hotel Sacher" }, answers: ["Sachertorte", "Sacher", "Sacher torte", "tort Sacher"], show: { en: "Sachertorte", ro: "Sachertorte" } },
    { id: "neusiedl", q: { en: "Steppe lake shared with Hungary", ro: "Lacul de stepă împărțit cu Ungaria" }, answers: ["Neusiedl", "Lake Neusiedl", "Neusiedler See", "Fertő", "Ferto", "Lacul Neusiedl"], show: { en: "Lake Neusiedl", ro: "Lacul Neusiedl" } },
    { id: "soundofmusic", q: { en: "1965 musical film set in Salzburg", ro: "Filmul muzical din 1965 care se petrece la Salzburg" }, answers: ["The Sound of Music", "Sound of Music", "Sunetul muzicii"], show: { en: "The Sound of Music", ro: "Sunetul muzicii" } },
    { id: "innsbruck", q: { en: "Tyrolean city that hosted the Winter Olympics in 1964 and 1976", ro: "Orașul tirolez care a găzduit Olimpiada de iarnă în 1964 și 1976" }, answers: ["Innsbruck"], show: { en: "Innsbruck", ro: "Innsbruck" } },
    { id: "1955", q: { en: "Year of the State Treaty that restored full independence", ro: "Anul Tratatului de Stat care a redat independența deplină" }, answers: ["1955"], show: { en: "1955", ro: "1955" } },
    { id: "strauss", q: { en: "\"Waltz King\", composer of The Blue Danube", ro: "„Regele valsului”, compozitorul „Dunării albastre”" }, answers: ["Johann Strauss", "Strauss", "Johann Strauss II", "Strauss II"], show: { en: "Johann Strauss II", ro: "Johann Strauss II" } },
    { id: "lipizzaner", q: { en: "White horses of the Spanish Riding School", ro: "Caii albi ai Școlii Spaniole de Călărie" }, answers: ["Lipizzaner", "Lipizzan", "Lipizzaners", "lipițan", "lipitan", "lipițani"], show: { en: "Lipizzaner", ro: "Lipițan" } },
    { id: "schrodinger", q: { en: "Physicist of the famous thought experiment with a cat", ro: "Fizicianul faimosului experiment mental cu pisica" }, answers: ["Schrödinger", "Schrodinger", "Schroedinger", "Erwin Schrödinger"], show: { en: "Erwin Schrödinger", ro: "Erwin Schrödinger" } },
    { id: "alps", q: { en: "Mountains covering about two-thirds of the country", ro: "Munții care acoperă circa două treimi din țară" }, answers: ["Alps", "Alpi", "Alpii", "Alpen"], show: { en: "Alps", ro: "Alpii" } },
    { id: "graz", q: { en: "Capital of Styria and second-largest city", ro: "Capitala Stiriei și al doilea oraș ca mărime" }, answers: ["Graz"], show: { en: "Graz", ro: "Graz" } },
    { id: "brenner", q: { en: "Alpine pass on the main road to Italy", ro: "Pasul alpin de pe drumul principal spre Italia" }, answers: ["Brenner", "Brenner Pass", "Pasul Brenner", "Brennerpass"], show: { en: "Brenner Pass", ro: "Pasul Brenner" } },
    { id: "constance", q: { en: "Lake shared with Germany and Switzerland at the western tip", ro: "Lacul împărțit cu Germania și Elveția, în extremitatea vestică" }, answers: ["Lake Constance", "Constance", "Bodensee", "Lacul Constanța", "Lacul Constanta", "Bodan"], show: { en: "Lake Constance", ro: "Lacul Constanța" } },
  ],
}
