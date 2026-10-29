import { useEffect, useMemo, useRef, useState } from 'react'
import { useAuth } from '../auth/AuthContext'
import { loadResults, subscribeResults } from '../utils/results'
import { levelForXp, computeXp } from '../utils/profileData'
import { t, lang, setLang, LANGS } from '../i18n'

function useLevel() {
  const [results, setResults] = useState(loadResults)
  useEffect(() => subscribeResults(() => setResults(loadResults())), [])
  return useMemo(() => {
    const xp = computeXp(results)
    return { ...levelForXp(xp), xp }
  }, [results])
}

/**
 * Top-right cluster: level chip + avatar with a dropdown
 * (profile, sound, theme, bug report, sign in/out).
 */
export default function UserMenu({ displayName, onProfile, soundEnabled, onToggleSound, onOpenInfo }) {
  const auth = useAuth()
  const level = useLevel()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    const close = e => { if (!ref.current?.contains(e.target)) setOpen(false) }
    const esc = e => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('mousedown', close)
    window.addEventListener('keydown', esc)
    return () => { window.removeEventListener('mousedown', close); window.removeEventListener('keydown', esc) }
  }, [open])

  const item = (fn) => () => { setOpen(false); fn() }

  return (
    <div className="um" ref={ref}>
      <button className="um-level" onClick={onProfile} title={t('{v} XP to level {v2}', { v: level.next - level.xp, v2: level.level + 1 })}>
        <span className="um-level-num">{t('Lv')} {level.level}</span>
        <span className="um-level-bar"><span style={{ width: `${level.pct}%` }} /></span>
      </button>

      {!auth.user && auth.backendEnabled && (
        <button className="um-signin" onClick={auth.openAuth}>{t('Sign in')}</button>
      )}

      <button className={`um-avatar${open ? ' open' : ''}`} onClick={() => setOpen(o => !o)} aria-haspopup="menu" aria-expanded={open}>
        {auth.profile?.avatar_url
          ? <img src={auth.profile.avatar_url} alt="" referrerPolicy="no-referrer" />
          : <span className="um-avatar-letter">{displayName.charAt(0).toUpperCase()}</span>}
        <span className="um-avatar-name">{displayName}</span>
        <span className="um-caret">▾</span>
      </button>

      {open && (
        <div className="um-menu" role="menu">
          <div className="um-menu-head">
            <strong>{displayName}</strong>
            <span>{auth.user ? auth.user.email : t('Playing as guest')}</span>
          </div>
          <button role="menuitem" onClick={item(onProfile)}>{t('👤 Profile & stats')}</button>
          <button role="menuitem" onClick={item(onToggleSound)}>{soundEnabled ? t('🔊 Sound on') : t('🔇 Sound off')}</button>
          <div className="um-lang" role="group" aria-label={t('Language')}>
            {LANGS.map(l => (
              <button key={l.id} className={lang === l.id ? 'active' : ''} onClick={() => { if (lang !== l.id) setLang(l.id) }}>
                {l.flag} {l.id.toUpperCase()}
              </button>
            ))}
          </div>
          {onOpenInfo && <button role="menuitem" onClick={item(() => onOpenInfo('privacy'))}>{t('🔒 Privacy & terms')}</button>}
          <a role="menuitem" href="https://forms.gle/hDpMyhns9PD7ghdBA" target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}>{t('🐛 Report a bug')}</a>
          <div className="um-sep" />
          {auth.user
            ? <button role="menuitem" onClick={item(auth.signOut)}>{t('↩ Sign out')}</button>
            : auth.backendEnabled && <button role="menuitem" onClick={item(auth.openAuth)}>{t('🔑 Sign in')}</button>}
        </div>
      )}
    </div>
  )
}
