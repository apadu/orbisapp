import { supabase } from '../lib/supabase'
import { lang } from '../i18n'

/**
 * GeoFeverr's own anonymous page counter (table public.page_views), read by /admin.
 * No cookies, no IP, no fingerprint: just a random id per browser-tab session
 * (sessionStorage) so visits can be told apart from page views.
 * Off in dev and when the browser sends "Do Not Track".
 */

const SKEY = 'orbis.sid'
let lastPath = null
let firstView = true

function sessionId() {
  try {
    let id = sessionStorage.getItem(SKEY)
    if (!id) {
      id = (crypto.randomUUID?.() ?? `${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`).slice(0, 36)
      sessionStorage.setItem(SKEY, id)
    }
    return id
  } catch { return 'no-storage' }
}

function device() {
  const w = Math.min(window.screen?.width ?? window.innerWidth, window.innerWidth)
  const touch = navigator.maxTouchPoints > 0
  if (touch && w < 768) return 'mobile'
  if (touch && w < 1200) return 'tablet'
  return 'desktop'
}

// Only the site name of where the visitor came from (never the full URL), and only on
// the first page of a visit; links inside GeoFeverr itself don't count as referrers.
function referrerHost() {
  try {
    if (!document.referrer) return null
    const host = new URL(document.referrer).hostname.replace(/^www\./, '')
    return host === window.location.hostname.replace(/^www\./, '') ? null : host.slice(0, 120)
  } catch { return null }
}

export function trackPageView(path) {
  try {
    if (!supabase || import.meta.env.DEV) return
    if (navigator.doNotTrack === '1' || window.doNotTrack === '1') return
    if (path === lastPath) return
    lastPath = path
    const ref = firstView ? referrerHost() : null
    firstView = false

    const send = async () => {
      let userId = null
      try { userId = (await supabase.auth.getSession()).data.session?.user?.id ?? null } catch {}
      await supabase.from('page_views').insert({
        session_id: sessionId(),
        path: String(path).slice(0, 200),
        referrer_host: ref,
        device: device(),
        lang,
        user_id: userId,
      })
    }
    send().catch(() => {})
  } catch {}
}
