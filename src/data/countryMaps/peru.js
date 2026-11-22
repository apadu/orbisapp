/**
 * Peru: 24 departments, the Constitutional Province of Callao and the province of Lima
 * (Lima city), keyed by ISO 3166-2 code (= `id` in public/data/maps/pe.json).
 * `seat` = regional capital (Lima city and Callao are cities in themselves).
 */
export const PERU = {
  id: 'pe',
  file: 'pe.json',
  country: 'Peru',
  divisions: [
    { id: 'PE-AMA', name: 'Amazonas', seat: 'Chachapoyas' },
    { id: 'PE-ANC', name: 'Áncash', alt: ['Ancash'], seat: 'Huaraz' },
    { id: 'PE-APU', name: 'Apurímac', seat: 'Abancay' },
    { id: 'PE-ARE', name: 'Arequipa', seat: 'Arequipa' },
    { id: 'PE-AYA', name: 'Ayacucho', seat: 'Ayacucho' },
    { id: 'PE-CAJ', name: 'Cajamarca', seat: 'Cajamarca' },
    { id: 'PE-CAL', name: 'Callao', city: true },
    { id: 'PE-CUS', name: 'Cusco', alt: ['Cuzco'], seat: 'Cusco', seatAlt: ['Cuzco'] },
    { id: 'PE-HUV', name: 'Huancavelica', seat: 'Huancavelica' },
    { id: 'PE-HUC', name: 'Huánuco', seat: 'Huánuco' },
    { id: 'PE-ICA', name: 'Ica', seat: 'Ica' },
    { id: 'PE-JUN', name: 'Junín', seat: 'Huancayo' },
    { id: 'PE-LAL', name: 'La Libertad', seat: 'Trujillo' },
    { id: 'PE-LAM', name: 'Lambayeque', seat: 'Chiclayo' },
    { id: 'PE-LIM', name: 'Lima Region', ro: 'Regiunea Lima', alt: ['Lima Department', 'Departamento de Lima', 'Lima Provinces'], seat: 'Huacho' },
    { id: 'PE-LMA', name: 'Lima', alt: ['Lima Province', 'Lima Metropolitana', 'Metropolitan Lima'], city: true },
    { id: 'PE-LOR', name: 'Loreto', seat: 'Iquitos' },
    { id: 'PE-MDD', name: 'Madre de Dios', seat: 'Puerto Maldonado' },
    { id: 'PE-MOQ', name: 'Moquegua', seat: 'Moquegua' },
    { id: 'PE-PAS', name: 'Pasco', seat: 'Cerro de Pasco' },
    { id: 'PE-PIU', name: 'Piura', seat: 'Piura' },
    { id: 'PE-PUN', name: 'Puno', seat: 'Puno' },
    { id: 'PE-SAM', name: 'San Martín', seat: 'Moyobamba' },
    { id: 'PE-TAC', name: 'Tacna', seat: 'Tacna' },
    { id: 'PE-TUM', name: 'Tumbes', seat: 'Tumbes' },
    { id: 'PE-UCA', name: 'Ucayali', seat: 'Pucallpa' },
  ],
}
