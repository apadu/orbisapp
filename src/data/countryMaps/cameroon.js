/**
 * Cameroon: the 10 regions, keyed by ISO 3166-2 code (= `id` in public/data/maps/cm.json).
 * English and French names both work. Seats = regional capitals.
 */
export const CAMEROON = {
  id: 'cm',
  file: 'cm.json',
  country: "Cameroon",
  divisions: [
    { id: 'CM-AD', name: "Adamawa", ro: "Adamaoua", alt: ["Adamaoua"], seat: "Ngaoundéré", seatAlt: ["Ngaoundere"] },
    { id: 'CM-CE', name: "Centre", ro: "Centru", alt: ["Center", "Central", "Centre"], seat: "Yaoundé", seatAlt: ["Yaounde"] },
    { id: 'CM-EN', name: "Far North", ro: "Extremul Nord", alt: ["Extrême-Nord", "Extreme-Nord", "Extreme North", "Far-North"], seat: "Maroua" },
    { id: 'CM-ES', name: "East", ro: "Est", alt: ["Est", "Eastern"], seat: "Bertoua" },
    { id: 'CM-LT', name: "Littoral", ro: "Litoral", alt: ["Littoral"], seat: "Douala" },
    { id: 'CM-NO', name: "North", ro: "Nord", alt: ["Nord", "Northern"], seat: "Garoua" },
    { id: 'CM-NW', name: "Northwest", ro: "Nord-Vest", alt: ["North-West", "North West", "Nord-Ouest"], seat: "Bamenda" },
    { id: 'CM-OU', name: "West", ro: "Vest", alt: ["Ouest", "Western"], seat: "Bafoussam" },
    { id: 'CM-SU', name: "South", ro: "Sud", alt: ["Sud", "Southern"], seat: "Ebolowa" },
    { id: 'CM-SW', name: "Southwest", ro: "Sud-Vest", alt: ["South-West", "South West", "Sud-Ouest"], seat: "Buea", seatAlt: ["Buéa"] },
  ],
}
