import { useState, useRef, useEffect } from 'react'
import { DAILY_CHALLENGES, getChallengeProgress } from '../utils/dailyChallenges'

export default function StreakBadge({ streak, dailyProgress, onSelectMode }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const allDone = DAILY_CHALLENGES.every(c => getChallengeProgress(c.id, dailyProgress).done)

  const todayLabel = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })

  return (
    <div className="streak-badge-wrap" ref={ref}>
      <button
        className={`topbar-streak${allDone ? ' streak-all-done' : ''}`}
        onClick={() => setOpen(o => !o)}
        title="Daily challenges"
      >
        🔥 {streak > 0 ? streak : '0'}
      </button>

      {open && (
        <div className="streak-popover">
          <div className="streak-pop-header">
            <span className="streak-pop-date">{todayLabel}</span>
            {streak > 0 && <span className="streak-pop-streak">🔥 {streak} day streak</span>}
          </div>

          <div className="streak-pop-challenges">
            {DAILY_CHALLENGES.map(ch => {
              const { done, value, target } = getChallengeProgress(ch.id, dailyProgress)
              const pct = Math.min((value / target) * 100, 100)
              return (
                <button
                  key={ch.id}
                  className={`streak-pop-ch${done ? ' sp-done' : ''}`}
                  onClick={() => { setOpen(false); onSelectMode(ch.mode) }}
                >
                  <span className="sp-icon">{ch.icon}</span>
                  <div className="sp-body">
                    <span className="sp-label">{ch.task}</span>
                    {!done && target > 1 && (
                      <div className="sp-bar">
                        <div className="sp-bar-fill" style={{ width: `${pct}%` }} />
                      </div>
                    )}
                  </div>
                  <span className={`sp-status${done ? ' sp-check' : ''}`}>
                    {done ? '✓' : `${value}/${target}`}
                  </span>
                </button>
              )
            })}
          </div>

          {allDone && (
            <div className="streak-pop-complete">All done today! See you tomorrow 🌍</div>
          )}
        </div>
      )}
    </div>
  )
}
