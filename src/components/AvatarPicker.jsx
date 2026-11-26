import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../auth/AuthContext'
import { AVATAR_PREFIX, avatarSeed, randomSeed } from '../utils/avatar'
import Avatar from './Avatar'
import Icon from './Icon'
import { t } from '../i18n'

const COUNT = 12

/** Pick an avatar: a grid of faces, "show others" for a new batch, save to the profile. */
export default function AvatarPicker({ onClose }) {
  const auth = useAuth()
  const current = avatarSeed(auth.profile?.avatar_url, auth.profile?.username)
  const [batch, setBatch] = useState(0)
  const seeds = useMemo(
    () => batch === 0 ? [current, ...Array.from({ length: COUNT - 1 }, randomSeed)] : Array.from({ length: COUNT }, randomSeed),
    [batch, current],
  )
  const [chosen, setChosen] = useState(current)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const esc = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', esc)
    return () => window.removeEventListener('keydown', esc)
  }, [onClose])

  const save = async () => {
    if (chosen === current) { onClose(); return }
    setBusy(true); setError(null)
    const { error: e } = await supabase.rpc('set_my_avatar', { p_avatar: AVATAR_PREFIX + chosen })
    setBusy(false)
    if (e) { setError(t('Could not save. Check your connection and try again.')); return }
    await auth.refreshProfile()
    onClose()
  }

  return (
    <div className="cl-backdrop" onMouseDown={onClose}>
      <div className="cl av-picker" role="dialog" aria-modal="true" aria-label={t('Choose your avatar')} onMouseDown={e => e.stopPropagation()}>
        <div className="pp-account-head">
          <h3>{t('Choose your avatar')}</h3>
          <button className="pp-account-close" onClick={onClose} aria-label={t('Close')}>✕</button>
        </div>
        <div className="av-preview"><Avatar className="av-big" seed={chosen} /></div>
        <div className="av-grid" role="radiogroup" aria-label={t('Avatars')}>
          {seeds.map(s => (
            <button key={s} role="radio" aria-checked={s === chosen} className={`av-opt${s === chosen ? ' active' : ''}`} onClick={() => setChosen(s)}>
              <Avatar seed={s} />
            </button>
          ))}
        </div>
        {error && <p className="av-error">{error}</p>}
        <div className="av-actions">
          <button className="tq-btn" onClick={() => setBatch(b => b + 1)}><Icon name="shuffle" size={15} /> {t('Show others')}</button>
          <button className="tq-btn tq-btn-primary" onClick={save} disabled={busy}>{busy ? t('Saving…') : t('Save')}</button>
        </div>
      </div>
    </div>
  )
}
