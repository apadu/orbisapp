import { useState } from 'react'
import { flagCode, localFlagSrc, remoteFlagSrc } from '../utils/flags'

/**
 * Real flag image: our own /flags/<code>.svg first (see `npm run fetch-maps`),
 * then flagcdn.com, then the emoji as a last resort.
 */
export default function FlagImg({ emoji, className = '', title }) {
  const code = flagCode(emoji)
  const [stage, setStage] = useState(0) // 0 local · 1 remote · 2 emoji
  if (!code || stage === 2) return <span className={`flag-emoji-fallback ${className}`} title={title}>{emoji}</span>
  return (
    <img
      className={`flag-img ${className}`}
      src={stage === 0 ? localFlagSrc(code) : remoteFlagSrc(code)}
      alt={title ?? ''}
      title={title}
      loading="lazy"
      draggable={false}
      onError={() => setStage(s => s + 1)}
    />
  )
}
