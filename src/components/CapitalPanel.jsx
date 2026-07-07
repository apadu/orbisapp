import { useState, useRef, useEffect, useCallback } from 'react'
import { CAPITALS, checkCapital } from '../utils/capitals'

export default function CapitalPanel({ countries, current, answered, onCorrect, onSkip, onNewGame, score, history }) {
  const [input, setInput]   = useState('')
  const [status, setStatus] = useState(null) // 'correct' | 'wrong' | 'skipped'
  const inputRef = useRef(null)

  const countryName = current?.properties?.NAME ?? ''
  const capital     = CAPITALS[countryName]?.[0] ?? '?'
  const hasCapital  = !!CAPITALS[countryName]

  // Focus input whenever the current country changes
  useEffect(() => {
    setInput('')
    setStatus(null)
    if (!answered) inputRef.current?.focus()
  }, [current, answered])

  const submit = useCallback(() => {
    if (!input.trim() || answered) return
    if (hasCapital && checkCapital(countryName, input)) {
      setStatus('correct')
      setTimeout(() => { onCorrect(); setStatus(null) }, 700)
    } else {
      setStatus('wrong')
      setTimeout(() => setStatus(null), 600)
    }
  }, [input, answered, countryName, hasCapital, onCorrect])

  const skip = useCallback(() => {
    if (answered) return
    setStatus('skipped')
    onSkip()
    setTimeout(() => setStatus(null), 100)
  }, [answered, onSkip])

  const onKeyDown = (e) => {
    if (e.key === 'Enter') submit()
    if (e.key === 'Escape') skip()
  }

  return (
    <>
      {/* Header */}
      <div className="panel-header">
        <h2>🏛️ Guess the Capital</h2>
        <p className="panel-subtitle">
          The highlighted country is shown on the globe.<br />
          Type its capital city.
        </p>
      </div>

      {/* Score */}
      <div className="na-counter">
        <span className="na-count-num">{score.correct}</span>
        <span className="na-count-sep"> / </span>
        <span className="na-count-total">{score.total}</span>
        <span className="na-count-label"> correct</span>
        {score.total > 0 && (
          <div className="na-progress-track">
            <div
              className="na-progress-fill"
              style={{ width: `${(score.correct / score.total) * 100}%` }}
            />
          </div>
        )}
      </div>

      {/* Current country + input */}
      <div className="cap-question">
        <div className="cap-country-name">{countryName}</div>

        {!hasCapital ? (
          <p className="cap-no-data">No capital data — skipping…</p>
        ) : answered ? (
          <div className={`cap-reveal ${status === 'correct' ? 'cap-correct' : 'cap-skipped'}`}>
            {status === 'correct' ? '✅' : '⏭️'} {capital}
          </div>
        ) : (
          <div className={`input-wrap cap-input-wrap ${status ? `flash-${status === 'correct' ? 'hit' : 'miss'}` : ''}`}>
            <div className="input-row">
              <input
                ref={inputRef}
                className="country-input"
                type="text"
                placeholder="Capital city…"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                autoComplete="off"
                spellCheck={false}
              />
              <button className="guess-btn" onClick={submit}>Go</button>
            </div>
          </div>
        )}

        <div className="cap-actions">
          {!answered && (
            <button className="cap-skip-btn" onClick={skip}>
              Skip ⏭
            </button>
          )}
          <button className="cap-next-btn" onClick={onCorrect}>
            Next →
          </button>
        </div>
      </div>

      {/* History */}
      {history?.length > 0 && (
        <div className="guesses-section">
          <h3 className="guesses-title">
            History <span className="guess-count">{history.length}</span>
          </h3>
          <ul className="guess-list">
            {[...history].reverse().map((a, i) => (
              <li key={i} className="guess-item">
                <span className="guess-swatch" style={{ background: a.correct ? '#39ff14' : '#ef4444' }} />
                <span className="guess-name">{a.country}</span>
                <span className="guess-dist" style={{ color: a.correct ? '#39ff14' : '#ef4444' }}>
                  {a.correct ? a.capital : `→ ${a.capital}`}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="panel-footer">
        <button className="new-game-btn" onClick={onNewGame}>🔄 New Game</button>
      </div>
    </>
  )
}
