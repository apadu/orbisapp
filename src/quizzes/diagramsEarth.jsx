/**
 * More Earth-science drawings for DiagramQuiz (see diagramQuizzes.jsx for the item format):
 * a volcano, the water cycle, plate boundaries, climate zones, the Earth's orbit, landforms.
 */
import { t } from '../i18n'

const Arrow = ({ id = 'dgq-arrow' }) => (
  <marker id={id} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
    <path d="M0 0 L10 5 L0 10 z" className="dgq-arrowhead" />
  </marker>
)

// ── Anatomy of a volcano ────────────────────────────────────────────────────
const VOLCANO = [
  { id: 'magma-chamber', name: 'Magma chamber', ro: 'Camera magmatică', alt: ['Magma reservoir'], roAlt: ['Cameră magmatică', 'Rezervor de magmă', 'Vatra magmatică', 'Camera de magmă'],
    info: 'A pool of molten rock a few kilometres underground that feeds the eruptions',
    roInfo: 'Un rezervor de rocă topită aflat la câțiva kilometri sub pământ, care alimentează erupțiile', badge: [500, 640] },
  { id: 'main-vent', name: 'Main vent', ro: 'Coșul principal', alt: ['Vent', 'Conduit', 'Main conduit', 'Pipe'], roAlt: ['Coș', 'Coșul vulcanic', 'Coșul', 'Horn', 'Canal', 'Canalul principal'],
    info: 'The pipe that carries magma from the chamber up to the crater',
    roInfo: 'Canalul prin care urcă magma din cameră până în crater', badge: [500, 420] },
  { id: 'crater', name: 'Crater', ro: 'Crater', roAlt: ['Craterul'],
    info: 'The bowl at the top where magma, gas and ash come out. A huge collapsed one is a caldera',
    roInfo: 'Depresiunea din vârf pe unde ies magma, gazele și cenușa. Unul uriaș, prăbușit, se numește calderă', badge: [500, 186] },
  { id: 'secondary-cone', name: 'Secondary cone', ro: 'Con secundar', alt: ['Parasitic cone', 'Side vent', 'Secondary vent', 'Adventive cone'], roAlt: ['Con parazit', 'Con adventiv', 'Coș secundar', 'Crater secundar'],
    info: 'A smaller cone on the flank, fed by a side branch of the vent. Etna has hundreds',
    roInfo: 'Un con mai mic pe flanc, alimentat de o ramificație a coșului. Etna are sute', badge: [690, 338], leader: [690, 362] },
  { id: 'lava-flow', name: 'Lava flow', ro: 'Curgere de lavă', alt: ['Lava'], roAlt: ['Lavă', 'Lava', 'Torent de lavă', 'Scurgere de lavă'],
    info: 'Magma that reaches the surface is called lava; basalt lava can run for kilometres',
    roInfo: 'Magma ajunsă la suprafață se numește lavă; lava bazaltică poate curge kilometri întregi', badge: [330, 390] },
  { id: 'ash-cloud', name: 'Ash cloud', ro: 'Nor de cenușă', alt: ['Ash column', 'Eruption column', 'Ash plume', 'Ash'], roAlt: ['Coloană de cenușă', 'Coloană eruptivă', 'Cenușă', 'Nor vulcanic', 'Nori de cenușă'],
    info: 'Rock dust and gas blasted up to 40 km high; in 2010 an Icelandic one stopped flights over Europe',
    roInfo: 'Praf de rocă și gaze aruncate până la 40 km înălțime; în 2010, unul islandez a oprit zborurile în Europa', badge: [520, 70] },
  { id: 'bombs', name: 'Volcanic bombs', ro: 'Bombe vulcanice', alt: ['Bombs', 'Lava bombs', 'Volcanic bomb', 'Tephra', 'Pyroclasts'], roAlt: ['Bombe', 'Bombă vulcanică', 'Piroclaste', 'Tefra', 'Lapilli'],
    info: 'Blobs of lava thrown out that cool in the air before they land',
    roInfo: 'Bucăți de lavă aruncate în aer, care se răcesc înainte să cadă', badge: [690, 120] },
  { id: 'strata', name: 'Layers of ash and lava', ro: 'Straturi de cenușă și lavă', alt: ['Layers', 'Strata', 'Ash and lava layers', 'Layers of lava and ash'], roAlt: ['Straturi', 'Straturi de lavă și cenușă', 'Straturi de lavă', 'Stratificație'],
    info: 'Each eruption adds a layer; that is why cones like Fuji are called stratovolcanoes',
    roInfo: 'Fiecare erupție adaugă un strat; de aceea conuri ca Fuji se numesc stratovulcani', badge: [775, 505] },
  { id: 'fumarole', name: 'Fumarole', ro: 'Fumarolă', alt: ['Fumaroles', 'Steam vent'], roAlt: ['Fumarole', 'Fumarola', 'Gaze vulcanice'],
    info: 'An opening that lets out steam and volcanic gases, often smelling of sulphur',
    roInfo: 'O deschidere prin care ies aburi și gaze vulcanice, adesea cu miros de sulf', badge: [380, 250], leader: [400, 268] },
  { id: 'bedrock', name: 'Crust', ro: 'Scoarța terestră', alt: ['Bedrock', 'Earth\'s crust', 'Crust rock'], roAlt: ['Crusta', 'Scoarța', 'Roca de bază', 'Crusta terestră', 'Scoarță'],
    info: 'The solid rock the volcano sits on; the magma melts its way up through it',
    roInfo: 'Roca solidă pe care stă vulcanul; magma își face drum prin ea topind-o', badge: [140, 640] },
]

function drawVolcano({ cls }) {
  const cone = 'M120 560 L430 196 Q450 176 470 180 L530 180 Q550 176 570 196 L880 560 Z'
  return (
    <>
      <defs>
        <linearGradient id="dgq-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1b2b4a" /><stop offset="1" stopColor="#2c3f63" /></linearGradient>
        <clipPath id="dgq-cone"><path d={cone} /></clipPath>
        <radialGradient id="dgq-magma"><stop offset="0" stopColor="#FFD54F" /><stop offset="0.6" stopColor="#FF8A3D" /><stop offset="1" stopColor="#D84315" /></radialGradient>
      </defs>
      <rect x="0" y="0" width="1000" height="560" fill="url(#dgq-sky)" />
      {/* the ground under the volcano */}
      <path d="M0 560 H1000 V720 H0 Z" fill="#5a4636" className={`dgq-layer${cls('bedrock')}`} />
      <path d="M0 600 Q250 590 500 605 T1000 600" fill="none" stroke="rgba(0,0,0,0.25)" strokeWidth="3" />
      <path d="M0 680 Q300 665 600 682 T1000 676" fill="none" stroke="rgba(0,0,0,0.25)" strokeWidth="3" />
      <ellipse cx="500" cy="640" rx="190" ry="52" fill="url(#dgq-magma)" className={`dgq-layer${cls('magma-chamber')}`} />
      {/* the cone, built of layers */}
      <path d={cone} fill="#6d5a4b" />
      <g clipPath="url(#dgq-cone)" className={`dgq-layer${cls('strata')}`} style={{ fill: 'none' }}>
        {[260, 330, 400, 470, 540].map((y, i) => (
          <path key={y} d={`M100 ${y + 40} Q500 ${y - 60} 900 ${y + 40} L900 ${y + 72} Q500 ${y - 28} 100 ${y + 72} Z`} fill={i % 2 ? '#8a7360' : '#4f4138'} stroke="none" />
        ))}
      </g>
      <path d={cone} fill="none" className={`dgq-layer${cls('strata')}`} />
      {/* the vents */}
      <path d="M484 592 L490 186 L510 186 L516 592 Z" fill="#FF7A1A" className={`dgq-layer${cls('main-vent')}`} />
      <path d="M512 470 Q600 430 680 390 L692 398 Q610 446 516 492 Z" fill="#FF7A1A" />
      <path d="M625 412 L690 358 L755 412 Z" fill="#7a6554" className={`dgq-layer${cls('secondary-cone')}`} />
      <path d="M680 380 L700 380 L694 396 Z" fill="#FF7A1A" />
      <path d="M440 186 Q500 206 560 186 L548 178 L452 178 Z" fill="#FFB74D" className={`dgq-layer${cls('crater')}`} />
      {/* lava running down the left flank */}
      <path d="M470 196 Q430 230 410 280 Q380 330 350 380 Q320 430 300 470 Q290 500 300 530 L325 528 Q318 500 330 470 Q350 430 380 380 Q410 330 432 285 Q452 240 482 200 Z" fill="#FF6D1F" className={`dgq-layer${cls('lava-flow')}`} />
      {/* ash cloud and bombs */}
      <g className={`dgq-layer${cls('ash-cloud')}`} fill="#8d93a0">
        <path d="M470 180 Q440 120 470 90 Q430 60 470 30 Q500 0 540 20 Q590 0 610 40 Q650 60 620 95 Q650 130 600 150 Q560 140 540 178 Z" />
      </g>
      <g className={`dgq-layer${cls('bombs')}`} fill="#3b2a22">
        <ellipse cx="650" cy="140" rx="12" ry="9" /><ellipse cx="720" cy="170" rx="9" ry="7" /><ellipse cx="380" cy="130" rx="11" ry="8" /><ellipse cx="330" cy="180" rx="8" ry="6" />
      </g>
      <path d="M650 140 Q600 120 560 150 M720 170 Q650 130 600 160 M380 130 Q430 120 460 160" fill="none" stroke="rgba(255,255,255,0.25)" strokeDasharray="4 6" strokeWidth="2" />
      {/* fumarole: steam from the flank */}
      <path d="M400 268 Q388 250 402 236 Q414 222 402 206 M412 270 Q424 252 412 236" fill="none" className={`dgq-steam${cls('fumarole')}`} />
    </>
  )
}

