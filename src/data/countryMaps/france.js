/**
 * France: the 13 regions of metropolitan France, keyed by ISO 3166-2 code (= `id` in
 * public/data/maps/fr.json, built by merging Natural Earth's departments). Overseas
 * regions aren't on the map. `seat` / `seatRo` = prefecture of the region.
 */
export const FRANCE = {
  id: 'fr',
  file: 'fr.json',
  country: 'France',
  divisions: [
    { id: 'FR-ARA', name: 'Auvergne-Rhône-Alpes', alt: ['Auvergne', 'Rhone-Alpes'], seat: 'Lyon' },
    { id: 'FR-BFC', name: 'Bourgogne-Franche-Comté', ro: 'Burgundia-Franche-Comté', alt: ['Burgundy-Franche-Comte', 'Burgundy', 'Burgundia', 'Bourgogne'], seat: 'Dijon' },
    { id: 'FR-BRE', name: 'Brittany', ro: 'Bretania', alt: ['Bretagne'], seat: 'Rennes' },
    { id: 'FR-CVL', name: 'Centre-Val de Loire', alt: ['Centre', 'Val de Loire'], seat: 'Orléans' },
    { id: 'FR-COR', name: 'Corsica', alt: ['Corse'], seat: 'Ajaccio' },
    { id: 'FR-GES', name: 'Grand Est', alt: ['Alsace', 'Lorraine'], seat: 'Strasbourg' },
    { id: 'FR-HDF', name: 'Hauts-de-France', seat: 'Lille' },
    { id: 'FR-IDF', name: 'Île-de-France', alt: ['Paris Region'], seat: 'Paris' },
    { id: 'FR-NOR', name: 'Normandy', ro: 'Normandia', alt: ['Normandie'], seat: 'Rouen' },
    { id: 'FR-NAQ', name: 'Nouvelle-Aquitaine', ro: 'Noua Aquitanie', alt: ['New Aquitaine', 'Aquitaine', 'Aquitania'], seat: 'Bordeaux' },
    { id: 'FR-OCC', name: 'Occitania', alt: ['Occitanie'], seat: 'Toulouse' },
    { id: 'FR-PDL', name: 'Pays de la Loire', seat: 'Nantes' },
    { id: 'FR-PAC', name: "Provence-Alpes-Côte d'Azur", alt: ['Provence', 'PACA', "Cote d'Azur"], seat: 'Marseille', seatRo: 'Marsilia', seatAlt: ['Marsilia', 'Marseilles'] },
  ],
}
