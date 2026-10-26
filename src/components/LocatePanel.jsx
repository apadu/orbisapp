import { useState, useRef, useEffect } from 'react'
import { distanceLabel } from '../utils/geoUtils'
import SetupCard from './SetupCard'

function scoreLabel(pts) {
  if (pts >= 1000) return { text: 'Perfect!', color: '#39ff14' }
  if (pts >= 700)  return { text: 'Great!',   color: '#a3e635' }
  if (pts >= 400)  return { text: 'Good',     color: '#eab308' }
  if (pts >= 1)    return { text: 'Close',    color: '#f97316' }
  return                  { text: 'Miss',     color: '#ef4444' }
}

function formatTime(secs) {
  const m = Math.floor(secs / 60).toString().padStart(2, '0')
  const s = (secs % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

export default function LocatePanel({
  current, guessed, clickResult, totalScore, history,
  gameMode, gameOver,
  onModeSelect, onNext, onNewGame, onTimeout, onSprintExpired,
}) {
  const currentName = current?.properties?.NAME ?? ''

  const [sprintTime,    setSprintTime]    = useState(120)
  const [sprintExpired, setSprintExpired] = useState(false)
  const [suddenTime,    setSuddenTime]    = useState(10)
  const sprintTickRef = useRef(null)
  const suddenTickRef = useRef(null)

  // Sprint 120-second countdown — starts/resets when gameMode becomes 'sprint'
  useEffect(() => {
    if (gameMode !== 'sprint') {
      clearInterval(sprintTickRef.current)
      setSprintExpired(false)
      return
    }
    setSprintTime(120)
    setSprintExpired(false)
    clearInterval(sprintTickRef.current)
    sprintTickRef.current = setInterval(() => {
      setSprintTime(t => {
        if (t <= 1) {
          clearInterval(sprintTickRef.current)
          setSprintExpired(true)
          onSprintExpired()
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(sprintTickRef.current)
  }, [gameMode]) // eslint-disable-line react-hooks/exhaustive-deps

  // Sudden death 10-second countdown — resets when a new country appears
  useEffect(() => {
    if (gameMode !== 'sudden' || gameOver) {
      clearInterval(suddenTickRef.current)
      return
    }
    clearInterval(suddenTickRef.current)
    if (guessed) return  // pause while showing result
    setSuddenTime(10)
    suddenTickRef.current = setInterval(() => {
      setSuddenTime(t => {
        if (t <= 1) {
          clearInterval(suddenTickRef.current)
          onTimeout()
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(suddenTickRef.current)
  }, [current?.properties?.NAME, guessed, gameMode, gameOver]) // eslint-disable-line react-hooks/exhaustive-deps

  const correctCount = history.filter(h => h.isHit).length

  // Restart with the same mode (pass through null so the sprint/sudden timers reset)
  const playAgain = () => {
    const m = gameMode
    onNewGame()
    setTimeout(() => onModeSelect(m), 0)
  }

  const HistoryList = () => (
    history.length > 0 ? (
      <div className="guesses-section" style={{ marginTop: '1rem' }}>
        <h3 className="guesses-title">History <span className="guess-count">{history.length}</span></h3>
        <ul className="guess-list">
          {[...history].reverse().map((h, i) => {
            const lbl = scoreLabel(h.pts)
            return (
              <li key={i} className="guess-item">
                <span className="guess-swatch" style={{ background: lbl.color }} />
                <span className="guess-name">{h.name}</span>
                <span className="guess-dist" style={{ color: lbl.color }}>{distanceLabel(h.km)}</span>
                <span className="guess-dist">+{h.pts}</span>
              </li>
            )
          })}
        </ul>
      </div>
    ) : null
  )

  // ── Setup (one screen, remembers your last mode) ─────────────────────────
  if (!current) {
    return (
      <SetupCard
        mode="locate"
        icon="📍"
        title="Pinpoint Country"
        desc="A country name appears — click where it is on the globe."
        rules={[
          '🎯 Click inside the country for 1000 pts',
          '📏 Close misses still score (within 500 km)',
          '⏱ Sprint: as many as you can in 2 minutes',
          '💀 Sudden death: 10 s per country, under 950 pts ends the run',
        ]}
        options={[{
          id: 'variant', label: 'Mode', default: 'classic',
          choices: [
            { value: 'classic', label: '🗺️ Classic',      hint: 'Take your time. Score by accuracy.' },
            { value: 'sprint',  label: '⏱ 2-min sprint',  hint: 'How many can you pin in 2 minutes?' },
            { value: 'sudden',  label: '💀 Sudden death', hint: '10 seconds per country. Score under 950 and it\'s over.' },
          ],
        }]}
        onStart={(v) => onModeSelect(v.variant)}
      />
    )
  }

  // ── Sudden death: game over ───────────────────────────────────────────────
  if (gameOver) {
    return (
      <>
        <div className="panel-header"><h2>📍 Pinpoint Country</h2></div>
        <div className="locate-gameover">
          <div className="locate-gameover-icon">💀</div>
          <div className="locate-gameover-title">Game Over</div>
          <div className="locate-gameover-country">
            {clickResult
              ? <>You scored <strong style={{ color: scoreLabel(clickResult.pts).color }}>{clickResult.pts} pts</strong> on <strong>{currentName}</strong></>
              : <>Time ran out on <strong>{currentName}</strong></>
            }
          </div>
          <div className="locate-gameover-stats">
            <div className="locate-stat">
              <span className="locate-stat-num">{history.length}</span>
              <span className="locate-stat-label">played</span>
            </div>
            <div className="locate-stat">
              <span className="locate-stat-num">{totalScore}</span>
              <span className="locate-stat-label">points</span>
            </div>
          </div>
          <div className="locate-again-row">
            <button className="new-game-btn na-start-default" onClick={playAgain}>▶ Play again</button>
            <button className="new-game-btn" onClick={onNewGame}>⚙ Settings</button>
          </div>
        </div>
        <HistoryList />
      </>
    )
  }

  // ── Sprint: time's up ─────────────────────────────────────────────────────
  if (sprintExpired) {
    return (
      <>
        <div className="panel-header"><h2>📍 Pinpoint Country</h2></div>
        <div className="locate-gameover">
          <div className="locate-gameover-icon">⏱</div>
          <div className="locate-gameover-title">Time's Up!</div>
          <div className="locate-gameover-stats">
            <div className="locate-stat">
              <span className="locate-stat-num">{history.length}</span>
              <span className="locate-stat-label">played</span>
            </div>
            <div className="locate-stat">
              <span className="locate-stat-num">{correctCount}</span>
              <span className="locate-stat-label">correct</span>
            </div>
            <div className="locate-stat">
              <span className="locate-stat-num">{totalScore}</span>
              <span className="locate-stat-label">points</span>
            </div>
          </div>
          <div className="locate-again-row">
            <button className="new-game-btn na-start-default" onClick={playAgain}>▶ Play again</button>
            <button className="new-game-btn" onClick={onNewGame}>⚙ Settings</button>
          </div>
        </div>
        <HistoryList />
      </>
    )
  }

  // ── Active game ───────────────────────────────────────────────────────────
  return (
    <>
      <div className="panel-header">
        <h2>📍 Pinpoint Country</h2>
        {gameMode === 'classic' && (
          <p className="panel-subtitle">Click on the globe to place the country.</p>
        )}
      </div>

      {/* Sprint timer bar */}
      {gameMode === 'sprint' && (
        <div className={`locate-timer-bar${sprintTime <= 20 ? ' locate-timer-danger' : ''}`}>
          <div className="locate-timer-fill" style={{ width: `${(sprintTime / 120) * 100}%` }} />
          <span className="locate-timer-text">⏱ {formatTime(sprintTime)}</span>
        </div>
      )}

      {/* Sudden death timer bar */}
      {gameMode === 'sudden' && !guessed && (
        <div className={`locate-timer-bar${suddenTime <= 3 ? ' locate-timer-danger' : ''}`}>
          <div className="locate-timer-fill" style={{ width: `${(suddenTime / 10) * 100}%` }} />
          <span className="locate-timer-text">💀 {suddenTime}s</span>
        </div>
      )}

      {/* Score bar */}
      <div className="locate-score-bar">
        <span className="locate-score-num">{totalScore}</span>
        <span className="locate-score-label">total points</span>
        <span className="locate-round-count">{history.length} played</span>
      </div>

      {/* Current target / result */}
      <div className="locate-target">
        {guessed ? (
          <div className="locate-result">
            <div className="locate-result-name">{currentName}</div>
            <div className="locate-result-dist">
              {clickResult.isHit ? '✓ Correct!' : `${distanceLabel(clickResult.km)} away`}
            </div>
            <div className="locate-result-pts" style={{ color: scoreLabel(clickResult.pts).color }}>
              +{clickResult.pts} pts — {scoreLabel(clickResult.pts).text}
            </div>
            {(gameMode === 'sprint' || (gameMode === 'sudden' && clickResult?.pts >= 950)) && (
              <div className="locate-sprint-advancing">Next country in a moment…</div>
            )}
          </div>
        ) : (
          <div className="locate-find">
            <span className="locate-find-label">Find</span>
            <span className="locate-find-name">{currentName}</span>
          </div>
        )}
      </div>

      {/* Next button — classic only */}
      {guessed && gameMode === 'classic' && (
        <div className="locate-next-wrap">
          <button className="new-game-btn" onClick={onNext}>Next →</button>
        </div>
      )}

      {/* New Game link */}
      <div className="locate-next-wrap" style={{ paddingTop: guessed && gameMode === 'classic' ? '0' : '12px' }}>
        <button className="locate-newgame-link" onClick={onNewGame}>✕ Change mode / new game</button>
      </div>

      {/* History */}
      {history.length > 0 && (
        <div className="guesses-section">
          <h3 className="guesses-title">History <span className="guess-count">{history.length}</span></h3>
          <ul className="guess-list">
            {[...history].reverse().map((h, i) => {
              const lbl = scoreLabel(h.pts)
              return (
                <li key={i} className="guess-item">
                  <span className="guess-swatch" style={{ background: lbl.color }} />
                  <span className="guess-name">{h.name}</span>
                  <span className="guess-dist" style={{ color: lbl.color }}>{distanceLabel(h.km)}</span>
                  <span className="guess-dist">+{h.pts}</span>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </>
  )
}
