import { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import { normalizeInput } from '../utils/aliases'
import { CAPITALS } from '../utils/capitals'
import GameIntro from './GameIntro'
import SetupCard, { TIMER_OPTION } from './SetupCard'
import GiveUpButton from './GiveUpButton'
import GameSummary from './GameSummary'
import { t } from '../i18n'
import { setPoolSize } from '../utils/results'
import { useGameHud } from '../utils/hudStore'

const COUNTDOWN_SECONDS = 15 * 60

function formatTime(secs) {
  const m = Math.floor(Math.abs(secs) / 60).toString().padStart(2, '0')
  const s = (Math.abs(secs) % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

export default function NameAllCapitalsPanel({ gameCountries, countryInfo, onFoundChange, onMissedChange, onNewGame, onComplete }) {
  const [input,       setInput]       = useState('')
  const [flash,       setFlash]       = useState(null)
  const [found,       setFound]       = useState([])   // [{name, capital, feature}]
  const [timerMode,   setTimerMode]   = useState(null) // null | 'countdown' | 'countup'
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

  // Build eligible pairs: countries that have a CAPITALS entry
  const eligiblePairs = useMemo(() => {
    const pairs = []
    for (const f of gameCountries) {
      const name = f.properties.NAME
      const caps = CAPITALS[name]
      if (caps) pairs.push({ name, capitals: caps, feature: f })
    }
    return pairs
  }, [gameCountries])

  // Reverse lookup: normalized capital → country name
  const capToCountry = useMemo(() => {
    const map = {}
    for (const { name, capitals } of eligiblePairs) {
      for (const cap of capitals) {
        map[normalizeInput(cap)] = name
      }
    }
    return map
  }, [eligiblePairs])

  const total    = eligiblePairs.length
  useEffect(() => { setPoolSize('name-all-caps', total) }, [total])   // so an unfinished game is saved as found/total
  const foundSet = useMemo(() => new Set(found.map(f => f.name)), [found])
  const allFound = found.length === total && total > 0
  // Phones: counter + clock stay visible over the globe
  useGameHud(timerMode && !gameOver && !allFound ? [
    { icon: '✓', text: `${found.length}/${total}` },
    { icon: timerMode === 'countdown' ? '⏳' : '⏱', text: formatTime(timerMode === 'countdown' ? remaining : elapsed), urgent: timerMode === 'countdown' && remaining <= 60 },
  ] : null)

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
    const missed = eligiblePairs.filter(p => !foundRef.current.some(f => f.name === p.name)).map(p => p.feature)
    onMissedChange(missed)
    setGameOver(true)
  }, [eligiblePairs, onMissedChange])

  useEffect(() => { if (expired) revealMissed() }, [expired, revealMissed])

  // Stop timer when all found
  const firedComplete = useRef(false)
  useEffect(() => {
    if (!allFound || !timerMode || firedComplete.current) return
    firedComplete.current = true
    const timeLabel = timerMode === 'countup'
      ? `in ${formatTime(elapsed)}`
      : `with ${formatTime(remaining)} to spare`
    onComplete?.({
      game: 'Capitals', icon: '🏙️', total,
      foundNames: found.map(f => f.capital ?? f.name),
      foundKeys: found.map(f => f.name),
      timeLabel, type: 'capitals',
    })
  }, [allFound, timerMode])

  useEffect(() => {
    if (allFound && running) {
      clearInterval(tickRef.current)
      setRunning(false)
    }
  }, [allFound, running])

  const startTimer = (mode) => {
    firedComplete.current = false
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
    const q = normalizeInput(raw)
    if (!q) return
    const countryName = capToCountry[q]
    if (!countryName) return
    if (foundRef.current.some(f => f.name === countryName)) return

    const pair = eligiblePairs.find(p => p.name === countryName)
    if (!pair) return

    const next = [...foundRef.current, { name: countryName, capital: CAPITALS[countryName][0], feature: pair.feature }]
    foundRef.current = next
    setFound(next)
    onFoundChange(next)
    setInput('')
    setFlash('hit')
    setTimeout(() => setFlash(null), 500)

    if (next.length === total) revealMissed()
  }

  const onInputChange = e => { const v = e.target.value; setInput(v); tryGuess(v) }
  const onKeyDown    = e => { if (e.key === 'Enter') tryGuess(input) }

  const countdownDanger = timerMode === 'countdown' && remaining < 120

  const [started, setStarted] = useState(false)
  if (!started) return (
    <GameIntro
      icon="🏙️"
      title={t('Name All Capitals')}
      desc={t('Type every capital city in the world. Countries light up on the globe as you find them.')}
      rules={[
        t('⏱ Choose countdown or free play'),
        t('💡 Countries light up when you name their capital'),
        t('✅ Common spelling variants accepted'),
      ]}
      onStart={() => setStarted(true)}
    />
  )

  if (!timerMode) return (
    <SetupCard
      mode="name-all-caps"
      icon="🏙️"
      title={t('Name All Capitals')}
      desc={t('Type every capital city in the world. Countries light up on the globe as you find them.')}
      rules={[
        t('⏱ Choose countdown or free play'),
        t('💡 Countries light up when you name their capital'),
        t('✅ Common spelling variants accepted'),
      ]}
      options={[TIMER_OPTION]}
      typeToStart
      onStart={(v, typed) => { startTimer(v.timer); if (typed) setInput(typed) }}
    />
  )

  return (
    <>
      <div className="panel-header">
        <h2>{t('🏙️ Name All Capitals')}</h2>
        <p className="panel-subtitle">
          {t('Type every capital city. Countries light up as you find them.')}
        </p>
      </div>

      {/* Active timer bar */}
      {timerMode && (
        <div className={`na-timer-bar${countdownDanger ? ' na-timer-danger' : ''}`}>
          <span className="na-timer-clock">
            {timerMode === 'countdown' ? formatTime(remaining) : formatTime(elapsed)}
          </span>
          <span className="na-timer-type">
            {timerMode === 'countdown' ? t('⏳ countdown') : t('⏱ count up')}
          </span>
          <div className="na-timer-controls">
            {!gameOver && !expired && !allFound && (
              <GiveUpButton compact onConfirm={() => { clearInterval(tickRef.current); setRunning(false); revealMissed() }} />
            )}
          </div>
        </div>
      )}


      {/* Time's up */}
      {expired && (
        <div className="na-expired">
          {t('⌛ Time\'s up! You found')} <strong>{found.length}</strong> / {total} {t('capitals.')}
        </div>
      )}

      {/* Counter */}
      <div className="na-counter">
        <span className="na-count-num">{found.length}</span>
        <span className="na-count-sep"> / </span>
        <span className="na-count-total">{total}</span>
        <span className="na-count-label"> {t('capitals found')}</span>
        <div className="na-progress-track">
          <div className="na-progress-fill" style={{ width: `${total ? (found.length / total) * 100 : 0}%` }} />
        </div>
      </div>

      {/* Win banner */}
      {allFound && (
        <div className="win-banner">
          <span className="win-emoji">🎉</span>
          <div>
            <strong>{t('You got them all!')}</strong>
            <p>
              {t('Every capital named')}
              {timerMode === 'countup'    ? ` in ${formatTime(elapsed)}` : ''}
              {timerMode === 'countdown'  ? t(' with {v} remaining', { v: formatTime(remaining) }) : ''}
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
              placeholder={!running ? t('Game paused') : t('Type a capital city…')}
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
          noun={t('capitals')}
          total={total}
          timeLabel={timerMode === 'countdown' ? t('{v} used', { v: formatTime(COUNTDOWN_SECONDS - remaining) }) : formatTime(elapsed)}
          found={found.map(f => ({ label: f.capital, sub: f.name, icon: countryInfo?.[f.name]?.flag }))}
          missed={eligiblePairs.filter(p => !foundSet.has(p.name)).map(p => ({ label: p.capitals[0], sub: p.name, icon: countryInfo?.[p.name]?.flag }))}
        />
      )}

      {/* Found list (live, during play) */}
      {!(gameOver || allFound) && found.length > 0 && (
        <div className="guesses-section">
          <h3 className="guesses-title">{t('Found')} <span className="guess-count">{found.length}</span></h3>
          <ul className="guess-list">
            {[...found].reverse().map(f => (
              <li key={f.name} className="guess-item">
                <span className="guess-swatch" style={{ background: '#39ff14' }} />
                <span className="guess-name">{f.capital}</span>
                <span className="guess-dist" style={{ color: '#888', fontSize: '0.78em' }}>&nbsp;({f.name})</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="panel-footer">
        {(gameOver || expired || allFound) ? (
          <>
            <button className="new-game-btn na-start-default" onClick={() => startTimer(timerMode)}>{t('▶ Play again')}</button>
            <button className="new-game-btn" onClick={handleReset}>{t('⚙ Settings')}</button>
          </>
        ) : (
          <button className="new-game-btn" onClick={handleReset}>{t('🔄 Reset')}</button>
        )}
      </div>
    </>
  )
}
