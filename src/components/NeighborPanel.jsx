import { useState, useRef, useEffect } from 'react'
import GiveUpButton from './GiveUpButton'
import GameSummary from './GameSummary'
import GameIntro from './GameIntro'
import { playCorrect, playWrong } from '../utils/sounds'
import { t, cn } from '../i18n'
import { useGameHud } from '../utils/hudStore'

function norm(s) {
  return s.trim().toLowerCase().replace(/[^a-z]/g, '')
}

export default function NeighborPanel({ target, neighbors, found, missed, done, score, history, onGuess, onGiveUp, onNext, onGameStart }) {
  const [input, setInput] = useState('')
  const [flash, setFlash] = useState(null)
  const inputRef = useRef(null)

  // Reset input and focus whenever a new target loads
  useEffect(() => {
    setInput('')
    setFlash(null)
    setTimeout(() => inputRef.current?.focus(), 50)
  }, [target])

  const total    = neighbors.length
  const allFound = done && missed.length === 0

  const tryGuess = (raw) => {
    if (!raw.trim() || done) return
    const hit = onGuess(raw)
    if (hit) {
      setInput('')
      setFlash('hit')
      setTimeout(() => setFlash(null), 400)
      playCorrect()
    }
  }

  const onKeyDown     = (e) => { if (e.key === 'Enter') tryGuess(input) }
  const onInputChange = (e) => {
    const v = e.target.value
    setInput(v)
    if (v.endsWith(',')) tryGuess(v.replace(',', ''))
  }

  const [started, setStarted] = useState(false)
  // Phones: key numbers stay visible over the globe
  useGameHud(started && target ? [{ icon: '✓', text: `${found.length}/${total}` }, { icon: '🏆', text: String(score) }] : null)
  if (!started) return (
    <GameIntro
      icon="📌"
      title={t('Neighbor Challenge')}
      desc={t('A country is highlighted — name all countries that share a border with it.')}
      rules={[
        t('🗺️ Countries that share a land border count'),
        t('❌ Missed ones revealed in red'),
        t('🔄 New country every round'),
        t('📈 Build a streak for bonus points'),
      ]}
      onStart={() => { setStarted(true); onGameStart?.() }}
      disabled={!target}
    />
  )

  if (!target) return (
    <div className="panel-header">
      <h2>{t('📌 Neighbor Challenge')}</h2>
      <p className="panel-subtitle">{t('Loading…')}</p>
    </div>
  )

  const targetName = target.properties.NAME

  return (
    <>
      <div className="panel-header">
        <h2>{t('📌 Neighbor Challenge')}</h2>
        <p className="panel-subtitle">{t('Name all countries that share a border with it.')}</p>
      </div>

      {/* Score */}
      <div className="locate-score-bar">
        <span className="locate-score-num">{score}</span>
        <span className="locate-score-label">{t('total points')}</span>
        <span className="locate-round-count">{history.length} {t('rounds')}</span>
      </div>

      {/* Target country */}
      <div className="neighbor-target">
        <span className="neighbor-target-label">{t('Borders of')}</span>
        <span className="neighbor-target-name">{cn(targetName)}</span>
      </div>

      {/* Progress */}
      <div className="na-counter">
        <span className="na-count-num">{found.length}</span>
        <span className="na-count-sep"> / </span>
        <span className="na-count-total">{total}</span>
        <span className="na-count-label"> {t('neighbors found')}</span>
        <div className="na-progress-track">
          <div className="na-progress-fill" style={{ width: `${total ? (found.length / total) * 100 : 0}%` }} />
        </div>
      </div>

      {/* Win banner */}
      {allFound && (
        <div className="win-banner">
          <span className="win-emoji">🎉</span>
          <div>
            <strong>{t('Perfect!')}</strong>
            <p>{t('All')} {total} {t('neighbors of')} {cn(targetName)} {t('found!')}</p>
          </div>
        </div>
      )}

      {/* Input */}
      {!done && (
        <div className="input-wrap">
          <div className={`input-row ${flash ? `flash-${flash}` : ''}`}>
            <input
              ref={inputRef}
              className="country-input"
              type="text"
              placeholder={t('Type a neighboring country…')}
              value={input}
              onChange={onInputChange}
              onKeyDown={onKeyDown}
              autoComplete="off"
              spellCheck={false}
            />
            <button className="guess-btn" onClick={() => tryGuess(input)}>{t('Go')}</button>
          </div>
        </div>
      )}

      {/* Buttons */}
      <div className="neighbor-actions">
        {!done
          ? <GiveUpButton onConfirm={() => { playWrong(); onGiveUp() }} />
          : <button className="new-game-btn" onClick={onNext}>{t('Next country →')}</button>
        }
      </div>

      {/* Round summary */}
      {done && (
        <GameSummary
          noun={t('neighbors')}
          title={t('Neighbors of {targetName}', { targetName: cn(targetName) })}
          total={total}
          found={found.map(n => ({ label: cn(n) }))}
          missed={missed.map(n => ({ label: cn(n) }))}
        />
      )}

      {/* Found (live) */}
      {!done && found.length > 0 && (
        <div className="guesses-section">
          <h3 className="guesses-title">
            {t('Found')} <span className="guess-count">{found.length}</span>
          </h3>
          <ul className="guess-list">
            {[...found].reverse().map(n => (
              <li key={n} className="guess-item">
                <span className="guess-swatch" style={{ background: '#39ff14' }} />
                <span className="guess-name">{n}</span>
                <span className="guess-dist" style={{ color: '#39ff14' }}>+100</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* History */}
      {history.length > 0 && (
        <div className="guesses-section">
          <h3 className="guesses-title">{t('History')}</h3>
          <ul className="guess-list">
            {[...history].reverse().map((h, i) => (
              <li key={i} className="guess-item">
                <span className="guess-swatch" style={{ background: h.found === h.total ? '#39ff14' : '#f97316' }} />
                <span className="guess-name">{h.target}</span>
                <span className="guess-dist">{h.found}/{h.total}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  )
}
