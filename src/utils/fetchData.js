import { DATA_SOURCES } from '../data/sources'

/**
 * Fetch a data file from our own server (/data/…) and fall back to the
 * original remote URL if it isn't there. Returns a normal Response.
 */
export async function fetchData(key) {
  const src = DATA_SOURCES[key]
  if (!src) throw new Error(`Unknown data source: ${key}`)
  const base = (import.meta.env?.BASE_URL ?? '/').replace(/\/$/, '')
  try {
    const local = await fetch(`${base}/data/${src.file}`)
    // A dev server answers missing files with index.html — make sure it's really JSON
    const type = local.headers.get('content-type') ?? ''
    if (local.ok && !type.includes('text/html')) return local
  } catch { /* fall through to remote */ }
  return fetch(src.url)
}
