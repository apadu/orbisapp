import { DAILY_CHALLENGES, getChallengeProgress } from '../utils/dailyChallenges'

export default function DailyChallengeHub({ progress, streak, onSelectMode }) {
  const allDone = DAILY_CHALLENGES.every(c => getChallengeProgress(c.id, progress).done)

  return (
    <div className={`daily-hub${allDone ? ' daily-hub-complete' : ''}`}>
      <div className="daily-hub-header">
        <span className="daily-hub-title">📅 Daily Challenges</span>
        <div className="daily-hub-meta">
          {allDone
            ? <span className="daily-hub-all-done">All done ✓</span>
            : streak > 0 && <span className="daily-hub-streak">🔥 {streak} day streak</span>
          }
        </div>
      </div>

      <div className="daily-hub-list">
        {DAILY_CHALLENGES.map(ch => {
          const { done, value, target } = getChallengeProgress(ch.id, progress)
          const pct = Math.min((value / target) * 100, 100)

          return (
            <button
              key={ch.id}
              className={`daily-ch-card${done ? ' daily-ch-done' : ''}`}
              onClick={() => onSelectMode(ch.mode)}
            >
              <span className="daily-ch-icon">{ch.icon}</span>
              <div className="daily-ch-body">
                <span className="daily-ch-label">{ch.label}</span>
                <span className="daily-ch-task">{ch.task}</span>
                {!done && target > 1 && (
                  <div className="daily-ch-bar">
                    <div className="daily-ch-bar-fill" style={{ width: `${pct}%` }} />
                  </div>
                )}
              </div>
              <div className="daily-ch-right">
                {done
                  ? <span className="daily-ch-check">✓</span>
                  : <span className="daily-ch-count">{value}/{target}</span>
                }
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
