/**
 * Space drawings for DiagramQuiz (see diagramQuizzes.jsx for the item format):
 * the Solar System, the phases of the Moon, eclipses and the inside of the Sun.
 */
import { t } from '../i18n'

const Arrow = () => (
  <marker id="dgq-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
    <path d="M0 0 L10 5 L0 10 z" className="dgq-arrowhead" />
  </marker>
)
const Stars = ({ n = 60, w = 1000, h = 640 }) => (
  <g>{Array.from({ length: n }, (_, i) => <circle key={i} cx={(i * 263 + 37) % w} cy={(i * 151 + 11) % h} r={i % 4 ? 1.1 : 1.9} fill="rgba(255,255,255,0.45)" />)}</g>
)

// ── The Solar System ────────────────────────────────────────────────────────
// Sizes and distances are not to scale (with the Sun this size, Neptune would be about a kilometre away)
const SY = 230
const P = {
  mercury: [165, 6], venus: [205, 11], earth: [250, 12], mars: [298, 8],
  jupiter: [440, 50], saturn: [590, 40], uranus: [715, 25], neptune: [810, 24], pluto: [905, 5],
}
const above = (id, d = 26) => [P[id][0], SY - P[id][1] - d]
const below = (id, d = 26) => [P[id][0], SY + P[id][1] + d]
const SOLAR = [
  { id: 'sun', name: 'Sun', ro: 'Soarele', alt: ['The Sun'], roAlt: ['Soare'],
    info: 'A star holding 99.8% of the Solar System\'s mass; 109 Earths would fit across it',
    roInfo: 'O stea cu 99,8% din masa Sistemului Solar; 109 Pământuri ar încăpea de-a latul ei', badge: [55, SY] },
  { id: 'mercury', name: 'Mercury', ro: 'Mercur', roAlt: ['Mercurul'],
    info: 'The smallest planet and the closest to the Sun; a year there lasts 88 days',
    roInfo: 'Cea mai mică planetă și cea mai apropiată de Soare; un an acolo durează 88 de zile', badge: above('mercury') },
  { id: 'venus', name: 'Venus', ro: 'Venus',
    info: 'The hottest planet (about 465 °C) under thick clouds; it spins backwards',
    roInfo: 'Cea mai fierbinte planetă (circa 465 °C), sub nori groși; se rotește invers', badge: below('venus') },
  { id: 'earth', name: 'Earth', ro: 'Pământ', alt: ['The Earth'], roAlt: ['Pământul', 'Terra', 'Pamant'],
    info: 'The only place we know of with life, and the densest planet',
    roInfo: 'Singurul loc cunoscut cu viață și cea mai densă planetă', badge: above('earth') },
  { id: 'moon', name: 'Moon', ro: 'Luna', alt: ['The Moon'], roAlt: ['Lună'],
    info: 'Earth\'s only natural satellite, about 384,400 km away',
    roInfo: 'Singurul satelit natural al Pământului, la circa 384.400 km', badge: [262, SY + 44], leader: [266, SY + 14] },
  { id: 'mars', name: 'Mars', ro: 'Marte', roAlt: ['Marte'],
    info: 'The red planet: rust (iron oxide) in its dust; home of Olympus Mons, the tallest volcano known',
    roInfo: 'Planeta roșie: rugina (oxid de fier) din praf; aici e Olympus Mons, cel mai înalt vulcan cunoscut', badge: above('mars') },
  { id: 'asteroid-belt', name: 'Asteroid belt', ro: 'Centura de asteroizi', alt: ['Main belt', 'Asteroids'], roAlt: ['Centura asteroizilor', 'Asteroizi', 'Centura principală'],
    info: 'Millions of rocks between Mars and Jupiter; Ceres, the largest, is a dwarf planet',
    roInfo: 'Milioane de roci între Marte și Jupiter; Ceres, cea mai mare, e planetă pitică', badge: [352, SY + 70] },
  { id: 'jupiter', name: 'Jupiter', ro: 'Jupiter',
    info: 'The largest planet, over twice as massive as all the others combined; its Great Red Spot is a storm bigger than Earth',
    roInfo: 'Cea mai mare planetă, de peste două ori mai masivă decât toate celelalte la un loc; Marea Pată Roșie e o furtună mai mare decât Pământul', badge: above('jupiter') },
  { id: 'saturn', name: 'Saturn', ro: 'Saturn',
    info: 'Famous for its rings of ice and rock; it is so light it would float in a big enough bathtub',
    roInfo: 'Celebră pentru inelele de gheață și rocă; e atât de ușoară încât ar pluti într-o cadă destul de mare', badge: below('saturn', 34) },
  { id: 'uranus', name: 'Uranus', ro: 'Uranus',
    info: 'An ice giant tipped on its side (98°), so each pole gets 42 years of sunlight, then 42 of darkness',
    roInfo: 'Un gigant de gheață culcat pe o parte (98°): fiecare pol are 42 de ani de lumină, apoi 42 de întuneric', badge: above('uranus', 34) },
  { id: 'neptune', name: 'Neptune', ro: 'Neptun', roAlt: ['Neptunul'],
    info: 'The farthest planet, with the fastest winds (over 2,000 km/h); found by maths before anyone saw it, in 1846',
    roInfo: 'Cea mai îndepărtată planetă, cu cele mai rapide vânturi (peste 2.000 km/h); găsită prin calcul înainte de a fi văzută, în 1846', badge: below('neptune') },
  { id: 'kuiper-belt', name: 'Kuiper belt', ro: 'Centura Kuiper', alt: ['Kuiper'], roAlt: ['Kuiper', 'Centura lui Kuiper'],
    info: 'A huge ring of icy bodies beyond Neptune, where many comets come from',
    roInfo: 'Un inel uriaș de corpuri înghețate dincolo de Neptun, de unde vin multe comete', badge: [935, SY + 80] },
  { id: 'pluto', name: 'Pluto', ro: 'Pluto', roAlt: ['Plutonul'],
    info: 'A dwarf planet since 2006; New Horizons flew past in 2015 and found a giant heart-shaped plain',
    roInfo: 'Planetă pitică din 2006; New Horizons a trecut pe lângă ea în 2015 și a găsit o câmpie uriașă în formă de inimă', badge: above('pluto') },
]

