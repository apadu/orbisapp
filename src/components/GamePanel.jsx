import { useState, useRef, useMemo } from 'react'
import GiveUpButton from './GiveUpButton'
import { distanceLabel } from '../utils/geoUtils'
import { CAPITALS } from '../utils/capitals'
import { COUNTRY_INFO } from '../utils/countryInfo'
import { resolveAlias, findClosestMatch } from '../utils/aliases'
import { t, cn } from '../i18n'
import { useGameHud } from '../utils/hudStore'

export default function GamePanel({ countries, guesses, mystery, gameWon, onGuess, onNewGame, stats, dateLabel, practiceMode, onTogglePractice, gaveUp, onGiveUp }) {
  const [input,      setInput]      = useState('')
  const [didYouMean, setDidYouMean] = useState(null)
  const [copied,     setCopied]     = useState(false)
  const inputRef = useRef(null)

  const handleShare = () => {
    const emojiRow = guesses.map(g => {
      if (g.km === 0)     return '🟩'
      if (g.km < 1000)   return '🟥'
      if (g.km < 3000)   return '🟧'
      if (g.km < 7000)   return '🟨'
      return '🟦'
    }).join('')
    const n = guesses.length
    const text = `🌐 Orbis – Mystery Country\n${emojiRow}\nSolved in ${n} ${n === 1 ? 'guess' : 'guesses'}!\norbis.app`
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

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

  // Phones: key numbers stay visible over the globe
  useGameHud(!gameWon && guesses.length ? [{ icon: '🔍', text: String(guesses.length) }] : null)
  return (
    <>
      {/* Header + mode toggle */}
      <div className="panel-header">
        <div className="mystery-header-row">
          <h2>{practiceMode ? t('🎲 Practice') : t('🌍 Daily Challenge')}</h2>
          <div className="mode-pill-toggle">
            <button
              className={`mpt-btn ${!practiceMode ? 'active' : ''}`}
              onClick={() => onTogglePractice(false)}
            >{t('Daily')}</button>
            <button
              className={`mpt-btn ${practiceMode ? 'active' : ''}`}
              onClick={() => onTogglePractice(true)}
            >{t('Practice')}</button>
          </div>
        </div>
        {!practiceMode && <p className="panel-subtitle">{dateLabel}</p>}
      </div>

      {/* Stats bar */}
      {stats && (
        <div className="stats-bar">
          <div className="stat-item">
            <span className="stat-num">{stats.played}</span>
            <span className="stat-label">{t('Played')}</span>
          </div>
          <div className="stat-item">
            <span className="stat-num">{stats.played ? Math.round((stats.won / stats.played) * 100) : 0}%</span>
            <span className="stat-label">{t('Win %')}</span>
          </div>
          <div className="stat-item">
            <span className="stat-num">{stats.streak}</span>
            <span className="stat-label">{t('Streak')}</span>
          </div>
          <div className="stat-item">
            <span className="stat-num">{stats.bestStreak}</span>
            <span className="stat-label">{t('Best')}</span>
          </div>
        </div>
      )}

      {/* Win banner + country info */}
      {gameWon && (
        <div className="win-banner">
          <div className="win-top">
            <span className="win-emoji">🎉</span>
            <div>
              <strong>{t('You got it!')}</strong>
              <p>{cn(mysteryName)} {t('in')} {guesses.length} {guesses.length === 1 ? t('guess') : t('guesses')}</p>
            </div>
            <button className="share-btn" onClick={handleShare}>
              {copied ? t('✅ Copied!') : t('📤 Share')}
            </button>
          </div>
          <div className="country-info-card">
            <span className="country-flag">{mysteryInfo?.flag ?? '🏳️'}</span>
            <div className="country-info-details">
              <div className="country-info-name">{cn(mysteryName)}</div>
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
              {t('Did you mean')}{' '}
              <button className="dym-btn" onClick={() => submit(didYouMean)}>
                {cn(didYouMean)}
              </button>
              {t('? Press Enter to confirm or keep typing.')}
            </div>
          )}
          <div className="input-row">
            <input
              ref={inputRef}
              className="country-input"
              type="text"
              placeholder={t('Type a country name…')}
              value={input}
              onChange={onInputChange}
              onKeyDown={onKeyDown}
              autoComplete="off"
              spellCheck={false}
            />
            <button className="guess-btn" onClick={trySubmit}>{t('Guess')}</button>
          </div>
        </div>
      )}

      {/* Hint legend */}
      {!gameWon && guesses.length === 0 && (
        <div className="legend">
          <span style={{ color: '#ef4444' }}>{t('● Hot')}</span>
          <span style={{ color: '#eab308' }}>{t('● Warm')}</span>
          <span style={{ color: '#3b82f6' }}>{t('● Cold')}</span>
        </div>
      )}

      {/* Guess history */}
      {guesses.length > 0 && (
        <div className="guesses-section">
          <h3 className="guesses-title">
            {t('Guesses')} <span className="guess-count">{guesses.length}</span>
          </h3>
          <ul className="guess-list">
            {sortedGuesses.map((g) => (
              <li key={g.name} className="guess-item">
                <span className="guess-swatch" style={{ background: g.color }} />
                <span className="guess-name">{cn(g.name)}</span>
                {g.isAdjacent ? (
                  <span className="guess-adjacent" title={t('Shares a border with the mystery country')}>{t('🔲 adjacent')}</span>
                ) : (
                  <>
                    <span className="guess-dist">{distanceLabel(g.km)}</span>
                    {g.km > 0 && (
                      <span
                        className="guess-arrow"
                        style={{ transform: `rotate(${g.angle}deg)` }}
                        title={t('Direction to mystery country')}
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
            <p className="give-up-reveal">{t('The answer was')} <strong>{cn(mysteryName)}</strong>.</p>
            <button className="new-game-btn" onClick={onNewGame}>{t('🔄 New Game')}</button>
          </>
        ) : (
          <>
            <button className="new-game-btn" onClick={onNewGame}>
              {gameWon ? t('🔄 Play Again') : t('🔄 New Game')}
            </button>
            {!gameWon && (
              <GiveUpButton compact onConfirm={onGiveUp} />
            )}
          </>
        )}
      </div>
    </>
  )
}
