import { useCallback, useEffect, useMemo, useState } from 'react'
import SetupCard from './SetupCard'
import { COUNTRY_TZ, zoneOffsetMin, countryOffsets } from '../utils/countryTimezones'
import { CAPITAL_COORDS } from '../utils/capitalCoords'
import { CAPITALS } from '../utils/capitals'
import { COUNTRY_INFO } from '../utils/countryInfo'
import { shuffle, countryAt, fmtOffset, clockAt } from '../quizzes/globeGames'
import { startSession, trackAnswer, finishGame, loadResults } from '../utils/results'
import { playCorrect, playWrong, playWin } from '../utils/sounds'
import { t, cn } from '../i18n'

const MODE = 'time-zones'
const ROUNDS = 10
const OPTIONS = [{
  id: 'level', label: t('Difficulty'),
  choices: [
    { value: 'easy', label: t('🟢 Easy'), hint: t('Whole-hour differences, well-known places') },
    { value: 'hard', label: t('🔴 Hard'), hint: t('Any country — half-hour zones included') },
  ],
}]
const RULES = [
  t('You get the real current time in one capital and a target time.'),
  t('Click any country where it is that time right now (daylight saving included).'),
  t('Countries with several time zones count if any of their zones matches.'),
  t('After each click, every correct country lights up green.'),
]
const WELL_KNOWN = new Set(['United Kingdom', 'France', 'Germany', 'Russia', 'United States of America', 'Canada', 'Brazil', 'Argentina', 'Mexico', 'China', 'Japan', 'India', 'Australia', 'Egypt', 'South Africa', 'Turkey', 'Saudi Arabia', 'Indonesia', 'Thailand', 'Kenya', 'Nigeria', 'Peru', 'Chile', 'Colombia', 'Spain', 'Italy', 'Greece', 'Romania', 'Ukraine', 'Iran', 'Pakistan', 'Bangladesh', 'Vietnam', 'Philippines', 'South Korea', 'New Zealand', 'United Arab Emirates', 'Kazakhstan', 'Mongolia', 'Portugal', 'Iceland', 'Morocco', 'Ethiopia', 'Venezuela', 'Cuba'])

function makeRound(pool, level, at) {
  for (let t = 0; t < 100; t++) {
    const [ref, tgt] = shuffle(pool).slice(0, 2)
    const refOff = zoneOffsetMin(COUNTRY_TZ[ref][0], at)
    const tgtOff = zoneOffsetMin(COUNTRY_TZ[tgt][0], at)
    if (refOff === tgtOff) continue
    if (level === 'easy' && (tgtOff - refOff) % 60 !== 0) continue
    return { ref, refOff, tgtOff }
  }
  return null
}

const diffLabel = (d) => {
  const a = Math.abs(d), h = Math.floor(a / 60), m = a % 60
  return `${d > 0 ? '+' : '−'}${h ? `${h} h` : ''}${m ? ` ${m} min` : ''}`.trim()
}

