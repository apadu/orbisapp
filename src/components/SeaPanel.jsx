import { useState, useRef, useEffect, useCallback } from 'react'
import GameIntro from './GameIntro'
import { t } from '../i18n'
import { useGameHud } from '../utils/hudStore'
import { plain } from '../utils/plain'
import { seaName, seaSpellings, seaKey, plainKey } from '../i18n/names'

/** Sea name check in the site language — partial names without "Sea", "Gulf", "Marea"… are fine. */
export function checkSea(canonicalName, typed) {
  const tp = plainKey(typed), tk = seaKey(typed)
  return seaSpellings(canonicalName).some(sp => tp === plainKey(sp) || (tk.length >= 3 && tk === seaKey(sp)))
}

export default function SeaPanel({ current, answered, onCorrect, onSkip, onNewGame, score, history, onGameStart }) {
  const [input,  setInput]  = useState('')
  const [status, setStatus] = useState(null) // 'correct' | 'wrong'
  const inputRef = useRef(null)

  const seaNameEn = current?.properties?.NAME ?? ''
  const shownName = seaName(seaNameEn)

  useEffect(() => {
    setInput('')
    setStatus(null)
    if (!answered) inputRef.current?.focus()
  }, [current, answered])

  const submit = useCallback(() => {
    if (!input.trim() || answered) return
    if (checkSea(seaNameEn, input)) {
      setStatus('correct')
      setTimeout(() => { onCorrect(); setStatus(null) }, 700)
    } else {
      setStatus('wrong')
      setTimeout(() => setStatus(null), 600)
    }
  }, [input, answered, seaNameEn, onCorrect])

  const skip = useCallback(() => {
    if (answered) return
    onSkip()
  }, [answered, onSkip])

  const onKeyDown = (e) => {
    if (e.key === 'Enter') submit()
    if (e.key === 'Escape') skip()
    if (e.key === 'Tab') { e.preventDefault(); skip() }
  }

  // Enter to advance once answered
  useEffect(() => {
    if (!answered) return
    const handler = (e) => { if (e.key === 'Enter') onCorrect() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [answered, onCorrect])

  const [started, setStarted] = useState(false)
  // Phones: key numbers stay visible over the globe
  useGameHud(started ? [{ icon: '✓', text: `${score.correct}/${score.total}` }] : null)
  if (!started) return (
    <GameIntro
      icon="🌊"
      title={t('Name the Sea')}
      desc={t('A patch of ocean lights up. Sea, gulf or bay — which one is it?')}
      rules={[
        plain(t('🌍 Oceans, seas, gulfs, and bays are all fair game')),
        t('↩ Skip to pass on any question'),
        plain(t('🗺️ Rotate the globe to get a better view')),
      ]}
      onStart={() => { setStarted(true); onGameStart?.() }}
    />
  )

  return (
    <>
      {/* Header */}
      <div className="panel-header">
        <h2>{plain(t('🌊 Guess the Sea'))}</h2>
        <p className="panel-subtitle">
          {t('The highlighted body of water is shown on the globe.')}<br />
          {t('Type its name to score.')}
        </p>
      </div>

      {/* Score */}
      <div className="na-counter">
        <span className="na-count-num">{score.correct}</span>
        <span className="na-count-sep"> / </span>
        <span className="na-count-total">{score.total}</span>
        <span className="na-count-label"> {t('correct')}</span>
        {score.total > 0 && (
          <div className="na-progress-track">
            <div
              className="na-progress-fill"
              style={{ width: `${(score.correct / score.total) * 100}%` }}
            />
          </div>
        )}
      </div>

      {/* Input / reveal */}
      <div className="cap-question">
        {!current ? (
          <p style={{ color: 'var(--text-dim)', textAlign: 'center', padding: '20px' }}>
            {t('All seas completed! 🎉')}
          </p>
        ) : answered ? (
          <div className="cap-reveal cap-skipped">
            ⏭️ {shownName}
          </div>
        ) : (
          <div className={`input-wrap cap-input-wrap ${status === 'wrong' ? 'flash-miss' : status === 'correct' ? 'flash-hit' : ''}`}>
            <div className="input-row">
              <input
                ref={inputRef}
                className="country-input"
                type="text"
                placeholder={t('Name this sea or ocean…')}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                autoComplete="off"
                spellCheck={false}
              />
              <button className="guess-btn" onClick={submit}>{t('Go')}</button>
            </div>
          </div>
        )}

        <div className="cap-actions">
          {current && !answered && (
            <button className="cap-skip-btn" onClick={skip}>{t('Skip ⏭')}</button>
          )}
          {current && (
            <button className="cap-next-btn" onClick={onCorrect}>{t('Next →')}</button>
          )}
        </div>
      </div>

      {/* History */}
      {history.length > 0 && (
        <div className="guesses-section">
          <h3 className="guesses-title">
            {t('History')} <span className="guess-count">{history.length}</span>
          </h3>
          <ul className="guess-list">
            {[...history].reverse().map((h, i) => (
              <li key={i} className="guess-item">
                <span className="guess-swatch" style={{ background: h.correct ? '#5BD18B' : '#ef4444' }} />
                <span className="guess-name">{seaName(h.name)}</span>
                <span className="guess-dist" style={{ color: h.correct ? '#5BD18B' : '#ef4444' }}>
                  {h.correct ? '✓' : '✗'}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="panel-footer">
        <button className="new-game-btn" onClick={onNewGame}>{plain(t('🔄 New Game'))}</button>
      </div>
    </>
  )
}
