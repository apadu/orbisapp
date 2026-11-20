import { useEffect, useRef, useState } from 'react'
import { GAME_GROUPS, gamesInGroup, groupOf, menuGames } from '../utils/gameRegistry'
import { PALETTE_SHORTCUT } from './CommandPalette'
import { t } from '../i18n'
import Icon, { SECTION_ICON } from './Icon'
import GameIcon from './GameIcon'


/**
 * Left rail, on every desktop page: one button per section. Click = open the section's
 * page; hover = a flyout with its games for a quick jump. Search sits on top (Ctrl/⌘ K).
 */
export default function RailNav({ mode, page, onOpen, onSearch, onHome }) {
  const [open, setOpen] = useState(null)       // group id
  const closeTimer = useRef(null)
  // The section you're in: its own page, or one of its games (nothing on Home / Profile)
  const activeGroup = page === 'home' || page === 'profile' ? null
    : GAME_GROUPS.find(g => g.page === mode)?.id ?? groupOf(mode)

  const show = (g) => { clearTimeout(closeTimer.current); setOpen(g) }
  const hideSoon = () => { clearTimeout(closeTimer.current); closeTimer.current = setTimeout(() => setOpen(null), 220) }
  useEffect(() => () => clearTimeout(closeTimer.current), [])
  useEffect(() => {
    if (!open) return
    const esc = (e) => { if (e.key === 'Escape') setOpen(null) }
    window.addEventListener('keydown', esc)
    return () => window.removeEventListener('keydown', esc)
  }, [open])

  const items = open ? menuGames(open) : []
  const group = GAME_GROUPS.find(g => g.id === open)

  const pick = (id) => { setOpen(null); onOpen(id) }

  return (
    <div className="nrail-wrap" onMouseLeave={hideSoon} onMouseEnter={() => clearTimeout(closeTimer.current)}>
      <nav className="nrail" aria-label={t('Games')}>
        <button className="nrail-btn nrail-search" onClick={onSearch} title={`${t('Search games')} (${PALETTE_SHORTCUT})`}>
          <span className="nrail-icon"><Icon name="search" size={20} /></span>
          <span className="nrail-label">{t('Search')}</span>
        </button>
        <button className={`nrail-btn${page === 'home' ? ' active' : ''}`} onClick={onHome} title={t('Home')}>
          <span className="nrail-icon"><Icon name="home" size={20} /></span>
          <span className="nrail-label">{t('Home')}</span>
        </button>
        <div className="nrail-sep" />
        {GAME_GROUPS.map(g => (
          <button
            key={g.id}
            className={`nrail-btn${activeGroup === g.id ? ' active' : ''}${open === g.id ? ' open' : ''}`}
            style={{ '--cat': g.color }}
            onMouseEnter={() => show(g.id)}
            onFocus={() => show(g.id)}
            onClick={() => pick(g.page)}
            aria-haspopup="menu"
            aria-current={activeGroup === g.id ? 'page' : undefined}
            title={g.label}
          >
            <span className="nrail-icon"><Icon name={SECTION_ICON[g.id]} size={20} /></span>
            <span className="nrail-label">{g.short}</span>
          </button>
        ))}
      </nav>

      {open && group && (
        <div className="nrail-fly" style={{ '--cat': group.color }} role="menu">
          <div className="nrail-fly-head">
            <span>{group.label}</span>
            <span className="nrail-fly-count">{open === 'quizzes' ? gamesInGroup(open).length - 2 : items.length}</span>
          </div>
          <div className="nrail-fly-list">
            {items.map(g => (
              <button key={g.id} role="menuitem" className={`nrail-fly-item${mode === g.id ? ' active' : ''}`} onClick={() => pick(g.id)}>
                <span className="nrail-fly-icon"><GameIcon id={g.id} size={18} /></span>
                <span className="nrail-fly-text">
                  <span className="nrail-fly-label">{g.label}</span>
                  <span className="nrail-fly-desc">{g.desc}</span>
                </span>
              </button>
            ))}
          </div>
          <button className="nrail-fly-more" onClick={() => pick(group.page)}>
            {open === 'quizzes' ? t('All {n} quizzes →', { n: gamesInGroup('quizzes').length - 2 }) : t('Open {section} →', { section: group.label })}
          </button>
        </div>
      )}
    </div>
  )
}
