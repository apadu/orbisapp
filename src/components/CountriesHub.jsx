import { useMemo } from 'react'
import { COUNTRY_PAGES, countryGame, countryName } from '../data/countryPages'
import { loadResults } from '../utils/results'
import { t, isRo } from '../i18n'

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

/** "Countries": pick a country, then one of its games on the country page. */
export default function CountriesHub({ onOpen }) {
  const best = useMemo(bestByMode, [])
  const countries = Object.entries(COUNTRY_PAGES)

  return (
    <div className="chub">
      <header className="chub-head">
        <h1>{t('Countries')}</h1>
        <p>{t('Pick a country, then a game: its map by county or state, its capitals and a 20-question quiz about it.')}</p>
      </header>

      <div className="chub-grid">
        {countries.map(([id, c]) => {
          const games = c.games.map(countryGame).filter(Boolean)
          const played = games.filter(g => g.id in best).length
          return (
            <button key={id} className="chub-card" onClick={() => onOpen(id)}>
              <div className="chub-card-top">
                <span className="chub-flag" aria-hidden="true">{c.page.flag}</span>
                <div className="chub-card-title">
                  <h2>{countryName(id)}</h2>
                  <span className="chub-card-meta">{t('{n} games', { n: games.length })}{played ? ` · ${t('{n} played', { n: played })}` : ''}</span>
                </div>
              </div>
              <p className="chub-tagline">{pick(c.page.tagline)}</p>
              <ul className="chub-games">
                {games.map(g => (
                  <li key={g.id}>
                    <span aria-hidden="true">{g.icon}</span> {g.label}
                    {g.id in best && <span className="chub-best">{Math.round(best[g.id] * 100)}%</span>}
                  </li>
                ))}
              </ul>
              <span className="chub-cta">{t('Choose a game ▸')}</span>
            </button>
          )
        })}
      </div>
      <p className="chub-more">{t('More countries are on the way.')}</p>
    </div>
  )
}