export default function TimeZonesPanel({ gameCountries, onGlobe }) {
  const [phase, setPhase] = useState('setup')
  const [setup, setSetup] = useState(null)
  const [rounds, setRounds] = useState([])
  const [idx, setIdx] = useState(0)
  const [answer, setAnswer] = useState(null)   // { name, ok, offs }
  const [log, setLog] = useState([])
  const [now, setNow] = useState(new Date())

  const byName = useMemo(() => Object.fromEntries(gameCountries.map(f => [f.properties.NAME, f])), [gameCountries])
  const round = rounds[idx]
  const correctSet = useMemo(() => {
    if (!round) return []
    return gameCountries.map(f => f.properties.NAME).filter(n => COUNTRY_TZ[n] && countryOffsets(n, now).includes(round.tgtOff))
  }, [round, gameCountries]) // eslint-disable-line react-hooks/exhaustive-deps
  const score = log.filter(l => l.ok).length

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 10000)
    return () => clearInterval(t)
  }, [])

  const begin = useCallback((values) => {
    const at = new Date()
    const pool = Object.keys(COUNTRY_TZ).filter(n => byName[n] && CAPITAL_COORDS[n] && (values.level === 'hard' || WELL_KNOWN.has(n)))
    const rs = []
    for (let i = 0; i < ROUNDS; i++) { const r = makeRound(pool, values.level, at); if (r) rs.push(r) }
    startSession(MODE)
    setSetup(values); setRounds(rs); setIdx(0); setAnswer(null); setLog([]); setNow(at)
    setPhase('playing')
  }, [byName])

  const onClick = useCallback((lon, lat) => {
    if (phase !== 'playing' || answer || !round) return
    const f = countryAt(gameCountries, lon, lat)
    if (!f) return
    const name = f.properties.NAME
    if (!COUNTRY_TZ[name]) return
    const offs = countryOffsets(name, now)
    const ok = offs.includes(round.tgtOff)
    trackAnswer(MODE, null, ok, 0, `${round.ref}>${fmtOffset(round.tgtOff)}`)
    ;(ok ? playCorrect : playWrong)()
    setAnswer({ name, ok, offs })
    setLog(l => [...l, { ok, name }])
  }, [phase, answer, round, gameCountries, now])

  const next = useCallback(() => {
    if (!answer) return
    if (idx + 1 >= rounds.length) {
      finishGame(MODE, { score: log.filter(l => l.ok).length, completed: true, meta: { level: setup.level } })
      playWin()
      setPhase('over')
    } else { setIdx(i => i + 1); setAnswer(null) }
  }, [answer, idx, rounds.length, setup])

  useEffect(() => {
    const onKey = (e) => {
      if ((e.key === 'Enter' || e.key === ' ') && phase === 'playing' && answer) { e.preventDefault(); next() }
      else if (e.key === 'Enter' && phase === 'over') { e.preventDefault(); begin(setup) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [phase, answer, next, begin, setup])

  // Globe
  useEffect(() => {
    if (phase !== 'playing' || !round) { onGlobe({}); return }
    const [la, lo] = CAPITAL_COORDS[round.ref]
    const pin = { lat: la, lon: lo, color: '#facc15', label: `${CAPITALS[round.ref][0]} ${clockAt(round.refOff, now)}` }
    if (!answer) { onGlobe({ onClick, spin: false, overlay: { pins: [pin] }, flyTo: { lon: lo, lat: la, zoom: 3.6, hold: 600000, _k: idx } }); return }
    onGlobe({
      onClick, spin: false,
      guesses: [
        ...correctSet.map(n => ({ name: n, color: '#39ff14' })),
        ...(answer.ok ? [] : [{ name: answer.name, color: '#ef4444' }]),
      ],
      overlay: { pins: [pin] },
    })
  }, [phase, round, answer, onClick, correctSet]) // eslint-disable-line react-hooks/exhaustive-deps

  if (phase === 'setup') {
    return <SetupCard mode={MODE} icon="🕰️" title={t('Time Zones')} desc={t('Find where it\'s that time right now')} options={OPTIONS} rules={RULES} onStart={begin} />
  }

  if (phase === 'over') {
    const best = loadResults().filter(r => r.mode === MODE && r.details?.level === setup.level).reduce((m, r) => Math.max(m, r.correct), 0)
    return (
      <div className="gg">
        <div className="gg-over">
          <div className="gg-over-big">{score}<small> / {log.length}</small></div>
          <div className="gg-sub">{score >= best ? t('🎉 Personal best') : t('best {best}/{ROUNDS}', { best: best, ROUNDS: ROUNDS })} · {setup.level === 'easy' ? t('Easy') : t('Hard')}</div>
          <div className="gg-btns">
            <button className="arc-primary" onClick={() => begin(setup)}>{t('▶ Play again')} <kbd>{t('Enter')}</kbd></button>
            <button className="arc-secondary" onClick={() => setPhase('setup')}>{t('Settings')}</button>
          </div>
        </div>
      </div>
    )
  }

  if (!round) return <div className="gg"><div className="gg-sub">{t('Couldn\'t build a round — try again.')}</div></div>

  const diff = round.tgtOff - round.refOff
  return (
    <div className="gg">
      <div className="gg-head">
        <span className="gg-round">{t('Round')} {idx + 1}/{rounds.length}</span>
        <span className="gg-score">✓ {score}</span>
      </div>
      <div className="gg-clocks">
        <div className="gg-clock">
          <span className="gg-clock-place">{COUNTRY_INFO[round.ref]?.flag} {CAPITALS[round.ref][0]}</span>
          <span className="gg-clock-time">{clockAt(round.refOff, now)}</span>
          <span className="gg-clock-off">{fmtOffset(round.refOff)}</span>
        </div>
        <span className="gg-clock-arrow">→</span>
        <div className="gg-clock gg-clock-target">
          <span className="gg-clock-place">{t('Where is it…')}</span>
          <span className="gg-clock-time">{clockAt(round.tgtOff, now)}</span>
          <span className="gg-clock-off">{answer ? fmtOffset(round.tgtOff) : '?'}</span>
        </div>
      </div>
      {answer ? (
        <div className={`gg-result ${answer.ok ? 'ok' : 'bad'}`}>
          <div className="gg-result-txt">
            {answer.ok ? '✓' : '✗'} {cn(answer.name)}: {answer.offs.map(o => clockAt(o, now)).join(' / ')}
          </div>
          <div className="gg-sub">{t('Answer:')} {fmtOffset(round.tgtOff)} ({diffLabel(diff)} {t('from')} {CAPITALS[round.ref][0]}) · {t(correctSet.length === 1 ? '{n} country lit up' : '{n} countries lit up', { n: correctSet.length })}</div>
          <button className="arc-primary" onClick={next}>{idx + 1 >= rounds.length ? t('See results') : t('Next')} <kbd>{t('Enter')}</kbd></button>
        </div>
      ) : (
        <div className="gg-hint">{t('🖱️ Click a country where it\'s')} {clockAt(round.tgtOff, now)} {t('right now')}</div>
      )}
    </div>
  )
}
