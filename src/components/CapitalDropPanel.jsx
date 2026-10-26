import { useCallback, useEffect, useMemo, useState } from 'react'
import SetupCard from './SetupCard'
import { CAPITAL_COORDS, distanceKm } from '../utils/capitalCoords'
import { CAPITALS } from '../utils/capitals'
import { COUNTRY_INFO } from '../utils/countryInfo'
import { REGIONS } from '../quizzes/tableQuizzes'
import { shuffle, fmtKm, dropPoints } from '../quizzes/globeGames'
import { startSession, trackAnswer, finishGame, loadResults } from '../utils/results'
import { playCorrect, playWrong, playWin } from '../utils/sounds'
import { t, cn, continentName, locale } from '../i18n'

const MODE = 'capital-drop'
const ROUNDS = 10
const GOOD_KM = 300     // counts as "correct" for stats / XP

const OPTIONS = [{
  id: 'region', label: t('Region'),
  choices: REGIONS.map(r => ({ value: r, label: r === 'World' ? '🌍 ' + continentName(r) : continentName(r) })),
}]
const RULES = [
  t('{ROUNDS} capitals. Click on the globe where you think each one is.', { ROUNDS: ROUNDS }),
  t('Points depend on the real great-circle distance: 1000 for a bullseye (≤ 25 km), about half at 700 km.'),
  t('Within {GOOD_KM} km counts as a hit.', { GOOD_KM: GOOD_KM }),
  t('Drag to rotate, scroll to zoom — the click only counts when you don\'t drag.'),
]

const verdict = (km) => km <= 25 ? t('🎯 Bullseye!') : km <= 150 ? t('🔥 Very close') : km <= GOOD_KM ? t('👍 Close') : km <= 1000 ? t('🙂 Not bad') : km <= 3000 ? t('😬 Far off') : t('🧭 Way off')