function drawSolar({ cls }) {
  const L = (id) => `dgq-layer${cls(id)}`
  const ball = (id, fill) => <circle cx={P[id][0]} cy={SY} r={P[id][1]} fill={fill} className={L(id)} />
  // deterministic scatter for the belts
  const dots = (x0, x1, n, spread, seed) => Array.from({ length: n }, (_, i) => {
    const a = Math.sin(i * 12.9898 + seed) * 43758.5453, b = Math.sin(i * 78.233 + seed) * 12345.678
    return [x0 + (a - Math.floor(a)) * (x1 - x0), SY + ((b - Math.floor(b)) - 0.5) * spread]
  })
  return (
    <>
      <defs>
        <radialGradient id="sp-sun" cx="0.75" cy="0.5" r="0.8"><stop offset="0" stopColor="#FFF3B0" /><stop offset="0.55" stopColor="#FFC93C" /><stop offset="1" stopColor="#FF8A1F" /></radialGradient>
        <radialGradient id="sp-shade" cx="0.3" cy="0.5" r="0.7"><stop offset="0.5" stopColor="rgba(0,0,0,0)" /><stop offset="1" stopColor="rgba(0,0,0,0.45)" /></radialGradient>
        <clipPath id="sp-jup"><circle cx={P.jupiter[0]} cy={SY} r={P.jupiter[1]} /></clipPath>
      </defs>
      <Stars n={70} h={460} />
      <circle cx="-190" cy={SY} r="300" fill="url(#sp-sun)" className={L('sun')} />
      <g className={L('asteroid-belt')}>{dots(335, 372, 70, 150, 1).map(([x, y], i) => <circle key={i} cx={x} cy={y} r={i % 5 ? 1.4 : 2.4} fill="#a99b8a" />)}</g>
      <g className={L('kuiper-belt')}>{dots(870, 995, 90, 190, 7).map(([x, y], i) => <circle key={i} cx={x} cy={y} r={i % 6 ? 1.3 : 2.2} fill="#9fc3d9" />)}</g>
      {ball('mercury', '#9e9a96')}
      {ball('venus', '#e8c98a')}
      {ball('earth', '#2F7FD8')}
      <path d={`M${P.earth[0] - 7} ${SY - 4} q4 -6 9 -3 q3 4 -2 8 z`} fill="#4caf50" />
      <circle cx={266} cy={SY + 14} r="3.2" fill="#ddd" className={L('moon')} />
      {ball('mars', '#d1603d')}
      {ball('jupiter', '#d9b38c')}
      <g clipPath="url(#sp-jup)">
        {[-34, -18, -4, 12, 28].map((dy, i) => <rect key={i} x={P.jupiter[0] - 52} y={SY + dy} width="104" height={i % 2 ? 7 : 10} fill={i % 2 ? '#b07d56' : '#c4936b'} opacity="0.85" />)}
        <ellipse cx={P.jupiter[0] + 16} cy={SY + 20} rx="10" ry="6" fill="#c2553a" />
      </g>
      <ellipse cx={P.saturn[0]} cy={SY} rx="78" ry="18" fill="none" stroke="#d8c08a" strokeWidth="9" opacity="0.85" transform={`rotate(-14 ${P.saturn[0]} ${SY})`} />
      {ball('saturn', '#e3cc8f')}
      <path d={`M${P.saturn[0] - 78} ${SY} A78 18 0 0 0 ${P.saturn[0] + 78} ${SY}`} fill="none" stroke="#d8c08a" strokeWidth="9" opacity="0.95" transform={`rotate(-14 ${P.saturn[0]} ${SY})`} />
      <ellipse cx={P.uranus[0]} cy={SY} rx="9" ry="40" fill="none" stroke="#bfe9ef" strokeWidth="2.5" opacity="0.7" />
      {ball('uranus', '#9fdde6')}
      {ball('neptune', '#3d63d6')}
      {ball('pluto', '#cdb59a')}
      {Object.entries(P).filter(([id]) => id !== 'pluto').map(([id, [x, r]]) => <circle key={id} cx={x} cy={SY} r={r} fill="url(#sp-shade)" pointerEvents="none" />)}
    </>
  )
}

// ── Phases of the Moon ──────────────────────────────────────────────────────
// Orbit seen from above the North Pole, sunlight from the left. Inner ring: the Moon on its
// orbit (always half lit); outer ring: what it looks like from the northern hemisphere.
const MX = 520, MY = 350, MR = 190, MO = 292
const mpt = (r, deg) => [+(MX + r * Math.cos(deg * Math.PI / 180)).toFixed(1), +(MY - r * Math.sin(deg * Math.PI / 180)).toFixed(1)]
// orbital position (screen angle) and age (0 new … 180 full … 360)
const PHASES = [
  ['new-moon', 180, 0], ['waxing-crescent', 225, 45], ['first-quarter', 270, 90], ['waxing-gibbous', 315, 135],
  ['full-moon', 0, 180], ['waning-gibbous', 45, 225], ['last-quarter', 90, 270], ['waning-crescent', 135, 315],
]
const PHASE_INFO = {
  'new-moon': ['New moon', 'Lună nouă', ['New Moon'], ['Luna nouă', 'Luna noua', 'Lună nouă'], 'Between the Earth and the Sun, its lit side faces away: we can\'t see it. Solar eclipses happen only now', 'Între Pământ și Soare, cu fața luminată în partea cealaltă: nu o vedem. Eclipsele de Soare au loc doar acum'],
  'waxing-crescent': ['Waxing crescent', 'Crai nou', ['Crescent', 'Waxing Crescent', 'New crescent'], ['Lună în creștere', 'Semilună în creștere', 'Seceră'], 'A thin lit sliver on the right, seen low in the west after sunset', 'O seceră subțire luminată în dreapta, văzută jos, la apus, după asfințit'],
  'first-quarter': ['First quarter', 'Primul pătrar', ['First Quarter', 'Half moon'], ['Primul patrar', 'Pătrarul întâi', 'Jumătate de lună'], 'The right half is lit; the Moon is a quarter of the way round its orbit', 'Jumătatea dreaptă e luminată; Luna a parcurs un sfert din orbită'],
  'waxing-gibbous': ['Waxing gibbous', 'Lună gibboasă în creștere', ['Waxing Gibbous', 'Gibbous'], ['Gibboasă în creștere', 'Gibbosa in crestere', 'Lună gibboasă'], 'More than half lit and growing, a few days before full moon', 'Mai mult de jumătate luminată și în creștere, cu câteva zile înainte de Luna plină'],
  'full-moon': ['Full moon', 'Lună plină', ['Full Moon'], ['Luna plină', 'Luna plina'], 'On the far side of the Earth from the Sun, fully lit; it rises at sunset. Lunar eclipses happen only now', 'În partea opusă Soarelui, complet luminată; răsare la apus. Eclipsele de Lună au loc doar acum'],
  'waning-gibbous': ['Waning gibbous', 'Lună gibboasă în descreștere', ['Waning Gibbous'], ['Gibboasă în descreștere', 'Gibbosa in descrestere'], 'Still more than half lit, but shrinking from the right', 'Încă mai mult de jumătate luminată, dar scade din dreapta'],
  'last-quarter': ['Last quarter', 'Ultimul pătrar', ['Third quarter', 'Last Quarter'], ['Ultimul patrar', 'Pătrarul al doilea', 'Al treilea pătrar'], 'The left half is lit; it rises around midnight and is seen in the morning', 'Jumătatea stângă e luminată; răsare pe la miezul nopții și se vede dimineața'],
  'waning-crescent': ['Waning crescent', 'Lună veche', ['Old moon', 'Waning Crescent', 'Old crescent'], ['Lună în descreștere', 'Semilună în descreștere', 'Seceră în descreștere', 'Luna veche'], 'A thin sliver on the left, seen low in the east just before sunrise', 'O seceră subțire în stânga, văzută jos, la răsărit, chiar înainte de zori'],
}
const MOON_PHASES = [
  ...PHASES.map(([id, deg]) => {
    const [name, ro, alt, roAlt, info, roInfo] = PHASE_INFO[id]
    return { id, name, ro, alt, roAlt, info, roInfo, badge: mpt(242, deg) }
  }),
  { id: 'sunlight', name: 'Sunlight', ro: 'Lumina Soarelui', alt: ['Sun', 'Light from the Sun', 'Sun rays'], roAlt: ['Soarele', 'Soare', 'Razele Soarelui', 'Lumina solara'],
    info: 'The Moon makes no light of its own; it only reflects sunlight, so half of it is always lit',
    roInfo: 'Luna nu are lumină proprie; doar reflectă lumina Soarelui, așa că jumătate din ea e mereu luminată', badge: [60, 120] },
]
/** The Moon as seen from Earth at a given age (0 new … 180 full … 360). */
function phaseShape(cx, cy, r, age) {
  const rx = +(r * Math.abs(Math.cos(age * Math.PI / 180))).toFixed(2)
  const waxing = age < 180
  const crescent = age < 90 || age > 270
  const outer = waxing ? 1 : 0
  const inner = waxing ? (crescent ? 0 : 1) : (crescent ? 1 : 0)
  return `M${cx} ${cy - r} A${r} ${r} 0 0 ${outer} ${cx} ${cy + r} A${rx} ${r} 0 0 ${inner} ${cx} ${cy - r} Z`
}
function drawPhases({ cls }) {
  return (
    <>
      <defs><Arrow /></defs>
      <Stars n={60} h={700} />
      {[150, 260, 370, 480, 590].map(y => <path key={y} d={`M10 ${y} L120 ${y}`} className={`dgq-arrow dgq-sunray${cls('sunlight')}`} markerEnd="url(#dgq-arrow)" />)}
      <circle cx={MX} cy={MY} r={MR} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="2" strokeDasharray="6 6" />
      <circle cx={MX} cy={MY} r="42" fill="#2F7FD8" />
      <path d={`M${MX} ${MY - 42} A42 42 0 0 1 ${MX} ${MY + 42} Z`} fill="rgba(0,0,0,0.55)" />
      <path d={`M${MX - 12} ${MY - 14} q10 -12 22 -4 q4 10 -8 16 z M${MX - 20} ${MY + 12} q12 2 14 14 q-12 2 -14 -14 z`} fill="#4caf50" opacity="0.85" />
      {PHASES.map(([id, deg, age]) => {
        const [x, y] = mpt(MR, deg), [ox, oy] = mpt(MO, deg)
        return (
          <g key={id}>
            <circle cx={x} cy={y} r="18" fill="#2a2f3a" />
            <path d={`M${x} ${y - 18} A18 18 0 0 0 ${x} ${y + 18} Z`} fill="#e9e4d8" />
            <g className={`dgq-moon${cls(id)}`}>
              <circle cx={ox} cy={oy} r="30" fill="#2a2f3a" />
              <path d={phaseShape(ox, oy, 30, age)} fill="#f1ecdf" />
              <circle cx={ox} cy={oy} r="30" fill="none" className="dgq-moon-ring" />
            </g>
          </g>
        )
      })}
      <path d={`M${MX + MR * 0.72} ${MY + MR * 0.72} A${MR} ${MR} 0 0 0 ${MX + MR} ${MY + 8}`} fill="none" className="dgq-arrow" markerEnd="url(#dgq-arrow)" transform={`rotate(0 ${MX} ${MY})`} />
    </>
  )
}

