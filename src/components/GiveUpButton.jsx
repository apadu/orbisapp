import { useEffect, useRef, useState } from 'react'

const ARM_MS = 3000

/**
 * Two-tap give up: first tap arms it (turns red, countdown bar), second tap confirms.
 * Disarms by itself after 3 s or on Escape — no modal, no extra confirm row.
 */
export default function GiveUpButton({ onConfirm, label = 'Give up', armedLabel = 'Tap again to reveal', compact = false, className = '' }) {
  const [armed, setArmed] = useState(false)
  const timer = useRef(null)

  useEffect(() => {
    if (!armed) return
    timer.current = setTimeout(() => setArmed(false), ARM_MS)
    const esc = e => { if (e.key === 'Escape') setArmed(false) }
    window.addEventListener('keydown', esc)
    return () => { clearTimeout(timer.current); window.removeEventListener('keydown', esc) }
  }, [armed])

  const click = () => {
    if (armed) { setArmed(false); onConfirm() }
    else setArmed(true)
  }

  return (
    <button
      type="button"
      className={`giveup${armed ? ' armed' : ''}${compact ? ' compact' : ''} ${className}`}
      onClick={click}
      title={armed ? 'Click again to give up' : 'Give up and reveal the answers'}
    >
      <span className="giveup-icon" aria-hidden="true">🏳️</span>
      <span className="giveup-label">{armed ? armedLabel : label}</span>
      {armed && <span className="giveup-timer" style={{ animationDuration: `${ARM_MS}ms` }} />}
    </button>
  )
}