export default function CapitalDropPanel({ gameCountries, onGlobe }) {
  const [phase, setPhase] = useState('setup')
  const [setup, setSetup] = useState(null)
  const [queue, setQueue] = useState([])
  const [round, setRound] = useState(0)
  const [guess, setGuess] = useState(null)   // { lon, lat, km, pts }
  const [log, setLog] = useState([])         // [{ country, capital, km, pts }]

  const features = useMemo(() => Object.fromEntries(gameCountries.map(f => [f.properties.NAME, f])), [gameCountries])
  const country = queue[round]
  const capital = country ? CAPITALS[country][0] : ''
  const target = country ? CAPITAL_COORDS[country] : null
  const total = log.reduce((s, l) => s + l.pts, 0)

  const begin = useCallback((values) => {
    const pool = Object.keys(CAPITAL_COORDS).filter(n => CAPITALS[n] && features[n] &&
      (values.region === 'World' || COUNTRY_INFO[n]?.continent === values.region))
    startSession(MODE)
    setSetup(values); setQueue(shuffle(pool).slice(0, ROUNDS)); setRound(0); setGuess(null); setLog([])
    setPhase('playing')
  }, [features])

  const onClick = useCallback((lon, lat) => {
    if (phase !== 'playing' || guess || !target) return
    const km = distanceKm([lat, lon], target)
    const pts = dropPoints(km)
    trackAnswer(MODE, country, km <= GOOD_KM, 0)
    ;(km <= GOOD_KM ? playCorrect : playWrong)()
    setGuess({ lon, lat, km, pts })
    setLog(l => [...l, { country, capital, km, pts }])
  }, [phase, guess, target, country, capital])

  const next = useCallback(() => {
    if (!guess) return
    if (round + 1 >= queue.length) {
      const sum = log.reduce((s, l) => s + l.pts, 0)
      finishGame(MODE, {
        score: sum, completed: true,
        meta: { region: setup.region, avgKm: Math.round(log.reduce((s, l) => s + l.km, 0) / log.length) },
      })
      playWin()
      setPhase('over')
    } else {
      setRound(r => r + 1)
      setGuess(null)
    }
  }, [guess, round, queue.length, log, setup])

  // Enter / Space → next
  useEffect(() => {
    const onKey = (e) => {
      if ((e.key === 'Enter' || e.key === ' ') && phase === 'playing' && guess) { e.preventDefault(); next() }
      else if (e.key === 'Enter' && phase === 'over') { e.preventDefault(); begin(setup) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [phase, guess, next, begin, setup])

  // Globe state
  useEffect(() => {
    if (phase === 'setup') { onGlobe({}); return }
    if (phase === 'over') {
      onGlobe({
        spin: false,
        overlay: { pins: log.map(l => { const [la, lo] = CAPITAL_COORDS[l.country]; return { lat: la, lon: lo, color: l.km <= GOOD_KM ? '#22c55e' : '#f97316', label: l.capital } }) },
      })
      return
    }
    if (!guess) { onGlobe({ onClick, spin: false }); return }
    const [tLat, tLon] = target
    const midLon = guess.lon + ((((tLon - guess.lon) + 540) % 360) - 180) / 2
    onGlobe({
      onClick, spin: false,
      guesses: [{ name: country, color: '#39ff14' }],
      overlay: {
        lines: [{ type: 'arc', from: [guess.lon, guess.lat], to: [tLon, tLat], color: '#facc15', width: 4, dash: [14, 10] }],
        pins: [
          { lon: guess.lon, lat: guess.lat, color: '#ff3366' },
          { lon: tLon, lat: tLat, color: '#22c55e', label: capital, ring: 22 },
        ],
      },
      flyTo: { lon: midLon, lat: (guess.lat + tLat) / 2, zoom: guess.km > 4000 ? 3.6 : guess.km > 1500 ? 3.1 : 2.4, hold: 600000 },
    })
  }, [phase, guess, onClick, round, log]) // eslint-disable-line react-hooks/exhaustive-deps

  if (phase === 'setup') {
    return <SetupCard mode={MODE} icon="📍" title={t('Capital Drop')} desc={t('Drop a pin on each capital')} options={OPTIONS} rules={RULES} onStart={begin} />
  }

  if (phase === 'over') {
    const avg = Math.round(log.reduce((s, l) => s + l.km, 0) / log.length)
    const bestScore = loadResults().filter(r => r.mode === MODE && r.details?.region === setup.region).reduce((m, r) => Math.max(m, r.score), 0)
    return (
      <div className="gg">
        <div className="gg-over">
          <div className="gg-over-big">{total.toLocaleString(locale)}<small> / {(log.length * 1000).toLocaleString(locale)}</small></div>
          <div className="gg-sub">{t('avg')} {fmtKm(avg)} {t('off ·')} {total >= bestScore ? t('🎉 Personal best') : t('best {v}', { v: bestScore.toLocaleString(locale) })} · {setup.region}</div>
          <div className="gg-list">
            {log.map((l, i) => (
              <div key={i} className="gg-list-row">
                <span>{COUNTRY_INFO[l.country]?.flag} {l.capital}</span>
                <span className="gg-dim">{fmtKm(l.km)}</span>
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

  return (
    <div className="gg">
      <div className="gg-head">
        <span className="gg-round">{t('Round')} {round + 1}/{queue.length}</span>
        <span className="gg-score">{total.toLocaleString(locale)} {t('pts')}</span>
      </div>
      <div className="gg-prompt">
        <span className="gg-prompt-label">{t('Click on')}</span>
        <span className="gg-prompt-big">{capital}</span>
        <span className="gg-prompt-sub">{COUNTRY_INFO[country]?.flag} {cn(country)}</span>
      </div>
      {guess ? (
        <div className={`gg-result ${guess.km <= GOOD_KM ? 'ok' : 'bad'}`}>
          <div className="gg-result-km">{fmtKm(guess.km)}</div>
          <div className="gg-result-txt">{verdict(guess.km)} · +{guess.pts} {t('pts')}</div>
          <button className="arc-primary" onClick={next}>{round + 1 >= queue.length ? t('See results') : t('Next')} <kbd>{t('Enter')}</kbd></button>
        </div>
      ) : (
        <div className="gg-hint">{t('🖱️ Click the globe to drop your pin')}</div>
      )}
    </div>
  )
}
