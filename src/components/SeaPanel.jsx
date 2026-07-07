import { useState, useRef, useEffect, useCallback } from 'react'

/** Loose sea name matching — accepts partial names without "Sea", "Ocean", etc. */
function normalizeSea(s) {
  return s.toLowerCase().trim()
    .replace(/\b(sea|ocean|gulf|bay|lake|strait|channel|the|of)\b/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

export function checkSea(canonicalName, typed) {
  const t = typed.toLowerCase().trim()
  const n = canonicalName.toLowerCase().trim()
  if (t === n) return true
  // Exact match after stripping generic words
  const nt = normalizeSea(t)
  const nn = normalizeSea(n)
  return nt.length >= 3 && nt === nn
}

export default function SeaPanel({ current, answered, onCorrect, onSkip, onNewGame, score, history }) {
  const [input,  setInput]  = useState('')
  const [status, setStatus] = useState(null) // 'correct' | 'wrong'
  const inputRef = useRef(null)

  const seaName = current?.properties?.NAME ?? ''

  useEffect(() => {
    setInput('')
    setStatus(null)
    if (!answered) inputRef.current?.focus()
  }, [current, answered])

  const submit = useCallback(() => {
    if (!input.trim() || answered) return
    if (checkSea(seaName, input)) {
      setStatus('correct')
      setTimeout(() => { onCorrect(); setStatus(null) }, 700)
    } else {
      setStatus('wrong')
      setTimeout(() => setStatus(null), 600)
    }
  }, [input, answered, seaName, onCorrect])

  const skip = useCallback(() => {
    if (answered) return
    onSkip()
  }, [answered, onSkip])

  const onKeyDown = (e) => {
    if (e.key === 'Enter') submit()
    if (e.key === 'Escape') skip()
  }

  return (
    <>
      {/* Header */}
      <div className="panel-header">
        <h2>🌊 Guess the Sea</h2>
        <p className="panel-subtitle">
          The highlighted body of water is shown on the globe.<br />
          Type its name to score.
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

      {/* Input / reveal */}
      <div className="cap-question">
        {!current ? (
          <p style={{ color: 'var(--text-dim)', textAlign: 'center', padding: '20px' }}>
            All seas completed! 🎉
          </p>
        ) : answered ? (
          <div className="cap-reveal cap-skipped">
            ⏭️ {seaName}
          </div>
        ) : (
          <div className={`input-wrap cap-input-wrap ${status === 'wrong' ? 'flash-miss' : status === 'correct' ? 'flash-hit' : ''}`}>
            <div className="input-row">
              <input
                ref={inputRef}
                className="country-input"
                type="text"
                placeholder="Name this sea or ocean…"
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
          {current && !answered && (
            <button className="cap-skip-btn" onClick={skip}>Skip ⏭</button>
          )}
          {current && (
            <button className="cap-next-btn" onClick={onCorrect}>Next →</button>
          )}
        </div>
      </div>

      {/* History */}
      {history.length > 0 && (
        <div className="guesses-section">
          <h3 className="guesses-title">
            History <span className="guess-count">{history.length}</span>
          </h3>
          <ul className="guess-list">
            {[...history].reverse().map((h, i) => (
              <li key={i} className="guess-item">
                <span className="guess-swatch" style={{ background: h.correct ? '#39ff14' : '#ef4444' }} />
                <span className="guess-name">{h.name}</span>
                <span className="guess-dist" style={{ color: h.correct ? '#39ff14' : '#ef4444' }}>
                  {h.correct ? '✓' : '✗'}
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
