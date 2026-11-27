/**
 * New Zealand: the 16 regions (no Chatham Islands or the outlying subantarctic islands), keyed by
 * ISO 3166-2 code (= `id` in public/data/maps/nz.json). No seats quiz: regional councils sit in
 * towns that aren't well known (Whakatāne, Richmond…).
 */
export const NEW_ZEALAND = {
  id: 'nz',
  file: 'nz.json',
  country: "New Zealand",
  divisions: [
    { id: 'NZ-NTL', name: "Northland", alt: ["Te Tai Tokerau"] },
    { id: 'NZ-AUK', name: "Auckland", alt: ["Tāmaki Makaurau"] },
    { id: 'NZ-WKO', name: "Waikato" },
    { id: 'NZ-BOP', name: "Bay of Plenty", alt: ["Te Moana-a-Toi"] },
    { id: 'NZ-GIS', name: "Gisborne", alt: ["Gisborne District", "Tairāwhiti", "Tairawhiti"] },
    { id: 'NZ-HKB', name: "Hawke's Bay", alt: ["Hawkes Bay", "Hawke Bay", "Te Matau-a-Māui"] },
    { id: 'NZ-TKI', name: "Taranaki" },
    { id: 'NZ-MWT', name: "Manawatū-Whanganui", alt: ["Manawatu-Whanganui", "Manawatu-Wanganui", "Manawatu Whanganui", "Manawatu", "Horizons"] },
    { id: 'NZ-WGN', name: "Wellington", alt: ["Greater Wellington", "Te Upoko o te Ika"] },
    { id: 'NZ-TAS', name: "Tasman", alt: ["Tasman District"] },
    { id: 'NZ-NSN', name: "Nelson", alt: ["Nelson City", "Whakatū"] },
    { id: 'NZ-MBH', name: "Marlborough", alt: ["Marlborough District"] },
    { id: 'NZ-WTC', name: "West Coast", alt: ["Westland", "Te Tai Poutini"] },
    { id: 'NZ-CAN', name: "Canterbury", alt: ["Waitaha"] },
    { id: 'NZ-OTA', name: "Otago", alt: ["Ōtākou"] },
    { id: 'NZ-STL', name: "Southland", alt: ["Murihiku"] },
  ],
}
