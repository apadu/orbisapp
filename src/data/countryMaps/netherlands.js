/**
 * Netherlands: the 12 provinces (European part; no Caribbean Netherlands), keyed by ISO 3166-2
 * code (= `id` in public/data/maps/nl.json). Seats = provincial capitals.
 */
export const NETHERLANDS = {
  id: 'nl',
  file: 'nl.json',
  country: "Netherlands",
  divisions: [
    { id: 'NL-GR', name: "Groningen", seat: "Groningen" },
    { id: 'NL-FR', name: "Friesland", ro: "Frizia", alt: ["Fryslân", "Frisia", "Friesland"], seat: "Leeuwarden", seatAlt: ["Ljouwert"] },
    { id: 'NL-DR', name: "Drenthe", seat: "Assen" },
    { id: 'NL-OV', name: "Overijssel", seat: "Zwolle" },
    { id: 'NL-FL', name: "Flevoland", seat: "Lelystad" },
    { id: 'NL-GE', name: "Gelderland", seat: "Arnhem" },
    { id: 'NL-UT', name: "Utrecht", seat: "Utrecht" },
    { id: 'NL-NH', name: "North Holland", ro: "Olanda de Nord", alt: ["Noord-Holland", "Noord Holland"], seat: "Haarlem" },
    { id: 'NL-ZH', name: "South Holland", ro: "Olanda de Sud", alt: ["Zuid-Holland", "Zuid Holland"], seat: "The Hague", seatRo: "Haga", seatAlt: ["Den Haag", "'s-Gravenhage", "Hague"] },
    { id: 'NL-ZE', name: "Zeeland", ro: "Zeelanda", alt: ["Zealand"], seat: "Middelburg" },
    { id: 'NL-NB', name: "North Brabant", ro: "Brabantul de Nord", alt: ["Noord-Brabant", "Noord Brabant", "Brabant"], seat: "'s-Hertogenbosch", seatAlt: ["Den Bosch", "Hertogenbosch", "s-Hertogenbosch"] },
    { id: 'NL-LI', name: "Limburg", seat: "Maastricht" },
  ],
}
