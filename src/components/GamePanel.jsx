import { useState, useRef, useMemo } from 'react'
import { distanceLabel } from '../utils/geoUtils'
import { CAPITALS } from '../utils/capitals'
import { COUNTRY_INFO } from '../utils/countryInfo'
import { resolveAlias, findClosestMatch } from '../utils/aliases'

export default function GamePanel({ countries, guesses, mystery, gameWon, onGuess, onNewGame, stats, dateLabel, practiceMode, onTogglePractice, gaveUp, onGiveUp }) {
  const [input,      setInput]      = useState('')
  const [didYouMean, setDidYouMean] = useState(null) // suggested country name
  const inputRef = useRef(null)

  // Sorted country names for autocomplete
  const countryNames = useMemo(
    () => countries.map(f => f.properties.NAME).sort(),
    [countries]
  )

  // Already guessed names (for deduplication)
  const guessedSet = useMemo(
    () => new Set(guesses.map(g => g.name)),
    [guesses]
  )

  const submit = (name) => {
    const feature = countries.find(f => f.properties.NAME === name)
    if (!feature || guessedSet.has(name)) return
    onGuess(feature)
    setInput('')
    setDidYouMean(null)
  }

  const trySubmit = () => {
    if (!input.trim()) return
    // If there's already a "did you mean" suggestion pending, confirm it
    if (didYouMean) {
      submit(didYouMean)
      return
    }
    // Resolve alias or exact match
    const resolved = resolveAlias(input, countryNames)
    if (resolved && !guessedSet.has(resolved)) {
      submit(resolved)
      return
    }
    // Fuzzy fallback — show "did you mean?"
    const closest = findClosestMatch(input, countryNames.filter(n => !guessedSet.has(n)))
    if (closest) {
      setDidYouMean(closest)
    }
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter') { e.preventDefault(); trySubmit() }
    if (e.key === 'Escape') setDidYouMean(null)
  }

  const onInputChange = (e) => {
    setInput(e.target.value)
    setDidYouMean(null)
  }

  const sortedGuesses = [...guesses].sort((a, b) => {
    if (a.km === 0 && a.name === mystery?.properties?.NAME) return -1
    if (b.km === 0 && b.name === mystery?.properties?.NAME) return 1
    return a.km - b.km
  })

  const mysteryName    = mystery?.properties?.NAME ?? ''
  const mysteryCapital = CAPITALS[mysteryName]?.[0] ?? '—'
  const mysteryInfo    = COUNTRY_INFO[mysteryName]

  return (
    <>
      {/* Header + mode toggle */}
      <div className="panel-header">
        <div className="mystery-header-row">
          <h2>{practiceMode ? '🎲 Practice' : '🌍 Daily Challenge'}</h2>
          <div className="mode-pill-toggle">
            <button
              className={`mpt-btn ${!practiceMode ? 'active' : ''}`}
              onClick={() => onTogglePractice(false)}
            >Daily</button>
            <button
              className={`mpt-btn ${practiceMode ? 'active' : ''}`}
              onClick={() => onTogglePractice(true)}
            >Practice</button>
          </div>
        </div>
        {!practiceMode && <p className="panel-subtitle">{dateLabel}</p>}
      </div>

      {/* Stats bar */}
      {stats && (
        <div className="stats-bar">
          <div className="stat-item">
            <span className="stat-num">{stats.played}</span>
            <span className="stat-label">Played</span>
          </div>
          <div className="stat-item">
            <span className="stat-num">{stats.played ? Math.round((stats.won / stats.played) * 100) : 0}%</span>
            <span className="stat-label">Win %</span>
          </div>
          <div className="stat-item">
            <span className="stat-num">{stats.streak}</span>
            <span className="stat-label">Streak</span>
          </div>
          <div className="stat-item">
            <span className="stat-num">{stats.bestStreak}</span>
            <span className="stat-label">Best</span>
          </div>
        </div>
      )}

      {/* Win banner + country info */}
      {gameWon && (
        <div className="win-banner">
          <div className="win-top">
            <span className="win-emoji">🎉</span>
            <div>
              <strong>You got it!</strong>
              <p>{mysteryName} in {guesses.length} {guesses.length === 1 ? 'guess' : 'guesses'}</p>
            </div>
          </div>
          <div className="country-info-card">
            <span className="country-flag">{mysteryInfo?.flag ?? '🏳️'}</span>
            <div className="country-info-details">
              <div className="country-info-name">{mysteryName}</div>
              <div className="country-info-meta">
                <span>🏛️ {mysteryCapital}</span>
                {mysteryInfo?.continent && <span>🌐 {mysteryInfo.continent}</span>}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Input */}
      {!gameWon && (
        <div className="input-wrap">
          {didYouMean && (
            <div className="did-you-mean">
              Did you mean{' '}
              <button className="dym-btn" onClick={() => submit(didYouMean)}>
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
              placeholder="Type a country name…"
              value={input}
              onChange={onInputChange}
              onKeyDown={onKeyDown}
              autoComplete="off"
              spellCheck={false}
            />
            <button className="guess-btn" onClick={trySubmit}>Guess</button>
          </div>
        </div>
      )}

      {/* Hint legend */}
      {!gameWon && guesses.length === 0 && (
        <div className="legend">
          <span style={{ color: '#ef4444' }}>● Hot</span>
          <span style={{ color: '#eab308' }}>● Warm</span>
          <span style={{ color: '#3b82f6' }}>● Cold</span>
        </div>
      )}

      {/* Guess history */}
      {guesses.length > 0 && (
        <div className="guesses-section">
          <h3 className="guesses-title">
            Guesses <span className="guess-count">{guesses.length}</span>
          </h3>
          <ul className="guess-list">
            {sortedGuesses.map((g) => (
              <li key={g.name} className="guess-item">
                <span className="guess-swatch" style={{ background: g.color }} />
                <span className="guess-name">{g.name}</span>
                {g.isAdjacent ? (
                  <span className="guess-adjacent" title="Shares a border with the mystery country">🔲 adjacent</span>
                ) : (
                  <>
                    <span className="guess-dist">{distanceLabel(g.km)}</span>
                    {g.km > 0 && (
                      <span
                        className="guess-arrow"
                        style={{ transform: `rotate(${g.angle}deg)` }}
                        title="Direction to mystery country"
                      >
                        ↑
                      </span>
                    )}
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Footer */}
      <div className="panel-footer">
        {gaveUp ? (
          <>
            <p className="give-up-reveal">The answer was <strong>{mysteryName}</strong>.</p>
            <button className="new-game-btn" onClick={onNewGame}>🔄 New Game</button>
          </>
        ) : (
          <>
            <button className="new-game-btn" onClick={onNewGame}>
              {gameWon ? '🔄 Play Again' : '🔄 New Game'}
            </button>
            {!gameWon && (
              <button className="give-up-btn" onClick={onGiveUp}>Give up</button>
            )}
          </>
        )}
      </div>
    </>
  )
}
