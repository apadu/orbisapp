export default function OddOneOutPanel({ question, answered, chosen, score, streak, history, onGuess, onNext }) {
  if (!question) return (
    <div className="panel-header">
      <h2>🤔 Odd One Out</h2>
      <p className="panel-subtitle">Loading…</p>
    </div>
  )

  const streakMult = [1, 1, 1.5, 2, 3, 4]
  const mult = streakMult[Math.min(streak, streakMult.length - 1)]
  const pts = Math.round(100 * mult)

  return (
    <>
      <div className="panel-header">
        <h2>🤔 Odd One Out</h2>
      </div>

      {/* Score + streak */}
      <div className="locate-score-bar">
        <span className="locate-score-num">{score}</span>
        <span className="locate-score-label">points</span>
        {streak >= 2 && (
          <span className="ooo-streak">🔥 ×{mult}</span>
        )}
        <span className="locate-round-count">{history.length} played</span>
      </div>

      {/* Prompt — only shown after guess */}
      {answered && <div className="ooo-prompt">{question.prompt}</div>}

      {/* 4 option grid */}
      <div className="ooo-grid">
        {question.options.map((opt, i) => {
          const isOdd = i === question.oddIndex
          const isChosen = i === chosen
          let cls = 'ooo-option'
          if (answered) {
            if (isOdd) cls += ' ooo-correct'
            else if (isChosen) cls += ' ooo-wrong'
            else cls += ' ooo-dim'
          }
          return (
            <button
              key={opt.name}
              className={cls}
              onClick={() => !answered && onGuess(i)}
              disabled={answered}
            >
              <span className="ooo-flag">{opt.flag}</span>
              <span className="ooo-name">{opt.name}</span>
            </button>
          )
        })}
      </div>

      {/* Feedback */}
      {answered && (
        <div className={`ooo-feedback ${chosen === question.oddIndex ? 'ooo-fb-correct' : 'ooo-fb-wrong'}`}>
          {chosen === question.oddIndex
            ? <><strong>+{pts} pts{streak >= 2 ? ` (×${mult} streak!)` : ''}</strong></>
            : <><strong>Wrong!</strong> The odd one was <strong>{question.options[question.oddIndex].name}</strong></>
          }
          <p className="ooo-explanation">{question.sharedLabel}</p>
        </div>
      )}

      {/* Next */}
      {answered && (
        <div className="locate-next-wrap">
          <button className="new-game-btn" onClick={onNext}>Next →</button>
        </div>
      )}

      {/* History */}
      {history.length > 0 && (
        <div className="guesses-section">
          <h3 className="guesses-title">History <span className="guess-count">{history.length}</span></h3>
          <ul className="guess-list">
            {[...history].reverse().map((h, i) => (
              <li key={i} className="guess-item">
                <span className="guess-swatch" style={{ background: h.correct ? '#39ff14' : '#ef4444' }} />
                <span className="guess-name">{h.odd}</span>
                <span className="guess-dist" style={{ color: h.correct ? '#39ff14' : '#ef4444' }}>
                  {h.correct ? `+${h.pts}` : '✗'}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  )
}
