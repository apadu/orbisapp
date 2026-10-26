/**
 * Tiny global store for "how to play" rules of the current game.
 * Games start instantly now, so the rules live behind an ⓘ button instead of an intro screen.
 */
let current = null           // { icon, title, desc, rules }
const listeners = new Set()

export function setRules(r) { current = r; listeners.forEach(fn => fn(current)) }
export function clearRules() { setRules(null) }
export function getRules() { return current }
export function subscribeRules(fn) { listeners.add(fn); return () => listeners.delete(fn) }