// ── Eclipses ────────────────────────────────────────────────────────────────
const ECLIPSES = [
  { id: 'solar-eclipse', name: 'Solar eclipse', ro: 'Eclipsă de Soare', alt: ['Eclipse of the Sun', 'Total solar eclipse'], roAlt: ['Eclipsa de Soare', 'Eclipsă solară', 'Eclipsa solara', 'Eclipsă totală de Soare'],
    info: 'The Moon passes between the Sun and the Earth and blocks the Sun; a total eclipse lasts at most about 7 minutes',
    roInfo: 'Luna trece între Soare și Pământ și acoperă Soarele; o eclipsă totală durează cel mult circa 7 minute', badge: [40, 38] },
  { id: 'umbra', name: 'Umbra', ro: 'Umbra', alt: ['Full shadow', 'Shadow'], roAlt: ['Conul de umbră', 'Umbră', 'Umbra totală'],
    info: 'The dark inner part of the shadow, where the Sun is completely hidden',
    roInfo: 'Partea interioară, întunecată, a umbrei, unde Soarele e acoperit complet', badge: [640, 132] },
  { id: 'penumbra', name: 'Penumbra', ro: 'Penumbra', alt: ['Partial shadow'], roAlt: ['Penumbră', 'Semiumbra', 'Semiumbră'],
    info: 'The lighter outer shadow: from there you see only a partial eclipse',
    roInfo: 'Umbra exterioară, mai slabă: de acolo vezi doar o eclipsă parțială', badge: [640, 64] },
  { id: 'totality', name: 'Path of totality', ro: 'Zona de totalitate', alt: ['Totality', 'Path of total eclipse'], roAlt: ['Totalitate', 'Banda de totalitate', 'Zona totalității'],
    info: 'The narrow strip of Earth, rarely over 250 km wide, where the eclipse is total',
    roInfo: 'Fâșia îngustă de pe Pământ, rar mai lată de 250 km, unde eclipsa e totală', badge: [880, 104], leader: [848, 150] },
  { id: 'corona', name: 'Corona', ro: 'Coroana solară', alt: ['Solar corona'], roAlt: ['Coroana', 'Corona'],
    info: 'The Sun\'s glowing outer atmosphere, which you can only see with the naked eye during totality',
    roInfo: 'Atmosfera exterioară strălucitoare a Soarelui, vizibilă cu ochiul liber doar în timpul totalității', badge: [930, 230] },
  { id: 'moon-solar', name: 'Moon', ro: 'Luna', alt: ['The Moon', 'New moon'], roAlt: ['Lună', 'Lună nouă'],
    info: 'It is 400 times smaller than the Sun but also about 400 times closer, so it can cover it exactly',
    roInfo: 'E de 400 de ori mai mică decât Soarele, dar și de circa 400 de ori mai aproape, așa că îl poate acoperi exact', badge: [470, 108] },
  { id: 'lunar-eclipse', name: 'Lunar eclipse', ro: 'Eclipsă de Lună', alt: ['Eclipse of the Moon', 'Total lunar eclipse'], roAlt: ['Eclipsa de Lună', 'Eclipsă lunară', 'Eclipsa lunara', 'Eclipsă totală de Lună'],
    info: 'The Earth passes between the Sun and the Moon and its shadow falls on the Moon; visible from the whole night side',
    roInfo: 'Pământul trece între Soare și Lună, iar umbra lui cade pe Lună; se vede de pe toată fața de noapte a Pământului', badge: [40, 358] },
  { id: 'earth-lunar', name: 'Earth', ro: 'Pământul', alt: ['The Earth'], roAlt: ['Pământ', 'Terra', 'Pamantul'],
    info: 'At about 12,700 km across, the Earth casts a shadow cone around 1.4 million km long',
    roInfo: 'Cu un diametru de circa 12.700 km, Pământul aruncă un con de umbră lung de circa 1,4 milioane de km', badge: [520, 420] },
  { id: 'blood-moon', name: 'Blood moon', ro: 'Lună sângerie', alt: ['Blood Moon', 'Red moon', 'Red Moon'], roAlt: ['Luna sângerie', 'Lună roșie', 'Luna rosie', 'Luna sangerie'],
    info: 'In a total lunar eclipse the Moon turns red, lit only by sunlight bent through Earth\'s atmosphere — every sunset at once',
    roInfo: 'La o eclipsă totală de Lună, Luna devine roșie, luminată doar de lumina Soarelui curbată prin atmosfera Pământului — toate apusurile deodată', badge: [860, 424] },
]

