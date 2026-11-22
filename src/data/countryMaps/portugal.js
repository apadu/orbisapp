/**
 * Portugal: the 18 districts of the mainland and the autonomous regions of the Azores and
 * Madeira (drawn as insets), keyed by ISO 3166-2 code (= `id` in public/data/maps/pt.json).
 * Each district is named after its capital, so there's no capitals quiz.
 */
export const PORTUGAL = {
  id: 'pt',
  file: 'pt.json',
  country: 'Portugal',
  divisions: [
    { id: 'PT-01', name: 'Aveiro' },
    { id: 'PT-20', name: 'Azores', ro: 'Azore', alt: ['Açores', 'Acores', 'Insulele Azore'] },
    { id: 'PT-02', name: 'Beja' },
    { id: 'PT-03', name: 'Braga' },
    { id: 'PT-04', name: 'Bragança', alt: ['Braganca'] },
    { id: 'PT-05', name: 'Castelo Branco' },
    { id: 'PT-06', name: 'Coimbra' },
    { id: 'PT-07', name: 'Évora', alt: ['Evora'] },
    { id: 'PT-08', name: 'Faro', alt: ['Algarve'] },
    { id: 'PT-09', name: 'Guarda' },
    { id: 'PT-10', name: 'Leiria' },
    { id: 'PT-11', name: 'Lisbon', ro: 'Lisabona', alt: ['Lisboa'] },
    { id: 'PT-30', name: 'Madeira', alt: ['Insula Madeira'] },
    { id: 'PT-12', name: 'Portalegre' },
    { id: 'PT-13', name: 'Porto', alt: ['Oporto'] },
    { id: 'PT-14', name: 'Santarém', alt: ['Santarem'] },
    { id: 'PT-15', name: 'Setúbal', alt: ['Setubal'] },
    { id: 'PT-16', name: 'Viana do Castelo' },
    { id: 'PT-17', name: 'Vila Real' },
    { id: 'PT-18', name: 'Viseu' },
  ],
}
