import { useCallback, useEffect, useState } from 'react'
import SetupCard from './SetupCard'
import GameHeader from './GameHeader'
import { CAPITAL_COORDS, distanceKm } from '../utils/capitalCoords'
import { CAPITALS } from '../utils/capitals'
import { COUNTRY_INFO } from '../utils/countryInfo'
import { REGIONS } from '../quizzes/tableQuizzes'
import { shuffle, fmtKm, dropPoints } from '../quizzes/globeGames'
import { startSession, trackAnswer, finishGame, loadResults } from '../utils/results'
import { playCorrect, playWrong, playWin } from '../utils/sounds'
import { t, cn, continentName, locale } from '../i18n'
import { useGameHud } from '../utils/hudStore'

const MODE = 'antipodes'
const ROUNDS = 8
const GOOD_KM = 500

/** The point exactly on the other side of the Earth. */
export const antipode = (lat, lon) => [-lat, lon > 0 ? lon - 180 : lon + 180]

const OPTIONS = [{
  id: 'region', label: t('Start from'),
  choices: REGIONS.map(r => ({ value: r, label: r === 'World' ? '🌍 ' + continentName(r) : continentName(r) })),
}]
const RULES = [
  t('You get a capital city. Click the spot exactly on the opposite side of the Earth.'),
  t('Tip: flip the latitude (north ↔ south) and add 180° to the longitude.'),
  t('Most antipodes are in the ocean — that\'s part of the fun.'),
  t('Points depend on how far you are from the real antipode; within {GOOD_KM} km counts as a hit.', { GOOD_KM }),
]

const verdict = (km) => km <= 50 ? t('🎯 Bullseye!') : km <= 250 ? t('🔥 Very close') : km <= GOOD_KM ? t('👍 Close') : km <= 1500 ? t('🙂 Not bad') : km <= 4000 ? t('😬 Far off') : t('🧭 Way off')

