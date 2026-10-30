/**
 * Tiny store for the floating game HUD on phones (counter + timer that stay
 * visible over the globe even when the game panel is collapsed or the keyboard is up).
 * Panels publish with useGameHud([...items]); App renders <GameHud />.
 *
 * item: { icon?, text, urgent? }
 */
import { useEffect, useState } from 'react'

let current = null
const listeners = new Set()
const emit = () => listeners.forEach(fn => fn(current))

export function setHud(items) { current = items?.length ? items : null; emit() }
export function useHudItems() {
  const [v, setV] = useState(current)
  useEffect(() => { listeners.add(setV); return () => listeners.delete(setV) }, [])
  return v
}

/** Publish this panel's counter/timer while it's mounted. Pass null to hide. */
export function useGameHud(items) {
  const key = JSON.stringify(items ?? null)
  useEffect(() => { setHud(items) }, [key])  // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => () => setHud(null), [])
}
