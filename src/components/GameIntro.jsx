export default function GameIntro({ icon, title, desc, rules, onStart, disabled = false }) {
  return (
    <div className="game-intro">
      <div className="game-intro-icon">{icon}</div>
      <h2 className="game-intro-title">{title}</h2>
      <p className="game-intro-desc">{desc}</p>
      <ul className="game-intro-rules">
        {rules.map((r, i) => <li key={i}>{r}</li>)}
      </ul>
      <button className="game-intro-btn" onClick={onStart} disabled={disabled}>
        Start Game
      </button>
    </div>
  )
}