// ── The water cycle ─────────────────────────────────────────────────────────
const WATER = [
  { id: 'evaporation', name: 'Evaporation', ro: 'Evaporare', alt: ['Evaporate'], roAlt: ['Evaporarea', 'Evaporație'],
    info: 'The Sun heats the sea and water turns into vapour; about 86% of it comes from the oceans',
    roInfo: 'Soarele încălzește marea și apa devine vapori; circa 86% din ei vin din oceane', badge: [205, 360] },
  { id: 'condensation', name: 'Condensation', ro: 'Condensare', alt: ['Cloud formation'], roAlt: ['Condensarea', 'Condensație', 'Formarea norilor'],
    info: 'Rising vapour cools and turns into tiny droplets: that is what clouds are made of',
    roInfo: 'Vaporii urcă, se răcesc și devin picături mici: din ele sunt făcuți norii', badge: [470, 80] },
  { id: 'precipitation', name: 'Precipitation', ro: 'Precipitații', alt: ['Rain', 'Rain and snow', 'Rainfall'], roAlt: ['Precipitațiile', 'Ploaie', 'Ploaie și ninsoare', 'Precipitatii'],
    info: 'When droplets grow heavy they fall as rain, snow or hail',
    roInfo: 'Când picăturile devin grele, cad ca ploaie, ninsoare sau grindină', badge: [700, 210] },
  { id: 'transpiration', name: 'Transpiration', ro: 'Transpirație', alt: ['Evapotranspiration', 'Plant transpiration'], roAlt: ['Transpirația', 'Evapotranspirație', 'Transpirația plantelor'],
    info: 'Plants pull water from the soil and release it through their leaves as vapour',
    roInfo: 'Plantele trag apa din sol și o eliberează prin frunze sub formă de vapori', badge: [470, 360] },
  { id: 'runoff', name: 'Surface runoff', ro: 'Scurgere de suprafață', alt: ['Runoff', 'Surface run-off', 'River flow'], roAlt: ['Scurgere', 'Șiroire', 'Scurgerea', 'Scurgere superficială', 'Râuri'],
    info: 'Water that runs over the ground into streams and rivers and back to the sea',
    roInfo: 'Apa care curge pe suprafața solului în pâraie și râuri și înapoi în mare', badge: [560, 470] },
  { id: 'infiltration', name: 'Infiltration', ro: 'Infiltrare', alt: ['Percolation', 'Seepage'], roAlt: ['Infiltrația', 'Infiltrație', 'Infiltrarea'],
    info: 'Water soaks into the soil and down through cracks in the rock',
    roInfo: 'Apa pătrunde în sol și coboară prin crăpăturile rocilor', badge: [790, 515] },
  { id: 'groundwater', name: 'Groundwater', ro: 'Ape subterane', alt: ['Groundwater flow', 'Ground water', 'Aquifer'], roAlt: ['Apa subterană', 'Pânza freatică', 'Apa freatică', 'Acvifer', 'Ape freatice'],
    info: 'Water stored in rock layers underground; wells and springs tap into it',
    roInfo: 'Apă înmagazinată în straturile de rocă; fântânile și izvoarele o scot la suprafață', badge: [560, 580] },
  { id: 'snow-ice', name: 'Snow and ice', ro: 'Zăpadă și gheață', alt: ['Accumulation', 'Glacier', 'Ice', 'Snow', 'Ice and snow'], roAlt: ['Acumulare', 'Ghețar', 'Gheață', 'Zăpadă', 'Gheață și zăpadă'],
    info: 'Water can be stored for thousands of years as ice; glaciers hold about 69% of the fresh water',
    roInfo: 'Apa poate rămâne mii de ani sub formă de gheață; ghețarii țin circa 69% din apa dulce', badge: [865, 150] },
  { id: 'ocean', name: 'Ocean', ro: 'Ocean', alt: ['Sea', 'Oceans', 'Seas and oceans'], roAlt: ['Oceanul', 'Mare', 'Marea', 'Mări și oceane', 'Oceane'],
    info: 'Holds about 97% of all the water on Earth, salty',
    roInfo: 'Conține circa 97% din toată apa de pe Pământ, sărată', badge: [110, 520] },
]

function drawWater({ cls }) {
  const L = (id) => `dgq-layer${cls(id)}`
  const A = (id) => `dgq-arrow${cls(id)}`
  return (
    <>
      <defs>
        <Arrow />
        <linearGradient id="dgq-sky2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1f3557" /><stop offset="1" stopColor="#35557f" /></linearGradient>
      </defs>
      <rect x="0" y="0" width="1000" height="640" fill="url(#dgq-sky2)" />
      <circle cx="90" cy="90" r="46" fill="#FFD54F" />
      {/* sea, land, mountain */}
      <path d="M0 430 Q170 420 340 432 L340 640 L0 640 Z" fill="#2F7FD8" className={L('ocean')} />
      <path d="M330 432 Q420 420 520 400 Q620 370 700 300 L820 120 L940 290 Q980 330 1000 340 L1000 640 L330 640 Z" fill="#5d8c4a" />
      <path d="M330 520 Q600 500 1000 520 L1000 640 L330 640 Z" fill="#6b5545" />
      <path d="M330 590 Q600 575 1000 590 L1000 640 L330 640 Z" fill="#4f6e9a" opacity="0.75" className={L('groundwater')} />
      <path d="M780 170 L820 120 L868 188 Q845 176 830 192 Q812 172 795 190 Z" fill="#f4f8ff" className={L('snow-ice')} />
      {/* river down to the sea */}
      <path d="M845 260 Q800 330 720 360 Q640 390 600 430 Q560 470 470 465 Q400 460 340 440" fill="none" stroke="#3d8fe6" strokeWidth="9" strokeLinecap="round" className={`dgq-river${cls('runoff')}`} />
      {/* trees */}
      {[[440, 405], [480, 398], [520, 390]].map(([x, y]) => (
        <g key={x}><rect x={x - 3} y={y} width="6" height="18" fill="#6b4a2f" /><circle cx={x} cy={y - 6} r="15" fill="#2e7d32" /></g>
      ))}
      {/* clouds */}
      {[[400, 90], [640, 110]].map(([x, y], i) => (
        <path key={i} d={`M${x - 70} ${y + 20} Q${x - 80} ${y - 10} ${x - 40} ${y - 12} Q${x - 30} ${y - 45} ${x + 10} ${y - 35} Q${x + 40} ${y - 55} ${x + 60} ${y - 20} Q${x + 95} ${y - 15} ${x + 80} ${y + 20} Z`} fill="#e8eef7" className={L('condensation')} />
      ))}
      {/* arrows */}
      <path d="M150 420 Q170 380 150 340 Q130 300 160 250 Q190 200 260 140" className={A('evaporation')} markerEnd="url(#dgq-arrow)" />
      <path d="M230 420 Q250 370 230 330 Q215 290 250 240" className={A('evaporation')} markerEnd="url(#dgq-arrow)" />
      <path d="M480 370 Q470 300 460 220 Q455 180 420 150" className={A('transpiration')} markerEnd="url(#dgq-arrow)" />
      {[640, 670, 700, 730, 760].map((x, i) => (
        <path key={x} d={`M${x} ${150 + (i % 2) * 10} L${x - 14} ${230 + (i % 2) * 10}`} className={A('precipitation')} markerEnd="url(#dgq-arrow)" />
      ))}
      <path d="M730 330 Q620 395 560 440" className={A('runoff')} markerEnd="url(#dgq-arrow)" />
      {[760, 800, 840].map(x => <path key={x} d={`M${x} 470 L${x - 6} 560`} className={A('infiltration')} markerEnd="url(#dgq-arrow)" />)}
      <path d="M940 612 Q650 600 360 612" className={`${A('groundwater')} dgq-dashed`} markerEnd="url(#dgq-arrow)" />
      <path d="M470 60 Q560 40 620 70" className={A('condensation')} markerEnd="url(#dgq-arrow)" />
    </>
  )
}

