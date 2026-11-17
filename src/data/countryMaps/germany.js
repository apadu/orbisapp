/**
 * Germany: 16 states (Länder), keyed by ISO 3166-2 code (= `id` in public/data/maps/de.json).
 * Berlin, Hamburg and Bremen are city-states with no separate capital, so they aren't part
 * of the capitals quiz. `alt` = the German name and other spellings.
 */
export const GERMANY = {
  id: 'de',
  file: 'de.json',
  country: 'Germany',
  divisions: [
    { id: 'DE-BW', name: 'Baden-Württemberg', alt: ['Baden', 'Wurttemberg'], seat: 'Stuttgart' },
    { id: 'DE-BY', name: 'Bavaria', alt: ['Bayern'], seat: 'Munich', seatRo: 'München', seatAlt: ['München', 'Muenchen'] },
    { id: 'DE-BE', name: 'Berlin', seat: null, city: true },
    { id: 'DE-BB', name: 'Brandenburg', seat: 'Potsdam' },
    { id: 'DE-HB', name: 'Bremen', seat: null, city: true },
    { id: 'DE-HH', name: 'Hamburg', seat: null, city: true },
    { id: 'DE-HE', name: 'Hesse', ro: 'Hessa', alt: ['Hessen'], seat: 'Wiesbaden' },
    { id: 'DE-MV', name: 'Mecklenburg-Western Pomerania', ro: 'Mecklenburg-Pomerania Inferioară', alt: ['Mecklenburg-Vorpommern', 'Mecklenburg', 'Vorpommern'], seat: 'Schwerin' },
    { id: 'DE-NI', name: 'Lower Saxony', ro: 'Saxonia Inferioară', alt: ['Niedersachsen', 'Saxonia de Jos'], seat: 'Hanover', seatRo: 'Hanovra', seatAlt: ['Hannover', 'Hanovra'] },
    { id: 'DE-NW', name: 'North Rhine-Westphalia', ro: 'Renania de Nord-Westfalia', alt: ['Nordrhein-Westfalen', 'NRW'], seat: 'Düsseldorf' },
    { id: 'DE-RP', name: 'Rhineland-Palatinate', ro: 'Renania-Palatinat', alt: ['Rheinland-Pfalz'], seat: 'Mainz' },
    { id: 'DE-SL', name: 'Saarland', alt: ['Saar'], seat: 'Saarbrücken' },
    { id: 'DE-SN', name: 'Saxony', ro: 'Saxonia', alt: ['Sachsen'], seat: 'Dresden', seatRo: 'Dresda', seatAlt: ['Dresda'] },
    { id: 'DE-ST', name: 'Saxony-Anhalt', ro: 'Saxonia-Anhalt', alt: ['Sachsen-Anhalt'], seat: 'Magdeburg' },
    { id: 'DE-SH', name: 'Schleswig-Holstein', seat: 'Kiel' },
    { id: 'DE-TH', name: 'Thuringia', ro: 'Turingia', alt: ['Thüringen'], seat: 'Erfurt' },
  ],
}
