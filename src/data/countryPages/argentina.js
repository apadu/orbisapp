/**
 * Country page: Argentina (bilingual inline, like romania.js).
 * Facts: population ≈ 47 million (2025 estimate; 46 million at the 2022 census); area 2,780,400 km²;
 * Aconcagua 6,961 m; independence 9 July 1816; 3 World Cups (1978, 1986, 2022).
 */
export const ARGENTINA_PAGE = {
  id: 'ar',
  flag: '🇦🇷',
  name: { en: 'Argentina', ro: 'Argentina' },
  tagline: {
    en: 'Tango, the Andes and Patagonia: 23 provinces from the Iguazú Falls to Tierra del Fuego.',
    ro: 'Tango, Anzii și Patagonia: 23 de provincii, de la Cascadele Iguazú la Țara de Foc.',
  },
  mapHint: { en: 'Hover or tap a province', ro: 'Treci cu mouse-ul sau atinge o provincie' },
  seatLabel: { en: 'capital', ro: 'capitala' },
  facts: [
    { icon: '🏛️', label: { en: 'Capital', ro: 'Capitala' }, value: { en: 'Buenos Aires', ro: 'Buenos Aires' } },
    { icon: '👥', label: { en: 'Population', ro: 'Populație' }, value: { en: '≈ 47 million (2025)', ro: '≈ 47 milioane (2025)' } },
    { icon: '📐', label: { en: 'Area', ro: 'Suprafață' }, value: { en: '2,780,400 km²', ro: '2.780.400 km²' } },
    { icon: '🗺️', label: { en: 'Divisions', ro: 'Diviziuni' }, value: { en: '23 provinces + Buenos Aires City', ro: '23 de provincii + orașul Buenos Aires' } },
    { icon: '⛰️', label: { en: 'Highest point', ro: 'Cel mai înalt punct' }, value: { en: 'Aconcagua, 6,961 m', ro: 'Aconcagua, 6.961 m' } },
    { icon: '💶', label: { en: 'Currency', ro: 'Moneda' }, value: { en: 'Argentine peso (ARS)', ro: 'Peso argentinian (ARS)' } },
    { icon: '🗣️', label: { en: 'Language', ro: 'Limba' }, value: { en: 'Spanish', ro: 'Spaniolă' } },
    { icon: '📅', label: { en: 'Independence', ro: 'Independență' }, value: { en: '9 July 1816', ro: '9 iulie 1816' } },
  ],
  neighbours: { en: 'Chile, Bolivia, Paraguay, Brazil and Uruguay', ro: 'Chile, Bolivia, Paraguay, Brazilia și Uruguay' },
  questions: [
    { id: 'capital', q: { en: 'Capital of Argentina', ro: 'Capitala Argentinei' }, answers: ['Buenos Aires'], show: { en: 'Buenos Aires', ro: 'Buenos Aires' } },
    { id: 'aconcagua', q: { en: 'Highest mountain outside Asia', ro: 'Cel mai înalt munte din afara Asiei' }, answers: ['Aconcagua'], show: { en: 'Aconcagua', ro: 'Aconcagua' } },
    { id: 'peso', q: { en: 'Currency', ro: 'Moneda' }, answers: ['peso', 'pesos', 'peso argentinian', 'Argentine peso', 'ARS'], show: { en: 'Peso', ro: 'Peso' } },
    { id: 'tango', q: { en: 'Dance born in Buenos Aires', ro: 'Dansul născut în Buenos Aires' }, answers: ['tango'], show: { en: 'Tango', ro: 'Tango' } },
    { id: '1816', q: { en: 'Year of independence', ro: 'Anul independenței' }, answers: ['1816'], show: { en: '1816', ro: '1816' } },
    { id: 'iguazu', q: { en: 'Waterfalls on the border with Brazil', ro: 'Cascadele de la granița cu Brazilia' }, answers: ['Iguazú', 'Iguazu', 'Iguaçu', 'Iguacu', 'Iguazú Falls'], show: { en: 'Iguazú Falls', ro: 'Cascadele Iguazú' } },
    { id: 'ushuaia', q: { en: 'Southernmost city, on Tierra del Fuego', ro: 'Cel mai sudic oraș, pe Țara de Foc' }, answers: ['Ushuaia'], show: { en: 'Ushuaia', ro: 'Ushuaia' } },
    { id: 'pampas', q: { en: 'Vast grassy plains of the gauchos', ro: 'Câmpiile întinse ale gauchoșilor' }, answers: ['Pampas', 'Pampa', 'Pampasul'], show: { en: 'Pampas', ro: 'Pampas' } },
    { id: 'patagonia', q: { en: 'Windswept region in the south', ro: 'Regiunea bătută de vânt din sud' }, answers: ['Patagonia'], show: { en: 'Patagonia', ro: 'Patagonia' } },
    { id: 'perito', q: { en: 'Famous glacier in Santa Cruz', ro: 'Ghețarul celebru din Santa Cruz' }, answers: ['Perito Moreno', 'Perito Moreno Glacier', 'Ghețarul Perito Moreno'], show: { en: 'Perito Moreno', ro: 'Perito Moreno' } },
    { id: 'messi', q: { en: 'Captain of the 2022 world champions', ro: 'Căpitanul campioanei mondiale din 2022' }, answers: ['Messi', 'Lionel Messi', 'Leo Messi'], show: { en: 'Lionel Messi', ro: 'Lionel Messi' } },
    { id: 'maradona', q: { en: 'Star of the 1986 World Cup, "the Hand of God"', ro: 'Starul Cupei Mondiale din 1986, „mâna lui Dumnezeu”' }, answers: ['Maradona', 'Diego Maradona', 'Diego Armando Maradona'], show: { en: 'Diego Maradona', ro: 'Diego Maradona' } },
    { id: 'world-cups', q: { en: 'How many football World Cups has Argentina won?', ro: 'Câte Campionate Mondiale de fotbal a câștigat Argentina?' }, answers: ['3', 'trei', 'three'], show: { en: '3', ro: '3' } },
    { id: 'plata', q: { en: 'Estuary between Buenos Aires and Uruguay', ro: 'Estuarul dintre Buenos Aires și Uruguay' }, answers: ['Río de la Plata', 'Rio de la Plata', 'River Plate', 'La Plata'], show: { en: 'Río de la Plata', ro: 'Río de la Plata' } },
    { id: 'pope', q: { en: 'First pope from the Americas, born in Buenos Aires', ro: 'Primul papă din Americi, născut în Buenos Aires' }, answers: ['Francis', 'Pope Francis', 'Francisc', 'Papa Francisc', 'Bergoglio', 'Jorge Bergoglio'], show: { en: 'Pope Francis', ro: 'Papa Francisc' } },
    { id: 'evita', q: { en: 'First lady nicknamed "Evita"', ro: 'Prima doamnă supranumită „Evita”' }, answers: ['Eva Perón', 'Eva Peron', 'Evita', 'Perón'], show: { en: 'Eva Perón', ro: 'Eva Perón' } },
    { id: 'asado', q: { en: 'Traditional barbecue', ro: 'Grătarul tradițional' }, answers: ['asado'], show: { en: 'Asado', ro: 'Asado' } },
    { id: 'mendoza', q: { en: 'Main wine region, at the foot of the Andes', ro: 'Principala regiune viticolă, la poalele Anzilor' }, answers: ['Mendoza'], show: { en: 'Mendoza', ro: 'Mendoza' } },
    { id: 'mate', q: { en: 'Herbal drink sipped through a metal straw', ro: 'Băutura din plante sorbită printr-un pai de metal' }, answers: ['mate', 'yerba mate', 'maté'], show: { en: 'Mate', ro: 'Mate' } },
    { id: 'chile', q: { en: 'Neighbour on the other side of the Andes', ro: 'Vecinul de pe cealaltă parte a Anzilor' }, answers: ['Chile'], show: { en: 'Chile', ro: 'Chile' } },
  ],
}