// ── Plate boundaries ────────────────────────────────────────────────────────
const BOUNDARIES = [
  { id: 'divergent', name: 'Divergent boundary', ro: 'Limită divergentă', alt: ['Divergent', 'Constructive boundary', 'Spreading'], roAlt: ['Divergentă', 'Divergenta', 'Limita divergenta', 'Limită constructivă', 'Divergență'],
    info: 'Plates move apart and new crust forms in the gap, e.g. the Mid-Atlantic Ridge and Iceland',
    roInfo: 'Plăcile se depărtează și în spațiul dintre ele se formează crustă nouă, ca în Islanda', badge: [40, 40] },
  { id: 'ridge', name: 'Mid-ocean ridge', ro: 'Dorsală oceanică', alt: ['Ridge', 'Oceanic ridge', 'Mid ocean ridge', 'Spreading ridge'], roAlt: ['Dorsală', 'Dorsala', 'Dorsala oceanica', 'Dorsală medio-oceanică', 'Creastă oceanică'],
    info: 'An underwater mountain chain over 60,000 km long, where the sea floor is born',
    roInfo: 'Un lanț muntos submarin lung de peste 60.000 km, unde se naște fundul oceanului', badge: [250, 150], leader: [250, 186] },
  { id: 'magma-rising', name: 'Rising magma', ro: 'Magmă', alt: ['Magma', 'Upwelling magma', 'Mantle upwelling'], roAlt: ['Magma', 'Magmă ascendentă', 'Magma care urcă', 'Curenți de convecție'],
    info: 'Hot mantle rock rises and melts under the ridge, filling the gap with new rock',
    roInfo: 'Roca fierbinte din manta urcă și se topește sub dorsală, umplând spațiul cu rocă nouă', badge: [250, 280] },
  { id: 'subduction', name: 'Subduction', ro: 'Subducție', alt: ['Subduction zone', 'Oceanic-continental convergence'], roAlt: ['Subducția', 'Zonă de subducție', 'Zona de subductie', 'Subductie'],
    info: 'A heavy oceanic plate sinks under a lighter one: the Andes, Japan, the Ring of Fire',
    roInfo: 'O placă oceanică, mai grea, se scufundă sub una mai ușoară: Anzii, Japonia, Cercul de Foc', badge: [540, 40] },
  { id: 'trench', name: 'Ocean trench', ro: 'Fosă oceanică', alt: ['Trench', 'Oceanic trench', 'Deep-sea trench'], roAlt: ['Fosă', 'Fosa', 'Groapă oceanică', 'Fosa oceanica'],
    info: 'The deepest places on Earth form where a plate dives down: Mariana Trench, almost 11 km',
    roInfo: 'Cele mai adânci locuri de pe Pământ apar unde o placă se scufundă: Groapa Marianelor, aproape 11 km', badge: [700, 205], leader: [700, 184] },
  { id: 'volcanic-arc', name: 'Volcanic arc', ro: 'Arc vulcanic', alt: ['Volcanoes', 'Volcano', 'Volcanic mountains'], roAlt: ['Vulcani', 'Vulcan', 'Lanț vulcanic', 'Munți vulcanici'],
    info: 'The sinking plate melts deep down and the magma rises to build a chain of volcanoes',
    roInfo: 'Placa scufundată se topește în adânc, iar magma urcă și construiește un lanț de vulcani', badge: [868, 80], leader: [868, 110] },
  { id: 'oceanic-plate', name: 'Oceanic plate', ro: 'Placă oceanică', alt: ['Oceanic crust', 'Ocean plate'], roAlt: ['Placa oceanica', 'Crustă oceanică', 'Placa oceanică'],
    info: 'Thin, dense plate made of basalt; it is the one that sinks',
    roInfo: 'Placă subțire și densă, din bazalt; ea este cea care se scufundă', badge: [535, 198] },
  { id: 'continental-plate', name: 'Continental plate', ro: 'Placă continentală', alt: ['Continental crust', 'Continent'], roAlt: ['Placa continentala', 'Crustă continentală', 'Placa continentală'],
    info: 'Thicker, lighter plate that carries the continents; too light to sink',
    roInfo: 'Placă mai groasă și mai ușoară, care poartă continentele; prea ușoară ca să se scufunde', badge: [900, 230] },
  { id: 'collision', name: 'Continental collision', ro: 'Coliziune continentală', alt: ['Collision', 'Collision zone', 'Continent-continent collision'], roAlt: ['Coliziune', 'Coliziunea', 'Ciocnire continentală', 'Coliziune continentala'],
    info: 'Two continents meet; neither sinks, so the crust crumples upwards. India hitting Asia made the Himalayas',
    roInfo: 'Două continente se întâlnesc; niciunul nu se scufundă, așa că scoarța se încrețește. India ciocnind Asia a ridicat Himalaya', badge: [40, 360] },
  { id: 'fold-mountains', name: 'Fold mountains', ro: 'Munți de încrețire', alt: ['Folded mountains', 'Mountains', 'Mountain range'], roAlt: ['Munți de cutare', 'Munți', 'Munti de incretire', 'Munți cutați'],
    info: 'Mountains pushed up by plates colliding: the Himalayas, the Alps, the Carpathians',
    roInfo: 'Munți ridicați de ciocnirea plăcilor: Himalaya, Alpii, Carpații', badge: [250, 400], leader: [250, 440] },
  { id: 'transform', name: 'Transform boundary', ro: 'Limită transformantă', alt: ['Transform', 'Conservative boundary', 'Transform fault boundary'], roAlt: ['Transformantă', 'Transformanta', 'Limita transformanta', 'Limită conservativă'],
    info: 'Plates slide past each other sideways; no crust is made or destroyed, but quakes are common',
    roInfo: 'Plăcile alunecă una pe lângă alta; nu se creează și nu se distruge crustă, dar cutremurele sunt dese', badge: [540, 360] },
  { id: 'fault', name: 'Fault', ro: 'Falie', alt: ['Transform fault', 'Fault line', 'San Andreas Fault'], roAlt: ['Falia', 'Falie transformantă', 'Linie de falie', 'Falia San Andreas'],
    info: 'The crack where the plates grind past each other, like the San Andreas Fault in California',
    roInfo: 'Fisura de-a lungul căreia plăcile se freacă, ca Falia San Andreas din California', badge: [790, 420], leader: [770, 440] },
]

function drawBoundaries({ cls }) {
  const L = (id) => `dgq-layer${cls(id)}`
  const A = (id) => `dgq-arrow${cls(id)}`
  const PANELS = [[10, 10], [510, 10], [10, 330], [510, 330]]
  return (
    <>
      <defs>
        <Arrow />
        {PANELS.map(([x, y], i) => <clipPath key={i} id={`dgq-panel${i}`}><rect x={x} y={y} width="480" height="300" rx="16" /></clipPath>)}
      </defs>
      {PANELS.map(([x, y], i) => <rect key={i} x={x} y={y} width="480" height="300" rx="16" fill="#132038" />)}
      {/* divergent: ridge in the ocean, magma rising */}
      <g clipPath="url(#dgq-panel0)">
        <rect x="10" y="100" width="480" height="86" fill="#2F7FD8" opacity="0.8" />
        <path d="M10 210 L215 210 Q240 186 250 186 Q260 186 285 210 L490 210 L490 245 L10 245 Z" fill="#4E4038" className={L('ridge')} />
        <path d="M10 245 H490 V310 H10 Z" fill="#C9472F" />
        <path d="M236 310 Q240 260 250 196 Q260 260 264 310 Z" fill="#FF8A3D" className={L('magma-rising')} />
        <path d="M200 228 L80 228" className={A('divergent')} markerEnd="url(#dgq-arrow)" />
        <path d="M300 228 L420 228" className={A('divergent')} markerEnd="url(#dgq-arrow)" />
        <path d="M120 290 Q160 260 230 262 M380 290 Q340 260 270 262" fill="none" className={A('magma-rising')} />
      </g>
      {/* subduction: oceanic plate dives under a continent */}
      <g clipPath="url(#dgq-panel1)">
        <rect x="510" y="110" width="200" height="74" fill="#2F7FD8" opacity="0.8" />
        <path d="M510 184 L690 184 Q720 186 740 210 Q790 260 860 300 L860 310 L800 310 Q740 268 700 224 Q690 212 510 212 Z" fill="#4E4038" className={L('oceanic-plate')} />
        <path d="M700 184 Q720 150 760 140 L830 112 L860 82 L880 112 L990 150 L990 310 L870 310 Q790 262 742 210 Q722 186 700 184 Z" fill="#A3784F" className={L('continental-plate')} />
        <path d="M840 112 L862 76 L886 112 Z" fill="#6d5a4b" className={L('volcanic-arc')} />
        <path d="M860 82 L866 72" stroke="#FF8A3D" strokeWidth="5" />
        <path d="M800 290 Q830 220 862 90" fill="none" stroke="#FF8A3D" strokeWidth="5" strokeDasharray="8 6" />
        <path d="M690 184 Q700 200 712 186" fill="none" stroke="#9fd0ff" strokeWidth="3" className={L('trench')} />
        <path d="M560 198 L660 198" className={A('subduction')} markerEnd="url(#dgq-arrow)" />
        <path d="M760 250 L810 290" className={A('subduction')} markerEnd="url(#dgq-arrow)" />
      </g>
      {/* collision: two continents crumple into mountains */}
      <g clipPath="url(#dgq-panel2)">
        <path d="M10 520 L190 520 Q215 470 235 450 L250 438 L268 452 Q290 470 310 520 L490 520 L490 640 L10 640 Z" fill="#A3784F" />
        <path d="M190 520 Q215 470 235 450 L250 438 L268 452 Q290 470 310 520 Z" fill="#8a6a4a" className={L('fold-mountains')} />
        <path d="M232 452 L250 438 L268 452 L258 450 L250 444 L242 450 Z" fill="#f4f8ff" />
        <path d="M200 520 Q230 560 250 620 Q270 560 300 520" fill="none" stroke="rgba(0,0,0,0.3)" strokeWidth="3" />
        <path d="M60 580 L170 580" className={A('collision')} markerEnd="url(#dgq-arrow)" />
        <path d="M440 580 L330 580" className={A('collision')} markerEnd="url(#dgq-arrow)" />
      </g>
      {/* transform: seen from above, two plates slide past each other */}
      <g clipPath="url(#dgq-panel3)">
        <rect x="560" y="400" width="210" height="200" fill="#7d8f5a" />
        <rect x="770" y="400" width="200" height="200" fill="#a08b5a" />
        <path d="M770 400 L770 600" stroke="#2a1d14" strokeWidth="5" className={`dgq-line-solid${cls('fault')}`} />
        <path d="M640 430 L640 400 M700 430 L700 400" stroke="rgba(255,255,255,0.15)" />
        <path d="M600 570 L740 570" stroke="#e7d8a0" strokeWidth="6" />
        <path d="M800 470 L940 470" stroke="#e7d8a0" strokeWidth="6" />
        <path d="M665 520 L665 430" className={A('transform')} markerEnd="url(#dgq-arrow)" />
        <path d="M870 450 L870 540" className={A('transform')} markerEnd="url(#dgq-arrow)" />
      </g>
      {PANELS.map(([x, y], i) => <rect key={i} x={x} y={y} width="480" height="300" rx="16" fill="none" stroke="rgba(255,255,255,0.14)" />)}
    </>
  )
}


