/**
 * Spain: 17 autonomous communities + the autonomous cities of Ceuta and Melilla, keyed by
 * ISO 3166-2 code (= `id` in public/data/maps/es.json, built by merging Natural Earth's
 * provinces). Ceuta and Melilla have no separate capital (not part of the capitals quiz).
 * The Canary Islands share their capital between two cities: both are accepted.
 */
export const SPAIN = {
  id: 'es',
  file: 'es.json',
  country: 'Spain',
  divisions: [
    { id: 'ES-AN', name: 'Andalusia', ro: 'Andaluzia', alt: ['Andalucía'], seat: 'Seville', seatRo: 'Sevilla', seatAlt: ['Sevilla'] },
    { id: 'ES-AR', name: 'Aragon', alt: ['Aragón'], seat: 'Zaragoza', seatAlt: ['Saragossa'] },
    { id: 'ES-AS', name: 'Asturias', ro: 'Asturia', alt: ['Asturias'], seat: 'Oviedo' },
    { id: 'ES-IB', name: 'Balearic Islands', ro: 'Insulele Baleare', alt: ['Baleares', 'Balearics', 'Illes Balears', 'Baleare'], seat: 'Palma', seatAlt: ['Palma de Mallorca'] },
    { id: 'ES-CN', name: 'Canary Islands', ro: 'Insulele Canare', alt: ['Canarias', 'Canaries', 'Canare'], seat: 'Santa Cruz de Tenerife', seatAlt: ['Las Palmas', 'Las Palmas de Gran Canaria', 'Santa Cruz'] },
    { id: 'ES-CB', name: 'Cantabria', seat: 'Santander' },
    { id: 'ES-CL', name: 'Castile and León', ro: 'Castilia și León', alt: ['Castilla y León', 'Castile Leon', 'Castilia Leon'], seat: 'Valladolid' },
    { id: 'ES-CM', name: 'Castilla–La Mancha', ro: 'Castilia-La Mancha', alt: ['Castile-La Mancha', 'Castilla-La Mancha', 'La Mancha'], seat: 'Toledo' },
    { id: 'ES-CT', name: 'Catalonia', alt: ['Cataluña', 'Catalunya'], seat: 'Barcelona' },
    { id: 'ES-EX', name: 'Extremadura', seat: 'Mérida' },
    { id: 'ES-GA', name: 'Galicia', seat: 'Santiago de Compostela', seatAlt: ['Santiago'] },
    { id: 'ES-RI', name: 'La Rioja', alt: ['Rioja'], seat: 'Logroño' },
    { id: 'ES-MD', name: 'Community of Madrid', ro: 'Comunitatea Madrid', alt: ['Madrid', 'Comunidad de Madrid'], seat: 'Madrid' },
    { id: 'ES-MC', name: 'Region of Murcia', ro: 'Regiunea Murcia', alt: ['Murcia'], seat: 'Murcia' },
    { id: 'ES-NC', name: 'Navarre', ro: 'Navarra', alt: ['Navarra'], seat: 'Pamplona' },
    { id: 'ES-PV', name: 'Basque Country', ro: 'Țara Bascilor', alt: ['País Vasco', 'Euskadi', 'Basque'], seat: 'Vitoria-Gasteiz', seatAlt: ['Vitoria', 'Gasteiz'] },
    { id: 'ES-VC', name: 'Valencian Community', ro: 'Comunitatea Valenciană', alt: ['Valencia', 'Comunitat Valenciana'], seat: 'Valencia' },
    { id: 'ES-CE', name: 'Ceuta', seat: null, city: true },
    { id: 'ES-ML', name: 'Melilla', seat: null, city: true },
  ],
}
