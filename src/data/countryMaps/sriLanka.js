/**
 * Sri Lanka: the 9 provinces, keyed by ISO 3166-2 code (= `id` in public/data/maps/lk.json,
 * merged from Natural Earth's districts). Seats = provincial capitals.
 */
export const SRI_LANKA = {
  id: 'lk',
  file: 'lk.json',
  country: "Sri Lanka",
  divisions: [
    { id: 'LK-1', name: "Western", ro: "Vest", alt: ["Western Province", "West"], seat: "Colombo" },
    { id: 'LK-2', name: "Central", ro: "Centrală", alt: ["Central Province", "Centrala", "Centru"], seat: "Kandy", seatAlt: ["Mahanuwara"] },
    { id: 'LK-3', name: "Southern", ro: "Sud", alt: ["Southern Province", "South"], seat: "Galle" },
    { id: 'LK-4', name: "Northern", ro: "Nord", alt: ["Northern Province", "North"], seat: "Jaffna" },
    { id: 'LK-5', name: "Eastern", ro: "Est", alt: ["Eastern Province", "East"], seat: "Trincomalee" },
    { id: 'LK-6', name: "North Western", ro: "Nord-Vest", alt: ["North Western Province", "North-Western", "Northwestern", "Nord Vest"], seat: "Kurunegala" },
    { id: 'LK-7', name: "North Central", ro: "Nord-Centrală", alt: ["North Central Province", "North-Central", "Nord-Central", "Nord Centrala"], seat: "Anuradhapura" },
    { id: 'LK-8', name: "Uva", alt: ["Uva Province"], seat: "Badulla" },
    { id: 'LK-9', name: "Sabaragamuwa", alt: ["Sabaragamuwa Province"], seat: "Ratnapura" },
  ],
}
