import { useState, useRef, useMemo } from 'react'
import GiveUpButton from './GiveUpButton'
import { distanceLabel } from '../utils/geoUtils'
import { CAPITALS } from '../utils/capitals'
import { COUNTRY_INFO } from '../utils/countryInfo'
import { resolveAlias, findClosestMatch } from '../utils/aliases'
import { t, cn } from '../i18n'
import { useGameHud } from '../utils/hudStore'
import { plain } from '../utils/plain'
import Icon from './Icon'
import { shareText, siteLink } from '../utils/share'
import { makeResultCard, shareImage, SQUARE } from '../utils/shareCard'
import { capName } from '../i18n/names'

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
    const text = [
      `GeoFeverr · ${t('Mystery Country')}${practiceMode ? ` (${plain(t('🎲 Practice'))})` : dateLabel ? ` · ${dateLabel}` : ''}`,
      emojiRow,
      gaveUp ? t('Gave up after {n} guesses', { n }) : n === 1 ? t('Solved in 1 guess!') : t('Solved in {n} guesses!', { n }),
      siteLink('/play/mystery'),
    ].join('\n')
    shareText(text).then(r => { if (r === 'copied') { setCopied(true); setTimeout(() => setCopied(false), 2000) } })
  }

  // The result as an image (Instagram, WhatsApp…) — the answer itself isn't on it
  const [imgBusy, setImgBusy] = useState(false)
  const handleShareImage = async () => {
    if (imgBusy) return
    setImgBusy(true)
    try {
      const n = guesses.length
      const blob = await makeResultCard({
        kicker: `${t('Mystery Country')}${practiceMode ? ` · ${plain(t('🎲 Practice'))}` : dateLabel ? ` · ${dateLabel}` : ''}`,
        big: String(n),
        bigSmall: ` ${n === 1 ? t('guess') : t('guesses')}`,
        sub: gaveUp ? t('Gave up') : t('Found it!'),
        squares: guesses.map(g => g.km === 0 ? SQUARE.ok : g.km < 1000 ? SQUARE.near : g.km < 3000 ? SQUARE.mid : g.km < 7000 ? SQUARE.far : SQUARE.farthest),
        cta: t('Can you find it in fewer guesses?'),
        path: '/play/mystery',
      })
      await shareImage(blob, { text: siteLink('/play/mystery'), filename: 'geofeverr-mystery.png' })
    } catch { /* nothing to share */ } finally { setImgBusy(false) }
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
  const mysteryCapital = capName(CAPITALS[mysteryName]?.[0]) ?? '—'
  const mysteryInfo    = COUNTRY_INFO[mysteryName]

  // Phones: key numbers stay visible over the globe
  useGameHud(!gameWon && guesses.length ? [{ icon: '🔍', text: String(guesses.length) }] : null)
  return (
    <>
      {/* Header + mode toggle */}
      <div className="panel-header">
        <div className="mystery-header-row">
          <h2>{practiceMode ? plain(t('🎲 Practice')) : plain(t('🌍 Daily Challenge'))}</h2>
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
            <span className="share-btns">
              <button className="share-btn" onClick={handleShare}>
                {copied ? plain(t('✅ Copied!')) : plain(t('📤 Share'))}
              </button>
              <button className="share-btn" onClick={handleShareImage} disabled={imgBusy} title={t('Share as an image')}>
                <Icon name="image" size={15} /> {t('Image')}
              </button>
            </span>
          </div>
          <div className="country-info-card">
            <span className="country-flag">{mysteryInfo?.flag ?? '🏳️'}</span>
            <div className="country-info-details">
              <div className="country-info-name">{cn(mysteryName)}</div>
              <div className="country-info-meta">
                <span>🏛️ {mysteryCapital}</span>
                {mysteryInfo?.continent && <span><Icon name="globe" size={14} /> {mysteryInfo.continent}</span>}
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
                  <span className="guess-adjacent" title={t('Shares a border with the mystery country')}>{plain(t('🔲 adjacent'))}</span>
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
            <button className="new-game-btn" onClick={onNewGame}>{plain(t('🔄 New Game'))}</button>
          </>
        ) : (
          <>
            <button className="new-game-btn" onClick={onNewGame}>
              {gameWon ? plain(t('🔄 Play Again')) : plain(t('🔄 New Game'))}
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
