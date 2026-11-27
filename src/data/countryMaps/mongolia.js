/**
 * Mongolia: the 21 aimags (provinces) and Ulaanbaatar, keyed by ISO 3166-2 code (= `id` in
 * public/data/maps/mn.json). Seats = aimag centres.
 */
export const MONGOLIA = {
  id: 'mn',
  file: 'mn.json',
  country: "Mongolia",
  divisions: [
    { id: 'MN-035', name: "Orkhon", alt: ["Orhon"], seat: "Erdenet" },
    { id: 'MN-037', name: "Darkhan-Uul", alt: ["Darhan-Uul", "Darkhan Uul", "Darkhan"], seat: "Darkhan", seatAlt: ["Darhan"] },
    { id: 'MN-039', name: "Khentii", alt: ["Hentiy", "Khentiy", "Hentii"], seat: "Chinggis", seatAlt: ["Chinggis City", "Öndörkhaan", "Ondorkhaan", "Undurkhaan"] },
    { id: 'MN-041', name: "Khövsgöl", alt: ["Khovsgol", "Hövsgöl", "Hovsgol", "Khuvsgul"], seat: "Mörön", seatAlt: ["Moron", "Muren"] },
    { id: 'MN-043', name: "Khovd", alt: ["Hovd", "Kobdo"], seat: "Khovd", seatAlt: ["Hovd"] },
    { id: 'MN-046', name: "Uvs", seat: "Ulaangom" },
    { id: 'MN-047', name: "Töv", alt: ["Tov", "Tuv"], seat: "Zuunmod" },
    { id: 'MN-049', name: "Selenge", seat: "Sükhbaatar", seatAlt: ["Sukhbaatar", "Suhbaatar"] },
    { id: 'MN-051', name: "Sükhbaatar", alt: ["Sukhbaatar", "Sühbaatar", "Suhbaatar"], seat: "Baruun-Urt", seatAlt: ["Baruun Urt", "Baruunurt"] },
    { id: 'MN-053', name: "Ömnögovi", alt: ["Omnogovi", "Umnugovi", "South Gobi", "Gobiul de Sud"], seat: "Dalanzadgad" },
    { id: 'MN-055', name: "Övörkhangai", alt: ["Ovorkhangai", "Övörhangay", "Uvurkhangai"], seat: "Arvaikheer", seatAlt: ["Arvayheer"] },
    { id: 'MN-057', name: "Zavkhan", alt: ["Dzavhan", "Zavhan"], seat: "Uliastai", seatAlt: ["Uliastay"] },
    { id: 'MN-059', name: "Dundgovi", alt: ["Middle Gobi", "Dundgobi"], seat: "Mandalgovi", seatAlt: ["Mandalgobi"] },
    { id: 'MN-061', name: "Dornod", seat: "Choibalsan", seatAlt: ["Choybalsan"] },
    { id: 'MN-063', name: "Dornogovi", alt: ["East Gobi", "Dornogobi"], seat: "Sainshand", seatAlt: ["Saynshand"] },
    { id: 'MN-064', name: "Govisümber", alt: ["Govisumber", "Govĭ-Sümber", "Govi-Sumber", "Gobisumber"], seat: "Choir", seatAlt: ["Choyr"] },
    { id: 'MN-065', name: "Govi-Altai", alt: ["Govi-Altay", "Gobi-Altai", "Govi Altai"], seat: "Altai", seatAlt: ["Altay"] },
    { id: 'MN-067', name: "Bulgan", seat: "Bulgan" },
    { id: 'MN-069', name: "Bayankhongor", alt: ["Bayanhongor"], seat: "Bayankhongor", seatAlt: ["Bayanhongor"] },
    { id: 'MN-071', name: "Bayan-Ölgii", alt: ["Bayan-Olgii", "Bayan-Ölgiy", "Bayan Olgii"], seat: "Ölgii", seatAlt: ["Olgii", "Ulgii"] },
    { id: 'MN-073', name: "Arkhangai", alt: ["Arhangay", "Arkhangay"], seat: "Tsetserleg" },
    { id: 'MN-1', name: "Ulaanbaatar", ro: "Ulan Bator", alt: ["Ulan Bator", "Ulaan Baatar"], city: true },
  ],
}
