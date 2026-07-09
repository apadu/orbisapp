import { useState, useEffect, useRef, useCallback } from 'react'
import { resolveAlias } from '../utils/aliases'

const TOTAL = 20
const SECS  = 240   // 4 minutes
const PB_KEY = 'orbis_blind_map_pb'

// Too small to identify by shape on the globe
const EXCLUDED = new Set([
  'Antigua and Barbuda', 'Barbados', 'Grenada', 'Saint Lucia',
  'Saint Kitts and Nevis', 'Saint Vincent and the Grenadines',
  'Trinidad and Tobago', 'Dominica',
  'Andorra', 'Liechtenstein', 'Monaco', 'Vatican', 'San Marino',
  'Bahrain', 'Singapore', 'Brunei', 'Timor-Leste',
  'Gambia',
])

const fmt = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

function loadPB() {
  try { return JSON.parse(localStorage.getItem(PB_KEY)) ?? null } catch { return null }
}
function savePB(secs) {
  try { localStorage.setItem(PB_KEY, JSON.stringify(secs)) } catch {}
}

export default function MissingPanel({ gameCountries, countryInfo, onHiddenChange, onMissedChange, onFoundChange, onComplete }) {
  const [phase,      setPhase]      = useState('idle')
  const [target,     setTarget]     = useState([])
  const [found,      setFound]      = useState([])
  const [timeLeft,   setTimeLeft]   = useState(SECS)
  const [input,      setInput]      = useState('')
  const [flash,      setFlash]      = useState(null)
  const [pb,         setPb]         = useState(loadPB)       // seconds (lower = better), null if none
  const [finishTime, setFinishTime] = useState(null)         // seconds used this run
  const [isNewPB,    setIsNewPB]    = useState(false)

  const inputRef  = useRef(null)
  const timerRef  = useRef(null)
  const targetRef = useRef([])
  const foundRef  = useRef([])

  targetRef.current = target
  foundRef.current  = found

  const stillHidden = target.filter(n => !found.includes(n))

  // ── Tell the globe which countries to hide ────────────────────────────────
  useEffect(() => {
    if (phase === 'playing') {
      onHiddenChange(new Set(target.filter(n => !found.includes(n))))
      onFoundChange?.(found)
    } else {
      onHiddenChange(new Set())
      if (phase === 'idle') onFoundChange?.([])
    }
  }, [phase, found, target, onHiddenChange, onFoundChange])

  // ── End game ─────────────────────────────────────────────────────────────
  const endGame = useCallback((completedAll = false, timeUsed = null) => {
    clearInterval(timerRef.current)
    setPhase('done')
    const missedNames = targetRef.current.filter(n => !foundRef.current.includes(n))
    onMissedChange(missedNames)
    onHiddenChange(new Set())

    if (completedAll && timeUsed !== null) {
      setFinishTime(timeUsed)
      const prevPB = loadPB()
      if (prevPB === null || timeUsed < prevPB) {
        savePB(timeUsed)
        setPb(timeUsed)
        setIsNewPB(true)
      } else {
        setIsNewPB(false)
      }
      onComplete?.()
    }
  }, [onMissedChange, onHiddenChange, onComplete])

  // ── Countdown timer ───────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'playing') return
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { endGame(false, null); return 0 }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [phase, endGame])

  // ── Start / restart ───────────────────────────────────────────────────────
  const startGame = () => {
    clearInterval(timerRef.current)
    onMissedChange([])
    const picked = [...gameCountries]
      .filter(f => !EXCLUDED.has(f.properties.NAME))
      .sort(() => Math.random() - 0.5)
      .slice(0, TOTAL)
      .map(f => f.properties.NAME)
    setTarget(picked)
    targetRef.current = picked
    setFound([])
    foundRef.current = []
    setTimeLeft(SECS)
    setInput('')
    setFlash(null)
    setFinishTime(null)
    setIsNewPB(false)
    setPhase('playing')
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  // ── Guess checking ────────────────────────────────────────────────────────
  const tryGuess = (raw) => {
    if (phase !== 'playing') return
    const resolved = resolveAlias(raw, targetRef.current)
    if (!resolved) return
    const curr = foundRef.current
    if (curr.includes(resolved)) return

    const next = [...curr, resolved]
    foundRef.current = next
    setFound(next)
    setInput('')
    setFlash('correct')
    setTimeout(() => setFlash(null), 500)

    if (next.length === targetRef.current.length) {
      // All found — capture time used before clearing timer
      setTimeLeft(t => {
        const used = SECS - t
        endGame(true, used)
        return t
      })
    }
  }

  const handleInputChange = e => {
    const val = e.target.value
    setInput(val)
    tryGuess(val)
  }

  const [confirmGiveUp, setConfirmGiveUp] = useState(false)
  const handleGiveUp    = () => setConfirmGiveUp(true)
  const cancelGiveUp    = () => { setConfirmGiveUp(false); inputRef.current?.focus() }
  const confirmGiveUpFn = () => { setConfirmGiveUp(false); endGame(false, null) }

  const urgent = timeLeft <= 30 && phase === 'playing'

  // ── Idle screen ───────────────────────────────────────────────────────────
  if (phase === 'idle') {
    return (
      <div className="missing-panel">
        <div className="missing-idle">
          <div className="missing-idle-icon">🗺️</div>
          <h2 className="missing-idle-title">Blind Map</h2>
          <p className="missing-idle-desc">
            20 countries vanish from the globe. Name them all before the clock runs out!
          </p>
          <ul className="missing-idle-rules">
            <li>⏱ 4 minutes on the clock</li>
            <li>🌍 Countries reappear as you find them</li>
            <li>🔴 Missed ones revealed in red at the end</li>
            <li>🔹 Really small countries are opted out</li>
          </ul>
          {pb !== null && (
            <div className="missing-pb-banner">🏆 Personal best: {fmt(pb)}</div>
          )}
          <button
            className="missing-start-btn"
            onClick={startGame}
            disabled={!gameCountries.length}
          >
            Start Game
          </button>
        </div>
      </div>
    )
  }

  // ── Playing / Done screen ─────────────────────────────────────────────────
  return (
    <div className="missing-panel">
      {/* Header: progress bar + timer */}
      <div className="missing-header">
        <div className="missing-progress-wrap">
          <div className="missing-progress-bar">
            <div
              className="missing-progress-fill"
              style={{ width: `${(found.length / TOTAL) * 100}%` }}
            />
          </div>
          <span className="missing-count">{found.length} / {TOTAL}</span>
        </div>
        <div className={`missing-timer ${urgent ? 'urgent' : ''}`}>
          {fmt(timeLeft)}
        </div>
      </div>

      {/* Input + give up (playing only) */}
      {phase === 'playing' && (
        <div className="missing-form">
          <input
            ref={inputRef}
            className={`missing-input ${flash ?? ''}`}
            value={input}
            onChange={handleInputChange}
            placeholder="Type a country name…"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
          />
          {confirmGiveUp ? (
            <div className="missing-giveup-confirm">
              <span>Give up?</span>
              <button className="missing-giveup-yes" onClick={confirmGiveUpFn}>Yes, reveal</button>
              <button className="missing-giveup-no"  onClick={cancelGiveUp}>Cancel</button>
            </div>
          ) : (
            <button className="missing-giveup-btn" onClick={handleGiveUp}>Give Up</button>
          )}
        </div>
      )}

      {/* Done banner */}
      {phase === 'done' && (
        <div className="missing-done-banner">
          {found.length === TOTAL ? (
            <div className="missing-perfect-wrap">
              <span className="missing-perfect">🎉 Perfect! All 20 found!</span>
              <span className="missing-finish-time">Time: {fmt(finishTime)}</span>
              {isNewPB
                ? <span className="missing-new-pb">🏆 New personal best!</span>
                : pb !== null && <span className="missing-pb-ref">PB: {fmt(pb)}</span>
              }
            </div>
          ) : (
            <span className="missing-score">{found.length === 0 ? 'No countries found.' : `Found ${found.length} of 20`}</span>
          )}
          <button className="missing-start-btn" onClick={startGame}>Play Again</button>
        </div>
      )}

      {/* Found list */}
      {found.length > 0 && (
        <div className="missing-list-block">
          <div className="missing-list-header found-header">
            ✓ Found ({found.length})
          </div>
          {[...found].reverse().map(name => (
            <div key={name} className="missing-list-item found-item">
              <span className="missing-item-flag">{countryInfo[name]?.flag ?? '🏳️'}</span>
              <span className="missing-item-name">{name}</span>
            </div>
          ))}
        </div>
      )}

      {/* Missed list (end of game only) */}
      {phase === 'done' && stillHidden.length > 0 && (
        <div className="missing-list-block">
          <div className="missing-list-header missed-header">
            ✗ Missed ({stillHidden.length})
          </div>
          {stillHidden.map(name => (
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
