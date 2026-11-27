/**
 * Ghana: the 16 regions (six were created in 2018), keyed by ISO 3166-2 code (= `id` in
 * public/data/maps/gh.json, from geoBoundaries). Seats = regional capitals.
 */
export const GHANA = {
  id: 'gh',
  file: 'gh.json',
  country: "Ghana",
  divisions: [
    { id: 'GH-AA', name: "Greater Accra", alt: ["Accra", "Greater Accra Region", "Accra Mare"], seat: "Accra", seatAlt: ["Akra"] },
    { id: 'GH-AH', name: "Ashanti", alt: ["Asante", "Ashanti Region"], seat: "Kumasi" },
    { id: 'GH-AF', name: "Ahafo", alt: ["Ahafo Region"], seat: "Goaso" },
    { id: 'GH-BO', name: "Bono", alt: ["Bono Region", "Brong"], seat: "Sunyani" },
    { id: 'GH-BE', name: "Bono East", alt: ["Bono East Region", "Bono Est"], seat: "Techiman" },
    { id: 'GH-CP', name: "Central", alt: ["Central Region", "Centrală", "Centrala"], seat: "Cape Coast", seatAlt: ["Capecoast"] },
    { id: 'GH-EP', name: "Eastern", alt: ["Eastern Region", "Est", "Regiunea de Est"], seat: "Koforidua" },
    { id: 'GH-NP', name: "Northern", alt: ["Northern Region", "Nord", "Regiunea de Nord"], seat: "Tamale" },
    { id: 'GH-NE', name: "North East", alt: ["North East Region", "North-East", "Nord-Est"], seat: "Nalerigu" },
    { id: 'GH-OT', name: "Oti", alt: ["Oti Region"], seat: "Dambai" },
    { id: 'GH-SV', name: "Savannah", alt: ["Savannah Region", "Savana"], seat: "Damongo" },
    { id: 'GH-TV', name: "Volta", alt: ["Volta Region"], seat: "Ho" },
    { id: 'GH-UE', name: "Upper East", alt: ["Upper East Region"], seat: "Bolgatanga", seatAlt: ["Bolga"] },
    { id: 'GH-UW', name: "Upper West", alt: ["Upper West Region"], seat: "Wa" },
    { id: 'GH-WP', name: "Western", alt: ["Western Region", "Vest", "Regiunea de Vest"], seat: "Sekondi-Takoradi", seatAlt: ["Sekondi", "Takoradi", "Sekondi Takoradi"] },
    { id: 'GH-WN', name: "Western North", alt: ["Western North Region", "Vest-Nord"], seat: "Sefwi Wiawso", seatAlt: ["Wiawso", "Sefwi-Wiawso"] },
  ],
}
