/**
 * Australia: 6 states + 2 mainland territories, keyed by ISO 3166-2 code (= `id` in public/data/maps/au.json).
 * Small external territories (Jervis Bay, Lord Howe, Macquarie, Ashmore and Cartier) aren't on the map.
 */
export const AUSTRALIA = {
  id: 'au',
  file: 'au.json',
  country: "Australia",
  divisions: [
    { id: 'AU-ACT', name: "Australian Capital Territory", ro: "Teritoriul Capitalei Australiene", alt: ["ACT"], seat: "Canberra", city: true },
    { id: 'AU-NSW', name: "New South Wales", ro: "Noua Țară a Galilor de Sud", alt: ["NSW"], seat: "Sydney" },
    { id: 'AU-NT', name: "Northern Territory", ro: "Teritoriul de Nord", alt: ["NT"], seat: "Darwin" },
    { id: 'AU-QLD', name: "Queensland", seat: "Brisbane" },
    { id: 'AU-SA', name: "South Australia", ro: "Australia de Sud", seat: "Adelaide" },
    { id: 'AU-TAS', name: "Tasmania", seat: "Hobart" },
    { id: 'AU-VIC', name: "Victoria", seat: "Melbourne" },
    { id: 'AU-WA', name: "Western Australia", ro: "Australia de Vest", seat: "Perth" },
  ],
}
