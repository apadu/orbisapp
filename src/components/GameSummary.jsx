import { useMemo, useState } from 'react'

/**
 * End-of-game summary: big score, accuracy ring, and a Missed / Found toggle
 * showing answers as compact chips instead of long lists.
 *
 * items: [{ label, sub?, icon? }]
 */
export default function GameSummary({ found = [], missed = [], total, noun = 'items', timeLabel, title }) {
  const [tab, setTab] = useState(missed.length ? 'missed' : 'found')
  const [query, setQuery] = useState('')

  const t = total ?? found.length + missed.length
  const pct = t ? Math.round((found.length / t) * 100) : 0
  const perfect = missed.length === 0 && found.length > 0

  const list = tab === 'missed' ? missed : found
  const shown = useMemo(() => {
    const q = query.trim().toLowerCase()
    const sorted = [...list].sort((a, b) => a.label.localeCompare(b.label))
    return q ? sorted.filter(i => `${i.label} ${i.sub ?? ''}`.toLowerCase().includes(q)) : sorted
  }, [list, query])

  const verdict = perfect ? 'Perfect run!' : pct >= 90 ? 'Outstanding' : pct >= 70 ? 'Great job' : pct >= 40 ? 'Solid effort' : 'Keep practising'

  return (
    <div className={`gs${perfect ? ' gs-perfect' : ''}`}>
      <div className="gs-head">
        <div className="gs-ring" style={{ '--p': pct }}>
          <span>{pct}%</span>
        </div>
        <div className="gs-head-text">
          <span className="gs-verdict">{title ?? verdict}</span>
          <span className="gs-score"><strong>{found.length}</strong> / {t} {noun}</span>
          {timeLabel && <span className="gs-time">⏱ {timeLabel}</span>}
        </div>
      </div>

      {(found.length > 0 || missed.length > 0) && (
        <>
          <div className="gs-tabs" role="tablist">
            <button role="tab" aria-selected={tab === 'missed'} className={`gs-tab gs-tab-missed${tab === 'missed' ? ' active' : ''}`}
              onClick={() => setTab('missed')} disabled={!missed.length}>
              Missed <span>{missed.length}</span>
            </button>
            <button role="tab" aria-selected={tab === 'found'} className={`gs-tab gs-tab-found${tab === 'found' ? ' active' : ''}`}
              onClick={() => setTab('found')} disabled={!found.length}>
              Found <span>{found.length}</span>
            </button>
          </div>

          {list.length > 12 && (
            <input className="gs-search" placeholder={`Filter ${tab}…`} value={query} onChange={e => setQuery(e.target.value)} />
          )}

          <div className={`gs-chips gs-chips-${tab}`}>
            {shown.map((i, n) => (
              <span key={`${i.label}-${i.sub ?? ''}-${n}`} className="gs-chip" title={i.sub ? `${i.label} — ${i.sub}` : i.label}>
                {i.icon && <span className="gs-chip-icon">{i.icon}</span>}
                <span className="gs-chip-label">{i.label}</span>
                {i.sub && <span className="gs-chip-sub">{i.sub}</span>}
              </span>
            ))}
            {shown.length === 0 && <span className="gs-empty">Nothing matches.</span>}
          </div>
        </>
      )}
    </div>
  )
}
