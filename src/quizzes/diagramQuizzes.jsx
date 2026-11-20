/**
 * Diagram quizzes: a drawing with numbered parts (DiagramQuiz.jsx plays them).
 *
 * items: [{ id, name, ro, alt?, roAlt?, info, roInfo, badge: [x, y], leader?: [x, y] }]
 *   badge  – where the numbered badge sits (drawing units)
 *   leader – optional point the badge points at (for thin layers and lines)
 * draw({ cls, shown, name }) → SVG children
 *   cls(id)   – ' ok' / ' hit' / ' missed' / ' focus' state classes for that part
 *   shown(id) – the part was found (or the game is over), so its name can be shown
 */
import { t } from '../i18n'
import { EARTH_DIAGRAMS } from './diagramsEarth'
import { SPACE_DIAGRAMS } from './diagramsSpace'

// ── Layers of the Earth ─────────────────────────────────────────────────────
// A half globe cut open, centre on the bottom edge. Not to scale: the crust and the
// atmosphere are drawn far thicker than they really are, or they'd be thinner than a line.
const CX = 500, CY = 600
const rad = (deg) => deg * Math.PI / 180
const pt = (r, deg) => [+(CX + r * Math.cos(rad(deg))).toFixed(1), +(CY - r * Math.sin(rad(deg))).toFixed(1)]
/** Ring between radii r0 < r1, from angle a0 to a1 (degrees, 0 = right, 90 = up). */
function ring(r0, r1, a0 = 0, a1 = 180) {
  const big = a1 - a0 > 180 ? 1 : 0
  const [x0, y0] = pt(r1, a0), [x1, y1] = pt(r1, a1), [x2, y2] = pt(r0, a1), [x3, y3] = pt(r0, a0)
  if (r0 <= 0) return `M${CX} ${CY} L${x0} ${y0} A${r1} ${r1} 0 ${big} 0 ${x1} ${y1} Z`
  return `M${x0} ${y0} A${r1} ${r1} 0 ${big} 0 ${x1} ${y1} L${x2} ${y2} A${r0} ${r0} 0 ${big} 1 ${x3} ${y3} Z`
}
const arc = (r, a0 = 0, a1 = 180) => { const [x0, y0] = pt(r, a0), [x1, y1] = pt(r, a1); return `M${x0} ${y0} A${r} ${r} 0 0 0 ${x1} ${y1}` }

