import { useEffect, useMemo, useState } from 'react'
import { geoAlbersUsa, geoMercator, geoPath } from 'd3-geo'
import { isRo } from '../../i18n'

/** Name to show for a subdivision: its Romanian name in Romanian, if it has one */
export const divName = (d) => (isRo && d.ro) || d.name
/** Map label: the abbreviation for tiny subdivisions on maps that use them (US: "RI", "DE"…) */
export const divLabel = (d, small, map) => (small && map.abbreviateSmall ? d.id.split('-')[1] : divName(d))

const PROJECTIONS = { mercator: geoMercator, albersUsa: geoAlbersUsa }

/**
 * Loads a country map (public/data/maps/<file>) and projects it into an SVG
 * `W` units wide; the height follows the country's shape. Shared by the map
 * quizzes and the country pages so they always draw the same map.
 */
export const MAP_W = 1000
const MAP_H_MAX = 760
const PAD = 24

const cache = new Map()              // file → Promise<GeoJSON>
function loadMap(file) {
  if (!cache.has(file)) {
    const base = (import.meta.env?.BASE_URL ?? '/').replace(/\/$/, '')
    cache.set(file, fetch(`${base}/data/maps/${file}`).then(r => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`)
      return r.json()
    }).catch(e => { cache.delete(file); throw e }))
  }
  return cache.get(file)
}

export function useCountryMap(map) {
  const [geo, setGeo] = useState(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    let alive = true
    loadMap(map.file).then(g => { if (alive) setGeo(g) }).catch(() => { if (alive) setError(true) })
    return () => { alive = false }
  }, [map.file])

  const drawn = useMemo(() => {
    if (!geo) return null
    const subs = geo.features.filter(f => !f.properties.ctx)
    // Composite projections (Albers USA) can't draw what's outside their panels: no neighbours then
    const ctx = map.projection === 'albersUsa' ? [] : geo.features.filter(f => f.properties.ctx)
    const fc = { type: 'FeatureCollection', features: subs }
    // Wide countries fill MAP_W; tall ones (Moldova, Chile…) are fitted to MAP_H_MAX instead,
    // so they aren't shrunk to a sliver with unreadable labels
    const proj = (PROJECTIONS[map.projection] ?? geoMercator)().fitWidth(MAP_W - PAD * 2, fc)
    let path = geoPath(proj)
    let [[x0, y0], [x1, y1]] = path.bounds(fc)
    if (y1 - y0 > MAP_H_MAX - PAD * 2) {
      proj.fitHeight(MAP_H_MAX - PAD * 2, fc)
      path = geoPath(proj);
      [[x0, y0], [x1, y1]] = path.bounds(fc)
    }
    const W = Math.ceil(x1 - x0 + PAD * 2)
    const H = Math.ceil(y1 - y0 + PAD * 2)
    proj.translate([proj.translate()[0] - x0 + PAD, proj.translate()[1] - y0 + PAD])
    const total = path.area(fc)
    const byId = Object.fromEntries(map.divisions.map(d => [d.id, d]))
    const subsDrawn = subs.map(f => {
      const [cx, cy] = path.centroid(f)
      const div = byId[f.properties.id]
      // small = under 0.4 % of the country's area: shorter label (abbreviation) and smaller text
      return { id: f.properties.id, d: path(f), cx, cy, small: path.area(f) < total * 0.004, city: !!div?.city }
    })
    // A city inside a county (Bucharest in Ilfov): nudge the county's label off the city
    const labelPos = Object.fromEntries(subsDrawn.map(s => [s.id, [s.cx, s.cy]]))
    for (const city of subsDrawn.filter(s => s.city)) {
      for (const s of subsDrawn) {
        if (!s.city && Math.hypot(s.cx - city.cx, s.cy - city.cy) <= 18) labelPos[s.id] = [s.cx, s.cy + 26]
      }
    }
    return { W, H, ctx: ctx.map((f, i) => ({ key: `c${i}`, d: path(f) })), subs: subsDrawn, labelPos }
  }, [geo, map.divisions, map.projection])

  return { drawn, error }
}
