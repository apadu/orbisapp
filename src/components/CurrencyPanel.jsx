import { useState, useEffect, useRef, useCallback } from 'react'
import { COUNTRY_CURRENCY } from '../utils/countryCurrency'
import { COUNTRY_INFO } from '../utils/countryInfo'
import GameIntro from './GameIntro'
import { playCorrect, playWrong, playStreak } from '../utils/sounds'

const ELIGIBLE = Object.keys(COUNTRY_CURRENCY).filter(name => COUNTRY_INFO[name])

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function freshDeck() { return shuffle(ELIGIBLE) }

function norm(s) {
  return s.toLowerCase().replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, ' ').trim()
}
function isMatch(input, correct, code) {
  const n = norm(input)
  if (!n) return false
  return n === norm(correct) || n === code.toLowerCase()
}
function matchLevel(input, correct, code) {
  if (!input) return 'none'
  if (isMatch(input, correct, code)) return 'correct'
  const n = norm(input), c = norm(correct)
  if (c.startsWith(n) && n.length >= 2) return 'partial'
  if (norm(correct.split(' ')[0]).startsWith(n) && n.length >= 2) return 'partial'
  return 'none'
}

const BASE_POINTS    = 75
const STREAK3_POINTS = 100
const STREAK5_POINTS = 150

