import { t } from '../i18n'

/** Bottom navigation bar on phones (hidden during a game — the game panel lives there). */
export default function MobileNav({ page, mode, onHome, onGames, onSearch, onDaily, onProfile }) {
  const items = [
    { id: 'home',    icon: '🏠', label: t('Home'),    on: onHome,    active: page === 'home' },
    { id: 'games',   icon: '🎮', label: t('Games'),   on: onGames,   active: page === 'quiz' && mode !== 'daily-quiz' },
    { id: 'search',  icon: '🔎', label: t('Search'),  on: onSearch,  active: false },
    { id: 'daily',   icon: '📅', label: t('Daily'),   on: onDaily,   active: page === 'quiz' && mode === 'daily-quiz' },
    { id: 'profile', icon: '👤', label: t('Profile'), on: onProfile, active: page === 'profile' },
  ]
  return (
    <nav className="mnav" aria-label={t('Main navigation')}>
      {items.map(it => (
        <button key={it.id} className={`mnav-btn${it.active ? ' active' : ''}`} onClick={it.on} aria-current={it.active ? 'page' : undefined}>
          <span className="mnav-icon">{it.icon}</span>
          <span className="mnav-label">{it.label}</span>
        </button>
      ))}
    </nav>
  )
}
