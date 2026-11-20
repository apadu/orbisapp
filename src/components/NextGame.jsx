import { useMemo } from 'react'
import { ALL_GAMES, groupOf } from '../utils/gameRegistry'
import { loadResults } from '../utils/results'
import { t } from '../i18n'
import GameIcon from './GameIcon'

// A natural follow-up for some games (same skill, one step further)
const RELATED = {
  locate:        { good: 'capital-drop', weak: 'spotlight' },
  'capital-drop': { good: 'landmark-drop', weak: 'capital' },
  neighbor:      { good: 'border-chain',  weak: 'locate' },
  missing:       { good: 'spotlight',     weak: 'locate' },
  spotlight:     { good: 'name-all',      weak: 'locate' },
}

/**
 * "Play next": up to two cards at the end of a game — a related game (picked by how
 * well this one went) and a game from the same section you haven't tried yet.
 */
export default function NextGame({ mode, accuracy = 0, onOpen }) {
  const picks = useMemo(() => {
    const played = new Set(loadResults().map(r => r.mode))
    const byId = (id) => ALL_GAMES.find(g => g.id === id)
    const out = []
    const rel = RELATED[mode]
    if (rel) out.push({ game: byId(accuracy >= 0.6 ? rel.good : rel.weak), why: accuracy >= 0.6 ? t('One step further') : t('Warm up with this') })
    const fresh = ALL_GAMES.find(g => g.group === groupOf(mode) && g.id !== mode && !played.has(g.id) && !out.some(o => o.game?.id === g.id) && !g.id.endsWith('-hub'))
    if (fresh) out.push({ game: fresh, why: t('You haven\'t tried this one') })
    return out.filter(o => o.game).slice(0, 2)
  }, [mode, accuracy])

  if (!picks.length) return null
  return (
    <div className="nextg">
      <div className="nextg-title">{t('Play next')}</div>
      {picks.map(({ game, why }) => (
        <button key={game.id} className="nextg-card" onClick={() => onOpen(game.id)}>
          <span className="nextg-icon"><GameIcon id={game.id} size={22} /></span>
          <span className="nextg-text">
            <span className="nextg-why">{why}</span>
            <span className="nextg-name">{game.label}</span>
          </span>
          <span className="nextg-go">▸</span>
        </button>
      ))}
    </div>
  )
}
