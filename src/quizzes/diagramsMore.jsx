/**
 * Even more drawings for DiagramQuiz (see diagramQuizzes.jsx for the item format):
 * rivers and coasts, the atmosphere, kinds of volcanoes, the Milky Way, the life of stars,
 * and maps of the Moon and of Mars.
 */
import { t } from '../i18n'

const Arrow = ({ id }) => (
  <marker id={id} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
    <path d="M0 0 L10 5 L0 10 z" className="dgq-arrowhead" />
  </marker>
)
const it = (id, name, ro, alt, roAlt, info, roInfo, badge, leader) => ({ id, name, ro, alt, roAlt, info, roInfo, badge, ...(leader ? { leader } : {}) })

// ── Rivers and coasts ───────────────────────────────────────────────────────
// A map seen from above: mountains at the top, a river down to the sea, a rocky headland on the right.
const COAST = 'M0 520 C80 526 200 538 290 540 C360 541 470 536 540 532 C556 520 568 504 584 482 L606 482 C620 504 640 528 665 540 C690 548 712 550 722 548 C740 528 776 512 812 510 C840 512 858 528 868 560 C876 590 890 626 912 642 C928 650 946 640 952 620 C958 596 960 566 972 546 C982 536 992 534 1000 534'
const SEA = `${COAST} L1000 700 L0 700 Z`
const LAND = `${COAST} L1000 0 L0 0 Z`
const RIVER = 'M150 98 C168 150 150 190 196 232 C240 270 320 286 364 306 C392 318 410 330 424 352 C442 384 392 398 388 424 C384 452 432 462 478 452 C520 442 548 452 566 470 C578 480 588 488 595 496'
const TRIB = 'M710 122 C690 170 640 196 590 214 C540 232 488 258 452 296 C438 312 430 326 424 352'
const FLOOD = 'M392 340 C430 336 462 370 456 404 C500 412 560 426 600 470 C612 490 594 508 560 502 C520 490 470 494 420 488 C350 482 296 470 292 432 C290 400 320 380 352 372 C370 360 378 346 392 340 Z'
const OXBOW = 'M318 404 C300 430 316 462 352 470 C334 458 322 436 336 412 Z'
const LAGOON = 'M120 506 C150 488 230 484 300 494 C320 500 312 516 290 520 C230 528 160 528 124 520 C112 516 112 510 120 506 Z'
const BEACH = 'M728 548 C746 528 778 514 812 512 C838 514 856 530 866 558 L854 562 C846 538 830 526 810 526 C780 528 754 540 738 556 Z'
const SPIT = 'M716 552 C700 570 670 586 628 594 C614 596 606 592 612 586 C650 578 684 566 708 548 Z'
const HEADLAND = 'M868 560 C876 590 890 626 912 642 C928 650 946 640 952 620 C958 596 960 566 972 546 C960 540 930 538 900 540 C886 544 872 550 868 560 Z'
const RIVER_COAST = [
  it('source', 'Source', 'Izvor', ['Spring', 'River source', 'Headwaters'], ['Izvorul', 'Obârșie', 'Obârșia'],
    'Where a river begins: a spring, a lake or a melting glacier high in the hills', 'Locul de unde pornește un râu: un izvor, un lac sau un ghețar care se topește, sus în munți', [120, 92], [150, 98]),
  it('tributary', 'Tributary', 'Afluent', ['Tributary river', 'Affluent'], ['Afluentul', 'Râu afluent'],
    'A smaller river that flows into a bigger one. The Amazon has more than 1,000', 'Un râu mai mic care se varsă în altul mai mare. Amazonul are peste 1.000', [640, 186]),
  it('confluence', 'Confluence', 'Confluență', ['Confluence point', 'Junction'], ['Confluența', 'Punct de confluență', 'Unire'],
    'The place where two rivers meet, like the Rhine and the Moselle at Koblenz', 'Locul unde se întâlnesc două râuri, ca Rinul și Mosela la Koblenz', [462, 346], [424, 352]),
  it('watershed', 'Watershed', 'Cumpăna apelor', ['Drainage divide', 'Water divide', 'Divide', 'Ridge'], ['Cumpana apelor', 'Linie de cumpănă', 'Cumpănă', 'Linia de separație a apelor'],
    'The ridge that splits the rain between two river basins, one on each side', 'Creasta care împarte apa ploilor între două bazine hidrografice, câte unul de fiecare parte', [330, 40]),
  it('floodplain', 'Floodplain', 'Luncă', ['Flood plain', 'Plain'], ['Lunca', 'Câmpie inundabilă', 'Albie majoră'],
    'The flat land beside a river that floods when the water is high; its silt makes it very fertile', 'Terenul plat de lângă râu, inundat la ape mari; mâlul lăsat în urmă îl face foarte fertil', [540, 488]),
  it('oxbow', 'Oxbow lake', 'Lac de meandru', ['Oxbow', 'Cutoff lake', 'Billabong'], ['Braț mort', 'Brat mort', 'Lac în formă de potcoavă', 'Meandru părăsit'],
    'A curved lake left behind when a river cuts through the neck of a meander', 'Un lac curbat, rămas când râul taie gâtul unui meandru și își scurtează drumul', [290, 448], [326, 440]),
  it('estuary', 'Estuary', 'Estuar', ['River mouth', 'Firth'], ['Estuarul', 'Gură de vărsare', 'Gura de vărsare'],
    'A wide river mouth where fresh water mixes with the tide, like the Thames or the Río de la Plata', 'O gură de vărsare largă, unde apa dulce se amestecă cu mareea, ca la Tamisa sau Río de la Plata', [596, 548]),
  it('lagoon', 'Lagoon', 'Lagună', ['Coastal lagoon'], ['Laguna', 'Liman', 'Lac litoral'],
    'Shallow sea water cut off by a strip of sand, like the lagoon of Venice', 'Apă de mare puțin adâncă, despărțită de larg printr-o fâșie de nisip, ca laguna Veneției', [210, 506]),
  it('spit', 'Spit', 'Săgeată litorală', ['Sand spit', 'Sandbar', 'Barrier'], ['Sageata litorala', 'Cordon litoral', 'Grind', 'Limbă de nisip', 'Perisip'],
    'A long finger of sand built by waves carrying sand along the coast', 'Un deget lung de nisip, construit de valurile care cară nisipul de-a lungul țărmului', [652, 612], [660, 584]),
  it('beach', 'Beach', 'Plajă', ['Sandy beach', 'Bay beach'], ['Plaja', 'Plajă de nisip'],
    'Sand and pebbles dropped by the waves in a sheltered bay', 'Nisip și pietriș lăsate de valuri într-un golf adăpostit', [792, 494], [796, 520]),
  it('headland', 'Headland', 'Promontoriu', ['Cape', 'Point', 'Promontory'], ['Promontoriul', 'Cap', 'Capul'],
    'Hard rock that sticks out into the sea while the softer coast around it wears away', 'Rocă dură care înaintează în mare, în timp ce țărmul mai moale din jur e ros de valuri', [924, 584]),
  it('cliff', 'Cliff', 'Faleză', ['Sea cliff', 'Cliffs'], ['Faleza', 'Faleze', 'Stâncă abruptă', 'Mal abrupt'],
    'A steep rock face cut by the waves, like the White Cliffs of Dover', 'Un perete de stâncă abrupt, tăiat de valuri, ca falezele albe din Dover', [846, 610], [876, 600]),
  it('cave', 'Sea cave', 'Grotă marină', ['Cave', 'Coastal cave'], ['Grota marina', 'Peșteră marină', 'Grotă', 'Pestera'],
    'Waves pound a crack in the cliff until it becomes a cave', 'Valurile lovesc o crăpătură din faleză până o transformă în peșteră', [990, 600], [962, 588]),
  it('arch', 'Sea arch', 'Arcadă marină', ['Arch', 'Natural arch'], ['Arcada marina', 'Arcadă', 'Pod natural', 'Arc natural'],
    'Two caves meet through a headland and leave a bridge of rock', 'Două peșteri se unesc prin promontoriu și lasă un pod de piatră', [856, 676], [890, 668]),
  it('stack', 'Sea stack', 'Stâncă izolată', ['Stack', 'Rock stack', 'Sea pillar'], ['Stanca izolata', 'Ac marin', 'Coloană de stâncă', 'Stâlp marin'],
    'What is left when the top of an arch falls in, like the Twelve Apostles in Australia', 'Ce rămâne după ce se prăbușește bolta unei arcade, ca cei Doisprezece Apostoli din Australia', [992, 660], [972, 666]),
]

function drawRiverCoast({ cls }) {
  const peaks = [[20, 150, 90], [90, 120, 60], [170, 96, 80], [250, 92, 70], [330, 88, 64], [420, 80, 76], [500, 82, 60], [580, 72, 80], [660, 76, 70], [740, 74, 62], [820, 70, 80], [900, 84, 60], [970, 96, 70]]
  return (
    <>
      <defs><linearGradient id="rc-sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2f6fa3" /><stop offset="1" stopColor="#1b4a78" /></linearGradient></defs>
      <path d={LAND} fill="#5f8f4e" />
      <path d={SEA} fill="url(#rc-sea)" />
      {/* hills and mountains */}
      <path d="M0 0 H1000 V150 C820 176 600 160 420 170 C260 180 120 186 0 196 Z" fill="#69804f" />
      {peaks.map(([x, y, w], i) => (
        <g key={i}>
          <path d={`M${x - w} ${y + 70} L${x} ${y - 30} L${x + w} ${y + 70} Z`} fill="#8b8270" />
          <path d={`M${x - w * 0.28} ${y - 2} L${x} ${y - 30} L${x + w * 0.28} ${y - 2} L${x + 8} ${y + 6} L${x - 6} ${y} Z`} fill="#eef3f7" />
        </g>
      ))}
      <path d="M10 112 C120 60 220 58 320 64 C430 58 520 50 620 50 C720 48 820 50 1000 64" fill="none" className={`dgq-line${cls('watershed')}`} />
      <path d={FLOOD} fill="#88b067" className={`dgq-layer${cls('floodplain')}`} />
      <path d={OXBOW} fill="#4f9bd6" className={`dgq-layer${cls('oxbow')}`} />
      <path d={RIVER} fill="none" stroke="#4f9bd6" strokeWidth="9" strokeLinecap="round" />
      <path d={TRIB} fill="none" stroke="#4f9bd6" strokeWidth="6" strokeLinecap="round" className={`dgq-river${cls('tributary')}`} />
      <path d="M540 532 C556 520 568 504 584 482 L606 482 C620 504 640 528 665 540 C640 556 570 556 540 532 Z" fill="#3f86c4" className={`dgq-layer${cls('estuary')}`} />
      <path d={LAGOON} fill="#57a7cf" className={`dgq-layer${cls('lagoon')}`} />
      <path d={SPIT} fill="#e6d29a" className={`dgq-layer${cls('spit')}`} />
      <path d={BEACH} fill="#ecd9a0" className={`dgq-layer${cls('beach')}`} />
      <path d={HEADLAND} fill="#7c8f5c" className={`dgq-layer${cls('headland')}`} />
      <path d="M868 560 C876 590 890 626 912 642 C928 650 946 640 952 620 C958 596 960 566 972 546" fill="none" stroke="#a68b62" strokeWidth="9" className={`dgq-river${cls('cliff')}`} />
      <ellipse cx="961" cy="588" rx="7" ry="10" fill="#1c2430" className={`dgq-layer${cls('cave')}`} />
      <g className={`dgq-layer${cls('arch')}`} fill="#a68b62"><path d="M870 680 L872 654 C876 646 898 646 904 654 L908 680 L898 680 L896 664 C892 658 884 658 882 664 L880 680 Z" /></g>
      <path d="M964 682 L962 656 C964 650 978 650 980 656 L978 682 Z" fill="#a68b62" className={`dgq-layer${cls('stack')}`} />
      <circle cx="150" cy="98" r="8" className={`dgq-dot${cls('source')}`} />
      <circle cx="424" cy="352" r="8" className={`dgq-dot${cls('confluence')}`} />
      {[[60, 620], [300, 640], [470, 660], [760, 640]].map(([x, y], i) => <path key={i} d={`M${x} ${y} q12 -8 24 0 t24 0`} fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />)}
    </>
  )
}

