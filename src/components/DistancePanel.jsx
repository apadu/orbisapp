import { useCallback, useEffect, useRef, useState } from 'react'
import SetupCard from './SetupCard'
import GameHeader from './GameHeader'
import { CAPITAL_COORDS, distanceKm } from '../utils/capitalCoords'
import { CAPITALS } from '../utils/capitals'
import { COUNTRY_INFO } from '../utils/countryInfo'
import { shuffle, fmtKm } from '../quizzes/globeGames'
import { startSession, trackAnswer, finishGame, loadResults } from '../utils/results'
import { playCorrect, playWrong, playWin } from '../utils/sounds'
import { t, cn, locale } from '../i18n'
import { useGameHud } from '../utils/hudStore'

const MODE = 'distance'
const ROUNDS = 8
const GOOD = 0.15                          // within 15 % = hit
const MIN_KM = 50, MAX_KM = 20000          // slider range (log scale)

const OPTIONS = [{
  id: 'range', label: t('Distances'),
  choices: [
    { value: 'mixed', label: t('🎲 Mixed'),       hint: t('Neighbours and the other side of the world') },
    { value: 'near',  label: t('📍 Same continent'), hint: t('Both capitals on the same continent') },
    { value: 'far',   label: t('✈️ Long haul'),    hint: t('Capitals on different continents') },
  ],
}]
const RULES = [
  t('Two capitals light up on the globe. Guess the distance between them in kilometres.'),
  t('Drag the slider or type a number, then press Enter.'),
  t('The real great-circle distance is drawn on the globe. Within 15% counts as a hit.'),
]

const sliderToKm = (v) => Math.round(MIN_KM * Math.pow(MAX_KM / MIN_KM, v / 1000))
const kmToSlider = (km) => Math.round(1000 * Math.log(km / MIN_KM) / Math.log(MAX_KM / MIN_KM))
/** 1000 for a perfect guess, ~700 at 20 % off, ~440 at 50 % off, ~250 when double/half. */
const distPoints = (g, a) => Math.round(1000 * Math.exp(-2 * Math.abs(Math.log(g / a))))

function makePairs(range) {
  const caps = Object.keys(CAPITAL_COORDS).filter(n => CAPITALS[n])
  const out = []
  const used = new Set()
  for (let tries = 0; out.length < ROUNDS && tries < 500; tries++) {
    const [a, b] = shuffle(caps).slice(0, 2)
    const same = COUNTRY_INFO[a]?.continent === COUNTRY_INFO[b]?.continent
    const wantSame = range === 'near' ? true : range === 'far' ? false : out.length % 2 === 0
    if (wantSame !== same) continue
    const km = distanceKm(CAPITAL_COORDS[a], CAPITAL_COORDS[b])
    if (km < 150) continue
    const key = [a, b].sort().join('|')
    if (used.has(key)) continue
    used.add(key)
    out.push({ a, b, km })
  }
  return out
}

