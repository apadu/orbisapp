/**
 * Austria: the 9 federal states, keyed by ISO 3166-2 code (= `id` in public/data/maps/at.json).
 * Vienna is a state and the capital at once. Seats = state capitals.
 */
export const AUSTRIA = {
  id: 'at',
  file: 'at.json',
  country: "Austria",
  divisions: [
    { id: 'AT-1', name: "Burgenland", seat: "Eisenstadt" },
    { id: 'AT-2', name: "Carinthia", ro: "Carintia", alt: ["Kärnten", "Karnten", "Kaernten"], seat: "Klagenfurt", seatAlt: ["Klagenfurt am Wörthersee"] },
    { id: 'AT-3', name: "Lower Austria", ro: "Austria Inferioară", alt: ["Niederösterreich", "Niederosterreich"], seat: "St. Pölten", seatAlt: ["Sankt Pölten", "St Pölten", "St. Polten", "Sankt Polten"] },
    { id: 'AT-4', name: "Upper Austria", ro: "Austria Superioară", alt: ["Oberösterreich", "Oberosterreich"], seat: "Linz" },
    { id: 'AT-5', name: "Salzburg", seat: "Salzburg" },
    { id: 'AT-6', name: "Styria", ro: "Stiria", alt: ["Steiermark"], seat: "Graz" },
    { id: 'AT-7', name: "Tyrol", ro: "Tirol", alt: ["Tirol"], seat: "Innsbruck" },
    { id: 'AT-8', name: "Vorarlberg", seat: "Bregenz" },
    { id: 'AT-9', name: "Vienna", ro: "Viena", alt: ["Wien"], city: true },
  ],
}
