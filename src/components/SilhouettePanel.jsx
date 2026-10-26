import { useCallback, useEffect, useRef, useState } from 'react'
import SetupCard from './SetupCard'
import { resolveAlias } from '../utils/aliases'
import { COUNTRY_AREA } from '../utils/countryArea'
import { shuffle } from '../quizzes/globeGames'
import { startSession, trackAnswer, finishGame, loadResults } from '../utils/results'
import { playCorrect, playWrong, playStreak } from '../utils/sounds'
import { geoCentroid } from 'd3-geo'
import { t, cn } from '../i18n'

const MODE = 'silhouette'
const LIVES = 3
const START_S = 12, MIN_S = 4, STEP_S = 0.5

const OPTIONS = [{
  id: 'pool', label: t('Countries'),
  choices: [
    { value: 'big', label: t('🌍 Well known'), hint: t('Countries larger than 100,000 km²') },
    { value: 'all', label: t('🔬 All'), hint: t('Every country — tiny islands included') },
  ],
}]
const RULES = [
  t('One country lights up on an empty globe and the globe spins to it.'),
  t('Type its name before the clock runs out — you start with {START_S} s.', { START_S: START_S }),
  t('Every correct answer makes the clock a little shorter.'),
  t('Run out of time {LIVES} times and it\'s over. Tab skips (costs a life).', { LIVES: LIVES }),
]

const best = () => loadResults().filter(r => r.mode === MODE).reduce((m, r) => Math.max(m, r.score), 0)

