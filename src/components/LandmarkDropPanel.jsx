import { useCallback, useEffect, useMemo, useState } from 'react'
import SetupCard from './SetupCard'
import GameHeader from './GameHeader'
import { LANDMARKS } from '../utils/landmarks'
import { distanceKm } from '../utils/capitalCoords'
import { COUNTRY_INFO } from '../utils/countryInfo'
import { REGIONS } from '../quizzes/tableQuizzes'
import { shuffle, fmtKm, dropPoints } from '../quizzes/globeGames'
import { startSession, trackAnswer, finishGame, loadResults } from '../utils/results'
import { playCorrect, playWrong, playWin } from '../utils/sounds'
import { t, cn, isRo, continentName, locale } from '../i18n'

const MODE = 'landmark-drop'
const ROUNDS = 10
const GOOD_KM = 300

const lmName = (l) => isRo ? l.ro : l.name
const regionOf = (l) => COUNTRY_INFO[l.country]?.continent
const REGION_CHOICES = REGIONS.filter(r => r === 'World' || LANDMARKS.filter(l => regionOf(l) === r).length >= ROUNDS)

const OPTIONS = [
  {
    id: 'region', label: t('Region'),
    choices: REGION_CHOICES.map(r => ({ value: r, label: r === 'World' ? '🌍 ' + continentName(r) : continentName(r) })),
  },
  {
    id: 'type', label: t('Landmarks'),
    choices: [
      { value: 'all',    label: t('🌐 All'),         hint: t('Monuments and natural wonders') },
      { value: 'built',  label: t('🏛️ Monuments'),   hint: t('Buildings, statues, ruins and cities') },
      { value: 'nature', label: t('🏔️ Nature'),      hint: t('Mountains, waterfalls, lakes and canyons') },
    ],
  },
  {
    id: 'hint', label: t('Hint'),
    choices: [
      { value: 'country', label: t('🏳️ Show country'), hint: t('You see which country it is in') },
      { value: 'none',    label: t('🙈 No hint'),      hint: t('Only the name — much harder') },
    ],
  },
]
const RULES = [
  t('{n} famous places. Click on the globe where you think each one is.', { n: ROUNDS }),
  t('Points depend on the real great-circle distance: 1000 for a bullseye (≤ 25 km), about half at 700 km.'),
  t('Within {GOOD_KM} km counts as a hit.', { GOOD_KM }),
  t('Drag to rotate, scroll to zoom — the click only counts when you don\'t drag.'),
]

const verdict = (km) => km <= 25 ? t('🎯 Bullseye!') : km <= 150 ? t('🔥 Very close') : km <= GOOD_KM ? t('👍 Close') : km <= 1000 ? t('🙂 Not bad') : km <= 3000 ? t('😬 Far off') : t('🧭 Way off')

