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

/**
 * A game that starts on the first keystroke swaps its start screen for its own answer box a moment
 * later. Keys typed in between would be lost, so this hands them to that box once it appears.
 */
export function carryKeystrokes(ms = 1500) {
  const setValue = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set
  const target = () => [...document.querySelectorAll('input[type="text"], input:not([type])')]
    .find(el => !el.classList.contains('setup-input') && el.offsetParent !== null && !el.disabled)
  const onKey = (e) => {
    const el = target()
    if (!el || document.activeElement === el || e.metaKey || e.ctrlKey || e.altKey) return
    if (e.key.length === 1) {
      e.preventDefault()
      el.focus()
      setValue.call(el, el.value + e.key)
      el.dispatchEvent(new Event('input', { bubbles: true }))
    } else if (e.key === 'Backspace') {
      e.preventDefault()
      el.focus()
      setValue.call(el, el.value.slice(0, -1))
      el.dispatchEvent(new Event('input', { bubbles: true }))
    }
  }
  window.addEventListener('keydown', onKey, true)
  setTimeout(() => window.removeEventListener('keydown', onKey, true), ms)
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

export function StartButton({ onClick, label = 'Start' }) {
  return (
    <button className="tq-btn tq-btn-primary qr-start" onClick={onClick}>
      {t(label)} <kbd>{t('Enter')}</kbd>
    </button>
  )
}
