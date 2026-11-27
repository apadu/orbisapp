/**
 * Country page: Switzerland (bilingual inline, like romania.js).
 * Facts: population 9.0 million (end 2024, FSO); area 41,285 km²; Dufourspitze 4,634 m; Federal Charter 1 August 1291.
 */
export const SWITZERLAND_PAGE = {
  id: 'ch',
  flag: '🇨🇭',
  name: {"en": "Switzerland", "ro": "Elveția"},
  tagline: {
    en: "Alps, lakes and four languages: 26 cantons in the heart of Europe.",
    ro: "Alpi, lacuri și patru limbi: 26 de cantoane în inima Europei.",
  },
  mapHint: { en: "Hover or tap a canton", ro: "Treci cu mouse-ul sau atinge un canton" },
  facts: [
    { icon: '🏛️', label: { en: "Capital", ro: "Capitala" }, value: { en: "Bern (federal city)", ro: "Berna (orașul federal)" } },
    { icon: '👥', label: { en: "Population", ro: "Populație" }, value: { en: "9.0 million (2024)", ro: "9,0 milioane (2024)" } },
    { icon: '📐', label: { en: "Area", ro: "Suprafață" }, value: { en: "41,285 km²", ro: "41.285 km²" } },
    { icon: '🗺️', label: { en: "Divisions", ro: "Diviziuni" }, value: { en: "26 cantons", ro: "26 de cantoane" } },
    { icon: '⛰️', label: { en: "Highest point", ro: "Cel mai înalt punct" }, value: { en: "Dufourspitze, 4,634 m", ro: "Dufourspitze, 4.634 m" } },
    { icon: '💲', label: { en: "Currency", ro: "Moneda" }, value: { en: "Swiss franc (CHF)", ro: "Francul elvețian (CHF)" } },
    { icon: '🗣️', label: { en: "Languages", ro: "Limbi" }, value: { en: "German, French, Italian, Romansh", ro: "Germană, franceză, italiană, retoromană" } },
    { icon: '📅', label: { en: "Founded", ro: "Fondare" }, value: { en: "1 August 1291", ro: "1 august 1291" } },
  ],
  neighbours: { en: "Germany, France, Italy, Austria, Liechtenstein", ro: "Germania, Franța, Italia, Austria, Liechtenstein" },
  questions: [
    { id: "capital", q: { en: "Federal city, seat of government", ro: "Orașul federal, sediul guvernului" }, answers: ["Bern", "Berne", "Berna"], show: { en: "Bern", ro: "Berna" } },
    { id: "zurich", q: { en: "Largest city, a financial centre", ro: "Cel mai mare oraș, centru financiar" }, answers: ["Zürich", "Zurich", "Zurigo"], show: { en: "Zürich", ro: "Zürich" } },
    { id: "geneva", q: { en: "City of the Red Cross and the UN's European headquarters", ro: "Orașul Crucii Roșii și al sediului european al ONU" }, answers: ["Geneva", "Genève", "Geneve", "Genf"], show: { en: "Geneva", ro: "Geneva" } },
    { id: "matterhorn", q: { en: "Pyramid-shaped peak above Zermatt", ro: "Vârful în formă de piramidă de deasupra Zermatt" }, answers: ["Matterhorn", "Cervin", "Monte Cervino", "Cervino"], show: { en: "Matterhorn", ro: "Matterhorn" } },
    { id: "dufour", q: { en: "Highest peak, in the Monte Rosa massif", ro: "Cel mai înalt vârf, în masivul Monte Rosa" }, answers: ["Dufourspitze", "Dufour", "Pointe Dufour", "Punta Dufour"], show: { en: "Dufourspitze", ro: "Dufourspitze" } },
    { id: "franc", q: { en: "Currency", ro: "Moneda" }, answers: ["franc", "Swiss franc", "franc elvețian", "franc elvetian", "CHF"], show: { en: "Swiss franc", ro: "Francul elvețian" } },
    { id: "romansh", q: { en: "Fourth national language, spoken in Graubünden", ro: "A patra limbă națională, vorbită în Graubünden" }, answers: ["Romansh", "Romansch", "Rumantsch", "retoromană", "retoromana", "romanșă", "romansa"], show: { en: "Romansh", ro: "Retoromana" } },
    { id: "watch", q: { en: "Precision product of the Jura valleys, from Rolex to Swatch", ro: "Produsul de precizie din văile Jura, de la Rolex la Swatch" }, answers: ["watch", "watches", "ceas", "ceasuri", "clock"], show: { en: "Watches", ro: "Ceasurile" } },
    { id: "fondue", q: { en: "Dish of melted cheese shared from one pot", ro: "Felul cu brânză topită, mâncat din aceeași oală" }, answers: ["fondue", "fondu", "cheese fondue"], show: { en: "Fondue", ro: "Fondue" } },
    { id: "leman", q: { en: "Largest lake, shared with France", ro: "Cel mai mare lac, împărțit cu Franța" }, answers: ["Lake Geneva", "Léman", "Leman", "Lac Léman", "Lacul Geneva", "Lacul Leman"], show: { en: "Lake Geneva (Léman)", ro: "Lacul Geneva (Léman)" } },
    { id: "rhinefalls", q: { en: "Europe's most powerful plain waterfall, near Schaffhausen", ro: "Cea mai puternică cascadă de câmpie a Europei, lângă Schaffhausen" }, answers: ["Rhine Falls", "Rheinfall", "Cascada Rinului", "Rhine"], show: { en: "Rhine Falls", ro: "Cascada Rinului" } },
    { id: "gotthard", q: { en: "World's longest railway tunnel (57 km), opened in 2016", ro: "Cel mai lung tunel feroviar din lume (57 km), deschis în 2016" }, answers: ["Gotthard", "Gotthard Base Tunnel", "Gotthard-Basistunnel", "Tunelul Gotthard", "St. Gotthard"], show: { en: "Gotthard Base Tunnel", ro: "Tunelul de bază Gotthard" } },
    { id: "tell", q: { en: "Legendary archer who shot an apple off his son's head", ro: "Arcașul legendar care a nimerit un măr pe capul fiului său" }, answers: ["William Tell", "Wilhelm Tell", "Tell", "Guillaume Tell", "Guglielmo Tell"], show: { en: "William Tell", ro: "Wilhelm Tell" } },
    { id: "neutral", q: { en: "Foreign-policy stance it has kept since 1815", ro: "Politica externă pe care o păstrează din 1815" }, answers: ["neutrality", "neutral", "neutralitate", "neutralitatea", "neutru"], show: { en: "Neutrality", ro: "Neutralitatea" } },
    { id: "cern", q: { en: "Physics lab near Geneva with the Large Hadron Collider", ro: "Laboratorul de fizică de lângă Geneva, cu Marele Accelerator de Hadroni" }, answers: ["CERN"], show: { en: "CERN", ro: "CERN" } },
    { id: "jungfraujoch", q: { en: "Pass with Europe's highest railway station", ro: "Pasul cu cea mai înaltă gară din Europa" }, answers: ["Jungfraujoch", "Jungfrau", "Top of Europe"], show: { en: "Jungfraujoch", ro: "Jungfraujoch" } },
    { id: "federer", q: { en: "Tennis player with 20 Grand Slam titles, born in Basel", ro: "Tenismanul cu 20 de titluri de Mare Șlem, născut la Basel" }, answers: ["Roger Federer", "Federer"], show: { en: "Roger Federer", ro: "Roger Federer" } },
    { id: "guard", q: { en: "Swiss soldiers who have guarded the Pope since 1506", ro: "Soldații elvețieni care îl păzesc pe Papă din 1506" }, answers: ["Swiss Guard", "Pontifical Swiss Guard", "Garda Elvețiană", "Garda Elvetiana", "Vatican"], show: { en: "Swiss Guard", ro: "Garda Elvețiană" } },
    { id: "chocolate", q: { en: "Sweet it is famous for: milk chocolate was invented here", ro: "Dulciurile pentru care e celebră: aici s-a inventat ciocolata cu lapte" }, answers: ["chocolate", "milk chocolate", "ciocolată", "ciocolata", "ciocolată cu lapte"], show: { en: "Chocolate", ro: "Ciocolata" } },
    { id: "1291", q: { en: "Year of the Federal Charter, celebrated on 1 August", ro: "Anul Cartei Federale, sărbătorită pe 1 august" }, answers: ["1291"], show: { en: "1291", ro: "1291" } },
  ],
}
