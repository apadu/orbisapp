/**
 * Quiz of the day — the same quiz for every player on a given UTC day.
 *
 * The schedule is a fixed list (dailySchedule.js): every client shows the same quiz
 * on the same day, and adding new quizzes to the app never changes past days.
 */
import { TABLE_QUIZZES } from './tableQuizzes'
import { GAME_CATALOG } from '../utils/gameCatalog'
import { DAILY_SCHEDULE } from './dailySchedule'
import { continentName, t } from '../i18n'
import { siteLink } from '../utils/share'

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

/** The quiz for daily #n: { day, quizId, kind, region, size, seed, title, icon }
 *  kind: 'table' (TableQuiz), 'map' (LandformQuiz) or 'diagram' (DiagramQuiz).
 *  Comes from the frozen list in dailySchedule.js, so a past day's quiz never changes. */
export function dailyQuizFor(n) {
  const len = DAILY_SCHEDULE.length
  if (!len || n < 1) return null
  // Skip entries whose quiz no longer exists (shouldn't happen — just in case)
  for (let k = 0; k < len; k++) {
    const [quizId, region, size, kind = 'table'] = DAILY_SCHEDULE[(n - 1 + k) % len]
    const q = kind === 'table' ? TABLE_QUIZZES[quizId] : GAME_CATALOG[quizId]
    if (!q) continue
    return { day: n, quizId, kind, region, size, seed: n * 2654435761, title: q.title ?? q.label, icon: q.icon, prompt: q.prompt }
  }
  return null
}

/** Wordle-style share text. */
export function dailyShareText({ day, title, region }, { score, total, durationMs }, streak = 0) {
  // one square per answer (up to 20), otherwise a 10-square bar
  const n = total > 0 && total <= 20 ? total : 10
  const filled = total ? Math.round((score / total) * n) : 0
  const bar = '🟩'.repeat(filled) + '⬛'.repeat(n - filled)
  const s = Math.round(durationMs / 1000)
  const time = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
  return [
    `GeoFeverr #${day} · ${title}${region && region !== 'World' ? ` · ${continentName(region)}` : ''}`,
    `${score}/${total} · ⏱ ${time}${streak > 0 ? ` · 🔥 ${streak}` : ''}`,
    bar,
    siteLink('/daily').replace(/^https?:\/\//, ''),
  ].join('\n')
}
