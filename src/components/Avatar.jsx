import { useEffect, useState } from 'react'
import { avatarSeed, cachedAvatar, drawAvatar } from '../utils/avatar'

// a 1×1 transparent pixel while the face is being drawn (the CSS background shows through)
const BLANK = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='

/**
 * A player's avatar. `value` is profiles.avatar_url, `name` the username (used when nothing
 * was picked). Renders a plain <img>, so the existing per-place CSS keeps sizing it.
 * `own`: the signed-in player's avatar, remembered on this device for instant display.
 */
export default function Avatar({ value, name, className = '', seed: forcedSeed, own = false }) {
  const isPhoto = !forcedSeed && typeof value === 'string' && value.startsWith('https://')
  const seed = isPhoto ? null : (forcedSeed ?? avatarSeed(value, name))
  const [src, setSrc] = useState(() => (seed ? cachedAvatar(seed) : null))

  useEffect(() => {
    if (!seed) return
    let live = true
    setSrc(cachedAvatar(seed))
    drawAvatar(seed, { own }).then(u => { if (live) setSrc(u) }).catch(() => {})
    return () => { live = false }
  }, [seed, own])

  if (isPhoto) return <img className={className} src={value} alt="" referrerPolicy="no-referrer" />
  return <img className={`${className}${src ? '' : ' avatar-loading'}`} src={src ?? BLANK} alt="" draggable="false" />
}
