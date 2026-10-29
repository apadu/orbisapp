import { useEffect, useMemo, useState } from 'react'
import { loadResults, subscribeResults } from './results'
import { challengeStatus, challengeStreak, todayKey } from './dailyChallenges'

/** Live hook: today's challenges + streak, updated whenever a game is saved. */
export function useDailyChallenges() {
  const [results, setResults] = useState(loadResults)
  const [day, setDay] = useState(todayKey)
  useEffect(() => subscribeResults(() => setResults(loadResults())), [])
  // Roll over at midnight
  useEffect(() => {
    const id = setInterval(() => { const k = todayKey(); if (k !== day) setDay(k) }, 60_000)
    return () => clearInterval(id)
  }, [day])
  return useMemo(() => {
    const list = challengeStatus(results, day)
    return { list, done: list.filter(c => c.done).length, allDone: list.every(c => c.done), streak: challengeStreak(results) }
  }, [results, day])
}
