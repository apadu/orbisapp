import { useMemo } from 'react'
import { QUIZ_ITEMS, summarize } from './QuizHub'
import { ALL_GAMES } from '../utils/gameRegistry'
import { COUNTRY_GAMES, COUNTRY_GAME_HOME, COUNTRY_PAGES } from '../data/countryPages'
import { loadResults } from '../utils/results'
import { t } from '../i18n'
import GameIcon from './GameIcon'

const shuffle = (a) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]] } return b }
const PICKS = 6
const RELATED = 2          // of the 6: this many from the same country / quiz category, the rest from anywhere

/**
 * "Try this one next": six small cards when a quiz ends, new ones every time.
 *  · two related ones: the rest of that country, or the same quiz category
 *  · four random ones from every quiz and country game
 * Games you haven't played come first in each group.
 */
export default function TryNext({ mode, onOpen }) {
  const { picks, stats } = useMemo(() => {
    const stats = summarize(loadResults())
    const fresh = (ids) => [...shuffle(ids.filter(id => !stats[id])), ...shuffle(ids.filter(id => stats[id]))]
    const home = COUNTRY_GAME_HOME[mode]
    const related = home
      ? COUNTRY_PAGES[home].games
      : QUIZ_ITEMS.filter(q => q.cat === QUIZ_ITEMS.find(x => x.id === mode)?.cat).map(q => q.id)
    const everything = [...QUIZ_ITEMS.map(q => q.id), ...COUNTRY_GAMES.map(g => g.id)].filter(id => id !== 'duel')
    const seen = new Set([mode])
    const family = (id) => id.replace(/-?\d+$/, '')       // one "Tripoints #n" at a time
    const families = new Set([family(mode)])
    const picks = []
    const take = (ids, upTo) => {
      for (const id of ids) {
        if (picks.length >= upTo) return
        if (seen.has(id) || (families.has(family(id)) && family(id) !== id)) continue
        const item = ALL_GAMES.find(g => g.id === id)
        if (!item) continue
        seen.add(id)
        families.add(family(id))
        picks.push(item)
      }
    }
    take(fresh(related), RELATED)
    take(fresh(everything), PICKS)
    return { picks, stats }
  }, [mode])

  if (!picks.length) return null
  return (
    <section className="trynext">
      <h3 className="trynext-title">{t('Try this one next')}</h3>
      <div className="trynext-grid">
        {picks.map(it => {
          const st = stats[it.id]
          const best = st?.bestTotal ? Math.round((st.bestCorrect / st.bestTotal) * 100) : null
          return (
            <button key={it.id} className="trynext-card" onClick={() => onOpen(it.id)}>
              <span className="trynext-icon"><GameIcon id={it.id} size={18} /></span>
              <span className="trynext-text">
                <span className="trynext-name">{it.label}</span>
                <span className="trynext-sub">{best != null ? t('Best: {n}%', { n: best }) : it.sub ?? t('New for you')}</span>
              </span>
            </button>
          )
        })}
      </div>
    </section>
  )
}
