/**
 * Unified game-result tracking.
 *
 * Every game reports answers through a tiny API:
 *   startSession(mode)                       – begin a fresh session (flushes any open one for that mode)
 *   trackAnswer(mode, country, ok, pts, key) – one answer; `country` feeds the knowledge map
 *   finishGame(mode, overrides)              – close the session → one row in `game_results`
 *   flushSessions()                          – close every open session as "not completed" (mode switch, page unload)
 *
 * Rows are stored locally (guest or per-user cache) and pushed to Supabase when signed in.
 * On sign-in, guest rows are uploaded to the account (deduped by client_id).
 */
import { supabase } from '../lib/supabase'

const GUEST_KEY  = 'orbis_results_guest'
const userKey    = (id) => `orbis_results_${id}`
const MAX_LOCAL  = 4000

let currentUserId = null
const sessions  = {}            // mode → open session
const poolSizes = {}            // mode → how many items the current game has (Name-All style games)
const listeners = new Set()
const answerListeners = new Set()   // live per-answer events (globe feedback toasts)

// ── helpers ────────────────────────────────────────────────────────────────
function newId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

function storeKey() { return currentUserId ? userKey(currentUserId) : GUEST_KEY }

function readKey(key) {
  try { return JSON.parse(localStorage.getItem(key)) ?? [] } catch { return [] }
}

function writeKey(key, rows) {
  try { localStorage.setItem(key, JSON.stringify(rows.slice(0, MAX_LOCAL))) } catch {}
}

function emit() {
  for (const fn of listeners) { try { fn() } catch {} }
}

function newSession(mode) {
  return { mode, startedAt: Date.now(), score: 0, correct: 0, total: 0, run: 0, answers: [], meta: {} }
}

// ── public: read ───────────────────────────────────────────────────────────
/** All results for the current user/guest, newest first. */
export function loadResults() { return readKey(storeKey()) }

/** Subscribe to result changes. Returns an unsubscribe fn. */
export function subscribeResults(fn) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

export function getCurrentUserId() { return currentUserId }

/** Subscribe to every tracked answer: fn({ mode, country, key, ok, pts, streak }). */
export function subscribeAnswers(fn) {
  answerListeners.add(fn)
  return () => answerListeners.delete(fn)
}

// ── public: write ──────────────────────────────────────────────────────────
/** Attach flags to the open session (kept even if it's flushed early), e.g. { untimed: true }. */
export function markSession(mode, meta) {
  const s = sessions[mode] ?? (sessions[mode] = newSession(mode))
  s.meta = { ...s.meta, ...meta }
}

/**
 * For "name them all" games: how many items there are in total, so a game left
 * unfinished is stored as e.g. 35/196 instead of 35/35.
 */
export function setPoolSize(mode, n) { if (n > 0) poolSizes[mode] = n }

/**
 * The game in progress worth a "Leave?" question: an open session with at least
 * MIN_TO_CONFIRM answers (a stray answer or two isn't worth interrupting for).
 * → { mode, total, correct, score } of the furthest-along one, or null.
 */
const MIN_TO_CONFIRM = 3
export function activeGame() {
  let best = null
  for (const s of Object.values(sessions)) {
    if (s.total >= MIN_TO_CONFIRM && (!best || s.total > best.total)) best = s
  }
  // total = the whole game (196 capitals), not just the answers given so far
  return best && { mode: best.mode, total: Math.max(best.total, poolSizes[best.mode] ?? 0), correct: best.correct, score: best.score }
}
export function hasActiveGame() { return !!activeGame() }

export function startSession(mode) {
  if (sessions[mode]?.total > 0) finishGame(mode, { completed: false })
  sessions[mode] = newSession(mode)
}

/**
 * Record one answer.
 * @param country  country NAME (feeds the knowledge map) or null
 * @param ok       answered correctly?
 * @param pts      points earned for this answer
 * @param key      non-country item key (sea, river, currency…) — optional
 * @param opts     { silent } — don't fire live feedback (bulk reveals at game end)
 */
export function trackAnswer(mode, country, ok, pts = 0, key = null, opts = {}) {
  const s = sessions[mode] ?? (sessions[mode] = newSession(mode))
  s.total   += 1
  s.correct += ok ? 1 : 0
  s.score   += pts || 0
  s.run      = ok ? s.run + 1 : 0
  if (country)  s.answers.push({ c: country, ok: !!ok })
  else if (key) s.answers.push({ k: key, ok: !!ok })

  if (!opts.silent) {
    const evt = { mode, country, key, ok: !!ok, pts: pts || 0, streak: s.run, at: Date.now() }
    for (const fn of answerListeners) { try { fn(evt) } catch {} }
  }
}

