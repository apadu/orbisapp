import { useCallback, useEffect, useMemo, useState } from 'react'
import SetupCard from './SetupCard'
import { SCALE_THINGS } from '../data/scaleThings'
import { startSession, trackAnswer, finishGame, loadResults } from '../utils/results'
import { playCorrect, playWrong, playStreak } from '../utils/sounds'
import { t, isRo } from '../i18n'
import { plain } from '../utils/plain'
import Icon from './Icon'

/**
 * The Scale of Things: each round shows five things from a proton to the whole universe.
 * Tap them from the smallest to the biggest. One point for every thing in its right place.
 */
const MODE = 'scale-sort'
const PER_ROUND = 5
const WINDOW = 8           // the five come from eight neighbours on the scale, so they're close-ish
const OPTIONS = [{
  id: 'rounds', label: t('Rounds'),
  choices: [
    { value: '5', label: t('5 rounds'), hint: t('25 things to put in order') },
    { value: '10', label: t('10 rounds'), hint: t('50 things to put in order') },
  ],
}]
const RULES = [
  t('Each round shows five things: atoms, animals, buildings, planets, galaxies…'),
  t('Tap them from the smallest to the biggest. Tap a placed one to take it back.'),
  t('One point for every thing in its right place. Sizes are shown after each round.'),
  t('Keys: 1–5 = pick a card · Backspace = undo · Enter = check / next'),
]
const nameOf = (x) => (isRo ? x.ro : x.name)
const sizeOf = (x) => x.size[isRo ? 1 : 0]

function makeRound(used) {
  const n = SCALE_THINGS.length
  for (let tries = 0; tries < 50; tries++) {
    const start = Math.floor(Math.random() * (n - WINDOW + 1))
    const pool = SCALE_THINGS.slice(start, start + WINDOW).filter(x => !used.has(x.id))
    if (pool.length < PER_ROUND) continue
    const pick = [...pool].sort(() => Math.random() - 0.5).slice(0, PER_ROUND)
    return pick.sort(() => Math.random() - 0.5)
  }
  return [...SCALE_THINGS].sort(() => Math.random() - 0.5).slice(0, PER_ROUND)
}
const bestScore = () => loadResults().filter(r => r.mode === MODE && r.completed).reduce((m, r) => Math.max(m, r.total ? r.correct / r.total : 0), 0)

