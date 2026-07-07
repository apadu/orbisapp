import { useState, useRef, useEffect, useMemo } from 'react'
import { resolveAlias, findClosestMatch } from '../utils/aliases'

/** Streak multiplier: 1x, 1.5x, 2x, 3x, 4x (capped) */
function calcPoints(streak) {
  if (streak <= 1) return 100
  if (streak === 2) return 150
  if (streak === 3) return 200
  if (streak === 4) return 300
  return 400
}

function streakLabel(streak) {
  if (streak >= 5) return '🔥 On fire!'
  if (streak >= 3) return '⚡ Streak!'
  if (streak >= 2) return '✨ Nice!'
  return null
}

export default function FlagPanel({
  current, answered, correct, countryNames,
  onGuess, onSkip, onNext, score, history, streak
}) {
  const [input, setInput]           = useState('')
  const [didYouMean, setDidYouMean] = useState(null)
  const inputRef = useRef(null)

  useEffect(() => {
    setInput('')
    setDidYouMean(null)
    setTimeout(() => inputRef.current?.focus(), 50)
  }, [current?.name])

  if (!current) return null

  const pct = score.total ? Math.round((score.correct / score.total) * 100) : 0
  const nextPts = calcPoints(streak + 1)

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
  }

  const lastResult = history.length > 0 ? history[history.length - 1] : null

  return (
    <>
      <div className="panel-header">
        <h2>🚩 Flag Quiz</h2>
        <p className="panel-subtitle">Name the country from its flag.</p>
      </div>

      {/* Score bar */}
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
        <div className="stat-item">
          <span className="stat-num" style={{ color: streak >= 3 ? '#f97316' : 'inherit' }}>{streak}</span>
          <span className="stat-label">Streak</span>
        </div>
        <div className="stat-item">
          <span className="stat-num" style={{ color: '#a78bfa' }}>{score.points}</span>
          <span className="stat-label">Points</span>
        </div>
      </div>

      {/* Flag display */}
      <div className="flag-display">
        <span className="flag-emoji">{current.flag}</span>
        {streak >= 2 && !answered && (
          <div className="flag-streak-label">{streakLabel(streak)} +{nextPts} pts next</div>
        )}
      </div>

      {/* Result or input */}
      {answered ? (
        <div className={`cap-result ${correct ? 'cap-result-correct' : 'cap-result-wrong'}`}>
          {correct
            ? `✅ ${current.name}! +${lastResult?.pts ?? 0} pts`
            : `❌ It was ${current.name}`}
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
                <span style={{ fontSize: '1.2rem', marginRight: '6px' }}>{h.flag}</span>
                <span className="guess-name">{h.name}</span>
                <span className="guess-dist" style={{ color: h.correct ? '#39ff14' : '#ef4444', marginLeft: 'auto' }}>
                  {h.correct ? `+${h.pts}` : '✗'}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  )
}
