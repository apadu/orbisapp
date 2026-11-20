/**
 * Flags of countries that no longer exist (or no longer use them), drawn as simple SVGs.
 * Emblems are simplified on purpose: at quiz size what matters is the overall look.
 * All drawings use a 3:2 box (300 × 200).
 */

// A five-pointed star centred on (cx, cy)
const starPts = (cx, cy, r, inner = 0.4) => Array.from({ length: 10 }, (_, i) => {
  const a = -Math.PI / 2 + (i * Math.PI) / 5
  const rr = i % 2 ? r * inner : r
  return `${(cx + rr * Math.cos(a)).toFixed(1)},${(cy + rr * Math.sin(a)).toFixed(1)}`
}).join(' ')
const Star = ({ cx, cy, r, ...p }) => <polygon points={starPts(cx, cy, r)} {...p} />
const H = (colors) => colors.map((c, i, a) => <rect key={i} x="0" y={(200 / a.length) * i} width="300" height={200 / a.length + 0.5} fill={c} />)
const V = (colors) => colors.map((c, i, a) => <rect key={i} x={(300 / a.length) * i} y="0" width={300 / a.length + 0.5} height="200" fill={c} />)

// Hammer and sickle, about 40 units wide, centred on (x, y)
const HammerSickle = ({ x, y, s = 1, color = '#FFD700' }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} stroke={color} fill="none" strokeLinecap="round">
    <path d="M-10 -15 A17 17 0 1 0 15 5" strokeWidth="5.5" />
    <path d="M-7 9 L-15 17" strokeWidth="6" />
    <path d="M-13 15 L8 -6" strokeWidth="4.5" />
    <path d="M1 -13 L15 1" strokeWidth="8" strokeLinecap="butt" />
  </g>
)

// Union Jack in a box (x, y, w, h)
const UnionJack = ({ x = 0, y = 0, w = 150, h = 100 }) => (
  <svg x={x} y={y} width={w} height={h} viewBox="0 0 60 30" preserveAspectRatio="none">
    <rect width="60" height="30" fill="#012169" />
    <path d="M0 0 L60 30 M60 0 L0 30" stroke="#fff" strokeWidth="6" />
    <path d="M0 0 L60 30 M60 0 L0 30" stroke="#C8102E" strokeWidth="2" />
    <path d="M30 0 V30 M0 15 H60" stroke="#fff" strokeWidth="10" />
    <path d="M30 0 V30 M0 15 H60" stroke="#C8102E" strokeWidth="6" />
  </svg>
)

