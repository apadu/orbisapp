/**
 * Notices new passport stamps. After a game that can earn one ends (and is uploaded), it asks
 * the server again and announces anything new or upgraded: a toast, and a refresh of the passport.
 */
import { subscribeResults, loadResults, getCurrentUserId } from './results'
import { fetchStamps, STAMP_BY_ID } from './stamps'

const listeners = new Set()
export function subscribeStamps(fn) { listeners.add(fn); return () => listeners.delete(fn) }

const toastListeners = new Set()
export function subscribeStampToasts(fn) { toastListeners.add(fn); return () => toastListeners.delete(fn) }

let known = null            // { stamp: tier } as last seen
let lastTop = null          // newest result already looked at
const STAMP_MODES = new Set([...Object.keys(STAMP_BY_ID), 'daily-quiz', 'duel'])

async function refresh(announce) {
  const uid = getCurrentUserId()
  if (!uid) { known = null; return }
  let rows
  try { rows = await fetchStamps(uid) } catch { return }
  const now = Object.fromEntries(rows.map(r => [r.stamp, r.tier]))
  if (announce && known) {
    for (const r of rows) {
      if ((known[r.stamp] ?? 0) < r.tier) for (const fn of toastListeners) fn({ stamp: r.stamp, tier: r.tier, upgraded: !!known[r.stamp] })
    }
  }
  known = now
  for (const fn of listeners) fn()
}

let started = false
export function startStampWatch() {
  if (started || typeof window === 'undefined') return
  started = true
  subscribeResults(() => {
    const top = loadResults()[0]
    if (!top || top.client_id === lastTop) return
    lastTop = top.client_id
    if (!STAMP_MODES.has(top.mode) || !top.completed) return
    if (known === null) { refresh(false).then(() => setTimeout(() => refresh(true), 2500)); return }
    setTimeout(() => refresh(true), 2500)   // give the upload a moment to land
  })
  // the baseline for whoever is signed in
  setTimeout(() => refresh(false), 3000)
}
