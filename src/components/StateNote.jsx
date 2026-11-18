import Icon from './Icon'
import { t } from '../i18n'

/**
 * One look for every "loading…", "nothing here yet" and "couldn't load" message on the site.
 *   kind:    'loading' | 'empty' | 'error'
 *   action:  optional { label, onClick } button under the text (errors default to "Try again")
 *   compact: smaller, left-aligned — for messages inside a card or a list
 */
export default function StateNote({ kind = 'empty', children, action, compact = false }) {
  const act = action ?? (kind === 'error' ? { label: t('Try again'), onClick: () => window.location.reload() } : null)
  return (
    <div className={`state-note state-${kind}${compact ? ' compact' : ''}`} role={kind === 'error' ? 'alert' : 'status'}>
      {kind === 'loading'
        ? <span className="state-spinner" aria-hidden="true" />
        : <span className="state-icon" aria-hidden="true"><Icon name={kind === 'error' ? 'eyeOff' : 'search'} size={compact ? 16 : 20} /></span>}
      <span className="state-text">{children}</span>
      {act && <button className="tq-btn state-action" onClick={act.onClick}>{act.label}</button>}
    </div>
  )
}
