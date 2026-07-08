import { useState, useRef, useEffect, useMemo } from 'react'
import { normalizeInput, resolveAlias } from '../utils/aliases'

const normalize = normalizeInput
const COUNTDOWN_SECONDS = 15 * 60

const CONTINENTS = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania']

function formatTime(secs) {
  const m = Math.floor(Math.abs(secs) / 60).toString().padStart(2, '0')
  const s = (Math.abs(secs) % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

const PB_KEY = (continent) => `orbis_pb_${continent}`

function getPersonalBest(continent) {
  try { return parseInt(localStorage.getItem(PB_KEY(continent)) ?? '', 10) || null } catch { return null }
}
function savePersonalBest(continent, secs) {
  try { localStorage.setItem(PB_KEY(continent), String(secs)) } catch {}
}

export default function NameAllPanel({ countries, found, onGuess, onNewGame, onMissed, countryInfo }) {
  const [input, setInput]               = useState('')
  const [flash, setFlash]               = useState(null)
  // 'world' | continent name
  const [subMode, setSubMode]           = useState('world')
  // timer
  const [timerMode, setTimerMode]       = useState(null)  // null | 'countdown' | 'countup' | 'speedrun'
  const [elapsed, setElapsed]           = useState(0)
  const [remaining, setRemaining]       = useState(COUNTDOWN_SECONDS)
  const [running, setRunning]           = useState(false)
  const [expired, setExpired]           = useState(false)
  const [confirmStop, setConfirmStop]   = useState(false)
  const [gameOver, setGameOver]         = useState(false)
  const [newPb, setNewPb]               = useState(false)

  const inputRef = useRef(null)
  const tickRef  = useRef(null)

  // Filter countries for current sub-mode
  const activeCountries = useMemo(() => {
    if (subMode === 'world' || !countryInfo) return countries
    return countries.filter(f => countryInfo[f.properties.NAME]?.continent === subMode)
  }, [countries, subMode, countryInfo])

  const total    = activeCountries.length
  const countryNames = activeCountries.map(f => f.properties.NAME)
  const activeNames  = new Set(countryNames)

  // Only count found countries that belong to the active set
  const activeFound = found.filter(f => activeNames.has(f.name))
  const foundSet    = new Set(activeFound.map(f => f.name))
  const allFound    = activeFound.length === total && total > 0

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

  // Expire → reveal missed
  useEffect(() => { if (expired) revealMissed() }, [expired])

  // All found → stop timer, check PB for speedrun
  useEffect(() => {
    if (allFound && running) {
      clearInterval(tickRef.current)
      setRunning(false)
      if (timerMode === 'speedrun') {
        const pb = getPersonalBest(subMode)
        if (!pb || elapsed < pb) {
          savePersonalBest(subMode, elapsed)
          setNewPb(true)
        }
      }
    }
  }, [allFound, running, timerMode, elapsed, subMode])

  const revealMissed = () => {
    const missed = activeCountries.filter(f => !foundSet.has(f.properties.NAME))
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
    setNewPb(false)
    setRunning(true)
  }

  const startSpeedrun = (continent) => {
    setSubMode(continent)
    onNewGame()
    setTimerMode('speedrun')
    setElapsed(0)
    setExpired(false)
    setConfirmStop(false)
    setGameOver(false)
    setNewPb(false)
    setRunning(true)
  }

  const togglePause = () => setRunning(r => !r)
  const handleStopClick = () => setConfirmStop(true)
  const cancelStop = () => setConfirmStop(false)

  const confirmStopTimer = () => {
    clearInterval(tickRef.current)
    setRunning(false)
    setConfirmStop(false)
    revealMissed()
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
    setNewPb(false)
    setSubMode('world')
    onMissed([])
    onNewGame()
  }

  const tryGuess = (raw) => {
    if (expired || gameOver) return
    const q = normalize(raw)
    if (!q) return
    const resolved = resolveAlias(raw, countryNames)
    const match = resolved ? activeCountries.find(f => f.properties.NAME === resolved) : null
    if (match && !foundSet.has(match.properties.NAME)) {
      onGuess(match)
      setInput('')
      triggerFlash('hit')
      return true
    }
    return false
  }

  const triggerFlash = (type) => {
    setFlash(type)
    setTimeout(() => setFlash(null), 500)
  }

  const onInputChange = (e) => { const val = e.target.value; setInput(val); tryGuess(val) }
  const onKeyDown = (e) => { if (e.key === 'Enter') tryGuess(input) }

  const countdownDanger = timerMode === 'countdown' && remaining < 120
  const missedCountries = gameOver
    ? activeCountries.filter(f => !foundSet.has(f.properties.NAME)).map(f => f.properties.NAME).sort()
    : []

  const isSpeedrun = timerMode === 'speedrun'
  const pb = isSpeedrun ? getPersonalBest(subMode) : null

  return (
    <>
      {/* Header */}
      <div className="panel-header">
        <h2>🌍 All Countries</h2>
        <p className="panel-subtitle">
          {isSpeedrun
            ? `Name all countries in ${subMode} as fast as you can.`
            : 'Type every country in the world. Countries turn green as you find them.'}
        </p>
      </div>

      {/* Mode picker — only when idle */}
      {!timerMode && !allFound && (
        <>
          {/* World timer options */}
          <div className="na-timer-picker">
            <span className="na-timer-label">🌍 World</span>
            <button className="na-timer-opt" onClick={() => startTimer('countdown')}>⏳ 15 min countdown</button>
            <button className="na-timer-opt" onClick={() => startTimer('countup')}>⏱ Count up</button>
          </div>

          {/* Continent speedrun options */}
          {countryInfo && (
            <div className="na-timer-picker na-continent-picker">
              <span className="na-timer-label">🏁 Continent Speedrun</span>
              {CONTINENTS.map(c => {
                const cpb = getPersonalBest(c)
                return (
                  <button key={c} className="na-timer-opt na-continent-opt" onClick={() => startSpeedrun(c)}>
                    {c}
                    {cpb && <span className="na-pb-badge">PB {formatTime(cpb)}</span>}
                  </button>
                )
              })}
            </div>
          )}
        </>
      )}

      {/* Active timer bar */}
      {timerMode && (
        <div className={`na-timer-bar${countdownDanger ? ' na-timer-danger' : ''}`}>
          <span className="na-timer-clock">
            {timerMode === 'countdown' ? formatTime(remaining) : formatTime(elapsed)}
          </span>
          <span className="na-timer-type">
            {timerMode === 'countdown' ? '⏳ countdown'
              : isSpeedrun ? `🏁 ${subMode}`
              : '⏱ count up'}
          </span>
          {pb && !allFound && (
            <span className="na-pb-live">PB {formatTime(pb)}</span>
          )}
          <div className="na-timer-controls">
            {!expired && !allFound && !gameOver && (
              <button className="na-timer-btn" onClick={togglePause}>{running ? '⏸' : '▶'}</button>
            )}
            {!gameOver && (
              <button className="na-timer-btn na-timer-stop" onClick={handleStopClick} title="Stop">✕</button>
            )}
          </div>
        </div>
      )}

      {/* Confirm stop */}
      {confirmStop && (
        <div className="na-confirm-stop">
          <span>Stop? This will reveal missed countries.</span>
          <div className="na-confirm-btns">
            <button className="na-confirm-yes" onClick={confirmStopTimer}>Stop</button>
            <button className="na-confirm-no" onClick={cancelStop}>Keep going</button>
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
        <span className="na-count-num">{activeFound.length}</span>
        <span className="na-count-sep"> / </span>
        <span className="na-count-total">{total}</span>
        <span className="na-count-label"> {isSpeedrun ? `${subMode} countries` : 'countries found'}</span>
        <div className="na-progress-track">
          <div className="na-progress-fill" style={{ width: `${total ? (activeFound.length / total) * 100 : 0}%` }} />
        </div>
      </div>

      {/* Win banner */}
      {allFound && (
        <div className="win-banner">
          <span className="win-emoji">{newPb ? '🏆' : '🎉'}</span>
          <div>
            <strong>{newPb ? 'New personal best!' : 'You got them all!'}</strong>
            <p>
              {isSpeedrun ? `${subMode} completed in ${formatTime(elapsed)}!` : (
                <>
                  Every country named
                  {timerMode === 'countup' ? ` in ${formatTime(elapsed)}` : ''}
                  {timerMode === 'countdown' ? ` with ${formatTime(remaining)} remaining` : ''}
                  !
                </>
              )}
            </p>
          </div>
        </div>
      )}

      {/* Input */}
      {!allFound && !expired && !gameOver && (
        <div className="input-wrap">
          <div className={`input-row ${flash ? `flash-${flash}` : ''}`}>
            <input
              ref={inputRef}
              className="country-input"
              type="text"
              placeholder={isSpeedrun ? `Type a ${subMode} country…` : 'Type a country name…'}
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
      {gameOver && missedCountries.length > 0 && (
        <div className="guesses-section">
          <h3 className="guesses-title">
            Missed <span className="guess-count" style={{ background: '#ef4444' }}>{missedCountries.length}</span>
          </h3>
          <ul className="guess-list">
            {missedCountries.map(name => (
              <li key={name} className="guess-item">
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
          <h3 className="guesses-title">Found <span className="guess-count">{activeFound.length}</span></h3>
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
        <button className="new-game-btn" onClick={handleReset}>🔄 Reset</button>
      </div>
    </>
  )
}
