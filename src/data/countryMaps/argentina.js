/**
 * Argentina: 23 provinces + the Autonomous City of Buenos Aires, keyed by ISO 3166-2 code
 * (= `id` in public/data/maps/ar.json). `seat` = provincial capital.
 */
export const ARGENTINA = {
  id: 'ar',
  file: 'ar.json',
  country: 'Argentina',
  divisions: [
    { id: 'AR-B', name: 'Buenos Aires Province', ro: 'Provincia Buenos Aires', alt: ['Buenos Aires'], seat: 'La Plata' },
    { id: 'AR-C', name: 'Buenos Aires City', ro: 'Orașul Buenos Aires', alt: ['Ciudad de Buenos Aires', 'CABA', 'Capital Federal', 'Ciudad Autónoma de Buenos Aires'], city: true },
    { id: 'AR-K', name: 'Catamarca', seat: 'Catamarca', seatAlt: ['San Fernando del Valle de Catamarca'] },
    { id: 'AR-H', name: 'Chaco', seat: 'Resistencia' },
    { id: 'AR-U', name: 'Chubut', seat: 'Rawson' },
    { id: 'AR-X', name: 'Córdoba', seat: 'Córdoba' },
    { id: 'AR-W', name: 'Corrientes', seat: 'Corrientes' },
    { id: 'AR-E', name: 'Entre Ríos', seat: 'Paraná' },
    { id: 'AR-P', name: 'Formosa', seat: 'Formosa' },
    { id: 'AR-Y', name: 'Jujuy', seat: 'San Salvador de Jujuy', seatAlt: ['Jujuy'] },
    { id: 'AR-L', name: 'La Pampa', seat: 'Santa Rosa' },
    { id: 'AR-F', name: 'La Rioja', seat: 'La Rioja' },
    { id: 'AR-M', name: 'Mendoza', seat: 'Mendoza' },
    { id: 'AR-N', name: 'Misiones', seat: 'Posadas' },
    { id: 'AR-Q', name: 'Neuquén', seat: 'Neuquén' },
    { id: 'AR-R', name: 'Río Negro', seat: 'Viedma' },
    { id: 'AR-A', name: 'Salta', seat: 'Salta' },
    { id: 'AR-J', name: 'San Juan', seat: 'San Juan' },
    { id: 'AR-D', name: 'San Luis', seat: 'San Luis' },
    { id: 'AR-Z', name: 'Santa Cruz', seat: 'Río Gallegos' },
    { id: 'AR-S', name: 'Santa Fe', seat: 'Santa Fe' },
    { id: 'AR-G', name: 'Santiago del Estero', seat: 'Santiago del Estero' },
    { id: 'AR-V', name: 'Tierra del Fuego', ro: 'Țara de Foc', alt: ['Tierra del Fuego'], seat: 'Ushuaia' },
    { id: 'AR-T', name: 'Tucumán', seat: 'San Miguel de Tucumán', seatAlt: ['Tucumán'] },
  ],
}
