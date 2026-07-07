import { useState, useEffect, useRef, useCallback } from 'react'
import { resolveAlias } from '../utils/aliases'

const TIMERS = { standard: 20 * 60, hard: 30 * 60 }
const fmt = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function SpotlightPanel({
  gameCountries,
  countryInfo,
  onCurrentChange,   // (feature | null) → highlighted on globe
  onFoundChange,     // (names[]) → shown green on globe
  onMissedChange,    // (names[]) → shown red at end
}) {
  const [phase,     setPhase]     = useState('select')   // select | playing | done
  const [gameMode,  setGameMode]  = useState(null)       // 'standard' | 'hard'
  const [queue,     setQueue]     = useState([])
  const [idx,       setIdx]       = useState(0)
  const [found,     setFound]     = useState([])
  const [timeLeft,  setTimeLeft]  = useState(0)
  const [input,     setInput]     = useState('')
  const [flash,     setFlash]     = useState(null)
  const [confirmGU, setConfirmGU] = useState(false)

  const inputRef  = useRef(null)
  const timerRef  = useRef(null)
  const idxRef    = useRef(0)
  const foundRef  = useRef([])
  const queueRef  = useRef([])
  const modeRef   = useRef(null)

  // keep refs in sync
  idxRef.current   = idx
  foundRef.current = found
  queueRef.current = queue
  modeRef.current  = gameMode

  const total   = queue.length
  const current = queue[idx] ?? null

  // ── Globe sync ────────────────────────────────────────────────────────────
  useEffect(() => {
    onCurrentChange(phase === 'playing' ? current : null)
  }, [current, phase])

  // ── End game ──────────────────────────────────────────────────────────────
  const endGame = useCallback(() => {
    clearInterval(timerRef.current)
    setPhase('done')
    onCurrentChange(null)
    const foundSet = new Set(foundRef.current)
    const missed = queueRef.current.map(f => f.properties.NAME).filter(n => !foundSet.has(n))
    onMissedChange(missed)
    // Always show found (green) at end — both modes
    onFoundChange(foundRef.current)
  }, [onCurrentChange, onMissedChange, onFoundChange])

  // ── Countdown timer ───────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'playing') return
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { endGame(); return 0 }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [phase, endGame])

  // ── Start ─────────────────────────────────────────────────────────────────
  const startGame = (mode) => {
    clearInterval(timerRef.current)
    onMissedChange([])
    onFoundChange([])
    const shuffled = shuffle(gameCountries)
    queueRef.current = shuffled
    setQueue(shuffled)
    setIdx(0)
    idxRef.current = 0
    foundRef.current = []
    setFound([])
    modeRef.current = mode
    setGameMode(mode)
    setTimeLeft(TIMERS[mode])
    setInput('')
    setFlash(null)
    setConfirmGU(false)
    setPhase('playing')
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  // ── Guess checking ────────────────────────────────────────────────────────
  const tryGuess = (raw) => {
    if (phase !== 'playing') return
    const curr = queueRef.current[idxRef.current]
    if (!curr) return

    const allNames = queueRef.current.map(f => f.properties.NAME)
    const resolved = resolveAlias(raw, allNames)
    if (!resolved || resolved !== curr.properties.NAME) return

    // Correct!
    const next = [...foundRef.current, resolved]
    foundRef.current = next
    setFound(next)
    // In standard mode update globe live; in hard mode only update at end
    if (modeRef.current === 'standard') onFoundChange(next)
    setInput('')
    setFlash('correct')
    setTimeout(() => setFlash(null), 400)

    const nextIdx = idxRef.current + 1
    if (nextIdx >= queueRef.current.length) {
      endGame()
    } else {
      setIdx(nextIdx)
      idxRef.current = nextIdx
    }
  }

  const handleInputChange = e => {
    const val = e.target.value
    setInput(val)
    tryGuess(val)
  }

  const urgent = timeLeft <= 60 && phase === 'playing'

  // ── Mode select screen ────────────────────────────────────────────────────
  if (phase === 'select') {
    return (
      <div className="spotlight-panel">
        <div className="spotlight-select">
          <div className="spotlight-select-icon">🌍</div>
          <h2 className="spotlight-select-title">Solo Map</h2>
          <p className="spotlight-select-desc">
            One country lights up on an otherwise empty globe — identify it to move on!
          </p>
          <div className="spotlight-mode-cards">
            <button className="spotlight-mode-card" onClick={() => startGame('standard')}>
              <span className="smc-icon">🟢</span>
              <div className="smc-body">
                <span className="smc-title">Standard</span>
                <span className="smc-detail">Guessed countries stay green · 20 min</span>
              </div>
            </button>
            <button className="spotlight-mode-card hard" onClick={() => startGame('hard')}>
              <span className="smc-icon">🔴</span>
              <div className="smc-body">
                <span className="smc-title">Hard</span>
                <span className="smc-detail">Only the current country is visible · 30 min</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── Playing / Done screen ─────────────────────────────────────────────────
  const missedList = phase === 'done'
    ? queue.map(f => f.properties.NAME).filter(n => !new Set(found).has(n))
    : []

  return (
    <div className="spotlight-panel">
      {/* Header: progress + timer */}
      <div className="missing-header">
        <div className="missing-progress-wrap">
          <div className="missing-progress-bar">
            <div className="missing-progress-fill" style={{ width: `${(found.length / total) * 100}%` }} />
          </div>
          <span className="missing-count">{found.length} / {total}</span>
        </div>
        <div className={`missing-timer ${urgent ? 'urgent' : ''}`}>{fmt(timeLeft)}</div>
      </div>

      <div className={`spotlight-badge ${gameMode}`}>
        {gameMode === 'hard' ? '🔴 Hard' : '🟢 Standard'}
      </div>

      {/* Input + give up */}
      {phase === 'playing' && (
        <div className="missing-form">
          <input
            ref={inputRef}
            className={`missing-input ${flash ?? ''}`}
            value={input}
            onChange={handleInputChange}
            placeholder="Which country is this?"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
          />
          {confirmGU ? (
            <div className="missing-giveup-confirm">
              <span>Give up the game?</span>
              <button className="missing-giveup-yes" onClick={() => { setConfirmGU(false); endGame() }}>Yes, reveal</button>
              <button className="missing-giveup-no"  onClick={() => { setConfirmGU(false); inputRef.current?.focus() }}>Cancel</button>
            </div>
          ) : (
            <button className="missing-giveup-btn" onClick={() => setConfirmGU(true)}>Give Up</button>
          )}
        </div>
      )}

      {/* Done banner */}
      {phase === 'done' && (
        <div className="missing-done-banner">
          {found.length === total
            ? <span className="missing-perfect">🎉 All {total} countries identified!</span>
            : <span className="missing-score">Identified {found.length} / {total}</span>
          }
          <button
            className="missing-start-btn"
            onClick={() => { onMissedChange([]); onFoundChange([]); setPhase('select') }}
          >
            Play Again
          </button>
        </div>
      )}

      {/* Found list */}
      {found.length > 0 && (
        <div className="missing-list-block">
          <div className="missing-list-header found-header">✓ Identified ({found.length})</div>
          {[...found].reverse().map(name => (
            <div key={name} className="missing-list-item found-item">
              <span className="missing-item-flag">{countryInfo[name]?.flag ?? '🏳️'}</span>
              <span className="missing-item-name">{name}</span>
            </div>
          ))}
        </div>
      )}

      {/* Missed list (end only) */}
      {missedList.length > 0 && (
        <div className="missing-list-block">
          <div className="missing-list-header missed-header">✗ Missed ({missedList.length})</div>
          {missedList.map(name => (
            <div key={name} className="missing-list-item missed-item">
              <span className="missing-item-flag">{countryInfo[name]?.flag ?? '🏳️'}</span>
              <span className="missing-item-name">{name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