// ── Climate zones ───────────────────────────────────────────────────────────
// The globe seen from the side: a latitude is a horizontal chord at y = CY − R·sin(lat)
const GX = 470, GY = 320, GR = 270
const latY = (lat) => +(GY - GR * Math.sin(lat * Math.PI / 180)).toFixed(1)
const latHalf = (lat) => GR * Math.cos(lat * Math.PI / 180)
const lineEnd = (lat) => [+(GX + latHalf(lat)).toFixed(1), latY(lat)]
const BADGE_X = GX + GR + 70

const CLIMATE = [
  { id: 'torrid', name: 'Torrid zone', ro: 'Zona caldă', alt: ['Tropical zone', 'Tropics', 'Hot zone', 'Tropical'], roAlt: ['Zona tropicală', 'Zona intertropicală', 'Zona toridă', 'Zona calda', 'Tropicele'],
    info: 'Between the two tropics: the Sun can stand straight overhead, so it is hot all year',
    roInfo: 'Între cele două tropice: Soarele poate ajunge exact deasupra capului, așa că e cald tot anul', badge: [GX - 120, GY] },
  { id: 'temperate-n', name: 'North temperate zone', ro: 'Zona temperată nordică', alt: ['Northern temperate zone', 'Temperate zone', 'North temperate'], roAlt: ['Zona temperată de nord', 'Zona temperată', 'Zona temperata nordica', 'Temperată nordică'],
    info: 'Between the Tropic of Cancer and the Arctic Circle: four clear seasons. Romania is here',
    roInfo: 'Între Tropicul Racului și Cercul Polar de Nord: patru anotimpuri clare. România e aici', badge: [GX - 140, latY(45)] },
  { id: 'temperate-s', name: 'South temperate zone', ro: 'Zona temperată sudică', alt: ['Southern temperate zone', 'Temperate zone', 'South temperate'], roAlt: ['Zona temperată de sud', 'Zona temperată', 'Zona temperata sudica', 'Temperată sudică'],
    info: 'Between the Tropic of Capricorn and the Antarctic Circle; seasons are the reverse of ours',
    roInfo: 'Între Tropicul Capricornului și Cercul Polar de Sud; anotimpurile sunt invers decât la noi', badge: [GX - 140, latY(-45)] },
  { id: 'frigid-n', name: 'North frigid zone', ro: 'Zona rece nordică', alt: ['Arctic zone', 'North polar zone', 'Frigid zone', 'Polar zone'], roAlt: ['Zona polară nordică', 'Zona rece de nord', 'Zona rece', 'Zona polară', 'Zona arctică'],
    info: 'Inside the Arctic Circle: at least one day a year when the Sun never sets, and one when it never rises',
    roInfo: 'În interiorul Cercului Polar de Nord: cel puțin o zi pe an în care Soarele nu apune și una în care nu răsare', badge: [GX - 40, latY(76)] },
  { id: 'frigid-s', name: 'South frigid zone', ro: 'Zona rece sudică', alt: ['Antarctic zone', 'South polar zone', 'Frigid zone', 'Polar zone'], roAlt: ['Zona polară sudică', 'Zona rece de sud', 'Zona rece', 'Zona polară', 'Zona antarctică'],
    info: 'Inside the Antarctic Circle, almost all of it Antarctica',
    roInfo: 'În interiorul Cercului Polar de Sud, aproape în întregime Antarctida', badge: [GX - 40, latY(-76)] },
  { id: 'equator-c', name: 'Equator', ro: 'Ecuator', alt: ['The Equator'], roAlt: ['Ecuatorul'],
    info: 'Latitude 0°, about 40,075 km around; day and night last 12 hours all year',
    roInfo: 'Latitudinea 0°, lungă de circa 40.075 km; ziua și noaptea țin câte 12 ore tot anul', badge: [BADGE_X, latY(0)], leader: lineEnd(0) },
  { id: 'cancer-c', name: 'Tropic of Cancer', ro: 'Tropicul Racului', alt: ['Cancer'], roAlt: ['Racului'],
    info: '23.4° N: on the June solstice the midday Sun is straight overhead here',
    roInfo: '23,4° N: la solstițiul din iunie, Soarele de amiază e exact la zenit aici', badge: [BADGE_X, latY(23.44)], leader: lineEnd(23.44) },
  { id: 'capricorn-c', name: 'Tropic of Capricorn', ro: 'Tropicul Capricornului', alt: ['Capricorn'], roAlt: ['Capricornului'],
    info: '23.4° S: on the December solstice the midday Sun is straight overhead here',
    roInfo: '23,4° S: la solstițiul din decembrie, Soarele de amiază e exact la zenit aici', badge: [BADGE_X, latY(-23.44)], leader: lineEnd(-23.44) },
  { id: 'arctic-c', name: 'Arctic Circle', ro: 'Cercul Polar de Nord', alt: ['Arctic'], roAlt: ['Cercul Polar Arctic', 'Cercul Arctic'],
    info: '66.6° N: crosses Norway, Sweden, Finland, Russia, Alaska, Canada and Greenland',
    roInfo: '66,6° N: traversează Norvegia, Suedia, Finlanda, Rusia, Alaska, Canada și Groenlanda', badge: [BADGE_X, latY(66.56)], leader: lineEnd(66.56) },
  { id: 'antarctic-c', name: 'Antarctic Circle', ro: 'Cercul Polar de Sud', alt: ['Antarctic'], roAlt: ['Cercul Polar Antarctic', 'Cercul Antarctic'],
    info: '66.6° S: runs almost entirely over the ocean and Antarctica',
    roInfo: '66,6° S: trece aproape numai peste ocean și Antarctida', badge: [BADGE_X, latY(-66.56)], leader: lineEnd(-66.56) },
  { id: 'north-pole', name: 'North Pole', ro: 'Polul Nord', alt: ['Geographic North Pole'], roAlt: ['Polul Nord geografic', 'Pol Nord'],
    info: '90° N, in the middle of the frozen Arctic Ocean; first reached for certain in 1926 by airship',
    roInfo: '90° N, în mijlocul Oceanului Arctic înghețat; atins cu siguranță prima dată în 1926, cu dirijabilul', badge: [GX, GY - GR - 26], leader: [GX, GY - GR] },
  { id: 'south-pole', name: 'South Pole', ro: 'Polul Sud', alt: ['Geographic South Pole'], roAlt: ['Polul Sud geografic', 'Pol Sud'],
    info: '90° S, on Antarctica\'s ice sheet about 2,800 m thick; Amundsen got there first, in 1911',
    roInfo: '90° S, pe calota Antarctidei, groasă de circa 2.800 m; Amundsen a ajuns primul, în 1911', badge: [GX, GY + GR + 26], leader: [GX, GY + GR] },
]

function drawClimate({ cls }) {
  const band = (id, lat0, lat1, fill) => <rect x={GX - GR} y={latY(lat1)} width={2 * GR} height={latY(lat0) - latY(lat1)} fill={fill} className={`dgq-layer${cls(id)}`} />
  const chord = (id, lat) => <path d={`M${(GX - latHalf(lat)).toFixed(1)} ${latY(lat)} H${(GX + latHalf(lat)).toFixed(1)}`} className={`dgq-line${cls(id)}`} />
  return (
    <>
      <defs>
        <clipPath id="dgq-globe"><circle cx={GX} cy={GY} r={GR} /></clipPath>
        <radialGradient id="dgq-shade" cx="0.38" cy="0.35" r="0.75"><stop offset="0.55" stopColor="rgba(0,0,0,0)" /><stop offset="1" stopColor="rgba(0,0,0,0.35)" /></radialGradient>
      </defs>
      <g clipPath="url(#dgq-globe)">
        {band('frigid-n', 66.56, 90, '#cfe3f5')}
        {band('temperate-n', 23.44, 66.56, '#7cc4a0')}
        {band('torrid', -23.44, 23.44, '#f2b85c')}
        {band('temperate-s', -66.56, -23.44, '#7cc4a0')}
        {band('frigid-s', -90, -66.56, '#cfe3f5')}
        <circle cx={GX} cy={GY} r={GR} fill="url(#dgq-shade)" />
      </g>
      <circle cx={GX} cy={GY} r={GR} fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
      {chord('equator-c', 0)}{chord('cancer-c', 23.44)}{chord('capricorn-c', -23.44)}{chord('arctic-c', 66.56)}{chord('antarctic-c', -66.56)}
      <circle cx={GX} cy={GY - GR} r="7" className={`dgq-dot${cls('north-pole')}`} />
      <circle cx={GX} cy={GY + GR} r="7" className={`dgq-dot${cls('south-pole')}`} />
    </>
  )
}

