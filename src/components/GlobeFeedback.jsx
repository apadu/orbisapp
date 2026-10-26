import { useEffect, useRef, useState } from 'react'
import { subscribeAnswers } from '../utils/results'

const TOAST_MS = 1500
const MAX_TOASTS = 3

/**
 * Live feedback layered over the globe:
 *  - a floating toast per answer (+pts, country, streak)
 *  - a soft green/red edge flash
 * Listens to every trackAnswer() call, so every game gets it for free.
 */
export default function GlobeFeedback() {
  const [toasts, setToasts] = useState([])
  const [flash,  setFlash]  = useState(null) // { ok, id }
  const idRef = useRef(0)

  useEffect(() => subscribeAnswers(evt => {
    const id = ++idRef.current
    setToasts(t => [...t.slice(-(MAX_TOASTS - 1)), { ...evt, id }])
    setFlash({ ok: evt.ok, id })
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), TOAST_MS)
  }), [])

  return (
    <div className="gf-layer" aria-live="polite">
      {flash && <div key={flash.id} className={`gf-flash ${flash.ok ? 'gf-flash-ok' : 'gf-flash-bad'}`} />}
      <div className="gf-stack">
        {toasts.map(t => {
          const label = t.country ?? (t.key && t.key.length < 28 ? t.key : null)
          return (
            <div key={t.id} className={`gf-toast ${t.ok ? 'gf-ok' : 'gf-bad'}`}>
              <span className="gf-main">
                {t.ok ? '✓' : '✗'}
              </span>
              {label && <span className="gf-label">{label}</span>}
              {t.ok && t.streak >= 3 && <span className="gf-streak">🔥 ×{t.streak}</span>}
              {t.ok && (t.firstTime
                ? <span className="gf-xp">+10 XP</span>
                : <span className="gf-known" title="Already answered in a previous game — no XP">known</span>)}
            </div>
          )
        })}
      </div>
    </div>
  )
}
