import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { resolveAlias } from '../utils/aliases'
import GameIntro from './GameIntro'
import { playCorrect, playWrong, playStreak } from '../utils/sounds'

const ROUND_SIZE = 30

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/**
 * Scramble strategy:
 *  • Single-word ≤ 10 chars  → full anagram of all letters
 *  • Everything else          → scramble letters within each word (word order preserved)
 * Always retry until scrambled ≠ original (max 20 attempts).
 */
function scrambleName(name) {
  const words = name.split(' ')
  if (words.length === 1 && name.length <= 10) {
    let letters = name.split('')
    for (let attempt = 0; attempt < 20; attempt++) {
      letters = shuffle(letters)
      if (letters.join('') !== name) break
    }
    return [letters.join('')]
  }
  return words.map(word => {
    if (word.length <= 2) return word
    let letters = word.split('')
    for (let attempt = 0; attempt < 20; attempt++) {
      letters = shuffle(letters)
      if (letters.join('') !== word) break
    }
    return letters.join('')
  })
}

function calcPoints(streak) {
  if (streak <= 1) return 100
  if (streak === 2) return 150
  if (streak === 3) return 200
  if (streak === 4) return 300
  return 400
}

function norm(s) {
  return s.toLowerCase().replace(/[^a-z]/g, '').trim()
}