// ── The atmosphere: what's up there ────────────────────────────────────────
// Heights are squeezed: each layer gets its own scale (log scale above 85 km).
const altY = (km) => km <= 12 ? 680 - km / 12 * 130 : km <= 50 ? 550 - (km - 12) / 38 * 150 : km <= 85 ? 400 - (km - 50) / 35 * 140
  : km <= 600 ? 260 - Math.log(km / 85) / Math.log(600 / 85) * 180 : 80 - Math.min(1, Math.log(km / 600) / Math.log(40000 / 600)) * 70
const AIR = [
  it('everest', 'Mount Everest', 'Everest', ['Everest'], ['Muntele Everest', 'Vârful Everest'],
    '8,849 m: the highest point on Earth, where the air holds a third of the oxygen at sea level', '8.849 m: cel mai înalt punct de pe Pământ, unde aerul are o treime din oxigenul de la nivelul mării', [150, altY(8.8) - 26], [150, altY(8.8)]),
  it('weather', 'Weather and rain clouds', 'Vremea și norii de ploaie', ['Clouds', 'Weather', 'Rain clouds', 'Storm clouds'], ['Nori', 'Vremea', 'Nori de ploaie', 'Norii', 'Furtuni'],
    'Almost all clouds, rain and storms happen in the lowest layer, the troposphere', 'Aproape toți norii, ploile și furtunile au loc în stratul cel mai de jos, troposfera', [330, 594]),
  it('airliner', 'Airliner', 'Avion de linie', ['Plane', 'Airplane', 'Aeroplane', 'Passenger jet', 'Jet'], ['Avion', 'Avionul', 'Avion de pasageri'],
    'Passenger jets cruise at 10–12 km, just under the stratosphere, above most of the weather', 'Avioanele de pasageri zboară la 10–12 km, chiar sub stratosferă, deasupra majorității norilor', [520, altY(11) - 34], [520, altY(11)]),
  it('jet-stream', 'Jet stream', 'Curent-jet', ['Jetstream', 'Jet streams'], ['Curentul jet', 'Curent jet', 'Jet stream'],
    'A river of wind at 300–400 km/h near the top of the troposphere; flights ride it eastwards', 'Un râu de vânt de 300–400 km/h aproape de vârful troposferei; avioanele îl folosesc spre est', [930, altY(10.5) - 24]),
  it('ozone', 'Ozone layer', 'Stratul de ozon', ['Ozone'], ['Ozon', 'Ozonosfera', 'Stratul de ozon'],
    'At 15–35 km it soaks up most of the Sun\'s ultraviolet rays', 'La 15–35 km, oprește cea mai mare parte din razele ultraviolete ale Soarelui', [80, altY(24)]),
  it('balloon', 'Weather balloon', 'Balon meteorologic', ['Balloon', 'Radiosonde', 'Sounding balloon'], ['Balon', 'Balon-sondă', 'Radiosondă', 'Radiosonda'],
    'Hundreds go up every day to measure the air; they swell and burst at about 35 km', 'Sute de baloane urcă zilnic ca să măsoare aerul; se umflă și se sparg pe la 35 km', [292, altY(35) - 10], [262, altY(35)]),
  it('meteors', 'Shooting stars', 'Stele căzătoare', ['Meteors', 'Meteor', 'Shooting star'], ['Meteori', 'Meteoriți', 'Stea căzătoare', 'Meteor'],
    'Grains of space dust burn up 70–100 km high, in the mesosphere', 'Grăunțe de praf cosmic care ard la 70–100 km înălțime, în mezosferă', [800, altY(78) + 34], [770, altY(78)]),
  it('noctilucent', 'Noctilucent clouds', 'Nori noctilucenți', ['Night-shining clouds', 'Polar mesospheric clouds'], ['Nori noctilucenti', 'Norii noctilucenți', 'Nori argintii'],
    'The highest clouds, ice at about 83 km, glowing blue after sunset in summer', 'Cei mai înalți nori, cristale de gheață la circa 83 km, care strălucesc albastru după apus, vara', [300, altY(83) - 18]),
  it('karman', 'Kármán line', 'Linia Kármán', ['Karman line', 'Edge of space'], ['Linia Karman', 'Granița spațiului', 'Marginea spațiului'],
    '100 km: where space officially begins', '100 km: locul unde începe oficial spațiul cosmic', [100, altY(100)]),
  it('aurora', 'Aurora', 'Aurora polară', ['Northern lights', 'Aurora borealis', 'Polar lights', 'Southern lights'], ['Aurora', 'Aurora boreală', 'Aurora boreala', 'Luminile nordului'],
    'Particles from the Sun make the air glow green and red at 100–300 km', 'Particule venite de la Soare fac aerul să strălucească verde și roșu la 100–300 km', [610, altY(180)]),
  it('iss', 'International Space Station', 'Stația Spațială Internațională', ['ISS', 'Space station'], ['ISS', 'Statia Spatiala Internationala', 'Stația spațială', 'SSI'],
    'Orbits at about 400 km, going round the Earth every 90 minutes', 'Orbitează la circa 400 km și înconjoară Pământul o dată la 90 de minute', [860, altY(408) + 30], [830, altY(408)]),
  it('hubble', 'Hubble Space Telescope', 'Telescopul spațial Hubble', ['Hubble', 'Hubble telescope'], ['Hubble', 'Telescopul Hubble'],
    'At 540 km, above almost all the air, so its pictures stay sharp', 'La 540 km, deasupra aproape întregului aer, așa că imaginile lui sunt clare', [420, altY(540) + 26], [390, altY(540)]),
  it('gps', 'GPS satellites', 'Sateliții GPS', ['GPS', 'Satellites', 'Navigation satellites', 'GPS satellite'], ['GPS', 'Sateliti GPS', 'Sateliți', 'Satelit GPS'],
    'Far out at 20,200 km, in the exosphere where the air fades into space', 'Departe, la 20.200 km, în exosferă, unde aerul se pierde în spațiu', [650, 40], [700, 30]),
]
const LAYERS = [
  ['Troposphere', 0, 12, '#3a6ea8'], ['Stratosphere', 12, 50, '#2c5688'], ['Mesosphere', 50, 85, '#22426d'], ['Thermosphere', 85, 600, '#182f52'], ['Exosphere', 600, 40000, '#0f1d36'],
]
function drawAtmosphere({ cls }) {
  const sat = (x, y, s = 1) => <g transform={`translate(${x} ${y}) scale(${s})`}><rect x="-6" y="-5" width="12" height="10" rx="2" fill="#d9dee8" /><rect x="-26" y="-4" width="17" height="8" fill="#4d7fd1" /><rect x="9" y="-4" width="17" height="8" fill="#4d7fd1" /></g>
  return (
    <>
      {LAYERS.map(([n, a, b, c]) => <rect key={n} x="0" y={altY(b)} width="1000" height={altY(a) - altY(b)} fill={c} />)}
      {LAYERS.map(([n, a, b]) => <text key={n} x="990" y={(altY(a) + altY(b)) / 2 + 6} textAnchor="end" className="dgq-axis-text" opacity="0.55">{t(n)}</text>)}
      {[0, 12, 50, 85, 600].map(k => <text key={k} x="8" y={altY(k) - 4} className="dgq-axis-text" opacity="0.5" fontSize="14">{k} km</text>)}
      {/* ground and Everest */}
      <path d="M0 680 H1000 V700 H0 Z" fill="#4c6b3c" />
      <path d={`M60 680 L150 ${altY(8.8)} L240 680 Z`} fill="#7e7466" className={`dgq-layer${cls('everest')}`} />
      <path d={`M128 ${altY(8.8) + 26} L150 ${altY(8.8)} L172 ${altY(8.8) + 26} L160 ${altY(8.8) + 20} L150 ${altY(8.8) + 28} L140 ${altY(8.8) + 20} Z`} fill="#eef3f7" />
      {/* weather clouds */}
      <g className={`dgq-layer${cls('weather')}`} fill="#dfe6ef">
        <path d="M270 650 C262 630 284 618 300 626 C306 604 342 600 352 620 C370 612 392 626 386 646 C396 652 392 664 380 664 H280 C266 664 262 656 270 650 Z" />
      </g>
      {[300, 320, 340, 360].map(x => <line key={x} x1={x} y1="668" x2={x - 6} y2="680" stroke="#9fc4ea" strokeWidth="2" />)}
      {/* airliner */}
      <g className={`dgq-layer${cls('airliner')}`} fill="#eef1f6" transform={`translate(520 ${altY(11)})`}>
        <path d="M-34 0 C-30 -4 20 -4 30 -2 C36 -1 36 3 30 4 C20 6 -30 6 -34 2 Z M-6 0 L-18 -18 L-10 -18 L8 0 Z M-6 2 L-18 18 L-10 18 L8 2 Z M-30 0 L-36 -10 L-30 -10 L-24 0 Z" />
      </g>
      <path d={`M640 ${altY(10.5)} C700 ${altY(10.5) - 14} 760 ${altY(10.5) + 14} 820 ${altY(10.5)} S 920 ${altY(10.5) - 10} 960 ${altY(10.5)}`} fill="none" stroke="#c8e0ff" strokeWidth="4" markerEnd="url(#at-arrow)" className={`dgq-river${cls('jet-stream')}`} />
      <rect x="0" y={altY(30)} width="1000" height={altY(18) - altY(30)} fill="rgba(140,110,230,0.28)" className={`dgq-layer${cls('ozone')}`} />
      <g className={`dgq-layer${cls('balloon')}`}><circle cx="262" cy={altY(35)} r="14" fill="#f2f2f2" /><line x1="262" y1={altY(35) + 14} x2="262" y2={altY(35) + 40} stroke="#ccc" strokeWidth="1.5" /><rect x="257" y={altY(35) + 40} width="10" height="8" fill="#e98b4a" /></g>
      <g className={`dgq-river${cls('meteors')}`} stroke="#fff3c4" strokeWidth="3" strokeLinecap="round">
        <line x1="700" y1={altY(92)} x2="770" y2={altY(78)} /><line x1="740" y1={altY(96)} x2="800" y2={altY(84)} /><line x1="660" y1={altY(88)} x2="712" y2={altY(76)} />
      </g>
      <g className={`dgq-river${cls('noctilucent')}`} stroke="#7fd3ff" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.9">
        <path d={`M220 ${altY(83)} q30 -6 60 0 t60 0 t60 0`} /><path d={`M240 ${altY(82) + 8} q30 -6 60 0 t60 0`} />
      </g>
      <line x1="0" y1={altY(100)} x2="1000" y2={altY(100)} className={`dgq-line dgq-karman${cls('karman')}`} />
      <g className={`dgq-layer${cls('aurora')}`}>
        <path d={`M520 ${altY(110)} C540 ${altY(250)} 560 ${altY(110)} 580 ${altY(260)} C600 ${altY(110)} 620 ${altY(270)} 640 ${altY(115)} C660 ${altY(250)} 680 ${altY(120)} 700 ${altY(240)} L700 ${altY(105)} L520 ${altY(105)} Z`} fill="rgba(80,230,140,0.45)" />
      </g>
      <g className={`dgq-layer${cls('iss')}`}>{sat(830, altY(408), 1.2)}</g>
      <g className={`dgq-layer${cls('hubble')}`} transform={`translate(390 ${altY(540)})`}><rect x="-16" y="-6" width="32" height="12" rx="5" fill="#cfd5df" /><rect x="-10" y="-20" width="8" height="14" fill="#4d7fd1" /><rect x="-10" y="6" width="8" height="14" fill="#4d7fd1" /></g>
      <g className={`dgq-layer${cls('gps')}`}>{sat(700, 30, 0.9)}{sat(770, 54, 0.7)}</g>
      <defs><Arrow id="at-arrow" /></defs>
    </>
  )
}

