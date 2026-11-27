/**
 * Belgium: the 10 provinces and the Brussels-Capital Region, keyed by ISO 3166-2 code (= `id` in
 * public/data/maps/be.json). Dutch and French names work. Seats = provincial capitals.
 */
export const BELGIUM = {
  id: 'be',
  file: 'be.json',
  country: "Belgium",
  divisions: [
    { id: 'BE-BRU', name: "Brussels", ro: "Bruxelles", alt: ["Bruxelles", "Brussel", "Brussels-Capital", "Brussels Capital Region", "Bruxelles-Capitale"], city: true },
    { id: 'BE-VAN', name: "Antwerp", ro: "Anvers", alt: ["Antwerpen", "Anvers"], seat: "Antwerp", seatRo: "Anvers", seatAlt: ["Antwerpen", "Anvers"] },
    { id: 'BE-VOV', name: "East Flanders", ro: "Flandra de Est", alt: ["Oost-Vlaanderen", "Flandre-Orientale", "Flandra Est", "Flandra Orientală"], seat: "Ghent", seatRo: "Gent", seatAlt: ["Gent", "Gand"] },
    { id: 'BE-VWV', name: "West Flanders", ro: "Flandra de Vest", alt: ["West-Vlaanderen", "Flandre-Occidentale", "Flandra Vest", "Flandra Occidentală"], seat: "Bruges", seatAlt: ["Brugge"] },
    { id: 'BE-VBR', name: "Flemish Brabant", ro: "Brabantul Flamand", alt: ["Vlaams-Brabant", "Brabant flamand", "Brabant Flamand"], seat: "Leuven", seatAlt: ["Louvain"] },
    { id: 'BE-VLI', name: "Limburg", alt: ["Limbourg"], seat: "Hasselt" },
    { id: 'BE-WBR', name: "Walloon Brabant", ro: "Brabantul Valon", alt: ["Brabant wallon", "Waals-Brabant", "Brabant Valon"], seat: "Wavre", seatAlt: ["Waver"] },
    { id: 'BE-WHT', name: "Hainaut", alt: ["Henegouwen"], seat: "Mons", seatAlt: ["Bergen"] },
    { id: 'BE-WLG', name: "Liège", alt: ["Liege", "Luik", "Lüttich"], seat: "Liège", seatAlt: ["Liege", "Luik"] },
    { id: 'BE-WLX', name: "Luxembourg", ro: "Luxemburg", alt: ["Luxemburg", "Luxembourg Province"], seat: "Arlon", seatAlt: ["Aarlen"] },
    { id: 'BE-WNA', name: "Namur", alt: ["Namen"], seat: "Namur", seatAlt: ["Namen"] },
  ],
}
