/**
 * Pre-renders the world maps of the "Famous islands" / "Famous peninsulas" quizzes:
 * public/data/landforms/world.json — the background (land, borders, big lakes), shared — and
 * public/data/landforms/<quiz>.json — one ready-to-draw SVG path per island / peninsula.
 *
 *   node scripts/build-landforms.mjs --geo=/tmp/geo
 *   needs, from github.com/nvkelso/natural-earth-vector (geojson/):
 *     ne_10m_land, ne_10m_geography_regions_polys, ne_10m_geography_marine_polys,
 *     ne_10m_lakes, ne_50m_lakes  (.geojson)
 *   ne_10m_rivers_lake_centerlines (.geojson) for the river quizzes,
 *   hb/world_<year>.geojson from github.com/aourednik/historical-basemaps (GPL-3.0) for the history maps,
 *   and PB2002_plates.json (github.com/fraxen/tectonicplates, GeoJSON/) for the plates quiz
 *   plus public/data/ne_50m_admin_0_countries.geojson (already in the repo), and:
 *     npm i --no-save polygon-clipping topojson-server topojson-client
 *
 * Items and their geometry rules live in src/data/landforms.js.
 */
import fs from 'node:fs'
import path from 'node:path'
import polygonClipping from 'polygon-clipping'
import { topology } from 'topojson-server'
import { mesh } from 'topojson-client'
import { geoEquirectangular, geoPath, geoContains, geoArea, geoCircle, geoCentroid } from 'd3-geo'
import { LANDFORMS } from '../src/data/landforms.js'

const GEO = (process.argv.find(a => a.startsWith('--geo=')) ?? '--geo=/tmp/geo').slice(6)
const OUT = 'public/data/landforms'
const W = 1000
const LAT_TOP = 84, LAT_BOTTOM = -57      // Greenland's tip … Cape Horn

const read = (f) => JSON.parse(fs.readFileSync(f, 'utf8')).features.filter(f => f.geometry)
const land = read(path.join(GEO, 'ne_10m_land.geojson'))
const regions = read(path.join(GEO, 'ne_10m_geography_regions_polys.geojson'))
const lakes = read(path.join(GEO, 'ne_50m_lakes.geojson')).filter(f => (f.properties.scalerank ?? 9) <= 1)
const countries = read('public/data/ne_50m_admin_0_countries.geojson')
const marine = read(path.join(GEO, 'ne_10m_geography_marine_polys.geojson'))
const lakes10 = read(path.join(GEO, 'ne_10m_lakes.geojson'))
const plates = read(path.join(GEO, 'PB2002_plates.json'))
const rivers = read(path.join(GEO, 'ne_10m_rivers_lake_centerlines.geojson'))
const histCache = new Map()
const history = (year) => {
  if (!histCache.has(year)) histCache.set(year, read(path.join(GEO, 'hb', `world_${year}.geojson`)))
  return histCache.get(year)
}

// Rings wound the other way fill the whole sphere instead of the shape: flip those polygons
function rewound(g) {
  const polys = g.type === 'Polygon' ? [g.coordinates] : g.coordinates
  const fixed = polys.map(p => (geoArea({ type: 'Polygon', coordinates: p }) > 2 * Math.PI ? p.map(r => [...r].reverse()) : p))
  return { type: 'MultiPolygon', coordinates: fixed }
}

// Every polygon of the features with these names, as one MultiPolygon
function partsNamed(features, key, names) {
  const want = new Set([names].flat())
  const polys = features.filter(f => want.has(f.properties[key]))
    .flatMap(f => f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates)
  if (!polys.length) throw new Error(`nothing named ${[...want].join(', ')}`)
  return { type: 'MultiPolygon', coordinates: polys }
}

// Every land polygon as its own feature (10m land comes as a few big MultiPolygons)
const landPolys = land.flatMap(f => f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates)
  .map(coordinates => ({ type: 'Feature', properties: {}, geometry: { type: 'Polygon', coordinates } }))

const largest = (multi) => multi.reduce((best, p) => {
  const a = geoArea({ type: 'Polygon', coordinates: p })
  return a > best.a ? { p, a } : best
}, { p: null, a: -1 }).p

