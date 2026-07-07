import { distanceLabel } from '../utils/geoUtils'

function scoreFromKm(km) {
  return Math.max(10, Math.round(1000 * Math.exp(-km / 2000)))
}

function scoreLabel(pts) {
  if (pts >= 900) return { text: 'Perfect!', color: '#39ff14' }
  if (pts >= 700) return { text: 'Great!',   color: '#a3e635' }
  if (pts >= 450) return { text: 'Good',     color: '#eab308' }
  if (pts >= 200) return { text: 'Close',    color: '#f97316' }
  return               { text: 'Miss',      color: '#ef4444' }
}

export default function LocatePanel({ current, guessed, clickResult, totalScore, history, onNext }) {
  const currentName = current?.properties?.NAME ?? ''

  return (
    <>
      {/* Header */}
      <div className="panel-header">
        <h2>📍 Locate It</h2>
        <p className="panel-subtitle">Click on the globe to place the country.</p>
      </div>

      {/* Score */}
      <div className="locate-score-bar">
        <span className="locate-score-num">{totalScore}</span>
        <span className="locate-score-label">total points</span>
        <span className="locate-round-count">{history.length} guessed</span>
      </div>

      {/* Current target */}
      <div className="locate-target">
        {guessed ? (
          <div className="locate-result">
            <div className="locate-result-name">{currentName}</div>
            <div className="locate-result-dist">{distanceLabel(clickResult.km)} away</div>
            <div className="locate-result-pts" style={{ color: scoreLabel(clickResult.pts).color }}>
              +{clickResult.pts} pts — {scoreLabel(clickResult.pts).text}
            </div>
          </div>
        ) : (
          <div className="locate-find">
            <span className="locate-find-label">Find</span>
            <span className="locate-find-name">{currentName}</span>
          </div>
        )}
      </div>

      {/* Next button */}
      {guessed && (
        <div className="locate-next-wrap">
          <button className="new-game-btn" onClick={onNext}>Next →</button>
        </div>
      )}

      {/* History */}
      {history.length > 0 && (
        <div className="guesses-section">
          <h3 className="guesses-title">History <span className="guess-count">{history.length}</span></h3>
          <ul className="guess-list">
            {[...history].reverse().map((h, i) => {
              const lbl = scoreLabel(h.pts)
              return (
                <li key={i} className="guess-item">
                  <span className="guess-swatch" style={{ background: lbl.color }} />
                  <span className="guess-name">{h.name}</span>
                  <span className="guess-dist" style={{ color: lbl.color }}>{distanceLabel(h.km)}</span>
                  <span className="guess-dist">+{h.pts}</span>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </>
  )
}
