import { useEffect, useState } from 'react'
import { t } from '../../i18n'

const KEY = 'geofeverr-passport-opened'
const seen = () => { try { return localStorage.getItem(KEY) === '1' } catch { return true } }

/**
 * The passport's cover, shown over the identity page the first time the profile is opened.
 * It swings open like a book (by itself after a moment, or on click); after that the profile
 * opens straight on the identity page.
 */
export default function PassportCover({ children }) {
  const [state, setState] = useState(() => (seen() ? 'gone' : 'closed'))   // closed · opening · gone

  useEffect(() => {
    if (state !== 'closed') return
    const id = setTimeout(() => setState('opening'), 1600)
    return () => clearTimeout(id)
  }, [state])

  useEffect(() => {
    if (state !== 'opening') return
    try { localStorage.setItem(KEY, '1') } catch { /* private mode */ }
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    const id = setTimeout(() => setState('gone'), reduce ? 0 : 1100)
    return () => clearTimeout(id)
  }, [state])

  return (
    <div className={`pbook${state !== 'gone' ? ' pbook-shut' : ''}`}>
      {children}
      {state !== 'gone' && (
        <button className={`pcover${state === 'opening' ? ' open' : ''}`} onClick={() => setState('opening')} aria-label={t('Open your passport')}>
          <span className="pcover-face">
            <span className="pcover-title">GEOFEVERR</span>
            <svg className="pcover-globe" viewBox="0 0 100 100" aria-hidden="true">
              <circle cx="50" cy="50" r="34" fill="none" stroke="currentColor" strokeWidth="2.6" />
              <ellipse cx="50" cy="50" rx="14" ry="34" fill="none" stroke="currentColor" strokeWidth="2" />
              <path d="M16 50h68M21 33h58M21 67h58" fill="none" stroke="currentColor" strokeWidth="2" />
              <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2 3" />
            </svg>
            <span className="pcover-doc">{t('PASSPORT')}</span>
            <span className="pcover-sub">PASSPORT · PASAPORTE</span>
            <span className="pcover-chip" aria-hidden="true" />
            <span className="pcover-hint">{t('Tap to open')}</span>
          </span>
        </button>
      )}
    </div>
  )
}