export default function DistancePanel({ onGlobe }) {
  const [phase, setPhase] = useState('setup')
  const [setup, setSetup] = useState(null)
  const [pairs, setPairs] = useState([])
  const [round, setRound] = useState(0)
  const [slider, setSlider] = useState(kmToSlider(2000))
  const [typed, setTyped] = useState('')
  const [answer, setAnswer] = useState(null)   // { guess, pts, ok }
  const [log, setLog] = useState([])
  const inputRef = useRef(null)

  const pair = pairs[round]
  const guessKm = typed ? Math.max(1, Number(typed.replace(/\D/g, '')) || 0) : sliderToKm(slider)
  const total = log.reduce((s, l) => s + l.pts, 0)

  const begin = useCallback((values) => {
    startSession(MODE)
    setSetup(values); setPairs(makePairs(values.range)); setRound(0); setAnswer(null); setLog([])
    setSlider(kmToSlider(2000)); setTyped('')
    setPhase('playing')
  }, [])

  const submit = useCallback(() => {
    if (phase !== 'playing' || answer || !pair || !guessKm) return
    const pts = distPoints(guessKm, pair.km)
    const ok = Math.abs(guessKm - pair.km) / pair.km <= GOOD
    trackAnswer(MODE, null, ok, 0, `dist:${[pair.a, pair.b].sort().join('|')}`)
    ;(ok ? playCorrect : playWrong)()
    setAnswer({ guess: guessKm, pts, ok })
    setLog(l => [...l, { ...pair, guess: guessKm, pts }])
  }, [phase, answer, pair, guessKm])

  const next = useCallback(() => {
    if (!answer) return
    if (round + 1 >= pairs.length) {
      finishGame(MODE, { score: log.reduce((s, l) => s + l.pts, 0), completed: true, meta: { range: setup.range } })
      playWin()
      setPhase('over')
    } else {
      setRound(r => r + 1); setAnswer(null); setTyped(''); setSlider(kmToSlider(2000))
      setTimeout(() => inputRef.current?.focus(), 30)
    }
  }, [answer, round, pairs.length, log, setup])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== 'Enter') return
      if (phase === 'playing') { e.preventDefault(); answer ? next() : submit() }
      else if (phase === 'over') { e.preventDefault(); begin(setup) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [phase, answer, next, submit, begin, setup])

  // Globe: both capitals, then the real arc
  useEffect(() => {
    if (phase !== 'playing' || !pair) { onGlobe({}); return }
    const [aLat, aLon] = CAPITAL_COORDS[pair.a], [bLat, bLon] = CAPITAL_COORDS[pair.b]
    const pins = [
      { lat: aLat, lon: aLon, color: '#facc15', label: CAPITALS[pair.a][0] },
      { lat: bLat, lon: bLon, color: '#38bdf8', label: CAPITALS[pair.b][0] },
    ]
    const midLon = aLon + ((((bLon - aLon) + 540) % 360) - 180) / 2
    onGlobe({
      guesses: [{ name: pair.a, color: '#facc15' }, { name: pair.b, color: '#38bdf8' }],
      overlay: { pins, lines: answer ? [{ type: 'arc', from: [aLon, aLat], to: [bLon, bLat], color: '#22c55e', width: 5 }] : [] },
      flyTo: { lon: midLon, lat: (aLat + bLat) / 2, zoom: pair.km > 9000 ? 3.8 : pair.km > 4000 ? 3.4 : pair.km > 1500 ? 2.8 : 2.2, hold: 600000, _k: round },
    })
  }, [phase, pair, answer, round]) // eslint-disable-line react-hooks/exhaustive-deps

  // Phones: key numbers stay visible over the globe
  useGameHud(phase === 'playing' ? [{ icon: '🔁', text: `${round + 1}/${pairs.length}` }, { text: `${total.toLocaleString(locale)} ${t('pts')}` }] : null)
  if (phase === 'setup') {
    return <SetupCard mode={MODE} icon="📏" title={t('How Far?')} desc={t('Guess the distance between two capitals')} options={OPTIONS} rules={RULES} onStart={begin} />
  }

  if (phase === 'over') {
    const best = loadResults().filter(r => r.mode === MODE && r.details?.range === setup.range).reduce((m, r) => Math.max(m, r.score), 0)
    return (
      <div className="gg">
        <GameHeader icon="📏" title={t('How Far?')} />
        <div className="gg-over">
          <div className="gg-over-big">{total.toLocaleString(locale)}<small> / {(log.length * 1000).toLocaleString(locale)}</small></div>
          <div className="gg-sub">{total >= best ? t('🎉 Personal best') : t('best {v}', { v: best.toLocaleString(locale) })}</div>
          <div className="gg-list">
            {log.map((l, i) => (
              <div key={i} className="gg-list-row">
                <span>{CAPITALS[l.a][0]} ↔ {CAPITALS[l.b][0]}</span>
                <span className="gg-dim">{fmtKm(l.guess)} / {fmtKm(l.km)}</span>
                <b>{l.pts}</b>
              </div>
            ))}
          </div>
          <div className="gg-btns">
            <button className="arc-primary" onClick={() => begin(setup)}>{t('▶ Play again')} <kbd>{t('Enter')}</kbd></button>
            <button className="arc-secondary" onClick={() => setPhase('setup')}>{t('Settings')}</button>
          </div>
        </div>
      </div>
    )
  }

  if (!pair) return <div className="gg"><div className="gg-sub">{t('Couldn\'t build a round — try again.')}</div></div>

  const off = answer ? Math.round(((answer.guess - pair.km) / pair.km) * 100) : 0
  return (
    <div className="gg">
      <GameHeader icon="📏" title={t('How Far?')} />
      <div className="gg-head">
        <span className="gg-round">{t('Round')} {round + 1}/{pairs.length}</span>
        <span className="gg-score">{total.toLocaleString(locale)} {t('pts')}</span>
      </div>
      <div className="gg-prompt">
        <span className="gg-prompt-label">{t('How far is it from…')}</span>
        <span className="gg-prompt-big dist-cities">
          <span style={{ color: '#facc15' }}>{CAPITALS[pair.a][0]}</span>
          <span className="gg-dim"> → </span>
          <span style={{ color: '#38bdf8' }}>{CAPITALS[pair.b][0]}</span>
        </span>
        <span className="gg-prompt-sub">{COUNTRY_INFO[pair.a]?.flag} {cn(pair.a)} · {COUNTRY_INFO[pair.b]?.flag} {cn(pair.b)}</span>
      </div>

      {!answer ? (
        <div className="dist-input">
          <div className="dist-value">{guessKm.toLocaleString(locale)} <small>km</small></div>
          <input
            type="range" min="0" max="1000" value={typed ? kmToSlider(Math.min(MAX_KM, Math.max(MIN_KM, guessKm))) : slider}
            onChange={e => { setSlider(Number(e.target.value)); setTyped('') }}
            className="dist-slider" aria-label={t('Distance in km')}
          />
          <div className="dist-scale"><span>50</span><span>500</span><span>5 000</span><span>20 000 km</span></div>
          <div className="dist-row">
            <input ref={inputRef} className="missing-input" inputMode="numeric" placeholder={t('…or type the km')} value={typed} onChange={e => setTyped(e.target.value.replace(/[^\d]/g, '').slice(0, 5))} />
            <button className="arc-primary" onClick={submit}>{t('Guess')} <kbd>{t('Enter')}</kbd></button>
          </div>
        </div>
      ) : (
        <div className={`gg-result ${answer.ok ? 'ok' : 'bad'}`}>
          <div className="gg-result-km">{fmtKm(pair.km)}</div>
          <div className="gg-result-txt">
            {t('You said {g}', { g: fmtKm(answer.guess) })} · {off > 0 ? '+' : ''}{off}% · +{answer.pts} {t('pts')}
          </div>
          <button className="arc-primary" onClick={next}>{round + 1 >= pairs.length ? t('See results') : t('Next')} <kbd>{t('Enter')}</kbd></button>
        </div>
      )}
    </div>
  )
}
