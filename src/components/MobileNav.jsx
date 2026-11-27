import { t } from '../i18n'
import Icon from './Icon'

/** Bottom navigation bar on phones (hidden during a game — the game panel lives there). */

// Tapping the tab you're already on scrolls that page back to the top (like native apps)
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
  for (const el of document.querySelectorAll('.quiz-content, .app-shell *')) {
    if (el.scrollTop > 0 && el.scrollHeight > el.clientHeight) el.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

export default function MobileNav({ page, mode, onHome, onGames, onSearch, onDaily, onProfile }) {
  const items = [
    { id: 'home',    icon: 'home', label: t('Home'),    on: onHome,    active: page === 'home' },
    { id: 'games',   icon: 'grid', label: t('Games'),   on: onGames,   active: page === 'quiz' && mode !== 'daily-quiz' },
    { id: 'search',  icon: 'search', label: t('Search'),  on: onSearch,  active: false },
    { id: 'daily',   icon: 'calendar', label: t('Daily'),   on: onDaily,   active: page === 'quiz' && mode === 'daily-quiz' },
    { id: 'profile', icon: 'user', label: t('Passport'), on: onProfile, active: page === 'profile' },
  ]
  return (
    <nav className="mnav" aria-label={t('Main navigation')}>
      {items.map(it => (
        <button key={it.id} className={`mnav-btn${it.active ? ' active' : ''}`} onClick={it.active && it.id !== 'games' && it.id !== 'search' ? scrollToTop : it.on} aria-current={it.active ? 'page' : undefined}>
          <span className="mnav-icon"><Icon name={it.icon} size={21} /></span>
          <span className="mnav-label">{it.label}</span>
        </button>
      ))}
    </nav>
  )
}
