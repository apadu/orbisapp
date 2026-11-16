import { supabase } from '../lib/supabase'

/**
 * Sends crashes and uncaught errors to Supabase (table public.client_errors).
 * Guests report too (user_id null). Safe to call anywhere — never throws.
 *
 * Kept quiet on purpose: the same error is sent once per page load, at most
 * MAX_PER_PAGE reports per page load, and known browser/extension noise is skipped.
 */

const MAX_PER_PAGE = 10
const sent = new Set()
let count = 0

// Set at build time from Vercel's commit SHA (vite.config.js); 'dev' locally
const APP_VERSION = typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : 'dev'

const NOISE = [
  /ResizeObserver loop/i,
  /^Script error\.?$/i,                 // cross-origin script, no details available
  /chrome-extension:|moz-extension:|safari-extension:/i,
  /Non-Error promise rejection captured/i,
  /AbortError/i,
]

const clip = (s, n) => (s == null ? null : String(s).slice(0, n))

export function reportError(kind, error, extra = {}) {
  try {
    if (!supabase || import.meta.env.DEV) return
    const message = clip(error?.message ?? error ?? 'Unknown error', 500)
    const stack = clip(error?.stack, 4000)
    if (NOISE.some(re => re.test(message) || (stack && re.test(stack)))) return
    const key = `${kind}|${message}`
    if (sent.has(key) || count >= MAX_PER_PAGE) return
    sent.add(key); count++

    const send = async () => {
      let userId = null
      try { userId = (await supabase.auth.getSession()).data.session?.user?.id ?? null } catch {}
      await supabase.from('client_errors').insert({
        kind,
        message,
        stack,
        component_stack: clip(extra.componentStack, 4000),
        path: clip(window.location.pathname + window.location.search, 300),
        user_agent: clip(navigator.userAgent, 300),
        app_version: clip(APP_VERSION, 64),
        user_id: userId,
      })
    }
    send().catch(() => {})
  } catch {}
}

/**
 * After a new deploy, a tab that's still open asks for old lazy chunks that no longer
 * exist ("Failed to fetch dynamically imported module"). Reload once to pick up the
 * new build instead of crashing; remember it so we never loop.
 */
const RELOAD_KEY = 'orbis.chunkReloadAt'
function reloadForNewBuild(error) {
  let last = 0
  try { last = Number(sessionStorage.getItem(RELOAD_KEY)) || 0 } catch {}
  if (Date.now() - last < 60_000) { reportError('chunk', error); return false }
  try { sessionStorage.setItem(RELOAD_KEY, String(Date.now())) } catch {}
  window.location.reload()
  return true
}

const isChunkError = (e) => /Failed to fetch dynamically imported module|Importing a module script failed|error loading dynamically imported module/i.test(String(e?.message ?? e))

export function installGlobalErrorHandlers() {
  if (typeof window === 'undefined') return
  window.addEventListener('vite:preloadError', (e) => {
    if (reloadForNewBuild(e.payload)) e.preventDefault()
  })
  window.addEventListener('error', (e) => {
    if (!e.error && !e.message) return      // resource load errors (img/script tags) — not code errors
    reportError('error', e.error ?? e.message)
  })
  window.addEventListener('unhandledrejection', (e) => {
    if (isChunkError(e.reason) && reloadForNewBuild(e.reason)) return
    reportError('promise', e.reason)
  })
}

export { isChunkError, reloadForNewBuild }
