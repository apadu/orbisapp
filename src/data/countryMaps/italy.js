/**
 * Italy: 20 regions, keyed by ISO 3166-2 code (= `id` in public/data/maps/it.json, built
 * by merging Natural Earth's provinces). `name` = English, `ro` = Romanian, `alt` = the
 * Italian name and other spellings; `seat` / `seatRo` = regional capital.
 */
export const ITALY = {
  id: 'it',
  file: 'it.json',
  country: 'Italy',
  divisions: [
    { id: 'IT-21', name: 'Piedmont', ro: 'Piemont', alt: ['Piemonte'], seat: 'Turin', seatRo: 'Torino', seatAlt: ['Torino'] },
    { id: 'IT-23', name: 'Aosta Valley', ro: 'Valea Aostei', alt: ["Valle d'Aosta", 'Aosta'], seat: 'Aosta' },
    { id: 'IT-25', name: 'Lombardy', ro: 'Lombardia', seat: 'Milan', seatRo: 'Milano', seatAlt: ['Milano'] },
    { id: 'IT-32', name: 'Trentino-South Tyrol', ro: 'Trentino-Tirolul de Sud', alt: ['Trentino-Alto Adige', 'Trentino', 'South Tyrol', 'Tirolul de Sud'], seat: 'Trento' },
    { id: 'IT-34', name: 'Veneto', seat: 'Venice', seatRo: 'Veneția', seatAlt: ['Venezia'] },
    { id: 'IT-36', name: 'Friuli-Venezia Giulia', alt: ['Friuli'], seat: 'Trieste' },
    { id: 'IT-42', name: 'Liguria', seat: 'Genoa', seatRo: 'Genova', seatAlt: ['Genova'] },
    { id: 'IT-45', name: 'Emilia-Romagna', seat: 'Bologna' },
    { id: 'IT-52', name: 'Tuscany', ro: 'Toscana', seat: 'Florence', seatRo: 'Florența', seatAlt: ['Firenze'] },
    { id: 'IT-55', name: 'Umbria', seat: 'Perugia' },
    { id: 'IT-57', name: 'Marche', alt: ['The Marches', 'Marches'], seat: 'Ancona' },
    { id: 'IT-62', name: 'Lazio', alt: ['Latium'], seat: 'Rome', seatRo: 'Roma', seatAlt: ['Roma'] },
    { id: 'IT-65', name: 'Abruzzo', alt: ['Abruzzi'], seat: "L'Aquila", seatAlt: ['Aquila'] },
    { id: 'IT-67', name: 'Molise', seat: 'Campobasso' },
    { id: 'IT-72', name: 'Campania', seat: 'Naples', seatRo: 'Napoli', seatAlt: ['Napoli'] },
    { id: 'IT-75', name: 'Apulia', alt: ['Puglia'], seat: 'Bari' },
    { id: 'IT-77', name: 'Basilicata', alt: ['Lucania'], seat: 'Potenza' },
    { id: 'IT-78', name: 'Calabria', seat: 'Catanzaro' },
    { id: 'IT-82', name: 'Sicily', ro: 'Sicilia', alt: ['Sicilia'], seat: 'Palermo' },
    { id: 'IT-88', name: 'Sardinia', alt: ['Sardegna'], seat: 'Cagliari' },
  ],
}
