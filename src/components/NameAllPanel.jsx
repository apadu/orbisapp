import { useState, useRef, useEffect } from 'react'
import { normalizeInput, resolveAlias } from '../utils/aliases'
import GameIntro from './GameIntro'
import SetupCard, { TIMER_OPTION } from './SetupCard'
import GiveUpButton from './GiveUpButton'
import GameSummary from './GameSummary'
import { playCorrect, playWin } from '../utils/sounds'
import { t, cn } from '../i18n'

const normalize = normalizeInput
const COUNTDOWN_SECONDS = 15 * 60

function formatTime(secs) {
  const m = Math.floor(Math.abs(secs) / 60).toString().padStart(2, '0')
  const s = (Math.abs(secs) % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

export default function NameAllPanel({ countries, found, onGuess, onNewGame, onMissed, countryInfo, blindMode = false, onBlindChange, onComplete }) {
  const [input, setInput]             = useState('')
  const [flash, setFlash]             = useState(null)
  // null | 'normal' | 'blind'
  const [mapStyle, setMapStyle]       = useState(null)
  // null | 'countdown' | 'countup'
  const [timerMode, setTimerMode]     = useState(null)
  const [elapsed, setElapsed]         = useState(0)
  const [remaining, setRemaining]     = useState(COUNTDOWN_SECONDS)
  const [running, setRunning]         = useState(false)
  const [expired, setExpired]         = useState(false)
  const [confirmStop, setConfirmStop] = useState(false)
  const [gameOver, setGameOver]       = useState(false)

  const inputRef = useRef(null)
  const tickRef  = useRef(null)

  const total        = countries.length
  const countryNames = countries.map(f => f.properties.NAME)
  const activeNames  = new Set(countryNames)
  const activeFound  = found.filter(f => activeNames.has(f.name))
  const foundSet     = new Set(activeFound.map(f => f.name))
  const allFound     = activeFound.length === total && total > 0

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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { if (expired) revealMissed() }, [expired])

  useEffect(() => {
    if (allFound && running) { clearInterval(tickRef.current); setRunning(false) }
  }, [allFound, running])

  const firedComplete = useRef(false)
  useEffect(() => {
    if (!allFound || !timerMode || firedComplete.current) return
    firedComplete.current = true
    const timeLabel = timerMode === 'countup'
      ? `in ${formatTime(elapsed)}`
      : timerMode === 'countdown'
      ? `with ${formatTime(remaining)} to spare`
      : ''
    onComplete?.({
      game: 'Countries', icon: '🌍', total,
      foundNames: activeFound.map(f => f.name),
      timeLabel, type: 'countries',
    })
  }, [allFound, timerMode])

  const revealMissed = () => {
    const missed = countries.filter(f => !foundSet.has(f.properties.NAME))
    onMissed(missed)
    setGameOver(true)
  }

  const startTimer = (mode) => {
    firedComplete.current = false
    onNewGame()
    onMissed([])
    setTimerMode(mode)
    setElapsed(0)
    setRemaining(COUNTDOWN_SECONDS)
    setExpired(false)
    setConfirmStop(false)
    setGameOver(false)
    setRunning(true)
    setInput('')
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  const handlePickMapStyle = (style) => {
    setMapStyle(style)
    onBlindChange?.(style === 'blind')
  }

  const handleReset = () => {
    clearInterval(tickRef.current)
    setRunning(false)
    setTimerMode(null)
    setMapStyle(null)
    setElapsed(0)
    setRemaining(COUNTDOWN_SECONDS)
    setExpired(false)
    setConfirmStop(false)
    setGameOver(false)
    onMissed([])
    onNewGame()
    onBlindChange?.(false)
  }

  const tryGuess = (raw) => {
    if (expired || gameOver) return
    const q = normalize(raw)
    if (!q) return
    const resolved = resolveAlias(raw, countryNames)
    const match = resolved ? countries.find(f => f.properties.NAME === resolved) : null
    if (match && !foundSet.has(match.properties.NAME)) {
      onGuess(match)
      setInput('')
      setFlash('hit')
      setTimeout(() => setFlash(null), 500)
      const newFoundCount = foundSet.size + 1
      if (newFoundCount >= countries.length) playWin()
      else playCorrect()
      return true
    }
    return false
  }

  const onInputChange = (e) => { const val = e.target.value; setInput(val); tryGuess(val) }
  const onKeyDown = (e) => { if (e.key === 'Enter') tryGuess(input) }

  const countdownDanger = timerMode === 'countdown' && remaining < 120
  const missedCountries = gameOver
    ? countries.filter(f => !foundSet.has(f.properties.NAME)).map(f => f.properties.NAME).sort()
    : []

  const [started, setStarted] = useState(false)
  if (!started) return (
    <GameIntro
      icon="🌍"
      title={t('Name All Countries')}
      desc={t('Type every country in the world. Countries light up on the globe as you name them.')}
      rules={[
        t('⏱ Choose countdown or free play'),
        t('🙈 Optional: start with an empty globe'),
        t('💡 Alternate spellings and aliases accepted'),
        t('🌐 All 196 countries included'),
      ]}
      onStart={() => setStarted(true)}
    />
  )

  if (!timerMode) return (
    <SetupCard
      mode="name-all"
      icon="🌍"
      title={t('Name All Countries')}
      desc={t('Type every country in the world. Countries light up on the globe as you name them.')}
      rules={[
        t('💡 Alternate spellings and aliases accepted'),
        t('🙈 Empty globe: countries only appear once you name them'),
        t('🏳️ Give up any time to reveal what you missed'),
        t('🌐 All 196 countries included'),
      ]}
      options={[
        {
          id: 'map', label: t('Globe'), default: 'normal',
          choices: [
            { value: 'normal', label: t('🗺️ Normal'), hint: t('Every country is drawn — they light up as you name them') },
            { value: 'blind',  label: t('🙈 Empty'),  hint: t('Blank globe — countries appear only once you name them') },
          ],
        },
        TIMER_OPTION,
      ]}
      typeToStart
      onStart={(v, typed) => { handlePickMapStyle(v.map); startTimer(v.timer); if (typed) setInput(typed) }}
    />
  )

  return (
    <>
      {/* Header */}
      <div className="panel-header">
        <h2>{t('🌍 All Countries')}</h2>
        <p className="panel-subtitle">
          {blindMode
            ? t('Globe starts empty — countries appear as you name them.')
            : t('Type every country in the world. Countries light up as you find them.')}
        </p>
      </div>

      {/* Active timer bar */}
      {timerMode && (
        <div className={`na-timer-bar${countdownDanger ? ' na-timer-danger' : ''}`}>
          <span className="na-timer-clock">
            {timerMode === 'countdown' ? formatTime(remaining) : formatTime(elapsed)}
          </span>
          <span className="na-timer-type">
            {timerMode === 'countdown' ? t('⏳ countdown') : t('⏱ free play')}
          </span>
          <div className="na-timer-controls">
            {!gameOver && !expired && !allFound && (
              <GiveUpButton compact onConfirm={() => { clearInterval(tickRef.current); setRunning(false); revealMissed() }} />
            )}
          </div>
        </div>
      )}


      {/* Expired */}
      {expired && (
        <div className="na-expired">
          {t('⌛ Time\'s up! You found')} <strong>{activeFound.length}</strong> / {total} {t('countries.')}
        </div>
      )}

      {/* Counter */}
      <div className="na-counter">
        <div className="na-counter-row">
          <span className="na-count-num">{activeFound.length}</span>
          <span className="na-count-sep">/</span>
          <span className="na-count-total">{total}</span>
          <span className="na-count-label">{t('countries found')}</span>
        </div>
        <div className="na-progress-track">
          <div className="na-progress-fill" style={{ width: `${total ? (activeFound.length / total) * 100 : 0}%` }} />
        </div>
      </div>

      {/* Win banner */}
      {allFound && (
        <div className="win-banner">
          <span className="win-emoji">🎉</span>
          <div>
            <strong>{t('You got them all!')}</strong>
            <p>
              {t('Every country named')}
              {timerMode === 'countup'   ? ` in ${formatTime(elapsed)}` : ''}
              {timerMode === 'countdown' ? t(' with {v} to spare', { v: formatTime(remaining) }) : ''}
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
              placeholder={t('Type a country name…')}
              value={input}
              onChange={onInputChange}
              onKeyDown={onKeyDown}
              autoComplete="off"
              spellCheck={false}
              disabled={!running}
            />
            <button className="guess-btn" onClick={() => tryGuess(input)} disabled={!running}>{t('Go')}</button>
          </div>
        </div>
      )}

      {/* End-of-game summary */}
      {(gameOver || allFound) && (
        <GameSummary
          noun={t('countries')}
          total={total}
          timeLabel={timerMode === 'countdown' ? t('{v} used', { v: formatTime(COUNTDOWN_SECONDS - remaining) }) : formatTime(elapsed)}
          found={activeFound.map(f => ({ label: cn(f.name), icon: countryInfo?.[f.name]?.flag }))}
          missed={missedCountries.map(n => ({ label: cn(n), icon: countryInfo?.[n]?.flag }))}
        />
      )}

      {/* Found list (live, during play) */}
      {!(gameOver || allFound) && activeFound.length > 0 && (
        <div className="guesses-section">
          <h3 className="guesses-title">
            {t('Found')} <span className="guess-count">{activeFound.length}</span>
          </h3>
          <ul className="guess-list">
            {[...activeFound].reverse().map(f => (
              <li key={f.name} className="guess-item">
                <span className="guess-swatch" style={{ background: '#39ff14' }} />
                <span className="guess-name">{cn(f.name)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Footer */}
      <div className="panel-footer">
        {(gameOver || expired || allFound) ? (
          <>
            <button className="new-game-btn na-start-default" onClick={() => startTimer(timerMode)}>{t('▶ Play again')}</button>
            <button className="new-game-btn" onClick={handleReset}>{t('⚙ Settings')}</button>
          </>
        ) : (
          <button className="new-game-btn" onClick={handleReset}>{t('↩ Reset')}</button>
        )}
      </div>
    </>
  )
}