// ── Kinds of volcanoes ──────────────────────────────────────────────────────
const PANEL_W = 250, PANEL_H = 310
const pan = (i) => [(i % 4) * PANEL_W, Math.floor(i / 4) * PANEL_H + 10]
const VOLC_TYPES = [
  ['shield', 'Shield volcano', 'Vulcan scut', ['Shield'], ['Vulcan-scut', 'Vulcan în scut', 'Scut'],
    'Wide and gentle, built by runny basalt lava. Mauna Loa in Hawaii is the biggest on Earth', 'Larg și domol, construit din lavă bazaltică fluidă. Mauna Loa din Hawaii e cel mai mare de pe Pământ'],
  ['strato', 'Stratovolcano', 'Stratovulcan', ['Composite volcano', 'Composite', 'Strato volcano'], ['Vulcan stratificat', 'Vulcan compus', 'Strato-vulcan'],
    'A steep cone of layered ash and lava, with violent eruptions: Fuji, Vesuvius, Etna', 'Un con abrupt din straturi de cenușă și lavă, cu erupții violente: Fuji, Vezuviu, Etna'],
  ['cinder', 'Cinder cone', 'Con de zgură', ['Scoria cone', 'Cinder'], ['Con de cenușă', 'Con de scorie', 'Con de scorii'],
    'A small steep hill of loose cinders. Parícutin in Mexico grew out of a cornfield in 1943', 'Un deal mic și abrupt din zgură afânată. Parícutin, în Mexic, a crescut dintr-un lan de porumb în 1943'],
  ['caldera', 'Caldera', 'Calderă', ['Volcanic caldera', 'Crater lake'], ['Caldera', 'Lac de calderă'],
    'A huge bowl left when a volcano collapses into its emptied magma chamber, like Crater Lake in Oregon', 'O căldare uriașă rămasă când vulcanul se prăbușește în camera de magmă golită, ca Crater Lake din Oregon'],
  ['dome', 'Lava dome', 'Dom de lavă', ['Volcanic dome', 'Dome'], ['Dom vulcanic', 'Dom', 'Cupolă de lavă'],
    'Lava so thick it piles up over the vent instead of flowing, like the dome inside Mount St. Helens', 'Lavă atât de vâscoasă încât se adună peste coș în loc să curgă, ca domul din Mount St. Helens'],
  ['fissure', 'Fissure eruption', 'Erupție fisurală', ['Fissure', 'Fissure vent', 'Rift eruption'], ['Eruptie fisurala', 'Fisură', 'Fisura', 'Vulcan fisural'],
    'Lava pours out of a long crack in the ground instead of a single cone, often in Iceland', 'Lava iese pe o crăpătură lungă din pământ, nu printr-un singur con; se întâmplă des în Islanda'],
  ['submarine', 'Underwater volcano', 'Vulcan submarin', ['Submarine volcano', 'Seamount'], ['Munte submarin', 'Vulcan subacvatic'],
    'Most eruptions happen unseen on the sea floor; some grow into islands, like Surtsey in 1963', 'Cele mai multe erupții au loc nevăzute pe fundul mării; unele devin insule, ca Surtsey în 1963'],
  ['geyser', 'Geyser', 'Gheizer', ['Geysers'], ['Gheizerul', 'Gheizere'],
    'Water heated by magma underground that shoots up from time to time, like Old Faithful or Strokkur', 'Apă încălzită de magma din adânc, care țâșnește din când în când, ca Old Faithful sau Strokkur'],
]
const VOLCANO_TYPES = VOLC_TYPES.map(([id, name, ro, alt, roAlt, info, roInfo], i) => { const [x, y] = pan(i); return it(id, name, ro, alt, roAlt, info, roInfo, [x + 26, y + 26]) })
function drawVolcanoTypes({ cls }) {
  const g = 240 // ground line inside a panel
  const shapes = {
    shield: <path d={`M10 ${g} C70 ${g - 40} 100 ${g - 74} 125 ${g - 78} C150 ${g - 74} 180 ${g - 40} 240 ${g} Z`} fill="#6b5446" />,
    strato: <><path d={`M40 ${g} L110 ${g - 150} Q125 ${g - 162} 140 ${g - 150} L210 ${g} Z`} fill="#6e5a4c" /><path d={`M92 ${g - 112} L110 ${g - 150} Q125 ${g - 162} 140 ${g - 150} L158 ${g - 112} L144 ${g - 120} L132 ${g - 106} L118 ${g - 120} L106 ${g - 108} Z`} fill="#eef3f7" />{[50, 90].map(d => <path key={d} d={`M${48 + d * 0.45} ${g - d} L${202 - d * 0.45} ${g - d}`} stroke="rgba(0,0,0,0.25)" strokeWidth="3" />)}</>,
    cinder: <><path d={`M70 ${g} L105 ${g - 90} L145 ${g - 90} L180 ${g} Z`} fill="#3d302a" /><path d={`M105 ${g - 90} Q125 ${g - 78} 145 ${g - 90}`} fill="#2a201c" stroke="#2a201c" /></>,
    caldera: <><path d={`M10 ${g} C40 ${g - 70} 60 ${g - 104} 76 ${g - 108} C90 ${g - 70} 160 ${g - 70} 174 ${g - 108} C190 ${g - 104} 210 ${g - 70} 240 ${g} Z`} fill="#6b5a4b" /><path d={`M80 ${g - 92} C100 ${g - 76} 150 ${g - 76} 170 ${g - 92} L172 ${g - 84} C150 ${g - 66} 100 ${g - 66} 78 ${g - 84} Z`} fill="#3d8fd0" /><path d={`M116 ${g - 80} L125 ${g - 92} L134 ${g - 80} Z`} fill="#544336" /></>,
    dome: <><path d={`M60 ${g} C60 ${g - 60} 80 ${g - 92} 125 ${g - 94} C170 ${g - 92} 190 ${g - 60} 190 ${g} Z`} fill="#5b4a41" />{[[95, 40], [140, 60], [115, 75], [160, 30]].map(([x, d], i) => <path key={i} d={`M${x} ${g - d} l10 -6 l8 8`} stroke="rgba(0,0,0,0.35)" strokeWidth="2.5" fill="none" />)}</>,
    fissure: <><rect x="10" y={g - 14} width="230" height="14" fill="#4b3b32" /><path d={`M30 ${g - 14} L220 ${g - 14}`} stroke="#ff8a3d" strokeWidth="5" />{[40, 70, 100, 130, 160, 190, 210].map((x, i) => <path key={x} d={`M${x} ${g - 14} Q${x + 4} ${g - 50 - (i % 3) * 18} ${x + 8} ${g - 14}`} fill="#ffb74d" />)}</>,
    submarine: <><rect x="6" y="70" width="238" height={g - 70} fill="#24578a" /><path d="M6 70 q19 -8 38 0 t38 0 t38 0 t38 0 t38 0 t38 0 t10 0" fill="none" stroke="#9fd0ff" strokeWidth="3" /><path d={`M40 ${g} L105 ${g - 110} L145 ${g - 110} L210 ${g} Z`} fill="#4a3d36" />{[0, 1, 2].map(i => <circle key={i} cx={120 + i * 8} cy={g - 126 - i * 22} r={4 + i * 2} fill="none" stroke="#bfe3ff" strokeWidth="2" />)}</>,
    geyser: <><rect x="10" y={g - 16} width="230" height="16" fill="#8a7a63" /><path d={`M110 ${g - 16} C100 ${g - 120} 120 ${g - 190} 125 ${g - 210} C130 ${g - 190} 150 ${g - 120} 140 ${g - 16} Z`} fill="#d9eefc" /><ellipse cx="125" cy={g - 212} rx="30" ry="16" fill="#eef7fd" /><ellipse cx="125" cy={g - 14} rx="40" ry="6" fill="#8fc6e8" /></>,
  }
  return (
    <>
      {VOLC_TYPES.map(([id], i) => {
        const [x, y] = pan(i)
        return (
          <g key={id} transform={`translate(${x} ${y})`}>
            <rect x="6" y="6" width={PANEL_W - 12} height={PANEL_H - 22} rx="14" fill="#1b2b4a" />
            <rect x="6" y={g} width={PANEL_W - 12} height={PANEL_H - 22 - g + 6} fill="#3b2f27" />
            <g className={`dgq-layer${cls(id)}`}>{shapes[id]}</g>
          </g>
        )
      })}
    </>
  )
}