export default function AntipodePanel({ onGlobe }) {
  const [phase, setPhase] = useState('setup')
  const [setup, setSetup] = useState(null)
  const [queue, setQueue] = useState([])
  const [round, setRound] = useState(0)
  const [guess, setGuess] = useState(null)   // { lon, lat, km, pts }
  const [log, setLog] = useState([])

  const country = queue[round]
  const from = country ? CAPITAL_COORDS[country] : null
  const target = from ? antipode(from[0], from[1]) : null
  const capital = country ? CAPITALS[country]?.[0] : ''
  const total = log.reduce((s, l) => s + l.pts, 0)

  const begin = useCallback((values) => {
    const pool = Object.keys(CAPITAL_COORDS).filter(n => CAPITALS[n] && (values.region === 'World' || COUNTRY_INFO[n]?.continent === values.region))
    startSession(MODE)
    setSetup(values); setQueue(shuffle(pool).slice(0, ROUNDS)); setRound(0); setGuess(null); setLog([])
    setPhase('playing')
  }, [])

  const onClick = useCallback((lon, lat) => {
    if (phase !== 'playing' || guess || !target) return
    const km = distanceKm([lat, lon], target)
    const pts = dropPoints(km * 0.6)            // a bit more forgiving than Capital Drop — this is hard
    trackAnswer(MODE, null, km <= GOOD_KM, 0, `antipode:${country}`)
    ;(km <= GOOD_KM ? playCorrect : playWrong)()
    setGuess({ lon, lat, km, pts })
    setLog(l => [...l, { country, capital, km, pts }])
  }, [phase, guess, target, country, capital])

  const next = useCallback(() => {
    if (!guess) return
    if (round + 1 >= queue.length) {
      finishGame(MODE, { score: log.reduce((s, l) => s + l.pts, 0), completed: true, meta: { region: setup.region } })
      playWin()
      setPhase('over')
    } else { setRound(r => r + 1); setGuess(null) }
  }, [guess, round, queue.length, log, setup])

  useEffect(() => {
    const onKey = (e) => {
      if ((e.key === 'Enter' || e.key === ' ') && phase === 'playing' && guess) { e.preventDefault(); next() }
      else if (e.key === 'Enter' && phase === 'over') { e.preventDefault(); begin(setup) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [phase, guess, next, begin, setup])

  // Globe
  useEffect(() => {
    if (phase !== 'playing' || !from) { onGlobe({}); return }
    const home = { lat: from[0], lon: from[1], color: '#facc15', label: `${capital}` }
    if (!guess) {
      onGlobe({ onClick, guesses: [{ name: country, color: '#facc15' }], overlay: { pins: [home] }, flyTo: { lon: from[1], lat: from[0], zoom: 3.2, hold: 600000, _k: round } })
      return
    }
    const [tLat, tLon] = target
    onGlobe({
      onClick,
      guesses: [{ name: country, color: '#facc15' }],
      overlay: {
        lines: [{ type: 'arc', from: [guess.lon, guess.lat], to: [tLon, tLat], color: '#facc15', width: 4, dash: [14, 10] }],
        pins: [home, { lon: guess.lon, lat: guess.lat, color: '#ff3366' }, { lon: tLon, lat: tLat, color: '#22c55e', label: t('Antipode'), ring: 24 }],
      },
      flyTo: { lon: tLon, lat: tLat, zoom: guess.km > 3000 ? 3.6 : 3.0, hold: 600000, _k: `r${round}` },
    })
  }, [phase, guess, onClick, round]) // eslint-disable-line react-hooks/exhaustive-deps

  // Phones: key numbers stay visible over the globe
  useGameHud(phase === 'playing' ? [{ icon: '🔁', text: `${round + 1}/${queue.length}` }, { text: `${total.toLocaleString(locale)} ${t('pts')}` }] : null)
  if (phase === 'setup') {
    return <SetupCard mode={MODE} icon="🔄" title={t('Antipodes')} desc={t('Find the other side of the world')} options={OPTIONS} rules={RULES} onStart={begin} />
  }

  if (phase === 'over') {
    const best = loadResults().filter(r => r.mode === MODE && r.details?.region === setup.region).reduce((m, r) => Math.max(m, r.score), 0)
    return (
      <div className="gg">
        <GameHeader icon="🔄" title={t('Antipodes')} />
        <div className="gg-over">
          <div className="gg-over-big">{total.toLocaleString(locale)}<small> / {(log.length * 1000).toLocaleString(locale)}</small></div>
          <div className="gg-sub">{total >= best ? t('🎉 Personal best') : t('best {v}', { v: best.toLocaleString(locale) })} · {continentName(setup.region)}</div>
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

  const fmtCoord = (lat, lon) => `${Math.abs(lat).toFixed(1)}°${lat >= 0 ? 'N' : 'S'}, ${Math.abs(lon).toFixed(1)}°${lon >= 0 ? 'E' : t('W')}`
  return (
    <div className="gg">
      <GameHeader icon="🔄" title={t('Antipodes')} />
      <div className="gg-head">
        <span className="gg-round">{t('Round')} {round + 1}/{queue.length}</span>
        <span className="gg-score">{total.toLocaleString(locale)} {t('pts')}</span>
      </div>
      <div className="gg-prompt">
        <span className="gg-prompt-label">{t('What is on the other side of…')}</span>
        <span className="gg-prompt-big">{COUNTRY_INFO[country]?.flag} {capital}</span>
        <span className="gg-prompt-sub">{cn(country)} · {fmtCoord(from[0], from[1])}</span>
      </div>
      {guess ? (
        <div className={`gg-result ${guess.km <= GOOD_KM ? 'ok' : 'bad'}`}>
          <div className="gg-result-km">{fmtKm(guess.km)}</div>
          <div className="gg-result-txt">{verdict(guess.km)} · +{guess.pts} {t('pts')}</div>
          <div className="gg-sub">{t('Antipode')}: {fmtCoord(target[0], target[1])}</div>
          <button className="arc-primary" onClick={next}>{round + 1 >= queue.length ? t('See results') : t('Next')} <kbd>{t('Enter')}</kbd></button>
        </div>
      ) : (
        <div className="gg-hint">{t('🖱️ Rotate the globe and click the opposite point')}</div>
      )}
    </div>
  )
}
