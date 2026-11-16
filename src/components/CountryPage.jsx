import { useMemo, useState } from 'react'
import { COUNTRY_PAGES, countryGame } from '../data/countryPages'
import { loadResults } from '../utils/results'
import { useCountryMap, divName } from './countryMap/useCountryMap'
import { t, isRo } from '../i18n'

const pick = (o) => (o == null ? '' : typeof o === 'string' ? o : (isRo ? o.ro : o.en) ?? o.en)

/** Best finished result for a mode, as "x / y" */
function bestFor(mode) {
  let best = null
  for (const r of loadResults()) {
    if (r.mode !== mode || !r.total || r.details?.untimed) continue
    if (!best || r.correct / r.total > best.correct / best.total) best = r
  }
  return best ? `${best.correct} / ${best.total}` : null
}

/** A country's hub: key facts, a map you can explore, and its games. */
export default function CountryPage({ pageId, onOpen }) {
  const { page, map, games } = COUNTRY_PAGES[pageId]
  const { drawn, error } = useCountryMap(map)
  const [hover, setHover] = useState(null)
  const byId = useMemo(() => Object.fromEntries(map.divisions.map(d => [d.id, d])), [map])
  const gameItems = games.map(countryGame).filter(Boolean)
  const h = hover ? byId[hover] : null

  return (
    <div className="ctry">
      <header className="ctry-hero">
        <span className="ctry-flag" aria-hidden="true">{page.flag}</span>
        <div>
          <h1>{pick(page.name)}</h1>
          <p>{pick(page.tagline)}</p>
        </div>
      </header>

      <section className="ctry-facts">
        {page.facts.map((f, i) => (
          <div key={i} className="ctry-fact">
            <span className="ctry-fact-icon" aria-hidden="true">{f.icon}</span>
            <span className="ctry-fact-label">{pick(f.label)}</span>
            <span className="ctry-fact-value">{pick(f.value)}</span>
          </div>
        ))}
      </section>

      <div className="ctry-main">
        <section className="ctry-map-card">
          <div className="ctry-map-head">
            <h2>{t('Explore the map')}</h2>
            <span className="ctry-map-info" aria-live="polite">
              {h
                ? <><b>{divName(h)}</b>{h.seat && h.seat !== h.name ? <> · {page.seatLabel ? pick(page.seatLabel) : t('seat')}: {h.seat}</> : null}</>
                : (page.mapHint ? pick(page.mapHint) : t('Hover or tap a county'))}
            </span>
          </div>
          {error && <p className="cmq-msg">{t('Could not load the map. Check your connection and try again.')}</p>}
          {!drawn && !error && <p className="cmq-msg">{t('Loading map…')}</p>}
          {drawn && (
            <svg className="ctry-map" viewBox={`0 0 ${drawn.W} ${drawn.H}`} role="img" aria-label={pick(page.name)} onMouseLeave={() => setHover(null)}>
              <defs><clipPath id={`ctry-clip-${pageId}`}><rect width={drawn.W} height={drawn.H} /></clipPath></defs>
              <g className="cmq-ctx" clipPath={`url(#ctry-clip-${pageId})`}>{drawn.ctx.map(c => <path key={c.key} d={c.d} />)}</g>
              {[false, true].map(cityLayer => (
                <g key={String(cityLayer)}>
                  {drawn.subs.filter(s => s.city === cityLayer).map(s => (
                    <path key={s.id} d={s.d}
                      className={`cmq-area ctry-area${hover === s.id ? ' is-hover' : ''}`}
                      onMouseEnter={() => setHover(s.id)}
                      onClick={() => setHover(s.id)} />
                  ))}
                </g>
              ))}
              {h && (() => {
                const [x, y] = drawn.labelPos[h.id] ?? [0, 0]
                return <text x={x} y={y} className="cmq-label" pointerEvents="none">{divName(h)}</text>
              })()}
            </svg>
          )}
          <p className="ctry-neighbours">{t('Neighbours')}: {pick(page.neighbours)}</p>
        </section>

        <section className="ctry-games">
          <h2>{t('Play')}</h2>
          {gameItems.map(g => {
            const best = bestFor(g.id)
            return (
              <button key={g.id} className="ctry-game" onClick={() => onOpen(g.id)}>
                <span className="ctry-game-icon" aria-hidden="true">{g.icon}</span>
                <span className="ctry-game-body">
                  <span className="ctry-game-title">{g.label}</span>
                  <span className="ctry-game-desc">{g.desc}</span>
                  {best && <span className="ctry-game-best">{t('Best')}: {best}</span>}
                </span>
                <span className="ctry-game-go" aria-hidden="true">▸</span>
              </button>
            )
          })}
        </section>
      </div>
    </div>
  )
}
