/**
 * Czechia: the 13 regions and Prague, keyed by ISO 3166-2 code (= `id` in public/data/maps/cz.json).
 * English and Czech names work. Seats = regional capitals (the Central Bohemian Region is run from Prague).
 */
export const CZECHIA = {
  id: 'cz',
  file: 'cz.json',
  country: "Czechia",
  divisions: [
    { id: 'CZ-PR', name: "Prague", ro: "Praga", alt: ["Praha", "Praga"], city: true },
    { id: 'CZ-ST', name: "Central Bohemian", ro: "Boemia Centrală", alt: ["Central Bohemia", "Středočeský", "Stredocesky", "Boemia Centrala"], seat: "Prague", seatRo: "Praga", seatAlt: ["Praha", "Praga"] },
    { id: 'CZ-JC', name: "South Bohemian", ro: "Boemia de Sud", alt: ["South Bohemia", "Jihočeský", "Jihocesky"], seat: "České Budějovice", seatAlt: ["Ceske Budejovice", "Budweis", "Budějovice"] },
    { id: 'CZ-PL', name: "Plzeň", alt: ["Plzen", "Pilsen", "Plzeňský", "Plzen Region"], seat: "Plzeň", seatAlt: ["Plzen", "Pilsen"] },
    { id: 'CZ-KA', name: "Karlovy Vary", alt: ["Karlovarský", "Karlovarsky", "Carlsbad", "Karlsbad"], seat: "Karlovy Vary", seatAlt: ["Carlsbad", "Karlsbad"] },
    { id: 'CZ-US', name: "Ústí nad Labem", alt: ["Usti nad Labem", "Ústecký", "Ustecky", "Usti"], seat: "Ústí nad Labem", seatAlt: ["Usti nad Labem", "Usti"] },
    { id: 'CZ-LI', name: "Liberec", alt: ["Liberecký", "Liberecky"], seat: "Liberec" },
    { id: 'CZ-KR', name: "Hradec Králové", alt: ["Hradec Kralove", "Královéhradecký", "Kralovehradecky"], seat: "Hradec Králové", seatAlt: ["Hradec Kralove"] },
    { id: 'CZ-PA', name: "Pardubice", alt: ["Pardubický", "Pardubicky"], seat: "Pardubice" },
    { id: 'CZ-VY', name: "Vysočina", alt: ["Vysocina", "Bohemian-Moravian Highlands"], seat: "Jihlava" },
    { id: 'CZ-JM', name: "South Moravian", ro: "Moravia de Sud", alt: ["South Moravia", "Jihomoravský", "Jihomoravsky"], seat: "Brno", seatAlt: ["Brünn"] },
    { id: 'CZ-OL', name: "Olomouc", alt: ["Olomoucký", "Olomoucky"], seat: "Olomouc" },
    { id: 'CZ-ZL', name: "Zlín", alt: ["Zlin", "Zlínský", "Zlinsky"], seat: "Zlín", seatAlt: ["Zlin"] },
    { id: 'CZ-MO', name: "Moravian-Silesian", ro: "Moravia-Silezia", alt: ["Moravian Silesian", "Moravia-Silesia", "Moravskoslezský", "Moravskoslezsky", "Moravia Silezia"], seat: "Ostrava" },
  ],
}