export default function SilhouettePanel({ gameCountries, onGlobe }) {
  const [phase, setPhase] = useState('setup')
  const [setup, setSetup] = useState(null)
  const [queue, setQueue] = useState([])
  const [idx, setIdx] = useState(0)
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(LIVES)
  const [limit, setLimit] = useState(START_S)
  const [deadline, setDeadline] = useState(0)
  const [now, setNow] = useState(Date.now())
  const [input, setInput] = useState('')
  const [reveal, setReveal] = useState(null)   // { name, ok }
  const [missed, setMissed] = useState([])
  const [record, setRecord] = useState(0)
  const inputRef = useRef(null)
  const timer = useRef(null)
  const scoreRef = useRef(0)
  scoreRef.current = score

  const current = queue[idx] ?? null

  // Globe: only the current country is visible
  useEffect(() => {
    if (phase === 'setup') { onGlobe({ soloMode: true }); return }
    const show = phase === 'over' ? null : current
    const [lon, lat] = current ? geoCentroid(current) : [0, 0]
    onGlobe({
      soloMode: true,
      highlighted: reveal ? null : show,
      guesses: reveal && current ? [{ name: current.properties.NAME, color: reveal.ok ? '#39ff14' : '#ef4444' }] : [],
      missed: phase === 'over' ? missed : [],
      flyTo: current && phase === 'playing' ? { lon, lat, zoom: 2.6, hold: 60000, _k: idx } : null,
      spin: false,
    })
  }, [phase, current, reveal, missed]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => () => clearTimeout(timer.current), [])

  const begin = useCallback((values) => {
    const pool = values.pool === 'big'
      ? gameCountries.filter(f => (COUNTRY_AREA[f.properties.NAME] ?? 0) >= 100000)
      : gameCountries
    startSession(MODE)
    setSetup(values); setQueue(shuffle(pool)); setIdx(0)
    setScore(0); setLives(LIVES); setLimit(START_S); setMissed([]); setReveal(null); setInput('')
    setDeadline(Date.now() + START_S * 1000); setNow(Date.now()); setRecord(best())
    setPhase('playing')
    setTimeout(() => inputRef.current?.focus(), 60)
  }, [gameCountries])

  const advance = useCallback((ok, nextLimit, livesLeft) => {
    timer.current = setTimeout(() => {
      setReveal(null); setInput('')
      if (livesLeft <= 0 || idx + 1 >= queue.length) {
        if (livesLeft > 0) finishGame(MODE, { score: scoreRef.current, completed: true, meta: { pool: setup?.pool } })
        setPhase('over')
        return
      }
      setIdx(i => i + 1)
      setDeadline(Date.now() + nextLimit * 1000)
      setTimeout(() => inputRef.current?.focus(), 30)
    }, ok ? 650 : 1500)
  }, [idx, queue.length, setup])

  const fail = useCallback(() => {
    if (!current || reveal) return
    const name = current.properties.NAME
    trackAnswer(MODE, name, false)
    playWrong()
    const left = lives - 1
    setLives(left)
    setMissed(m => [...m, current])
    setReveal({ name, ok: false })
    if (left <= 0) finishGame(MODE, { score, completed: true, meta: { pool: setup.pool } })
    advance(false, limit, left)
  }, [current, reveal, lives, score, setup, limit, advance])

  // Clock
  useEffect(() => {
    if (phase !== 'playing' || reveal) return
    const t = setInterval(() => {
      const n = Date.now()
      setNow(n)
      if (n >= deadline) fail()
    }, 100)
    return () => clearInterval(t)
  }, [phase, reveal, deadline, fail])

  const onType = (val) => {
    setInput(val)
    if (!current || reveal) return
    const names = gameCountries.map(f => f.properties.NAME)
    if (resolveAlias(val, names) !== current.properties.NAME) return
    const name = current.properties.NAME
    const n = score + 1
    trackAnswer(MODE, name, true, 0)
    ;(n % 10 === 0 ? playStreak : playCorrect)()
    setScore(n)
    const nextLimit = Math.max(MIN_S, limit - STEP_S)
    setLimit(nextLimit)
    setReveal({ name, ok: true })
    advance(true, nextLimit, lives)
  }

  const finishEarly = () => {
    finishGame(MODE, { score, completed: true, meta: { pool: setup.pool } })
    setPhase('over')
  }

  if (phase === 'setup') {
    return (
      <SetupCard mode={MODE} icon="🌀" title={t('Silhouette Spin')} desc={t('Name the glowing country before time runs out')}
        options={OPTIONS} rules={RULES} typeToStart onStart={(v, typed) => { begin(v); if (typed) setInput(typed) }} />
    )
  }

  const leftMs = Math.max(0, deadline - now)
  const pct = reveal ? 0 : (leftMs / (limit * 1000)) * 100

  return (
    <div className="gg">
      <div className="gg-head">
        <span className="gg-score">✓ {score}</span>
        <span className="gg-lives">{'❤️'.repeat(lives)}{'🖤'.repeat(LIVES - lives)}</span>
        <span className="gg-best">{t('Best')} {Math.max(record, score)}</span>
      </div>

      {phase === 'playing' && (
        <>
          <div className="gg-timer"><span className={leftMs < 3000 ? 'low' : ''} style={{ width: `${pct}%` }} /></div>
          <div className="gg-sub">{(leftMs / 1000).toFixed(1)} {t('s · clock now')} {limit} {t('s per country')}</div>
          <input
            ref={inputRef}
            className={`missing-input${reveal ? (reveal.ok ? ' correct' : ' wrong') : ''}`}
            value={input}
            onChange={e => onType(e.target.value)}
            onKeyDown={e => { if (e.key === 'Tab') { e.preventDefault(); fail() } }}
            placeholder={t('Which country is glowing?')}
            autoComplete="off" autoCorrect="off" spellCheck={false}
            disabled={!!reveal}
          />
          <div className="gg-reveal">
            {reveal && (reveal.ok ? <span className="ok">✓ {cn(reveal.name)}</span> : <span className="bad">{t('✗ It was')} {cn(reveal.name)}</span>)}
          </div>
          <button className="gg-link" onClick={finishEarly}>{t('End run')}</button>
        </>
      )}

      {phase === 'over' && (
        <div className="gg-over">
          <div className="gg-over-big">{score}<small> {t('named')}</small></div>
          <div className="gg-sub">{score > record ? t('🎉 New personal best!') : t('Your best: {record}', { record: record })}</div>
          {missed.length > 0 && <div className="gg-missed">{t('Missed:')} {missed.map(f => cn(f.properties.NAME)).join(', ')}</div>}
          <div className="gg-btns">
            <button className="arc-primary" onClick={() => begin(setup)}>{t('▶ Play again')}</button>
            <button className="arc-secondary" onClick={() => setPhase('setup')}>{t('Settings')}</button>
          </div>
        </div>
      )}
    </div>
  )
}
