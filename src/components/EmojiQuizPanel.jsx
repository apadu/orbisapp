import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { resolveAlias, findClosestMatch } from '../utils/aliases'
import { EMOJI_CLUES } from '../utils/emojiClues'
import GameIntro from './GameIntro'
import { playCorrect, playWrong, playStreak } from '../utils/sounds'

const ROUND_SIZE = 20

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
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

export default function EmojiQuizPanel({ gameCountries, countryInfo }) {
  const [started,    setStarted]    = useState(false)
  const [deck,       setDeck]       = useState([])
  const [idx,        setIdx]        = useState(0)
  const [input,      setInput]      = useState('')
  const [didYouMean, setDidYouMean] = useState(null)
  const [status,     setStatus]     = useState('idle')
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

  // Only clues whose country exists in the game
  const eligibleClues = useMemo(
    () => EMOJI_CLUES.filter(c => gameCountries.some(f => f.properties.NAME === c.country)),
    [gameCountries]
  )

  const current = deck[idx] ?? null
  const isAnswered = status !== 'idle'

  const startGame = useCallback(() => {
    const picked = shuffle(eligibleClues).slice(0, ROUND_SIZE)
    setDeck(picked)
    setIdx(0)
    setInput('')
    setDidYouMean(null)
    setStatus('idle')
    setScore(0)
    setStreak(0)
    setLastPts(0)
    setHistory([])
    setDone(false)
    setTimeout(() => inputRef.current?.focus(), 50)
  }, [eligibleClues])

  const advance = useCallback(() => {
    const next = idx + 1
    if (next >= deck.length) {
      setDone(true)
    } else {
      setIdx(next)
      setInput('')
      setDidYouMean(null)
      setStatus('idle')
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [idx, deck])

  const skip = useCallback(() => {
    if (isAnswered || !current) return
    setStatus('skipped')
    setStreak(0)
    setLastPts(0)
    const info = countryInfo?.[current.country]
    setHistory(h => [{ name: current.country, flag: info?.flag ?? '🏳️', pts: 0, won: false }, ...h.slice(0, 9)])
    playWrong()
  }, [isAnswered, current, countryInfo])

  const tryGuess = useCallback((raw) => {
    if (isAnswered || !current) return
    const resolved = resolveAlias(raw, countryNames)
    if (!resolved) {
      const closest = findClosestMatch(raw, countryNames)
      if (closest) setDidYouMean(closest)
      return
    }
    if (norm(resolved) === norm(current.country)) {
      const newStreak = streak + 1
      const pts = calcPoints(newStreak)
      setStatus('correct')
      setStreak(newStreak)
      setScore(s => s + pts)
      setLastPts(pts)
      setDidYouMean(null)
      const info = countryInfo?.[current.country]
      setHistory(h => [{ name: current.country, flag: info?.flag ?? '🏳️', pts, won: true }, ...h.slice(0, 9)])
      if (newStreak >= 3) playStreak(); else playCorrect()
    } else {
      const closest = findClosestMatch(raw, countryNames)
      if (closest) setDidYouMean(closest)
    }
  }, [isAnswered, current, countryNames, streak, countryInfo])

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
      icon="🌍"
      title="Country Emoji"
      desc="Four emojis represent a country. Name it."
      rules={[
        '🌍 Each set of emojis hints at a country',
        '⌨️ Type the country name and press Enter',
        '⇥ Tab to skip',
        '🔥 Streak bonus for consecutive correct answers',
      ]}
      onStart={() => { setStarted(true); startGame() }}
    />
  )

  if (done) {
    const correct = history.filter(h => h.won).length
    return (
      <>
        <div className="panel-header"><h2>🌍 Country Emoji</h2></div>
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

  return (
    <>
      <div className="panel-header">
        <div className="quiz-header-row">
          <h2>🌍 Country Emoji</h2>
          <button className="quiz-inline-reset" onClick={startGame} title="Restart">↺ Reset</button>
        </div>
        <p className="panel-subtitle">Which country do these emojis represent?</p>
      </div>

      {/* Score bar */}
      <div className="currency-score-bar">
        <span className="currency-score">Score: <strong>{score}</strong></span>
        <span className="quiz-progress">{idx + 1} / {deck.length}</span>
        {streak >= 2 && (
          <span className="currency-streak-badge">🔥 ×{streak} · {calcPoints(streak + 1)} pts next</span>
        )}
      </div>

      {/* Emoji display */}
      <div className="eq-card">
        {isAnswered ? (
          <div className="eq-reveal">
            <span className="eq-flag-big">{flag}</span>
            <span className="eq-reveal-name">{current.country}</span>
          </div>
        ) : (
          <div className="eq-emojis">
            {current.emojis.map((e, i) => (
              <span key={i} className="eq-emoji">{e}</span>
            ))}
          </div>
        )}
      </div>

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
