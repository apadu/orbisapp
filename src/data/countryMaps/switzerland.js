/**
 * Switzerland: the 26 cantons, keyed by ISO 3166-2 code (= `id` in public/data/maps/ch.json).
 * German, French and Italian names all work. Seats = cantonal capitals.
 */
export const SWITZERLAND = {
  id: 'ch',
  file: 'ch.json',
  country: "Switzerland",
  divisions: [
    { id: 'CH-AG', name: "Aargau", ro: "Argovia", alt: ["Argovie", "Argovia"], seat: "Aarau" },
    { id: 'CH-AI', name: "Appenzell Innerrhoden", alt: ["Appenzell Inner Rhodes", "Appenzell Rhodes-Intérieures", "Innerrhoden"], seat: "Appenzell" },
    { id: 'CH-AR', name: "Appenzell Ausserrhoden", alt: ["Appenzell Outer Rhodes", "Appenzell Rhodes-Extérieures", "Ausserrhoden"], seat: "Herisau" },
    { id: 'CH-BE', name: "Bern", ro: "Berna", alt: ["Berne", "Berna"], seat: "Bern", seatRo: "Berna", seatAlt: ["Berne", "Berna"] },
    { id: 'CH-BL', name: "Basel-Landschaft", alt: ["Basel-Land", "Basel Country", "Bâle-Campagne", "Basel Landschaft"], seat: "Liestal" },
    { id: 'CH-BS', name: "Basel-Stadt", alt: ["Basel City", "Bâle-Ville", "Basel Stadt"], seat: "Basel", seatAlt: ["Bâle", "Basle"] },
    { id: 'CH-FR', name: "Fribourg", alt: ["Freiburg", "Friburgo"], seat: "Fribourg", seatAlt: ["Freiburg"] },
    { id: 'CH-GE', name: "Geneva", ro: "Geneva", alt: ["Genève", "Geneve", "Genf", "Ginevra"], seat: "Geneva", seatAlt: ["Genève", "Geneve", "Genf"] },
    { id: 'CH-GL', name: "Glarus", alt: ["Glaris"], seat: "Glarus", seatAlt: ["Glaris"] },
    { id: 'CH-GR', name: "Graubünden", alt: ["Graubunden", "Grisons", "Grigioni", "Grischun", "Grisunilor"], seat: "Chur", seatAlt: ["Coire", "Coira"] },
    { id: 'CH-JU', name: "Jura", seat: "Delémont", seatAlt: ["Delemont"] },
    { id: 'CH-LU', name: "Lucerne", ro: "Lucerna", alt: ["Luzern", "Lucerna"], seat: "Lucerne", seatRo: "Lucerna", seatAlt: ["Luzern", "Lucerna"] },
    { id: 'CH-NE', name: "Neuchâtel", alt: ["Neuchatel", "Neuenburg"], seat: "Neuchâtel", seatAlt: ["Neuchatel", "Neuenburg"] },
    { id: 'CH-NW', name: "Nidwalden", alt: ["Nidwald"], seat: "Stans" },
    { id: 'CH-OW', name: "Obwalden", alt: ["Obwald"], seat: "Sarnen" },
    { id: 'CH-SG', name: "St. Gallen", alt: ["Sankt Gallen", "St Gallen", "Saint-Gall", "San Gallo"], seat: "St. Gallen", seatAlt: ["Sankt Gallen", "St Gallen", "Saint-Gall"] },
    { id: 'CH-SH', name: "Schaffhausen", alt: ["Schaffhouse"], seat: "Schaffhausen", seatAlt: ["Schaffhouse"] },
    { id: 'CH-SO', name: "Solothurn", alt: ["Soleure"], seat: "Solothurn", seatAlt: ["Soleure"] },
    { id: 'CH-SZ', name: "Schwyz", alt: ["Schwytz", "Svitto"], seat: "Schwyz" },
    { id: 'CH-TG', name: "Thurgau", ro: "Turgovia", alt: ["Thurgovie", "Turgovia", "Thurgovia"], seat: "Frauenfeld" },
    { id: 'CH-TI', name: "Ticino", alt: ["Tessin"], seat: "Bellinzona", seatAlt: ["Bellinzone", "Bellenz"] },
    { id: 'CH-UR', name: "Uri", seat: "Altdorf" },
    { id: 'CH-VD', name: "Vaud", alt: ["Waadt"], seat: "Lausanne", seatAlt: ["Losanna"] },
    { id: 'CH-VS', name: "Valais", alt: ["Wallis", "Vallese"], seat: "Sion", seatAlt: ["Sitten"] },
    { id: 'CH-ZG', name: "Zug", alt: ["Zoug"], seat: "Zug", seatAlt: ["Zoug"] },
    { id: 'CH-ZH', name: "Zürich", alt: ["Zurich", "Zurigo"], seat: "Zürich", seatAlt: ["Zurich"] },
  ],
}
