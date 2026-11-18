import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../auth/AuthContext'
import { loadResults } from '../utils/results'
import { t, locale } from '../i18n'

/**
 * JetPunk-style extras for a quiz (see supabase/quiz_stats.sql):
 *   <AttemptNote>  before the start — "You haven't tried this quiz yet" / your last score, plus the quiz's rating
 *   <QuizResultStats> after the end — how you did against everyone, your last attempt, and a 1–5 star rating
 * Without the backend (or before the SQL is run) the parts that need it simply don't show.
 */

/** Earlier finished rounds of this quiz on this device / account, newest first. */
export function pastRounds(mode, variant = null) {
  return loadResults().filter(r => r.mode === mode && r.total > 0 && (variant == null || (r.details?.variant ?? '') === variant))
}

const pct = (r) => Math.round((r.correct / r.total) * 100)
const scoreOf = (r) => `${r.correct}/${r.total}`

function ago(iso) {
  const days = Math.floor((Date.now() - new Date(iso)) / 86400000)
  if (days < 1) return t('today')
  if (days < 2) return t('yesterday')
  if (days < 30) return t('{v}d ago', { v: days })
  return new Date(iso).toLocaleDateString(locale, { day: 'numeric', month: 'short' })
}

/** One line above the answer bar before you start: your last score and the quiz's rating. */
export function AttemptNote({ mode }) {
  const last = pastRounds(mode)[0]
  const [rating, setRating] = useState(null)
  useEffect(() => {
    if (!supabase) return
    let alive = true
    supabase.rpc('quiz_stats', { p_mode: mode, p_variant: '', p_correct: 0, p_total: 1 })
      .then(({ data, error }) => { if (alive && !error && data?.ratings) setRating(data) }, () => {})
    return () => { alive = false }
  }, [mode])
  return (
    <p className="qs-attempt">
      {last
        ? t('Last time: {s} ({p}%) · {when}', { s: scoreOf(last), p: pct(last), when: ago(last.played_at) })
        : t('You haven\'t tried this quiz yet.')}
      {rating && (
        <span className="qs-attempt-rating" title={t(rating.ratings === 1 ? '{r} average · 1 rating' : '{r} average · {n} ratings', { r: Number(rating.rating).toLocaleString(locale), n: rating.ratings })}>
          <span className="qs-star-mini">★</span> {Number(rating.rating).toLocaleString(locale)} <span className="qs-dim">({rating.ratings})</span>
        </span>
      )}
    </p>
  )
}

/**
 * row:  the round just finished (finishGame's return value)
 * prev: the rounds before it (pastRounds taken when the game started)
 * record: count this round in the "% of players" stats (first attempt, timed)
 */
export function QuizResultStats({ mode, variant = '', row, prev = [], record = true }) {
  const auth = useAuth()
  const me = auth.user?.id ?? null
  const [stats, setStats] = useState(null)
  const [mine, setMine] = useState(null)
  const [hover, setHover] = useState(0)
  const [saving, setSaving] = useState(false)
  const first = prev.length === 0

  useEffect(() => {
    if (!supabase || !row) return
    let alive = true
    ;(async () => {
      if (record && first) {
        await supabase.from('quiz_plays').insert({ mode, variant, correct: row.correct, total: row.total }).then(() => {}, () => {})
      }
      const { data, error } = await supabase.rpc('quiz_stats', { p_mode: mode, p_variant: variant, p_correct: row.correct, p_total: row.total })
      if (alive && !error && data) { setStats(data); setMine(data.mine ?? null) }
    })()
    return () => { alive = false }
  }, [row?.client_id, me]) // eslint-disable-line react-hooks/exhaustive-deps

  const rate = async (stars) => {
    if (!me) { auth.openAuth(); return }
    if (saving) return
    setSaving(true)
    const before = mine
    setMine(stars)
    const { error } = await supabase.from('quiz_ratings').upsert({ quiz: mode, user_id: me, stars, updated_at: new Date().toISOString() }, { onConflict: 'quiz,user_id' })
    if (error) setMine(before)
    else {
      const { data } = await supabase.rpc('quiz_stats', { p_mode: mode, p_variant: variant, p_correct: row.correct, p_total: row.total })
      if (data) setStats(data)
    }
    setSaving(false)
  }

  if (!row) return null
  // others = everyone else's first attempts (this round is in the count when it was a first attempt)
  const others = stats ? stats.plays - (record && first ? 1 : 0) : 0
  const better = others > 0 ? Math.round((stats.below / others) * 100) : null
  const shown = hover || mine || 0

  return (
    <div className="qs-panel">
      <div className="qs-col">
        <span className="qs-kicker">{t('Your score')}</span>
        <span className="qs-big">{scoreOf(row)} <small>({pct(row)}%)</small></span>
        {stats && (better != null
          ? <span className="qs-line">{t('Better than {p}% of players', { p: better })}{stats.avg_pct != null && <> · {t('average {p}%', { p: stats.avg_pct })}</>}</span>
          : <span className="qs-line">{t('You\'re the first to finish this quiz!')}</span>)}
      </div>

      <div className="qs-col">
        <span className="qs-kicker">{t('Last attempt')}</span>
        {first ? (
          <span className="qs-line">{t('This was your first attempt.')}</span>
        ) : (
          <span className="qs-line">
            {t('{s} ({p}%) · {when}', { s: scoreOf(prev[0]), p: pct(prev[0]), when: ago(prev[0].played_at) })}
            {row.correct / row.total > prev[0].correct / prev[0].total && <strong className="qs-record"> · {t('Better than last time!')}</strong>}
          </span>
        )}
      </div>

      {supabase && (
        <div className="qs-col">
          <span className="qs-kicker">{mine ? t('Your rating') : t('Rate this quiz')}</span>
          <span className="qs-stars" onMouseLeave={() => setHover(0)} role="radiogroup" aria-label={t('Rate this quiz')}>
            {[1, 2, 3, 4, 5].map(n => (
              <button key={n} type="button" role="radio" aria-checked={mine === n} aria-label={t('{n} stars', { n })}
                className={`qs-star${n <= shown ? ' on' : ''}`} onMouseEnter={() => setHover(n)} onClick={() => rate(n)}>★</button>
            ))}
          </span>
          <span className="qs-line qs-dim">
            {stats?.ratings ? t(stats.ratings === 1 ? '{r} average · 1 rating' : '{r} average · {n} ratings', { r: Number(stats.rating).toLocaleString(locale), n: stats.ratings }) : t('No ratings yet')}
            {!me && <> · {t('sign in to rate')}</>}
          </span>
        </div>
      )}
    </div>
  )
}