const FLAGS = {
  ussr: () => (
    <>
      <rect width="300" height="200" fill="#CC0000" />
      <Star cx={62} cy={28} r={11} fill="none" stroke="#FFD700" strokeWidth="2.5" />
      <HammerSickle x={60} y={70} s={1.15} />
    </>
  ),
  'ukrainian-ssr': () => (
    <>
      <rect width="300" height="134" fill="#CC0000" />
      <rect y="134" width="300" height="66" fill="#0072BB" />
      <Star cx={52} cy={24} r={9} fill="none" stroke="#FFD700" strokeWidth="2.2" />
      <HammerSickle x={50} y={58} s={0.95} />
    </>
  ),
  sfry: () => (
    <>
      {H(['#003893', '#FFFFFF', '#DE0000'])}
      <Star cx={150} cy={102} r={62} fill="#DE0000" stroke="#FCD116" strokeWidth="5" />
    </>
  ),
  fry: () => <>{H(['#0C4076', '#FFFFFF', '#C6363C'])}</>,
  gdr: () => (
    <>
      {H(['#000000', '#DD0000', '#FFCE00'])}
      <circle cx="150" cy="100" r="44" fill="#DD0000" stroke="#FFCE00" strokeWidth="9" strokeDasharray="7 3" />
      <path d="M150 70 V122" stroke="#FFCE00" strokeWidth="8" />
      <path d="M136 70 H164" stroke="#FFCE00" strokeWidth="9" />
      <path d="M150 74 L130 124 M150 74 L170 124" stroke="#FFCE00" strokeWidth="5" fill="none" />
      <circle cx="150" cy="74" r="5" fill="#FFCE00" />
    </>
  ),
  'socialist-romania': () => (
    <>
      {V(['#002B7F', '#FCD116', '#CE1126'])}
      <ellipse cx="150" cy="104" rx="38" ry="44" fill="none" stroke="#C9A227" strokeWidth="8" strokeDasharray="6 2" />
      <circle cx="150" cy="100" r="28" fill="#5BA4E6" />
      <path d="M123 112 L140 92 L150 102 L162 86 L177 112 Z" fill="#2E7D32" />
      <circle cx="150" cy="104" r="9" fill="#FFB300" />
      <path d="M123 112 H177 V122 Q150 130 123 122 Z" fill="#2E7D32" />
      <Star cx={150} cy={58} r={9} fill="#CE1126" />
      <path d="M128 146 H172" stroke="#002B7F" strokeWidth="4" /><path d="M128 150 H172" stroke="#FCD116" strokeWidth="4" /><path d="M128 154 H172" stroke="#CE1126" strokeWidth="4" />
    </>
  ),
  'romania-1989': ({ uid }) => (
    <>
      <defs>
        <mask id={`hole-${uid}`}><rect width="300" height="200" fill="#fff" /><circle cx="150" cy="100" r="42" fill="#000" /></mask>
      </defs>
      <g mask={`url(#hole-${uid})`}>{V(['#002B7F', '#FCD116', '#CE1126'])}</g>
      <circle cx="150" cy="100" r="42" fill="none" stroke="rgba(0,0,0,0.25)" strokeWidth="3" strokeDasharray="5 4" />
    </>
  ),
  'russian-empire': () => <>{H(['#000000', '#FFD500', '#FFFFFF'])}</>,
  'south-vietnam': () => (
    <>
      <rect width="300" height="200" fill="#FFDD00" />
      {[78, 95, 112].map(y => <rect key={y} y={y} width="300" height="10" fill="#DA251D" />)}
    </>
  ),
  'upper-volta': () => <>{H(['#000000', '#FFFFFF', '#CE1126'])}</>,
  zaire: () => (
    <>
      <rect width="300" height="200" fill="#3A9B3A" />
      <circle cx="150" cy="100" r="58" fill="#FCD116" />
      <path d="M118 140 L150 104 L160 112 L130 148 Z" fill="#7B4A2A" />
      <path d="M146 110 L170 82" stroke="#5a3a20" strokeWidth="9" strokeLinecap="round" />
      <path d="M172 80 Q160 62 176 46 Q178 62 190 66 Q186 80 172 80 Z" fill="#E4322B" />
    </>
  ),
  'libya-1977': () => <rect width="300" height="200" fill="#009A3D" />,
  hawaii: () => (
    <>
      {H(['#FFFFFF', '#C8102E', '#012169', '#FFFFFF', '#C8102E', '#012169', '#FFFFFF', '#C8102E'])}
      <UnionJack x={0} y={0} w={150} h={100} />
    </>
  ),
  texas: () => (
    <>
      <rect width="300" height="100" fill="#FFFFFF" />
      <rect y="100" width="300" height="100" fill="#BF0A30" />
      <rect width="100" height="200" fill="#002868" />
      <Star cx={50} cy={102} r={30} fill="#FFFFFF" />
    </>
  ),
  tanganyika: () => (
    <>
      <rect width="300" height="200" fill="#1EB53A" />
      <rect y="72" width="300" height="56" fill="#FCD116" />
      <rect y="78" width="300" height="44" fill="#000000" />
    </>
  ),
  'kingdom-egypt': () => (
    <>
      <rect width="300" height="200" fill="#0B8A3E" />
      <circle cx="140" cy="100" r="54" fill="#FFFFFF" />
      <circle cx="160" cy="100" r="48" fill="#0B8A3E" />
      <Star cx={160} cy={76} r={11} fill="#FFFFFF" />
      <Star cx={176} cy={100} r={11} fill="#FFFFFF" />
      <Star cx={160} cy={124} r={11} fill="#FFFFFF" />
    </>
  ),
  uar: () => (
    <>
      {H(['#CE1126', '#FFFFFF', '#000000'])}
      <Star cx={112} cy={100} r={22} fill="#007A3D" />
      <Star cx={188} cy={100} r={22} fill="#007A3D" />
    </>
  ),
  'kingdom-italy': () => (
    <>
      {V(['#009246', '#FFFFFF', '#CE2B37'])}
      <path d="M126 64 H174 V112 Q174 140 150 148 Q126 140 126 112 Z" fill="#0047AB" />
      <path d="M131 69 H169 V111 Q169 134 150 141 Q131 134 131 111 Z" fill="#CE2B37" />
      <path d="M150 72 V136 M134 98 H166" stroke="#FFFFFF" strokeWidth="9" />
    </>
  ),
}

let uidSeq = 0
export default function HistoricalFlag({ id, className = '' }) {
  const Draw = FLAGS[id]
  if (!Draw) return null
  const uid = `${id}-${++uidSeq}`
  return (
    <svg className={`hist-flag ${className}`} viewBox="0 0 300 200" role="img" aria-label="flag">
      <Draw uid={uid} />
      <rect width="300" height="200" fill="none" stroke="rgba(0,0,0,0.25)" strokeWidth="2" />
    </svg>
  )
}
export const HISTORICAL_FLAG_IDS = Object.keys(FLAGS)