// polygon-clipping works on plain lon/lat — fine away from the antimeridian, which none of these cross
function cutOut(clipRing, from) {
  const ring = clipRing[0][0] === clipRing.at(-1)[0] && clipRing[0][1] === clipRing.at(-1)[1] ? clipRing : [...clipRing, clipRing[0]]
  const bbox = ring.reduce((b, [x, y]) => [Math.min(b[0], x), Math.min(b[1], y), Math.max(b[2], x), Math.max(b[3], y)], [Infinity, Infinity, -Infinity, -Infinity])
  const near = from.filter(f => {
    const r = f.geometry.coordinates[0]
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity
    for (const [x, y] of r) { if (x < x0) x0 = x; if (y < y0) y0 = y; if (x > x1) x1 = x; if (y > y1) y1 = y }
    return !(x1 < bbox[0] || x0 > bbox[2] || y1 < bbox[1] || y0 > bbox[3])
  })
  return near.flatMap(f => polygonClipping.intersection([ring], f.geometry.coordinates))
}

// Lines (ocean currents, ridges, parallels): straight in lon/lat, so walk them in small steps —
// d3 would otherwise draw each stretch as a great circle, and a parallel would sag
function densify(coords, step = 1) {
  const out = [coords[0]]
  for (let i = 1; i < coords.length; i++) {
    const [x0, y0] = coords[i - 1], [x1, y1] = coords[i]
    let dx = x1 - x0
    if (Math.abs(dx) > 180) dx -= Math.sign(dx) * 360   // across the antimeridian: the short way
    const n = Math.max(1, Math.ceil(Math.max(Math.abs(dx), Math.abs(y1 - y0)) / step))
    for (let k = 1; k <= n; k++) {
      let x = x0 + dx * k / n
      if (x > 180) x -= 360; else if (x < -180) x += 360
      out.push([x, y0 + (y1 - y0) * k / n])
    }
  }
  return out
}

// Every river segment with one of these names (inside bbox, when several rivers share a name)
function riverLines(item) {
  const want = new Set([item.river].flat())
  const [w, s, e, n] = item.bbox ?? [-180, -90, 180, 90]
  const inBox = (c) => c.some(([x, y]) => x >= w && x <= e && y >= s && y <= n)
  const lines = rivers.filter(f => want.has(f.properties.name))
    .flatMap(f => f.geometry.type === 'LineString' ? [f.geometry.coordinates] : f.geometry.coordinates)
    .filter(inBox)
  if (!lines.length) throw new Error(`no river ${[...want].join(', ')}`)
  return { type: 'MultiLineString', coordinates: lines }
}

// The states with these names on the historical map of a given year (one empire = many parts)
function historical(item) {
  const want = new Set(item.names)
  const feats = history(item.hist).filter(f => want.has(f.properties.NAME))
  const missing = item.names.filter(n => !feats.some(f => f.properties.NAME === n))
  if (missing.length) throw new Error(`${item.id}: not on the ${item.hist} map: ${missing.join(', ')}`)
  return rewound({ type: 'MultiPolygon', coordinates: feats.flatMap(f => (f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates)) })
}

function geometryOf(item) {
  if (item.river) return riverLines(item)
  if (item.hist) return historical(item)
  if (item.line) return { type: 'MultiLineString', coordinates: (Array.isArray(item.line[0][0]) ? item.line : [item.line]).map(l => densify(l)) }
  if (item.point) return geoCircle().center(item.point).radius(item.r ?? 0.45)()
  if (item.marine) return partsNamed(marine, 'name', item.marine)
  if (item.lake) return partsNamed(lakes10, 'name', item.lake)
  if (item.plate) {
    const g = partsNamed(plates, 'PlateName', item.plate)
    if (!Array.isArray(item.plate)) return rewound(g)
    // a major plate plus the microplates it's usually drawn with: merge them into one shape
    try { return rewound({ type: 'MultiPolygon', coordinates: polygonClipping.union(...g.coordinates.map(p => [p])) }) } catch { return rewound(g) }
  }
  if (item.at) {
    const f = landPolys.find(p => geoContains(p, item.at))
    if (!f) throw new Error(`no land under ${item.id}`)
    return f.geometry
  }
  let clip
  if (item.ne) {
    // several features can share a name (a big region and a stray sliver): use them all
    const rs = regions.filter(f => f.properties.NAME === item.ne)
    if (!rs.length) throw new Error(`no region ${item.ne}`)
    // a region polygon's coast is rough: cut it out of the land, keep the biggest piece
    const polys = rs.flatMap(r => (r.geometry.type === 'Polygon' ? [r.geometry.coordinates] : r.geometry.coordinates))
    clip = largest(polys)[0]
  } else clip = item.clip
  // polygon-clipping winds outer rings counter-clockwise; d3-geo wants clockwise
  const pieces = cutOut(clip, landPolys).map(p => p.map(r => [...r].reverse()))
  return { type: 'Polygon', coordinates: largest(pieces) }
}

