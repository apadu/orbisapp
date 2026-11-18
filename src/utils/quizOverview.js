import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

/**
 * Rating + popularity of every quiz (supabase quiz_overview(), see quiz_stats.sql), fetched once
 * per page load and shared. → { [quizId]: { rating, ratings, playsWeek, plays } } — empty without the backend.
 */
let cache = null
let pending = null

function load() {
  if (cache) return Promise.resolve(cache)
  if (!supabase) return Promise.resolve({})
  pending ??= supabase.rpc('quiz_overview').then(({ data, error }) => {
    if (error || !Array.isArray(data)) return {}
    cache = Object.fromEntries(data.map(r => [r.quiz, {
      rating: r.rating == null ? null : Number(r.rating),
      ratings: Number(r.ratings) || 0,
      playsWeek: Number(r.plays_week) || 0,
      plays: Number(r.plays) || 0,
    }]))
    return cache
  }, () => ({})).finally(() => { pending = null })
  return pending
}

export function useQuizOverview() {
  const [data, setData] = useState(cache ?? {})
  useEffect(() => { let alive = true; load().then(d => { if (alive) setData(d) }); return () => { alive = false } }, [])
  return data
}

/** Rating that doesn't let one 5-star vote beat a hundred 4.6s: pulled toward 3.5 until there are a few votes. */
export function rankScore(o) {
  if (!o?.ratings) return -1
  const C = 3, prior = 3.5
  return (prior * C + o.rating * o.ratings) / (C + o.ratings)
}