function drawEclipses({ cls }) {
  const L = (id) => `dgq-layer${cls(id)}`
  return (
    <>
      <defs>
        <radialGradient id="sp-sun2" cx="0.7" cy="0.5" r="0.8"><stop offset="0" stopColor="#FFF3B0" /><stop offset="0.6" stopColor="#FFC93C" /><stop offset="1" stopColor="#FF8A1F" /></radialGradient>
        <radialGradient id="sp-corona"><stop offset="0.45" stopColor="rgba(255,255,255,0.95)" /><stop offset="0.6" stopColor="rgba(200,220,255,0.55)" /><stop offset="1" stopColor="rgba(200,220,255,0)" /></radialGradient>
        <clipPath id="sp-top"><rect x="10" y="10" width="980" height="300" rx="16" /></clipPath>
        <clipPath id="sp-bot"><rect x="10" y="330" width="980" height="300" rx="16" /></clipPath>
      </defs>
      <rect x="10" y="10" width="980" height="300" rx="16" fill="#0f1a2e" />
      <rect x="10" y="330" width="980" height="300" rx="16" fill="#0f1a2e" />
      {/* solar eclipse: Sun · Moon · Earth */}
      <g clipPath="url(#sp-top)">
        <Stars n={30} h={300} />
        <circle cx="-30" cy="160" r="150" fill="url(#sp-sun2)" />
        <path d="M470 140 L850 30 L850 290 L470 180 Z" fill="rgba(110,130,170,0.35)" className={L('penumbra')} />
        <path d="M470 146 L848 156 L848 164 L470 174 Z" fill="rgba(5,8,15,0.85)" className={L('umbra')} />
        <circle cx="470" cy="160" r="16" fill="#55575e" className={L('moon-solar')} />
        <circle cx="930" cy="160" r="85" fill="#2F7FD8" />
        <path d="M930 75 A85 85 0 0 1 930 245 Z" fill="rgba(0,0,0,0.5)" />
        <ellipse cx="848" cy="160" rx="4" ry="9" fill="#05080f" className={L('totality')} />
        {/* inset: what you see from inside the umbra */}
        <circle cx="930" cy="160" r="0" />
      </g>
      <g className={`dgq-inset${cls('corona')}`}>
        <rect x="826" y="196" width="150" height="104" rx="12" fill="#05080f" stroke="rgba(255,255,255,0.18)" />
        <circle cx="901" cy="248" r="44" fill="url(#sp-corona)" />
        <circle cx="901" cy="248" r="21" fill="#05080f" />
      </g>
      {/* lunar eclipse: Sun · Earth · Moon */}
      <g clipPath="url(#sp-bot)">
        <Stars n={30} h={300} />
        <circle cx="-30" cy="480" r="150" fill="url(#sp-sun2)" />
        <path d="M520 430 L990 360 L990 600 L520 530 Z" fill="rgba(110,130,170,0.25)" />
        <path d="M520 432 L990 465 L990 495 L520 528 Z" fill="rgba(5,8,15,0.8)" />
        <circle cx="520" cy="480" r="50" fill="#2F7FD8" className={L('earth-lunar')} />
        <path d="M520 430 A50 50 0 0 1 520 530 Z" fill="rgba(0,0,0,0.5)" />
        <circle cx="860" cy="480" r="24" fill="#b5462e" className={L('blood-moon')} />
      </g>
      <rect x="10" y="10" width="980" height="300" rx="16" fill="none" stroke="rgba(255,255,255,0.14)" />
      <rect x="10" y="330" width="980" height="300" rx="16" fill="none" stroke="rgba(255,255,255,0.14)" />
    </>
  )
}

