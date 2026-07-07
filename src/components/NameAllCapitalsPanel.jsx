import { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import { normalizeInput } from '../utils/aliases'
import { CAPITALS } from '../utils/capitals'

const COUNTDOWN_SECONDS = 15 * 60

function formatTime(secs) {
  const m = Math.floor(Math.abs(secs) / 60).toString().padStart(2, '0')
  const s = (Math.abs(secs) % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

export default function NameAllCapitalsPanel({ gameCountries, countryInfo, onFoundChange, onMissedChange, onNewGame }) {
  const [input,       setInput]       = useState('')
  const [flash,       setFlash]       = useState(null)
  const [found,       setFound]       = useState([])   // [{name, capital, feature}]
  const [timerMode,   setTimerMode]   = useState(null) // null | 'countdown' | 'countup'
  const [elapsed,     setElapsed]     = useState(0)
  const [remaining,   setRemaining]   = useState(COUNTDOWN_SECONDS)
  const [running,     setRunning]     = useState(false)
  const [expired,     setExpired]     = useState(false)
  const [confirmStop, setConfirmStop] = useState(false)
  const [gameOver,    setGameOver]    = useState(false)

  const inputRef = useRef(null)
  const tickRef  = useRef(null)
  const foundRef = useRef([])
  foundRef.current = found

  // Build eligible pairs: countries that have a CAPITALS entry
  const eligiblePairs = useMemo(() => {
    const pairs = []
    for (const f of gameCountries) {
      const name = f.properties.NAME
      const caps = CAPITALS[name]
      if (caps) pairs.push({ name, capitals: caps, feature: f })
    }
    return pairs
  }, [gameCountries])

  // Reverse lookup: normalized capital → country name
  const capToCountry = useMemo(() => {
    const map = {}
    for (const { name, capitals } of eligiblePairs) {
      for (const cap of capitals) {
        map[normalizeInput(cap)] = name
      }
    }
    return map
  }, [eligiblePairs])

  const total    = eligiblePairs.length
  const foundSet = useMemo(() => new Set(found.map(f => f.name)), [found])
  const allFound = found.length === total && total > 0

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

  const revealMissed = useCallback(() => {
    const missed = eligiblePairs.filter(p => !foundRef.current.some(f => f.name === p.name)).map(p => p.feature)
    onMissedChange(missed)
    setGameOver(true)
  }, [eligiblePairs, onMissedChange])

  useEffect(() => { if (expired) revealMissed() }, [expired, revealMissed])

  // Stop timer when all found
  useEffect(() => {
    if (allFound && running) {
      clearInterval(tickRef.current)
      setRunning(false)
    }
  }, [allFound, running])

  const startTimer = (mode) => {
    onNewGame()
    onMissedChange([])
    onFoundChange([])
    clearInterval(tickRef.current)
    foundRef.current = []
    setFound([])
    setTimerMode(mode)
    setElapsed(0)
    setRemaining(COUNTDOWN_SECONDS)
    setExpired(false)
    setConfirmStop(false)
    setGameOver(false)
    setRunning(true)
    setInput('')
    setFlash(null)
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  const handleReset = () => {
    clearInterval(tickRef.current)
    setRunning(false)
    setTimerMode(null)
    setElapsed(0)
    setRemaining(COUNTDOWN_SECONDS)
    setExpired(false)
    setConfirmStop(false)
    setGameOver(false)
    foundRef.current = []
    setFound([])
    setInput('')
    setFlash(null)
    onMissedChange([])
    onFoundChange([])
    onNewGame()
  }

  const tryGuess = (raw) => {
    if (expired || gameOver) return
    const q = normalizeInput(raw)
    if (!q) return
    const countryName = capToCountry[q]
    if (!countryName) return
    if (foundRef.current.some(f => f.name === countryName)) return

    const pair = eligiblePairs.find(p => p.name === countryName)
    if (!pair) return

    const next = [...foundRef.current, { name: countryName, capital: CAPITALS[countryName][0], feature: pair.feature }]
    foundRef.current = next
    setFound(next)
    onFoundChange(next)
    setInput('')
    setFlash('hit')
    setTimeout(() => setFlash(null), 500)

    if (next.length === total) revealMissed()
  }

  const onInputChange = e => { const v = e.target.value; setInput(v); tryGuess(v) }
  const onKeyDown    = e => { if (e.key === 'Enter') tryGuess(input) }

  const countdownDanger = timerMode === 'countdown' && remaining < 120

  return (
    <>
      <div className="panel-header">
        <h2>🏙️ Name All Capitals</h2>
        <p className="panel-subtitle">
          Type every capital city. Countries light up as you find them.
        </p>
      </div>

      {/* Timer mode picker */}
      {!timerMode && !allFound && (
        <div className="na-timer-picker">
          <span className="na-timer-label">🌍 World</span>
          <button className="na-timer-opt" onClick={() => startTimer('countdown')}>⏳ 15 min countdown</button>
          <button className="na-timer-opt" onClick={() => startTimer('countup')}>⏱ Count up</button>
        </div>
      )}

      {/* Active timer bar */}
      {timerMode && (
        <div className={`na-timer-bar${countdownDanger ? ' na-timer-danger' : ''}`}>
          <span className="na-timer-clock">
            {timerMode === 'countdown' ? formatTime(remaining) : formatTime(elapsed)}
          </span>
          <span className="na-timer-type">
            {timerMode === 'countdown' ? '⏳ countdown' : '⏱ count up'}
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
          <span>Stop? This will reveal missed capitals.</span>
          <div className="na-confirm-btns">
            <button className="na-confirm-yes" onClick={() => {
              clearInterval(tickRef.current); setRunning(false); setConfirmStop(false); revealMissed()
            }}>Stop</button>
            <button className="na-confirm-no" onClick={() => setConfirmStop(false)}>Keep going</button>
          </div>
        </div>
      )}

      {/* Time's up */}
      {expired && (
        <div className="na-expired">
          ⌛ Time's up! You found <strong>{found.length}</strong> / {total} capitals.
        </div>
      )}

      {/* Counter */}
      <div className="na-counter">
        <span className="na-count-num">{found.length}</span>
        <span className="na-count-sep"> / </span>
        <span className="na-count-total">{total}</span>
        <span className="na-count-label"> capitals found</span>
        <div className="na-progress-track">
          <div className="na-progress-fill" style={{ width: `${total ? (found.length / total) * 100 : 0}%` }} />
        </div>
      </div>

      {/* Win banner */}
      {allFound && (
        <div className="win-banner">
          <span className="win-emoji">🎉</span>
          <div>
            <strong>You got them all!</strong>
            <p>
              Every capital named
              {timerMode === 'countup'    ? ` in ${formatTime(elapsed)}` : ''}
              {timerMode === 'countdown'  ? ` with ${formatTime(remaining)} remaining` : ''}
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
              placeholder="Type a capital city…"
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

      {/* Missed list */}
      {gameOver && found.length < total && (
        <div className="guesses-section">
          <h3 className="guesses-title">
            Missed <span className="guess-count" style={{ background: '#ef4444' }}>{total - found.length}</span>
          </h3>
          <ul className="guess-list">
            {eligiblePairs
              .filter(p => !foundSet.has(p.name))
              .map(p => (
                <li key={p.name} className="guess-item">
                  <span className="guess-swatch" style={{ background: '#ef4444' }} />
                  <span className="guess-name">{p.capitals[0]}</span>
                  <span className="guess-dist" style={{ color: '#888', fontSize: '0.78em' }}>&nbsp;({p.name})</span>
                </li>
              ))}
          </ul>
        </div>
      )}

      {/* Found list */}
      {found.length > 0 && (
        <div className="guesses-section">
          <h3 className="guesses-title">Found <span className="guess-count">{found.length}</span></h3>
          <ul className="guess-list">
            {[...found].reverse().map(f => (
              <li key={f.name} className="guess-item">
                <span className="guess-swatch" style={{ background: '#39ff14' }} />
                <span className="guess-name">{f.capital}</span>
                <span className="guess-dist" style={{ color: '#888', fontSize: '0.78em' }}>&nbsp;({f.name})</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="panel-footer">
        <button className="new-game-btn" onClick={handleReset}>🔄 Reset</button>
      </div>
    </>
  )
}
