import { useEffect, useRef } from 'react'
import { t } from '../i18n'

/** "Leave this game?" — shown before navigating away from a game in progress. */
export default function ConfirmLeave({ open, onStay, onLeave }) {
  const stayRef = useRef(null)
  useEffect(() => {
    if (!open) return
    stayRef.current?.focus()
    const onKey = (e) => { if (e.key === 'Escape') { e.preventDefault(); onStay() } }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onStay])
  if (!open) return null
  return (
    <div className="cl-backdrop" onMouseDown={onStay}>
      <div className="cl" role="alertdialog" aria-modal="true" aria-labelledby="cl-title" onMouseDown={e => e.stopPropagation()}>
        <div className="cl-icon">🚪</div>
        <h3 id="cl-title">{t('Leave this game?')}</h3>
        <p>{t('Your game is still in progress. If you leave now it is saved as unfinished.')}</p>
        <div className="cl-btns">
          <button ref={stayRef} className="arc-primary" onClick={onStay}>{t('Keep playing')}</button>
          <button className="arc-secondary" onClick={onLeave}>{t('Leave game')}</button>
        </div>
      </div>
    </div>
  )
}