// ── Inside the Sun ──────────────────────────────────────────────────────────
const SX = 500, SYc = 600
const spt = (r, deg) => [+(SX + r * Math.cos(deg * Math.PI / 180)).toFixed(1), +(SYc - r * Math.sin(deg * Math.PI / 180)).toFixed(1)]
function ringS(r0, r1, a0 = 0, a1 = 180) {
  const [x0, y0] = spt(r1, a0), [x1, y1] = spt(r1, a1), [x2, y2] = spt(r0, a1), [x3, y3] = spt(r0, a0)
  if (r0 <= 0) return `M${SX} ${SYc} L${x0} ${y0} A${r1} ${r1} 0 0 0 ${x1} ${y1} Z`
  return `M${x0} ${y0} A${r1} ${r1} 0 0 0 ${x1} ${y1} L${x2} ${y2} A${r0} ${r0} 0 0 1 ${x3} ${y3} Z`
}
const SUN_PARTS = [
  { id: 'sun-core', name: 'Core', ro: 'Nucleul', alt: ['Sun\'s core', 'Solar core'], roAlt: ['Nucleu', 'Miezul', 'Nucleul solar'],
    info: 'About 15 million °C: hydrogen fuses into helium here, turning 4 million tonnes of matter into energy every second',
    roInfo: 'Circa 15 milioane °C: aici hidrogenul fuzionează în heliu, transformând 4 milioane de tone de materie în energie în fiecare secundă', badge: spt(55, 120) },
  { id: 'radiative', name: 'Radiative zone', ro: 'Zona radiativă', alt: ['Radiation zone', 'Radiative'], roAlt: ['Zona de radiație', 'Zona radiativa', 'Radiativă'],
    info: 'Light bounces from atom to atom so many times that it takes over 100,000 years to cross',
    roInfo: 'Lumina sare din atom în atom de atâtea ori încât îi trebuie peste 100.000 de ani să o traverseze', badge: spt(180, 140) },
  { id: 'convective', name: 'Convective zone', ro: 'Zona convectivă', alt: ['Convection zone', 'Convective'], roAlt: ['Zona de convecție', 'Zona convectiva', 'Convectivă'],
    info: 'Hot gas rises, cools at the top and sinks again, like boiling soup',
    roInfo: 'Gazul fierbinte urcă, se răcește sus și coboară din nou, ca o supă care fierbe', badge: spt(318, 128) },
  { id: 'photosphere', name: 'Photosphere', ro: 'Fotosfera', alt: ['Surface', 'Visible surface'], roAlt: ['Fotosferă', 'Suprafața', 'Suprafața vizibilă'],
    info: 'The visible "surface", about 5,500 °C; all the sunlight we see comes from here',
    roInfo: '„Suprafața” vizibilă, de circa 5.500 °C; de aici vine toată lumina pe care o vedem', badge: [90, 545], leader: spt(377, 168) },
  { id: 'chromosphere', name: 'Chromosphere', ro: 'Cromosfera', roAlt: ['Cromosferă'],
    info: 'A thin reddish layer above the photosphere, seen as a pink rim during a total eclipse',
    roInfo: 'Un strat subțire, roșiatic, deasupra fotosferei, văzut ca o margine roz în timpul unei eclipse totale', badge: [120, 360], leader: spt(392, 145) },
  { id: 'sun-corona', name: 'Corona', ro: 'Coroana', alt: ['Solar corona'], roAlt: ['Coroana solară', 'Corona'],
    info: 'The outer atmosphere, strangely over a million °C — far hotter than the surface below it',
    roInfo: 'Atmosfera exterioară, ciudat de fierbinte, peste un milion °C — mult mai caldă decât suprafața de sub ea', badge: spt(470, 128) },
  { id: 'sunspot', name: 'Sunspot', ro: 'Pată solară', alt: ['Sunspots'], roAlt: ['Pete solare', 'Pata solară', 'Pata solara'],
    info: 'Cooler, darker patches where magnetic fields block the heat; they come and go in an 11-year cycle',
    roInfo: 'Zone mai reci și mai întunecate unde câmpurile magnetice blochează căldura; vin și pleacă într-un ciclu de 11 ani', badge: spt(345, 72), leader: spt(374, 74) },
  { id: 'prominence', name: 'Prominence', ro: 'Protuberanță', alt: ['Solar prominence', 'Filament'], roAlt: ['Protuberanța', 'Protuberanță solară', 'Protuberanta'],
    info: 'A huge loop of glowing gas held up by magnetic fields, often many times the size of Earth',
    roInfo: 'O buclă uriașă de gaz incandescent ținută de câmpurile magnetice, adesea de multe ori cât Pământul', badge: spt(500, 98) },
  { id: 'flare', name: 'Solar flare', ro: 'Erupție solară', alt: ['Flare', 'Coronal mass ejection', 'CME'], roAlt: ['Erupția solară', 'Erupție', 'Ejecție de masă coronală', 'Eruptie solara'],
    info: 'A sudden explosion of energy; the biggest can knock out satellites and power grids on Earth',
    roInfo: 'O explozie bruscă de energie; cele mai mari pot strica sateliți și rețele electrice pe Pământ', badge: spt(470, 42) },
  { id: 'solar-wind', name: 'Solar wind', ro: 'Vânt solar', alt: ['Wind'], roAlt: ['Vântul solar', 'Vant solar'],
    info: 'A constant stream of particles blowing out at around 400 km/s; it makes the auroras and comet tails',
    roInfo: 'Un flux continuu de particule care suflă cu circa 400 km/s; el produce aurorele și cozile cometelor', badge: [930, 410] },
]

function drawSun({ cls }) {
  const L = (id) => `dgq-layer${cls(id)}`
  const loops = Array.from({ length: 9 }, (_, i) => 10 + i * 20)
  return (
    <>
      <defs>
        <Arrow />
        <radialGradient id="sp-corona2" cx={SX} cy={SYc} r="560" gradientUnits="userSpaceOnUse"><stop offset="0.68" stopColor="rgba(255,190,90,0.45)" /><stop offset="1" stopColor="rgba(255,190,90,0)" /></radialGradient>
        <radialGradient id="sp-core" cx={SX} cy={SYc} r="110" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#FFFDE7" /><stop offset="1" stopColor="#FFE066" /></radialGradient>
      </defs>
      <Stars n={50} h={600} />
      <path d={ringS(400, 560)} fill="url(#sp-corona2)" className={L('sun-corona')} />
      <path d={ringS(385, 400)} fill="#ff6b6b" opacity="0.85" className={L('chromosphere')} />
      <path d={ringS(370, 385)} fill="#ffb238" className={L('photosphere')} />
      <path d={ringS(260, 370)} fill="#ff9a2e" className={L('convective')} />
      <g fill="none" stroke="rgba(160,60,0,0.45)" strokeWidth="3">
        {loops.map(a => { const [x0, y0] = spt(275, a), [x1, y1] = spt(355, a + 4), [x2, y2] = spt(275, a + 9); return <path key={a} d={`M${x0} ${y0} Q${x1} ${y1} ${x2} ${y2}`} /> })}
      </g>
      <path d={ringS(110, 260)} fill="#ffc94a" className={L('radiative')} />
      <g stroke="rgba(170,90,0,0.35)" strokeWidth="2" fill="none">
        {[130, 150, 170].map(a => { const [x0, y0] = spt(120, a), [x1, y1] = spt(250, a); return <path key={a} d={`M${x0} ${y0} L${(x0 + x1) / 2 + 8} ${(y0 + y1) / 2 - 6} L${x1} ${y1}`} /> })}
      </g>
      <path d={ringS(0, 110)} fill="url(#sp-core)" className={L('sun-core')} />
      {/* sunspot, prominence, flare */}
      {(() => { const [x, y] = spt(374, 74); return <ellipse cx={x} cy={y} rx="11" ry="6" fill="#4a2a10" transform={`rotate(-16 ${x} ${y})`} className={L('sunspot')} /> })()}
      {(() => { const [x0, y0] = spt(400, 92), [x1, y1] = spt(520, 98), [x2, y2] = spt(400, 104); return <path d={`M${x0} ${y0} Q${x1} ${y1} ${x2} ${y2}`} fill="none" stroke="#ff5d3a" strokeWidth="12" strokeLinecap="round" className={`dgq-river${cls('prominence')}`} /> })()}
      {(() => { const [x, y] = spt(410, 40); return <path d={`M${x} ${y} l20 -34 l6 22 l26 -30 l-10 40 l18 -6 l-34 34 z`} fill="#fff1a6" className={L('flare')} transform={`rotate(-20 ${x} ${y})`} /> })()}
      {[380, 430, 480].map(y => <path key={y} d={`M820 ${y} L990 ${y - 30}`} className={`dgq-arrow${cls('solar-wind')}`} markerEnd="url(#dgq-arrow)" />)}
      <line x1="0" y1={SYc} x2="1000" y2={SYc} className="dgq-base" />
    </>
  )
}