// ── The Milky Way, from above ───────────────────────────────────────────────
const GX = 500, GY = 330, PITCH = 0.222
const deg = (a) => a * Math.PI / 180
const gal = (r, a) => [+(GX + r * Math.cos(deg(a))).toFixed(1), +(GY + r * Math.sin(deg(a))).toFixed(1)]
/** A log-spiral arm through radius r90 at 90° (towards the Sun), from angle a0 to a1. */
function armPath(r90, a0, a1) {
  let d = ''
  for (let a = a0; a <= a1; a += 4) { const [x, y] = gal(r90 * Math.exp(PITCH * deg(a - 90)), a); d += `${d ? 'L' : 'M'}${x} ${y}` }
  return d
}
const ARMS = {
  'scutum-centaurus': [102, 27, 362], 'perseus': [205, -153, 188], 'sagittarius': [130, -70, 300], 'norma': [66, 120, 330],
}
const armAt = (id, a) => { const [r90] = ARMS[id]; return gal(r90 * Math.exp(PITCH * deg(a - 90)), a) }
const SUN = gal(164, 90)
const MILKY_WAY = [
  it('bulge', 'Galactic bulge', 'Bulbul galactic', ['Bulge', 'Galactic centre', 'Galactic center', 'Core'], ['Bulb galactic', 'Centrul galaxiei', 'Nucleul galactic', 'Centrul galactic'],
    'A crowded ball of old stars at the centre, about 10,000 light-years across', 'O îngrămădire de stele bătrâne în centru, lată de circa 10.000 de ani-lumină', [GX - 64, GY - 40]),
  it('sgr-a', 'Sagittarius A*', 'Săgetătorul A*', ['Sagittarius A', 'Sgr A*', 'Black hole', 'Supermassive black hole'], ['Sagetatorul A*', 'Gaura neagră', 'Gaură neagră supermasivă', 'Sgr A*'],
    'The supermassive black hole at the very centre, 4 million times heavier than the Sun', 'Gaura neagră supermasivă din centru, de 4 milioane de ori mai grea decât Soarele', [GX + 34, GY - 52], [GX, GY]),
  it('bar', 'Central bar', 'Bara centrală', ['Galactic bar', 'Bar'], ['Bara centrala', 'Bara galactică', 'Bară'],
    'The Milky Way is a barred spiral: a long bar of stars crosses its middle', 'Calea Lactee e o spirală barată: o bară lungă de stele îi traversează mijlocul', gal(118, 27)),
  it('scutum-centaurus', 'Scutum–Centaurus Arm', 'Brațul Scutul–Centaurul', ['Scutum-Centaurus Arm', 'Scutum-Centaurus', 'Scutum Centaurus', 'Scutum–Centaurus'], ['Bratul Scutul-Centaurul', 'Scutul-Centaurul', 'Brațul Scutum-Centaurus', 'Scutum-Centaurus'],
    'One of the two major arms, starting at one end of the bar', 'Unul dintre cele două brațe mari, pornește de la un capăt al barei', armAt('scutum-centaurus', 300)),
  it('perseus', 'Perseus Arm', 'Brațul Perseu', ['Perseus'], ['Bratul Perseu', 'Perseu', 'Brațul lui Perseu'],
    'The other major arm, just outside the Sun\'s position', 'Celălalt braț mare, puțin mai în afară decât Soarele', armAt('perseus', 150)),
  it('sagittarius', 'Sagittarius Arm', 'Brațul Săgetătorul', ['Sagittarius–Carina Arm', 'Sagittarius-Carina', 'Sagittarius'], ['Bratul Sagetatorul', 'Săgetătorul', 'Brațul Săgetătorul–Carina'],
    'A minor arm between the Sun and the centre; it hides the centre from us behind dust', 'Un braț mai mic, între Soare și centru; praful lui ne ascunde centrul galaxiei', armAt('sagittarius', 210)),
  it('norma', 'Norma Arm', 'Brațul Echerul', ['Norma'], ['Bratul Echerul', 'Brațul Norma', 'Echerul', 'Norma'],
    'A minor inner arm close to the bar', 'Un braț interior mai mic, aproape de bară', armAt('norma', 280)),
  it('orion-arm', 'Orion Arm', 'Brațul Orion', ['Orion Spur', 'Local Arm', 'Orion–Cygnus Arm'], ['Bratul Orion', 'Brațul local', 'Pintenul Orion', 'Orion'],
    'A short spur between two arms; our Solar System sits in it', 'Un pinten scurt între două brațe; în el se află Sistemul nostru Solar', gal(186, 62)),
  it('sun', 'The Sun', 'Soarele', ['Sun', 'Solar System', 'Us', 'You are here'], ['Soare', 'Sistemul Solar', 'Noi', 'Sistemul solar'],
    '26,000 light-years from the centre; it takes 230 million years to go round once', 'La 26.000 de ani-lumină de centru; are nevoie de 230 de milioane de ani ca să facă un tur', [SUN[0] + 30, SUN[1] + 26], SUN),
  it('halo', 'Galactic halo', 'Haloul galactic', ['Halo', 'Stellar halo'], ['Halou', 'Haloul', 'Halo galactic'],
    'A huge sphere of old stars and globular clusters around the disc, full of dark matter', 'O sferă uriașă de stele bătrâne și roiuri globulare în jurul discului, plină de materie întunecată', [GX + 290, GY - 250]),
  it('lmc', 'Large Magellanic Cloud', 'Marele Nor al lui Magellan', ['Large Magellanic', 'LMC'], ['Norul Mare al lui Magellan', 'Marele Nor Magellanic', 'LMC'],
    'A small galaxy orbiting ours, seen with the naked eye from the southern hemisphere', 'O galaxie mică ce orbitează în jurul nostru, vizibilă cu ochiul liber din emisfera sudică', [118, 568]),
  it('smc', 'Small Magellanic Cloud', 'Micul Nor al lui Magellan', ['Small Magellanic', 'SMC'], ['Norul Mic al lui Magellan', 'Micul Nor Magellanic', 'SMC'],
    'The Large Cloud\'s smaller partner, about 200,000 light-years away', 'Partenerul mai mic al Norului Mare, la circa 200.000 de ani-lumină', [232, 622]),
]
function drawMilkyWay({ cls }) {
  const stars = Array.from({ length: 220 }, (_, i) => { const a = Math.sin(i * 12.9898) * 43758.5, b = Math.sin(i * 78.233) * 43758.5; return [(a - Math.floor(a)) * 1000, (b - Math.floor(b)) * 660] })
  return (
    <>
      <defs>
        <radialGradient id="mw-disc"><stop offset="0" stopColor="rgba(255,230,180,0.5)" /><stop offset="0.35" stopColor="rgba(160,170,230,0.18)" /><stop offset="1" stopColor="rgba(80,100,180,0)" /></radialGradient>
        <radialGradient id="mw-bulge"><stop offset="0" stopColor="#fff3cf" /><stop offset="0.5" stopColor="#f5c97a" /><stop offset="1" stopColor="rgba(240,170,90,0)" /></radialGradient>
        <filter id="mw-blur"><feGaussianBlur stdDeviation="5" /></filter>
      </defs>
      <rect x="0" y="0" width="1000" height="660" fill="#070c1a" />
      {stars.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={i % 9 ? 0.8 : 1.4} fill="rgba(255,255,255,0.5)" />)}
      <circle cx={GX} cy={GY} r="320" fill="none" stroke="rgba(170,180,255,0.18)" strokeWidth="2" strokeDasharray="6 8" className={`dgq-layer${cls('halo')}`} />
      {[[200, 40], [810, 140], [760, 560], [260, 120], [880, 380], [140, 300]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="3" fill="#ffe6a8" opacity="0.8" />)}
      <circle cx={GX} cy={GY} r="300" fill="url(#mw-disc)" />
      {Object.entries(ARMS).map(([id, [r90, a0, a1]]) => (
        <g key={id}>
          <path d={armPath(r90, a0, a1)} fill="none" stroke="rgba(150,180,255,0.35)" strokeWidth={id === 'perseus' || id === 'scutum-centaurus' ? 34 : 22} strokeLinecap="round" filter="url(#mw-blur)" />
          <path d={armPath(r90, a0, a1)} fill="none" stroke="rgba(200,215,255,0.55)" strokeWidth={id === 'perseus' || id === 'scutum-centaurus' ? 6 : 4} strokeLinecap="round" className={`dgq-river${cls(id)}`} />
        </g>
      ))}
      <path d={(() => { let d = ''; for (let a = 40; a <= 130; a += 5) { const [x, y] = gal(150 + (a - 40) * 0.42, a); d += `${d ? 'L' : 'M'}${x} ${y}` } return d })()} fill="none" stroke="rgba(200,215,255,0.55)" strokeWidth="4" strokeLinecap="round" className={`dgq-river${cls('orion-arm')}`} />
      <g transform={`rotate(27 ${GX} ${GY})`}>
        <ellipse cx={GX} cy={GY} rx="96" ry="26" fill="rgba(250,210,140,0.55)" className={`dgq-layer${cls('bar')}`} />
      </g>
      <circle cx={GX} cy={GY} r="58" fill="url(#mw-bulge)" className={`dgq-layer${cls('bulge')}`} />
      <circle cx={GX} cy={GY} r="5" fill="#000" stroke="#ffcf7a" strokeWidth="2" className={`dgq-dot${cls('sgr-a')}`} />
      <circle cx={SUN[0]} cy={SUN[1]} r="7" fill="#ffd54f" className={`dgq-dot${cls('sun')}`} />
      <ellipse cx="130" cy="600" rx="34" ry="20" fill="rgba(200,210,255,0.4)" filter="url(#mw-blur)" />
      <ellipse cx="130" cy="600" rx="22" ry="12" fill="rgba(220,225,255,0.5)" className={`dgq-layer${cls('lmc')}`} />
      <ellipse cx="214" cy="640" rx="14" ry="8" fill="rgba(220,225,255,0.45)" className={`dgq-layer${cls('smc')}`} />
    </>
  )
}