// ── The Earth's orbit and the seasons ───────────────────────────────────────
const OX = 500, OY = 320, ORX = 390, ORY = 205
const SUN = [545, 320]
const ORBIT = [
  { id: 'sun', name: 'Sun', ro: 'Soarele', alt: ['The Sun'], roAlt: ['Soare'],
    info: 'About 150 million km away; its light takes about 8 minutes 20 seconds to reach us',
    roInfo: 'La circa 150 de milioane de km; lumina lui ajunge la noi în circa 8 minute și 20 de secunde', badge: [SUN[0], SUN[1] - 82] },
  { id: 'june-solstice', name: 'June solstice', ro: 'Solstițiul de vară', alt: ['Summer solstice', 'June 21', '21 June'], roAlt: ['Solstițiu de vară', 'Solstitiul de vara', '21 iunie', 'Solstițiul din iunie'],
    info: 'Around 21 June: the North Pole leans towards the Sun, the longest day in the northern hemisphere',
    roInfo: 'În jur de 21 iunie: Polul Nord e înclinat spre Soare; cea mai lungă zi din emisfera nordică', badge: [OX - ORX, OY + 62] },
  { id: 'december-solstice', name: 'December solstice', ro: 'Solstițiul de iarnă', alt: ['Winter solstice', 'December 21', '21 December'], roAlt: ['Solstițiu de iarnă', 'Solstitiul de iarna', '21 decembrie', 'Solstițiul din decembrie'],
    info: 'Around 21 December: the North Pole leans away from the Sun, the shortest day in the north',
    roInfo: 'În jur de 21 decembrie: Polul Nord e înclinat departe de Soare; cea mai scurtă zi în nord', badge: [OX + ORX, OY + 62] },
  { id: 'march-equinox', name: 'March equinox', ro: 'Echinocțiul de primăvară', alt: ['Spring equinox', 'Vernal equinox', 'March 20', '20 March'], roAlt: ['Echinocțiu de primăvară', 'Echinoctiul de primavara', '20 martie', '21 martie', 'Echinocțiul din martie'],
    info: 'Around 20 March: day and night are about equally long everywhere',
    roInfo: 'În jur de 20 martie: ziua și noaptea sunt aproape egale peste tot', badge: [OX + 62, OY - ORY] },
  { id: 'september-equinox', name: 'September equinox', ro: 'Echinocțiul de toamnă', alt: ['Autumn equinox', 'Autumnal equinox', 'Fall equinox', 'September 22', '22 September'], roAlt: ['Echinocțiu de toamnă', 'Echinoctiul de toamna', '22 septembrie', '23 septembrie', 'Echinocțiul din septembrie'],
    info: 'Around 22 September: day and night equal again, the Sun is over the Equator',
    roInfo: 'În jur de 22 septembrie: ziua și noaptea sunt din nou egale, Soarele e deasupra Ecuatorului', badge: [OX + 62, OY + ORY] },
  { id: 'perihelion', name: 'Perihelion', ro: 'Periheliu', alt: ['Closest point'], roAlt: ['Periheliul', 'Punctul cel mai apropiat'],
    info: 'Early January: the Earth is closest to the Sun (about 147 million km), in the middle of our winter',
    roInfo: 'La începutul lui ianuarie: Pământul e cel mai aproape de Soare (circa 147 milioane km), în plină iarnă la noi', badge: [OX + ORX * 0.92 + 30, OY + ORY * 0.39 + 34], leader: [+(OX + ORX * 0.92).toFixed(1), +(OY + ORY * 0.39).toFixed(1)] },
  { id: 'aphelion', name: 'Aphelion', ro: 'Afeliu', alt: ['Farthest point', 'Furthest point'], roAlt: ['Afeliul', 'Punctul cel mai îndepărtat'],
    info: 'Early July: the Earth is farthest from the Sun (about 152 million km); distance doesn\'t make the seasons',
    roInfo: 'La începutul lui iulie: Pământul e cel mai departe de Soare (circa 152 milioane km); nu distanța face anotimpurile', badge: [OX - ORX * 0.92 - 30, OY - ORY * 0.39 - 34], leader: [+(OX - ORX * 0.92).toFixed(1), +(OY - ORY * 0.39).toFixed(1)] },
  { id: 'axis', name: 'Axial tilt', ro: 'Axa înclinată', alt: ['Axis', 'Earth\'s axis', 'Tilt', 'Axis tilt', 'Axis of rotation'], roAlt: ['Axa', 'Axa Pământului', 'Înclinarea axei', 'Axa de rotație', 'Axa terestră', 'Inclinarea axei'],
    info: 'The axis leans 23.4° and always points the same way (towards Polaris): this is what causes the seasons',
    roInfo: 'Axa e înclinată cu 23,4° și arată mereu în aceeași direcție (spre Steaua Polară): asta produce anotimpurile', badge: [OX - ORX + 66, OY - 70], leader: [OX - ORX + 18, OY - 38] },
  { id: 'orbit', name: 'Orbit', ro: 'Orbita', alt: ['Earth\'s orbit', 'Revolution', 'Ecliptic'], roAlt: ['Orbită', 'Orbita Pământului', 'Revoluția', 'Mișcarea de revoluție', 'Ecliptica'],
    info: 'One trip around the Sun takes 365.25 days, at about 30 km per second',
    roInfo: 'Un tur în jurul Soarelui durează 365,25 zile, cu circa 30 km pe secundă', badge: [830, 150], leader: [799, 188] },
]

function Earth({ x, y, id, cls }) {
  // day side faces the Sun; the axis always leans the same way (top to the right)
  const ang = Math.atan2(SUN[1] - y, SUN[0] - x) * 180 / Math.PI
  const tilt = 23.4 * Math.PI / 180, a = 46
  return (
    <g className={`dgq-earth${cls(id)}`}>
      <circle cx={x} cy={y} r="28" fill="#2F7FD8" />
      <path d="M0 -28 A28 28 0 0 1 0 28 Z" fill="rgba(0,0,0,0.55)" transform={`translate(${x} ${y}) rotate(${ang + 180})`} />
      <circle cx={x} cy={y} r="28" fill="none" className="dgq-earth-ring" />
      <path d={`M${(x - a * Math.sin(tilt)).toFixed(1)} ${(y + a * Math.cos(tilt)).toFixed(1)} L${(x + a * Math.sin(tilt)).toFixed(1)} ${(y - a * Math.cos(tilt)).toFixed(1)}`} className={`dgq-axis${cls('axis')}`} />
    </g>
  )
}

function drawOrbit({ cls }) {
  return (
    <>
      <defs>
        <Arrow />
        <radialGradient id="dgq-sun"><stop offset="0" stopColor="#FFF6C8" /><stop offset="0.5" stopColor="#FFD54F" /><stop offset="1" stopColor="#FF9F1C" /></radialGradient>
      </defs>
      {Array.from({ length: 40 }, (_, i) => <circle key={i} cx={(i * 263) % 1000} cy={(i * 151) % 640} r={i % 3 ? 1.2 : 2} fill="rgba(255,255,255,0.5)" />)}
      <ellipse cx={OX} cy={OY} rx={ORX} ry={ORY} fill="none" className={`dgq-line dgq-orbit${cls('orbit')}`} />
      <path d="M97 377 Q169 489 344 523" className="dgq-arrow" markerEnd="url(#dgq-arrow)" style={{ strokeWidth: 3 }} />
      <circle cx={SUN[0]} cy={SUN[1]} r="58" fill="url(#dgq-sun)" className={`dgq-layer${cls('sun')}`} />
      <circle cx={+(OX + ORX * 0.92).toFixed(1)} cy={+(OY + ORY * 0.39).toFixed(1)} r="6" className={`dgq-dot${cls('perihelion')}`} />
      <circle cx={+(OX - ORX * 0.92).toFixed(1)} cy={+(OY - ORY * 0.39).toFixed(1)} r="6" className={`dgq-dot${cls('aphelion')}`} />
      <Earth x={OX - ORX} y={OY} id="june-solstice" cls={cls} />
      <Earth x={OX + ORX} y={OY} id="december-solstice" cls={cls} />
      <Earth x={OX} y={OY - ORY} id="march-equinox" cls={cls} />
      <Earth x={OX} y={OY + ORY} id="september-equinox" cls={cls} />
    </>
  )
}

