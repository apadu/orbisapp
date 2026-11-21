/*
 * GeoFeverr service worker: makes the site installable and playable offline.
 *  • pages        → network first, the saved copy when offline
 *  • /assets/*    → saved forever (file names change with every build)
 *  • /data, /flags, /icons → served from the saved copy, refreshed in the background
 *  • everything else (Supabase, other sites) → straight to the network, never saved
 */
const VERSION = 'v1'
// (responses are matched by address only: ignoreVary, so a preloaded copy still counts)
const CORE = `geofeverr-core-${VERSION}`
const RUNTIME = `geofeverr-runtime-${VERSION}`
const PRECACHE = ['/', '/manifest.webmanifest', '/icons/icon-192.png', '/icons/icon-512.png', '/icons/favicon-32.png']

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CORE).then(c => c.addAll(PRECACHE)).then(() => self.skipWaiting()))
})

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    const keep = new Set([CORE, RUNTIME])
    for (const k of await caches.keys()) if (!keep.has(k)) await caches.delete(k)
    await self.clients.claim()
  })())
})

async function networkFirstPage(req) {
  try {
    const res = await fetch(req)
    if (res.ok) (await caches.open(CORE)).put('/', res.clone())
    return res
  } catch {
    return (await caches.match('/', { ignoreVary: true })) ?? Response.error()
  }
}

async function cacheFirst(req) {
  const hit = await caches.match(req, { ignoreVary: true })
  if (hit) return hit
  const res = await fetch(req)
  if (res.ok) (await caches.open(RUNTIME)).put(req, res.clone())
  return res
}

async function staleWhileRevalidate(req, e) {
  const cache = await caches.open(RUNTIME)
  const hit = await cache.match(req, { ignoreVary: true })
  const fresh = fetch(req).then(res => { if (res.ok) cache.put(req, res.clone()); return res }).catch(() => null)
  if (hit) { e.waitUntil(fresh); return hit }
  return (await fresh) ?? Response.error()
}

self.addEventListener('fetch', (e) => {
  const req = e.request
  if (req.method !== 'GET') return
  const url = new URL(req.url)
  if (url.origin !== self.location.origin) return            // Supabase, avatars… untouched
  if (req.mode === 'navigate') { e.respondWith(networkFirstPage(req)); return }
  if (url.pathname.startsWith('/assets/')) { e.respondWith(cacheFirst(req)); return }
  if (/^\/(data|flags|icons)\//.test(url.pathname)) { e.respondWith(staleWhileRevalidate(req, e)) }
})
