import { useEffect, useMemo } from 'react'
import { t } from '../i18n'
import Icon, { SECTION_ICON } from './Icon'
import GameIcon from './GameIcon'
import { GAME_GROUPS, randomGame } from '../utils/gameRegistry'
import { gameMeta } from '../utils/gameCatalog'
import { loadResults } from '../utils/results'

const HUB_PAGES = new Set(['quiz-hub', 'globe-hub', 'nameall-hub', 'countries'])

/**
 * Phones: the "Games" tab of the bottom bar. A short sheet with the five sections as big
 * cards and your last games — instead of the full list of every game (that's still one tap
 * away, under "All games").
 */
export default function MobileGamesSheet({ open, page, mode, onClose, onOpen, onAllGames }) {
  // Esc closes; the page behind doesn't scroll while it's open
  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prev }
  }, [open, onClose])

  // Your last three games (one per game), newest first
  const recent = useMemo(() => {
    if (!open) return []
    const seen = new Set(), out = []
    for (const r of loadResults()) {
      if (!r.mode || seen.has(r.mode) || HUB_PAGES.has(r.mode)) continue
      seen.add(r.mode)
      out.push(r.mode)
      if (out.length === 3) break
    }
    return out
  }, [open])

  if (!open) return null
  const go = (id) => { onClose(); onOpen(id) }
  const current = page === 'quiz' || page === 'game' ? mode : null

  return (
    <div className="mgs-backdrop" onClick={onClose}>
      <div className="mgs" role="dialog" aria-modal="true" aria-label={t('Games')} onClick={e => e.stopPropagation()}>
        <div className="mgs-grab" aria-hidden="true" />
        <div className="mgs-head">
          <h2>{t('What shall we play?')}</h2>
          <button className="mgs-close" onClick={onClose} aria-label={t('Close')}>✕</button>
        </div>

        <button className="mgs-random" onClick={() => { const g = randomGame(mode); if (g) go(g.id) }}>
          <Icon name="dice" size={20} /> {t('Surprise me')}
          <span>{t('A random quiz')}</span>
        </button>

        <div className="mgs-sections">
          {GAME_GROUPS.map(g => (
            <button key={g.id} className={`mgs-sec${current === g.page ? ' active' : ''}`}
              style={{ '--cat': g.color }} onClick={() => go(g.page)}>
              <span className="mgs-sec-icon"><Icon name={SECTION_ICON[g.id]} size={22} strokeWidth={1.6} /></span>
              <span className="mgs-sec-title">{g.label}</span>
              <span className="mgs-sec-desc">{g.desc}</span>
            </button>
          ))}
        </div>

        {recent.length > 0 && (
          <div className="mgs-recent">
            <div className="mgs-label">{t('Continue playing')}</div>
            {recent.map(id => (
              <button key={id} className="mgs-recent-item" onClick={() => go(id)}>
                <span className="mgs-recent-icon"><GameIcon id={id} size={18} /></span>
                <span className="mgs-recent-name">{gameMeta(id).label}</span>
                <span className="mgs-recent-go">›</span>
              </button>
            ))}
          </div>
        )}

        <button className="mgs-all" onClick={() => { onClose(); onAllGames() }}>
          <Icon name="grid" size={16} /> {t('All games')}
        </button>
      </div>
    </div>
  )
}
