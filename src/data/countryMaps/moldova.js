/**
 * Republic of Moldova: 32 districts (raioane), the municipalities of Chișinău, Bălți and
 * Bender, the autonomous territory of Gagauzia and Transnistria (the administrative-territorial
 * units of the left bank of the Dniester) — 37 units, keyed by ISO 3166-2 code (= `id` in
 * public/data/maps/md.json, built from geoBoundaries).
 * Official district names keep "î" (Hîncești, Rîșcani, Sîngerei); the "â" spellings are accepted.
 */
export const MOLDOVA = {
  id: 'md',
  file: 'md.json',
  country: 'Moldova',
  divisions: [
    { id: 'MD-AN', name: 'Anenii Noi' },
    { id: 'MD-BA', name: 'Bălți', city: true },
    { id: 'MD-BS', name: 'Basarabeasca' },
    { id: 'MD-BD', name: 'Bender', alt: ['Tighina', 'Bendery'], city: true },
    { id: 'MD-BR', name: 'Briceni' },
    { id: 'MD-CA', name: 'Cahul' },
    { id: 'MD-CL', name: 'Călărași' },
    { id: 'MD-CT', name: 'Cantemir' },
    { id: 'MD-CS', name: 'Căușeni' },
    { id: 'MD-CU', name: 'Chișinău', alt: ['Kishinev', 'Chisinau'], city: true },
    { id: 'MD-CM', name: 'Cimișlia' },
    { id: 'MD-CR', name: 'Criuleni' },
    { id: 'MD-DO', name: 'Dondușeni' },
    { id: 'MD-DR', name: 'Drochia' },
    { id: 'MD-DU', name: 'Dubăsari' },
    { id: 'MD-ED', name: 'Edineț' },
    { id: 'MD-FA', name: 'Fălești' },
    { id: 'MD-FL', name: 'Florești' },
    { id: 'MD-GA', name: 'Găgăuzia', alt: ['Gagauzia', 'UTA Găgăuzia', 'Gagauz Yeri'] },
    { id: 'MD-GL', name: 'Glodeni' },
    { id: 'MD-HI', name: 'Hîncești', alt: ['Hâncești'] },
    { id: 'MD-IA', name: 'Ialoveni' },
    { id: 'MD-LE', name: 'Leova' },
    { id: 'MD-NI', name: 'Nisporeni' },
    { id: 'MD-OC', name: 'Ocnița' },
    { id: 'MD-OR', name: 'Orhei' },
    { id: 'MD-RE', name: 'Rezina' },
    { id: 'MD-RI', name: 'Rîșcani', alt: ['Râșcani'] },
    { id: 'MD-SI', name: 'Sîngerei', alt: ['Sângerei'] },
    { id: 'MD-SD', name: 'Șoldănești' },
    { id: 'MD-SO', name: 'Soroca' },
    { id: 'MD-SV', name: 'Ștefan Vodă' },
    { id: 'MD-ST', name: 'Strășeni' },
    { id: 'MD-TA', name: 'Taraclia' },
    { id: 'MD-TE', name: 'Telenești' },
    { id: 'MD-SN', name: 'Transnistria', alt: ['Stânga Nistrului', 'UTA Stânga Nistrului', 'Pridnestrovie', 'Transnistria'] },
    { id: 'MD-UN', name: 'Ungheni' },
  ],
}
