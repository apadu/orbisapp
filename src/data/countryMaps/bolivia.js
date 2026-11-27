/**
 * Bolivia: the 9 departments, keyed by ISO 3166-2 code (= `id` in public/data/maps/bo.json).
 * No seats quiz: most departments share their capital's name.
 */
export const BOLIVIA = {
  id: 'bo',
  file: 'bo.json',
  country: "Bolivia",
  divisions: [
    { id: 'BO-H', name: "Chuquisaca" },
    { id: 'BO-C', name: "Cochabamba" },
    { id: 'BO-B', name: "Beni", alt: ["El Beni"] },
    { id: 'BO-L', name: "La Paz" },
    { id: 'BO-O', name: "Oruro" },
    { id: 'BO-N', name: "Pando" },
    { id: 'BO-P', name: "Potosí", alt: ["Potosi"] },
    { id: 'BO-S', name: "Santa Cruz" },
    { id: 'BO-T', name: "Tarija" },
  ],
}
