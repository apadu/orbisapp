import { useState, useCallback, useMemo, useRef } from 'react'
import { resolveAlias, findClosestMatch } from '../utils/aliases'
import { COUNTRY_FACTS } from '../utils/countryFacts'
import GameIntro from './GameIntro'
import { playCorrect, playWrong, playStreak } from '../utils/sounds'

const ROUND_SIZE = 15

// Points depending on how many hints were used (0, 1, or 2 extra hints shown)
const HINT_POINTS = [300, 200, 100]

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function calcStreakBonus(streak) {
  if (streak <= 1) return 0
  if (streak === 2) return 25
  if (streak === 3) return 50
  if (streak === 4) return 75
  return 100
}

function norm(s) {
  return s.toLowerCase().replace(/[^a-z]/g, '').trim()
}

export default function CountryFactPanel({ gameCountries, countryInfo }) {
  const [started,    setStarted]    = useState(false)
  const [deck,       setDeck]       = useState([])
  const [idx,        setIdx]        = useState(0)
  const [hintsUsed,  setHintsUsed]  = useState(0)   // 0 = only fact[0] shown, 1 = fact[1] shown, 2 = all shown
  const [input,      setInput]      = useState('')
  const [didYouMean, setDidYouMean] = useState(null)
  const [status,     setStatus]     = useState('idle')  // 'idle' | 'correct' | 'skipped'
  const [score,      setScore]      = useState(0)
  const [streak,     setStreak]     = useState(0)
  const [lastPts,    setLastPts]    = useState(0)
  const [history,    setHistory]    = useState([])
  const [done,       setDone]       = useState(false)
  const inputRef = useRef(null)

  const countryNames = useMemo(
    () => gameCountries.map(f => f.properties.NAME),
    [gameCountries]
  )

  const eligibleFacts = useMemo(
    () => COUNTRY_FACTS.filter(e => gameCountries.some(f => f.properties.NAME === e.country)),
    [gameCountries]
  )

  const current = deck[idx] ?? null
  const isAnswered = status !== 'idle'

  const startGame = useCallback(() => {
    // Deduplicate by country name
    const seen = new Set()
    const unique = eligibleFacts.filter(e => {
      if (seen.has(e.country)) return false
      seen.add(e.country)
      return true
    })
    const picked = shuffle(unique).slice(0, ROUND_SIZE)
    setDeck(picked)
    setIdx(0)
    setHintsUsed(0)
    setInput('')
    setDidYouMean(null)
    setStatus('idle')
    setScore(0)
    setStreak(0)
    setLastPts(0)
    setHistory([])
    setDone(false)
    setTimeout(() => inputRef.current?.focus(), 50)
  }, [eligibleFacts])

  const advance = useCallback(() => {
    const next = idx + 1
    if (next >= deck.length) {
      setDone(true)
    } else {
      setIdx(next)
      setHintsUsed(0)
      setInput('')
      setDidYouMean(null)
      setStatus('idle')
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [idx, deck])

  const revealHint = useCallback(() => {
    if (isAnswered || !current) return
    setHintsUsed(h => Math.min(h + 1, current.facts.length - 1))
    setTimeout(() => inputRef.current?.focus(), 50)
  }, [isAnswered, current])

  const skip = useCallback(() => {
    if (isAnswered || !current) return
    setStatus('skipped')
    setStreak(0)
    setLastPts(0)
    const info = countryInfo?.[current.country]
    setHistory(h => [{ name: current.country, flag: info?.flag ?? '🏳️', pts: 0, won: false, hintsUsed }, ...h.slice(0, 9)])
    playWrong()
  }, [isAnswered, current, countryInfo, hintsUsed])

  const tryGuess = useCallback((raw) => {
    if (isAnswered || !current) return
    const resolved = resolveAlias(raw, countryNames)
    if (!resolved) {
      const closest = findClosestMatch(raw, countryNames)
      if (closest) setDidYouMean(closest)
      return
    }
    if (norm(resolved) === norm(current.country)) {
      const basePts = HINT_POINTS[Math.min(hintsUsed, 2)]
      const bonus   = calcStreakBonus(streak + 1)
      const pts     = basePts + bonus
      const newStreak = streak + 1
      setStatus('correct')
      setStreak(newStreak)
      setScore(s => s + pts)
      setLastPts(pts)
      setDidYouMean(null)
      const info = countryInfo?.[current.country]
      setHistory(h => [{ name: current.country, flag: info?.flag ?? '🏳️', pts, won: true, hintsUsed }, ...h.slice(0, 9)])
      if (newStreak >= 3) playStreak(); else playCorrect()
    } else {
      const closest = findClosestMatch(raw, countryNames)
      if (closest) setDidYouMean(closest)
    }
  }, [isAnswered, current, countryNames, streak, hintsUsed, countryInfo])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (isAnswered) { advance(); return }
      if (didYouMean) { tryGuess(didYouMean); setInput(''); setDidYouMean(null); return }
      tryGuess(input)
    }
    if (e.key === 'Tab')    { e.preventDefault(); if (!isAnswered) skip() }
    if (e.key === 'Escape') setDidYouMean(null)
  }

  if (!started) return (
    <GameIntro
      icon="📖"
      title="Country by Fact"
      desc="Read a fact and name the country. Reveal hints for fewer points."
      rules={[
        '📖 Each country has up to 3 facts — hardest first',
        '💡 Click "Hint" to reveal the next fact (fewer points)',
        '300 pts for 1 fact · 200 for 2 · 100 for 3',
        '⇥ Tab to skip · ↩ Enter to move on',
      ]}
      onStart={() => { setStarted(true); startGame() }}
    />
  )

  if (done) {
    const correct = history.filter(h => h.won).length
    return (
      <>
        <div className="panel-header"><h2>📖 Country by Fact</h2></div>
        <div className="quiz-done-wrap">
          <div className="quiz-done-icon">🎉</div>
          <div className="quiz-done-title">{ROUND_SIZE} countries done!</div>
          <div className="quiz-done-score">Score: <strong>{score}</strong> · {correct}/{ROUND_SIZE} correct</div>
          <button className="quiz-reset-btn" onClick={startGame}>↺ Play again</button>
        </div>
      </>
    )
  }

  if (!current) return null

  const info = countryInfo?.[current.country]
  const flag = info?.flag ?? '🏳️'
  const factsToShow = current.facts.slice(0, hintsUsed + 1)
  const canHint = !isAnswered && hintsUsed < current.facts.length - 1
  const pointsAvailable = HINT_POINTS[Math.min(hintsUsed, 2)]

  return (
    <>
      <div className="panel-header">
        <div className="quiz-header-row">
          <h2>📖 Country by Fact</h2>
          <button className="quiz-inline-reset" onClick={startGame} title="Restart">↺ Reset</button>
        </div>
        <p className="panel-subtitle">Name the country described by these facts.</p>
      </div>

      {/* Score bar */}
      <div className="currency-score-bar">
        <span className="currency-score">Score: <strong>{score}</strong></span>
        <span className="quiz-progress">{idx + 1} / {deck.length}</span>
        {streak >= 2 && (
          <span className="currency-streak-badge">🔥 ×{streak}</span>
        )}
      </div>

      {/* Facts card */}
      <div className="cf-card">
        <div className="cf-points-badge">
          {isAnswered
            ? (status === 'correct' ? `✅ +${lastPts} pts` : `❌ ${current.country}`)
            : `${pointsAvailable} pts if correct`
          }
        </div>
        <div className="cf-facts">
          {factsToShow.map((fact, i) => (
            <div key={i} className={`cf-fact ${i === factsToShow.length - 1 && !isAnswered ? 'cf-fact-latest' : ''}`}>
              <span className="cf-fact-num">{i + 1}</span>
              <span className="cf-fact-text">{fact}</span>
            </div>
          ))}
        </div>
        {isAnswered && (
          <div className="cf-reveal">
            <span className="cf-flag-big">{flag}</span>
            <span className="cf-reveal-name">{current.country}</span>
          </div>
        )}
      </div>

      {/* Hint button */}
      {canHint && (
        <div className="cf-hint-row">
          <button className="cf-hint-btn" onClick={revealHint}>
            💡 Reveal hint ({HINT_POINTS[Math.min(hintsUsed + 1, 2)]} pts)
          </button>
        </div>
      )}

      {/* Input */}
      <div className="currency-input-wrap">
        {didYouMean && !isAnswered && (
          <div className="did-you-mean">
            Did you mean{' '}
            <button className="dym-btn" onClick={() => { tryGuess(didYouMean); setInput(''); setDidYouMean(null) }}>
              {didYouMean}
            </button>? Press Enter to confirm.
          </div>
        )}
        <div className="input-row">
          <input
            ref={inputRef}
            className={`currency-input${status === 'correct' ? ' ci-correct' : ''}`}
            type="text"
            placeholder={isAnswered ? current.country : 'Type the country name…'}
            value={isAnswered ? (status === 'correct' ? current.country : input) : input}
            onChange={e => { setInput(e.target.value); setDidYouMean(null) }}
            onKeyDown={handleKeyDown}
            disabled={isAnswered}
            autoComplete="off"
            spellCheck={false}
          />
          {!isAnswered && (
            <button className="currency-skip-btn" onClick={skip}>Skip</button>
          )}
        </div>
      </div>

      {/* Feedback */}
      {isAnswered && (
        <div className={`currency-feedback ${status === 'correct' ? 'fb-correct' : 'fb-wrong'}`}>
          <span className="scramble-result-flag">{flag}</span>
          <span>{status === 'correct' ? `✅ +${lastPts} pts` : `❌ ${current.country}`}</span>
          <button className="currency-next-btn" onClick={advance}>
            Next →<span className="opt-key-hint"> Enter</span>
          </button>
        </div>
      )}

      {/* History */}
      {history.length > 0 && (
        <div className="currency-history">
          <div className="currency-history-label">Recent</div>
          {history.map((h, i) => (
            <div key={i} className={`currency-history-row ${h.won ? 'hr-correct' : 'hr-wrong'}`}>
              <span>{h.flag}</span>
              <span className="chr-country">{h.name}</span>
              <span className="chr-pts">{h.won ? `+${h.pts}` : '—'}</span>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