// ── Landforms: one made-up landscape with a bit of everything ───────────────
const LANDSCAPE = [
  { id: 'mountain', name: 'Mountain', ro: 'Munte', alt: ['Mountains', 'Peak', 'Mountain range', 'Summit'], roAlt: ['Munți', 'Vârf', 'Pisc', 'Lanț muntos', 'Muntele'],
    info: 'Land rising steeply hundreds of metres or more above its surroundings; Everest reaches 8,849 m',
    roInfo: 'Teren care se ridică abrupt sute de metri sau mai mult deasupra împrejurimilor; Everestul are 8.849 m', badge: [620, 115] },
  { id: 'glacier', name: 'Glacier', ro: 'Ghețar', alt: ['Ice', 'Ice river'], roAlt: ['Gheţar', 'Ghetar', 'Râu de gheață'],
    info: 'A river of ice that slides slowly downhill and carves the valley beneath it',
    roInfo: 'Un râu de gheață care alunecă încet la vale și sapă valea de sub el', badge: [842, 165] },
  { id: 'valley', name: 'Valley', ro: 'Vale', alt: ['U-shaped valley', 'Glacial valley'], roAlt: ['Valea', 'Vale glaciară', 'Vale în formă de U'],
    info: 'Low land between hills or mountains; glaciers carve U-shaped valleys, rivers V-shaped ones',
    roInfo: 'Teren jos între dealuri sau munți; ghețarii sapă văi în formă de U, râurile în formă de V', badge: [815, 325] },
  { id: 'lake', name: 'Lake', ro: 'Lac', alt: ['Glacial lake', 'Tarn'], roAlt: ['Lacul', 'Lac glaciar', 'Tău'],
    info: 'Water held in a hollow of the land; many mountain lakes, like those in the Retezat, were dug by glaciers',
    roInfo: 'Apă adunată într-o adâncitură a terenului; multe lacuri de munte, ca în Retezat, au fost săpate de ghețari', badge: [852, 290] },
  { id: 'waterfall', name: 'Waterfall', ro: 'Cascadă', alt: ['Falls', 'Cascade'], roAlt: ['Cascada', 'Cădere de apă', 'Cataractă'],
    info: 'A river dropping over a step of hard rock; Angel Falls in Venezuela falls 979 m',
    roInfo: 'Un râu care cade peste o treaptă de rocă dură; Salto Ángel din Venezuela are 979 m', badge: [690, 372], leader: [652, 370] },
  { id: 'meander', name: 'Meander', ro: 'Meandru', alt: ['Meanders', 'River bend', 'Meandering river'], roAlt: ['Meandre', 'Meandrele', 'Cot de râu', 'Râu meandrat'],
    info: 'A loop of a slow river on flat land; it slowly shifts as the outer bank wears away',
    roInfo: 'O buclă a unui râu lent pe teren plat; se mută încet, pe măsură ce malul exterior e erodat', badge: [510, 430] },
  { id: 'delta', name: 'Delta', ro: 'Deltă', alt: ['River delta'], roAlt: ['Delta', 'Delta fluviului'],
    info: 'Land built from mud a river drops where it meets the sea; the Danube Delta grows by metres a year',
    roInfo: 'Uscat format din mâlul lăsat de râu la vărsarea în mare; Delta Dunării crește cu câțiva metri pe an', badge: [180, 500], leader: [228, 494] },
  { id: 'plain', name: 'Plain', ro: 'Câmpie', alt: ['Lowland', 'Flatland', 'Floodplain'], roAlt: ['Câmpia', 'Șes', 'Ses', 'Câmpie joasă', 'Lunca'],
    info: 'Wide, flat, low land, often very fertile: the Romanian Plain grows much of the country\'s grain',
    roInfo: 'Teren întins, plat și jos, adesea foarte fertil: Câmpia Română dă mare parte din grânele țării', badge: [360, 480] },
  { id: 'hill', name: 'Hill', ro: 'Deal', alt: ['Hills'], roAlt: ['Dealuri', 'Colină', 'Coline', 'Dealul'],
    info: 'Rounded high ground, lower and gentler than a mountain (usually under about 500–1,000 m)',
    roInfo: 'Teren înalt și rotunjit, mai jos și mai domol decât un munte (de obicei sub circa 500–1.000 m)', badge: [470, 300] },
  { id: 'plateau', name: 'Plateau', ro: 'Podiș', alt: ['Tableland', 'Mesa', 'High plain'], roAlt: ['Podișul', 'Platou', 'Platoul', 'Masă'],
    info: 'High ground with a flat top; the Tibetan Plateau averages over 4,500 m',
    roInfo: 'Teren înalt cu partea de sus plată; Podișul Tibet are în medie peste 4.500 m', badge: [680, 540] },
  { id: 'canyon', name: 'Canyon', ro: 'Canion', alt: ['Gorge', 'Ravine'], roAlt: ['Canionul', 'Defileu', 'Chei', 'Cheile'],
    info: 'A deep, steep-sided valley cut by a river; the Grand Canyon is up to 1,800 m deep',
    roInfo: 'O vale adâncă, cu pereți abrupți, tăiată de un râu; Marele Canion are până la 1.800 m adâncime', badge: [905, 410] },
  { id: 'dunes', name: 'Sand dunes', ro: 'Dune', alt: ['Dunes', 'Dune', 'Desert'], roAlt: ['Dune de nisip', 'Dunele', 'Dună', 'Deșert'],
    info: 'Hills of sand shaped by the wind; some in the Sahara are over 150 m high',
    roInfo: 'Dealuri de nisip modelate de vânt; unele din Sahara au peste 150 m', badge: [920, 595] },
  { id: 'bay', name: 'Bay', ro: 'Golf', alt: ['Gulf', 'Cove'], roAlt: ['Golful', 'Golfuleț', 'Abis'],
    info: 'Part of the sea curving into the land, sheltered on three sides',
    roInfo: 'O parte a mării care intră în uscat, adăpostită pe trei laturi', badge: [292, 362] },
  { id: 'peninsula', name: 'Peninsula', ro: 'Peninsulă', alt: ['Cape', 'Headland'], roAlt: ['Peninsula', 'Cap', 'Promontoriu'],
    info: 'Land surrounded by water on three sides, joined to the mainland on the fourth',
    roInfo: 'Uscat înconjurat de apă pe trei laturi, legat de continent pe a patra', badge: [120, 570] },
  { id: 'island', name: 'Island', ro: 'Insulă', alt: ['Isle', 'Islet'], roAlt: ['Insula', 'Ostrov', 'Insuliță'],
    info: 'Land surrounded by water on all sides; Greenland is the largest',
    roInfo: 'Uscat înconjurat de apă din toate părțile; Groenlanda este cea mai mare', badge: [140, 232] },
  { id: 'atoll', name: 'Atoll', ro: 'Atol', alt: ['Coral atoll', 'Coral reef'], roAlt: ['Atolul', 'Atol coralier', 'Recif de corali'],
    info: 'A ring of coral around a lagoon, left behind where an old volcanic island sank; the Maldives are atolls',
    roInfo: 'Un inel de corali în jurul unei lagune, rămas unde s-a scufundat o insulă vulcanică veche; Maldivele sunt atoli', badge: [112, 420] },
  { id: 'fjord', name: 'Fjord', ro: 'Fiord', alt: ['Fiord'], roAlt: ['Fiordul', 'Fjord'],
    info: 'A long, narrow sea inlet between steep cliffs: a glacial valley flooded by the sea, as in Norway',
    roInfo: 'Un braț de mare lung și îngust între stânci abrupte: o vale glaciară inundată de mare, ca în Norvegia', badge: [350, 70], leader: [350, 112] },
]