const EARTH_LAYERS = [
  { id: 'inner-core', name: 'Inner core', ro: 'Nucleul intern', alt: ['Inner Core'], roAlt: ['Nucleu intern', 'Miezul intern', 'Nucleul interior', 'Nucleu interior'],
    info: 'Solid iron and nickel · 5,150–6,371 km deep · about 5,400 °C, as hot as the Sun\'s surface',
    roInfo: 'Fier și nichel solid · 5.150–6.371 km adâncime · circa 5.400 °C, cât suprafața Soarelui',
    badge: pt(40, 150) },
  { id: 'outer-core', name: 'Outer core', ro: 'Nucleul extern', roAlt: ['Nucleu extern', 'Miezul extern', 'Nucleul exterior', 'Nucleu exterior'],
    info: 'Liquid iron and nickel · 2,900–5,150 km · its currents make Earth\'s magnetic field',
    roInfo: 'Fier și nichel lichid · 2.900–5.150 km · curenții lui creează câmpul magnetic al Pământului',
    badge: pt(120, 120) },
  { id: 'gutenberg', name: 'Gutenberg discontinuity', ro: 'Discontinuitatea Gutenberg', alt: ['Gutenberg'], roAlt: ['Gutenberg', 'Discontinuitatea Wiechert-Gutenberg'],
    info: 'Boundary between the mantle and the outer core, about 2,900 km deep',
    roInfo: 'Limita dintre manta și nucleul extern, la circa 2.900 km adâncime',
    badge: pt(160, 160) },
  { id: 'lower-mantle', name: 'Lower mantle', ro: 'Mantaua inferioară', roAlt: ['Manta inferioară', 'Mantaua de jos'],
    info: 'Hot solid rock under huge pressure · 660–2,900 km · the largest layer by volume',
    roInfo: 'Rocă fierbinte și solidă, sub presiune uriașă · 660–2.900 km · cel mai mare strat ca volum',
    badge: pt(205, 135) },
  { id: 'upper-mantle', name: 'Upper mantle', ro: 'Mantaua superioară', roAlt: ['Manta superioară', 'Mantaua de sus'],
    info: 'Rock rich in olivine · from the crust down to 660 km',
    roInfo: 'Rocă bogată în olivină · de sub crustă până la 660 km',
    badge: pt(259, 150) },
  { id: 'asthenosphere', name: 'Asthenosphere', ro: 'Astenosfera', roAlt: ['Astenosferă'],
    info: 'Soft, slowly flowing part of the upper mantle (about 100–350 km); the plates slide on it',
    roInfo: 'Partea moale, care curge încet, a mantalei superioare (circa 100–350 km); plăcile alunecă pe ea',
    badge: pt(279, 125) },
  { id: 'moho', name: 'Moho discontinuity', ro: 'Discontinuitatea Moho', alt: ['Moho', 'Mohorovičić discontinuity'], roAlt: ['Moho', 'Mohorovičić', 'Discontinuitatea Mohorovičić'],
    info: 'Boundary between the crust and the mantle · 5–10 km under the oceans, 30–70 km under the continents',
    roInfo: 'Limita dintre crustă și manta · 5–10 km sub oceane, 30–70 km sub continente',
    badge: pt(300, 105) },
  { id: 'oceanic-crust', name: 'Oceanic crust', ro: 'Crusta oceanică', roAlt: ['Crustă oceanică', 'Scoarța oceanică', 'Scoarță oceanică'],
    info: 'Thin (5–10 km), dense basalt under the oceans; never older than about 200 million years',
    roInfo: 'Subțire (5–10 km) și densă, din bazalt, sub oceane; nu e mai veche de circa 200 de milioane de ani',
    badge: [118, 566], leader: pt(303.5, 160) },
  { id: 'continental-crust', name: 'Continental crust', ro: 'Crusta continentală', roAlt: ['Crustă continentală', 'Scoarța continentală', 'Scoarță continentală'],
    info: 'Thicker (30–70 km), lighter granite-like rock; parts are 4 billion years old',
    roInfo: 'Mai groasă (30–70 km) și mai ușoară, rocă de tip granit; unele părți au 4 miliarde de ani',
    badge: pt(309, 78) },
  { id: 'troposphere', name: 'Troposphere', ro: 'Troposfera', roAlt: ['Troposferă'],
    info: '0–12 km · where weather and almost all clouds happen; colder the higher you go',
    roInfo: '0–12 km · aici se petrece vremea și apar aproape toți norii; temperatura scade cu altitudinea',
    badge: pt(333, 25) },
  { id: 'stratosphere', name: 'Stratosphere', ro: 'Stratosfera', roAlt: ['Stratosferă'],
    info: '12–50 km · calm air where airliners cruise near the bottom; warms with height',
    roInfo: '12–50 km · aer calm; avioanele de linie zboară la baza ei; temperatura crește cu altitudinea',
    badge: pt(388, 15) },
  { id: 'ozone', name: 'Ozone layer', ro: 'Stratul de ozon', alt: ['Ozone', 'Ozonosphere'], roAlt: ['Ozon', 'Ozonosfera', 'Ozonosferă'],
    info: 'Inside the stratosphere, about 15–35 km · absorbs most of the Sun\'s UV rays',
    roInfo: 'În stratosferă, la circa 15–35 km · absoarbe cea mai mare parte a razelor UV ale Soarelui',
    badge: pt(369, 45) },
  { id: 'mesosphere', name: 'Mesosphere', ro: 'Mezosfera', roAlt: ['Mezosferă'],
    info: '50–85 km · the coldest layer (down to −90 °C); meteors burn up here',
    roInfo: '50–85 km · cel mai rece strat (până la −90 °C); aici ard meteoriții',
    badge: pt(420, 30) },
  { id: 'karman', name: 'Kármán line', ro: 'Linia Kármán', alt: ['Karman line', 'Karman'], roAlt: ['Karman', 'Linia Karman'],
    info: '100 km up · the usual border between the atmosphere and outer space',
    roInfo: 'La 100 km altitudine · granița convențională dintre atmosferă și spațiul cosmic',
    badge: pt(450, 60) },
  { id: 'thermosphere', name: 'Thermosphere', ro: 'Termosfera', roAlt: ['Termosferă'],
    info: '85–600 km · thin air heated to over 1,500 °C; auroras and the International Space Station',
    roInfo: '85–600 km · aer rarefiat încălzit la peste 1.500 °C; aurorele și Stația Spațială Internațională',
    badge: pt(475, 20) },
  { id: 'exosphere', name: 'Exosphere', ro: 'Exosfera', roAlt: ['Exosferă'],
    info: 'From about 600 km to 10,000 km · the last traces of air fade into space; many satellites orbit here',
    roInfo: 'De la circa 600 km până la 10.000 km · ultimele urme de aer se pierd în spațiu; aici orbitează mulți sateliți',
    badge: pt(545, 40) },
]

