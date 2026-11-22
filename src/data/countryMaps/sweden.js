/**
 * Sweden: the 21 counties (län), keyed by ISO 3166-2 code (= `id` in public/data/maps/se.json).
 * `seat` = the county's seat of government (residensstad). Names without å/ä/ö are accepted.
 */
export const SWEDEN = {
  id: 'se',
  file: 'se.json',
  country: 'Sweden',
  divisions: [
    { id: 'SE-K', name: 'Blekinge', seat: 'Karlskrona' },
    { id: 'SE-W', name: 'Dalarna', alt: ['Dalecarlia', 'Kopparberg'], seat: 'Falun' },
    { id: 'SE-I', name: 'Gotland', seat: 'Visby' },
    { id: 'SE-X', name: 'Gävleborg', alt: ['Gavleborg'], seat: 'Gävle', seatAlt: ['Gavle'] },
    { id: 'SE-N', name: 'Halland', seat: 'Halmstad' },
    { id: 'SE-Z', name: 'Jämtland', alt: ['Jamtland'], seat: 'Östersund', seatAlt: ['Ostersund'] },
    { id: 'SE-F', name: 'Jönköping', alt: ['Jonkoping'], seat: 'Jönköping', seatAlt: ['Jonkoping'] },
    { id: 'SE-H', name: 'Kalmar', seat: 'Kalmar' },
    { id: 'SE-G', name: 'Kronoberg', seat: 'Växjö', seatAlt: ['Vaxjo'] },
    { id: 'SE-BD', name: 'Norrbotten', seat: 'Luleå', seatAlt: ['Lulea'] },
    { id: 'SE-M', name: 'Skåne', alt: ['Skane', 'Scania'], seat: 'Malmö', seatAlt: ['Malmo'] },
    { id: 'SE-AB', name: 'Stockholm', seat: 'Stockholm' },
    { id: 'SE-D', name: 'Södermanland', alt: ['Sodermanland'], seat: 'Nyköping', seatAlt: ['Nykoping'] },
    { id: 'SE-C', name: 'Uppsala', seat: 'Uppsala' },
    { id: 'SE-S', name: 'Värmland', alt: ['Varmland'], seat: 'Karlstad' },
    { id: 'SE-AC', name: 'Västerbotten', alt: ['Vasterbotten'], seat: 'Umeå', seatAlt: ['Umea'] },
    { id: 'SE-Y', name: 'Västernorrland', alt: ['Vasternorrland'], seat: 'Härnösand', seatAlt: ['Harnosand'] },
    { id: 'SE-U', name: 'Västmanland', alt: ['Vastmanland'], seat: 'Västerås', seatAlt: ['Vasteras'] },
    { id: 'SE-O', name: 'Västra Götaland', alt: ['Vastra Gotaland'], seat: 'Gothenburg', seatRo: 'Göteborg', seatAlt: ['Göteborg', 'Goteborg'] },
    { id: 'SE-T', name: 'Örebro', alt: ['Orebro'], seat: 'Örebro', seatAlt: ['Orebro'] },
    { id: 'SE-E', name: 'Östergötland', alt: ['Ostergotland'], seat: 'Linköping', seatAlt: ['Linkoping'] },
  ],
}
