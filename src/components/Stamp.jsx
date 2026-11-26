import { useId } from 'react'

/**
 * A passport stamp drawn in SVG: rough inked edges, uneven ink, slightly crooked.
 * shape: round · rect · oval · octagon      tier: 1 black · 2 blue · 3 red with gold foil
 * locked: a faint dotted outline of where the stamp will go.
 */
const INKS = { 1: '#23262d', 2: '#1f4e9c', 3: '#b3262b' }

const ICONS = {
  globe: (c) => <g fill="none" stroke={c} strokeWidth="3.2"><circle cx="110" cy="104" r="25" /><ellipse cx="110" cy="104" rx="10.5" ry="25" /><path d="M85 104h50M89 91h42M89 117h42" /></g>,
  city: (c) => <g fill={c}><rect x="88" y="98" width="11" height="26" /><rect x="102" y="82" width="15" height="42" /><rect x="120" y="92" width="12" height="32" /><path d="M109.5 72l4 10h-8z" /></g>,
  coin: (c) => <g fill="none" stroke={c} strokeWidth="3.2"><circle cx="110" cy="104" r="24" /><circle cx="110" cy="104" r="17" strokeWidth="1.8" /><path d="M115 95.5c-1.6-1.8-3.6-2.5-6-2.5-4 0-6.5 2.3-6.5 5.3 0 7.2 13 3.6 13 10.6 0 3.2-2.8 5.6-7 5.6-2.7 0-5-.9-6.7-2.8M110 89v30" strokeLinecap="round" /></g>,
  speech: (c) => <g fill="none" stroke={c} strokeWidth="3.2" strokeLinejoin="round"><path d="M84 86h34a6 6 0 0 1 6 6v16a6 6 0 0 1-6 6H98l-10 9v-9h-4a6 6 0 0 1-6-6V92a6 6 0 0 1 6-6z" /><path d="M128 98h4a6 6 0 0 1 6 6v14a6 6 0 0 1-6 6h-2v8l-9-8h-11" /></g>,
  mountain: (c) => <g fill="none" stroke={c} strokeWidth="3.2" strokeLinejoin="round"><path d="M80 124l20-34 10 15 9-13 21 32z" /><path d="M95 99l5-9 5 7-4 3-3-2z" fill={c} /></g>,
  wave: (c) => <g fill="none" stroke={c} strokeWidth="3.4" strokeLinecap="round"><path d="M80 96c6-6 12-6 18 0s12 6 18 0 12-6 18 0" /><path d="M80 108c6-6 12-6 18 0s12 6 18 0 12-6 18 0" /><path d="M80 120c6-6 12-6 18 0s12 6 18 0 12-6 18 0" /></g>,
  river: (c) => <g fill="none" stroke={c} strokeLinecap="round"><path d="M118 76c-14 8 8 18-6 28s4 16-10 24" strokeWidth="7" /><path d="M118 76c-14 8 8 18-6 28s4 16-10 24" strokeWidth="2" stroke="#efe6d2" /></g>,
  thermo: (c) => <g><path d="M104 76a6 6 0 0 1 12 0v30a12 12 0 1 1-12 0z" fill="none" stroke={c} strokeWidth="3.4" /><circle cx="110" cy="116" r="6.5" fill={c} /><path d="M110 112V88" stroke={c} strokeWidth="4" strokeLinecap="round" /></g>,
  people: (c) => <g fill="none" stroke={c} strokeWidth="3.2" strokeLinecap="round"><circle cx="99" cy="94" r="8" /><path d="M84 122c1-10 7-15 15-15s14 5 15 15" /><circle cx="124" cy="96" r="6.5" /><path d="M117 108c2-1 4-1.5 7-1.5 7 0 12 4.5 13 13" /></g>,
}

function arcPath(r, a0, a1, sweep) {
  const p = (a) => [110 + r * Math.cos(a * Math.PI / 180), 110 + r * Math.sin(a * Math.PI / 180)].map(v => v.toFixed(1)).join(',')
  return `M${p(a0)} A${r},${r} 0 0 ${sweep} ${p(a1)}`
}
const octagon = (r) => Array.from({ length: 8 }, (_, i) => {
  const a = (i * 45 + 22.5) * Math.PI / 180
  return `${(110 + r * Math.cos(a)).toFixed(1)},${(110 + r * Math.sin(a)).toFixed(1)}`
}).join(' ')

