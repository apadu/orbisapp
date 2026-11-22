/**
 * Pre-renders the world map of the Countries page (progress map): one SVG path per country,
 * in the same plate carrée frame as public/data/landforms/world.json.
 *
 *   node scripts/build-world-countries.mjs
 *   needs public/data/ne_50m_admin_0_countries.geojson (in the repo) and d3-geo
 */
import fs from 'node:fs'
import { geoEquirectangular, geoPath } from 'd3-geo'

const W = 1000
const LAT_TOP = 84, LAT_BOTTOM = -57
const countries = JSON.parse(fs.readFileSync('public/data/ne_50m_admin_0_countries.geojson', 'utf8')).features
  .filter(f => f.geometry && f.properties.NAME !== 'Antarctica')

function thinPath(d, minDist) {
  return d.replace(/M[^MZ]*Z?/g, (sub) => {
    const closed = sub.endsWith('Z')
    const pts = sub.replace(/[MZ]/g, '').split('L').map(s => s.split(',').map(Number))
    const keep = [pts[0]]
    for (let i = 1; i < pts.length; i++) {
      const [x, y] = pts[i], [px, py] = keep.at(-1)
      if (Math.hypot(x - px, y - py) >= minDist || i === pts.length - 1) keep.push(pts[i])
    }
    if (keep.length < 3 && closed) return ''
    return 'M' + keep.map(([x, y]) => `${+x.toFixed(1)},${+y.toFixed(1)}`).join('L') + (closed ? 'Z' : '')
  })
}

const proj = geoEquirectangular().fitWidth(W, { type: 'Sphere' })
const yTop = proj([0, LAT_TOP])[1], yBottom = proj([0, LAT_BOTTOM])[1]
proj.translate([proj.translate()[0], proj.translate()[1] - yTop])
const H = Math.round(yBottom - yTop)
const pathGen = geoPath(proj).digits(2)

const out = {}
for (const f of countries) {
  const d = thinPath(pathGen(f) ?? '', 1.1)
  if (!d) continue
  const [[x0, y0], [x1, y1]] = pathGen.bounds(f)
  out[f.properties.NAME] = { d, b: [x0, y0, x1, y1].map(n => Math.round(n)) }
}
const json = JSON.stringify({ W, H, countries: out })
fs.writeFileSync('public/data/world_countries.json', json)
console.log(Object.keys(out).length, 'countries,', Math.round(json.length / 1024), 'KB')
