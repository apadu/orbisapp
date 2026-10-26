import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import SetupCard from './SetupCard'
import FlagImg from './FlagImg'
import { HL_STATS, hlPool, hlNext, shortName } from '../quizzes/arcade'
import { COUNTRY_INFO } from '../utils/countryInfo'
import { startSession, trackAnswer, finishGame, loadResults } from '../utils/results'
import { playCorrect, playWrong, playStreak } from '../utils/sounds'
import { t } from '../i18n'

const MODE = 'higher-lower'
const OPTIONS = [{
  id: 'stat', label: t('Compare by'),
  choices: [
    { value: 'population', label: t('👥 Population'), hint: t('Which country has more people?') },
    { value: 'area',       label: t('📏 Area'),       hint: t('Which country is bigger?') },
    { value: 'mixed',      label: t('🎲 Mixed'),      hint: t('Population or area — changes every round') },
  ],
}]
const RULES = [
  t('You see one country\'s number. Guess if the next one is higher or lower.'),
  t('Get it right and the new country stays — keep the streak going.'),
  t('One mistake ends the run. Pairs get closer as your streak grows.'),
  t('Keys: ↑ / H = higher · ↓ / L = lower · Enter = play again'),
]

const bestStreak = (stat) => loadResults()
  .filter(r => r.mode === MODE && (!stat || r.details?.stat === stat))
  .reduce((m, r) => Math.max(m, r.score), 0)

