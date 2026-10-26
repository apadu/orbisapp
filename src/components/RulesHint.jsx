import { useEffect, useRef, useState } from 'react'
import { getRules, subscribeRules } from '../utils/rulesStore'
import { t } from '../i18n'

/** ⓘ button that pops up the current game's rules. */
export default function RulesHint({ className = '' }) {
  const [rules, setRulesState] = useState(getRules)
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => subscribeRules(r => { setRulesState(r); setOpen(false) }), [])
  useEffect(() => {
    if (!open) return
    const close = e => { if (!ref.current?.contains(e.target)) setOpen(false) }
    const esc = e => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('mousedown', close)
    window.addEventListener('keydown', esc)
    return () => { window.removeEventListener('mousedown', close); window.removeEventListener('keydown', esc) }
  }, [open])

  if (!rules?.rules?.length) return null

  return (
    <div className={`rules-hint ${className}`} ref={ref}>
      <button className="rules-hint-btn" onClick={() => setOpen(o => !o)} aria-expanded={open} title={t('How to play')}>ⓘ</button>
      {open && (
        <div className="rules-hint-pop" role="dialog">
          <div className="rules-hint-head">{rules.icon} {rules.title}</div>
          {rules.desc && <p className="rules-hint-desc">{rules.desc}</p>}
          <ul>{rules.rules.map((r, i) => <li key={i}>{r}</li>)}</ul>
        </div>
      )}
    </div>
  )
}