function Body({ shape, icon, kicker, big, date, ink, ids }) {
  const draw = ICONS[icon] ?? ICONS.globe
  const T = (props) => <text fontFamily="Inter Variable, Inter, sans-serif" textAnchor="middle" fill={ink} {...props} />
  const Big = (props) => <text fontFamily="Fraunces Variable, Fraunces, serif" fontWeight="700" textAnchor="middle" fill={ink} {...props} />

  if (shape === 'round') {
    return <>
      <circle cx="110" cy="110" r="96" fill="none" stroke={ink} strokeWidth="5" />
      <circle cx="110" cy="110" r="86" fill="none" stroke={ink} strokeWidth="1.8" />
      <circle cx="110" cy="110" r="58" fill="none" stroke={ink} strokeWidth="1.8" />
      <path id={ids.top} d={arcPath(71, 200, 340, 1)} fill="none" />
      <path id={ids.bottom} d={arcPath(75, 160, 20, 0)} fill="none" />
      <T fontWeight="800" fontSize={kicker.length > 12 ? 12 : 15} letterSpacing={kicker.length > 12 ? 2 : 3}><textPath href={`#${ids.top}`} startOffset="50%">{kicker}</textPath></T>
      <T fontWeight="700" fontSize="12.5" letterSpacing="2.5"><textPath href={`#${ids.bottom}`} startOffset="50%">{date}</textPath></T>
      <T x="38" y="115" fontSize="13" fontWeight="800">★</T><T x="182" y="115" fontSize="13" fontWeight="800">★</T>
      <g transform="translate(110 104) scale(0.86) translate(-110 -104)">{draw(ink)}</g>
      <Big x="110" y="150" fontSize="16">{big}</Big>
    </>
  }
  if (shape === 'octagon') {
    return <>
      <polygon points={octagon(98)} fill="none" stroke={ink} strokeWidth="5" strokeLinejoin="round" />
      <polygon points={octagon(87)} fill="none" stroke={ink} strokeWidth="1.6" strokeLinejoin="round" />
      <T x="110" y="62" fontWeight="800" fontSize={kicker.length > 11 ? 11.5 : 13.5} letterSpacing="3">{kicker}</T>
      <g transform="translate(0 -2)">{draw(ink)}</g>
      <Big x="110" y="152" fontSize="19">{big}</Big>
      <T x="110" y="172" fontWeight="700" fontSize="10.5" letterSpacing="2.5">{date}</T>
    </>
  }
  const isRect = shape === 'rect'
  return <>
    {isRect
      ? <><rect x="22" y="40" width="176" height="140" rx="14" fill="none" stroke={ink} strokeWidth="5" />
          <rect x="31" y="49" width="158" height="122" rx="8" fill="none" stroke={ink} strokeWidth="1.6" strokeDasharray="5 3" /></>
      : <><ellipse cx="110" cy="110" rx="100" ry="72" fill="none" stroke={ink} strokeWidth="5" />
          <ellipse cx="110" cy="110" rx="90" ry="62" fill="none" stroke={ink} strokeWidth="1.6" /></>}
    <T x="110" y={isRect ? 72 : 70} fontWeight="800" fontSize={kicker.length > 11 ? 12 : 14} letterSpacing="3">{kicker}</T>
    <g transform="translate(-36 8) scale(0.84)">{draw(ink)}</g>
    <Big x="140" y="117" fontSize={big.length > 7 ? 17 : 21}>{big}</Big>
    {!isRect && <line x1="48" y1="134" x2="172" y2="134" stroke={ink} strokeWidth="1.6" />}
    <T x="110" y={isRect ? 160 : 153} fontWeight="700" fontSize={isRect ? 11.5 : 10} letterSpacing="2">{date}</T>
  </>
}

export default function Stamp({ shape = 'round', icon = 'globe', kicker = '', big = '', date = '', tier = 1, rotate = 0, locked = false, size = 180, title }) {
  const uid = useId().replace(/:/g, '')
  const ids = { rough: `r${uid}`, noise: `n${uid}`, mask: `m${uid}`, gold: `g${uid}`, top: `t${uid}`, bottom: `b${uid}` }

  if (locked) {
    return (
      <svg viewBox="0 0 220 220" width={size} height={size} role="img" aria-label={title} className="stamp stamp-locked">
        <g opacity="0.32"><Body shape={shape} icon={icon} kicker={kicker} big="?" date="" ink="#7a6a50" ids={ids} /></g>
      </svg>
    )
  }

  const ink = INKS[tier] ?? INKS[1]
  const gold = tier === 3
  return (
    <svg viewBox="0 0 220 220" width={size} height={size} role="img" aria-label={title} className={`stamp stamp-t${tier}`}>
      <defs>
        <filter id={ids.rough} x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={uid.length * 7} result="t" />
          <feDisplacementMap in="SourceGraphic" in2="t" scale="2.2" />
        </filter>
        <filter id={ids.noise}>
          <feTurbulence type="fractalNoise" baseFrequency="1.6" numOctaves="1" seed={uid.length * 3} />
          <feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 -2.4 1.55" />
        </filter>
        <mask id={ids.mask}>
          <rect x="-20" y="-20" width="260" height="260" fill="white" />
          <rect x="-20" y="-20" width="260" height="260" filter={`url(#${ids.noise})`} fill="black" opacity="0.55" />
        </mask>
        <linearGradient id={ids.gold} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8a5a12" /><stop offset="0.35" stopColor="#f3d27a" /><stop offset="0.5" stopColor="#fff2c2" />
          <stop offset="0.65" stopColor="#d9a93f" /><stop offset="1" stopColor="#7a4c0e" />
        </linearGradient>
      </defs>
      <g transform={`rotate(${rotate} 110 110)`} filter={`url(#${ids.rough})`} mask={`url(#${ids.mask})`} opacity="0.92">
        <Body shape={shape} icon={icon} kicker={kicker} big={big} date={date} ink={ink} ids={ids} />
      </g>
      {gold && (
        <g transform={`rotate(${rotate} 110 110) translate(1.2 1.2)`} filter={`url(#${ids.rough})`} opacity="0.9" style={{ mixBlendMode: 'multiply' }}>
          <Body shape={shape} icon={icon} kicker={kicker} big={big} date={date} ink={`url(#${ids.gold})`} ids={{ ...ids, top: `${ids.top}g`, bottom: `${ids.bottom}g` }} />
        </g>
      )}
    </svg>
  )
}
