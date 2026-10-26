import { useMemo, useState } from 'react'
import { geoNaturalEarth1, geoPath, geoArea } from 'd3-geo'
import { t, cn } from '../../i18n'

const W = 960
const H = 500

// d3 wants clockwise exterior rings; some GeoJSON polygons are wound the other way,
// which d3 reads as "the whole globe minus this country". Flip those.
function rewindPolygon(rings) {
  const poly = { type: 'Polygon', coordinates: rings }
  return geoArea(poly) > 2 * Math.PI ? rings.map(r => [...r].reverse()) : rings
}
function rewind(f) {
  const g = f.geometry
  if (!g) return f
  if (g.type === 'Polygon') return { ...f, geometry: { ...g, coordinates: rewindPolygon(g.coordinates) } }
  if (g.type === 'MultiPolygon') return { ...f, geometry: { ...g, coordinates: g.coordinates.map(rewindPolygon) } }
  return f
}

/** Red (0%) → amber (50%) → green (100%) */
export function masteryColor(pct) {
  const hue = Math.round(pct * 125)           // 0 = red, 125 = green
  return `hsl(${hue}, 72%, ${pct > 0.85 ? 45 : 50}%)`
}

export default function KnowledgeMap({ countries, mastery }) {
  const [hover, setHover] = useState(null) // { name, x, y }

  const { paths, sphere } = useMemo(() => {
    const feats = countries.filter(f => f.properties.NAME !== 'Antarctica').map(rewind)
    const projection = geoNaturalEarth1().fitExtent([[8, 8], [W - 8, H - 8]], { type: 'Sphere' })
    const path = geoPath(projection)
    return {
      sphere: path({ type: 'Sphere' }),
      paths: feats.map(f => ({ name: f.properties.NAME, d: path(f) })).filter(p => p.d),
    }
  }, [countries])

  const stat = hover ? mastery[hover.name] : null

  return (
    <div className="km-wrap">
      <svg
        className="km-svg"
        viewBox={`0 0 ${W} ${H}`}
        onMouseLeave={() => setHover(null)}
      >
        <path d={sphere} className="km-ocean" />
        {paths.map(p => {
          const s = mastery[p.name]
          const fill = s ? masteryColor(s.ok / s.total) : undefined
          return (
            <path
              key={p.name}
              d={p.d}
              className={`km-country${s ? '' : ' km-unplayed'}${hover?.name === p.name ? ' km-hover' : ''}`}
              style={fill ? { fill } : undefined}
              onMouseMove={e => {
                const box = e.currentTarget.ownerSVGElement.getBoundingClientRect()
                setHover({ name: p.name, x: e.clientX - box.left, y: e.clientY - box.top })
              }}
            />
          )
        })}
      </svg>

      {hover && (
        <div className="km-tooltip" style={{ left: hover.x + 14, top: hover.y + 14 }}>
          <strong>{cn(hover.name)}</strong>
          {stat
            ? <span>{Math.round((stat.ok / stat.total) * 100)}% · {stat.ok}/{stat.total} {t('correct')}</span>
            : <span className="km-tip-muted">{t('Not seen yet')}</span>}
        </div>
      )}

      <div className="km-legend">
        <span className="km-legend-label">{t('Never right')}</span>
        <span className="km-legend-bar" />
        <span className="km-legend-label">{t('Always right')}</span>
        <span className="km-legend-sep" />
        <span className="km-legend-swatch km-unplayed-swatch" /> <span className="km-legend-label">{t('Not seen')}</span>
      </div>
    </div>
  )
}