function drawEarth({ cls }) {
  const L = (id, d, fill) => <path d={d} fill={fill} className={`dgq-layer${cls(id)}`} />
  return (
    <>
      <defs>
        <radialGradient id="dgq-core" cx={CX} cy={CY} r="160" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FFF4B8" /><stop offset="0.5" stopColor="#FFD54F" /><stop offset="1" stopColor="#FFA43A" />
        </radialGradient>
        <radialGradient id="dgq-mantle" cx={CX} cy={CY} r="300" gradientUnits="userSpaceOnUse">
          <stop offset="0.53" stopColor="#E8552E" /><stop offset="1" stopColor="#B8402A" />
        </radialGradient>
      </defs>
      {/* atmosphere, outside in */}
      {L('exosphere', ring(505, 580), 'rgba(120,170,255,0.07)')}
      {L('thermosphere', ring(440, 505), 'rgba(120,170,255,0.14)')}
      {L('mesosphere', ring(400, 440), 'rgba(120,180,255,0.22)')}
      {L('stratosphere', ring(348, 400), 'rgba(110,185,255,0.32)')}
      {L('ozone', ring(362, 376), 'rgba(110,220,200,0.5)')}
      {L('troposphere', ring(318, 348), 'rgba(130,200,255,0.5)')}
      <path d={arc(450)} className={`dgq-line dgq-karman${cls('karman')}`} />
      {/* crust: ocean on the left, a continent on the right */}
      <path d={ring(307, 318, 90, 180)} fill="#2F7FD8" className="dgq-ocean" />
      {L('oceanic-crust', ring(300, 307, 90, 180), '#4E4038')}
      {L('continental-crust', ring(300, 318, 0, 90), '#A3784F')}
      {/* inside */}
      {L('upper-mantle', ring(250, 300), '#D9602F')}
      {L('asthenosphere', ring(268, 290), '#F08A4B')}
      {L('lower-mantle', ring(160, 250), 'url(#dgq-mantle)')}
      {L('outer-core', ring(80, 160), 'url(#dgq-core)')}
      {L('inner-core', ring(0, 80), '#FFF1A8')}
      <path d={arc(300)} className={`dgq-line${cls('moho')}`} />
      <path d={arc(160)} className={`dgq-line${cls('gutenberg')}`} />
      <line x1={CX - 590} y1={CY} x2={CX + 590} y2={CY} className="dgq-base" />
    </>
  )
}