// ── The life of a star ──────────────────────────────────────────────────────
const SL = {
  nebula: [100, 310], protostar: [240, 310], 'main-sequence': [400, 170], 'red-giant': [570, 170], 'planetary-nebula': [740, 170], 'white-dwarf': [900, 170],
  'massive-star': [400, 460], 'red-supergiant': [570, 460], supernova: [740, 460], 'neutron-star': [900, 390], 'black-hole': [900, 540],
}
const sl = (id, dx = 0, dy = 0) => [SL[id][0] + dx, SL[id][1] + dy]
const STAR_LIFE = [
  it('nebula', 'Nebula', 'Nebuloasă', ['Stellar nursery', 'Gas cloud', 'Molecular cloud'], ['Nebuloasa', 'Nor de gaz', 'Nor molecular', 'Pepinieră stelară'],
    'A cloud of gas and dust; where it is densest, gravity pulls it into clumps', 'Un nor de gaz și praf; unde e mai dens, gravitația îl strânge în cocoloașe', sl('nebula', -50, -64)),
  it('protostar', 'Protostar', 'Protostea', ['Proto-star', 'Young star'], ['Proto-stea', 'Protosteaua'],
    'A collapsing clump that heats up until hydrogen starts to fuse in its core', 'Un cocoloș care se prăbușește și se încălzește până când hidrogenul începe să fuzioneze în centru', sl('protostar', 0, -42)),
  it('main-sequence', 'Sun-like star', 'Stea ca Soarele', ['Main-sequence star', 'Main sequence star', 'Yellow dwarf', 'Average star', 'Sun-like', 'Main sequence'], ['Stea de secvență principală', 'Pitică galbenă', 'Pitica galbena', 'Stea medie', 'Stea asemănătoare Soarelui'],
    'Burns hydrogen calmly for about 10 billion years; the Sun is halfway through', 'Arde liniștit hidrogen circa 10 miliarde de ani; Soarele e la jumătatea drumului', sl('main-sequence', 0, -50)),
  it('red-giant', 'Red giant', 'Gigantă roșie', ['Red giant star'], ['Giganta rosie', 'Gigantă roșie', 'Uriașă roșie'],
    'When the hydrogen runs low the star swells up; the Sun will swallow Mercury and Venus', 'Când hidrogenul se termină, steaua se umflă; Soarele va înghiți Mercur și Venus', sl('red-giant', 0, -66)),
  it('planetary-nebula', 'Planetary nebula', 'Nebuloasă planetară', ['Planetary'], ['Nebuloasa planetara'],
    'The giant puffs its outer layers into a glowing shell (nothing to do with planets)', 'Gigantica își aruncă straturile exterioare într-o cochilie strălucitoare (nu are legătură cu planetele)', sl('planetary-nebula', 0, -58)),
  it('white-dwarf', 'White dwarf', 'Pitică albă', ['White dwarf star'], ['Pitica alba', 'Pitică albă'],
    'The leftover core: as heavy as the Sun but the size of the Earth; it slowly cools', 'Miezul rămas: greu cât Soarele, dar cât Pământul de mare; se răcește încet', sl('white-dwarf', 0, -36)),
  it('massive-star', 'Massive star', 'Stea masivă', ['Blue giant', 'Big star', 'High-mass star', 'Blue supergiant'], ['Stea masiva', 'Gigantă albastră', 'Giganta albastra', 'Stea mare'],
    'At least 8 times heavier than the Sun: hot, blue and short-lived, a few million years', 'Cel puțin de 8 ori mai grea decât Soarele: fierbinte, albastră și cu viață scurtă, câteva milioane de ani', sl('massive-star', 0, -54)),
  it('red-supergiant', 'Red supergiant', 'Supergigantă roșie', ['Supergiant'], ['Supergiganta rosie', 'Supergigantă', 'Supergiganta'],
    'The biggest stars of all, like Betelgeuse in Orion', 'Cele mai mari stele dintre toate, ca Betelgeuse din Orion', sl('red-supergiant', 0, -76)),
  it('supernova', 'Supernova', 'Supernovă', ['Supernova explosion'], ['Supernova', 'Explozie de supernovă'],
    'The core collapses and the star explodes, briefly outshining a whole galaxy', 'Miezul se prăbușește și steaua explodează, întrecând pentru scurt timp o galaxie întreagă', sl('supernova', -46, -50)),
  it('neutron-star', 'Neutron star', 'Stea neutronică', ['Pulsar', 'Neutron'], ['Stea neutronica', 'Pulsar', 'Stea de neutroni'],
    'A city-sized ball so dense a teaspoon would weigh a billion tonnes', 'O bilă cât un oraș, atât de densă încât o linguriță ar cântări un miliard de tone', sl('neutron-star', 0, -34)),
  it('black-hole', 'Black hole', 'Gaură neagră', ['Blackhole'], ['Gaura neagra', 'Gaură neagră'],
    'The heaviest cores collapse so far that not even light can escape', 'Miezurile cele mai grele se prăbușesc atât de mult încât nici lumina nu mai poate scăpa', sl('black-hole', 0, -44)),
]
function drawStarLife({ cls }) {
  const arrow = (a, b, bend = 0) => { const [x1, y1] = a, [x2, y2] = b; const mx = (x1 + x2) / 2, my = (y1 + y2) / 2 + bend; return <path d={`M${x1} ${y1} Q${mx} ${my} ${x2} ${y2}`} className="dgq-arrow" markerEnd="url(#sl-arrow)" /> }
  return (
    <>
      <defs>
        <Arrow id="sl-arrow" />
        <radialGradient id="sl-yellow"><stop offset="0" stopColor="#fff6c9" /><stop offset="1" stopColor="#ffc93c" /></radialGradient>
        <radialGradient id="sl-red"><stop offset="0" stopColor="#ffb08a" /><stop offset="1" stopColor="#d9482b" /></radialGradient>
        <radialGradient id="sl-blue"><stop offset="0" stopColor="#ffffff" /><stop offset="1" stopColor="#6aa8ff" /></radialGradient>
        <radialGradient id="sl-neb"><stop offset="0" stopColor="rgba(255,120,190,0.8)" /><stop offset="0.6" stopColor="rgba(120,90,220,0.45)" /><stop offset="1" stopColor="rgba(60,60,160,0)" /></radialGradient>
        <radialGradient id="sl-pn"><stop offset="0.45" stopColor="rgba(80,200,220,0)" /><stop offset="0.7" stopColor="rgba(90,220,210,0.85)" /><stop offset="1" stopColor="rgba(200,90,200,0)" /></radialGradient>
        <radialGradient id="sl-sn"><stop offset="0" stopColor="#ffffff" /><stop offset="0.3" stopColor="#ffe08a" /><stop offset="1" stopColor="rgba(255,120,60,0)" /></radialGradient>
      </defs>
      <rect x="0" y="0" width="1000" height="620" fill="#0a1022" />
      <text x="400" y="56" textAnchor="middle" className="dgq-axis-text" opacity="0.6">{t('Stars like the Sun')}</text>
      <text x="400" y="602" textAnchor="middle" className="dgq-axis-text" opacity="0.6">{t('Stars over 8 Suns')}</text>
      {arrow(sl('nebula', 48), sl('protostar', -24))}
      {arrow(sl('protostar', 20, -20), sl('main-sequence', -34, 6), -30)}
      {arrow(sl('protostar', 20, 20), sl('massive-star', -40, -6), 30)}
      {arrow(sl('main-sequence', 34), sl('red-giant', -56))}
      {arrow(sl('red-giant', 56), sl('planetary-nebula', -44))}
      {arrow(sl('planetary-nebula', 44), sl('white-dwarf', -16))}
      {arrow(sl('massive-star', 42), sl('red-supergiant', -66))}
      {arrow(sl('red-supergiant', 66), sl('supernova', -46))}
      {arrow(sl('supernova', 40, -20), sl('neutron-star', -16, 6))}
      {arrow(sl('supernova', 40, 20), sl('black-hole', -28, -6))}
      <g className={`dgq-layer${cls('nebula')}`}><ellipse cx={SL.nebula[0]} cy={SL.nebula[1]} rx="62" ry="48" fill="url(#sl-neb)" /></g>
      <circle cx={SL.protostar[0]} cy={SL.protostar[1]} r="18" fill="url(#sl-red)" opacity="0.85" className={`dgq-layer${cls('protostar')}`} />
      <circle cx={SL['main-sequence'][0]} cy={SL['main-sequence'][1]} r="30" fill="url(#sl-yellow)" className={`dgq-layer${cls('main-sequence')}`} />
      <circle cx={SL['red-giant'][0]} cy={SL['red-giant'][1]} r="52" fill="url(#sl-red)" className={`dgq-layer${cls('red-giant')}`} />
      <circle cx={SL['planetary-nebula'][0]} cy={SL['planetary-nebula'][1]} r="42" fill="url(#sl-pn)" className={`dgq-layer${cls('planetary-nebula')}`} />
      <circle cx={SL['planetary-nebula'][0]} cy={SL['planetary-nebula'][1]} r="5" fill="#fff" />
      <circle cx={SL['white-dwarf'][0]} cy={SL['white-dwarf'][1]} r="12" fill="#f4f8ff" className={`dgq-layer${cls('white-dwarf')}`} />
      <circle cx={SL['massive-star'][0]} cy={SL['massive-star'][1]} r="38" fill="url(#sl-blue)" className={`dgq-layer${cls('massive-star')}`} />
      <circle cx={SL['red-supergiant'][0]} cy={SL['red-supergiant'][1]} r="64" fill="url(#sl-red)" className={`dgq-layer${cls('red-supergiant')}`} />
      <g className={`dgq-layer${cls('supernova')}`}>
        <circle cx={SL.supernova[0]} cy={SL.supernova[1]} r="44" fill="url(#sl-sn)" />
        {Array.from({ length: 12 }, (_, i) => { const a = i * 30 * Math.PI / 180; const [x, y] = SL.supernova; return <line key={i} x1={x + 20 * Math.cos(a)} y1={y + 20 * Math.sin(a)} x2={x + 52 * Math.cos(a)} y2={y + 52 * Math.sin(a)} stroke="#ffe7a3" strokeWidth="2.5" /> })}
      </g>
      <g className={`dgq-layer${cls('neutron-star')}`}>
        <circle cx={SL['neutron-star'][0]} cy={SL['neutron-star'][1]} r="9" fill="#cfe3ff" />
        <path d={`M${SL['neutron-star'][0] - 6} ${SL['neutron-star'][1] - 26} L${SL['neutron-star'][0] + 6} ${SL['neutron-star'][1] + 26}`} stroke="#8fc0ff" strokeWidth="3" />
      </g>
      <g className={`dgq-layer${cls('black-hole')}`}>
        <ellipse cx={SL['black-hole'][0]} cy={SL['black-hole'][1]} rx="40" ry="12" fill="none" stroke="#ffad5c" strokeWidth="5" />
        <circle cx={SL['black-hole'][0]} cy={SL['black-hole'][1]} r="17" fill="#000" stroke="#ffcf8a" strokeWidth="2" />
      </g>
    </>
  )
}

