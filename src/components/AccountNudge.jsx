import { useEffect, useState } from 'react'
import { useAuth } from '../auth/AuthContext'
import { loadResults, subscribeResults } from '../utils/results'
import { streakInfo } from '../utils/dailyChallenges'
import { t } from '../i18n'
import Icon from './Icon'

/**
 * For guests who have started playing: their progress lives only in this browser.
 * A gentle "save it with a free account" after a few finished games (their games move to the
 * account when they sign up). "Later" hides it until 10 more games and 3 more days have passed.
 */
const SHOW_FROM = 3                  // finished games
const KEY = 'geofeverr-nudge'        // { games, at } when dismissed
const AGAIN_AFTER_GAMES = 10
const AGAIN_AFTER_MS = 3 * 864e5

function counts() {
  const R = loadResults()
  return { games: R.filter(r => r.completed).length, streak: streakInfo(R).streak }
}
function dismissed(games) {
  try {
    const d = JSON.parse(localStorage.getItem(KEY) ?? 'null')
    return !!d && (games < d.games + AGAIN_AFTER_GAMES || Date.now() - d.at < AGAIN_AFTER_MS)
  } catch { return false }
}

export default function AccountNudge({ compact = false }) {
  const { user, ready, backendEnabled, openAuth } = useAuth()
  const [c, setC] = useState(counts)
  const [hidden, setHidden] = useState(() => dismissed(counts().games))
  useEffect(() => subscribeResults(() => setC(counts())), [])

  if (!backendEnabled || !ready || user || hidden || c.games < SHOW_FROM) return null
  const later = () => {
    try { localStorage.setItem(KEY, JSON.stringify({ games: c.games, at: Date.now() })) } catch { /* private mode */ }
    setHidden(true)
  }
  return (
    <div className={`acct-nudge${compact ? ' compact' : ''}`} role="note">
      <span className="acct-nudge-icon"><Icon name="flame" size={20} /></span>
      <div className="acct-nudge-text">
        <b>{c.streak > 1
          ? t('{n} games and a {s}-day streak — don\'t lose them!', { n: c.games, s: c.streak })
          : t('{n} games played — don\'t lose them!', { n: c.games })}</b>
        <span>{t('Your progress is only saved in this browser. A free account keeps it on every device and puts you on the leaderboards.')}</span>
      </div>
      <div className="acct-nudge-btns">
        <button className="acct-nudge-go" onClick={openAuth}>{t('Save my progress')}</button>
        <button className="acct-nudge-later" onClick={later}>{t('Later')}</button>
      </div>
    </div>
  )
}