// ── The rock cycle ──────────────────────────────────────────────────────────
const NODES = {
  sediments: [500, 80, '#E9C46A'],
  sedimentary: [850, 262, '#C99A5B'],
  metamorphic: [720, 530, '#8E7CC3'],
  magma: [280, 530, '#E8613C'],
  igneous: [150, 262, '#6B5B53'],
}
const NODE_W = 210, NODE_H = 72
const nodeBadge = (id) => { const [x, y] = NODES[id]; return [x - NODE_W / 2, y - NODE_H / 2] }
const ARROWS = {
  weathering: { d: 'M190 224 Q215 95 392 82', label: [253, 162, 'middle'] },
  compaction: { d: 'M608 82 Q790 95 820 224', label: [752, 162, 'middle'] },
  'heat-pressure': { d: 'M850 300 Q860 450 800 492', label: [818, 428, 'end'] },
  melting: { d: 'M612 552 Q500 612 388 552', label: [500, 548, 'middle'] },
  cooling: { d: 'M200 492 Q140 450 150 300', label: [182, 428, 'start'] },
}
const mid = (d) => { const n = d.match(/-?\d+(\.\d+)?/g).map(Number); return [0.25 * n[0] + 0.5 * n[2] + 0.25 * n[4], 0.25 * n[1] + 0.5 * n[3] + 0.25 * n[5]] }

const ROCK_CYCLE = [
  { id: 'magma', name: 'Magma', ro: 'Magmă', alt: ['Lava'], roAlt: ['Magma', 'Lavă', 'Lava'],
    info: 'Molten rock under the surface; called lava once it erupts',
    roInfo: 'Rocă topită sub suprafață; se numește lavă când erupe', badge: nodeBadge('magma') },
  { id: 'igneous', name: 'Igneous rock', ro: 'Rocă magmatică', alt: ['Igneous', 'Igneous rocks'], roAlt: ['Roci magmatice', 'Magmatică', 'Magmatica', 'Rocă eruptivă', 'Roci eruptive', 'Eruptivă'],
    info: 'Forms when magma or lava cools: granite, basalt, obsidian',
    roInfo: 'Se formează când magma sau lava se răcește: granit, bazalt, obsidian', badge: nodeBadge('igneous') },
  { id: 'sediments', name: 'Sediments', ro: 'Sedimente', alt: ['Sediment'], roAlt: ['Sediment'],
    info: 'Loose bits of rock, sand, mud and shells carried by water, wind and ice',
    roInfo: 'Bucăți de rocă, nisip, mâl și cochilii purtate de apă, vânt și gheață', badge: nodeBadge('sediments') },
  { id: 'sedimentary', name: 'Sedimentary rock', ro: 'Rocă sedimentară', alt: ['Sedimentary', 'Sedimentary rocks'], roAlt: ['Roci sedimentare', 'Sedimentară', 'Sedimentara'],
    info: 'Layers of sediment pressed into rock: sandstone, limestone, shale; where fossils are found',
    roInfo: 'Straturi de sedimente presate în rocă: gresie, calcar, argilit; aici se găsesc fosilele', badge: nodeBadge('sedimentary') },
  { id: 'metamorphic', name: 'Metamorphic rock', ro: 'Rocă metamorfică', alt: ['Metamorphic', 'Metamorphic rocks'], roAlt: ['Roci metamorfice', 'Metamorfică', 'Metamorfica'],
    info: 'Rock changed by heat and pressure without melting: marble, slate, gneiss',
    roInfo: 'Rocă transformată de căldură și presiune fără să se topească: marmură, ardezie, gnais', badge: nodeBadge('metamorphic') },
  { id: 'weathering', name: 'Weathering and erosion', ro: 'Alterare și eroziune', alt: ['Weathering', 'Erosion', 'Erosion and weathering', 'Weathering & erosion'], roAlt: ['Eroziune', 'Alterare', 'Dezagregare', 'Eroziune și alterare', 'Dezagregare și eroziune'],
    info: 'Rain, frost, wind and rivers break rock down and carry the pieces away',
    roInfo: 'Ploaia, înghețul, vântul și râurile sfărâmă roca și duc bucățile departe', badge: mid(ARROWS.weathering.d) },
  { id: 'compaction', name: 'Compaction and cementation', ro: 'Compactare și cimentare', alt: ['Compaction', 'Cementation', 'Lithification', 'Compaction & cementation'], roAlt: ['Compactare', 'Cimentare', 'Litificare', 'Diageneză', 'Diageneza', 'Compactare si cimentare'],
    info: 'Buried layers are squeezed and glued together by minerals into solid rock',
    roInfo: 'Straturile îngropate sunt presate și lipite de minerale până devin rocă solidă', badge: mid(ARROWS.compaction.d) },
  { id: 'heat-pressure', name: 'Heat and pressure', ro: 'Căldură și presiune', alt: ['Metamorphism', 'Heat & pressure', 'Pressure and heat'], roAlt: ['Metamorfism', 'Temperatură și presiune', 'Presiune și căldură', 'Presiune și temperatură', 'Caldura si presiune'],
    info: 'Deep underground or where plates collide, rock is cooked and squeezed into new minerals',
    roInfo: 'Adânc sub pământ sau unde se ciocnesc plăcile, roca e încălzită și presată în minerale noi', badge: mid(ARROWS['heat-pressure'].d) },
  { id: 'melting', name: 'Melting', ro: 'Topire', alt: ['Melt'], roAlt: ['Topirea', 'Fuziune'],
    info: 'Deep enough, rock melts back into magma, often where one plate sinks under another',
    roInfo: 'Destul de adânc, roca se topește din nou în magmă, adesea unde o placă se scufundă sub alta', badge: mid(ARROWS.melting.d) },
  { id: 'cooling', name: 'Cooling and crystallisation', ro: 'Răcire și cristalizare', alt: ['Cooling', 'Crystallization', 'Crystallisation', 'Cooling and crystallization', 'Solidification'], roAlt: ['Răcire', 'Cristalizare', 'Solidificare', 'Racire si cristalizare', 'Răcire și solidificare'],
    info: 'Slow cooling underground gives big crystals (granite); fast cooling at the surface gives tiny ones (basalt)',
    roInfo: 'Răcirea lentă în adânc dă cristale mari (granit); cea rapidă, la suprafață, cristale mici (bazalt)', badge: mid(ARROWS.cooling.d) },
]