// ── The Moon: the side we always see ───────────────────────────────────────
const MOON = {"tranquillitatis":"M586.3 304.4L586.7 293.5L589.9 283.2L595.7 274.5L602.8 267.4L609.9 261.5L615.8 255.7L620.4 249.1L624.3 241.2L628.6 232.4L634.4 224.4L642.1 218.6L651.5 216.3L661.6 217.9L671.4 222.6L680.4 229.1L688.3 236.4L695.4 243.5L702.2 250.5L708.5 257.8L714.1 266.0L718.4 275.0L721.3 284.6L722.8 294.4L723.6 304.0L724.2 313.6L725.0 323.8L725.6 334.8L725.1 346.5L722.6 357.9L717.6 367.8L710.2 374.7L701.2 377.9L691.7 377.9L682.5 376.1L674.1 374.0L666.3 372.9L658.3 373.2L649.7 374.1L640.4 374.3L630.9 372.7L621.9 368.5L614.0 362.0L607.4 353.9L601.9 344.9L596.9 335.4L592.3 325.6L588.5 315.3L586.3 304.4Z","serenitatis":"M523.2 210.3L524.7 202.6L527.8 195.6L531.3 189.5L534.2 183.9L535.7 178.2L536.3 171.9L537.0 165.0L538.9 157.9L542.8 151.7L549.0 147.3L556.9 145.0L565.5 144.8L574.2 146.1L582.4 148.2L590.1 150.6L597.6 153.2L604.9 156.2L611.7 160.1L617.8 165.1L622.9 170.8L626.9 176.9L630.3 183.0L633.9 189.2L637.9 195.6L642.3 202.6L646.3 210.5L648.7 219.0L648.6 227.2L645.5 234.2L639.7 239.3L632.3 242.3L624.6 243.9L617.3 245.1L610.8 246.6L604.8 249.0L598.7 251.9L591.9 254.6L584.3 256.2L576.4 256.0L568.5 254.0L561.0 250.8L553.8 246.8L546.8 242.4L539.8 237.7L533.2 232.2L527.8 225.7L524.2 218.3L523.2 210.3Z","imbrium":"M332.2 233.5L332.6 219.9L335.9 206.4L340.5 194.2L344.4 183.6L346.5 173.8L347.3 163.9L348.1 153.2L351.0 141.9L357.1 130.6L366.7 120.4L378.9 112.2L392.6 106.5L406.6 102.9L420.3 100.7L433.5 99.5L446.6 99.0L459.5 99.8L471.6 102.3L482.3 106.9L491.1 113.3L498.2 120.8L504.4 128.5L511.1 136.2L519.2 144.0L528.4 152.8L537.4 163.3L544.0 175.6L546.0 188.8L542.5 201.6L533.8 212.7L521.7 221.4L508.4 228.1L495.9 233.8L484.9 239.8L474.9 246.7L465.1 254.5L454.4 262.2L442.5 268.4L429.6 272.2L416.4 273.4L403.5 272.7L390.9 270.9L378.4 268.8L365.9 266.0L353.9 261.9L343.5 255.3L335.9 245.7L332.2 233.5Z","crisium":"M720.6 234.9L721.7 228.3L724.4 223.2L727.9 219.7L731.5 217.2L735.1 215.4L738.4 214.1L741.7 213.3L745.1 213.3L748.6 214.1L752.1 215.6L755.5 217.4L758.6 219.1L761.8 220.3L765.1 221.1L768.8 222.1L773.0 224.1L777.6 228.0L782.1 234.0L786.0 241.7L788.8 250.1L790.2 258.3L790.5 265.6L790.2 271.9L789.6 277.6L789.0 282.9L788.2 288.0L787.0 292.5L785.2 296.1L782.8 298.4L780.1 299.7L777.2 300.3L774.4 301.0L771.5 302.0L768.4 303.4L764.8 304.8L760.8 305.2L756.4 303.9L752.1 300.5L748.3 295.3L745.2 289.0L742.5 282.5L739.9 276.3L736.7 270.5L732.8 264.6L728.4 258.0L724.4 250.5L721.5 242.5L720.6 234.9Z","fecunditatis":"M713.4 392.6L714.0 384.3L715.0 375.9L716.3 367.3L717.8 358.1L719.5 348.4L721.8 338.4L725.3 328.8L730.1 320.8L736.2 315.5L743.0 313.4L749.9 313.8L756.4 315.4L762.3 316.9L768.0 317.7L773.7 318.4L779.3 320.4L784.3 325.1L788.2 333.0L790.4 343.6L790.7 355.4L789.5 366.9L787.5 376.9L785.5 385.4L784.0 392.8L783.1 399.9L782.5 407.4L781.6 415.7L779.9 424.7L777.2 433.9L773.6 442.9L769.0 451.6L763.5 460.2L757.1 468.8L749.6 477.2L741.3 483.9L732.8 487.6L725.4 486.8L720.1 481.1L717.4 471.5L716.8 459.8L717.4 448.1L718.1 437.9L718.1 429.5L717.2 422.2L715.7 415.4L714.4 408.2L713.5 400.6L713.4 392.6Z","nectaris":"M651.6 441.6L651.8 437.5L652.5 433.5L653.5 429.5L654.7 425.5L656.2 421.6L658.2 418.0L660.8 414.8L664.0 412.4L667.5 410.9L670.9 410.1L674.1 409.6L677.0 408.8L679.9 407.4L683.0 405.6L686.5 403.8L690.2 402.6L693.8 402.8L697.0 404.4L699.3 407.4L700.7 411.2L701.4 415.2L701.8 419.2L702.1 422.9L702.4 426.4L702.6 429.9L702.5 433.5L701.8 437.3L700.5 440.9L698.8 444.3L696.9 447.6L694.8 450.8L692.7 454.2L690.3 457.8L687.5 461.2L684.2 464.0L680.5 465.7L676.8 465.9L673.5 464.6L670.8 462.4L668.5 459.8L666.5 457.5L664.4 455.8L661.9 454.4L659.1 453.1L656.2 451.3L653.8 448.7L652.3 445.4L651.6 441.6Z","nubium":"M349.7 455.0L351.1 446.9L354.8 439.8L360.3 434.2L366.8 430.0L373.0 426.5L378.5 422.6L383.3 417.7L388.1 411.6L393.8 404.9L401.0 399.1L409.5 395.5L418.7 395.1L427.8 398.0L435.9 403.2L442.8 409.6L448.9 416.2L454.6 422.4L460.1 428.5L465.4 434.7L470.0 441.4L473.2 448.8L474.9 456.4L475.3 464.1L475.3 471.5L475.3 479.0L475.6 486.7L475.9 494.9L475.0 503.4L472.1 511.4L466.6 517.9L458.6 522.1L449.1 523.5L439.4 522.6L430.3 520.5L422.3 518.5L414.9 517.2L407.6 516.7L399.9 516.4L391.7 515.4L383.5 512.7L375.8 508.3L369.3 502.2L363.9 495.2L359.6 487.7L355.9 479.9L352.7 471.9L350.4 463.5L349.7 455.0Z","humorum":"M286.9 481.3L287.2 477.2L288.3 473.7L289.6 470.6L290.6 467.6L291.0 464.2L291.2 460.3L291.5 455.9L292.5 451.6L294.5 448.1L297.6 446.0L301.4 445.5L305.5 446.3L309.6 447.9L313.4 449.9L317.2 451.9L320.8 453.9L324.4 456.2L327.9 458.9L330.9 462.3L333.4 466.0L335.5 469.9L337.4 473.8L339.4 477.5L341.8 481.4L344.4 485.7L346.8 490.3L348.3 495.1L348.4 499.7L346.8 503.5L343.8 506.1L340.0 507.5L336.1 508.2L332.5 508.6L329.5 509.3L326.7 510.4L324.0 511.7L320.9 512.6L317.4 512.8L313.6 512.0L309.7 510.2L305.9 507.8L302.3 504.9L298.8 501.8L295.4 498.4L292.2 494.6L289.5 490.3L287.6 485.8L286.9 481.3Z","frigoris":"M373.3 95.4L374.5 92.3L377.1 89.0L380.5 85.9L383.8 83.2L386.7 80.7L389.0 78.4L390.9 75.9L393.2 73.2L396.3 70.5L400.4 67.8L405.3 65.6L410.7 64.0L415.9 63.1L420.8 62.6L425.3 62.5L429.6 62.6L433.7 62.9L437.6 63.4L440.9 64.4L443.3 65.8L444.8 67.6L445.5 69.2L449.3 67.4L454.5 65.8L459.7 64.4L464.9 63.2L470.1 62.3L475.4 61.8L480.7 61.8L485.6 62.3L490.0 63.4L493.9 64.8L497.4 66.3L501.1 67.7L505.4 69.0L507.5 69.6L509.0 68.4L512.0 66.6L515.6 65.0L520.0 63.9L524.8 63.5L529.9 63.6L534.8 64.1L539.4 64.7L543.8 65.2L548.4 65.5L553.5 65.8L559.1 66.4L564.9 67.6L566.2 68.1L566.3 68.1L569.5 67.4L573.1 67.0L576.5 66.7L579.5 66.4L582.2 65.7L585.0 65.0L588.3 64.4L592.3 64.4L597.0 65.1L602.0 66.6L606.6 68.7L610.6 71.2L613.8 73.7L616.6 76.1L619.2 78.4L621.8 80.7L624.4 83.1L626.5 85.5L628.0 87.9L628.7 90.1L628.8 92.2L628.4 94.2L628.0 96.2L627.5 98.3L626.8 100.6L625.4 102.7L622.9 104.3L619.3 104.9L614.7 104.4L609.8 103.0L605.0 101.0L600.7 98.9L596.8 97.2L593.0 95.9L589.0 94.9L584.7 94.0L580.1 92.7L577.0 91.5L576.7 93.5L575.3 95.9L573.1 98.0L570.1 99.7L566.7 101.2L563.1 102.6L559.3 104.2L555.1 105.7L550.3 106.9L545.0 107.3L539.4 106.7L534.1 105.0L529.6 102.4L526.0 99.4L523.1 96.6L520.4 94.1L517.3 92.2L513.6 90.4L511.8 89.6L508.6 91.3L505.2 93.4L502.2 95.6L499.2 98.0L495.7 100.3L491.5 102.3L486.8 103.8L481.7 104.8L476.5 105.4L471.2 105.8L465.8 106.2L460.2 106.4L454.6 106.3L449.3 105.4L445.0 103.5L442.1 100.7L440.9 97.4L440.9 94.0L441.2 92.4L440.5 92.7L434.9 94.5L429.5 95.8L424.5 96.9L420.1 98.1L415.8 99.6L411.4 101.3L406.7 102.9L401.9 104.1L397.3 104.7L392.9 104.6L389.0 104.1L385.4 103.3L381.9 102.4L378.6 101.4L375.7 100.0L373.8 98.0L373.3 95.4Z","procellarum":"M182.9 331.4L183.4 320.9L184.5 310.5L185.9 301.1L187.3 292.8L188.6 284.8L190.1 276.4L192.2 267.1L194.9 257.1L198.2 247.0L201.8 237.9L205.4 230.6L208.8 225.1L212.0 221.2L213.8 219.5L214.9 215.8L218.7 206.2L223.7 196.0L229.6 186.1L236.0 177.2L242.2 169.6L248.2 163.0L254.0 156.7L260.2 149.8L267.4 142.0L275.6 133.8L284.5 126.3L293.0 120.7L300.0 118.0L305.1 118.3L308.2 121.1L309.9 125.3L311.1 130.2L312.3 135.2L313.6 140.4L314.4 146.2L314.1 153.0L312.5 160.7L309.4 169.0L305.7 177.5L301.9 186.0L298.5 194.7L297.7 197.3L298.9 196.5L304.7 193.5L310.4 191.9L315.8 191.9L320.7 193.3L324.9 195.5L329.0 197.6L333.3 199.3L338.5 200.4L344.3 201.6L350.4 203.8L355.6 207.6L358.9 213.2L359.7 220.3L358.1 227.9L354.7 235.3L350.7 242.1L346.9 248.3L343.6 254.2L340.7 260.2L337.8 266.3L334.4 272.3L330.1 277.7L325.2 282.2L319.8 285.8L314.3 288.9L308.8 291.7L303.1 294.5L301.4 295.2L301.4 295.8L300.1 305.3L300.4 305.4L306.3 308.1L311.8 312.0L316.5 317.4L320.2 323.8L323.3 330.7L326.2 337.4L329.5 343.9L333.6 350.6L338.2 357.9L342.4 366.4L344.9 375.7L344.9 385.2L342.1 393.8L336.8 400.8L330.2 405.8L323.6 409.4L317.6 412.5L312.5 415.8L308.0 419.8L303.4 424.1L298.4 427.8L292.7 430.0L286.6 430.4L280.3 429.0L274.3 426.2L268.4 422.8L262.7 418.8L257.1 414.2L251.9 408.4L247.6 401.2L244.9 393.5L239.9 390.1L233.6 385.6L228.0 382.8L222.5 381.4L216.9 380.2L211.4 377.5L206.4 372.4L202.4 364.5L199.7 355.1L198.8 355.7L195.7 356.4L192.9 356.5L190.3 356.2L187.9 355.3L185.8 352.8L184.1 348.1L183.1 340.8L182.9 331.4Z","vaporum":"M495.5 276.6L495.9 273.6L496.8 270.7L497.9 267.9L499.2 265.2L500.7 262.7L502.7 260.5L505.2 258.8L508.1 257.7L511.1 257.4L514.0 257.4L516.7 257.5L519.2 257.2L521.9 256.7L524.9 255.9L528.2 255.4L531.6 255.7L534.7 256.9L537.2 259.0L538.9 261.9L539.7 265.1L540.0 268.2L540.1 271.1L540.3 273.9L540.5 276.5L540.7 279.3L540.5 282.0L539.7 284.7L538.5 287.1L536.8 289.4L535.0 291.5L533.1 293.6L531.1 295.8L528.9 298.0L526.2 299.9L523.2 301.1L519.9 301.2L516.7 300.2L513.8 298.3L511.6 296.0L509.7 293.6L507.9 291.6L505.9 290.0L503.6 288.6L501.1 287.0L498.7 285.0L496.8 282.5L495.7 279.6L495.5 276.6Z","_points":{"tycho":[454,569.5],"copernicus":[391.6,296.6],"apollo11":[627.4,346.3],"kepler":[305,304.9],"plato":[467.9,99.2],"aristarchus":[284.3,221.4],"centers":{"tranquillitatis":[664.9,302.7],"serenitatis":[585,199.8],"imbrium":[427.7,176.7],"crisium":[762.6,256.4],"fecunditatis":[755.5,393.4],"nectaris":[679.3,433.9],"nubium":[414.8,466.2],"humorum":[314.2,482.2],"frigoris":[412.9,81.6],"procellarum":[240.4,305.5],"vaporum":[519.6,276.4]}}}
const MP = MOON._points, MC = MP.centers
const mare = (id, name, ro, alt, roAlt, info, roInfo, dx = 0, dy = 0) => it(id, name, ro, alt, roAlt, info, roInfo, [MC[id][0] + dx, MC[id][1] + dy])
const MOON_MAP = [
  mare('tranquillitatis', 'Sea of Tranquillity', 'Marea Liniștii', ['Mare Tranquillitatis', 'Tranquillity'], ['Marea Linistii', 'Mare Tranquillitatis'],
    'A plain of dark lava where Apollo 11 landed in 1969', 'O câmpie de lavă întunecată, unde a aselenizat Apollo 11 în 1969', -10, -10),
  mare('serenitatis', 'Sea of Serenity', 'Marea Seninătății', ['Mare Serenitatis', 'Serenity'], ['Marea Seninatatii', 'Mare Serenitatis'],
    'A round sea; Apollo 17, the last crewed landing, came down on its edge in 1972', 'O mare rotundă; Apollo 17, ultima aselenizare cu echipaj, a coborât la marginea ei în 1972'),
  mare('imbrium', 'Sea of Showers', 'Marea Ploilor', ['Mare Imbrium', 'Sea of Rains', 'Imbrium'], ['Mare Imbrium', 'Marea Ploii'],
    'The biggest impact basin on the near side, 1,100 km across', 'Cel mai mare bazin de impact de pe fața vizibilă, lat de 1.100 km'),
  mare('crisium', 'Sea of Crises', 'Marea Crizelor', ['Mare Crisium', 'Crisium'], ['Mare Crisium', 'Marea Crizei'],
    'A lonely oval sea near the eastern edge', 'O mare ovală, izolată, aproape de marginea estică'),
  mare('fecunditatis', 'Sea of Fertility', 'Marea Fertilității', ['Mare Fecunditatis', 'Fecunditatis'], ['Marea Fertilitatii', 'Mare Fecunditatis', 'Marea Fecundității'],
    'The Soviet probe Luna 16 brought rock back from here by robot in 1970', 'Sonda sovietică Luna 16 a adus de aici roci cu un robot, în 1970', 0, 10),
  mare('nectaris', 'Sea of Nectar', 'Marea Nectarului', ['Mare Nectaris', 'Nectaris'], ['Mare Nectaris'],
    'A small round sea south of Tranquillity', 'O mare mică și rotundă la sud de Marea Liniștii'),
  mare('nubium', 'Sea of Clouds', 'Marea Norilor', ['Mare Nubium', 'Nubium'], ['Mare Nubium'],
    'A wide sea in the south, crossed by a cliff called the Straight Wall', 'O mare largă în sud, traversată de o faleză numită Zidul Drept'),
  mare('humorum', 'Sea of Moisture', 'Marea Umezelii', ['Mare Humorum', 'Humorum'], ['Mare Humorum', 'Marea Umidității'],
    'A small sea in the south-west, ringed by mountains', 'O mare mică în sud-vest, înconjurată de munți'),
  mare('frigoris', 'Sea of Cold', 'Marea Frigului', ['Mare Frigoris', 'Frigoris'], ['Mare Frigoris'],
    'A long thin sea stretched across the north', 'O mare lungă și îngustă, întinsă de-a lungul nordului', 30, 4),
  mare('procellarum', 'Ocean of Storms', 'Oceanul Furtunilor', ['Oceanus Procellarum', 'Procellarum'], ['Oceanul Furtunilor', 'Oceanus Procellarum'],
    'The only "ocean": the biggest dark plain, 2,500 km long, on the western side', 'Singurul „ocean”: cea mai mare câmpie întunecată, lungă de 2.500 km, în partea de vest', 6, 30),
  it('tycho', 'Tycho', 'Tycho', ['Tycho crater'], ['Craterul Tycho'],
    'A young crater whose bright rays stretch 1,500 km; easy to see with binoculars', 'Un crater tânăr ale cărui raze luminoase se întind pe 1.500 km; ușor de văzut cu binoclul', [MP.tycho[0] + 30, MP.tycho[1] + 28], MP.tycho),
  it('copernicus', 'Copernicus', 'Copernic', ['Copernicus crater'], ['Craterul Copernic', 'Copernicus'],
    'A 93 km crater called the "Monarch of the Moon"', 'Un crater de 93 km, numit „monarhul Lunii”', [MP.copernicus[0] - 2, MP.copernicus[1] + 34], MP.copernicus),
  it('apollo11', 'Apollo 11 landing site', 'Locul aselenizării Apollo 11', ['Apollo 11', 'Tranquility Base', 'Tranquillity Base'], ['Apollo 11', 'Baza Liniștii', 'Baza Linistii'],
    '20 July 1969: Armstrong and Aldrin walk on the Moon', '20 iulie 1969: Armstrong și Aldrin pășesc pe Lună', [MP.apollo11[0] - 30, MP.apollo11[1] + 26], MP.apollo11),
]
function drawMoon({ cls }) {
  const [tx, ty] = MP.tycho
  return (
    <>
      <defs>
        <radialGradient id="mo-disc" cx="0.45" cy="0.42" r="0.6"><stop offset="0" stopColor="#d8d6cf" /><stop offset="0.8" stopColor="#b9b6ad" /><stop offset="1" stopColor="#8f8c84" /></radialGradient>
        <clipPath id="mo-clip"><circle cx="500" cy="350" r="320" /></clipPath>
      </defs>
      <rect x="0" y="0" width="1000" height="700" fill="#070b16" />
      <circle cx="500" cy="350" r="320" fill="url(#mo-disc)" />
      <g clipPath="url(#mo-clip)">
        {Object.entries(MOON).filter(([k]) => !k.startsWith('_')).map(([id, d]) => <path key={id} d={d} fill={id === 'vaporum' ? '#7a786f' : '#6f6d66'} className={id === 'vaporum' ? '' : `dgq-layer${cls(id)}`} />)}
        {Array.from({ length: 14 }, (_, i) => { const a = i * 25.7 * Math.PI / 180, L = 120 + (i % 4) * 50; return <line key={i} x1={tx} y1={ty} x2={tx + L * Math.cos(a)} y2={ty + L * Math.sin(a)} stroke="rgba(255,255,255,0.32)" strokeWidth="3" /> })}
        {[[600, 520, 14], [540, 620, 18], [700, 560, 11], [360, 600, 12], [640, 470, 9], [480, 520, 10], [300, 170, 10], [770, 470, 12], [560, 130, 9]].map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} fill="none" stroke="rgba(90,88,80,0.6)" strokeWidth="2.5" />)}
      </g>
      <circle cx={tx} cy={ty} r="9" fill="#f2f0ea" stroke="#77756e" strokeWidth="2" className={`dgq-layer${cls('tycho')}`} />
      <circle cx={MP.copernicus[0]} cy={MP.copernicus[1]} r="11" fill="#cfccc3" stroke="#77756e" strokeWidth="2.5" className={`dgq-layer${cls('copernicus')}`} />
      <circle cx={MP.apollo11[0]} cy={MP.apollo11[1]} r="6" className={`dgq-dot${cls('apollo11')}`} />
    </>
  )
}

