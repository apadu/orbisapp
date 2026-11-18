/**
 * Pre-renders the world maps of the "Famous islands" / "Famous peninsulas" quizzes:
 * public/data/landforms/world.json — the background (land, borders, big lakes), shared — and
 * public/data/landforms/<quiz>.json — one ready-to-draw SVG path per island / peninsula.
 *
 *   node scripts/build-landforms.mjs --geo=/tmp/geo
 *   needs, from github.com/nvkelso/natural-earth-vector (geojson/):
 *     ne_10m_land, ne_10m_geography_regions_polys, ne_50m_lakes  (.geojson)
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
import { geoEquirectangular, geoPath, geoContains, geoArea } from 'd3-geo'
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

function geometryOf(item) {
  if (item.at) {
    const f = landPolys.find(p => geoContains(p, item.at))
    if (!f) throw new Error(`no land under ${item.id}`)
    return f.geometry
  }
  let clip
  if (item.ne) {
    const r = regions.find(f => f.properties.NAME === item.ne)
    if (!r) throw new Error(`no region ${item.ne}`)
    // a region polygon's coast is rough: cut it out of the land, keep the biggest piece
    const polys = r.geometry.type === 'Polygon' ? [r.geometry.coordinates] : r.geometry.coordinates
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
    const g = geometryOf(item)
    const d = P(g)
    const [cx, cy] = pathGen.centroid(g)
    const area = pathGen.area(g)
    out.items.push({ id: item.id, d, cx: +cx.toFixed(1), cy: +cy.toFixed(1), small: area < 90 })
    console.log(quiz.padEnd(11), item.id.padEnd(17), `${Math.round(area)} px²`.padStart(10), `${(d.length / 1024).toFixed(1)} KB`)
  }
  fs.writeFileSync(path.join(OUT, `${quiz}.json`), JSON.stringify(out))
  console.log('→', path.join(OUT, `${quiz}.json`), (fs.statSync(path.join(OUT, `${quiz}.json`)).size / 1024).toFixed(0), 'KB')
}
