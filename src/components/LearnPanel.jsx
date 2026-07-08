import { CAPITALS } from '../utils/capitals'
import { COUNTRY_INFO } from '../utils/countryInfo'
import { POPULATION } from '../utils/population'
import { COUNTRY_AREA } from '../utils/countryArea'
import { COUNTRY_CURRENCY } from '../utils/countryCurrency'
import { COUNTRY_LANGUAGES } from '../utils/countryLanguages'

function formatPop(millions) {
  if (!millions) return '—'
  if (millions >= 1000) return `${(millions / 1000).toFixed(1)}B`
  if (millions >= 1)    return `${millions % 1 === 0 ? millions : millions.toFixed(1)}M`
  return `${Math.round(millions * 1000)}K`
}

function formatArea(km2) {
  if (!km2) return '—'
  return km2.toLocaleString() + ' km²'
}

const CONTINENT_EMOJI = {
  Africa: '🌍', Americas: '🌎', Asia: '🌏',
  Europe: '🌍', Oceania: '🌏',
}

export default function LearnPanel({ selected, history }) {
  const name      = selected?.properties?.NAME ?? null
  const info      = name ? COUNTRY_INFO[name] : null
  const capital   = name ? (CAPITALS[name]?.[0] ?? '—') : null
  const pop       = name ? POPULATION[name] : null
  const area      = name ? COUNTRY_AREA[name] : null
  const currency  = name ? COUNTRY_CURRENCY[name] : null
  const langs     = name ? (COUNTRY_LANGUAGES[name] ?? []) : []
  const continent = info?.continent ?? '—'
  const flag      = info?.flag ?? '🏳️'

  return (
    <>
      <div className="panel-header">
        <h2>🎓 Learning Mode</h2>
        <p className="panel-subtitle">Click any country on the globe to learn about it.</p>
      </div>

      {!name ? (
        <div className="learn-empty">
          <div className="learn-empty-icon">🌐</div>
          <p>Click a country to get started</p>
        </div>
      ) : (
        <div className="learn-card">
          <div className="learn-flag">{flag}</div>
          <div className="learn-name">{name}</div>
          <div className="learn-stats">
            <div className="learn-stat">
              <span className="learn-stat-label">Capital</span>
              <span className="learn-stat-value">🏛️ {capital}</span>
            </div>
            <div className="learn-stat">
              <span className="learn-stat-label">Continent</span>
              <span className="learn-stat-value">{CONTINENT_EMOJI[continent] ?? '🌐'} {continent}</span>
            </div>
            <div className="learn-stat">
              <span className="learn-stat-label">Population</span>
              <span className="learn-stat-value">👥 {formatPop(pop)}</span>
            </div>
            <div className="learn-stat">
              <span className="learn-stat-label">Area</span>
              <span className="learn-stat-value">📐 {formatArea(area)}</span>
            </div>
            <div className="learn-stat">
              <span className="learn-stat-label">Currency</span>
              <span className="learn-stat-value">💰 {currency ? `${currency.name} (${currency.code})` : '—'}</span>
            </div>
            {langs.length > 0 && (
              <div className="learn-stat">
                <span className="learn-stat-label">Languages</span>
                <span className="learn-stat-value">🗣️ {langs.join(', ')}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {history.length > 0 && (
        <div className="learn-history">
          <div className="learn-history-label">Recently viewed</div>
          {history.map(n => {
            const hi = COUNTRY_INFO[n]
            return (
              <div key={n} className="learn-history-item">
                <span>{hi?.flag ?? '🏳️'}</span>
                <span className="learn-history-name">{n}</span>
                <span className="learn-history-cap">{CAPITALS[n]?.[0] ?? '—'}</span>
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}
