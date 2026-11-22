/**
 * Country page: Portugal (bilingual inline, like romania.js).
 * Facts: population 10.7 million (2024, INE); area 92,230 km²; Mount Pico 2,351 m; Republic proclaimed 5 October 1910.
 */
export const PORTUGAL_PAGE = {
  id: 'pt',
  flag: '🇵🇹',
  name: { en: "Portugal", ro: "Portugalia" },
  tagline: {
    en: "Lisbon, Porto and the Atlantic islands: 18 districts plus the Azores and Madeira.",
    ro: "Lisabona, Porto și insulele din Atlantic: 18 districte plus Azorele și Madeira.",
  },
  mapHint: { en: "Hover or tap a district", ro: "Treci cu mouse-ul sau atinge un district" },
  facts: [
    { icon: '🏛️', label: { en: "Capital", ro: "Capitala" }, value: { en: "Lisbon", ro: "Lisabona" } },
    { icon: '👥', label: { en: "Population", ro: "Populație" }, value: { en: "10.7 million (2024)", ro: "10,7 milioane (2024)" } },
    { icon: '📐', label: { en: "Area", ro: "Suprafață" }, value: { en: "92,230 km²", ro: "92.230 km²" } },
    { icon: '🗺️', label: { en: "Divisions", ro: "Diviziuni" }, value: { en: "18 districts and 2 autonomous regions", ro: "18 districte și 2 regiuni autonome" } },
    { icon: '⛰️', label: { en: "Highest point", ro: "Cel mai înalt punct" }, value: { en: "Mount Pico (Azores), 2,351 m", ro: "Muntele Pico (Azore), 2.351 m" } },
    { icon: '💶', label: { en: "Currency", ro: "Moneda" }, value: { en: "Euro (EUR)", ro: "Euro (EUR)" } },
    { icon: '🗣️', label: { en: "Language", ro: "Limba" }, value: { en: "Portuguese", ro: "Portugheză" } },
    { icon: '📅', label: { en: "Republic", ro: "Republica" }, value: { en: "5 October 1910", ro: "5 octombrie 1910" } },
  ],
  neighbours: { en: "Spain", ro: "Spania" },
  questions: [
    { id: "capital", q: { en: "Capital of Portugal", ro: "Capitala Portugaliei" }, answers: ["Lisbon", "Lisabona", "Lisboa"], show: { en: "Lisbon", ro: "Lisabona" } },
    { id: "porto", q: { en: "Second-largest city, at the mouth of the Douro", ro: "Al doilea oraș ca mărime, la gura Douro-ului" }, answers: ["Porto", "Oporto"], show: { en: "Porto", ro: "Porto" } },
    { id: "port", q: { en: "Fortified wine named after that city", ro: "Vinul fortifiat numit după acel oraș" }, answers: ["port", "port wine", "porto", "vin de Porto"], show: { en: "Port wine", ro: "Vin de Porto" } },
    { id: "gama", q: { en: "Navigator who first sailed from Europe to India", ro: "Navigatorul care a ajuns primul pe mare din Europa în India" }, answers: ["Vasco da Gama", "da Gama", "Gama"], show: { en: "Vasco da Gama", ro: "Vasco da Gama" } },
    { id: "magellan", q: { en: "Navigator who led the first voyage around the world", ro: "Navigatorul care a condus prima călătorie în jurul lumii" }, answers: ["Magellan", "Magelan", "Fernão de Magalhães", "Ferdinand Magellan", "Magalhães"], show: { en: "Magellan", ro: "Magellan" } },
    { id: "azores", q: { en: "Atlantic archipelago with the highest peak", ro: "Arhipelagul din Atlantic cu cel mai înalt vârf" }, answers: ["Azores", "Azore", "Açores", "Acores", "Insulele Azore"], show: { en: "Azores", ro: "Azore" } },
    { id: "madeira", q: { en: "Island where Cristiano Ronaldo was born", ro: "Insula pe care s-a născut Cristiano Ronaldo" }, answers: ["Madeira"], show: { en: "Madeira", ro: "Madeira" } },
    { id: "1755", q: { en: "Year an earthquake and tsunami destroyed Lisbon", ro: "Anul în care un cutremur și un tsunami au distrus Lisabona" }, answers: ["1755"], show: { en: "1755", ro: "1755" } },
    { id: "tagus", q: { en: "River that flows through Lisbon", ro: "Râul care curge prin Lisabona" }, answers: ["Tagus", "Tejo", "Tajo", "Tag", "Tagul"], show: { en: "Tagus", ro: "Tajo" } },
    { id: "fado", q: { en: "Melancholic traditional song of Lisbon", ro: "Cântecul tradițional melancolic al Lisabonei" }, answers: ["fado"], show: { en: "Fado", ro: "Fado" } },
    { id: "nata", q: { en: "Custard tart from Belém", ro: "Tarta cu cremă de ou din Belém" }, answers: ["pastel de nata", "pastéis de nata", "pastel de Belém", "nata", "pasteis de nata"], show: { en: "Pastel de nata", ro: "Pastel de nata" } },
    { id: "azulejos", q: { en: "Painted blue-and-white ceramic tiles", ro: "Plăcile ceramice pictate în alb și albastru" }, answers: ["azulejos", "azulejo"], show: { en: "Azulejos", ro: "Azulejos" } },
    { id: "algarve", q: { en: "Sunny southern region of beaches and cliffs", ro: "Regiunea însorită din sud, cu plaje și faleze" }, answers: ["Algarve"], show: { en: "Algarve", ro: "Algarve" } },
    { id: "roca", q: { en: "Westernmost point of mainland Europe", ro: "Cel mai vestic punct al Europei continentale" }, answers: ["Cabo da Roca", "Cape Roca", "Capul Roca", "Roca"], show: { en: "Cabo da Roca", ro: "Cabo da Roca" } },
    { id: "1974", q: { en: "Year of the Carnation Revolution", ro: "Anul Revoluției Garoafelor" }, answers: ["1974"], show: { en: "1974", ro: "1974" } },
    { id: "fatima", q: { en: "Pilgrimage town of the 1917 apparitions", ro: "Orașul de pelerinaj al aparițiilor din 1917" }, answers: ["Fátima", "Fatima"], show: { en: "Fátima", ro: "Fátima" } },
    { id: "brazil", q: { en: "Largest former colony, where most Portuguese speakers live", ro: "Cea mai mare fostă colonie, unde trăiesc cei mai mulți vorbitori de portugheză" }, answers: ["Brazil", "Brazilia", "Brasil"], show: { en: "Brazil", ro: "Brazilia" } },
    { id: "cork", q: { en: "Bark product it supplies about half of the world's", ro: "Produsul din scoarță din care furnizează circa jumătate din lume" }, answers: ["cork", "plută", "pluta", "cork oak"], show: { en: "Cork", ro: "Plută" } },
    { id: "1143", q: { en: "Year the kingdom was recognised (Treaty of Zamora)", ro: "Anul recunoașterii regatului (Tratatul de la Zamora)" }, answers: ["1143"], show: { en: "1143", ro: "1143" } },
    { id: "douro", q: { en: "River valley of the port vineyards", ro: "Valea râului cu podgoriile vinului de Porto" }, answers: ["Douro", "Duero"], show: { en: "Douro", ro: "Douro" } },
  ],
}