function drawLandscape({ cls }) {
  const L = (id) => `dgq-layer${cls(id)}`
  const land = 'M300 0 L1000 0 L1000 640 L240 640 L232 612 L150 602 L70 588 L48 566 L72 550 L150 546 L214 532 L228 502 L238 470 L232 440 L255 422 L305 405 L338 360 L305 316 L252 300 L238 250 L252 200 L262 134 L425 120 L434 110 L272 98 L282 40 Z'
  return (
    <>
      <rect x="0" y="0" width="1000" height="640" fill="#2F7FD8" />
      <path d="M0 0 H300 L282 40 L272 98 L262 134 L252 200 L238 250 L252 300 L305 316 L338 360 L305 405 L255 422 L232 440 L238 470 L228 502 L214 532 L150 546 L72 550 L48 566 L70 588 L150 602 L232 612 L240 640 H0 Z" fill="#2F7FD8" className={L('bay')} style={{ fillOpacity: 0 }} />
      <path d={land} fill="#6f9e54" />
      {/* the peninsula, outlined on its own */}
      <path d="M228 520 L214 532 L150 546 L72 550 L48 566 L70 588 L150 602 L232 612" fill="none" className={L('peninsula')} style={{ strokeWidth: 0 }} />
      <path d="M232 612 L150 602 L70 588 L48 566 L72 550 L150 546 L214 532 L222 572 Z" fill="#78a85b" className={L('peninsula')} />
      {/* fjord cliffs */}
      <path d="M272 98 L434 110" stroke="#4d5a49" strokeWidth="9" strokeLinecap="round" />
      <path d="M262 134 L425 120" stroke="#4d5a49" strokeWidth="9" strokeLinecap="round" />
      <path d="M262 134 L425 120 L434 110 L272 98 Z" fill="#2F7FD8" className={L('fjord')} />
      {/* island and atoll */}
      <path d="M100 230 Q110 200 145 205 Q180 212 178 236 Q172 262 140 262 Q105 260 100 230 Z" fill="#e9d79b" />
      <path d="M110 230 Q118 210 145 214 Q170 220 168 238 Q162 254 140 254 Q114 252 110 230 Z" fill="#6f9e54" className={L('island')} />
      <circle cx="112" cy="420" r="34" fill="#7fc4ea" />
      <circle cx="112" cy="420" r="34" fill="none" stroke="#f1e3b4" strokeWidth="10" className={`dgq-ringline${cls('atoll')}`} />
      {/* plain, hills */}
      <path d="M292 395 Q450 375 655 395 L665 505 Q450 512 280 508 Z" fill="#9cc771" className={L('plain')} />
      <path d="M400 330 Q440 270 490 285 Q520 255 565 280 Q610 300 600 340 Z" fill="#558a3e" className={L('hill')} />
      {/* mountains, glacier, valley, lake */}
      <path d="M760 240 L940 240 L905 345 L800 345 Z" fill="#8fbf6a" className={L('valley')} />
      <g className={L('mountain')}>
        <path d="M520 240 L620 70 L720 240 Z" fill="#7b8494" />
        <path d="M690 240 L790 40 L880 240 Z" fill="#8a93a3" />
        <path d="M830 240 L920 60 L1000 200 L1000 240 Z" fill="#7b8494" />
      </g>
      <path d="M598 108 L620 70 L644 110 L630 102 L620 112 L608 102 Z M770 80 L790 40 L810 82 L798 76 L790 86 L780 76 Z M905 90 L920 60 L938 94 L926 88 L918 96 L912 88 Z" fill="#f4f8ff" />
      <path d="M815 105 Q842 150 832 225 Q830 255 852 266 Q874 255 870 225 Q862 150 870 105 Q842 92 815 105 Z" fill="#e3f0ff" className={L('glacier')} />
      <ellipse cx="852" cy="292" rx="58" ry="22" fill="#3d8fe6" className={L('lake')} />
      {/* escarpment and waterfall */}
      <path d="M560 360 L775 348 L775 376 L560 388 Z" fill="#6b5a3f" />
      <path d="M800 300 Q760 330 700 344 Q665 350 650 352" fill="none" stroke="#3d8fe6" strokeWidth="9" strokeLinecap="round" />
      <path d="M641 352 L641 390 M649 351 L649 390 M657 350 L657 389" stroke="#e8f4ff" strokeWidth="5" className={`dgq-steam${cls('waterfall')}`} />
      {/* meandering river and delta */}
      <path d="M649 392 C600 400 640 440 590 445 C540 450 560 400 510 405 C460 410 480 455 430 455 C380 455 390 420 340 430 C300 438 300 462 276 466" fill="none" stroke="#3d8fe6" strokeWidth="9" strokeLinecap="round" className={`dgq-river${cls('meander')}`} />
      <path d="M282 450 L226 476 L214 522 L280 512 Z" fill="#a9cf7f" className={L('delta')} />
      <path d="M276 466 L228 482 M276 466 L220 500 M276 466 L230 516" stroke="#3d8fe6" strokeWidth="4" />
      {/* plateau */}
      <path d="M560 600 L605 520 L755 520 L800 600 Z" fill="#b5835a" className={L('plateau')} />
      <path d="M605 520 L755 520 L748 532 L612 532 Z" fill="#cfa071" />
      {/* canyon */}
      <path d="M800 410 Q900 395 1000 400 L1000 530 Q900 520 800 540 Z" fill="#c0663f" />
      <path d="M800 475 L840 462 L862 486 L900 466 L930 488 L965 470 L1000 478" fill="none" stroke="#4a2a1c" strokeWidth="22" strokeLinejoin="round" className={`dgq-gorge${cls('canyon')}`} />
      <path d="M800 475 L840 462 L862 486 L900 466 L930 488 L965 470 L1000 478" fill="none" stroke="#3d8fe6" strokeWidth="4" strokeLinejoin="round" />
      {/* dunes */}
      <path d="M810 640 L820 560 Q900 545 1000 555 L1000 640 Z" fill="#e8c77d" className={L('dunes')} />
      <path d="M830 590 Q860 572 890 590 M890 612 Q925 590 960 612 M930 575 Q960 560 990 576 M840 625 Q870 608 900 625" fill="none" stroke="#c9a258" strokeWidth="4" />
    </>
  )
}

// ── Types of clouds ─────────────────────────────────────────────────────────
// Height on the left: y = 650 − 45 per km (the ground is at 650, 13 km at the top)
const KM = (km) => 650 - km * 45
const puff = (x, y, r) => `M${x - r} ${y} a${r} ${r} 0 0 1 ${2 * r} 0 Z`
// a puffy cloud: overlapping circles on a flat base (x, base, width, height)
const Blob = ({ x, base, w, h, fill, className }) => {
  const n = Math.max(2, Math.round(w / (h * 0.9)))
  const r = w / n / 1.6
  return (
    <g className={className} fill={fill}>
      {Array.from({ length: n }, (_, i) => {
        const cx = x - w / 2 + r + (i * (w - 2 * r)) / Math.max(1, n - 1)
        const lift = h - r - (Math.sin((i / Math.max(1, n - 1)) * Math.PI) * (h - 2 * r))
        return <circle key={i} cx={cx} cy={base - r - (h - 2 * r) + lift * 0} r={r * (1 + 0.35 * Math.sin((i / Math.max(1, n - 1)) * Math.PI))} />
      })}
      <rect x={x - w / 2 + r * 0.4} y={base - r} width={w - r * 0.8} height={r} />
    </g>
  )
}
// a cumulus-like heap: bumps along the top of a flat base
function heap(x0, x1, base, h, n = 4) {
  const w = (x1 - x0) / n
  let d = `M${x0} ${base}`
  for (let i = 0; i < n; i++) {
    const a = x0 + i * w, b = a + w, top = base - h * (0.65 + 0.35 * Math.abs(Math.sin(i * 1.7 + 1)))
    d += ` C${a} ${top} ${b} ${top} ${b} ${base}`
  }
  return d + ' Z'
}
const CLOUDS = [
  { id: 'cirrus', name: 'Cirrus', ro: 'Cirrus', alt: ['Cirrus clouds'], roAlt: ['Ciruși', 'Nori cirrus'],
    info: 'Thin wisps of ice crystals 6–12 km up, combed out by the wind; often the first sign of a change in the weather',
    roInfo: 'Fâșii subțiri de cristale de gheață la 6–12 km, pieptănate de vânt; adesea primul semn că se schimbă vremea', badge: [190, 120] },
  { id: 'cirrostratus', name: 'Cirrostratus', ro: 'Cirrostratus', roAlt: ['Cirostratus'],
    info: 'A milky veil of ice high up that makes a ring (halo) around the Sun or the Moon',
    roInfo: 'Un văl lăptos de gheață, sus, care face un inel (halo) în jurul Soarelui sau al Lunii', badge: [520, 110] },
  { id: 'cirrocumulus', name: 'Cirrocumulus', ro: 'Cirrocumulus', roAlt: ['Cirocumulus'],
    info: 'Tiny high ripples in rows, like fish scales: a "mackerel sky"',
    roInfo: 'Valuri mici, sus, așezate în rânduri, ca solzii de pește: „cer cu solzi”', badge: [700, 128] },
  { id: 'altocumulus', name: 'Altocumulus', ro: 'Altocumulus',
    info: 'Rows of grey-white puffs 2–6 km up; on a humid summer morning they can mean storms later',
    roInfo: 'Rânduri de ghemotoace alb-cenușii la 2–6 km; într-o dimineață umedă de vară pot anunța furtuni după-amiază', badge: [190, 360] },
  { id: 'altostratus', name: 'Altostratus', ro: 'Altostratus',
    info: 'A grey sheet in the middle of the sky; the Sun shows through as if through frosted glass',
    roInfo: 'O pânză cenușie la altitudine medie; Soarele se vede prin ea ca printr-un geam mat', badge: [445, 352] },
  { id: 'nimbostratus', name: 'Nimbostratus', ro: 'Nimbostratus',
    info: 'A thick, dark, shapeless layer that brings hours of steady rain or snow',
    roInfo: 'Un strat gros, întunecat și fără formă, care aduce ore întregi de ploaie sau ninsoare continuă', badge: [700, 420] },
  { id: 'cumulonimbus', name: 'Cumulonimbus', ro: 'Cumulonimbus', alt: ['Thundercloud', 'Storm cloud', 'Thunderhead'], roAlt: ['Nor de furtună', 'Nori de furtună'],
    info: 'The towering storm cloud, up to 15 km tall with a flat "anvil" top: thunder, lightning, hail, even tornadoes',
    roInfo: 'Norul-turn de furtună, înalt până la 15 km, cu vârful turtit ca o nicovală: tunete, fulgere, grindină, chiar tornade', badge: [905, 300] },
  { id: 'cumulus', name: 'Cumulus', ro: 'Cumulus', alt: ['Cumulus clouds', 'Fair-weather cumulus'], roAlt: ['Cumuluși', 'Nori cumulus'],
    info: 'Puffy cotton-wool clouds with flat bottoms, typical of sunny afternoons',
    roInfo: 'Nori pufoși ca vata, cu baza dreaptă, tipici după-amiezilor însorite', badge: [445, 495] },
  { id: 'stratocumulus', name: 'Stratocumulus', ro: 'Stratocumulus',
    info: 'Low lumpy grey patches with gaps of blue — the most common clouds on Earth',
    roInfo: 'Pete joase, cenușii și noduroase, cu goluri de cer albastru — cei mai răspândiți nori de pe Pământ', badge: [190, 528] },
  { id: 'stratus', name: 'Stratus', ro: 'Stratus', alt: ['Stratus clouds'], roAlt: ['Nori stratus'],
    info: 'A flat, low grey blanket that can hide hilltops and bring drizzle',
    roInfo: 'O pătură joasă, plată și cenușie, care poate ascunde vârfurile dealurilor și aduce burniță', badge: [300, 600] },
  { id: 'fog', name: 'Fog', ro: 'Ceață', alt: ['Mist'], roAlt: ['Ceata', 'Pâclă'],
    info: 'A cloud sitting on the ground; it counts as fog when you can see less than 1 km',
    roInfo: 'Un nor așezat pe sol; e ceață când vizibilitatea scade sub 1 km', badge: [120, 636] },
]

