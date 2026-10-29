/**
 * Quiz of the day — the same quiz for every player on a given UTC day.
 *
 * The schedule is a fixed list (dailySchedule.js): every client shows the same quiz
 * on the same day, and adding new quizzes to the app never changes past days.
 */
import { TABLE_QUIZZES } from './tableQuizzes'
import { DAILY_SCHEDULE } from './dailySchedule'
import { continentName } from '../i18n'

export const DAILY_EPOCH = Date.UTC(2026, 9, 26)   // 26 Oct 2026 = Daily #1
const DAY_MS = 86_400_000

export function dailyNumber(now = Date.now()) {
  return Math.floor((now - DAILY_EPOCH) / DAY_MS) + 1
}

export function msToNextDaily(now = Date.now()) {
  const next = DAILY_EPOCH + dailyNumber(now) * DAY_MS
  return next - now
}

export function utcDayStartISO(now = Date.now()) {
  return new Date(DAILY_EPOCH + (dailyNumber(now) - 1) * DAY_MS).toISOString()
}

/** The quiz for daily #n: { day, quizId, region, size, seed, title, icon }
 *  Comes from the frozen list in dailySchedule.js, so a past day's quiz never changes. */
export function dailyQuizFor(n) {
  const len = DAILY_SCHEDULE.length
  if (!len || n < 1) return null
  // Skip entries whose quiz no longer exists (shouldn't happen — just in case)
  for (let k = 0; k < len; k++) {
    const [quizId, region, size] = DAILY_SCHEDULE[(n - 1 + k) % len]
    const q = TABLE_QUIZZES[quizId]
    if (!q) continue
    return { day: n, quizId, region, size, seed: n * 2654435761, title: q.title, icon: q.icon, prompt: q.prompt }
  }
  return null
}

/** Wordle-style share text. */
export function dailyShareText({ day, title, region }, { score, total, durationMs }) {
  const pct = total ? score / total : 0
  const filled = Math.round(pct * 10)
  const bar = '🟩'.repeat(filled) + '⬛'.repeat(10 - filled)
  const s = Math.round(durationMs / 1000)
  const time = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
  const where = typeof window !== 'undefined' ? (window.location?.origin ?? '') : ''
  return [
    `Orbis Daily #${day} 🌍`,
    `${title}${region && region !== 'World' ? ` · ${continentName(region)}` : ''}`,
    `${score}/${total} · ⏱ ${time}`,
    bar,
    where,
  ].filter(Boolean).join('\n')
}