export default function ScramblePanel({ gameCountries, countryInfo, onHighlight }) {
  const [started,  setStarted]  = useState(false)
  const [deck,     setDeck]     = useState([])
  const [idx,      setIdx]      = useState(0)
  const [scrambled, setScrambled] = useState([])
  const [input,    setInput]    = useState('')
  const [status,   setStatus]   = useState('idle')   // 'idle' | 'correct' | 'skipped'
  const [score,    setScore]    = useState(0)
  const [streak,   setStreak]   = useState(0)
  const [lastPts,  setLastPts]  = useState(0)
  const [history,  setHistory]  = useState([])
  const [done,     setDone]     = useState(false)
  const inputRef = useRef(null)

  // Only single-word names with 5+ letters — multi-word or short names are too easy / unsolvable
  const eligibleCountries = useMemo(
    () => gameCountries.filter(f => {
      const name = f.properties.NAME
      return !name.includes(' ') && name.length >= 5
    }),
    [gameCountries]
  )

  const countryNames = useMemo(() => gameCountries.map(f => f.properties.NAME), [gameCountries])
  const current = deck[idx] ?? null
  const isAnswered = status !== 'idle'

  // Build new deck
  const startGame = useCallback(() => {
    const picked = shuffle(eligibleCountries).slice(0, ROUND_SIZE)
    setDeck(picked)
    setIdx(0)
    setScrambled(scrambleName(picked[0]?.properties?.NAME ?? ''))
    setInput('')
    setStatus('idle')
    setScore(0)
    setStreak(0)
    setLastPts(0)
    setHistory([])
    setDone(false)
    onHighlight?.(null)
    setTimeout(() => inputRef.current?.focus(), 50)
  }, [eligibleCountries, onHighlight])

  // Highlight current country on globe when answered
  useEffect(() => {
    if (isAnswered && current) {
      onHighlight?.(current)
    } else {
      onHighlight?.(null)
    }
  }, [isAnswered, current, onHighlight])

  const advance = useCallback(() => {
    const next = idx + 1
    if (next >= deck.length) {
      setDone(true)
      onHighlight?.(null)
    } else {
      setIdx(next)
      setScrambled(scrambleName(deck[next].properties.NAME))
      setInput('')
      setStatus('idle')
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [idx, deck, onHighlight])

  const skip = useCallback(() => {
    if (isAnswered) return
    setStatus('skipped')
    setStreak(0)
    setLastPts(0)
    const name = current.properties.NAME
    const info = countryInfo?.[name]
    setHistory(h => [{ name, flag: info?.flag ?? '🏳️', pts: 0, won: false }, ...h.slice(0, 9)])
    playWrong()
  }, [isAnswered, current, countryInfo])

  const handleChange = useCallback((e) => {
    const val = e.target.value
    setInput(val)
    if (isAnswered || !current) return
    const name = current.properties.NAME
    const resolved = resolveAlias(val, countryNames)
    if (resolved && norm(resolved) === norm(name)) {
      const newStreak = streak + 1
      const pts = calcPoints(newStreak)
      setStatus('correct')
      setStreak(newStreak)
      setScore(s => s + pts)
      setLastPts(pts)
      const info = countryInfo?.[name]
      setHistory(h => [{ name, flag: info?.flag ?? '🏳️', pts, won: true }, ...h.slice(0, 9)])
      if (newStreak >= 3) playStreak(); else playCorrect()
    }
  }, [isAnswered, current, countryNames, streak, countryInfo])

  // Keyboard: Tab to skip, Enter to advance
  useEffect(() => {
    const handler = (e) => {
      if (done) return
      if (e.key === 'Tab')   { e.preventDefault(); if (!isAnswered) skip() }
      if (e.key === 'Enter') { if (isAnswered) advance() }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [done, isAnswered, skip, advance])

  // ── Intro ──────────────────────────────────────────────────────────────────
  if (!started) return (
    <GameIntro
      icon="🔤"
      title="Scramble"
      desc="Unscramble the letters to reveal a country name. The country lights up on the globe when you get it right."
      rules={[
        '⌨️ Type your answer — it auto-checks as you go',
        '⇥ Tab to skip',
        '↩ Enter to move to next after answering',
        '🔥 Build a streak for bonus points',
      ]}
      onStart={() => { setStarted(true); startGame() }}
    />
  )

  // ── Done screen ────────────────────────────────────────────────────────────
  if (done) {
    const correct = history.filter(h => h.won).length
    return (
      <>
        <div className="panel-header">
          <h2>🔤 Scramble</h2>
        </div>
        <div className="quiz-done-wrap">
          <div className="quiz-done-icon">🎉</div>
          <div className="quiz-done-title">{ROUND_SIZE} countries done!</div>
          <div className="quiz-done-score">
            Score: <strong>{score}</strong> · {correct}/{ROUND_SIZE} correct
          </div>
          <button className="quiz-reset-btn" onClick={startGame}>↺ Play again</button>
        </div>
      </>
    )
  }

  if (!current) return null

  const name    = current.properties.NAME
  const info    = countryInfo?.[name]
  const flag    = info?.flag ?? '🏳️'
  const progress = `${idx + 1} / ${deck.length}`

  return (
    <>
      <div className="panel-header">
        <div className="quiz-header-row">
          <h2>🔤 Scramble</h2>
          <button className="quiz-inline-reset" onClick={startGame} title="Restart">↺ Reset</button>
        </div>
        <p className="panel-subtitle">Unscramble the letters to name the country.</p>
      </div>

      {/* Score bar */}
      <div className="currency-score-bar">
        <span className="currency-score">Score: <strong>{score}</strong></span>
        <span className="quiz-progress">{progress}</span>
        {streak >= 2 && (
          <span className="currency-streak-badge">🔥 ×{streak} · {calcPoints(streak + 1)} pts next</span>
        )}
      </div>

      {/* Scrambled tiles */}
      <div className="scramble-card">
        <div className={`scramble-tiles-wrap ${isAnswered ? (status === 'correct' ? 'sc-correct' : 'sc-skipped') : ''}`}>
          {isAnswered ? (
            // Show correct answer as tiles
            name.split(' ').map((word, wi) => (
              <span key={wi} className="scramble-word">
                {word.split('').map((ch, ci) => (
                  <span key={ci} className="scramble-tile scramble-tile-reveal">{ch}</span>
                ))}
              </span>
            ))
          ) : (
            scrambled.map((word, wi) => (
              <span key={wi} className="scramble-word">
                {word.split('').map((ch, ci) => (
                  <span key={ci} className="scramble-tile">{ch}</span>
                ))}
              </span>
            ))
          )}
        </div>

        {/* Word count hint */}
        {!isAnswered && scrambled.length > 1 && (
          <p className="scramble-hint">{scrambled.length} words · {name.replace(/ /g, '').length} letters</p>
        )}
        {!isAnswered && scrambled.length === 1 && (
          <p className="scramble-hint">{name.length} letters</p>
        )}
      </div>

      {/* Input */}
      <div className="currency-input-wrap">
        <input
          ref={inputRef}
          className={`currency-input${status === 'correct' ? ' ci-correct' : ''}`}
          type="text"
          placeholder={isAnswered ? name : 'Type the country name…'}
          value={isAnswered ? (status === 'correct' ? name : input) : input}
          onChange={handleChange}
          disabled={isAnswered}
          autoComplete="off"
          spellCheck={false}
        />
        {!isAnswered && (
          <button className="currency-skip-btn" onClick={skip}>Skip</button>
        )}
      </div>

      {/* Feedback row */}
      {isAnswered && (
        <div className={`currency-feedback ${status === 'correct' ? 'fb-correct' : 'fb-wrong'}`}>
          <span className="scramble-result-flag">{flag}</span>
          <span>
            {status === 'correct' ? `✅ +${lastPts} pts` : `❌ ${name}`}
          </span>
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
