/**
 * South Africa: the 9 provinces, keyed by ISO 3166-2 code (= `id` in public/data/maps/za.json).
 * `seat` = provincial capital. The Prince Edward Islands (1,800 km south) aren't on the map.
 */
export const SOUTH_AFRICA = {
  id: 'za',
  file: 'za.json',
  country: 'South Africa',
  divisions: [
    { id: 'ZA-EC', name: 'Eastern Cape', ro: 'Capul de Est', seat: 'Bhisho', seatAlt: ['Bisho'] },
    { id: 'ZA-FS', name: 'Free State', ro: 'Statul Liber', alt: ['Orange Free State', 'Vrystaat'], seat: 'Bloemfontein' },
    { id: 'ZA-GT', name: 'Gauteng', seat: 'Johannesburg', seatAlt: ['Joburg', 'Jo\'burg'] },
    { id: 'ZA-NL', name: 'KwaZulu-Natal', alt: ['Natal', 'KZN'], seat: 'Pietermaritzburg', seatAlt: ['Maritzburg'] },
    { id: 'ZA-LP', name: 'Limpopo', seat: 'Polokwane', seatAlt: ['Pietersburg'] },
    { id: 'ZA-MP', name: 'Mpumalanga', seat: 'Mbombela', seatAlt: ['Nelspruit'] },
    { id: 'ZA-NW', name: 'North West', ro: 'Nord-Vest', alt: ['North-West'], seat: 'Mahikeng', seatAlt: ['Mafikeng', 'Mafeking'] },
    { id: 'ZA-NC', name: 'Northern Cape', ro: 'Capul de Nord', seat: 'Kimberley' },
    { id: 'ZA-WC', name: 'Western Cape', ro: 'Capul de Vest', seat: 'Cape Town', seatAlt: ['Kaapstad', 'Orașul Capului'] },
  ],
}
