import { useState, useRef, useEffect } from 'react'
import { normalizeInput, resolveAlias } from '../utils/aliases'
import GameIntro from './GameIntro'
import { playCorrect, playWin } from '../utils/sounds'

const normalize = normalizeInput
const COUNTDOWN_SECONDS = 15 * 60

function formatTime(secs) {
  const m = Math.floor(Math.abs(secs) / 60).toString().padStart(2, '0')
  const s = (Math.abs(secs) % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

export default function NameAllPanel({ countries, found, onGuess, onNewGame, onMissed, countryInfo, blindMode = false, onBlindChange }) {
  const [input, setInput]             = useState('')
  const [flash, setFlash]             = useState(null)
  // null | 'normal' | 'blind'
  const [mapStyle, setMapStyle]       = useState(null)
  // null | 'countdown' | 'countup'
  const [timerMode, setTimerMode]     = useState(null)
  const [elapsed, setElapsed]         = useState(0)
  const [remaining, setRemaining]     = useState(COUNTDOWN_SECONDS)
  const [running, setRunning]         = useState(false)
  const [expired, setExpired]         = useState(false)
  const [confirmStop, setConfirmStop] = useState(false)
  const [gameOver, setGameOver]       = useState(false)

  const inputRef = useRef(null)
  const tickRef  = useRef(null)

  const total        = countries.length
  const countryNames = countries.map(f => f.properties.NAME)
  const activeNames  = new Set(countryNames)
  const activeFound  = found.filter(f => activeNames.has(f.name))
  const foundSet     = new Set(activeFound.map(f => f.name))
  const allFound     = activeFound.length === total && total > 0

  useEffect(() => { inputRef.current?.focus() }, [])

  // Ticker
  useEffect(() => {
    if (!running || !timerMode) return
    tickRef.current = setInterval(() => {
      if (timerMode === 'countdown') {
        setRemaining(t => {
          if (t <= 1) { clearInterval(tickRef.current); setRunning(false); setExpired(true); return 0 }
          return t - 1
        })
      } else {
        setElapsed(t => t + 1)
      }
    }, 1000)
    return () => clearInterval(tickRef.current)
  }, [running, timerMode])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { if (expired) revealMissed() }, [expired])

  useEffect(() => {
    if (allFound && running) { clearInterval(tickRef.current); setRunning(false) }
  }, [allFound, running])

  const revealMissed = () => {
    const missed = countries.filter(f => !foundSet.has(f.properties.NAME))
    onMissed(missed)
    setGameOver(true)
  }

  const startTimer = (mode) => {
    onNewGame()
    setTimerMode(mode)
    setElapsed(0)
    setRemaining(COUNTDOWN_SECONDS)
    setExpired(false)
    setConfirmStop(false)
    setGameOver(false)
    setRunning(true)
  }

  const handlePickMapStyle = (style) => {
    setMapStyle(style)
    onBlindChange?.(style === 'blind')
  }

  const handleReset = () => {
    clearInterval(tickRef.current)
    setRunning(false)
    setTimerMode(null)
    setMapStyle(null)
    setElapsed(0)
    setRemaining(COUNTDOWN_SECONDS)
    setExpired(false)
    setConfirmStop(false)
    setGameOver(false)
    onMissed([])
    onNewGame()
    onBlindChange?.(false)
  }

  const tryGuess = (raw) => {
    if (expired || gameOver) return
    const q = normalize(raw)
    if (!q) return
    const resolved = resolveAlias(raw, countryNames)
    const match = resolved ? countries.find(f => f.properties.NAME === resolved) : null
    if (match && !foundSet.has(match.properties.NAME)) {
      onGuess(match)
      setInput('')
      setFlash('hit')
      setTimeout(() => setFlash(null), 500)
      const newFoundCount = foundSet.size + 1
      if (newFoundCount >= countries.length) playWin()
      else playCorrect()
      return true
    }
    return false
  }

  const onInputChange = (e) => { const val = e.target.value; setInput(val); tryGuess(val) }
  const onKeyDown = (e) => { if (e.key === 'Enter') tryGuess(input) }

  const countdownDanger = timerMode === 'countdown' && remaining < 120
  const missedCountries = gameOver
    ? countries.filter(f => !foundSet.has(f.properties.NAME)).map(f => f.properties.NAME).sort()
    : []

  const [started, setStarted] = useState(false)
  if (!started) return (
    <GameIntro
      icon="🌍"
      title="Name All Countries"
      desc="Type every country in the world. Countries light up on the globe as you name them."
      rules={[
        '⏱ Choose countdown or free play',
        '🙈 Optional: start with an empty globe',
        '💡 Alternate spellings and aliases accepted',
        '🌐 All 196 countries included',
      ]}
      onStart={() => setStarted(true)}
    />
  )

  return (
    <>
      {/* Header */}
      <div className="panel-header">
        <h2>🌍 All Countries</h2>
        <p className="panel-subtitle">
          {blindMode
            ? 'Globe starts empty — countries appear as you name them.'
            : 'Type every country in the world. Countries light up as you find them.'}
        </p>
      </div>

      {/* Step 1: Map style picker */}
      {!mapStyle && !allFound && (
        <div className="na-map-picker">
          <p className="na-map-picker-label">How do you want to play?</p>
          <button className="na-map-opt" onClick={() => handlePickMapStyle('normal')}>
            <span className="na-map-opt-icon">🗺️</span>
            <div className="na-map-opt-text">
              <strong>Normal globe</strong>
              <span>Countries are visible on the globe</span>
            </div>
            <span className="na-map-opt-arrow">›</span>
          </button>
          <button className="na-map-opt" onClick={() => handlePickMapStyle('blind')}>
            <span className="na-map-opt-icon">🙈</span>
            <div className="na-map-opt-text">
              <strong>Empty globe</strong>
              <span>Globe starts empty — countries appear as you name them</span>
            </div>
            <span className="na-map-opt-arrow">›</span>
          </button>
        </div>
      )}

      {/* Step 2: Timer picker */}
      {mapStyle && !timerMode && !allFound && (
        <div className="na-timer-picker">
          <span className="na-timer-label">Choose mode</span>
          <button className="na-timer-opt" onClick={() => startTimer('countdown')}>⏳ 15 min countdown</button>
          <button className="na-timer-opt" onClick={() => startTimer('countup')}>⏱ Free play</button>
        </div>
      )}

      {/* Active timer bar */}
      {timerMode && (
        <div className={`na-timer-bar${countdownDanger ? ' na-timer-danger' : ''}`}>
          <span className="na-timer-clock">
            {timerMode === 'countdown' ? formatTime(remaining) : formatTime(elapsed)}
          </span>
          <span className="na-timer-type">
            {timerMode === 'countdown' ? '⏳ countdown' : '⏱ free play'}
          </span>
          <div className="na-timer-controls">
            {!expired && !allFound && !gameOver && (
              <button className="na-timer-btn" onClick={() => setRunning(r => !r)}>
                {running ? '⏸' : '▶'}
              </button>
            )}
            {!gameOver && (
              <button className="na-timer-btn na-timer-stop" onClick={() => setConfirmStop(true)} title="Stop">✕</button>
            )}
          </div>
        </div>
      )}

      {/* Confirm stop */}
      {confirmStop && (
        <div className="na-confirm-stop">
          <span>Stop? This will reveal missed countries.</span>
          <div className="na-confirm-btns">
            <button className="na-confirm-yes" onClick={() => {
              clearInterval(tickRef.current); setRunning(false); setConfirmStop(false); revealMissed()
            }}>Stop</button>
            <button className="na-confirm-no" onClick={() => setConfirmStop(false)}>Keep going</button>
          </div>
        </div>
      )}

      {/* Expired */}
      {expired && (
        <div className="na-expired">
          ⌛ Time's up! You found <strong>{activeFound.length}</strong> / {total} countries.
        </div>
      )}

      {/* Counter */}
      <div className="na-counter">
        <div className="na-counter-row">
          <span className="na-count-num">{activeFound.length}</span>
          <span className="na-count-sep">/</span>
          <span className="na-count-total">{total}</span>
          <span className="na-count-label">countries found</span>
        </div>
        <div className="na-progress-track">
          <div className="na-progress-fill" style={{ width: `${total ? (activeFound.length / total) * 100 : 0}%` }} />
        </div>
      </div>

      {/* Win banner */}
      {allFound && (
        <div className="win-banner">
          <span className="win-emoji">🎉</span>
          <div>
            <strong>You got them all!</strong>
            <p>
              Every country named
              {timerMode === 'countup'   ? ` in ${formatTime(elapsed)}` : ''}
              {timerMode === 'countdown' ? ` with ${formatTime(remaining)} to spare` : ''}
              !
            </p>
          </div>
        </div>
      )}

      {/* Input */}
      {timerMode && !allFound && !expired && !gameOver && (
        <div className="input-wrap">
          <div className={`input-row ${flash ? `flash-${flash}` : ''}`}>
            <input
              ref={inputRef}
              className="country-input"
              type="text"
              placeholder={!running ? 'Paused…' : 'Type a country name…'}
              value={input}
              onChange={onInputChange}
              onKeyDown={onKeyDown}
              autoComplete="off"
              spellCheck={false}
              disabled={!running}
            />
            <button className="guess-btn" onClick={() => tryGuess(input)} disabled={!running}>Go</button>
          </div>
        </div>
      )}

      {/* Missed list */}
      {gameOver && missedCountries.length > 0 && (
        <div className="guesses-section">
          <h3 className="guesses-title">
            Missed <span className="guess-count guess-count-missed">{missedCountries.length}</span>
          </h3>
          <ul className="guess-list">
            {missedCountries.map(name => (
              <li key={name} className="guess-item guess-item-missed">
                <span className="guess-swatch" style={{ background: '#ef4444' }} />
                <span className="guess-name">{name}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Found list */}
      {activeFound.length > 0 && (
        <div className="guesses-section">
          <h3 className="guesses-title">
            Found <span className="guess-count">{activeFound.length}</span>
          </h3>
          <ul className="guess-list">
            {[...activeFound].reverse().map(f => (
              <li key={f.name} className="guess-item">
                <span className="guess-swatch" style={{ background: '#39ff14' }} />
                <span className="guess-name">{f.name}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Footer */}
      <div className="panel-footer">
        {!timerMode && mapStyle
          ? <button className="new-game-btn na-start-default" onClick={() => startTimer('countup')}>▶ Start</button>
          : timerMode
          ? <button className="new-game-btn" onClick={handleReset}>↩ Reset</button>
          : null
        }
      </div>
    </>
  )
}