export default function SortQuiz() {
  const [phase, setPhase] = useState('setup')       // setup | playing | over
  const [setup, setSetup] = useState(null)
  const [round, setRound] = useState(0)
  const [cards, setCards] = useState([])            // this round's five, shuffled
  const [order, setOrder] = useState([])            // ids in the order the player tapped them
  const [checked, setChecked] = useState(false)
  const [score, setScore] = useState(0)
  const [used] = useState(() => new Set())
  const rounds = Number(setup?.rounds ?? 5)

  const begin = useCallback((values) => {
    used.clear()
    const first = makeRound(used)
    first.forEach(x => used.add(x.id))
    startSession(MODE)
    setSetup(values); setRound(1); setCards(first); setOrder([]); setChecked(false); setScore(0)
    setPhase('playing')
  }, [used])

  const correct = useMemo(() => [...cards].sort((a, b) => a.m - b.m).map(x => x.id), [cards])
  const byId = useMemo(() => Object.fromEntries(cards.map(x => [x.id, x])), [cards])

  const pick = useCallback((id) => {
    if (checked) return
    setOrder(o => (o.includes(id) ? o.filter(x => x !== id) : o.length < PER_ROUND ? [...o, id] : o))
  }, [checked])

  const check = useCallback(() => {
    if (checked || order.length < PER_ROUND) return
    let ok = 0
    order.forEach((id, i) => { const hit = correct[i] === id; if (hit) ok++; trackAnswer(MODE, null, hit, 0, id) })
    setScore(s => s + ok)
    setChecked(true)
    ;(ok === PER_ROUND ? playStreak : ok >= 3 ? playCorrect : playWrong)()
  }, [checked, order, correct])

  const next = useCallback(() => {
    if (!checked) return
    if (round >= rounds) {
      finishGame(MODE, { score, completed: true, meta: { rounds } })
      setPhase('over')
      return
    }
    const nr = makeRound(used)
    nr.forEach(x => used.add(x.id))
    setRound(r => r + 1); setCards(nr); setOrder([]); setChecked(false)
  }, [checked, round, rounds, score, used])

  useEffect(() => {
    if (phase === 'setup') return
    const onKey = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      if (phase === 'playing') {
        if (/^[1-5]$/.test(e.key) && cards[+e.key - 1]) { e.preventDefault(); pick(cards[+e.key - 1].id) }
        else if (e.key === 'Backspace' && !checked) { e.preventDefault(); setOrder(o => o.slice(0, -1)) }
        else if (e.key === 'Enter') { e.preventDefault(); checked ? next() : check() }
      } else if (phase === 'over' && e.key === 'Enter') { e.preventDefault(); begin(setup) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [phase, cards, checked, pick, check, next, begin, setup])

  if (phase === 'setup') {
    return (
      <div className="arc-wrap">
        <div className="arc-card">
          <SetupCard mode={MODE} icon="📏" title={t('The Scale of Things')} desc={t('From a proton to the whole universe: put five things in order of size.')} options={OPTIONS} rules={RULES} onStart={begin} />
        </div>
      </div>
    )
  }

  if (phase === 'over') {
    const total = rounds * PER_ROUND
    const best = bestScore()
    return (
      <div className="arc-wrap">
        <div className="arc-over">
          <div className="arc-over-big">{score}<small> / {total}</small></div>
          <div className="arc-over-sub">{score === total ? plain(t('🎉 Perfect! Every single thing in its place.')) : t('Your best: {p}%', { p: Math.round(Math.max(best, score / total) * 100) })}</div>
          <div className="arc-over-btns">
            <button className="arc-primary" onClick={() => begin(setup)}>{t('▶ Play again')} <kbd>{t('Enter')}</kbd></button>
            <button className="arc-secondary" onClick={() => setPhase('setup')}>{t('Settings')}</button>
          </div>
        </div>
      </div>
    )
  }

  const roundOk = checked ? order.filter((id, i) => correct[i] === id).length : 0
  return (
    <div className="arc-wrap sq-wrap">
      <div className="sq-top">
        <span className="sq-round">{t('Round {n} of {total}', { n: round, total: rounds })}</span>
        <span className="sq-score"><Icon name="check" size={15} /> {score}</span>
      </div>

      <div className="sq-axis"><span>{t('Smallest')}</span><span className="sq-axis-line" /><span>{t('Biggest')}</span></div>
      <div className="sq-slots">
        {Array.from({ length: PER_ROUND }, (_, i) => {
          const id = order[i]
          const x = id ? byId[id] : null
          const state = checked ? (correct[i] === id ? ' ok' : ' bad') : ''
          return (
            <button key={i} className={`sq-slot${x ? ' filled' : ''}${state}`} onClick={() => x && pick(id)} disabled={!x || checked}>
              <span className="sq-slot-n">{i + 1}</span>
              {x ? <><span className="sq-icon">{x.icon}</span><span className="sq-name">{nameOf(x)}</span>{checked && <span className="sq-size">{sizeOf(x)}</span>}</> : <span className="sq-empty">?</span>}
            </button>
          )
        })}
      </div>

      {!checked ? (
        <>
          <div className="sq-cards">
            {cards.map((x, i) => (
              <button key={x.id} className={`sq-card${order.includes(x.id) ? ' used' : ''}`} onClick={() => pick(x.id)} disabled={order.includes(x.id)}>
                <kbd>{i + 1}</kbd><span className="sq-icon">{x.icon}</span><span className="sq-name">{nameOf(x)}</span>
              </button>
            ))}
          </div>
          <button className="arc-primary sq-go" onClick={check} disabled={order.length < PER_ROUND}>{t('Check')} <kbd>{t('Enter')}</kbd></button>
        </>
      ) : (
        <div className="sq-result">
          <div className="sq-result-head">{roundOk === PER_ROUND ? plain(t('🎯 Perfect order!')) : t('{n} of 5 in the right place', { n: roundOk })}</div>
          {roundOk < PER_ROUND && (
            <ol className="sq-answer">
              {correct.map(id => <li key={id}><span className="sq-icon">{byId[id].icon}</span> {nameOf(byId[id])} <span className="sq-size">{sizeOf(byId[id])}</span></li>)}
            </ol>
          )}
          <button className="arc-primary sq-go" onClick={next}>{round >= rounds ? t('See the result') : t('Next round')} <kbd>{t('Enter')}</kbd></button>
        </div>
      )}
    </div>
  )
}