export default function CurrencyPanel() {
  const [deck,    setDeck]    = useState(() => freshDeck())
  const [idx,     setIdx]     = useState(0)
  const [input,   setInput]   = useState('')
  const [status,  setStatus]  = useState('idle') // 'idle' | 'correct' | 'skipped'
  const [score,   setScore]   = useState(0)
  const [streak,  setStreak]  = useState(0)
  const [history, setHistory] = useState([])
  const [done,    setDone]    = useState(false)
  const [lastPts, setLastPts] = useState(0)
  const inputRef = useRef(null)

  const country = deck[idx]
  const cur     = COUNTRY_CURRENCY[country]
  const round   = { country, correct: cur.name, code: cur.code }

  const isAnswered = status !== 'idle'
  const streakPts  = streak >= 4 ? STREAK5_POINTS : streak >= 2 ? STREAK3_POINTS : BASE_POINTS
  const level      = isAnswered ? (status === 'correct' ? 'correct' : 'none')
                                : matchLevel(input, round.correct, round.code)

  const reset = useCallback(() => {
    setDeck(freshDeck())
    setIdx(0)
    setInput('')
    setStatus('idle')
    setScore(0)
    setStreak(0)
    setHistory([])
    setDone(false)
    setLastPts(0)
    setTimeout(() => inputRef.current?.focus(), 50)
  }, [])

  // handleChange: only marks answered, does NOT advance the deck
  const handleChange = useCallback((e) => {
    const val = e.target.value
    setInput(val)
    if (isAnswered) return
    if (isMatch(val, round.correct, round.code)) {
      const pts = streakPts
      const newStreak = streak + 1
      setStatus('correct')
      setScore(s => s + pts)
      setStreak(newStreak)
      setLastPts(pts)
      setHistory(h => [
        { country: round.country, correct: round.correct, pts, won: true },
        ...h.slice(0, 9),
      ])
      if (newStreak >= 3) playStreak(); else playCorrect()
    }
  }, [isAnswered, round, streakPts, streak])

  const skip = useCallback(() => {
    if (isAnswered) return
    setStatus('skipped')
    setStreak(0)
    setLastPts(0)
    setHistory(h => [
      { country: round.country, correct: round.correct, pts: 0, won: false },
      ...h.slice(0, 9),
    ])
    playWrong()
  }, [isAnswered, round])

  // next: advance deck index after feedback is shown
  const next = useCallback(() => {
    if (!isAnswered) return
    const nextIdx = idx + 1
    if (nextIdx >= deck.length) {
      setDone(true)
    } else {
      setIdx(nextIdx)
      setInput('')
      setStatus('idle')
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [isAnswered, idx, deck.length])

  useEffect(() => {
    const handler = (e) => {
      if (done) return
      if (e.key === 'Enter') { if (isAnswered) next(); else skip() }
      if (e.key === 'Tab') { e.preventDefault(); if (!isAnswered) skip() }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [done, isAnswered, next, skip])

  useEffect(() => { if (!done) inputRef.current?.focus() }, [idx, done])

  const [started, setStarted] = useState(false)
  if (!started) return (
    <GameIntro
      icon="💰"
      title="Currency Quiz"
      desc="A country is highlighted on the globe — name its official currency."
      rules={[
        '⌨️ Type the currency name to answer',
        '↩ Skip to pass on any country',
        '💡 Currency codes accepted (e.g. USD, EUR)',
        '📈 Build a streak for a score multiplier',
      ]}
      onStart={() => setStarted(true)}
    />
  )

  if (done) {
    return (
      <>
        <div className="panel-header">
          <h2>💰 Currency Quiz</h2>
        </div>
        <div className="quiz-done-wrap">
          <div className="quiz-done-icon">🎉</div>
          <div className="quiz-done-title">All {ELIGIBLE.length} countries done!</div>
          <div className="quiz-done-score">Final score: <strong>{score}</strong></div>
          <button className="quiz-reset-btn" onClick={reset}>↺ Play again</button>
        </div>
      </>
    )
  }

  const info     = COUNTRY_INFO[round.country]
  const flag     = info?.flag ?? '🏳️'
  const progress = `${idx + 1} / ${deck.length}`

  let inputCls = 'currency-input'
  if (level === 'correct') inputCls += ' ci-correct'
  else if (level === 'partial') inputCls += ' ci-partial'

  return (
    <>
      <div className="panel-header">
        <div className="quiz-header-row">
          <h2>💰 Currency Quiz</h2>
          <button className="quiz-inline-reset" onClick={reset} title="Restart">↺ Reset</button>
        </div>
        <p className="panel-subtitle">Type the official currency — auto-checks as you go.</p>
      </div>

      <div className="currency-score-bar">
        <span className="currency-score">Score: <strong>{score}</strong></span>
        <span className="quiz-progress">{progress}</span>
        {streak >= 2 && (
          <span className="currency-streak-badge">🔥 ×{streak} · {streakPts} pts</span>
        )}
      </div>

      <div className="currency-question-card">
        <div className="currency-flag">{flag}</div>
        <div className="currency-country">{round.country}</div>
      </div>

      <div className="currency-input-wrap">
        <input
          ref={inputRef}
          className={inputCls}
          type="text"
          placeholder={isAnswered ? round.correct : 'Type currency name or code…'}
          value={isAnswered ? (status === 'correct' ? round.correct : input) : input}
          onChange={handleChange}
          disabled={isAnswered}
          autoComplete="off"
          spellCheck={false}
        />
        {!isAnswered && (
          <button className="currency-skip-btn" onClick={skip}>Skip</button>
        )}
      </div>

      {isAnswered && (
        <div className={`currency-feedback ${status === 'correct' ? 'fb-correct' : 'fb-wrong'}`}>
          <span>
            {status === 'correct'
              ? `✅ +${lastPts} pts`
              : `❌ ${round.correct} (${round.code})`}
          </span>
          <button className="currency-next-btn" onClick={next}>
            Next →<span className="opt-key-hint"> Enter</span>
          </button>
        </div>
      )}

      {!isAnswered && input.length === 0 && (
        <p className="currency-code-hint">Also accepts the 3-letter code (e.g. USD, EUR)</p>
      )}

      {history.length > 0 && (
        <div className="currency-history">
          <div className="currency-history-label">Recent rounds</div>
          {history.map((h, i) => {
            const hinfo = COUNTRY_INFO[h.country]
            return (
              <div key={i} className={`currency-history-row ${h.won ? 'hr-correct' : 'hr-wrong'}`}>
                <span>{hinfo?.flag ?? '🏳️'}</span>
                <span className="chr-country">{h.country}</span>
                <span className="chr-currency">{h.correct}</span>
                <span className="chr-pts">{h.won ? `+${h.pts}` : '—'}</span>
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}
