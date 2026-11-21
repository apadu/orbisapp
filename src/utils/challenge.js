/**
 * "Challenge a friend": a link that opens the same quiz with the challenger's result in it.
 *
 *   /quiz/flags-30?vs=<payload>   payload = base64url JSON
 *     { m: mode, n: name, s: score, t: total, ms: time taken (optional),
 *       r: region (optional), z: rows in the game (optional), seed: random selection (optional) }
 *
 * No server needed: everything travels in the link. The link is read once when the site
 * loads; the quiz with that id then shows the challenge and, at the end, who won.
 */
import { siteLink } from './share'

const b64 = (s) => btoa(unescape(encodeURIComponent(s))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
const unb64 = (s) => decodeURIComponent(escape(atob(s.replace(/-/g, '+').replace(/_/g, '/'))))

function read() {
  if (typeof window === 'undefined') return null
  try {
    const raw = new URLSearchParams(window.location.search).get('vs')
    if (!raw) return null
    const c = JSON.parse(unb64(raw))
    if (typeof c?.m !== 'string' || !Number.isFinite(c.s) || !Number.isFinite(c.t) || c.t <= 0 || c.s < 0 || c.s > c.t) return null
    c.n = String(c.n ?? '').slice(0, 24).trim() || null
    // Clean the address bar: the challenge lives in memory from here on
    const url = new URL(window.location.href)
    url.searchParams.delete('vs')
    window.history.replaceState(window.history.state, '', url.pathname + url.search + url.hash)
    return c
  } catch { return null }
}

let active = read()
const listeners = new Set()

/** The challenge for this quiz, if the site was opened from a challenge link for it. */
export const challengeFor = (mode) => (active && active.m === mode ? active : null)
export function dismissChallenge() { active = null; listeners.forEach(f => f()) }
export function onChallengeChange(f) { listeners.add(f); return () => listeners.delete(f) }

/** The link to send: same quiz (and same random selection), with this result in it. */
export function challengeLink(mode, { name, score, total, ms, region, size, seed }) {
  const payload = { m: mode, n: name || undefined, s: score, t: total }
  if (ms) payload.ms = Math.round(ms)
  if (region && region !== 'World') payload.r = region
  if (size) payload.z = size
  if (seed != null) payload.seed = seed
  return `${siteLink(`/quiz/${mode}`)}?vs=${b64(JSON.stringify(payload))}`
}

/** Who won: score first, then time (when both have one). → 'win' | 'lose' | 'tie' */
export function verdict(mine, theirs) {
  if (mine.score !== theirs.s) return mine.score > theirs.s ? 'win' : 'lose'
  if (mine.ms && theirs.ms && Math.abs(mine.ms - theirs.ms) >= 1000) return mine.ms < theirs.ms ? 'win' : 'lose'
  return 'tie'
}

// The name to sign challenges with (guests type it once)
const NAME_KEY = 'geofeverr-challenge-name'
export const savedName = () => { try { return localStorage.getItem(NAME_KEY) ?? '' } catch { return '' } }
export const saveName = (n) => { try { localStorage.setItem(NAME_KEY, n) } catch {} }
