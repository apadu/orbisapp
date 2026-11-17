/**
 * Sharing results. SITE_URL is the address links point to: set VITE_SITE_URL once the site
 * has its own domain (e.g. https://orbis.ro); until then it's wherever the page is served.
 */
export const SITE_URL = (import.meta.env?.VITE_SITE_URL || (typeof window !== 'undefined' ? window.location.origin : '')).replace(/\/$/, '')
export const siteLink = (path = '/') => `${SITE_URL}${path}`

/**
 * Phones: the system share sheet (WhatsApp, Messenger…). Elsewhere: copy to the clipboard.
 * → 'shared' | 'copied' | 'cancelled' | 'failed'
 */
export async function shareText(text) {
  const touch = typeof window !== 'undefined' && window.matchMedia?.('(pointer: coarse)').matches
  if (touch && navigator.share) {
    try { await navigator.share({ text }); return 'shared' } catch (e) { if (e?.name === 'AbortError') return 'cancelled' }
  }
  try { await navigator.clipboard.writeText(text); return 'copied' } catch { return 'failed' }
}
