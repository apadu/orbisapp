import { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import { COUNTRY_CURRENCY } from '../utils/countryCurrency'

const COUNTDOWN_SECONDS = 15 * 60

function formatTime(secs) {
  const m = Math.floor(Math.abs(secs) / 60).toString().padStart(2, '0')
  const s = (Math.abs(secs) % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

function normCurrency(str) {
  return str.trim().toLowerCase().replace(/[^a-z0-9]/g, '')
}

export default function NameAllCurrenciesPanel({ gameCountries, onFoundChange, onMissedChange, onNewGame }) {
  const [input,       setInput]       = useState('')
  const [flash,       setFlash]       = useState(null)
  const [found,       setFound]       = useState([]) // [{currencyName, code, countries:[{name,feature}]}]
  const [timerMode,   setTimerMode]   = useState(null)
  const [elapsed,     setElapsed]     = useState(0)
  const [remaining,   setRemaining]   = useState(COUNTDOWN_SECONDS)
  const [running,     setRunning]     = useState(false)
  const [expired,     setExpired]     = useState(false)
  const [confirmStop, setConfirmStop] = useState(false)
  const [gameOver,    setGameOver]    = useState(false)

  const inputRef  = useRef(null)
  const tickRef   = useRef(null)
  const foundRef  = useRef([])
  foundRef.current = found

  // Build reverse map: normalized currency name/code → entry
  const { currencyMap, allCurrencies } = useMemo(() => {
    const byName = {}
    for (const f of gameCountries) {
      const name = f.properties.NAME
      const cur  = COUNTRY_CURRENCY[name]
      if (!cur) continue
      const key = normCurrency(cur.name)
      if (!byName[key]) byName[key] = { currencyName: cur.name, code: cur.code, countries: [] }
      byName[key].countries.push({ name, feature: f })
    }
    // Build lookup (includes code aliases)
    const map = { ...byName }
    for (const entry of Object.values(byName)) {
      const codeKey = normCurrency(entry.code)
      if (!map[codeKey]) map[codeKey] = entry
    }
    // Deduplicated sorted list
    const seen = new Set()
    const all  = []
    for (const entry of Object.values(byName)) {
      if (!seen.has(entry.currencyName)) { seen.add(entry.currencyName); all.push(entry) }
    }
    all.sort((a, b) => a.currencyName.localeCompare(b.currencyName))
    return { currencyMap: map, allCurrencies: all }
  }, [gameCountries])

  const total    = allCurrencies.length
  const foundSet = useMemo(() => new Set(found.map(f => f.currencyName)), [found])
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
    const foundNames = new Set(foundRef.current.map(f => f.currencyName))
    const missedFeatures = []
    for (const cur of allCurrencies) {
      if (!foundNames.has(cur.currencyName)) {
        for (const c of cur.countries) missedFeatures.push(c.feature)
      }
    }
    onMissedChange(missedFeatures)
    setGameOver(true)
  }, [allCurrencies, onMissedChange])

  useEffect(() => { if (expired) revealMissed() }, [expired, revealMissed])

  useEffect(() => {
    if (allFound && running) { clearInterval(tickRef.current); setRunning(false) }
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
    const q = normCurrency(raw)
    if (!q) return
    const entry = currencyMap[q]
    if (!entry) return
    if (foundRef.current.some(f => f.currencyName === entry.currencyName)) return

    const next = [...foundRef.current, entry]
    foundRef.current = next
    setFound(next)
    onFoundChange(next)
    setInput('')
    setFlash('hit')
    setTimeout(() => setFlash(null), 500)

    if (next.length === total) revealMissed()
  }

  const onInputChange = e => { const v = e.target.value; setInput(v); tryGuess(v) }
  const onKeyDown     = e => { if (e.key === 'Enter') tryGuess(input) }

  const countdownDanger = timerMode === 'countdown' && remaining < 120

  return (
    <>
      <div className="panel-header">
        <h2>💰 Name All Currencies</h2>
        <p className="panel-subtitle">
          Type every currency. Countries light up as you find them.
        </p>
      </div>

      {/* Timer mode picker */}
      {!timerMode && !allFound && (
        <div className="na-timer-picker">
          <span className="na-timer-label">🌍 World</span>
          <button className="na-timer-opt" onClick={() => startTimer('countdown')}>⏳ 15 min countdown</button>
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
          <span>Stop? This will reveal missed currencies.</span>
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
          ⌛ Time's up! You found <strong>{found.length}</strong> / {total} currencies.
        </div>
      )}

      {/* Counter */}
      <div className="na-counter">
        <span className="na-count-num">{found.length}</span>
        <span className="na-count-sep"> / </span>
        <span className="na-count-total">{total}</span>
        <span className="na-count-label"> currencies found</span>
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
              Every currency named
              {timerMode === 'countup'   ? ` in ${formatTime(elapsed)}` : ''}
              {timerMode === 'countdown' ? ` with ${formatTime(remaining)} remaining` : ''}
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
              placeholder={!running ? 'Game paused' : 'Type a currency name or code…'}
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
      {gameOver && found.length < total && (
        <div className="guesses-section">
          <h3 className="guesses-title">
            Missed <span className="guess-count" style={{ background: '#ef4444' }}>{total - found.length}</span>
          </h3>
          <ul className="guess-list">
            {allCurrencies
              .filter(c => !foundSet.has(c.currencyName))
              .map(c => (
                <li key={c.currencyName} className="guess-item">
                  <span className="guess-swatch" style={{ background: '#ef4444' }} />
                  <span className="guess-name">{c.currencyName}</span>
                  <span className="guess-dist" style={{ color: '#888', fontSize: '0.78em' }}>
                    &nbsp;({c.code}) · {c.countries.length} {c.countries.length === 1 ? 'country' : 'countries'}
                  </span>
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
            {[...found].reverse().map(c => (
              <li key={c.currencyName} className="guess-item">
                <span className="guess-swatch" style={{ background: '#39ff14' }} />
                <span className="guess-name">{c.currencyName}</span>
                <span className="guess-dist" style={{ color: '#888', fontSize: '0.78em' }}>
                  &nbsp;({c.code}) · {c.countries.length} {c.countries.length === 1 ? 'country' : 'countries'}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="panel-footer">
        {!timerMode
          ? <button className="new-game-btn na-start-default" onClick={() => startTimer('countup')}>▶ Start</button>
          : <button className="new-game-btn" onClick={handleReset}>🔄 Reset</button>
        }
      </div>
    </>
  )
}
