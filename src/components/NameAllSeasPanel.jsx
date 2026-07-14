import { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import GameIntro from './GameIntro'

const COUNTDOWN_SECONDS = 15 * 60

function formatTime(secs) {
  const m = Math.floor(Math.abs(secs) / 60).toString().padStart(2, '0')
  const s = (Math.abs(secs) % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

// Strip common sea/ocean words so "Pacific", "Pacific Ocean", "the Pacific" all match.
// Also strips "of"/"the" so "Gulf of Mexico" → "mexico", "Bay of Bengal" → "bengal".
function normSea(str) {
  return str.trim().toLowerCase()
    .replace(/\b(the|of|ocean|sea|gulf|bay|channel|strait|sound|passage|bight)\b/g, '')
    .replace(/[^a-z]/g, '')
}

export default function NameAllSeasPanel({ seas, onFoundChange, onMissedChange, onNewGame }) {
  const [input,       setInput]       = useState('')
  const [flash,       setFlash]       = useState(null)
  const [found,       setFound]       = useState([])
  const [timerMode,   setTimerMode]   = useState(null)
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

  // Build lookup: stripped name → feature, with plain fallback
  const seaMap = useMemo(() => {
    const map = {}
    for (const f of seas) {
      const name = f.properties.NAME
      if (!name) continue
      const stripped = normSea(name)
      if (stripped) map[stripped] = f
      // Plain fallback (no word stripping) so full name always matches
      const plain = name.trim().toLowerCase().replace(/[^a-z]/g, '')
      if (!map[plain]) map[plain] = f
    }
    return map
  }, [seas])

  const total    = seas.length
  const foundSet = useMemo(() => new Set(found.map(f => f.properties.NAME)), [found])
  const allFound = found.length === total && total > 0

  useEffect(() => { inputRef.current?.focus() }, [])

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
    const foundNames = new Set(foundRef.current.map(f => f.properties.NAME))
    const missed = seas.filter(f => !foundNames.has(f.properties.NAME))
    onMissedChange(missed)
    setGameOver(true)
  }, [seas, onMissedChange])

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
    if (!raw.trim()) return
    const q      = normSea(raw)
    const qPlain = raw.trim().toLowerCase().replace(/[^a-z]/g, '')
    const entry  = seaMap[q] || seaMap[qPlain]
    if (!entry) return
    if (foundRef.current.some(f => f.properties.NAME === entry.properties.NAME)) return

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
  const sortedSeas = useMemo(() => [...seas].sort((a, b) => a.properties.NAME.localeCompare(b.properties.NAME)), [seas])

  const [started, setStarted] = useState(false)
  if (!started) return (
    <GameIntro
      icon="🌊"
      title="Name All Seas"
      desc="Type every ocean and sea — they light up on the globe as you name them."
      rules={[
        '⏱ Choose countdown or free play',
        '🌊 Oceans, seas, gulfs, and bays all count',
        '💡 Abbreviations accepted (e.g. "Pacific")',
        '📈 Track your progress as you go',
      ]}
      onStart={() => setStarted(true)}
    />
  )

  return (
    <>
      <div className="panel-header">
        <h2>🌊 Name All Seas</h2>
        <p className="panel-subtitle">
          Type every ocean and sea. They light up on the globe as you find them.
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
          <span>Stop? This will reveal missed seas.</span>
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
          ⌛ Time's up! You found <strong>{found.length}</strong> / {total} seas.
        </div>
      )}

      {/* Counter */}
      <div className="na-counter">
        <span className="na-count-num">{found.length}</span>
        <span className="na-count-sep"> / </span>
        <span className="na-count-total">{total}</span>
        <span className="na-count-label"> seas found</span>
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
              Every ocean and sea named
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
              placeholder={!running ? 'Game paused' : 'Type an ocean or sea…'}
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
            {sortedSeas
              .filter(f => !foundSet.has(f.properties.NAME))
              .map(f => (
                <li key={f.properties.NAME} className="guess-item">
                  <span className="guess-swatch" style={{ background: '#ef4444' }} />
                  <span className="guess-name">{f.properties.NAME}</span>
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
              <li key={f.properties.NAME} className="guess-item">
                <span className="guess-swatch" style={{ background: '#39ff14' }} />
                <span className="guess-name">{f.properties.NAME}</span>
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
