import { useState, useEffect, useCallback } from 'react'
import { COUNTRY_INFO } from '../utils/countryInfo'
import { COUNTRY_AREA } from '../utils/countryArea'

function formatArea(km2) {
  return km2.toLocaleString() + ' km²'
}

function calcPoints(streak) {
  return streak >= 5 ? 150 : streak >= 3 ? 100 : 75
}

export default function AreaPanel({ gameCountries, onPairChange }) {
  const [left,     setLeft]     = useState(null)   // { name, flag, area }
  const [right,    setRight]    = useState(null)
  const [answered, setAnswered] = useState(false)
  const [choice,   setChoice]   = useState(null)   // 'left' | 'right'
  const [streak,   setStreak]   = useState(0)
  const [score,    setScore]    = useState(0)
  const [history,  setHistory]  = useState([])

  // Countries that have area data
  const eligible = gameCountries.filter(f => COUNTRY_AREA[f.properties.NAME])

  const pickPair = useCallback((exclude = []) => {
    const pool = eligible.filter(f => !exclude.includes(f.properties.NAME))
    if (pool.length < 2) return

    const shuffle = [...pool].sort(() => Math.random() - 0.5)
    const a = shuffle[0]
    const b = shuffle[1]

    const toCard = f => ({
      name: f.properties.NAME,
      flag: COUNTRY_INFO[f.properties.NAME]?.flag ?? '🏳️',
      area: COUNTRY_AREA[f.properties.NAME],
      feature: f,
    })

    const cardA = toCard(a)
    const cardB = toCard(b)
    setLeft(cardA)
    setRight(cardB)
    setAnswered(false)
    setChoice(null)

    // Globe highlight: both countries
    onPairChange?.([a, b])
  }, [eligible, onPairChange])

  useEffect(() => {
    if (eligible.length >= 2 && !left) pickPair()
  }, [eligible.length])

  const handleGuess = (side) => {
    if (answered) return
    setAnswered(true)
    setChoice(side)

    const leftBigger  = left.area >= right.area
    const correct = (side === 'left' && leftBigger) || (side === 'right' && !leftBigger)

    const newStreak = correct ? streak + 1 : 0
    const pts = correct ? calcPoints(newStreak) : 0
    setStreak(newStreak)
    setScore(s => s + pts)
    setHistory(h => [{ left, right, chosenSide: side, correct, pts }, ...h].slice(0, 20))
  }

  const handleNext = () => {
    pickPair(history.slice(0, 6).flatMap(h => [h.left.name, h.right.name]))
  }

  if (!left || !right) return (
    <div className="panel-header">
      <h2>📏 Bigger or Smaller?</h2>
      <p className="panel-subtitle">Loading…</p>
    </div>
  )

  const leftBigger  = left.area >= right.area
  const correctSide = leftBigger ? 'left' : 'right'
  const isCorrect   = answered && choice === correctSide

  return (
    <>
      <div className="panel-header">
        <div className="mystery-header-row">
          <h2>📏 Bigger or Smaller?</h2>
          <div className="area-score-chip">
            {score > 0 && <span className="area-score">{score} pts</span>}
            {streak >= 2 && <span className="area-streak">🔥 {streak}</span>}
          </div>
        </div>
        <p className="panel-subtitle">Which country has a larger land area?</p>
      </div>

      <div className="area-vs-wrap">
        {/* LEFT */}
        <button
          className={`area-card ${answered ? (choice === 'left' ? (isCorrect ? 'correct' : 'wrong') : (correctSide === 'left' ? 'reveal-correct' : '')) : ''}`}
          onClick={() => handleGuess('left')}
          disabled={answered}
        >
          <span className="area-card-flag">{left.flag}</span>
          <span className="area-card-name">{left.name}</span>
          {answered && (
            <span className="area-card-size">{formatArea(left.area)}</span>
          )}
          {answered && correctSide === 'left' && (
            <span className="area-card-crown">👑 Bigger</span>
          )}
        </button>

        <div className="area-vs-divider">
          {answered ? (isCorrect ? '✅' : '❌') : 'VS'}
        </div>

        {/* RIGHT */}
        <button
          className={`area-card ${answered ? (choice === 'right' ? (isCorrect ? 'correct' : 'wrong') : (correctSide === 'right' ? 'reveal-correct' : '')) : ''}`}
          onClick={() => handleGuess('right')}
          disabled={answered}
        >
          <span className="area-card-flag">{right.flag}</span>
          <span className="area-card-name">{right.name}</span>
          {answered && (
            <span className="area-card-size">{formatArea(right.area)}</span>
          )}
          {answered && correctSide === 'right' && (
            <span className="area-card-crown">👑 Bigger</span>
          )}
        </button>
      </div>

      {answered && (
        <div className="area-result">
          <p className={`area-result-msg ${isCorrect ? 'area-correct' : 'area-wrong'}`}>
            {isCorrect
              ? streak >= 3 ? `🔥 ${streak} in a row! +${calcPoints(streak)} pts` : `Correct! +${calcPoints(streak)} pts`
              : 'Wrong! No points this round.'}
          </p>
          <button className="new-game-btn" onClick={handleNext}>Next →</button>
        </div>
      )}

      {history.length > 0 && (
        <div className="area-history">
          <div className="area-history-label">Recent rounds</div>
          {history.map((h, i) => (
            <div key={i} className={`area-history-item ${h.correct ? 'area-h-correct' : 'area-h-wrong'}`}>
              <span>{h.correct ? '✅' : '❌'}</span>
              <span className="area-h-text">
                {h.left.name} vs {h.right.name}
              </span>
              {h.pts > 0 && <span className="area-h-pts">+{h.pts}</span>}
            </div>
          ))}
        </div>
      )}
    </>
  )
}
