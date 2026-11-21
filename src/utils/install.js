/**
 * Installing GeoFeverr as an app. Chrome/Edge/Android fire `beforeinstallprompt`: we keep it
 * and show "Install app" in the menu. iPhone/iPad Safari has no prompt, so there we explain
 * Share → Add to Home Screen. Already installed (standalone) → nothing to show.
 */
let deferred = null
const listeners = new Set()
const notify = () => listeners.forEach(f => f())

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); deferred = e; notify() })
  window.addEventListener('appinstalled', () => { deferred = null; notify() })
  // Offline play: register the service worker once the page has loaded (production only)
  if ('serviceWorker' in navigator && import.meta.env.PROD) {
    const register = () => navigator.serviceWorker.register('/sw.js').catch(() => {})
    // this module loads after the dictionaries, often once the page has already finished loading
    if (document.readyState === 'complete') setTimeout(register, 1000)
    else window.addEventListener('load', register)
  }
}

export const isStandalone = () => typeof window !== 'undefined' &&
  (window.matchMedia?.('(display-mode: standalone)').matches || window.navigator.standalone === true)
export const isIos = () => typeof navigator !== 'undefined' && /iphone|ipad|ipod/i.test(navigator.userAgent) && !/crios|fxios/i.test(navigator.userAgent)

/** 'prompt' (we can show the browser's install dialog) | 'ios' (show instructions) | null */
export const installMode = () => (isStandalone() ? null : deferred ? 'prompt' : isIos() ? 'ios' : null)

export async function promptInstall() {
  if (!deferred) return false
  deferred.prompt()
  const { outcome } = await deferred.userChoice.catch(() => ({ outcome: 'dismissed' }))
  deferred = null
  notify()
  return outcome === 'accepted'
}
export const onInstallChange = (f) => { listeners.add(f); return () => listeners.delete(f) }
