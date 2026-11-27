/**
 * Senegal: the 14 regions, keyed by ISO 3166-2 code (= `id` in public/data/maps/sn.json).
 * No seats quiz: each region is named after its capital.
 */
export const SENEGAL = {
  id: 'sn',
  file: 'sn.json',
  country: "Senegal",
  divisions: [
    { id: 'SN-DK', name: "Dakar" },
    { id: 'SN-DB', name: "Diourbel" },
    { id: 'SN-FK', name: "Fatick" },
    { id: 'SN-KA', name: "Kaffrine" },
    { id: 'SN-KL', name: "Kaolack" },
    { id: 'SN-KE', name: "Kédougou", alt: ["Kedougou"] },
    { id: 'SN-KD', name: "Kolda" },
    { id: 'SN-LG', name: "Louga" },
    { id: 'SN-MT', name: "Matam" },
    { id: 'SN-SL', name: "Saint-Louis", alt: ["Saint Louis", "St-Louis", "St. Louis"] },
    { id: 'SN-SE', name: "Sédhiou", alt: ["Sedhiou"] },
    { id: 'SN-TC', name: "Tambacounda" },
    { id: 'SN-TH', name: "Thiès", alt: ["Thies"] },
    { id: 'SN-ZG', name: "Ziguinchor" },
  ],
}