function drawRockCycle({ cls, shown, name }) {
  return (
    <>
      <defs>
        <marker id="dgq-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 z" className="dgq-arrowhead" />
        </marker>
      </defs>
      {Object.entries(ARROWS).map(([id, a]) => (
        <g key={id}>
          <path d={a.d} className={`dgq-arrow${cls(id)}`} markerEnd="url(#dgq-arrow)" />
          {shown(id) && <text x={a.label[0]} y={a.label[1]} textAnchor={a.label[2]} className={`dgq-label${cls(id)}`}>{name(id)}</text>}
        </g>
      ))}
      {Object.entries(NODES).map(([id, [x, y, color]]) => (
        <g key={id} className={`dgq-node${cls(id)}`}>
          <rect x={x - NODE_W / 2} y={y - NODE_H / 2} width={NODE_W} height={NODE_H} rx="18" fill={color} />
          <text x={x} y={y + 8} textAnchor="middle" className="dgq-node-text">{shown(id) ? name(id) : '?'}</text>
        </g>
      ))}
    </>
  )
}

export const DIAGRAM_QUIZZES = {
  'earth-layers': {
    id: 'earth-layers', icon: '🌍',
    title: t('Layers of the Earth'),
    prompt: t('Name the layers of the Earth and its atmosphere'),
    placeholder: t('Type a layer…'),
    note: t('Not to scale: the crust and the atmosphere are drawn much thicker than they really are.'),
    viewBox: [-100, 0, 1200, 615],
    items: EARTH_LAYERS,
    draw: drawEarth,
  },
  'rock-cycle': {
    id: 'rock-cycle', icon: '🔄',
    title: t('The Rock Cycle'),
    prompt: t('Name the rocks and the processes of the rock cycle'),
    placeholder: t('Type a rock or a process…'),
    viewBox: [0, 0, 1000, 620],
    items: ROCK_CYCLE,
    draw: drawRockCycle,
  },
  ...EARTH_DIAGRAMS,
  ...SPACE_DIAGRAMS,
}
export const DIAGRAM_IDS = new Set(Object.keys(DIAGRAM_QUIZZES))
