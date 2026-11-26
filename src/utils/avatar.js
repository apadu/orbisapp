/**
 * Player avatars — DiceBear "Adventurer" by Lisa Wischofsky (CC BY 4.0), drawn in the browser.
 *
 * What profiles.avatar_url holds:
 *   'adv:<seed>'   an avatar the player picked (the seed always draws the same face)
 *   'https://…'    an old Google profile picture (Google sign-in has been removed)
 *   null           nothing picked yet: a face is drawn from the username
 *
 * The drawing code is loaded only when the first avatar is shown, so it stays out of the
 * main bundle. Drawn avatars are cached by seed.
 */
export const AVATAR_PREFIX = 'adv:'
export const SEED_RE = /^[A-Za-z0-9_-]{1,32}$/

const BACKGROUNDS = ['2b3a5c', '3a2f4f', '1f3b4d', '4a3426', '2f4a3a', '4a2f38']
const cache = new Map()
let lib = null
const load = () => (lib ??= Promise.all([import('@dicebear/core'), import('@dicebear/adventurer')])
  .then(([core, style]) => ({ create: core.createAvatar, style })))

/** The seed to draw for a stored value; players who never picked get one from their name. */
export function avatarSeed(value, name) {
  if (typeof value === 'string' && value.startsWith(AVATAR_PREFIX)) {
    const seed = value.slice(AVATAR_PREFIX.length)
    if (SEED_RE.test(seed)) return seed
  }
  return (name || 'guest').toLowerCase()
}

// The signed-in player's own avatar is also kept in localStorage, so the header can show it
// on every visit without downloading the drawing code (~100 kB).
const OWN_KEY = 'geofeverr-own-avatar'
function readOwn(seed) {
  try { const o = JSON.parse(localStorage.getItem(OWN_KEY)); return o?.seed === seed ? o.uri : null } catch { return null }
}

export const cachedAvatar = (seed) => cache.get(seed) ?? readOwn(seed)

export async function drawAvatar(seed, { own = false } = {}) {
  const ready = cachedAvatar(seed)
  if (ready) return ready
  const { create, style } = await load()
  const uri = create(style, { seed, backgroundColor: BACKGROUNDS }).toDataUri()
  cache.set(seed, uri)
  if (own) try { localStorage.setItem(OWN_KEY, JSON.stringify({ seed, uri })) } catch { /* storage full or blocked */ }
  return uri
}

export const randomSeed = () => Math.random().toString(36).slice(2, 10)
