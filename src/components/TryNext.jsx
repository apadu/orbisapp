import { useMemo } from 'react'
import { QUIZ_ITEMS, QuizTile, summarize } from './QuizHub'
import { ALL_GAMES } from '../utils/gameRegistry'
import { COUNTRY_GAMES, COUNTRY_GAME_HOME, COUNTRY_PAGES } from '../data/countryPages'
import { loadResults } from '../utils/results'
import { t } from '../i18n'

// Kind of country game: its 20-question quiz, its capitals, or its map of divisions
const gameKind = (id) => id.endsWith('-quiz') ? 'quiz' : id.endsWith('-capitals') || id.endsWith('-seats') ? 'capitals' : 'map'
const shuffle = (a) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]] } return b }

/**
 * "Try this one": three games to play next, shown when a quiz ends.
 *  · a country game → the rest of that country, then the same kind of game elsewhere
 *  · a quiz → others from its category, then any quiz — ones you haven't played first
 */
export default function TryNext({ mode, onOpen }) {
  const { picks, stats } = useMemo(() => {
    const results = loadResults()
    const stats = summarize(results)
    const fresh = (ids) => [...shuffle(ids.filter(id => !stats[id])), ...shuffle(ids.filter(id => stats[id]))]
    let order = []
    const home = COUNTRY_GAME_HOME[mode]
    if (home) {
      const sameCountry = COUNTRY_PAGES[home].games
      const sameKind = COUNTRY_GAMES.map(g => g.id).filter(id => gameKind(id) === gameKind(mode))
      order = [...fresh(sameCountry), ...fresh(sameKind), ...fresh(COUNTRY_GAMES.map(g => g.id))]
    } else {
      const cat = QUIZ_ITEMS.find(q => q.id === mode)?.cat
      order = [...fresh(QUIZ_ITEMS.filter(q => q.cat === cat).map(q => q.id)), ...fresh(QUIZ_ITEMS.map(q => q.id))]
    }
    const seen = new Set([mode])
    const picks = []
    for (const id of order) {
      if (seen.has(id)) continue
      seen.add(id)
      const item = ALL_GAMES.find(g => g.id === id)
      if (item) picks.push(item)
      if (picks.length === 3) break
    }
    return { picks, stats }
  }, [mode])

  if (!picks.length) return null
  return (
    <section className="trynext">
      <h3 className="trynext-title">{t('Try this one next')}</h3>
      <div className="trynext-grid">
        {picks.map(it => <QuizTile key={it.id} item={it} st={stats[it.id]} onSelect={onOpen} />)}
      </div>
    </section>
  )
}
