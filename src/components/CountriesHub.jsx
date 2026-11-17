import { useMemo } from 'react'
import { COUNTRY_PAGES, countryGame, countryName } from '../data/countryPages'
import { loadResults } from '../utils/results'
import { t, isRo } from '../i18n'
import GameIcon from './GameIcon'

const pick = (o) => (o == null ? '' : isRo ? o.ro : o.en)

/** Best accuracy per mode from saved results (untimed games don't count) */
function bestByMode() {
  const best = {}
  for (const r of loadResults()) {
    if (!r.total || r.details?.untimed) continue
    const acc = r.correct / r.total
    if (!(r.mode in best) || acc > best[r.mode]) best[r.mode] = acc
  }
  return best
}

/** "Countries": each card lists its games — click one to play it, or the header for the country page. */
export default function CountriesHub({ onOpen }) {
  const best = useMemo(bestByMode, [])
  const countries = Object.entries(COUNTRY_PAGES)

  return (
    <div className="chub">
      <header className="chub-head">
        <h1>{t('Countries')}</h1>
        <p>{t('Pick a game and play it right away: a country’s map by county or state, its capitals, or a 20-question quiz. Click the country’s name for its page.')}</p>
      </header>

      <div className="chub-grid">
        {countries.map(([id, c]) => {
          const games = c.games.map(countryGame).filter(Boolean)
          const played = games.filter(g => g.id in best).length
          return (
            <div key={id} className="chub-card">
              <button className="chub-card-top" onClick={() => onOpen(id)}>
                <span className="chub-flag" aria-hidden="true">{c.page.flag}</span>
                <div className="chub-card-title">
                  <h2>{countryName(id)}</h2>
                  <span className="chub-card-meta">{t('{n} games', { n: games.length })}{played ? ` · ${t('{n} played', { n: played })}` : ''}</span>
                </div>
              </button>
              <p className="chub-tagline">{pick(c.page.tagline)}</p>
              <ul className="chub-games">
                {games.map(g => (
                  <li key={g.id}>
                    <button className="chub-game" onClick={() => onOpen(g.id)}>
                      <GameIcon id={g.id} size={16} /> <span className="chub-game-label">{g.label}</span>
                      {g.id in best && <span className="chub-best">{Math.round(best[g.id] * 100)}%</span>}
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
