import { useState, useRef, useEffect } from 'react'
import GameIntro from './GameIntro'
import { playCorrect, playWrong } from '../utils/sounds'

function norm(s) {
  return s.trim().toLowerCase().replace(/[^a-z]/g, '')
}

export default function NeighborPanel({ target, neighbors, found, missed, done, score, history, onGuess, onGiveUp, onNext, onGameStart }) {
  const [input, setInput] = useState('')
  const [flash, setFlash] = useState(null)
  const inputRef = useRef(null)

  // Reset input and focus whenever a new target loads
  useEffect(() => {
    setInput('')
    setFlash(null)
    setTimeout(() => inputRef.current?.focus(), 50)
  }, [target])

  const total    = neighbors.length
  const allFound = done && missed.length === 0

  const tryGuess = (raw) => {
    if (!raw.trim() || done) return
    const hit = onGuess(raw)
    if (hit) {
      setInput('')
      setFlash('hit')
      setTimeout(() => setFlash(null), 400)
      playCorrect()
    }
  }

  const onKeyDown     = (e) => { if (e.key === 'Enter') tryGuess(input) }
  const onInputChange = (e) => {
    const v = e.target.value
    setInput(v)
    if (v.endsWith(',')) tryGuess(v.replace(',', ''))
  }

  const [started, setStarted] = useState(false)
  if (!started) return (
    <GameIntro
      icon="📌"
      title="Neighbor Challenge"
      desc="A country is highlighted — name all countries that share a border with it."
      rules={[
        '🗺️ Countries that share a land border count',
        '❌ Missed ones revealed in red',
        '🔄 New country every round',
        '📈 Build a streak for bonus points',
      ]}
      onStart={() => { setStarted(true); onGameStart?.() }}
      disabled={!target}
    />
  )

  if (!target) return (
    <div className="panel-header">
      <h2>📌 Neighbor Challenge</h2>
      <p className="panel-subtitle">Loading…</p>
    </div>
  )

  const targetName = target.properties.NAME

  return (
    <>
      <div className="panel-header">
        <h2>📌 Neighbor Challenge</h2>
        <p className="panel-subtitle">Name all countries that share a border with it.</p>
      </div>

      {/* Score */}
      <div className="locate-score-bar">
        <span className="locate-score-num">{score}</span>
        <span className="locate-score-label">total points</span>
        <span className="locate-round-count">{history.length} rounds</span>
      </div>

      {/* Target country */}
      <div className="neighbor-target">
        <span className="neighbor-target-label">Borders of</span>
        <span className="neighbor-target-name">{targetName}</span>
      </div>

      {/* Progress */}
      <div className="na-counter">
        <span className="na-count-num">{found.length}</span>
        <span className="na-count-sep"> / </span>
        <span className="na-count-total">{total}</span>
        <span className="na-count-label"> neighbors found</span>
        <div className="na-progress-track">
          <div className="na-progress-fill" style={{ width: `${total ? (found.length / total) * 100 : 0}%` }} />
        </div>
      </div>

      {/* Win banner */}
      {allFound && (
        <div className="win-banner">
          <span className="win-emoji">🎉</span>
          <div>
            <strong>Perfect!</strong>
            <p>All {total} neighbors of {targetName} found!</p>
          </div>
        </div>
      )}

      {/* Input */}
      {!done && (
        <div className="input-wrap">
          <div className={`input-row ${flash ? `flash-${flash}` : ''}`}>
            <input
              ref={inputRef}
              className="country-input"
              type="text"
              placeholder="Type a neighboring country…"
              value={input}
              onChange={onInputChange}
              onKeyDown={onKeyDown}
              autoComplete="off"
              spellCheck={false}
            />
            <button className="guess-btn" onClick={() => tryGuess(input)}>Go</button>
          </div>
        </div>
      )}

      {/* Buttons */}
      <div className="neighbor-actions">
        {!done
          ? <button className="neighbor-giveup-btn" onClick={() => { playWrong(); onGiveUp() }}>Give Up</button>
          : <button className="new-game-btn" onClick={onNext}>Next country →</button>
        }
      </div>

      {/* Missed */}
      {missed.length > 0 && (
        <div className="guesses-section">
          <h3 className="guesses-title">
            Missed <span className="guess-count" style={{ background: '#ef4444' }}>{missed.length}</span>
          </h3>
          <ul className="guess-list">
            {missed.map(n => (
              <li key={n} className="guess-item">
                <span className="guess-swatch" style={{ background: '#ef4444' }} />
                <span className="guess-name">{n}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Found */}
      {found.length > 0 && (
        <div className="guesses-section">
          <h3 className="guesses-title">
            Found <span className="guess-count">{found.length}</span>
          </h3>
          <ul className="guess-list">
            {[...found].reverse().map(n => (
              <li key={n} className="guess-item">
                <span className="guess-swatch" style={{ background: '#39ff14' }} />
                <span className="guess-name">{n}</span>
                <span className="guess-dist" style={{ color: '#39ff14' }}>+100</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* History */}
      {history.length > 0 && (
        <div className="guesses-section">
          <h3 className="guesses-title">History</h3>
          <ul className="guess-list">
            {[...history].reverse().map((h, i) => (
              <li key={i} className="guess-item">
                <span className="guess-swatch" style={{ background: h.found === h.total ? '#39ff14' : '#f97316' }} />
                <span className="guess-name">{h.target}</span>
                <span className="guess-dist">{h.found}/{h.total}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  )
}