// ── Mars ────────────────────────────────────────────────────────────────────
const MX = (lon) => 500 + lon * 1000 / 360, MY = (lat) => 20 + (90 - lat) * 500 / 180
const mxy = (lon, lat) => [+MX(lon).toFixed(1), +MY(lat).toFixed(1)]
const MARS = [
  it('olympus', 'Olympus Mons', 'Olympus Mons', ['Mount Olympus', 'Olympus'], ['Muntele Olimp', 'Olimp', 'Olympus'],
    'The tallest volcano in the Solar System: 22 km high and as wide as Italy', 'Cel mai înalt vulcan din Sistemul Solar: 22 km înălțime și lat cât Italia', mxy(-134, 32), mxy(-134, 18.6)),
  it('tharsis', 'Tharsis volcanoes', 'Vulcanii Tharsis', ['Tharsis', 'Tharsis Montes', 'Tharsis Bulge'], ['Tharsis', 'Munții Tharsis', 'Muntii Tharsis'],
    'Three giant volcanoes in a row on a huge bulge of the crust', 'Trei vulcani uriași în linie, pe o umflătură imensă a scoarței', mxy(-96, 6), mxy(-112, 1.5)),
  it('valles', 'Valles Marineris', 'Valles Marineris', ['Mariner Valley', 'Mariner Valleys'], ['Valea Mariner', 'Văile Mariner'],
    'A canyon 4,000 km long and up to 7 km deep: the Grand Canyon would fit in a side branch', 'Un canion lung de 4.000 km și adânc de până la 7 km: Marele Canion ar încăpea într-o ramificație', mxy(-60, -24), mxy(-60, -12)),
  it('hellas', 'Hellas Basin', 'Bazinul Hellas', ['Hellas Planitia', 'Hellas'], ['Hellas', 'Hellas Planitia', 'Câmpia Hellas'],
    'An impact crater 2,300 km across and 7 km deep, the lowest place on Mars', 'Un crater de impact lat de 2.300 km și adânc de 7 km, cel mai jos loc de pe Marte', mxy(70, -42.4)),
  it('argyre', 'Argyre Basin', 'Bazinul Argyre', ['Argyre Planitia', 'Argyre'], ['Argyre', 'Argyre Planitia'],
    'Another great impact basin in the southern highlands', 'Un alt mare bazin de impact, în podișurile sudice', mxy(-43, -49.7)),
  it('utopia', 'Utopia Planitia', 'Utopia Planitia', ['Utopia', 'Utopia Plain'], ['Utopia', 'Câmpia Utopia', 'Campia Utopia'],
    'The largest plain in the north; China\'s Zhurong rover landed here in 2021', 'Cea mai mare câmpie din nord; roverul chinez Zhurong a aterizat aici în 2021', mxy(118, 46.7)),
  it('syrtis', 'Syrtis Major', 'Syrtis Major', ['Syrtis Major Planum', 'Syrtis'], ['Syrtis'],
    'The darkest spot on Mars, the first feature seen through a telescope, in 1659', 'Cea mai întunecată pată de pe Marte, prima formă de relief văzută prin telescop, în 1659', mxy(70, 12)),
  it('elysium', 'Elysium Mons', 'Elysium Mons', ['Elysium'], ['Elysium', 'Muntele Elysium'],
    'The second great volcanic region, on the other side of the planet from Tharsis', 'A doua mare regiune vulcanică, pe partea cealaltă a planetei față de Tharsis', mxy(147, 36), mxy(146.9, 24.8)),
  it('north-cap', 'North polar ice cap', 'Calota polară nordică', ['North pole', 'North polar cap', 'Polar ice cap', 'Planum Boreum'], ['Calota nordică', 'Polul Nord', 'Calota polara nordica', 'Calota glaciară nordică'],
    'Water ice up to 3 km thick, with a thin frost of frozen carbon dioxide in winter', 'Gheață de apă groasă de până la 3 km, acoperită iarna de o brumă de dioxid de carbon înghețat', mxy(40, 82)),
  it('south-cap', 'South polar ice cap', 'Calota polară sudică', ['South pole', 'South polar cap', 'Planum Australe'], ['Calota sudică', 'Polul Sud', 'Calota polara sudica'],
    'Mostly frozen carbon dioxide on top of water ice', 'Mai ales dioxid de carbon înghețat, peste un strat de gheață de apă', mxy(-60, -84)),
  it('curiosity', 'Gale Crater (Curiosity)', 'Craterul Gale (Curiosity)', ['Curiosity', 'Gale', 'Gale crater', 'Mount Sharp'], ['Curiosity', 'Gale', 'Craterul Gale', 'Muntele Sharp'],
    'NASA\'s Curiosity rover has been climbing the mountain in the middle of this crater since 2012', 'Roverul Curiosity al NASA urcă din 2012 muntele din mijlocul acestui crater', mxy(137.4, -18), mxy(137.4, -5.4)),
  it('perseverance', 'Jezero Crater (Perseverance)', 'Craterul Jezero (Perseverance)', ['Perseverance', 'Jezero', 'Jezero crater', 'Ingenuity'], ['Perseverance', 'Jezero', 'Craterul Jezero', 'Ingenuity'],
    'An old lake with a river delta, where Perseverance and the Ingenuity helicopter landed in 2021', 'Un lac străvechi cu o deltă, unde au aterizat în 2021 Perseverance și elicopterul Ingenuity', mxy(52, 30), mxy(77.5, 18.4)),
]
function drawMars({ cls }) {
  const blob = (lon, lat, w, h) => { const [x, y] = mxy(lon, lat); return `M${x - w} ${y} C${x - w} ${y - h} ${x + w * 0.4} ${y - h * 1.1} ${x + w} ${y - h * 0.2} C${x + w * 1.1} ${y + h * 0.6} ${x - w * 0.2} ${y + h} ${x - w} ${y} Z` }
  const [ox, oy] = mxy(-134, 18.6)
  return (
    <>
      <defs>
        <linearGradient id="ma-bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#b8643a" /><stop offset="0.5" stopColor="#c97a48" /><stop offset="1" stopColor="#b5683f" /></linearGradient>
        <radialGradient id="ma-pit"><stop offset="0" stopColor="#a8784f" /><stop offset="1" stopColor="#c48a5a" /></radialGradient>
      </defs>
      <rect x="0" y="20" width="1000" height="500" fill="url(#ma-bg)" />
      {/* the lower, smoother north */}
      <path d={`M0 20 H1000 V${MY(40)} C800 ${MY(30)} 640 ${MY(45)} 480 ${MY(35)} C320 ${MY(25)} 160 ${MY(42)} 0 ${MY(32)} Z`} fill="rgba(120,60,40,0.18)" />
      {[[-20, 45, 60, 18], [-60, 40, 50, 14], [20, -20, 70, 16], [-10, -15, 40, 12], [110, -25, 60, 14], [160, -30, 50, 12], [-160, -20, 60, 14]].map(([lo, la, w, h], i) => <path key={i} d={blob(lo, la, w, h)} fill="rgba(80,40,30,0.3)" />)}
      {Array.from({ length: 50 }, (_, i) => { const a = Math.sin(i * 12.98) * 43758.5, b = Math.sin(i * 78.23) * 43758.5; const lo = (a - Math.floor(a)) * 360 - 180, la = -(b - Math.floor(b)) * 55 - 5; const [x, y] = mxy(lo, la); return <circle key={i} cx={x} cy={y} r={2 + (i % 4)} fill="none" stroke="rgba(90,45,30,0.35)" strokeWidth="1.5" /> })}
      <path d={`M0 20 H1000 V${MY(80)} C800 ${MY(76)} 600 ${MY(82)} 400 ${MY(78)} C250 ${MY(75)} 120 ${MY(80)} 0 ${MY(78)} Z`} fill="#f4f1ec" className={`dgq-layer${cls('north-cap')}`} />
      <path d={`M0 520 H1000 V${MY(-83)} C820 ${MY(-86)} 600 ${MY(-81)} 380 ${MY(-84)} C220 ${MY(-86)} 100 ${MY(-82)} 0 ${MY(-84)} Z`} fill="#f4f1ec" className={`dgq-layer${cls('south-cap')}`} />
      <path d={blob(70, 9, 26, 40)} fill="#6e3b28" className={`dgq-layer${cls('syrtis')}`} />
      <path d={blob(118, 46.7, 70, 22)} fill="rgba(150,80,50,0.55)" className={`dgq-layer${cls('utopia')}`} />
      <ellipse cx={MX(70)} cy={MY(-42.4)} rx="62" ry="44" fill="url(#ma-pit)" className={`dgq-layer${cls('hellas')}`} />
      <ellipse cx={MX(-43)} cy={MY(-49.7)} rx="42" ry="30" fill="url(#ma-pit)" className={`dgq-layer${cls('argyre')}`} />
      <path d={`M${MX(-95)} ${MY(-7)} C${MX(-85)} ${MY(-12)} ${MX(-75)} ${MY(-8)} ${MX(-65)} ${MY(-12)} C${MX(-57)} ${MY(-15)} ${MX(-50)} ${MY(-10)} ${MX(-42)} ${MY(-14)}`} fill="none" stroke="#5a2d1f" strokeWidth="7" strokeLinecap="round" className={`dgq-river${cls('valles')}`} />
      <g className={`dgq-layer${cls('tharsis')}`} fill="#a65530">
        {[[-120.5, -8.3], [-113, 1.5], [-104.4, 11.9]].map(([lo, la], i) => { const [x, y] = mxy(lo, la); return <g key={i}><circle cx={x} cy={y} r="11" /><circle cx={x} cy={y} r="3.5" fill="#5a2d1f" /></g> })}
      </g>
      <g className={`dgq-layer${cls('olympus')}`}><circle cx={ox} cy={oy} r="24" fill="#b45b33" /><circle cx={ox} cy={oy} r="7" fill="#5a2d1f" /></g>
      <g className={`dgq-layer${cls('elysium')}`}>{(() => { const [x, y] = mxy(146.9, 24.8); return <><circle cx={x} cy={y} r="13" fill="#a65530" /><circle cx={x} cy={y} r="4" fill="#5a2d1f" /></> })()}</g>
      <circle cx={MX(137.4)} cy={MY(-5.4)} r="7" className={`dgq-dot${cls('curiosity')}`} />
      <circle cx={MX(77.5)} cy={MY(18.4)} r="7" className={`dgq-dot${cls('perseverance')}`} />
      {[-180, -90, 0, 90, 180].map(lo => <text key={lo} x={Math.min(996, Math.max(4, MX(lo)))} y="14" textAnchor={lo === -180 ? 'start' : lo === 180 ? 'end' : 'middle'} className="dgq-axis-text" opacity="0.45" fontSize="12">{lo}°</text>)}
      <line x1="0" y1={MY(0)} x2="1000" y2={MY(0)} stroke="rgba(255,255,255,0.2)" strokeDasharray="4 6" />
    </>
  )
}

