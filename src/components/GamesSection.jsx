import { useEffect, useMemo, useState } from 'react'
import { QuizTile, summarize } from './QuizHub'
import { loadResults, subscribeResults } from '../utils/results'
import { GAME_GROUPS, GLOBE_ROWS } from '../utils/gameRegistry'
import { t } from '../i18n'
import Icon from './Icon'

/** A section page (Globe games · Name them all): every game of the section, row by row. */
export default function GamesSection({ section, onOpen }) {
  const group = GAME_GROUPS.find(g => g.id === section)
  const [results, setResults] = useState(loadResults)
  useEffect(() => subscribeResults(() => setResults(loadResults())), [])
  const stats = useMemo(() => summarize(results), [results])
  const rows = GLOBE_ROWS.filter(r => group?.rows?.includes(r.id))
  const all = rows.flatMap(r => r.items)
  const played = all.filter(i => stats[i.id]).length

  return (
    <div className="qh gsec" style={{ '--cat': group?.color }}>
      <header className="qh-head">
        <div>
          <h1 className="qh-title">{group?.label}</h1>
          <p className="qh-sub">{group?.desc}</p>
        </div>
        <div className="qh-progress">
          <div className="qh-progress-row">
            <span>{t('{played} of {n} played', { played, n: all.length })}</span>
          </div>
          <div className="qh-progress-bar"><div style={{ width: `${all.length ? (played / all.length) * 100 : 0}%` }} /></div>
        </div>
      </header>

      {rows.map(row => (
        <section key={row.id} className="qh-section" style={{ '--cat': row.color }}>
          {rows.length > 1 && (
            <div className="qh-section-head">
              <span className="qh-section-icon"><Icon name={row.id === 'challenges' ? 'target' : row.id === 'nameall' ? 'list' : 'globe'} size={18} /></span>
              <h2>{row.label}</h2>
              <span className="qh-section-count">{row.items.filter(i => stats[i.id]).length}/{row.items.length}</span>
            </div>
          )}
          <div className="qh-grid">
            {row.items.map(it => <QuizTile key={it.id} item={it} st={stats[it.id]} onSelect={onOpen} />)}
          </div>
        </section>
      ))}
    </div>
  )
}
