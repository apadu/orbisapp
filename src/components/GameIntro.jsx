import { useEffect, useRef } from 'react'
import { setRules } from '../utils/rulesStore'

/**
 * Games start immediately — no intro screen.
 * This component registers the rules (shown behind the ⓘ "How to play" button)
 * and fires onStart once, as soon as the game is ready (`disabled` false).
 */
export default function GameIntro({ icon, title, desc, rules = [], onStart, disabled = false }) {
  const fired = useRef(false)

  useEffect(() => {
    setRules({ icon, title, desc, rules })
  }, [icon, title, desc]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (disabled || fired.current) return
    fired.current = true
    onStart?.()
  }, [disabled]) // eslint-disable-line react-hooks/exhaustive-deps

  return disabled ? <div className="game-intro-wait">Loading…</div> : null
}
