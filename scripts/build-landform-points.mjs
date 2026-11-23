/**
 * Rebuilds the map file of a landform quiz whose items are all points (ports, waterfalls,
 * records…) without the Natural Earth downloads that scripts/build-landforms.mjs needs.
 * Same projection and output format as that script.
 *
 *   node scripts/build-landform-points.mjs ports [records …]
 */
import fs from 'node:fs'
import path from 'node:path'
import { geoEquirectangular, geoPath, geoCircle } from 'd3-geo'
import { LANDFORMS } from '../src/data/landforms.js'

const OUT = 'public/data/landforms'
const W = 1000
const LAT_TOP = 84, LAT_BOTTOM = -57

const proj = geoEquirectangular().fitWidth(W, { type: 'Sphere' })
const yTop = proj([0, LAT_TOP])[1], yBottom = proj([0, LAT_BOTTOM])[1]
proj.translate([proj.translate()[0], proj.translate()[1] - yTop])
const H = Math.round(yBottom - yTop)
const pathGen = geoPath(proj).digits(2)

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

for (const set of process.argv.slice(2)) {
  const items = LANDFORMS[set]
  if (!items) throw new Error(`no set ${set}`)
  const out = { W, H, items: [] }
  for (const item of items) {
    if (!item.point) throw new Error(`${set}/${item.id} is not a point: use build-landforms.mjs`)
    const g = geoCircle().center(item.point).radius(item.r ?? 0.45)()
    const [cx, cy] = item.label ? proj(item.label) : pathGen.centroid(g)
    const area = pathGen.area(g)
    out.items.push({ id: item.id, d: thinPath(pathGen(g) ?? ''), cx: +cx.toFixed(1), cy: +cy.toFixed(1), small: area < 90, ...(item.color ? { color: item.color } : {}) })
  }
  const file = path.join(OUT, `${set}.json`)
  fs.writeFileSync(file, JSON.stringify(out))
  console.log('→', file, out.items.length, 'items')
}