// ── The northern night sky ───────────────────────────────────────────────────
// A round star chart centred on the North Star, as you see it looking up and facing north:
// declination +90° in the middle down to −35° at the rim, right ascension going clockwise.
const KX = 500, KY = 500, KR = 470, DEC_MIN = -35
function sky(ra, dec) {
  const r = (90 - dec) / (90 - DEC_MIN) * KR
  const a = (ra - 6) * 15 * Math.PI / 180
  return [+(KX - r * Math.sin(a)).toFixed(1), +(KY + r * Math.cos(a)).toFixed(1)]
}
// stars: [ra (h), dec (°), magnitude-ish size]; lines: index pairs
const CONST = {
  'ursa-minor': { stars: [[2.53, 89.26, 3], [17.54, 86.59, 1.5], [16.77, 82.04, 1.5], [15.73, 77.79, 1.5], [14.85, 74.16, 2.4], [15.35, 71.83, 2], [16.29, 75.76, 1.4]], lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 3]] },
  'ursa-major': { stars: [[11.06, 61.75, 2.6], [11.03, 56.38, 2.3], [11.90, 53.69, 2.3], [12.26, 57.03, 1.8], [12.90, 55.96, 2.6], [13.40, 54.93, 2.4], [13.79, 49.31, 2.4]], lines: [[0, 1], [1, 2], [2, 3], [3, 0], [3, 4], [4, 5], [5, 6]] },
  'cassiopeia': { stars: [[0.15, 59.15, 2.3], [0.68, 56.54, 2.5], [0.95, 60.72, 2.5], [1.43, 60.24, 2.2], [1.91, 63.67, 1.9]], lines: [[0, 1], [1, 2], [2, 3], [3, 4]] },
  'cepheus': { stars: [[21.31, 62.59, 2.3], [21.48, 70.56, 1.9], [23.66, 77.63, 2], [22.83, 66.20, 1.6], [22.18, 58.20, 1.6]], lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0], [1, 3]] },
  'cygnus': { stars: [[20.69, 45.28, 2.7], [20.37, 40.26, 2.3], [19.51, 27.96, 2], [19.75, 45.13, 1.9], [20.77, 33.97, 2.1]], lines: [[0, 1], [1, 2], [3, 1], [1, 4]] },
  'lyra': { stars: [[18.62, 38.78, 3.2], [18.75, 37.61, 1.4], [18.91, 36.90, 1.3], [18.98, 32.69, 1.7], [18.83, 33.36, 1.6]], lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 1]] },
  'aquila': { stars: [[19.85, 8.87, 2.9], [19.77, 10.61, 1.9], [19.92, 6.41, 1.6], [19.42, 3.11, 1.6], [19.09, 13.86, 1.8], [19.10, -4.88, 1.6]], lines: [[1, 0], [0, 2], [0, 3], [3, 5], [3, 4]] },
  'orion': { stars: [[5.92, 7.41, 3], [5.42, 6.35, 2.4], [5.68, -1.94, 2.2], [5.60, -1.20, 2.3], [5.53, -0.30, 2.1], [5.80, -9.67, 2.1], [5.24, -8.20, 3], [5.59, 9.93, 1.5]], lines: [[7, 0], [7, 1], [0, 2], [1, 4], [4, 3], [3, 2], [2, 5], [4, 6]] },
  'taurus': { stars: [[4.60, 16.51, 2.9], [5.44, 28.61, 2.4], [5.63, 21.14, 2], [4.33, 15.63, 1.6], [4.38, 17.54, 1.5], [4.48, 19.18, 1.6]], lines: [[2, 0], [0, 3], [3, 4], [4, 5], [5, 1]] },
  'gemini': { stars: [[7.58, 31.89, 2.6], [7.76, 28.03, 2.8], [6.63, 16.40, 2.2], [6.73, 25.13, 1.8], [6.38, 22.51, 1.7], [7.34, 21.98, 1.6]], lines: [[0, 1], [0, 3], [3, 4], [1, 5], [5, 2]] },
  'leo': { stars: [[10.14, 11.97, 2.7], [10.33, 19.84, 2.4], [11.82, 14.57, 2.3], [11.24, 20.52, 2], [11.24, 15.43, 1.8], [9.76, 23.77, 1.8], [9.88, 26.01, 1.6], [10.12, 16.76, 1.6], [10.28, 23.42, 1.6]], lines: [[0, 7], [7, 1], [1, 8], [8, 6], [6, 5], [1, 3], [3, 2], [2, 4], [4, 0], [3, 4]] },
  'bootes': { stars: [[14.26, 19.18, 3], [14.75, 27.07, 2], [15.26, 33.31, 1.7], [15.03, 40.39, 1.6], [14.53, 38.31, 1.6], [14.53, 30.37, 1.6], [13.91, 18.40, 1.7]], lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0], [0, 6]] },
  'pegasus': { stars: [[23.08, 15.21, 2.4], [23.06, 28.08, 2.3], [0.22, 15.18, 2.1], [0.14, 29.09, 2.3], [21.74, 9.88, 2.2], [22.17, 6.20, 1.7], [22.69, 10.83, 1.7]], lines: [[0, 1], [1, 3], [3, 2], [2, 0], [0, 6], [6, 5], [5, 4]] },
  'andromeda': { stars: [[0.14, 29.09, 2.3], [0.66, 30.86, 1.8], [1.16, 35.62, 2.3], [2.07, 42.33, 2.2]], lines: [[0, 1], [1, 2], [2, 3]] },
  'perseus': { stars: [[3.41, 49.86, 2.4], [3.14, 40.96, 2.2], [3.08, 53.51, 1.8], [3.72, 47.79, 1.8], [3.96, 40.01, 1.8], [3.90, 31.88, 1.9]], lines: [[2, 0], [0, 3], [3, 4], [4, 5], [0, 1]] },
  'canis-major': { stars: [[6.75, -16.72, 3.6], [6.38, -17.96, 2.1], [6.98, -28.97, 2.4], [7.14, -26.39, 2.1], [7.40, -29.30, 1.8]], lines: [[1, 0], [0, 3], [3, 2], [3, 4]] },
  'scorpius': { stars: [[16.49, -26.43, 3], [16.01, -22.62, 2.1], [16.09, -19.81, 2.1], [15.98, -26.11, 1.7], [16.35, -25.59, 1.7], [16.60, -28.22, 1.7], [16.84, -34.29, 2]], lines: [[2, 1], [1, 3], [1, 4], [4, 0], [0, 5], [5, 6]] },
}
const CONST_NAMES = {
  'ursa-minor': ['Ursa Minor', 'Ursa Mică', ['Little Dipper', 'Little Bear'], ['Carul Mic', 'Ursa Minor', 'Ursa Mica'], 'Holds the North Star at the end of its tail; it never sets as seen from Europe or North America', 'Are Steaua Polară în vârful cozii; nu apune niciodată pentru cine o privește din Europa sau America de Nord'],
  'ursa-major': ['Ursa Major', 'Ursa Mare', ['Big Dipper', 'Great Bear', 'Plough'], ['Carul Mare', 'Ursa Major'], 'The two stars at the front of the "saucepan" point straight to the North Star', 'Cele două stele din fața „carului” arată direct spre Steaua Polară'],
  'cassiopeia': ['Cassiopeia', 'Cassiopeia', [], ['Cașiopeea', 'Casiopeea'], 'The W-shaped queen, on the far side of the North Star from the Big Dipper', 'Regina în formă de W, de partea cealaltă a Stelei Polare față de Carul Mare'],
  'cepheus': ['Cepheus', 'Cefeu', [], ['Cefeul', 'Cepheus'], 'A faint "house" shape, the king next to his wife Cassiopeia', 'O formă slabă de „căsuță”, regele de lângă soția lui, Cassiopeia'],
  'cygnus': ['Cygnus', 'Lebăda', ['Swan', 'Northern Cross'], ['Lebada', 'Cygnus', 'Crucea Nordului'], 'A swan flying down the Milky Way; Deneb, its tail, is part of the Summer Triangle', 'O lebădă care zboară de-a lungul Căii Lactee; Deneb, coada ei, face parte din Triunghiul de vară'],
  'lyra': ['Lyra', 'Lira', ['Lyre'], ['Lyra'], 'A small lyre with bright Vega, one corner of the Summer Triangle', 'O liră mică cu strălucitoarea Vega, un colț al Triunghiului de vară'],
  'aquila': ['Aquila', 'Vulturul', ['Eagle'], ['Aquila', 'Acvila'], 'The eagle, whose bright star Altair completes the Summer Triangle', 'Vulturul, a cărui stea strălucitoare, Altair, completează Triunghiul de vară'],
  'orion': ['Orion', 'Orion', ['Hunter'], ['Vânătorul'], 'The great winter hunter, with red Betelgeuse, blue Rigel and a belt of three stars', 'Marele vânător al iernii, cu Betelgeuse cea roșie, Rigel cea albastră și o centură de trei stele'],
  'taurus': ['Taurus', 'Taurul', ['Bull'], ['Taur', 'Taurus'], 'The bull: a V of stars for its face, with red Aldebaran as its eye', 'Taurul: un V de stele pentru cap, cu roșiaticul Aldebaran drept ochi'],
  'gemini': ['Gemini', 'Gemenii', ['Twins'], ['Gemeni', 'Gemini'], 'The twins Castor and Pollux, two bright stars side by side', 'Gemenii Castor și Pollux, două stele strălucitoare una lângă alta'],
  'leo': ['Leo', 'Leul', ['Lion'], ['Leu', 'Leo'], 'A lion of spring; its head is a backwards question mark ending in Regulus', 'Un leu al primăverii; capul e un semn de întrebare întors care se termină în Regulus'],
  'bootes': ['Boötes', 'Boarul', ['Bootes', 'Herdsman'], ['Bootes', 'Boötes', 'Văcarul'], 'A kite-shaped herdsman with orange Arcturus at the bottom', 'Un păstor în formă de zmeu, cu portocaliul Arcturus în partea de jos'],
  'pegasus': ['Pegasus', 'Pegas', ['Great Square'], ['Pegasus', 'Calul înaripat', 'Pătratul lui Pegas'], 'The winged horse, known by its Great Square of four stars in autumn', 'Calul înaripat, recunoscut toamna după Marele Pătrat format din patru stele'],
  'andromeda': ['Andromeda', 'Andromeda', [], ['Andromeda (constelația)'], 'A chain of stars leading off the Great Square; the Andromeda Galaxy sits beside it', 'Un lanț de stele care pornește din Marele Pătrat; lângă el se află Galaxia Andromeda'],
  'perseus': ['Perseus', 'Perseu', [], ['Perseus', 'Perseul'], 'The hero, with Algol, the "demon star" that dims every three days; the Perseid meteors come from here in August', 'Eroul, cu Algol, „steaua demonului”, care pălește la fiecare trei zile; de aici vin meteorii Perseide în august'],
  'canis-major': ['Canis Major', 'Câinele Mare', ['Great Dog', 'Big Dog'], ['Canis Major', 'Cainele Mare'], 'Orion\'s big dog, home of Sirius, the brightest star in the night sky', 'Câinele cel mare al lui Orion, unde se află Sirius, cea mai strălucitoare stea a nopții'],
  'scorpius': ['Scorpius', 'Scorpionul', ['Scorpio', 'Scorpion'], ['Scorpion', 'Scorpius'], 'The scorpion with red Antares at its heart, low in the south on summer nights', 'Scorpionul, cu roșiaticul Antares în inimă, jos la sud în nopțile de vară'],
}
const avg = (pts) => [+(pts.reduce((a, p) => a + p[0], 0) / pts.length).toFixed(1), +(pts.reduce((a, p) => a + p[1], 0) / pts.length).toFixed(1)]
const SKY_BADGE_NUDGE = { 'ursa-minor': [26, 0], cassiopeia: [0, -26], lyra: [-26, -18], taurus: [0, 26], andromeda: [22, 24], orion: [0, 0], cepheus: [0, 0] }
const constPos = (id) => CONST[id].stars.map(([ra, dec]) => sky(ra, dec))
const constBadge = (id) => { const [x, y] = avg(constPos(id)); const [dx, dy] = SKY_BADGE_NUDGE[id] ?? [0, 0]; return [x + dx, y + dy] }
const starAt = (id, i) => sky(CONST[id].stars[i][0], CONST[id].stars[i][1])
const offset = ([x, y], dx, dy) => [x + dx, y + dy]
// The Milky Way: the great circle 90° from the galactic north pole (RA 12h51m, Dec +27.1°)
const MILKY = (() => {
  const raP = 12.857 * 15 * Math.PI / 180, decP = 27.13 * Math.PI / 180
  const pts = []
  for (let h = 0; h <= 24; h += 0.25) {
    const ra = h * 15 * Math.PI / 180
    const dec = Math.atan(-Math.cos(ra - raP) / Math.tan(decP)) * 180 / Math.PI
    if (dec >= DEC_MIN - 5) pts.push(sky(h, Math.max(dec, DEC_MIN)))
    else pts.push(null)
  }
  return pts
})()
const milkyPath = (() => {
  let d = '', pen = false
  for (const p of MILKY) { if (!p) { pen = false; continue } d += `${pen ? 'L' : 'M'}${p[0]} ${p[1]}`; pen = true }
  return d
})()
const SKY_MAP = [
  ...Object.keys(CONST).map(id => {
    const [name, ro, alt, roAlt, info, roInfo] = CONST_NAMES[id]
    return { id, name, ro, alt, roAlt, info, roInfo, badge: constBadge(id) }
  }),
  { id: 'sky-polaris', name: 'Polaris', ro: 'Steaua Polară', alt: ['North Star', 'Pole Star'], roAlt: ['Polaris', 'Steaua Polara', 'Steaua Nordului'],
    info: 'Sits almost exactly over the North Pole: the whole sky turns around it', roInfo: 'Stă aproape exact deasupra Polului Nord: tot cerul se rotește în jurul ei',
    badge: offset(starAt('ursa-minor', 0), -28, -22), leader: starAt('ursa-minor', 0) },
  { id: 'sky-sirius', name: 'Sirius', ro: 'Sirius', alt: ['Dog Star'], roAlt: ['Steaua Câinelui'],
    info: 'The brightest star of the night, 8.6 light-years away', roInfo: 'Cea mai strălucitoare stea a nopții, la 8,6 ani-lumină',
    badge: offset(starAt('canis-major', 0), 30, 18), leader: starAt('canis-major', 0) },
  { id: 'sky-betelgeuse', name: 'Betelgeuse', ro: 'Betelgeuse',
    info: 'A red supergiant so big it would swallow Jupiter\'s orbit if it replaced the Sun', roInfo: 'O supergigantă roșie atât de mare încât ar înghiți orbita lui Jupiter dacă ar lua locul Soarelui',
    badge: offset(starAt('orion', 0), -32, 10), leader: starAt('orion', 0) },
  { id: 'sky-vega', name: 'Vega', ro: 'Vega',
    info: 'The fifth-brightest star; 12,000 years from now it will be the North Star', roInfo: 'A cincea cea mai strălucitoare stea; peste 12.000 de ani va fi steaua polară',
    badge: offset(starAt('lyra', 0), 34, 8), leader: starAt('lyra', 0) },
  { id: 'sky-pleiades', name: 'Pleiades', ro: 'Pleiadele', alt: ['Seven Sisters', 'M45'], roAlt: ['Cloșca cu Pui', 'Closca cu pui', 'Pleiade'],
    info: 'A young cluster of hundreds of stars; most people can see six or seven', roInfo: 'Un roi tânăr de sute de stele; majoritatea oamenilor pot vedea șase sau șapte',
    badge: offset(sky(3.79, 24.12), 26, -20), leader: sky(3.79, 24.12) },
  { id: 'sky-andromeda-galaxy', name: 'Andromeda Galaxy', ro: 'Galaxia Andromeda', alt: ['M31', 'Andromeda galaxy'], roAlt: ['M31'],
    info: 'A trillion stars 2.5 million light-years away, the farthest thing visible to the naked eye', roInfo: 'Un trilion de stele la 2,5 milioane de ani-lumină, cel mai îndepărtat lucru vizibil cu ochiul liber',
    badge: offset(sky(0.71, 41.27), -24, -26), leader: sky(0.71, 41.27) },
  { id: 'sky-milky-way', name: 'Milky Way', ro: 'Calea Lactee', alt: ['The Milky Way'], roAlt: ['Calea Laptelui', 'Drumul Robilor'],
    info: 'Our galaxy seen edge-on from inside; best seen on moonless summer nights away from city lights', roInfo: 'Galaxia noastră văzută din interior, din profil; se vede cel mai bine în nopțile de vară fără Lună, departe de luminile orașelor',
    badge: (() => { const p = MILKY.filter(Boolean); return offset(p[Math.round(p.length * 0.62)], 0, 0) })() },
]

