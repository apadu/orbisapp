/**
 * Country page: Slovakia (bilingual inline, like romania.js).
 * Facts: population 5.45 million (2021 census); area 49,035 km²; Gerlachovský štít 2,655 m; independent since 1 January 1993; euro since 2009.
 */
export const SLOVAKIA_PAGE = {
  id: 'sk',
  flag: '🇸🇰',
  name: {"en": "Slovakia", "ro": "Slovacia"},
  tagline: {
    en: "The Tatras, castles and the Danube: 8 regions in the heart of Central Europe.",
    ro: "Munții Tatra, castele și Dunărea: 8 regiuni în inima Europei Centrale.",
  },
  mapHint: { en: "Hover or tap a region", ro: "Treci cu mouse-ul sau atinge o regiune" },
  facts: [
    { icon: '🏛️', label: { en: "Capital", ro: "Capitala" }, value: { en: "Bratislava", ro: "Bratislava" } },
    { icon: '👥', label: { en: "Population", ro: "Populație" }, value: { en: "5.4 million (2021 census)", ro: "5,4 milioane (recensământul din 2021)" } },
    { icon: '📐', label: { en: "Area", ro: "Suprafață" }, value: { en: "49,035 km²", ro: "49.035 km²" } },
    { icon: '🗺️', label: { en: "Divisions", ro: "Diviziuni" }, value: { en: "8 regions", ro: "8 regiuni" } },
    { icon: '⛰️', label: { en: "Highest point", ro: "Cel mai înalt punct" }, value: { en: "Gerlachovský štít, 2,655 m", ro: "Gerlachovský štít, 2.655 m" } },
    { icon: '💲', label: { en: "Currency", ro: "Moneda" }, value: { en: "Euro (since 2009)", ro: "Euro (din 2009)" } },
    { icon: '🗣️', label: { en: "Language", ro: "Limba" }, value: { en: "Slovak", ro: "Slovacă" } },
    { icon: '📅', label: { en: "Independence", ro: "Independența" }, value: { en: "1 January 1993", ro: "1 ianuarie 1993" } },
  ],
  neighbours: { en: "Czechia, Poland, Ukraine, Hungary, Austria", ro: "Cehia, Polonia, Ucraina, Ungaria, Austria" },
  questions: [
    { id: "capital", q: { en: "Capital of Slovakia", ro: "Capitala Slovaciei" }, answers: ["Bratislava", "Pressburg", "Pozsony"], show: { en: "Bratislava", ro: "Bratislava" } },
    { id: "danube", q: { en: "River through the capital", ro: "Fluviul care trece prin capitală" }, answers: ["Danube", "Dunărea", "Dunarea", "Dunaj", "Donau"], show: { en: "Danube", ro: "Dunărea" } },
    { id: "tatras", q: { en: "Highest mountains, shared with Poland", ro: "Cei mai înalți munți, împărțiți cu Polonia" }, answers: ["High Tatras", "Tatras", "Tatra", "Tatra Mountains", "Munții Tatra", "Muntii Tatra", "Tatra Mare", "Vysoké Tatry"], show: { en: "High Tatras", ro: "Munții Tatra" } },
    { id: "gerlach", q: { en: "Highest peak", ro: "Cel mai înalt vârf" }, answers: ["Gerlachovský štít", "Gerlachovsky stit", "Gerlach", "Gerlachovský", "Gerlach Peak"], show: { en: "Gerlachovský štít", ro: "Gerlachovský štít" } },
    { id: "vienna", q: { en: "Capital only about 55 km away, the closest pair of capitals in Europe", ro: "Capitala aflată la numai circa 55 km, cea mai apropiată pereche de capitale din Europa" }, answers: ["Vienna", "Wien", "Viena"], show: { en: "Vienna", ro: "Viena" } },
    { id: "euro", q: { en: "Currency since 2009", ro: "Moneda din 2009" }, answers: ["euro", "EUR", "€"], show: { en: "Euro", ro: "Euro" } },
    { id: "czechoslovakia", q: { en: "Country it formed with the Czechs until 1993", ro: "Țara pe care a format-o cu cehii până în 1993" }, answers: ["Czechoslovakia", "Cehoslovacia"], show: { en: "Czechoslovakia", ro: "Cehoslovacia" } },
    { id: "spis", q: { en: "Huge castle ruin in the east, one of Central Europe's largest", ro: "Ruina de castel uriașă din est, una dintre cele mai mari din Europa Centrală" }, answers: ["Spiš Castle", "Spis Castle", "Spiš", "Spis", "Spišský hrad", "Castelul Spiš"], show: { en: "Spiš Castle", ro: "Castelul Spiš" } },
    { id: "bojnice", q: { en: "Fairy-tale castle with a famous ghost festival", ro: "Castelul de basm cu un celebru festival al fantomelor" }, answers: ["Bojnice", "Bojnice Castle", "Castelul Bojnice"], show: { en: "Bojnice Castle", ro: "Castelul Bojnice" } },
    { id: "kosice", q: { en: "Second-largest city, in the east", ro: "Al doilea oraș ca mărime, în est" }, answers: ["Košice", "Kosice", "Kassa", "Cașovia", "Casovia"], show: { en: "Košice", ro: "Košice" } },
    { id: "sagan", q: { en: "Cyclist who won three road world championships in a row", ro: "Ciclistul care a câștigat trei titluri mondiale de șosea la rând" }, answers: ["Peter Sagan", "Sagan"], show: { en: "Peter Sagan", ro: "Peter Sagan" } },
    { id: "halusky", q: { en: "National dish of potato dumplings with sheep cheese", ro: "Felul național: găluște de cartofi cu brânză de oaie" }, answers: ["bryndzové halušky", "bryndzove halusky", "halušky", "halusky", "halusky cu branza"], show: { en: "Bryndzové halušky", ro: "Bryndzové halušky" } },
    { id: "paradise", q: { en: "National park of gorges, ladders and waterfalls", ro: "Parcul național cu chei, scări și cascade" }, answers: ["Slovak Paradise", "Slovenský raj", "Slovensky raj", "Paradisul Slovac", "Raiul Slovac"], show: { en: "Slovak Paradise", ro: "Paradisul Slovac" } },
    { id: "icecave", q: { en: "Cave in the Slovak Paradise lined with permanent ice", ro: "Peștera din Paradisul Slovac, căptușită cu gheață permanentă" }, answers: ["Dobšinská Ice Cave", "Dobsinska", "Dobšinská", "Dobšinská ľadová jaskyňa", "Peștera de gheață Dobšinská", "Pestera Dobsinska"], show: { en: "Dobšinská Ice Cave", ro: "Peștera de gheață Dobšinská" } },
    { id: "cars", q: { en: "Product it makes more of per person than any country", ro: "Produsul pe care îl face cel mai mult pe cap de locuitor din lume" }, answers: ["cars", "car", "automobile", "mașini", "masini", "automobile"], show: { en: "Cars", ro: "Mașini" } },
    { id: "caputova", q: { en: "First woman president, elected in 2019", ro: "Prima femeie președinte, aleasă în 2019" }, answers: ["Zuzana Čaputová", "Zuzana Caputova", "Čaputová", "Caputova"], show: { en: "Zuzana Čaputová", ro: "Zuzana Čaputová" } },
    { id: "hungary", q: { en: "Southern neighbour with a large minority in the country", ro: "Vecinul de la sud cu o minoritate numeroasă în țară" }, answers: ["Hungary", "Ungaria", "Magyarország"], show: { en: "Hungary", ro: "Ungaria" } },
    { id: "woodenchurches", q: { en: "Carpathian religious buildings on the UNESCO list, made without nails", ro: "Clădirile religioase din Carpați de pe lista UNESCO, făcute fără cuie" }, answers: ["wooden churches", "wooden church", "biserici de lemn", "biserica de lemn", "tserkvas"], show: { en: "Wooden churches", ro: "Bisericile de lemn" } },
    { id: "warhol", q: { en: "Pop artist whose parents came from the north-east; a museum is in Medzilaborce", ro: "Artistul pop ai cărui părinți erau din nord-est; are un muzeu la Medzilaborce" }, answers: ["Andy Warhol", "Warhol"], show: { en: "Andy Warhol", ro: "Andy Warhol" } },
    { id: "1993", q: { en: "Year it became an independent state", ro: "Anul în care a devenit stat independent" }, answers: ["1993"], show: { en: "1993", ro: "1993" } },
  ],
}