// ── Projected path strings, thinned to what a 1000 px world can show ────────
function thinPath(d, minDist = 0.6) {
  return d.replace(/M[^MZ]*Z?/g, (sub) => {
    const closed = sub.endsWith('Z')
    const pts = sub.replace(/[MZ]/g, '').split('L').map(s => s.split(',').map(Number))
    const keep = [pts[0]]
    for (let i = 1; i < pts.length; i++) {
      const [x, y] = pts[i], [px, py] = keep.at(-1)
      if (Math.hypot(x - px, y - py) >= minDist || i === pts.length - 1) keep.push(pts[i])
    }
    if (keep.length < 3 && closed) return ''
    const fmt = ([x, y]) => `${+x.toFixed(1)},${+y.toFixed(1)}`
    return 'M' + keep.map(fmt).join('L') + (closed ? 'Z' : '')
  })
}

// Plate carrée: a rectangle that uses the whole width (Natural Earth's rounded sides leave
// the corners empty and squeeze the continents into the middle)
const proj = geoEquirectangular().fitWidth(W, { type: 'Sphere' })
const yTop = proj([0, LAT_TOP])[1], yBottom = proj([0, LAT_BOTTOM])[1]
proj.translate([proj.translate()[0], proj.translate()[1] - yTop])
const H = Math.round(yBottom - yTop)
const pathGen = geoPath(proj).digits(2)
const P = (g) => thinPath(pathGen(g) ?? '')

// the background is coarser (1.2 px) than the items (0.6 px)
const PB = (g) => thinPath(pathGen(g) ?? '', 1.2)
const landD = PB({ type: 'FeatureCollection', features: countries })
const topo = topology({ c: { type: 'FeatureCollection', features: countries } }, 1e5)
const bordersD = PB(mesh(topo, topo.objects.c, (a, b) => a !== b))
const lakesD = PB({ type: 'FeatureCollection', features: lakes })
console.log('background', Math.round(landD.length / 1024), 'KB land,', Math.round(bordersD.length / 1024), 'KB borders,', Math.round(lakesD.length / 1024), 'KB lakes')

fs.mkdirSync(OUT, { recursive: true })
fs.writeFileSync(path.join(OUT, 'world.json'), JSON.stringify({ W, H, land: landD, borders: bordersD, lakes: lakesD }))
for (const [quiz, items] of Object.entries(LANDFORMS)) {
  const out = { W, H, items: [] }
  for (const item of items) {
    let g = geometryOf(item)
    if (item.line || item.river) {
      const d = P(g)
      const [cx, cy] = item.label ? proj(item.label) : pathGen.centroid(g)
      out.items.push({ id: item.id, d, cx: +cx.toFixed(1), cy: +cy.toFixed(1), small: false, line: true, ...(item.color ? { color: item.color } : {}), ...(item.arrow ? { arrow: true } : {}) })
      console.log(quiz.padEnd(11), item.id.padEnd(17), 'line'.padStart(10), `${(d.length / 1024).toFixed(1)} KB`)
      continue
    }
    // too small to draw (Gibraltar, Lake Balaton…): a small round marker instead
    if (!item.point && (!(pathGen.area(g) >= 3) || !P(g))) g = geoCircle().center(geoCentroid(g)).radius(0.45)()
    const d = P(g)
    // a scattered empire gets its badge on its biggest piece, not in the sea between them
    const biggest = item.hist && g.coordinates.length > 1 ? { type: 'Polygon', coordinates: largest(g.coordinates) } : g
    const [cx, cy] = item.label ? proj(item.label) : pathGen.centroid(biggest)
    const area = pathGen.area(g)
    out.items.push({ id: item.id, d, cx: +cx.toFixed(1), cy: +cy.toFixed(1), small: area < 90, ...(item.color ? { color: item.color } : {}) })
    console.log(quiz.padEnd(11), item.id.padEnd(17), `${Math.round(area)} px²`.padStart(10), `${(d.length / 1024).toFixed(1)} KB`)
  }
  fs.writeFileSync(path.join(OUT, `${quiz}.json`), JSON.stringify(out))
  console.log('→', path.join(OUT, `${quiz}.json`), (fs.statSync(path.join(OUT, `${quiz}.json`)).size / 1024).toFixed(0), 'KB')
}
