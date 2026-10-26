/**
 * Derives everything the profile page shows from the raw results list.
 * Pure functions — no storage access.
 */
import { GAME_CATALOG } from './gameCatalog'
import { t } from '../i18n'

// ── XP & levels ────────────────────────────────────────────────────────────
// XP: 10 per correct answer — but only the FIRST time you get a given item right
// in a given game (naming France in Name All twice gives XP once) — plus 25 per completed game.
export const XP_PER_NEW = 10
export const XP_PER_GAME = 25

export function itemKey(mode, a) {
  const id = a.c ?? a.k
  return id ? `${mode}|${id}` : null
}

/** Total XP from a results list (newest-first, as stored). */
export function computeXp(results) {
  const seen = new Set()
  let xp = 0
  for (let i = results.length - 1; i >= 0; i--) {
    const r = results[i]
    if (r.details?.untimed) continue          // untimed games earn no XP
    if (r.completed) xp += XP_PER_GAME
    const answers = r.details?.answers ?? []
    let itemizedOk = 0
    for (const a of answers) {
      if (!a.ok) continue
      itemizedOk++
      const key = itemKey(r.mode, a)
      if (key && !seen.has(key)) { seen.add(key); xp += XP_PER_NEW }
    }
    // Correct answers that weren't itemized (older data) still count
    xp += Math.max(0, r.correct - itemizedOk) * XP_PER_NEW
  }
  return xp
}
// Level L requires 60·(L−1)² XP  → L2=60, L5=960, L10=4860, L20=21660
export function levelForXp(xp) {
  const level = Math.floor(Math.sqrt(xp / 60)) + 1
  const cur   = 60 * (level - 1) ** 2
  const next  = 60 * level ** 2
  return { level, cur, next, pct: Math.min(100, ((xp - cur) / (next - cur)) * 100) }
}

const LEVEL_TITLES = [
  [1, 'Tourist'], [3, 'Backpacker'], [6, 'Explorer'], [10, 'Navigator'],
  [15, 'Cartographer'], [22, 'Globetrotter'], [30, 'Geographer'], [40, 'Atlas'],
]
export function levelTitle(level) {
  let title = LEVEL_TITLES[0][1]
  for (const [l, name] of LEVEL_TITLES) if (level >= l) title = name
  return t(title)
}