/** Close the session for `mode` and persist it. Overrides win over tracked values. */
export function finishGame(mode, overrides = {}) {
  const s = sessions[mode] ?? newSession(mode)
  delete sessions[mode]

  const { completed = true, meta = {}, durationMs, ...rest } = overrides
  const row = {
    client_id:   newId(),
    mode,
    score:       Math.round(rest.score   ?? s.score),
    correct:     rest.correct ?? s.correct,
    total:       rest.total   ?? Math.max(s.total, poolSizes[mode] ?? 0),
    duration_ms: Math.round(durationMs ?? (Date.now() - s.startedAt)),
    completed,
    details:     { answers: s.answers, ...s.meta, ...meta },
    played_at:   new Date().toISOString(),
    synced:      false,
  }
  if (!row.total) return null

  const rows = [row, ...readKey(storeKey())]
  writeKey(storeKey(), rows)
  emit()
  pushToServer([row])
  return row
}

/** Close every open session (mode switch, leaving the page, tab hidden). */
export function flushSessions() {
  for (const mode of Object.keys(sessions)) {
    if (sessions[mode].total > 0) finishGame(mode, { completed: false })
    else delete sessions[mode]
  }
}

// Save in-progress sessions when the tab is closed / navigated away
// (not on mere tab switches, which would split one game into two rows)
if (typeof window !== 'undefined') {
  window.addEventListener('pagehide', flushSessions)
}

// ── server sync ────────────────────────────────────────────────────────────
function toServerRow(r, userId) {
  return {
    user_id: userId, client_id: r.client_id, mode: r.mode,
    score: r.score, correct: r.correct, total: r.total,
    duration_ms: r.duration_ms, completed: r.completed,
    details: r.details, played_at: r.played_at,
  }
}

async function pushToServer(rows) {
  if (!supabase || !currentUserId || !rows.length) return false
  const userId = currentUserId
  const { error } = await supabase
    .from('game_results')
    .upsert(rows.map(r => toServerRow(r, userId)), { onConflict: 'user_id,client_id', ignoreDuplicates: true })
  if (error) { console.warn('[orbis] result sync failed', error.message); return false }

  if (userId !== currentUserId) return true
  const ids = new Set(rows.map(r => r.client_id))
  writeKey(storeKey(), readKey(storeKey()).map(r => ids.has(r.client_id) ? { ...r, synced: true } : r))
  return true
}

/**
 * Called by AuthContext whenever the signed-in user changes.
 * Uploads guest results, then pulls the account's full history into the local cache.
 */
export async function setResultsUser(userId) {
  // Supabase re-announces the same user on every token refresh and when the tab regains focus;
  // flushing then would cut a running game in two (148/196 saved, then 1/196). Only a real
  // change of user closes the open games.
  if (userId === currentUserId) return
  flushSessions()
  currentUserId = userId ?? null
  emit()
  if (!userId || !supabase) return

  // 1. Merge guest results into the account
  const guest = readKey(GUEST_KEY)
  if (guest.length) {
    const ok = await pushToServer(guest)
    if (ok) localStorage.removeItem(GUEST_KEY)
  }

  // 2. Pull the account history
  const { data, error } = await supabase
    .from('game_results')
    .select('client_id, mode, score, correct, total, duration_ms, completed, details, played_at')
    .eq('user_id', userId)
    .order('played_at', { ascending: false })
    .limit(MAX_LOCAL)
  if (error) { console.warn('[orbis] history fetch failed', error.message); return }
  if (userId !== currentUserId) return

  const server  = (data ?? []).map(r => ({ ...r, synced: true }))
  const known   = new Set(server.map(r => r.client_id))
  const pending = readKey(userKey(userId)).filter(r => !r.synced && !known.has(r.client_id))
  const merged  = [...pending, ...server].sort((a, b) => b.played_at.localeCompare(a.played_at))
  writeKey(userKey(userId), merged)
  emit()

  // 3. Retry anything that never made it up
  if (pending.length) pushToServer(pending)
}

/** Leaderboard rows from the server (best score per user). */
/** The weekly board: points across all games since Monday 00:00 UTC (see supabase/weekly.sql). */
export async function fetchWeeklyBoard(limit = 50) {
  if (!supabase) return { rows: [], error: 'offline' }
  const { data, error } = await supabase.rpc('get_weekly_board', { p_limit: limit })
  return { rows: data ?? [], error: error?.message ?? null, missing: /get_weekly_board|PGRST202|function/i.test(error?.message ?? '') }
}

/** "Don't Say What I Say": matches won per player since a date (null = all time) */
export async function fetchDuelBoard(sinceISO = null, limit = 50) {
  if (!supabase) return { rows: [], error: 'offline' }
  const { data, error } = await supabase.rpc('get_duel_board', { p_since: sinceISO, p_limit: limit })
  return { rows: data ?? [], error: error?.message ?? null, missing: /get_duel_board|PGRST202|function/i.test(error?.message ?? '') }
}

export async function fetchLeaderboard(mode, period = 'all', sinceISO = null) {
  if (!supabase) return { rows: [], error: 'offline' }
  const since = sinceISO ? sinceISO : period === 'week'
    ? new Date(Date.now() - 7 * 864e5).toISOString()
    : period === 'today'
    ? new Date(new Date().setHours(0, 0, 0, 0)).toISOString()
    : null
  const { data, error } = await supabase.rpc('get_leaderboard', { p_mode: mode, p_since: since, p_limit: 50 })
  return { rows: data ?? [], error: error?.message ?? null }
}
