/**
 * Canada: 10 provinces + 3 territories, keyed by ISO 3166-2 code (= `id` in public/data/maps/ca.json).
 * Drawn with a conic projection, so the Arctic isn't blown up the way Mercator does it.
 */
export const CANADA = {
  id: 'ca',
  file: 'ca.json',
  country: "Canada",
  projection: 'conicCanada',
  divisions: [
    { id: 'CA-AB', name: "Alberta", seat: "Edmonton" },
    { id: 'CA-BC', name: "British Columbia", ro: "Columbia Britanică", alt: ["BC"], seat: "Victoria" },
    { id: 'CA-MB', name: "Manitoba", seat: "Winnipeg" },
    { id: 'CA-NB', name: "New Brunswick", ro: "New Brunswick", alt: ["Noul Brunswick", "Nouveau-Brunswick"], seat: "Fredericton" },
    { id: 'CA-NL', name: "Newfoundland and Labrador", ro: "Terra Nova și Labrador", alt: ["Newfoundland", "Labrador", "Terra Nova"], seat: "St. John's", seatAlt: ["St Johns", "Saint Johns"] },
    { id: 'CA-NS', name: "Nova Scotia", ro: "Noua Scoție", alt: ["Nouvelle-Écosse"], seat: "Halifax" },
    { id: 'CA-NT', name: "Northwest Territories", ro: "Teritoriile de Nord-Vest", alt: ["NWT"], seat: "Yellowknife" },
    { id: 'CA-NU', name: "Nunavut", seat: "Iqaluit" },
    { id: 'CA-ON', name: "Ontario", seat: "Toronto" },
    { id: 'CA-PE', name: "Prince Edward Island", ro: "Insula Prințului Eduard", alt: ["PEI"], seat: "Charlottetown" },
    { id: 'CA-QC', name: "Quebec", ro: "Quebec", alt: ["Québec"], seat: "Quebec City", seatRo: "Orașul Quebec", seatAlt: ["Quebec", "Québec", "Ville de Québec"] },
    { id: 'CA-SK', name: "Saskatchewan", seat: "Regina" },
    { id: 'CA-YT', name: "Yukon", seat: "Whitehorse" },
  ],
}