function drawClouds({ cls }) {
  const L = (id) => `dgq-layer${cls(id)}`
  return (
    <>
      <defs>
        <linearGradient id="dgq-sky3" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0f2142" /><stop offset="0.55" stopColor="#24497a" /><stop offset="1" stopColor="#5f8fbf" /></linearGradient>
        <linearGradient id="dgq-cb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f3f6fb" /><stop offset="0.7" stopColor="#c3cbd8" /><stop offset="1" stopColor="#6c7686" /></linearGradient>
      </defs>
      <rect x="0" y="0" width="1000" height="650" fill="url(#dgq-sky3)" />
      {/* height scale */}
      {[0, 2, 4, 6, 8, 10, 12].map(km => (
        <g key={km}>
          <path d={`M44 ${KM(km)} H1000`} stroke="rgba(255,255,255,0.07)" strokeDasharray={km === 2 || km === 6 ? '0' : '4 8'} />
          <text x="38" y={KM(km) + 5} textAnchor="end" className="dgq-axis-text">{km}</text>
        </g>
      ))}
      <text x="38" y={KM(13) + 6} textAnchor="end" className="dgq-axis-text">km</text>
      <path d={`M44 ${KM(6)} H1000`} stroke="rgba(255,255,255,0.22)" strokeDasharray="10 6" />
      <path d={`M44 ${KM(2)} H1000`} stroke="rgba(255,255,255,0.22)" strokeDasharray="10 6" />
      {/* ground */}
      <path d="M0 650 H1000 V700 H0 Z" fill="#3f5f3a" />
      {[[70, 640], [92, 642], [600, 640], [620, 643]].map(([x, y], i) => <g key={i}><rect x={x - 2} y={y - 12} width="4" height="12" fill="#5b3f2a" /><circle cx={x} cy={y - 16} r="8" fill="#2e6b33" /></g>)}

      {/* high clouds */}
      <g className={`dgq-wisp${cls('cirrus')}`} fill="none" strokeLinecap="round">
        <path d="M90 170 Q160 120 260 110" strokeWidth="6" /><path d="M120 192 Q190 150 300 150" strokeWidth="5" /><path d="M150 140 Q200 105 280 92" strokeWidth="4" /><path d="M95 205 Q150 180 220 182" strokeWidth="3" />
      </g>
      <circle cx="450" cy="150" r="20" fill="#FFE27A" />
      <circle cx="450" cy="150" r="46" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="3" />
      <path d="M340 125 Q450 95 570 120 L570 180 Q450 200 340 175 Z" fill="rgba(235,242,252,0.35)" className={L('cirrostratus')} />
      <g className={L('cirrocumulus')} fill="#e9f0f9">
        {Array.from({ length: 21 }, (_, i) => <path key={i} d={puff(610 + (i % 7) * 28 + (Math.floor(i / 7) % 2) * 14, 160 + Math.floor(i / 7) * 16, 8)} />)}
      </g>
      {/* middle clouds */}
      <g className={L('altocumulus')}>
        {[[115, 400], [170, 395], [225, 402], [280, 396], [140, 428], [195, 424], [250, 430]].map(([x, y], i) => <Blob key={i} x={x} base={y} w={44} h={20} fill="#dfe6ef" />)}
      </g>
      <circle cx="470" cy="385" r="16" fill="rgba(255,226,122,0.55)" />
      <rect x="340" y="370" width="240" height="40" rx="18" fill="rgba(170,182,198,0.78)" className={L('altostratus')} />
      <path d="M610 400 Q620 370 680 372 Q740 360 790 380 Q830 380 830 410 L830 560 Q720 575 610 560 Z" fill="#59616e" className={L('nimbostratus')} />
      <g stroke="#8fb4e6" strokeWidth="2.5" strokeLinecap="round">
        {Array.from({ length: 12 }, (_, i) => <path key={i} d={`M${625 + i * 17} ${572 + (i % 3) * 8} l-6 ${40 + (i % 2) * 12}`} />)}
      </g>
      {/* low clouds */}
      <g className={L('stratocumulus')}>
        <Blob x={140} base={562} w={110} h={30} fill="#aeb8c6" /><Blob x={262} base={564} w={120} h={26} fill="#a3adbc" />
      </g>
      <g className={L('cumulus')}>
        <Blob x={452} base={580} w={150} h={84} fill="#f5f8fc" />
        <circle cx="452" cy="510" r="34" fill="#f5f8fc" />
      </g>
      <rect x="200" y="598" width="220" height="16" rx="8" fill="rgba(190,198,210,0.85)" className={L('stratus')} />
      <rect x="40" y="628" width="180" height="22" rx="11" fill="rgba(230,236,244,0.55)" className={L('fog')} />
      {/* cumulonimbus with its anvil */}
      <g className={L('cumulonimbus')}>
        <path d={`M790 ${KM(11.6)} Q900 ${KM(12.9)} 1000 ${KM(11.8)} L1000 ${KM(11.2)} Q960 ${KM(10.9)} 945 ${KM(9.5)} L885 ${KM(9.5)} Q860 ${KM(10.9)} 790 ${KM(11.1)} Z`} fill="#eef2f8" />
        <path d={`M885 ${KM(9.8)} L945 ${KM(9.8)} Q985 ${KM(7)} 975 ${KM(4)} Q995 ${KM(2.5)} 985 580 L840 580 Q825 ${KM(2.5)} 850 ${KM(4)} Q835 ${KM(7)} 885 ${KM(9.8)} Z`} fill="url(#dgq-cb)" />
        {[[862, 470, 26], [960, 450, 24], [870, 360, 24], [955, 330, 22], [900, 250, 26]].map(([x, y, rr], i) => <circle key={i} cx={x} cy={y} r={rr} fill="#dfe5ee" />)}
      </g>
      <g stroke="#8fb4e6" strokeWidth="2.5" strokeLinecap="round">
        {Array.from({ length: 8 }, (_, i) => <path key={i} d={`M${848 + i * 17} ${592 + (i % 3) * 8} l-6 ${36 + (i % 2) * 10}`} />)}
      </g>
      <path d="M915 588 L903 616 L917 614 L905 646" stroke="#FFE27A" strokeWidth="4" fill="none" strokeLinejoin="round" />
    </>
  )
}

export const EARTH_DIAGRAMS = {
  'volcano': {
    id: 'volcano', icon: '🌋',
    title: t('Anatomy of a Volcano'),
    prompt: t('Name the parts of the volcano'),
    placeholder: t('Type a part of the volcano…'),
    viewBox: [0, 0, 1000, 720],
    items: VOLCANO,
    draw: drawVolcano,
  },
  'water-cycle': {
    id: 'water-cycle', icon: '💧',
    title: t('The Water Cycle'),
    prompt: t('Name the stages of the water cycle'),
    placeholder: t('Type a stage…'),
    viewBox: [0, 0, 1000, 640],
    items: WATER,
    draw: drawWater,
  },
  'plate-boundaries': {
    id: 'plate-boundaries', icon: '↔️',
    title: t('Plate Boundaries'),
    prompt: t('Name the plate boundaries and what forms at each of them'),
    placeholder: t('Type a boundary or a landform…'),
    viewBox: [0, 0, 1000, 640],
    items: BOUNDARIES,
    draw: drawBoundaries,
  },
  'climate-zones': {
    id: 'climate-zones', icon: '🌡️',
    title: t('Climate Zones'),
    prompt: t('Name the climate zones, the parallels that divide them and the poles'),
    placeholder: t('Type a zone, a line or a pole…'),
    viewBox: [0, 0, 1000, 640],
    items: CLIMATE,
    draw: drawClimate,
  },
  'earth-orbit': {
    id: 'earth-orbit', icon: '☀️',
    title: t('The Earth in Space'),
    prompt: t('Name the solstices, equinoxes and other points of the Earth\'s orbit'),
    placeholder: t('Type a point of the orbit…'),
    note: t('Seasons are named for the northern hemisphere. The orbit is drawn in perspective and much more oval than it really is.'),
    viewBox: [0, 0, 1000, 640],
    items: ORBIT,
    draw: drawOrbit,
  },
  'landscape': {
    id: 'landscape', icon: '⛰️',
    title: t('Landforms'),
    prompt: t('Name the landforms in this landscape'),
    placeholder: t('Type a landform…'),
    viewBox: [0, 0, 1000, 640],
    items: LANDSCAPE,
    draw: drawLandscape,
  },
  'clouds': {
    id: 'clouds', icon: '☁️',
    title: t('Types of Clouds'),
    prompt: t('Name the clouds by their shape and height'),
    placeholder: t('Type a cloud…'),
    note: t('High clouds are above about 6 km, middle clouds between 2 and 6 km, low clouds below 2 km.'),
    viewBox: [0, 0, 1000, 700],
    items: CLOUDS,
    draw: drawClouds,
  },
}
