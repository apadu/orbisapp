// Build the 2D country maps used by the "Country maps" quizzes (CountryMapQuiz).
//
//   npm run country-maps -- RO            → public/data/maps/ro.json
//   npm run country-maps -- RO HU PL      → one file per country
//
// Source: Natural Earth 1:10m admin-1 (states / provinces / counties, public domain), or
// geoBoundaries for the countries listed in COUNTRY_CONFIG; simplified with mapshaper. Each file holds the subdivisions (properties: id = ISO 3166-2
// code, name) plus the neighbouring countries clipped around them (ctx: true) for context.
// Pass --src=<path> to use an already downloaded admin-1 GeoJSON (it's ~40 MB), and
// --src-XX=<path> for a country with its own source in COUNTRY_CONFIG.
import { mkdir, readFile, writeFile, stat } from 'node:fs/promises'
import mapshaper from 'mapshaper'

const ADMIN1_URL = 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_admin_1_states_provinces.geojson'

// Per-country overrides.
//  source: use geoBoundaries (CC BY 3.0 IGO) where Natural Earth's split is out of date
//  simplify: how much detail to keep (default 20%)
//  context: false → no neighbouring countries (e.g. the USA, drawn with the Albers USA
//           projection, which can't place Canada / Mexico around Alaska and Hawaii)
const COUNTRY_CONFIG = {
  MD: { source: { url: 'https://github.com/wmgeolab/geoBoundaries/raw/main/releaseData/gbOpen/MDA/ADM1/geoBoundaries-MDA-ADM1_simplified.geojson', id: 'shapeISO', name: 'shapeName', country: 'Moldova' } },
  US: { context: false, simplify: '6%' },   // detailed coastlines and islands: simplify harder
}
const COUNTRIES = new URL('../public/data/ne_50m_admin_0_countries.geojson', import.meta.url)
const OUT = new URL('../public/data/maps/', import.meta.url)

// d3-geo draws on a sphere and wants outer rings clockwise, holes counter-clockwise (the
// opposite of RFC 7946). Rings the other way round fill the whole world instead of the shape.
const ringArea = (r) => { let a = 0; for (let i = 0, j = r.length - 1; i < r.length; j = i++) a += (r[j][0] - r[i][0]) * (r[j][1] + r[i][1]); return a }
const rewindPolygon = (rings) => rings.map((r, i) => (ringArea(r) < 0) === (i === 0) ? r : [...r].reverse())
function rewind(f) {
  const g = f.geometry
  if (g?.type === 'Polygon') g.coordinates = rewindPolygon(g.coordinates)
  else if (g?.type === 'MultiPolygon') g.coordinates = g.coordinates.map(rewindPolygon)
  return f
}

const args = process.argv.slice(2)
const src = args.find(a => a.startsWith('--src='))?.slice(6)
const codes = args.filter(a => !a.startsWith('--')).map(c => c.toUpperCase())
if (!codes.length) { console.error('Usage: npm run country-maps -- RO [HU …] [--src=admin1.geojson]'); process.exit(1) }

let admin1 = null
async function getAdmin1() {
  if (admin1) return admin1
  process.stdout.write('↓ admin-1 data … ')
  admin1 = src ? await readFile(src, 'utf8') : await (await fetch(ADMIN1_URL)).text()
  console.log(`${(admin1.length / 1e6).toFixed(1)} MB`)
  return admin1
}
const countries = await readFile(COUNTRIES, 'utf8')
await mkdir(OUT, { recursive: true })

for (const code of codes) {
  const cfg = COUNTRY_CONFIG[code] ?? {}
  // 1. Subdivisions of this country, simplified (keep-shapes: tiny ones never disappear)
  let fc, countryName
  if (cfg.source) {
    // --src-MD=<path> uses an already downloaded copy of the source file
    const local = args.find(a => a.startsWith(`--src-${code}=`))?.split('=')[1]
    const raw = local ? await readFile(local, 'utf8') : await (await fetch(cfg.source.url)).text()
    const subs = await mapshaper.applyCommands(
      `-i in.json -filter-fields ${cfg.source.id},${cfg.source.name} -rename-fields id=${cfg.source.id},name=${cfg.source.name} ` +
      `-simplify 35% keep-shapes -o out.json format=geojson precision=0.0001`, { 'in.json': raw })
    fc = JSON.parse(subs['out.json'])
    countryName = cfg.source.country
  } else {
    const subs = await mapshaper.applyCommands(
      `-i admin1.json -filter "iso_a2 === '${code}'" -filter-fields iso_3166_2,name,admin -rename-fields id=iso_3166_2 ` +
      `-simplify ${cfg.simplify ?? '20%'} keep-shapes -o out.json format=geojson precision=0.0001`,
      { 'admin1.json': await getAdmin1() })
    fc = JSON.parse(subs['out.json'])
    countryName = fc.features[0]?.properties.admin          // e.g. "Romania"
    for (const f of fc.features) delete f.properties.admin
  }
  if (!fc.features.length) { console.log(`✗ ${code}: no subdivisions found`); process.exitCode = 1; continue }

  // 2. Neighbouring countries, clipped to a padded box around the country
  let [x0, y0, x1, y1] = [180, 90, -180, -90]
  const walk = (c) => typeof c[0] === 'number' ? (x0 = Math.min(x0, c[0]), x1 = Math.max(x1, c[0]), y0 = Math.min(y0, c[1]), y1 = Math.max(y1, c[1])) : c.forEach(walk)
  fc.features.forEach(f => walk(f.geometry.coordinates))
  const px = (x1 - x0) * 0.35, py = (y1 - y0) * 0.35
  const box = [x0 - px, y0 - py, x1 + px, y1 + py].map(v => +v.toFixed(3)).join(',')
  const ctx = await mapshaper.applyCommands(
    `-i c.json -filter "NAME !== '${countryName.replace(/'/g, "\\'")}'" -clip bbox=${box} -filter-fields NAME ` +
    `-rename-fields name=NAME -each "ctx=true" -o out.json format=geojson precision=0.001`,
    { 'c.json': countries })
  const ctxFeatures = cfg.context === false ? [] : JSON.parse(ctx['out.json']).features

  const file = new URL(`${code.toLowerCase()}.json`, OUT)
  await writeFile(file, JSON.stringify({ type: 'FeatureCollection', features: [...fc.features, ...ctxFeatures].map(rewind) }))
  console.log(`✓ ${code}: ${fc.features.length} subdivisions, ${ctxFeatures.length} neighbours, ${((await stat(file)).size / 1024).toFixed(0)} KB`)
}
