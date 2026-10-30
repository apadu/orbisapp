import { useHudItems } from '../utils/hudStore'

/** Floating counter / timer pill over the globe (phones). */
export default function GameHud() {
  const items = useHudItems()
  if (!items) return null
  return (
    <div className="ghud" aria-live="off">
      {items.map((it, i) => (
        <span key={i} className={`ghud-item${it.urgent ? ' urgent' : ''}`}>
          {it.icon && <span className="ghud-icon">{it.icon}</span>}
          {it.text}
        </span>
      ))}
    </div>
  )
}