function drawSky({ cls }) {
  return (
    <>
      <defs>
        <radialGradient id="sp-sky" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#14213d" /><stop offset="1" stopColor="#0a1122" /></radialGradient>
        <clipPath id="sp-skyclip"><circle cx={KX} cy={KY} r={KR} /></clipPath>
      </defs>
      <circle cx={KX} cy={KY} r={KR} fill="url(#sp-sky)" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
      <g clipPath="url(#sp-skyclip)">
        <path d={milkyPath} fill="none" stroke="rgba(190,205,255,0.13)" strokeWidth="60" strokeLinecap="round" strokeLinejoin="round" className={`dgq-milky${cls('sky-milky-way')}`} />
        {[60, 30, 0].map(dec => <circle key={dec} cx={KX} cy={KY} r={(90 - dec) / (90 - DEC_MIN) * KR} fill="none" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 6" />)}
        {Array.from({ length: 140 }, (_, i) => { const a = Math.sin(i * 91.7) * 9999, b = Math.sin(i * 47.3) * 9999; return <circle key={i} cx={KX + ((a - Math.floor(a)) - 0.5) * 2 * KR} cy={KY + ((b - Math.floor(b)) - 0.5) * 2 * KR} r="0.9" fill="rgba(255,255,255,0.35)" /> })}
        {Object.entries(CONST).map(([id, c]) => {
          const pts = constPos(id)
          return (
            <g key={id} className={`dgq-const${cls(id)}`}>
              {c.lines.map(([a, b], i) => <line key={i} x1={pts[a][0]} y1={pts[a][1]} x2={pts[b][0]} y2={pts[b][1]} />)}
              {c.stars.map((s, i) => <circle key={i} cx={pts[i][0]} cy={pts[i][1]} r={s[2]} />)}
            </g>
          )
        })}
        {(() => { const [x, y] = sky(3.79, 24.12); return <g className={`dgq-const${cls('sky-pleiades')}`}>{[[0, 0], [5, -3], [-4, -4], [3, 4], [-5, 3], [8, 2]].map(([dx, dy], i) => <circle key={i} cx={x + dx} cy={y + dy} r="1.4" />)}</g> })()}
        {(() => { const [x, y] = sky(0.71, 41.27); return <ellipse cx={x} cy={y} rx="10" ry="4" transform={`rotate(-35 ${x} ${y})`} className={`dgq-galaxy${cls('sky-andromeda-galaxy')}`} /> })()}
      </g>
    </>
  )
}

export const SPACE_DIAGRAMS = {
  'solar-system': {
    id: 'solar-system', icon: '🪐',
    title: t('The Solar System'),
    prompt: t('Name the Sun, the planets and everything else on the drawing'),
    placeholder: t('Type a planet…'),
    note: t('Not to scale: with the Sun this size, Neptune would be about a kilometre away.'),
    viewBox: [0, 0, 1000, 460],
    items: SOLAR,
    draw: drawSolar,
  },
  'moon-phases': {
    id: 'moon-phases', icon: '🌓',
    title: t('Phases of the Moon'),
    prompt: t('Name the phases of the Moon'),
    placeholder: t('Type a phase…'),
    note: t('Inner ring: the Moon on its orbit, seen from above. Outer ring: how it looks from the northern hemisphere.'),
    viewBox: [0, 0, 1000, 700],
    items: MOON_PHASES,
    draw: drawPhases,
  },
  'eclipses': {
    id: 'eclipses', icon: '🌑',
    title: t('Eclipses'),
    prompt: t('Name the parts of a solar and a lunar eclipse'),
    placeholder: t('Type a part of an eclipse…'),
    note: t('Not to scale: the Sun is really 400 times bigger than the Moon and 400 times farther away.'),
    viewBox: [0, 0, 1000, 640],
    items: ECLIPSES,
    draw: drawEclipses,
  },
  'sun-anatomy': {
    id: 'sun-anatomy', icon: '☀️',
    title: t('Inside the Sun'),
    prompt: t('Name the layers of the Sun and what happens on its surface'),
    placeholder: t('Type a part of the Sun…'),
    viewBox: [0, 0, 1000, 610],
    items: SUN_PARTS,
    draw: drawSun,
  },
  'sky-map': {
    id: 'sky-map', icon: '🌌',
    title: t('The Night Sky'),
    prompt: t('Name the constellations and stars of the northern sky'),
    placeholder: t('Type a constellation or a star…'),
    note: t('The chart is centred on the North Star, as you see it looking up and facing north; the rim reaches the stars low in the south.'),
    viewBox: [0, 0, 1000, 1000],
    items: SKY_MAP,
    draw: drawSky,
  },
}
