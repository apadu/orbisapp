import { useEffect, useRef } from 'react'
import { startSession, trackAnswer, finishGame } from './results'

/**
 * Tracks "name them all" style games, where the game exposes a growing list of
 * found keys and (at the end) a list of missed keys.
 *
 * - found list empties  → new game (fresh session)
 * - new found keys      → one correct answer each (10 pts)
 * - missed list fills   → wrong answers, game finished
 * - `complete` flips on → game finished (everything found)
 *
 * countryKeyed: keys are country NAMEs (feed the knowledge map); otherwise stored as generic keys.
 */
export function useListTracking({ mode, active, found, missed = [], complete = false, countryKeyed = true }) {
  const tracked  = useRef(new Set())
  const finished = useRef(false)

  const record = (key, ok, silent = false) =>
    trackAnswer(mode, countryKeyed ? key : null, ok, ok ? 10 : 0, countryKeyed ? null : key, { silent })

  // Found list changes
  useEffect(() => {
    if (!active) return
    if (found.length === 0 && missed.length === 0) {
      if (tracked.current.size || finished.current) {
        tracked.current = new Set()
        finished.current = false
      }
      startSession(mode)
      return
    }
    if (finished.current) return
    for (const k of found) {
      if (!tracked.current.has(k)) { tracked.current.add(k); record(k, true) }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, found])

  // Game over: missed revealed
  useEffect(() => {
    if (!active || finished.current || missed.length === 0) return
    for (const k of missed) {
      if (!tracked.current.has(k)) { tracked.current.add(k); record(k, false, true) }
    }
    finished.current = true
    finishGame(mode, { completed: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, missed])

  // Game over: all found
  useEffect(() => {
    if (!active || finished.current || !complete) return
    finished.current = true
    finishGame(mode, { completed: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, complete])
}
