import { t } from '../i18n'
import { plain } from '../utils/plain'

/** "Play untimed?" — the confirm shown before the ∞ button stops the clock (no XP from then on). */
export default function UntimedConfirm({ onCancel, onConfirm }) {
  return (
    <div className="tq-modal-backdrop" onClick={onCancel}>
      <div className="tq-modal" role="dialog" aria-modal="true" onClick={e => e.stopPropagation()}>
        <div className="tq-modal-icon">∞</div>
        <h3>{t('Play untimed?')}</h3>
        <ul>
          <li>{plain(t('⏸ The clock stops for the rest of this game.'))}</li>
          <li>{plain(t('🔒 You can\'t turn it back on until you start a new game.'))}</li>
          <li>{plain(t('🚫 This game earns'))} <strong>{t('no XP')}</strong> {t('and won\'t count for leaderboards.')}</li>
        </ul>
        <div className="tq-modal-btns">
          <button className="tq-btn" onClick={onCancel}>{t('Keep the timer')}</button>
          <button className="tq-btn tq-btn-warn" onClick={onConfirm} autoFocus>{t('Yes, play untimed')}</button>
        </div>
      </div>
    </div>
  )
}
