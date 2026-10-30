import { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import { COUNTRY_LANGUAGES } from '../utils/countryLanguages'
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

function normLang(str) {
  return str.trim().toLowerCase().replace(/[^a-z]/g, '')
}

export default function NameAllLanguagesPanel({ gameCountries, onFoundChange, onMissedChange, onNewGame, onComplete }) {
  const [input,       setInput]       = useState('')
  const [flash,       setFlash]       = useState(null)
  const [found,       setFound]       = useState([]) // [{language, countries:[{name,feature}]}]
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

  // Build reverse map: normalized language → entry
  const { langMap, allLanguages } = useMemo(() => {
    const byLang = {}
    for (const f of gameCountries) {
      const name  = f.properties.NAME
      const langs = COUNTRY_LANGUAGES[name]
      if (!langs || !langs.length) continue
      const lang = langs[0] // primary official language only
      const key = normLang(lang)
      if (!byLang[key]) byLang[key] = { language: lang, countries: [] }
      if (!byLang[key].countries.some(c => c.name === name)) {
        byLang[key].countries.push({ name, feature: f })
      }
    }
    // Deduplicated sorted list
    const seen = new Set()
    const all  = []
    for (const entry of Object.values(byLang)) {
      if (!seen.has(entry.language)) { seen.add(entry.language); all.push(entry) }
    }
    all.sort((a, b) => a.language.localeCompare(b.language))
    return { langMap: byLang, allLanguages: all }
  }, [gameCountries])

  const total    = allLanguages.length
  useEffect(() => { setPoolSize('name-all-languages', total) }, [total])   // so an unfinished game is saved as found/total
  const foundSet = useMemo(() => new Set(found.map(f => f.language)), [found])
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
    const foundNames = new Set(foundRef.current.map(f => f.language))
    const seen = new Set()
    const missedFeatures = []
    for (const lang of allLanguages) {
      if (!foundNames.has(lang.language)) {
        for (const c of lang.countries) {
          if (!seen.has(c.name)) { seen.add(c.name); missedFeatures.push(c.feature) }
        }
      }
    }
    onMissedChange(missedFeatures)
    setGameOver(true)
  }, [allLanguages, onMissedChange])

  useEffect(() => { if (expired) revealMissed() }, [expired, revealMissed])

  useEffect(() => {
    if (allFound && running) { clearInterval(tickRef.current); setRunning(false) }
  }, [allFound, running])

  const firedComplete = useRef(false)
  useEffect(() => {
    if (!allFound || !timerMode || firedComplete.current) return
    firedComplete.current = true
    const timeLabel = timerMode === 'countup'
      ? `in ${formatTime(elapsed)}`
      : `with ${formatTime(remaining)} to spare`
    onComplete?.({
      game: 'Languages', icon: '🗣️', total,
      foundNames: found.map(f => f.language),
      foundKeys: found.flatMap(f => f.countries.map(c => c.name)),
      timeLabel, type: 'languages',
    })
  }, [allFound, timerMode])

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
    const q = normLang(raw)
    if (!q) return
    const entry = langMap[q]
    if (!entry) return
    if (foundRef.current.some(f => f.language === entry.language)) return

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

  const [started, setStarted] = useState(false)
  if (!started) return (
    <GameIntro
      icon="🗣️"
      title={t('Name All Languages')}
      desc={t('Type official languages — countries that speak them light up on the globe.')}
      rules={[
        t('⏱ Choose countdown or free play'),
        t('🌐 Multiple countries may share a language'),
        t('💡 All official languages count'),
        t('📈 Track your progress as you go'),
      ]}
      onStart={() => setStarted(true)}
    />
  )

  if (!timerMode) return (
    <SetupCard
      mode="name-all-languages"
      icon="🗣️"
      title={t('Name All Languages')}
      desc={t('Type official languages — countries that speak them light up on the globe.')}
      rules={[
        t('⏱ Choose countdown or free play'),
        t('🌐 Multiple countries may share a language'),
        t('💡 All official languages count'),
        t('📈 Track your progress as you go'),
      ]}
      options={[TIMER_OPTION]}
      typeToStart
      onStart={(v, typed) => { startTimer(v.timer); if (typed) setInput(typed) }}
    />
  )

  return (
    <>
      <div className="panel-header">
        <h2>{t('🗣️ Name All Languages')}</h2>
        <p className="panel-subtitle">
          {t('Type primary official languages. Countries light up as you find them.')}
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
          {t('⌛ Time\'s up! You found')} <strong>{found.length}</strong> / {total} {t('languages.')}
        </div>
      )}

      {/* Counter */}
      <div className="na-counter">
        <span className="na-count-num">{found.length}</span>
        <span className="na-count-sep"> / </span>
        <span className="na-count-total">{total}</span>
        <span className="na-count-label"> {t('languages found')}</span>
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
              {t('Every language named')}
              {timerMode === 'countup'   ? ` in ${formatTime(elapsed)}` : ''}
              {timerMode === 'countdown' ? t(' with {v} remaining', { v: formatTime(remaining) }) : ''}
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
              placeholder={!running ? t('Game paused') : t('Type a language…')}
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
          noun={t('languages')}
          total={total}
          timeLabel={timerMode === 'countdown' ? t('{v} used', { v: formatTime(COUNTDOWN_SECONDS - remaining) }) : formatTime(elapsed)}
          found={found.map(l => ({ label: l.language, sub: `${l.countries.length} ${l.countries.length === 1 ? 'country' : 'countries'}` }))}
          missed={allLanguages.filter(l => !foundSet.has(l.language)).map(l => ({ label: l.language, sub: `${l.countries.length} ${l.countries.length === 1 ? 'country' : 'countries'}` }))}
        />
      )}

      {/* Found list (live, during play) */}
      {!(gameOver || allFound) && found.length > 0 && (
        <div className="guesses-section">
          <h3 className="guesses-title">{t('Found')} <span className="guess-count">{found.length}</span></h3>
          <ul className="guess-list">
            {[...found].reverse().map(l => (
              <li key={l.language} className="guess-item">
                <span className="guess-swatch" style={{ background: '#39ff14' }} />
                <span className="guess-name">{l.language}</span>
                <span className="guess-dist" style={{ color: '#888', fontSize: '0.78em' }}>
                  &nbsp;· {l.countries.length} {l.countries.length === 1 ? t('country') : t('countries')}
                </span>
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
