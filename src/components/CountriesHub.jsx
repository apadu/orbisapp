import { useEffect, useMemo, useRef, useState } from 'react'
import { COUNTRY_PAGES, countryGame, countryName } from '../data/countryPages'
import { subscribeResults } from '../utils/results'
import { bestByMode, countryProgress, DONE_AT } from '../utils/countryProgress'
import { t, isRo, cn } from '../i18n'
import GameIcon from './GameIcon'
import StateNote from './StateNote'

const pick = (o) => (o == null ? '' : isRo ? o.ro : o.en)

// Natural Earth names that differ from a page's English name
const NE_NAME = { 'United States': 'United States of America' }
const PAGE_OF_NE = Object.fromEntries(Object.entries(COUNTRY_PAGES).map(([id, c]) => [NE_NAME[c.page.name.en] ?? c.page.name.en, id]))

const base = (import.meta.env?.BASE_URL ?? '/').replace(/\/$/, '')
let worldPromise = null
const loadWorld = () => (worldPromise ??= fetch(`${base}/data/world_countries.json`)
  .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json() })
  .catch(e => { worldPromise = null; throw e }))

/** Re-reads the best scores whenever a result is saved (e.g. after signing in) */
function useBest() {
  const [best, setBest] = useState(() => bestByMode())
  useEffect(() => subscribeResults(() => setBest(bestByMode())), [])
  return best
}

const STATUS_LABEL = {
  none: () => t('Not started'),
  partial: () => t('In progress'),
  done: () => t('Completed'),
  perfect: () => t('Perfect'),
}

/** The world, each country coloured by how much of its page you've played. Click one to open it. */
function ProgressMap({ best, onOpen }) {
  const [world, setWorld] = useState(null)
  const [error, setError] = useState(false)
  const [hover, setHover] = useState(null)       // Natural Earth name
  useEffect(() => { loadWorld().then(setWorld).catch(() => setError(true)) }, [])
  // On a phone the map scrolls sideways: start with Europe and Africa in view
  const scrollRef = useRef(null)
  useEffect(() => {
    const el = scrollRef.current
    if (!el || el.scrollWidth <= el.clientWidth) return
    el.scrollLeft = el.scrollWidth * (195 / 360) - el.clientWidth / 2
  }, [world])

  const progress = useMemo(() => Object.fromEntries(Object.keys(COUNTRY_PAGES).map(id => [id, countryProgress(id, best)])), [best])
  const completed = Object.values(progress).filter(p => p.status === 'done' || p.status === 'perfect').length
  const total = Object.keys(COUNTRY_PAGES).length

  if (error) return <StateNote kind="error">{t('Could not load the map. Check your connection and try again.')}</StateNote>
  if (!world) return <div className="cpm cpm-loading"><StateNote kind="loading">{t('Loading map…')}</StateNote></div>

  const entries = Object.entries(world.countries)
  // countries with a page go last, so their outline is drawn over their neighbours'
  const others = entries.filter(([n]) => !PAGE_OF_NE[n])
  const pages = entries.filter(([n]) => PAGE_OF_NE[n])
  // small countries get a ring so they can be seen and tapped
  const small = pages.filter(([, c]) => Math.max(c.b[2] - c.b[0], c.b[3] - c.b[1]) < 14)

  const hoverPage = hover ? PAGE_OF_NE[hover] : null
  const p = hoverPage ? progress[hoverPage] : null
  const info = hover
    ? hoverPage
      ? <><b>{countryName(hoverPage)}</b> · {t('{done} / {total} games completed', { done: p.done, total: p.total })} · <span className={`cpm-st cpm-st-${p.status}`}>{STATUS_LABEL[p.status]()}</span></>
      : <><b>{cn(hover)}</b> · <span className="cpm-soon">{t('Coming soon')}</span></>
    : t('Click a country to open its page. It turns green once you complete all of its games.')

  const cls = (n) => {
    const id = PAGE_OF_NE[n]
    return `cpm-c${id ? ` has-page st-${progress[id].status}` : ''}${hover === n ? ' is-hover' : ''}`
  }
  const open = (n) => { const id = PAGE_OF_NE[n]; if (id) onOpen(id); else setHover(n) }

  return (
    <section className="cpm" aria-label={t('Your map')}>
      <div className="cpm-head">
        <div className="cpm-count">
          <span className="cpm-count-n">{completed}<small> / {total}</small></span>
          <span className="cpm-count-l">{t('countries completed')}</span>
        </div>
        <div className="cpm-bar" aria-hidden="true"><span style={{ width: `${(completed / total) * 100}%` }} /></div>
        <ul className="cpm-legend">
          <li><i className="cpm-sw st-none" />{t('Not started')}</li>
          <li><i className="cpm-sw st-partial" />{t('In progress')}</li>
          <li><i className="cpm-sw st-done" />{t('Completed')}</li>
          <li><i className="cpm-sw st-perfect" />{t('Perfect')}</li>
          <li><i className="cpm-sw st-soon" />{t('Coming soon')}</li>
        </ul>
      </div>
      <p className="cpm-info" aria-live="polite">{info}</p>
      <div className="cpm-scroll" ref={scrollRef}>
      <svg className="cpm-map" viewBox={`0 0 ${world.W} ${world.H}`} role="img" aria-label={t('World map of your progress')}
        onMouseLeave={() => setHover(null)}>
        {[...others, ...pages].map(([n, c]) => (
          <path key={n} d={c.d} className={cls(n)}
            onMouseEnter={() => setHover(n)} onClick={() => open(n)}>
            <title>{PAGE_OF_NE[n] ? countryName(PAGE_OF_NE[n]) : cn(n)}</title>
          </path>
        ))}
        {small.map(([n, c]) => (
          <circle key={n} cx={(c.b[0] + c.b[2]) / 2} cy={(c.b[1] + c.b[3]) / 2} r={9}
            className={`cpm-ring st-${progress[PAGE_OF_NE[n]].status}${hover === n ? ' is-hover' : ''}`}
            onMouseEnter={() => setHover(n)} onClick={() => open(n)} />
        ))}
      </svg>
      </div>
    </section>
  )
}

