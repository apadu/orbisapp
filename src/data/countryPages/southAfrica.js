/**
 * Country page: South Africa (bilingual inline, like romania.js).
 * Facts: population 63.0 million (mid-2024, Stats SA); area 1,221,037 km²; Mafadi 3,450 m;
 * first democratic elections 27 April 1994.
 */
export const SOUTH_AFRICA_PAGE = {
  id: 'za',
  flag: '🇿🇦',
  name: { en: 'South Africa', ro: 'Africa de Sud' },
  tagline: {
    en: 'Three capitals, 12 official languages and two oceans: 9 provinces from Table Mountain to Kruger.',
    ro: 'Trei capitale, 12 limbi oficiale și două oceane: 9 provincii, de la Muntele Masă la Kruger.',
  },
  mapHint: { en: 'Hover or tap a province', ro: 'Treci cu mouse-ul sau atinge o provincie' },
  seatLabel: { en: 'capital', ro: 'capitala' },
  facts: [
    { icon: '🏛️', label: { en: 'Capitals', ro: 'Capitale' }, value: { en: 'Pretoria, Cape Town, Bloemfontein', ro: 'Pretoria, Cape Town, Bloemfontein' } },
    { icon: '👥', label: { en: 'Population', ro: 'Populație' }, value: { en: '63 million (2024)', ro: '63 de milioane (2024)' } },
    { icon: '📐', label: { en: 'Area', ro: 'Suprafață' }, value: { en: '1,221,037 km²', ro: '1.221.037 km²' } },
    { icon: '🗺️', label: { en: 'Divisions', ro: 'Diviziuni' }, value: { en: '9 provinces', ro: '9 provincii' } },
    { icon: '⛰️', label: { en: 'Highest point', ro: 'Cel mai înalt punct' }, value: { en: 'Mafadi, 3,450 m', ro: 'Mafadi, 3.450 m' } },
    { icon: '💵', label: { en: 'Currency', ro: 'Moneda' }, value: { en: 'Rand (ZAR)', ro: 'Rand (ZAR)' } },
    { icon: '🗣️', label: { en: 'Languages', ro: 'Limbi' }, value: { en: '12 official, Zulu the most spoken', ro: '12 oficiale, zulu cea mai vorbită' } },
    { icon: '📅', label: { en: 'Democracy', ro: 'Democrația' }, value: { en: '27 April 1994', ro: '27 aprilie 1994' } },
  ],
  neighbours: { en: 'Namibia, Botswana, Zimbabwe, Mozambique, Eswatini and Lesotho (entirely inside it)', ro: 'Namibia, Botswana, Zimbabwe, Mozambic, Eswatini și Lesotho (în întregime în interiorul ei)' },
  questions: [
    { id: 'three', q: { en: 'How many capital cities?', ro: 'Câte capitale are?' }, answers: ['3', 'three', 'trei'], show: { en: '3', ro: '3' } },
    { id: 'pretoria', q: { en: 'Seat of the government (executive capital)', ro: 'Sediul guvernului (capitala executivă)' }, answers: ['Pretoria', 'Tshwane'], show: { en: 'Pretoria', ro: 'Pretoria' } },
    { id: 'cape-town', q: { en: 'Seat of parliament (legislative capital)', ro: 'Sediul parlamentului (capitala legislativă)' }, answers: ['Cape Town', 'Kaapstad', 'Orașul Capului'], show: { en: 'Cape Town', ro: 'Cape Town' } },
    { id: 'bloemfontein', q: { en: 'Judicial capital', ro: 'Capitala judiciară' }, answers: ['Bloemfontein', 'Mangaung'], show: { en: 'Bloemfontein', ro: 'Bloemfontein' } },
    { id: 'johannesburg', q: { en: 'Largest city, built on a gold rush', ro: 'Cel mai mare oraș, construit pe o goană după aur' }, answers: ['Johannesburg', 'Joburg', 'Jo\'burg', 'Egoli'], show: { en: 'Johannesburg', ro: 'Johannesburg' } },
    { id: 'mandela', q: { en: 'First president elected in a fully democratic vote', ro: 'Primul președinte ales într-un vot pe deplin democratic' }, answers: ['Mandela', 'Nelson Mandela', 'Madiba'], show: { en: 'Nelson Mandela', ro: 'Nelson Mandela' } },
    { id: 'robben', q: { en: 'Prison island where he spent 18 years', ro: 'Insula-închisoare unde a stat 18 ani' }, answers: ['Robben Island', 'Robben', 'Insula Robben'], show: { en: 'Robben Island', ro: 'Insula Robben' } },
    { id: 'table', q: { en: 'Flat-topped mountain above Cape Town', ro: 'Muntele cu vârf plat de deasupra orașului Cape Town' }, answers: ['Table Mountain', 'Muntele Masă', 'Muntele Masa', 'Tafelberg'], show: { en: 'Table Mountain', ro: 'Muntele Masă' } },
    { id: 'agulhas', q: { en: 'Southernmost point of Africa', ro: 'Cel mai sudic punct al Africii' }, answers: ['Cape Agulhas', 'Agulhas', 'Capul Agulhas', 'Capul Acelor'], show: { en: 'Cape Agulhas', ro: 'Capul Agulhas' } },
    { id: 'apartheid', q: { en: 'System of racial segregation that ended in the 1990s', ro: 'Sistemul de segregare rasială încheiat în anii 1990' }, answers: ['apartheid'], show: { en: 'Apartheid', ro: 'Apartheid' } },
    { id: 'rand', q: { en: 'Currency', ro: 'Moneda' }, answers: ['rand', 'ZAR'], show: { en: 'Rand', ro: 'Rand' } },
    { id: 'kruger', q: { en: 'Biggest national park, home of the Big Five', ro: 'Cel mai mare parc național, casa celor „Big Five”' }, answers: ['Kruger', 'Kruger National Park', 'Parcul Kruger'], show: { en: 'Kruger', ro: 'Kruger' } },
    { id: 'lesotho', q: { en: 'Mountain kingdom entirely surrounded by South Africa', ro: 'Regatul montan înconjurat complet de Africa de Sud' }, answers: ['Lesotho'], show: { en: 'Lesotho', ro: 'Lesotho' } },
    { id: 'orange', q: { en: 'Longest river, along the border with Namibia', ro: 'Cel mai lung râu, la granița cu Namibia' }, answers: ['Orange', 'Orange River', 'râul Orange', 'Gariep'], show: { en: 'Orange', ro: 'Orange' } },
    { id: 'kimberley', q: { en: 'Diamond city of the "Big Hole"', ro: 'Orașul diamantelor, cu „Big Hole”' }, answers: ['Kimberley'], show: { en: 'Kimberley', ro: 'Kimberley' } },
    { id: 'afrikaans', q: { en: 'Language that grew out of Dutch', ro: 'Limba care s-a dezvoltat din olandeză' }, answers: ['Afrikaans'], show: { en: 'Afrikaans', ro: 'Afrikaans' } },
    { id: 'springboks', q: { en: 'Nickname of the national rugby team', ro: 'Porecla echipei naționale de rugby' }, answers: ['Springboks', 'Springbok', 'Boks', 'Bokke'], show: { en: 'Springboks', ro: 'Springboks' } },
    { id: '2010', q: { en: 'Year it hosted the football World Cup', ro: 'Anul în care a găzduit Campionatul Mondial de fotbal' }, answers: ['2010'], show: { en: '2010', ro: '2010' } },
    { id: 'languages', q: { en: 'How many official languages?', ro: 'Câte limbi oficiale are?' }, answers: ['12', 'twelve', 'douăsprezece', 'doisprezece'], show: { en: '12', ro: '12' } },
    { id: 'drakensberg', q: { en: 'Highest mountain range, along Lesotho', ro: 'Cel mai înalt lanț muntos, de-a lungul Lesotho' }, answers: ['Drakensberg', 'uKhahlamba', 'Munții Dragonului'], show: { en: 'Drakensberg', ro: 'Drakensberg' } },
  ],
}
