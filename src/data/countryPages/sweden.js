/**
 * Country page: Sweden (bilingual inline, like romania.js).
 * Facts: population 10.6 million (2024, SCB); area 450,295 km²; Kebnekaise about 2,097 m; National Day 6 June.
 */
export const SWEDEN_PAGE = {
  id: 'se',
  flag: '🇸🇪',
  name: { en: "Sweden", ro: "Suedia" },
  tagline: {
    en: "From the Øresund Bridge to Lapland: 21 counties of lakes, forests and the midnight sun.",
    ro: "De la Podul Øresund la Laponia: 21 de comitate cu lacuri, păduri și soarele de la miezul nopții.",
  },
  mapHint: { en: "Hover or tap a county", ro: "Treci cu mouse-ul sau atinge un comitat" },
  seatLabel: { en: 'capital', ro: 'capitala' },
  facts: [
    { icon: '🏛️', label: { en: "Capital", ro: "Capitala" }, value: { en: "Stockholm", ro: "Stockholm" } },
    { icon: '👥', label: { en: "Population", ro: "Populație" }, value: { en: "10.6 million (2024)", ro: "10,6 milioane (2024)" } },
    { icon: '📐', label: { en: "Area", ro: "Suprafață" }, value: { en: "450,295 km²", ro: "450.295 km²" } },
    { icon: '🗺️', label: { en: "Divisions", ro: "Diviziuni" }, value: { en: "21 counties", ro: "21 de comitate" } },
    { icon: '⛰️', label: { en: "Highest point", ro: "Cel mai înalt punct" }, value: { en: "Kebnekaise, about 2,097 m", ro: "Kebnekaise, circa 2.097 m" } },
    { icon: '💶', label: { en: "Currency", ro: "Moneda" }, value: { en: "Swedish krona (SEK)", ro: "Coroana suedeză (SEK)" } },
    { icon: '🗣️', label: { en: "Language", ro: "Limba" }, value: { en: "Swedish", ro: "Suedeză" } },
    { icon: '📅', label: { en: "National Day", ro: "Ziua Națională" }, value: { en: "6 June", ro: "6 iunie" } },
  ],
  neighbours: { en: "Norway and Finland; Denmark across the Øresund Bridge", ro: "Norvegia și Finlanda; Danemarca peste Podul Øresund" },
  questions: [
    { id: "capital", q: { en: "Capital of Sweden", ro: "Capitala Suediei" }, answers: ["Stockholm"], show: { en: "Stockholm", ro: "Stockholm" } },
    { id: "krona", q: { en: "Currency", ro: "Moneda" }, answers: ["krona", "kronor", "Swedish krona", "coroana", "coroană", "coroana suedeză", "SEK"], show: { en: "Krona", ro: "Coroana" } },
    { id: "ikea", q: { en: "Flat-pack furniture giant founded in Småland", ro: "Gigantul mobilei la pachet, fondat în Småland" }, answers: ["IKEA", "Ikea"], show: { en: "IKEA", ro: "IKEA" } },
    { id: "abba", q: { en: "Pop group that won Eurovision 1974 with \"Waterloo\"", ro: "Trupa pop care a câștigat Eurovisionul din 1974 cu „Waterloo”" }, answers: ["ABBA", "Abba"], show: { en: "ABBA", ro: "ABBA" } },
    { id: "nobel", q: { en: "Inventor of dynamite who left his fortune to famous prizes", ro: "Inventatorul dinamitei care și-a lăsat averea pentru premii celebre" }, answers: ["Nobel", "Alfred Nobel"], show: { en: "Alfred Nobel", ro: "Alfred Nobel" } },
    { id: "vanern", q: { en: "Largest lake, the biggest in the EU", ro: "Cel mai mare lac, cel mai mare din UE" }, answers: ["Vänern", "Vanern", "Lake Vänern", "Lacul Vänern"], show: { en: "Vänern", ro: "Vänern" } },
    { id: "gotland", q: { en: "Largest island, in the Baltic", ro: "Cea mai mare insulă, în Marea Baltică" }, answers: ["Gotland"], show: { en: "Gotland", ro: "Gotland" } },
    { id: "gothenburg", q: { en: "Second-largest city, home of Volvo", ro: "Al doilea oraș ca mărime, casa Volvo" }, answers: ["Gothenburg", "Göteborg", "Goteborg"], show: { en: "Gothenburg", ro: "Göteborg" } },
    { id: "oresund", q: { en: "Bridge and tunnel to Copenhagen", ro: "Podul și tunelul spre Copenhaga" }, answers: ["Øresund", "Oresund", "Öresund", "Øresund Bridge", "Podul Øresund"], show: { en: "Øresund Bridge", ro: "Podul Øresund" } },
    { id: "kebnekaise", q: { en: "Highest mountain, in Lapland", ro: "Cel mai înalt munte, în Laponia" }, answers: ["Kebnekaise"], show: { en: "Kebnekaise", ro: "Kebnekaise" } },
    { id: "sami", q: { en: "Indigenous reindeer-herding people of the north", ro: "Poporul indigen de crescători de reni din nord" }, answers: ["Sámi", "Sami", "Saami", "Lapps", "Sámi people", "saami"], show: { en: "Sámi", ro: "Sami" } },
    { id: "vasa", q: { en: "17th-century warship that sank on its maiden voyage, now a museum", ro: "Nava de război din secolul XVII scufundată la prima călătorie, acum muzeu" }, answers: ["Vasa", "Wasa"], show: { en: "Vasa", ro: "Vasa" } },
    { id: "midsummer", q: { en: "June festival with dancing around a maypole", ro: "Sărbătoarea din iunie cu dans în jurul unui stâlp împodobit" }, answers: ["Midsummer", "Midsommar", "Midsummer Eve", "Sânziene", "solstițiu"], show: { en: "Midsummer", ro: "Midsommar" } },
    { id: "lindgren", q: { en: "Author of \"Pippi Longstocking\"", ro: "Autoarea cărții „Pippi Șosețica”" }, answers: ["Lindgren", "Astrid Lindgren"], show: { en: "Astrid Lindgren", ro: "Astrid Lindgren" } },
    { id: "thunberg", q: { en: "Climate activist who began school strikes in 2018", ro: "Activista de mediu care a început grevele școlare în 2018" }, answers: ["Thunberg", "Greta Thunberg", "Greta"], show: { en: "Greta Thunberg", ro: "Greta Thunberg" } },
    { id: "baltic", q: { en: "Sea along its east coast", ro: "Marea de pe coasta de est" }, answers: ["Baltic", "Baltic Sea", "Marea Baltică", "Marea Baltica"], show: { en: "Baltic Sea", ro: "Marea Baltică" } },
    { id: "bothnia", q: { en: "Gulf between Sweden and Finland", ro: "Golful dintre Suedia și Finlanda" }, answers: ["Bothnia", "Gulf of Bothnia", "Golful Botnic", "Botnic", "Golful Botnia"], show: { en: "Gulf of Bothnia", ro: "Golful Botnic" } },
    { id: "spotify", q: { en: "Music-streaming service founded in Stockholm", ro: "Serviciul de streaming muzical fondat la Stockholm" }, answers: ["Spotify"], show: { en: "Spotify", ro: "Spotify" } },
    { id: "jukkasjarvi", q: { en: "Village in Lapland with the original Icehotel", ro: "Satul din Laponia cu primul Icehotel" }, answers: ["Jukkasjärvi", "Jukkasjarvi"], show: { en: "Jukkasjärvi", ro: "Jukkasjärvi" } },
    { id: "counties", q: { en: "How many counties?", ro: "Câte comitate are?" }, answers: ["21", "twenty-one", "douăzeci și unu", "douăzeci și unul"], show: { en: "21", ro: "21" } },
  ],
}
