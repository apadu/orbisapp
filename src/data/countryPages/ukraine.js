/**
 * Country page: Ukraine (bilingual inline, like romania.js).
 * Facts: population 41 million (1 Jan 2022 estimate, before the full-scale invasion); area 603,628 km²; Hoverla 2,061 m; independence 24 August 1991.
 */
export const UKRAINE_PAGE = {
  id: 'ua',
  flag: '🇺🇦',
  name: {"en": "Ukraine", "ro": "Ucraina"},
  tagline: {
    en: "Wheat fields, the Dnieper and the Carpathians: 24 oblasts, Crimea, Kyiv and Sevastopol.",
    ro: "Lanuri de grâu, Niprul și Carpații: 24 de regiuni, Crimeea, Kievul și Sevastopolul.",
  },
  mapHint: { en: "Hover or tap an oblast", ro: "Treci cu mouse-ul sau atinge o regiune" },
  facts: [
    { icon: '🏛️', label: { en: "Capital", ro: "Capitala" }, value: { en: "Kyiv", ro: "Kiev" } },
    { icon: '👥', label: { en: "Population", ro: "Populație" }, value: { en: "41 million (2022 estimate)", ro: "41 de milioane (estimare 2022)" } },
    { icon: '📐', label: { en: "Area", ro: "Suprafață" }, value: { en: "603,628 km²", ro: "603.628 km²" } },
    { icon: '🗺️', label: { en: "Divisions", ro: "Diviziuni" }, value: { en: "24 oblasts, 1 autonomous republic, 2 cities", ro: "24 de regiuni, 1 republică autonomă, 2 orașe" } },
    { icon: '⛰️', label: { en: "Highest point", ro: "Cel mai înalt punct" }, value: { en: "Hoverla, 2,061 m", ro: "Hoverla, 2.061 m" } },
    { icon: '💴', label: { en: "Currency", ro: "Moneda" }, value: { en: "Hryvnia (UAH)", ro: "Grivna (UAH)" } },
    { icon: '🗣️', label: { en: "Language", ro: "Limba" }, value: { en: "Ukrainian", ro: "Ucraineană" } },
    { icon: '📅', label: { en: "Independence", ro: "Independența" }, value: { en: "24 August 1991", ro: "24 august 1991" } },
  ],
  neighbours: { en: "Belarus, Russia, Moldova, Romania, Hungary, Slovakia, Poland", ro: "Belarus, Rusia, Republica Moldova, România, Ungaria, Slovacia, Polonia" },
  questions: [
    { id: "capital", q: { en: "Capital of Ukraine", ro: "Capitala Ucrainei" }, answers: ["Kyiv", "Kiev", "Kyjiw"], show: { en: "Kyiv", ro: "Kiev" } },
    { id: "dnieper", q: { en: "River that flows through Kyiv", ro: "Râul care curge prin Kiev" }, answers: ["Dnieper", "Dnipro", "Nipru", "Niprul", "Dnepr"], show: { en: "Dnieper", ro: "Nipru" } },
    { id: "hoverla", q: { en: "Highest mountain", ro: "Cel mai înalt munte" }, answers: ["Hoverla", "Goverla", "Hoverla Mountain"], show: { en: "Hoverla", ro: "Hoverla" } },
    { id: "chernobyl", q: { en: "Site of the 1986 nuclear disaster", ro: "Locul dezastrului nuclear din 1986" }, answers: ["Chernobyl", "Chornobyl", "Cernobîl", "Cernobil"], show: { en: "Chernobyl", ro: "Cernobîl" } },
    { id: "odesa", q: { en: "Black Sea port with the Potemkin Stairs", ro: "Portul de la Marea Neagră cu Scările Potemkin" }, answers: ["Odesa", "Odessa"], show: { en: "Odesa", ro: "Odesa" } },
    { id: "lviv", q: { en: "Western city with a UNESCO old town and coffee houses", ro: "Orașul din vest cu centru vechi UNESCO și cafenele" }, answers: ["Lviv", "Liov", "Lvov", "Lemberg", "Lwów"], show: { en: "Lviv", ro: "Liov" } },
    { id: "yalta", q: { en: "Crimean resort of the 1945 Allied conference", ro: "Stațiunea din Crimeea a conferinței Aliaților din 1945" }, answers: ["Yalta", "Ialta", "Jalta"], show: { en: "Yalta", ro: "Ialta" } },
    { id: "shevchenko", q: { en: "National poet, author of \"Kobzar\"", ro: "Poetul național, autorul volumului „Kobzar”" }, answers: ["Taras Shevchenko", "Shevchenko", "Șevcenko", "Sevcenko", "Taras Șevcenko"], show: { en: "Taras Shevchenko", ro: "Taras Șevcenko" } },
    { id: "borscht", q: { en: "Beetroot soup", ro: "Supa de sfeclă roșie" }, answers: ["borscht", "borshch", "borsch", "borș", "bors"], show: { en: "Borscht", ro: "Borș" } },
    { id: "hryvnia", q: { en: "Currency", ro: "Moneda" }, answers: ["hryvnia", "hryvna", "grivna", "grivnă", "UAH"], show: { en: "Hryvnia", ro: "Grivna" } },
    { id: "azov", q: { en: "Sea east of Crimea", ro: "Marea de la est de Crimeea" }, answers: ["Sea of Azov", "Azov", "Marea Azov", "Marea Azovului"], show: { en: "Sea of Azov", ro: "Marea Azov" } },
    { id: "khortytsia", q: { en: "Dnieper island, home of the Zaporozhian Cossacks", ro: "Insula de pe Nipru, a cazacilor zaporojeni" }, answers: ["Khortytsia", "Khortytsya", "Hortița", "Hortita"], show: { en: "Khortytsia", ro: "Hortița" } },
    { id: "carpathians", q: { en: "Mountain range in the west", ro: "Lanțul muntos din vest" }, answers: ["Carpathians", "Carpathian Mountains", "Carpații", "Carpatii", "Carpati"], show: { en: "Carpathians", ro: "Carpații" } },
    { id: "1991", q: { en: "Year of independence", ro: "Anul independenței" }, answers: ["1991"], show: { en: "1991", ro: "1991" } },
    { id: "kharkiv", q: { en: "Second-largest city, in the east", ro: "Al doilea oraș ca mărime, în est" }, answers: ["Kharkiv", "Kharkov", "Harkov", "Harkiv"], show: { en: "Kharkiv", ro: "Harkov" } },
    { id: "orange", q: { en: "2004 protest movement named after a colour", ro: "Mișcarea de protest din 2004 numită după o culoare" }, answers: ["Orange Revolution", "Revoluția Portocalie", "Revolutia Portocalie", "Orange"], show: { en: "Orange Revolution", ro: "Revoluția Portocalie" } },
    { id: "vyshyvanka", q: { en: "Traditional embroidered shirt", ro: "Cămașa tradițională brodată" }, answers: ["vyshyvanka", "vyshyvanky", "vishivanka", "cămașă brodată", "camasa brodata"], show: { en: "Vyshyvanka", ro: "Vyshyvanka" } },
    { id: "pysanka", q: { en: "Easter egg decorated with wax-resist patterns", ro: "Oul de Paști decorat cu ceară" }, answers: ["pysanka", "pysanky", "pisanka", "ou încondeiat", "ou incondeiat", "ouă încondeiate"], show: { en: "Pysanka", ro: "Pysanka" } },
    { id: "kievanrus", q: { en: "Medieval state centred on Kyiv (9th–13th centuries)", ro: "Statul medieval cu centrul la Kiev (secolele IX–XIII)" }, answers: ["Kievan Rus'", "Kievan Rus", "Kyivan Rus", "Rusia Kieveană", "Rusia Kieveana", "Rus"], show: { en: "Kievan Rus'", ro: "Rusia Kieveană" } },
    { id: "blacksea", q: { en: "Sea on the southern coast", ro: "Marea de pe coasta de sud" }, answers: ["Black Sea", "Marea Neagră", "Marea Neagra"], show: { en: "Black Sea", ro: "Marea Neagră" } },
  ],
}
