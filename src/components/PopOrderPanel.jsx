import { useState } from 'react'
import { getPopulation } from '../utils/population.js'
import GameIntro from './GameIntro'

function formatPop(millions) {
  if (millions >= 1000) return (millions / 1000).toFixed(2) + 'B'
  if (millions >= 1)    return millions.toFixed(1) + 'M'
  return Math.round(millions * 1000) + 'K'
}

function calcScore(userOrder, correctOrder) {
  const correct = userOrder.filter((name, i) => name === correctOrder[i]).length
  if (correct === 3) return 1000
  if (correct === 2) return 400
  if (correct === 1) return 100
  return 0
}

export default function PopOrderPanel({ countries, onScore, totalScore, history, onNext }) {
  const [clicks, setClicks]     = useState([])
  const [revealed, setRevealed] = useState(false)

  const sorted = [...countries].sort((a, b) => {
    const pa = getPopulation(a.properties.NAME) ?? 0
    const pb = getPopulation(b.properties.NAME) ?? 0
    return pb - pa
  })
  const correctOrder = sorted.map(f => f.properties.NAME)

  const handleClick = (name) => {
    if (revealed || clicks.includes(name)) return
    const next = [...clicks, name]
    setClicks(next)
    if (next.length === 3) {
      const pts = calcScore(next, correctOrder)
      onScore(pts, next, correctOrder)
      setRevealed(true)
    }
  }

  const handleNext = () => {
    setClicks([])
    setRevealed(false)
    onNext()
  }

  const lastResult = revealed && history.length > 0 ? history[history.length - 1] : null

  const [started, setStarted] = useState(false)
  if (!started) return (
    <GameIntro
      icon="📊"
      title="Population Order"
      desc="Three countries appear — rank them by population, largest first."
      rules={[
        '🖱️ Click the countries in order: most → least populous',
        '⭐ 1000 points for a perfect ranking',
        '📉 Partial credit for partially correct answers',
        '🔄 New trio every round',
      ]}
      onStart={() => setStarted(true)}
    />
  )

  return (
    <>
      <div className="panel-header">
        <h2>📊 Population Order</h2>
        <p className="panel-subtitle">
          Click the countries <strong>most → least</strong> populous.
        </p>
      </div>

      <div className="locate-score-bar">
        <span className="locate-score-num">{totalScore}</span>
        <span className="locate-score-label">total points</span>
        <span className="locate-round-count">{history.length} rounds</span>
      </div>

      <div className="po-cards">
        {countries.map(f => {
          const name = f.properties.NAME
          const rank = clicks.indexOf(name)
          const correctRank = correctOrder.indexOf(name)
          const isCorrect = revealed && rank === correctRank

          let cardClass = 'po-card'
          if (rank >= 0)  cardClass += ' po-card-selected'
          if (revealed && rank >= 0) cardClass += isCorrect ? ' po-card-correct' : ' po-card-wrong'

          return (
            <button key={name} className={cardClass} onClick={() => handleClick(name)} disabled={revealed}>
              <span className="po-rank-badge">{rank >= 0 ? rank + 1 : '?'}</span>
              <span className="po-country-name">{name}</span>
              {revealed && (
                <span className="po-pop-reveal">
                  {formatPop(getPopulation(name) ?? 0)}
                  <span className="po-correct-rank"> (#{correctRank + 1})</span>
                </span>
              )}
            </button>
          )
        })}
      </div>

      {!revealed && (
        <p className="po-prompt">
          {clicks.length === 0 && 'Tap the most populous country first'}
          {clicks.length === 1 && 'Now the second most populous'}
          {clicks.length === 2 && 'Last — least populous'}
        </p>
      )}

      {lastResult && (() => {
        const { pts } = lastResult
        const color = pts === 1000 ? '#39ff14' : pts >= 400 ? '#eab308' : pts >= 100 ? '#f97316' : '#ef4444'
        const label = pts === 1000 ? 'Perfect!' : pts >= 400 ? 'Almost!' : pts >= 100 ? 'Partial' : 'Wrong order'
        return <div className="po-result" style={{ color }}>{label} — +{pts} pts</div>
      })()}

      {revealed && (
        <div className="locate-next-wrap">
          <button className="new-game-btn" onClick={handleNext}>Next →</button>
        </div>
      )}

      {history.length > 0 && (
        <div className="guesses-section">
          <h3 className="guesses-title">History <span className="guess-count">{history.length}</span></h3>
          <ul className="guess-list">
            {[...history].reverse().map((h, i) => {
              const color = h.pts === 1000 ? '#39ff14' : h.pts >= 400 ? '#eab308' : h.pts >= 100 ? '#f97316' : '#ef4444'
              return (
                <li key={i} className="guess-item">
                  <span className="guess-swatch" style={{ background: color }} />
                  <span className="guess-name" style={{ fontSize: '0.75rem' }}>{h.names.join(' › ')}</span>
                  <span className="guess-dist" style={{ color }}>+{h.pts}</span>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </>
  )
}