/** "Countries": the progress map, then each card lists its games — click one to play it, or the header for the country page. */
export default function CountriesHub({ onOpen }) {
  const best = useBest()
  const countries = Object.entries(COUNTRY_PAGES)

  return (
    <div className="chub">
      <header className="chub-head">
        <h1>{t('Countries')}</h1>
        <p>{t('Pick a game and play it right away: a country’s map by county or state, its capitals, or a 20-question quiz. Click the country’s name for its page.')}</p>
      </header>

      <ProgressMap best={best} onOpen={onOpen} />

      <div className="chub-grid">
        {countries.map(([id, c]) => {
          const games = c.games.map(countryGame).filter(Boolean)
          const { done, status } = countryProgress(id, best)
          return (
            <div key={id} className={`chub-card st-${status}`}>
              <button className="chub-card-top" onClick={() => onOpen(id)}>
                <span className="chub-flag" aria-hidden="true">{c.page.flag}</span>
                <div className="chub-card-title">
                  <h2>{countryName(id)}</h2>
                  <span className="chub-card-meta">
                    {t('{n} games', { n: games.length })}
                    {status !== 'none' && <> · <span className={`cpm-st cpm-st-${status}`}>{status === 'partial' ? t('{done} / {total} completed', { done, total: games.length }) : STATUS_LABEL[status]()}</span></>}
                  </span>
                </div>
              </button>
              <p className="chub-tagline">{pick(c.page.tagline)}</p>
              <ul className="chub-games">
                {games.map(g => (
                  <li key={g.id}>
                    <button className="chub-game" onClick={() => onOpen(g.id)}>
                      <GameIcon id={g.id} size={16} /> <span className="chub-game-label">{g.label}</span>
                      {g.id in best && <span className={`chub-best${best[g.id] < DONE_AT ? ' low' : ''}`}>{Math.round(best[g.id] * 100)}%</span>}
                      <span className="chub-play" aria-hidden="true">▸</span>
                    </button>
                  </li>
                ))}
              </ul>
              <button className="chub-cta" onClick={() => onOpen(id)}>{t('About {country} ▸', { country: countryName(id) })}</button>
            </div>
          )
        })}
      </div>
      <p className="chub-more">{t('More countries are on the way.')}</p>
    </div>
  )
}
