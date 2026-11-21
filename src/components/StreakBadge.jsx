import { useState, useRef, useEffect } from 'react'
import { useDailyChallenges } from '../utils/useDailyChallenges'
import { dateKey, ALL_DONE_BONUS } from '../utils/dailyChallenges'
import { t, locale, isRo } from '../i18n'
import Icon from './Icon'
import GameIcon from './GameIcon'

// ── The ring: three segments, one per challenge of the day ─────────────────
function arc(cx, cy, r, a0, a1) {
  const p = (a) => [cx + r * Math.cos((a - 90) * Math.PI / 180), cy + r * Math.sin((a - 90) * Math.PI / 180)]
  const [x0, y0] = p(a0), [x1, y1] = p(a1)
  return `M${x0.toFixed(2)} ${y0.toFixed(2)} A${r} ${r} 0 0 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`
}
export function QuestRing({ list, size = 26, stroke = 3, label = null }) {
  const c = size / 2, r = c - stroke / 2 - 0.5, gap = 16
  const allDone = list.length > 0 && list.every(q => q.done)
  return (
    <svg className={`quest-ring${allDone ? ' all-done' : ''}`} width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
      {list.map((q, i) => {
        const a0 = i * 120 + gap / 2, a1 = (i + 1) * 120 - gap / 2
        const part = q.done ? 1 : Math.min(1, q.value / q.target)
        return (
          <g key={q.id}>
            <path d={arc(c, c, r, a0, a1)} className="qr-track" strokeWidth={stroke} />
            {part > 0 && <path d={arc(c, c, r, a0, a0 + (a1 - a0) * Math.max(part, 0.08))} className={`qr-fill${q.done ? ' done' : ''}`} strokeWidth={stroke} />}
          </g>
        )
      })}
      {label != null && <text x={c} y={c} className="qr-num" style={{ fontSize: size * 0.27 }}>{label}</text>}
    </svg>
  )
}

/** "5-day streak" / "5 zile la rând" (1 zi, 20 de zile…) */
export function streakLabel(n) {
  if (!isRo) return n === 1 ? '1-day streak' : `${n}-day streak`
  if (n === 1) return '1 zi la rând'
  const de = n % 100 === 0 || n % 100 >= 20
  return `${n} ${de ? 'de ' : ''}zile la rând`
}

function untilMidnight() {
  const now = new Date(), next = new Date(now); next.setHours(24, 0, 0, 0)
  const m = Math.max(1, Math.round((next - now) / 60000))
  return { h: Math.floor(m / 60), m: m % 60 }
}
const TIER_LABEL = { easy: 'Easy', medium: 'Medium', hard: 'Hard' }

export default function StreakBadge({ onSelectMode }) {
  const { list, allDone, done, info, history } = useDailyChallenges()
  const { streak, shielded, shieldReady, shieldIn } = info
  const [open, setOpen] = useState(false)
  const [, tick] = useState(0)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    const key = (e) => { if (e.key === 'Escape') setOpen(false) }
    const id = setInterval(() => tick(x => x + 1), 30_000)
    document.addEventListener('mousedown', handler); document.addEventListener('keydown', key)
    return () => { document.removeEventListener('mousedown', handler); document.removeEventListener('keydown', key); clearInterval(id) }
  }, [open])

  // The last seven days, ending today
  const week = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - (6 - i))
    const k = dateKey(d)
    const isToday = i === 6
    return {
      k, isToday,
      letter: d.toLocaleDateString(locale, { weekday: 'short' }).replace('.', '').slice(0, 2),
      state: (history[k]?.done ?? 0) > 0 ? 'on' : shielded.has(k) ? 'shield' : isToday ? 'open' : 'off',
    }
  })
  const left = untilMidnight()
  const xpToday = list.filter(q => q.done).reduce((s, q) => s + q.xp, 0) + (allDone ? ALL_DONE_BONUS : 0)

  return (
    <div className="streak-badge-wrap" ref={ref}>
      <button
        className={`topbar-streak${allDone ? ' streak-all-done' : ''}${open ? ' open' : ''}`}
        onClick={() => setOpen(o => !o)}
        title={t('Daily quests')}
        aria-label={`${t('Daily quests')}: ${done}/${list.length} · ${streakLabel(streak)}`}
        aria-expanded={open}
      >
        <QuestRing list={list} size={22} stroke={2.6} />
        <span className="ts-num">{streak}</span>
      </button>

      {open && (
        <div className="streak-popover" role="dialog" aria-label={t('Daily quests')}>
          <div className="sp-head">
            <QuestRing list={list} size={52} stroke={4.5} label={`${done}/${list.length}`} />
            <div className="sp-head-text">
              <span className="sp-streak">
                {streak > 0 ? streakLabel(streak) : t('Start a streak today')}
              </span>
              <span className={`sp-shield${shieldReady ? ' ready' : ''}`}>
                <Icon name="shield" size={13} />
                {shieldReady ? t('Shield ready: one missed day is forgiven') : t('Shield back in {n} days', { n: shieldIn })}
              </span>
            </div>
          </div>

          <div className="sp-week">
            {week.map(d => (
              <div key={d.k} className={`sp-day ${d.state}${d.isToday ? ' today' : ''}`}>
                <span className="sp-day-dot">
                  {d.state === 'on' && <Icon name="check" size={12} strokeWidth={3} />}
                  {d.state === 'shield' && <Icon name="shield" size={12} />}
                </span>
                <span className="sp-day-letter">{d.letter}</span>
              </div>
            ))}
          </div>

          <div className="sp-quests">
            {list.map(q => {
              const pct = Math.min((q.value / q.target) * 100, 100)
              return (
                <button key={q.id} className={`sp-quest${q.done ? ' done' : ''}`} onClick={() => { setOpen(false); onSelectMode(q.mode) }}>
                  <span className="sp-q-icon"><GameIcon id={q.mode} size={18} /></span>
                  <span className="sp-q-body">
                    <span className="sp-q-meta">
                      {q.tier && <span className={`sp-tier ${q.tier}`}>{t(TIER_LABEL[q.tier])}</span>}
                      <span className="sp-xp">+{q.xp} XP</span>
                    </span>
                    <span className="sp-q-task">{q.task}</span>
                    {!q.done && q.target > 1 && <span className="sp-q-bar"><span style={{ width: `${pct}%` }} /></span>}
                  </span>
                  <span className="sp-q-status">{q.done ? <Icon name="check" size={16} strokeWidth={3} /> : `${q.value}/${q.target}`}</span>
                </button>
              )
            })}
          </div>

          <div className="sp-foot">
            <span>{allDone ? t('All done! +{xp} XP today', { xp: xpToday }) : t('All three: +{xp} XP bonus', { xp: ALL_DONE_BONUS })}</span>
            <span className="sp-reset"><Icon name="clock" size={13} /> {t('New quests in {h}h {m}m', left)}</span>
          </div>
        </div>
      )}
    </div>
  )
}
