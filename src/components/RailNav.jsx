import { useEffect, useRef, useState } from 'react'
import { GAME_GROUPS, gamesInGroup, groupOf } from '../utils/gameRegistry'
import { PALETTE_SHORTCUT } from './CommandPalette'
import { t } from '../i18n'

// Quick links shown in the Quizzes flyout (the full list lives in the Quiz Hub)
const QUIZ_QUICK = ['quiz-hub', 'daily-quiz', 'country-wordle', 'higher-lower', 'true-false', 'connections', 'border-chain', 'flag', 'capital']

/**
 * Left rail: one button per category. Hover (or click) opens a flyout with that
 * category's games. Search sits on top (Ctrl/⌘ K).
 */
export default function RailNav({ mode, onOpen, onSearch, onHome }) {
  const [open, setOpen] = useState(null)       // group id
  const closeTimer = useRef(null)
  const activeGroup = groupOf(mode)

  const show = (g) => { clearTimeout(closeTimer.current); setOpen(g) }
  const hideSoon = () => { clearTimeout(closeTimer.current); closeTimer.current = setTimeout(() => setOpen(null), 220) }
  useEffect(() => () => clearTimeout(closeTimer.current), [])
  useEffect(() => {
    if (!open) return
    const esc = (e) => { if (e.key === 'Escape') setOpen(null) }
    window.addEventListener('keydown', esc)
    return () => window.removeEventListener('keydown', esc)
  }, [open])

  const items = open === 'quizzes'
    ? QUIZ_QUICK.map(id => gamesInGroup('quizzes').find(g => g.id === id)).filter(Boolean)
    : open ? gamesInGroup(open) : []
  const group = GAME_GROUPS.find(g => g.id === open)

  const pick = (id) => { setOpen(null); onOpen(id) }

  return (
    <div className="nrail-wrap" onMouseLeave={hideSoon} onMouseEnter={() => clearTimeout(closeTimer.current)}>
      <nav className="nrail" aria-label={t('Games')}>
        <button className="nrail-btn nrail-search" onClick={onSearch} title={`${t('Search games')} (${PALETTE_SHORTCUT})`}>
          <span className="nrail-icon">🔎</span>
          <span className="nrail-label">{t('Search')}</span>
        </button>
        <button className="nrail-btn" onClick={onHome} title={t('Home')}>
          <span className="nrail-icon">🏠</span>
          <span className="nrail-label">{t('Home')}</span>
        </button>
        <div className="nrail-sep" />
        {GAME_GROUPS.map(g => (
          <button
            key={g.id}
            className={`nrail-btn${activeGroup === g.id ? ' active' : ''}${open === g.id ? ' open' : ''}`}
            style={{ '--cat': g.color }}
            onMouseEnter={() => g.id !== 'learn' && show(g.id)}
            onFocus={() => g.id !== 'learn' && show(g.id)}
            onClick={() => g.id === 'learn' ? pick('learn') : setOpen(o => (o === g.id ? null : g.id))}
            aria-expanded={g.id !== 'learn' ? open === g.id : undefined}
            title={g.label}
          >
            <span className="nrail-icon">{g.icon}</span>
            <span className="nrail-label">{g.short}</span>
          </button>
        ))}
      </nav>

      {open && group && (
        <div className="nrail-fly" style={{ '--cat': group.color }} role="menu">
          <div className="nrail-fly-head">
            <span>{group.icon} {group.label}</span>
            <span className="nrail-fly-count">{gamesInGroup(open).length}</span>
          </div>
          <div className="nrail-fly-list">
            {items.map(g => (
              <button key={g.id} role="menuitem" className={`nrail-fly-item${mode === g.id ? ' active' : ''}`} onClick={() => pick(g.id)}>
                <span className="nrail-fly-icon">{g.icon}</span>
                <span className="nrail-fly-text">
                  <span className="nrail-fly-label">{g.label}</span>
                  <span className="nrail-fly-desc">{g.desc}</span>
                </span>
              </button>
            ))}
          </div>
          {open === 'quizzes' && (
            <button className="nrail-fly-more" onClick={() => pick('quiz-hub')}>{t('All {n} quizzes →', { n: gamesInGroup('quizzes').length - 2 })}</button>
          )}
        </div>
      )}
    </div>
  )
}
