/**
 * Greece: the 13 administrative regions plus the autonomous monastic state of Mount Athos,
 * keyed by ISO 3166-2 code (= `id` in public/data/maps/gr.json). `seat` = regional capital.
 */
export const GREECE = {
  id: 'gr',
  file: 'gr.json',
  country: 'Greece',
  divisions: [
    { id: 'GR-A1', name: 'Attica', ro: 'Atica', alt: ['Attiki', 'Attika'], seat: 'Athens', seatRo: 'Atena', seatAlt: ['Athina', 'Athína'] },
    { id: 'GR-H', name: 'Central Greece', ro: 'Grecia Centrală', alt: ['Sterea Ellada', 'Stereá Elláda'], seat: 'Lamia' },
    { id: 'GR-B', name: 'Central Macedonia', ro: 'Macedonia Centrală', alt: ['Kentriki Makedonia'], seat: 'Thessaloniki', seatRo: 'Salonic', seatAlt: ['Salonica', 'Saloniki', 'Thessaloníki'] },
    { id: 'GR-M', name: 'Crete', ro: 'Creta', alt: ['Kriti'], seat: 'Heraklion', seatAlt: ['Iraklio', 'Irakleio', 'Iraklion', 'Herakleion'] },
    { id: 'GR-A', name: 'East Macedonia and Thrace', ro: 'Macedonia de Est și Tracia', alt: ['Eastern Macedonia and Thrace', 'Anatoliki Makedonia kai Thraki'], seat: 'Komotini' },
    { id: 'GR-D', name: 'Epirus', ro: 'Epir', alt: ['Ipiros', 'Ipeiros'], seat: 'Ioannina', seatAlt: ['Janina'] },
    { id: 'GR-F', name: 'Ionian Islands', ro: 'Insulele Ionice', alt: ['Ionioi Nisoi'], seat: 'Corfu', seatAlt: ['Kerkyra', 'Kerkira'] },
    { id: 'GR-69', name: 'Mount Athos', ro: 'Muntele Athos', alt: ['Athos', 'Agion Oros', 'Ayion Oros', 'Holy Mountain'], seat: 'Karyes', city: true },
    { id: 'GR-K', name: 'North Aegean', ro: 'Egeea de Nord', alt: ['Voreio Aigaio'], seat: 'Mytilene', seatAlt: ['Mytilini', 'Mitilini'] },
    { id: 'GR-J', name: 'Peloponnese', ro: 'Peloponez', alt: ['Peloponnisos', 'Peloponnesus'], seat: 'Tripoli', seatAlt: ['Tripolis'] },
    { id: 'GR-L', name: 'South Aegean', ro: 'Egeea de Sud', alt: ['Notio Aigaio'], seat: 'Ermoupoli', seatAlt: ['Hermoupolis', 'Ermoupolis', 'Syros'] },
    { id: 'GR-E', name: 'Thessaly', ro: 'Tesalia', alt: ['Thessalia'], seat: 'Larissa', seatAlt: ['Larisa'] },
    { id: 'GR-G', name: 'West Greece', ro: 'Grecia de Vest', alt: ['Western Greece', 'Dytiki Ellada'], seat: 'Patras', seatAlt: ['Patra'] },
    { id: 'GR-C', name: 'West Macedonia', ro: 'Macedonia de Vest', alt: ['Western Macedonia', 'Dytiki Makedonia'], seat: 'Kozani' },
  ],
}
