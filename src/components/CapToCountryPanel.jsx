import { useState, useRef, useEffect } from 'react'
import { resolveAlias, findClosestMatch } from '../utils/aliases'
import GameIntro from './GameIntro'

export default function CapToCountryPanel({
  current, answered, correct, countryNames,
  onGuess, onSkip, onNext, score, history
}) {
  const [input, setInput]           = useState('')
  const [didYouMean, setDidYouMean] = useState(null)
  const [started, setStarted]       = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    setInput('')
    setDidYouMean(null)
    setTimeout(() => inputRef.current?.focus(), 50)
  }, [current?.country])

  if (!current) return null

  const pct = score.total ? Math.round((score.correct / score.total) * 100) : 0

  const trySubmit = () => {
    if (!input.trim()) return
    if (didYouMean) {
      onGuess(didYouMean)
      setInput('')
      setDidYouMean(null)
      return
    }
    const resolved = resolveAlias(input, countryNames)
    if (resolved) {
      onGuess(resolved)
      setInput('')
      setDidYouMean(null)
      return
    }
    const closest = findClosestMatch(input, countryNames)
    if (closest) setDidYouMean(closest)
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter') { e.preventDefault(); trySubmit() }
    if (e.key === 'Escape') setDidYouMean(null)
    if (e.key === 'Tab') { e.preventDefault(); if (!answered) onSkip() }
  }

  // Enter to advance once answered
  useEffect(() => {
    if (!answered) return
    const handler = (e) => { if (e.key === 'Enter') onNext() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [answered, onNext])

  if (!started) return (
    <GameIntro
      icon="🗺️"
      title="Capital to Country"
      desc="You're given a capital city — name the country it belongs to."
      rules={[
        '⌨️ Type the country name to answer',
        '↩ Skip to pass on any question',
        '📈 Streak multiplier for consecutive correct answers',
        '🌐 All world capitals included',
      ]}
      onStart={() => setStarted(true)}
    />
  )

  return (
    <>
      <div className="panel-header">
        <h2>🏛️ Capital to Country</h2>
        <p className="panel-subtitle">Name the country whose capital is shown.</p>
      </div>

      {/* Score */}
      <div className="stats-bar">
        <div className="stat-item">
          <span className="stat-num">{score.total}</span>
          <span className="stat-label">Played</span>
        </div>
        <div className="stat-item">
          <span className="stat-num">{score.correct}</span>
          <span className="stat-label">Correct</span>
        </div>
        <div className="stat-item">
          <span className="stat-num">{pct}%</span>
          <span className="stat-label">Accuracy</span>
        </div>
      </div>

      {/* Capital prompt */}
      <div className="cap-prompt">
        <span className="cap-prompt-label">Capital city</span>
        <span className="cap-prompt-city">{current.capital}</span>
      </div>

      {/* Result or input */}
      {answered ? (
        <div className={`cap-result ${correct ? 'cap-result-correct' : 'cap-result-wrong'}`}>
          {correct
            ? `✅ Correct! ${current.capital} is the capital of ${current.country}.`
            : `❌ It was ${current.country}.`}
        </div>
      ) : (
        <div className="input-wrap">
          {didYouMean && (
            <div className="did-you-mean">
              Did you mean{' '}
              <button className="dym-btn" onClick={() => { onGuess(didYouMean); setInput(''); setDidYouMean(null) }}>
                {didYouMean}
              </button>
              ? Press Enter to confirm or keep typing.
            </div>
          )}
          <div className="input-row">
            <input
              ref={inputRef}
              className="country-input"
              type="text"
              placeholder="Type the country name…"
              value={input}
              onChange={e => { setInput(e.target.value); setDidYouMean(null) }}
              onKeyDown={onKeyDown}
              autoComplete="off"
              spellCheck={false}
            />
            <button className="guess-btn" onClick={trySubmit}>Go</button>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="panel-footer">
        {answered
          ? <button className="new-game-btn" onClick={onNext}>Next →</button>
          : <button className="give-up-btn" onClick={onSkip}>Skip</button>
        }
      </div>

      {/* History */}
      {history.length > 0 && (
        <div className="guesses-section">
          <h3 className="guesses-title">History <span className="guess-count">{history.length}</span></h3>
          <ul className="guess-list">
            {[...history].reverse().map((h, i) => (
              <li key={i} className="guess-item">
                <span className="guess-swatch" style={{ background: h.correct ? '#39ff14' : '#ef4444' }} />
                <span className="guess-name">{h.capital}</span>
                <span className="guess-dist" style={{ color: h.correct ? '#39ff14' : '#ef4444', marginLeft: 'auto' }}>
                  {h.correct ? `✓ ${h.country}` : `✗ ${h.country}`}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  )
}
