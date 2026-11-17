import { useEffect } from 'react'
import { t } from '../i18n'
import { plain } from '../utils/plain'

/**
 * Quizzes open straight on the board: the empty table or map is visible, with
 * the options, a Start button (Enter) and "just start typing" in the answer bar.
 */

/** Enter = start · typing a letter anywhere = start with that letter. */
export function useTypeToStart(enabled, begin) {
  useEffect(() => {
    if (!enabled) return
    const onKey = (e) => {
      const el = document.activeElement
      const tag = el?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || el?.isContentEditable || e.metaKey || e.ctrlKey || e.altKey) return
      if (document.querySelector('[role="dialog"]')) return
      if (e.key === 'Enter') { if (tag === 'BUTTON' || tag === 'A') return; e.preventDefault(); begin() }
      else if (e.key.length === 1 && /\p{L}/u.test(e.key)) { e.preventDefault(); begin(e.key) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }) // re-bind each render so `begin` sees fresh state
}

/** Compact option toggles shown above the answer bar before a game starts. */
export function ReadyOptions({ options, values, onChange }) {
  if (!options.length) return null
  return (
    <div className="qr-opts">
      {options.map(o => {
        const sel = o.choices.find(c => c.value === values[o.id])
        return (
          <div key={o.id} className="qr-opt">
            <span className="qr-opt-label">{o.label}</span>
            <div className="setup-seg" role="radiogroup" aria-label={o.label}>
              {o.choices.map(c => (
                <button
                  key={c.value}
                  role="radio"
                  aria-checked={values[o.id] === c.value}
                  className={`setup-seg-btn${values[o.id] === c.value ? ' active' : ''}`}
                  onClick={() => onChange({ ...values, [o.id]: c.value })}
                >
                  {plain(c.label)}
                </button>
              ))}
            </div>
            {sel?.hint && <span className="qr-hint">{sel.hint}</span>}
          </div>
        )
      })}
    </div>
  )
}

export function StartButton({ onClick }) {
  return (
    <button className="tq-btn tq-btn-primary qr-start" onClick={onClick}>
      {t('Start')} <kbd>{t('Enter')}</kbd>
    </button>
  )
}
