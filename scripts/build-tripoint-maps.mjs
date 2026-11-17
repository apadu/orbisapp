/**
 * Pre-renders the small "Tripoints" maps: one JSON per tripoint in public/data/tripoints/<i>.json
 * with ready-to-draw SVG paths (land, borders, lakes, rivers) and a label spot per country.
 * Uses Natural Earth 1:10m data, so the zoomed-in maps stay crisp, and keeps the app from
 * loading any big geometry for this game.
 *
 *   node scripts/build-tripoint-maps.mjs --geo=/tmp/geo
 *   (needs ne_10m_admin_0_countries / ne_10m_lakes / ne_10m_rivers_lake_centerlines .geojson
 *    from github.com/nvkelso/natural-earth-vector, and: npm i --no-save topojson-server topojson-client)
 *
 * <i> is the index in src/data/tripoints.js (run scripts/build-tripoints.mjs first).
 */
import fs from 'node:fs'
import path from 'node:path'
import { topology } from 'topojson-server'
import { mesh } from 'topojson-client'
import { geoAzimuthalEquidistant, geoBounds, geoPath } from 'd3-geo'

const GEO = (process.argv.find(a => a.startsWith('--geo=')) ?? '--geo=/tmp/geo').slice(6)
const OUT = 'public/data/tripoints'
const W = 400, H = 300
const R = 6371

const read = (f) => JSON.parse(fs.readFileSync(path.join(GEO, f), 'utf8')).features.filter(f => f.geometry)
const countries = read('ne_10m_admin_0_countries.geojson')
const lakes = read('ne_10m_lakes.geojson')
const rivers = read('ne_10m_rivers_lake_centerlines.geojson')

// Names as the app knows them (NAME_OVERRIDES in App.jsx)
const app = fs.readFileSync('src/App.jsx', 'utf8')
const block = app.slice(app.indexOf('const NAME_OVERRIDES = {'), app.indexOf('}', app.indexOf('const NAME_OVERRIDES = {')))
const RENAME = { Somaliland: 'Somalia' }
for (const m of block.matchAll(/(['"])(.+?)\1:\s*(['"])(.+?)\3/g)) RENAME[m[2]] = m[4]
const nameOf = (f) => RENAME[f.properties.NAME] ?? f.properties.NAME

const src = fs.readFileSync('src/data/tripoints.js', 'utf8')
const body = src.slice(src.indexOf('= [') + 2, src.lastIndexOf(']') + 1)
const TRIPOINTS = JSON.parse(body.replace(/,\s*\]$/, ']'))

// Internal borders only (no coastlines): shared arcs between two different countries
const topo = topology({ c: { type: 'FeatureCollection', features: countries } })
const borderLines = mesh(topo, topo.objects.c, (a, b) => a !== b)
const borders = borderLines.coordinates.map(c => ({ type: 'LineString', coordinates: c }))

// Snap each tripoint to the 1:10m junction of the same three countries (the 1:50m one can be a few km off)
const arcUsers = topo.arcs.map(() => new Set())
const walk = (a, n) => Array.isArray(a) ? a.forEach(x => walk(x, n)) : arcUsers[a < 0 ? ~a : a].add(n)
topo.objects.c.geometries.forEach((g, i) => g.arcs && walk(g.arcs, nameOf(countries[i])))
const junctions = new Map()
topo.arcs.forEach((arc, i) => {
  for (const p of [arc[0], arc[arc.length - 1]]) {
    const k = p.join(',')   // not quantized: arcs hold real coordinates
    if (!junctions.has(k)) junctions.set(k, new Set())
    for (const n of arcUsers[i]) junctions.get(k).add(n)
  }
})

const withBounds = (list) => list.map(f => ({ f, b: geoBounds(f) }))
const C = withBounds(countries), L = withBounds(lakes), V = withBounds(rivers)
const B = borders.map(g => ({ f: g, b: geoBounds(g) }))

fs.mkdirSync(OUT, { recursive: true })
let total = 0, snapped = 0
TRIPOINTS.forEach((tp, i) => {
  let [lon, lat] = [tp.lon, tp.lat]
  let best = Infinity
  for (const [k, set] of junctions) {
    if (!tp.countries.every(n => set.has(n))) continue
    const [x, y] = k.split(',').map(Number)
    const d = (x - tp.lon) ** 2 + (y - tp.lat) ** 2
    if (d < best) { best = d; lon = x; lat = y }
  }
  if (best < 0.5) snapped++; else [lon, lat] = [tp.lon, tp.lat]

  const r = tp.radiusKm / R
  const projection = geoAzimuthalEquidistant().rotate([-lon, -lat]).scale((H / 2) / r).translate([W / 2, H / 2])
    .clipAngle(Math.min(60, (r * 180 / Math.PI) * 4)).clipExtent([[0, 0], [W, H]])
  const p = geoPath(projection).digits(1)
  const pad = (r * 180 / Math.PI) * 2.5
  const near = ({ b: [[x0, y0], [x1, y1]] }) => {
    if (lat + pad < y0 || lat - pad > y1) return false
    if (x0 > x1) return true
    const dl = pad / Math.max(0.15, Math.cos(lat * Math.PI / 180))
    return !(lon + dl < x0 || lon - dl > x1)
  }
  const join = (items) => items.filter(near).map(({ f }) => p(f)).filter(Boolean).join('')
  const labels = {}
  for (const { f, b } of C) {
    const n = nameOf(f)
    if (!tp.countries.includes(n) || !near({ b })) continue
    const c = p.centroid(f)
    if (c.every(Number.isFinite)) labels[n] = c.map(v => Math.round(v))
  }
  const out = {
    w: W, h: H,
    land: join(C),
    borders: join(B),
    lakes: join(L),
    rivers: join(V.filter(({ f }) => (f.properties.scalerank ?? 10) <= 10)),
    labels,
    dot: projection([lon, lat]).map(v => Math.round(v * 10) / 10),
  }
  const json = JSON.stringify(out)
  total += json.length
  fs.writeFileSync(path.join(OUT, `${i}.json`), json)
})
console.log(`${TRIPOINTS.length} maps, ${snapped} snapped to 1:10m, ${(total / 1024).toFixed(0)} KB total`)
