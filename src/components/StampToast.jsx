import { useEffect, useState } from 'react'
import { startStampWatch, subscribeStampToasts } from '../utils/stampWatch'
import { STAMP_BY_ID } from '../utils/stamps'
import Stamp from './Stamp'
import { t } from '../i18n'

const INK = () => [t('black ink'), t('blue ink'), t('red ink with gold foil')]

/** "New stamp in your passport" — shown for a few seconds after earning or upgrading one. */
export default function StampToast() {
  const [toast, setToast] = useState(null)

  useEffect(() => {
    startStampWatch()
    return subscribeStampToasts(e => setToast({ ...e, key: Date.now() }))
  }, [])

  useEffect(() => {
    if (!toast) return
    const id = setTimeout(() => setToast(null), 6000)
    return () => clearTimeout(id)
  }, [toast])

  const s = toast && STAMP_BY_ID[toast.stamp]
  if (!s) return null
  return (
    <div className="stamp-toast" role="status" key={toast.key} onClick={() => setToast(null)}>
      <span className="stamp-toast-paper"><Stamp shape={s.shape} icon={s.icon} kicker={s.kicker()} tier={toast.tier} rotate={-8} size={64} title={s.label()} /></span>
      <span className="stamp-toast-text">
        <strong>{toast.upgraded ? t('Your stamp got a new ink!') : t('New stamp in your passport!')}</strong>
        <span>{s.label()} · {INK()[toast.tier - 1]}</span>
      </span>
    </div>
  )
}