function useCountUp(target, run, ms = 650) {
  const [v, setV] = useState(0)
  useEffect(() => {
    if (!run) { setV(0); return }
    let raf, t0
    const step = (t) => {
      t0 ??= t
      const k = Math.min(1, (t - t0) / ms)
      setV(target * (1 - Math.pow(1 - k, 3)))
      if (k < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [target, run, ms])
  return v
}

function Card({ country, stat, value, revealed, state, side }) {
  const s = HL_STATS[stat]
  const shown = useCountUp(value, side === 'right' && revealed)
  return (
    <div className={`hl-card hl-${side}${state ? ` hl-${state}` : ''}`}>
      <FlagImg emoji={COUNTRY_INFO[country]?.flag} className="hl-flag" title={country} />
      <div className="hl-name">{shortName(country)}</div>
      <div className="hl-stat-label">{s.icon} {s.label}</div>
      <div className="hl-value">
        {side === 'left' ? s.fmt(value) : revealed ? s.fmt(shown) : '?'}
      </div>
    </div>
  )
}

export default function HigherLower({ countryNames = [] }) {
  const [phase, setPhase] = useState('setup') // setup | playing | over
  const [setup, setSetup] = useState(null)
  const [left, setLeft]   = useState(null)
  const [right, setRight] = useState(null)
  const [stat, setStat]   = useState('population')
  const [streak, setStreak] = useState(0)
  const [reveal, setReveal] = useState(null)  // null | 'ok' | 'bad'
  const [best, setBest]   = useState(0)
  const seen = useRef(new Set())
  const timer = useRef(null)

  const pools = useMemo(() => ({
    population: hlPool(countryNames, 'population'),
    area: hlPool(countryNames, 'area'),
  }), [countryNames])

  const roundStat = (mode) => mode === 'mixed' ? (Math.random() < 0.5 ? 'population' : 'area') : mode

  const begin = useCallback((values) => {
    const mode = values.stat
    const st = roundStat(mode)
    const pool = pools[st]
    if (pool.length < 2) return
    const a = pool[Math.floor(Math.random() * pool.length)]
    seen.current = new Set([a])
    const b = hlNext(pool, a, st, 0, seen.current)
    seen.current.add(b)
    startSession(MODE)
    setSetup(values); setStat(st); setLeft(a); setRight(b)
    setStreak(0); setReveal(null); setBest(bestStreak(mode))
    setPhase('playing')
  }, [pools])

  useEffect(() => () => clearTimeout(timer.current), [])

  const guess = useCallback((higher) => {
    if (phase !== 'playing' || reveal) return
    const s = HL_STATS[stat]
    const a = s.value(left), b = s.value(right)
    const ok = b === a || (higher ? b > a : b < a)
    trackAnswer(MODE, right, ok, 0)
    setReveal(ok ? 'ok' : 'bad')
    if (ok) {
      const n = streak + 1
      ;(n % 5 === 0 ? playStreak : playCorrect)()
      timer.current = setTimeout(() => {
        // Keep the next card's stat in "mixed" mode; the survivor shows the new stat's value.
        const st = roundStat(setup.stat)
        const pool = pools[st].includes(right) ? pools[st] : pools[stat]
        const useStat = pools[st].includes(right) ? st : stat
        if (seen.current.size > pool.length - 5) seen.current = new Set([right])
        const next = hlNext(pool, right, useStat, n, seen.current)
        seen.current.add(next)
        setLeft(right); setRight(next); setStat(useStat)
        setStreak(n); setReveal(null)
      }, 1100)
    } else {
      playWrong()
      timer.current = setTimeout(() => {
        finishGame(MODE, { score: streak, completed: true, meta: { stat: setup.stat } })
        setBest(b => Math.max(b, streak))
        setPhase('over')
      }, 1400)
    }
  }, [phase, reveal, stat, left, right, streak, setup, pools])

  // Keyboard
  useEffect(() => {
    if (phase === 'setup') return
    const onKey = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      if (phase === 'playing') {
        if (e.key === 'ArrowUp' || e.key.toLowerCase() === 'h') { e.preventDefault(); guess(true) }
        if (e.key === 'ArrowDown' || e.key.toLowerCase() === 'l') { e.preventDefault(); guess(false) }
      } else if (phase === 'over' && e.key === 'Enter') { e.preventDefault(); begin(setup) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [phase, guess, begin, setup])

  if (phase === 'setup') {
    return (
      <div className="arc-wrap">
        <div className="arc-card">
          <SetupCard mode={MODE} icon="⚖️" title={t('Higher or Lower')} desc={t('Keep the streak alive')} options={OPTIONS} rules={RULES} onStart={begin} />
        </div>
      </div>
    )
  }

  const s = HL_STATS[stat]
  const newBest = phase === 'over' && streak > 0 && streak >= best

  return (
    <div className="arc-wrap">
      <div className="hl-top">
        <span className="hl-streak">🔥 {streak}</span>
        <span className="hl-q">{stat === 'population' ? t('Does {c} have more or fewer people?', { c: shortName(right) }) : t('Does {c} have a bigger or smaller area?', { c: shortName(right) })}</span>
        <span className="hl-best">{t('Best')} {Math.max(best, streak)}</span>
      </div>

      <div className={`hl-board${reveal ? ` hl-board-${reveal}` : ''}`} key={left}>
        <Card country={left} stat={stat} value={s.value(left)} side="left" />
        <div className="hl-vs">
          {phase === 'playing' && !reveal ? (
            <div className="hl-btns">
              <button className="hl-btn hl-up" onClick={() => guess(true)}>{t('▲ Higher')}</button>
              <span className="hl-vs-label">{t('vs')}</span>
              <button className="hl-btn hl-down" onClick={() => guess(false)}>{t('▼ Lower')}</button>
            </div>
          ) : (
            <span className={`hl-verdict ${reveal === 'ok' ? 'ok' : 'bad'}`}>{reveal === 'ok' ? '✓' : '✗'}</span>
          )}
        </div>
        <Card country={right} stat={stat} value={s.value(right)} side="right" revealed={!!reveal || phase === 'over'} state={reveal === 'ok' ? 'ok' : reveal === 'bad' || phase === 'over' ? 'bad' : null} />
      </div>

      {phase === 'over' && (
        <div className="arc-over">
          <div className="arc-over-big">{streak}<small> {t('in a row')}</small></div>
          <div className="arc-over-sub">{newBest ? t('🎉 New personal best!') : t('Your best: {best}', { best: best })}</div>
          <div className="arc-over-btns">
            <button className="arc-primary" onClick={() => begin(setup)}>{t('▶ Play again')} <kbd>{t('Enter')}</kbd></button>
            <button className="arc-secondary" onClick={() => setPhase('setup')}>{t('Settings')}</button>
          </div>
        </div>
      )}
    </div>
  )
}
