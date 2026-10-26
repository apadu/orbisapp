import { useMemo } from 'react'
import { dayKey } from '../../utils/profileData'

const WEEKS = 26
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function level(n) {
  if (!n) return 0
  if (n < 2) return 1
  if (n < 5) return 2
  if (n < 10) return 3
  return 4
}

/** GitHub-style grid: columns = weeks (Mon-first), rows = weekdays. */
export default function ActivityHeatmap({ heatmap }) {
  const { columns, monthLabels, total } = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const dow = (today.getDay() + 6) % 7            // Mon = 0
    const start = new Date(today)
    start.setDate(today.getDate() - dow - (WEEKS - 1) * 7)

    const cols = []
    const labels = []
    let total = 0
    let lastMonth = -1
    for (let w = 0; w < WEEKS; w++) {
      const col = []
      for (let d = 0; d < 7; d++) {
        const date = new Date(start)
        date.setDate(start.getDate() + w * 7 + d)
        const future = date > today
        const key = dayKey(date)
        const n = future ? 0 : (heatmap[key] ?? 0)
        total += n
        col.push({ key, n, future })
        if (d === 0 && date.getMonth() !== lastMonth) {
          labels.push({ w, label: MONTHS[date.getMonth()] })
          lastMonth = date.getMonth()
        }
      }
      cols.push(col)
    }
    return { columns: cols, monthLabels: labels, total }
  }, [heatmap])

  return (
    <div className="hm-wrap">
      <div className="hm-head">
        <span className="hm-title">Activity</span>
        <span className="hm-sub">{total} game{total === 1 ? '' : 's'} in the last 6 months</span>
      </div>
      <div className="hm-scroll">
        <div className="hm-months" style={{ gridTemplateColumns: `repeat(${WEEKS}, 1fr)` }}>
          {monthLabels.map(m => (
            <span key={m.w} style={{ gridColumn: m.w + 1 }}>{m.label}</span>
          ))}
        </div>
        <div className="hm-grid" style={{ gridTemplateColumns: `repeat(${WEEKS}, 1fr)` }}>
          {columns.map((col, w) => (
            <div key={w} className="hm-col">
              {col.map(c => (
                <div
                  key={c.key}
                  className={`hm-cell hm-l${level(c.n)}${c.future ? ' hm-future' : ''}`}
                  title={c.future ? '' : `${c.key} · ${c.n} game${c.n === 1 ? '' : 's'}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="hm-legend">
        Less
        {[0, 1, 2, 3, 4].map(l => <span key={l} className={`hm-cell hm-l${l}`} />)}
        More
      </div>
    </div>
  )
}