export default function LandmarkDropPanel({ onGlobe }) {
  const [phase, setPhase] = useState('setup')
  const [setup, setSetup] = useState(null)
  const [queue, setQueue] = useState([])
  const [round, setRound] = useState(0)
  const [guess, setGuess] = useState(null)   // { lon, lat, km, pts }
  const [log, setLog] = useState([])         // [{ lm, km, pts }]

  const lm = queue[round] ?? null
  const total = log.reduce((s, l) => s + l.pts, 0)
  const settingsKey = setup ? `${setup.region}|${setup.type}|${setup.hint}` : ''

  const begin = useCallback((values) => {
    let pool = LANDMARKS.filter(l =>
      (values.region === 'World' || regionOf(l) === values.region) &&
      (values.type === 'all' || l.type === values.type))
    if (pool.length < 5) pool = LANDMARKS.filter(l => values.region === 'World' || regionOf(l) === values.region)
    // at most 2 landmarks from the same country per game, so it doesn't feel repetitive
    const perCountry = {}
    const picked = shuffle(pool).filter(l => (perCountry[l.country] = (perCountry[l.country] ?? 0) + 1) <= 2).slice(0, ROUNDS)
    startSession(MODE)
    setSetup(values); setQueue(picked); setRound(0); setGuess(null); setLog([])
    setPhase('playing')
  }, [])

  const onClick = useCallback((lon, lat) => {
    if (phase !== 'playing' || guess || !lm) return
    const km = distanceKm([lat, lon], [lm.lat, lm.lon])
    const pts = dropPoints(km)
    trackAnswer(MODE, null, km <= GOOD_KM, 0, lm.id)
    ;(km <= GOOD_KM ? playCorrect : playWrong)()
    setGuess({ lon, lat, km, pts })
    setLog(l => [...l, { lm, km, pts }])
  }, [phase, guess, lm])

  const next = useCallback(() => {
    if (!guess) return
    if (round + 1 >= queue.length) {
      finishGame(MODE, {
        score: log.reduce((s, l) => s + l.pts, 0), completed: true,
        meta: { settings: settingsKey, avgKm: Math.round(log.reduce((s, l) => s + l.km, 0) / log.length) },
      })
      playWin()
      setPhase('over')
    } else {
      setRound(r => r + 1)
      setGuess(null)
    }
  }, [guess, round, queue.length, log, settingsKey])

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
    if (phase === 'setup') { onGlobe({}); return }
    if (phase === 'over') {
      onGlobe({ overlay: { pins: log.map(l => ({ lat: l.lm.lat, lon: l.lm.lon, color: l.km <= GOOD_KM ? '#22c55e' : '#f97316', label: `${l.lm.emoji} ${lmName(l.lm)}` })) } })
      return
    }
    if (!guess) { onGlobe({ onClick }); return }
    const midLon = guess.lon + ((((lm.lon - guess.lon) + 540) % 360) - 180) / 2
    onGlobe({
      onClick,
      guesses: [{ name: lm.country, color: '#39ff14' }],
      overlay: {
        lines: [{ type: 'arc', from: [guess.lon, guess.lat], to: [lm.lon, lm.lat], color: '#facc15', width: 4, dash: [14, 10] }],
        pins: [
          { lon: guess.lon, lat: guess.lat, color: '#ff3366' },
          { lon: lm.lon, lat: lm.lat, color: '#22c55e', label: `${lm.emoji} ${lmName(lm)}`, ring: 22 },
        ],
      },
      flyTo: { lon: midLon, lat: (guess.lat + lm.lat) / 2, zoom: guess.km > 4000 ? 3.6 : guess.km > 1500 ? 3.1 : 2.4, hold: 600000 },
    })
  }, [phase, guess, onClick, round, log]) // eslint-disable-line react-hooks/exhaustive-deps

  if (phase === 'setup') {
    return <SetupCard mode={MODE} icon="🗽" title={t('Landmark Drop')} desc={t('Find famous places on the globe')} options={OPTIONS} rules={RULES} onStart={begin} />
  }

  if (phase === 'over') {
    const avg = Math.round(log.reduce((s, l) => s + l.km, 0) / log.length)
    const bestScore = loadResults().filter(r => r.mode === MODE && r.details?.settings === settingsKey).reduce((m, r) => Math.max(m, r.score), 0)
    return (
      <div className="gg">
        <GameHeader icon="🗽" title={t('Landmark Drop')} />
        <div className="gg-over">
          <div className="gg-over-big">{total.toLocaleString(locale)}<small> / {(log.length * 1000).toLocaleString(locale)}</small></div>
          <div className="gg-sub">{t('avg')} {fmtKm(avg)} {t('off ·')} {total >= bestScore ? t('🎉 Personal best') : t('best {v}', { v: bestScore.toLocaleString(locale) })} · {continentName(setup.region)}</div>
          <div className="gg-list">
            {log.map((l, i) => (
              <div key={i} className="gg-list-row">
                <span>{l.lm.emoji} {lmName(l.lm)} <span className="gg-dim">· {COUNTRY_INFO[l.lm.country]?.flag}</span></span>
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

  const showCountry = setup.hint === 'country' || !!guess
  return (
    <div className="gg">
        <GameHeader icon="🗽" title={t('Landmark Drop')} />
      <div className="gg-head">
        <span className="gg-round">{t('Round')} {round + 1}/{queue.length}</span>
        <span className="gg-score">{total.toLocaleString(locale)} {t('pts')}</span>
      </div>
      <div className="gg-prompt">
        <span className="gg-prompt-label">{t('Where is…')}</span>
        <span className="gg-prompt-emoji">{lm.emoji}</span>
        <span className="gg-prompt-big">{lmName(lm)}</span>
        <span className="gg-prompt-sub">
          {showCountry ? <>{COUNTRY_INFO[lm.country]?.flag} {cn(lm.country)}{guess ? ` · ${lm.where}` : ''}</> : t('No hint — trust your instincts')}
        </span>
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