export const MORE_DIAGRAMS = {
  'river-coast': {
    id: 'river-coast', icon: '🏞️',
    title: t('Rivers and Coasts'),
    prompt: t('Name the parts of the river and the coast'),
    placeholder: t('Type a part of the river or coast…'),
    viewBox: [0, 0, 1000, 700],
    items: RIVER_COAST,
    draw: drawRiverCoast,
  },
  'atmosphere': {
    id: 'atmosphere', icon: '🛰️',
    title: t('What\'s Up There? The Atmosphere'),
    prompt: t('Name what you find at each height, from Everest to the GPS satellites'),
    placeholder: t('Type a thing in the sky…'),
    note: t('Not to scale: each layer is squeezed differently, or the GPS satellites would be 50 times higher than the ISS.'),
    viewBox: [0, 0, 1000, 700],
    items: AIR,
    draw: drawAtmosphere,
  },
  'volcano-types': {
    id: 'volcano-types', icon: '🌋',
    title: t('Kinds of Volcanoes'),
    prompt: t('Name each kind of volcano'),
    placeholder: t('Type a kind of volcano…'),
    viewBox: [0, 0, 1000, 640],
    items: VOLCANO_TYPES,
    draw: drawVolcanoTypes,
  },
  'milky-way': {
    id: 'milky-way', icon: '🌀',
    title: t('Our Galaxy, the Milky Way'),
    prompt: t('Name the parts of the Milky Way and find the Sun'),
    placeholder: t('Type a part of the galaxy…'),
    viewBox: [0, 0, 1000, 660],
    items: MILKY_WAY,
    draw: drawMilkyWay,
  },
  'star-life': {
    id: 'star-life', icon: '⭐',
    title: t('The Life of a Star'),
    prompt: t('Name each stage in the life of a star'),
    placeholder: t('Type a stage…'),
    viewBox: [0, 0, 1000, 620],
    items: STAR_LIFE,
    draw: drawStarLife,
  },
  'moon-map': {
    id: 'moon-map', icon: '🌕',
    title: t('Map of the Moon'),
    prompt: t('Name the seas, craters and the Apollo 11 site on the near side of the Moon'),
    placeholder: t('Type a sea or a crater…'),
    note: t('The "seas" are plains of dark lava, not water. North is up, as seen with the naked eye from the northern hemisphere.'),
    viewBox: [0, 0, 1000, 700],
    items: MOON_MAP,
    draw: drawMoon,
  },
  'mars-map': {
    id: 'mars-map', icon: '🔴',
    title: t('Map of Mars'),
    prompt: t('Name the volcanoes, canyons, basins and rover sites of Mars'),
    placeholder: t('Type a place on Mars…'),
    note: t('The whole planet unrolled, like a world map; north is up.'),
    viewBox: [0, 0, 1000, 530],
    items: MARS,
    draw: drawMars,
  },
}