// ── Dates ──────────────────────────────────────────────────────────────────
export function dayKey(d) {
  const x = new Date(d)
  return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, '0')}-${String(x.getDate()).padStart(2, '0')}`
}

function streaks(daySet) {
  if (!daySet.size) return { current: 0, best: 0 }
  const sorted = [...daySet].sort()
  let best = 1, run = 1
  for (let i = 1; i < sorted.length; i++) {
    const diff = Math.round((new Date(sorted[i]) - new Date(sorted[i - 1])) / 864e5)
    run = diff === 1 ? run + 1 : 1
    best = Math.max(best, run)
  }
  // Current streak: count back from today (or yesterday if not yet played today)
  const d = new Date()
  if (!daySet.has(dayKey(d))) d.setDate(d.getDate() - 1)
  let current = 0
  while (daySet.has(dayKey(d))) { current++; d.setDate(d.getDate() - 1) }
  return { current, best }
}

function maxRun(answers) {
  let best = 0, run = 0
  for (const a of answers ?? []) { run = a.ok ? run + 1 : 0; best = Math.max(best, run) }
  return best
}

// ── Achievements ───────────────────────────────────────────────────────────
// Each `progress(p)` returns [value, target].
export const ACHIEVEMENTS = [
  { id: 'first-steps',   icon: '👣', label: t('First Steps'),       desc: t('Finish your first game'),                    progress: p => [p.totals.games, 1] },
  { id: 'regular',       icon: '🎮', label: t('Regular'),           desc: t('Play 50 games'),                             progress: p => [p.totals.games, 50] },
  { id: 'addict',        icon: '🕹️', label: t('Can\'t Stop'),        desc: t('Play 250 games'),                            progress: p => [p.totals.games, 250] },
  { id: 'century',       icon: '💯', label: t('Century'),           desc: t('100 correct answers'),                       progress: p => [p.totals.correct, 100] },
  { id: 'thousand',      icon: '🧠', label: t('Big Brain'),         desc: t('1,000 correct answers'),                     progress: p => [p.totals.correct, 1000] },
  { id: 'five-k',        icon: '🌌', label: t('Encyclopedia'),      desc: t('5,000 correct answers'),                     progress: p => [p.totals.correct, 5000] },
  { id: 'streak-3',      icon: '🔥', label: t('Warming Up'),        desc: t('Play 3 days in a row'),                      progress: p => [p.streak.best, 3] },
  { id: 'streak-7',      icon: '📅', label: t('Week Warrior'),      desc: t('Play 7 days in a row'),                      progress: p => [p.streak.best, 7] },
  { id: 'streak-30',     icon: '🗓️', label: t('Habit Formed'),      desc: t('Play 30 days in a row'),                     progress: p => [p.streak.best, 30] },
  { id: 'variety',       icon: '🎲', label: t('Variety Pack'),      desc: t('Play 10 different games'),                   progress: p => [p.modesPlayed, 10] },
  { id: 'completionist', icon: '🏆', label: t('Completionist'),     desc: t('Play every game in Orbis'),                  progress: p => [p.modesPlayed, Object.keys(GAME_CATALOG).length] },
  { id: 'explorer-100',  icon: '🧭', label: t('Well Travelled'),    desc: t('Correctly answer 100 different countries'),  progress: p => [p.countriesKnown, 100] },
  { id: 'cartographer',  icon: '🗺️', label: t('Cartographer'),      desc: t('Master 50 countries (80%+ over 3+ tries)'),  progress: p => [p.countriesMastered, 50] },
  { id: 'world-clear',   icon: '🌍', label: t('World Clear'),       desc: t('Name every country in Name All'),            progress: p => [p.flags.worldClear ? 1 : 0, 1] },
  { id: 'speedrun',      icon: '⚡', label: t('Speedrunner'),       desc: t('Name all countries in under 15 minutes'),    progress: p => [p.flags.speedrun ? 1 : 0, 1] },
  { id: 'sharpshooter',  icon: '🎯', label: t('Sharpshooter'),      desc: t('Guess a Mystery Country in 3 tries or fewer'), progress: p => [p.flags.mystery3 ? 1 : 0, 1] },
  { id: 'flag-25',       icon: '🚩', label: t('Vexillologist'),     desc: t('25 flags in a row'),                         progress: p => [p.flags.flagRun, 25] },
  { id: 'perfect-quiz',  icon: '✨', label: t('Flawless'),          desc: t('Finish a quiz (10+ questions) with 100%'),   progress: p => [p.flags.perfectQuiz ? 1 : 0, 1] },
  { id: 'connections',   icon: '🧩', label: t('Perfect Connection'), desc: t('Solve Connections with no mistakes'),       progress: p => [p.flags.connPerfect ? 1 : 0, 1] },
  { id: 'polyglot',      icon: '🗣️', label: t('Polyglot'),          desc: t('Score 90%+ on a full Endonyms round'),       progress: p => [p.flags.polyglot ? 1 : 0, 1] },
  { id: 'bullseye',      icon: '📍', label: t('Bullseye'),          desc: t('Hit 25 countries dead-on in Pinpoint'),      progress: p => [p.flags.locateHits, 25] },
  { id: 'level-10',      icon: '⭐', label: t('Navigator'),         desc: t('Reach level 10'),                            progress: p => [p.level.level, 10] },
]

// ── Main derivation ────────────────────────────────────────────────────────
export function computeProfile(results) {
  const totals  = { games: results.length, answers: 0, correct: 0, timeMs: 0 }
  const perMode = {}
  const mastery = {}
  const heatmap = {}
  const days    = new Set()
  const flags   = { worldClear: false, speedrun: false, mystery3: false, flagRun: 0, perfectQuiz: false, connPerfect: false, polyglot: false, locateHits: 0 }
  let xp = 0

  // results are newest-first; iterate oldest-first so "recent" arrays end with the latest
  for (let i = results.length - 1; i >= 0; i--) {
    const r = results[i]
    totals.answers += r.total
    totals.correct += r.correct
    totals.timeMs  += r.duration_ms ?? 0

    const dk = dayKey(r.played_at)
    days.add(dk)
    heatmap[dk] = (heatmap[dk] ?? 0) + 1

    const m = perMode[r.mode] ?? (perMode[r.mode] = {
      plays: 0, correct: 0, total: 0, best: null, bestTime: null, completions: 0, recent: [], lastPlayed: null,
    })
    m.plays++
    m.correct += r.correct
    m.total   += r.total
    m.lastPlayed = r.played_at
    m.recent.push(r.score)
    if (m.recent.length > 12) m.recent.shift()
    if (!m.best || r.score > m.best.score || (r.score === m.best.score && (r.duration_ms ?? 1e12) < (m.best.duration_ms ?? 1e12))) m.best = r
    const fullClear = r.completed && r.total > 0 && r.correct === r.total
    if (fullClear) {
      m.completions++
      if (GAME_CATALOG[r.mode]?.timed && (m.bestTime == null || r.duration_ms < m.bestTime)) m.bestTime = r.duration_ms
    }

    for (const a of r.details?.answers ?? []) {
      if (!a.c) continue
      const s = mastery[a.c] ?? (mastery[a.c] = { ok: 0, total: 0 })
      s.total++
      if (a.ok) s.ok++
    }

    // achievement flags
    const meta = r.details ?? {}
    if (r.mode === 'name-all' && fullClear) {
      flags.worldClear = true
      if (r.duration_ms && r.duration_ms < 15 * 60 * 1000) flags.speedrun = true
    }
    if (r.mode === 'mystery' && r.correct > 0 && meta.guesses && meta.guesses <= 3) flags.mystery3 = true
    if (r.mode === 'flag') flags.flagRun = Math.max(flags.flagRun, maxRun(meta.answers))
    if (GAME_CATALOG[r.mode]?.cat === 'quiz' && r.completed && r.total >= 10 && r.correct === r.total) flags.perfectQuiz = true
    if (r.mode === 'connections' && r.correct > 0 && meta.mistakes === 0) flags.connPerfect = true
    if (r.mode === 'endonyms' && r.completed && r.total >= 15 && r.correct / r.total >= 0.9) flags.polyglot = true
    if (r.mode === 'locate') flags.locateHits += r.correct
  }

  for (const m of Object.values(perMode)) m.accuracy = m.total ? m.correct / m.total : 0

  const masteryList = Object.entries(mastery).map(([name, s]) => ({ name, ...s, pct: s.ok / s.total }))
  const weakest = masteryList
    .filter(c => c.total >= 2 && c.pct < 0.7)
    .sort((a, b) => a.pct - b.pct || b.total - a.total)
    .slice(0, 12)

  xp = computeXp(results)

  const p = {
    totals: { ...totals, accuracy: totals.answers ? totals.correct / totals.answers : 0 },
    xp,
    level: levelForXp(xp),
    streak: streaks(days),
    activeDays: days.size,
    heatmap,
    perMode,
    mastery,
    weakest,
    modesPlayed: Object.keys(perMode).filter(k => GAME_CATALOG[k]).length,
    countriesKnown: masteryList.filter(c => c.ok > 0).length,
    countriesMastered: masteryList.filter(c => c.total >= 3 && c.pct >= 0.8).length,
    flags,
  }

  p.achievements = ACHIEVEMENTS.map(a => {
    const [value, target] = a.progress(p)
    return { ...a, value: Math.min(value, target), target, unlocked: value >= target }
  })
  return p
}
