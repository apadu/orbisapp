/**
 * United Kingdom: the 12 ITL1 regions (9 English regions + Scotland, Wales, Northern Ireland),
 * built by merging Natural Earth's local authorities (ids are our own, GB-xxx).
 * Only the three nations have a capital, so there's no capitals quiz.
 */
export const UNITED_KINGDOM = {
  id: 'gb',
  file: 'gb.json',
  country: "United Kingdom",
  divisions: [
    { id: 'GB-NEE', name: "North East England", ro: "Nord-Estul Angliei", alt: ["North East", "Nord-Est"], seat: null },
    { id: 'GB-NWE', name: "North West England", ro: "Nord-Vestul Angliei", alt: ["North West", "Nord-Vest"], seat: null },
    { id: 'GB-YHE', name: "Yorkshire and the Humber", ro: "Yorkshire și Humber", alt: ["Yorkshire"], seat: null },
    { id: 'GB-EME', name: "East Midlands", ro: "Midlands de Est", seat: null },
    { id: 'GB-WME', name: "West Midlands", ro: "Midlands de Vest", seat: null },
    { id: 'GB-EEE', name: "East of England", ro: "Estul Angliei", alt: ["East Anglia", "East"], seat: null },
    { id: 'GB-LND', name: "London", ro: "Londra", alt: ["Greater London"], seat: null, city: true },
    { id: 'GB-SEE', name: "South East England", ro: "Sud-Estul Angliei", alt: ["South East", "Sud-Est"], seat: null },
    { id: 'GB-SWE', name: "South West England", ro: "Sud-Vestul Angliei", alt: ["South West", "Sud-Vest"], seat: null },
    { id: 'GB-SCT', name: "Scotland", ro: "Scoția", seat: "Edinburgh" },
    { id: 'GB-WLS', name: "Wales", ro: "Țara Galilor", alt: ["Tara Galilor"], seat: "Cardiff" },
    { id: 'GB-NIR', name: "Northern Ireland", ro: "Irlanda de Nord", alt: ["Ulster"], seat: "Belfast" },
  ],
}
