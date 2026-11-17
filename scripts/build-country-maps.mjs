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
  // Natural Earth has provinces / departments here: merge them into regions
  IT: { dissolve: true },
  FR: { dissolve: true, exclude: ['FR-GUF', 'FR-MTQ', 'FR-GUA', 'FR-LRE', 'FR-MAY'] },  // metropolitan France
  // shift: move far-off islands closer, as an inset (drawn in a dashed frame) — [Δlon, Δlat]
  ES: { dissolve: true, simplify: '15%', shift: { 'ES-CN': [3, 7.5] }, ids: {
    'Andalucía': 'ES-AN', 'Aragón': 'ES-AR', 'Asturias': 'ES-AS', 'Islas Baleares': 'ES-IB', 'Canary Is.': 'ES-CN',
    'Cantabria': 'ES-CB', 'Castilla y León': 'ES-CL', 'Castilla-La Mancha': 'ES-CM', 'Cataluña': 'ES-CT', 'Ceuta': 'ES-CE',
    'Extremadura': 'ES-EX', 'Galicia': 'ES-GA', 'La Rioja': 'ES-RI', 'Madrid': 'ES-MD', 'Melilla': 'ES-ML', 'Murcia': 'ES-MC',
    'Foral de Navarra': 'ES-NC', 'País Vasco': 'ES-PV', 'Valenciana': 'ES-VC' } },
  JP: { simplify: '12%', minIsland: '400km2', shift: { 'JP-47': [5, 5] } },   // drop the tiny outlying islands (Ogasawara…) so Honshu isn't a speck
  // group: a mapshaper expression that sets `grp` per feature; features are merged by it and
  // `ids` turns each grp into the id used by the data file.
  // UK: the 12 ITL1 regions (9 English regions + Scotland, Wales, Northern Ireland)
  GB: { simplify: '10%', minIsland: '60km2', group: "grp = geonunit === 'England' ? region : geonunit", ids: {
    'North East': 'GB-NEE', 'North West': 'GB-NWE', 'Yorkshire and the Humber': 'GB-YHE', 'East Midlands': 'GB-EME',
    'West Midlands': 'GB-WME', 'East': 'GB-EEE', 'Greater London': 'GB-LND', 'South East': 'GB-SEE', 'South West': 'GB-SWE',
    'Scotland': 'GB-SCT', 'Wales': 'GB-WLS', 'Northern Ireland': 'GB-NIR' } },
  // Hungary: 19 counties + Budapest; Natural Earth also has 23 cities with county rights → back into their county
  HU: { group: "grp = ({'HU-SN':'HU-GS','HU-GY':'HU-GS','HU-SD':'HU-CS','HU-HV':'HU-CS','HU-ST':'HU-NO','HU-SK':'HU-JN','HU-ED':'HU-PE','HU-EG':'HU-HE','HU-MI':'HU-BZ','HU-DU':'HU-FE','HU-SF':'HU-FE','HU-KM':'HU-BK','HU-TB':'HU-KE','HU-SH':'HU-VA','HU-ZE':'HU-ZA','HU-NK':'HU-ZA','HU-VM':'HU-VE','HU-KV':'HU-SO','HU-PS':'HU-BA','HU-SS':'HU-TO','HU-BC':'HU-BE','HU-DE':'HU-HB','HU-NY':'HU-SZ'})[iso_3166_2] || iso_3166_2" },
  // Australia: the 8 states and territories (no Jervis Bay, Lord Howe, Macquarie, Ashmore and Cartier)
  AU: { simplify: '12%', minIsland: '300km2', filter: "['Jervis Bay Territory','Lord Howe Island','Macquarie Island','Ashmore and Cartier Islands'].indexOf(name) === -1" },
  CA: { simplify: '6%', minIsland: '2000km2' },   // the Arctic archipelago is huge in detail
  BR: { simplify: '12%', minIsland: '200km2' },
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
    const excl = (cfg.exclude ?? []).map(c => `'${c}'`).join(',')
    const pick = `-filter "iso_a2 === '${code}'${excl ? ` && ![${excl}].includes((region_cod || '').trim())` : ''}${cfg.filter ? ` && (${cfg.filter})` : ''}"`
    const shape = cfg.group
      ? `-each "${cfg.group.replace(/"/g, '\\"')}" -dissolve grp copy-fields=admin -each "id = grp, name = grp"`
      : cfg.dissolve
      // provinces → regions: merge by region, the region's code becomes the id
      ? `-each "region_cod = (region_cod || '').trim()" -dissolve region copy-fields=region_cod,admin -rename-fields name=region,id=region_cod`
      : `-filter-fields iso_3166_2,name,admin -rename-fields id=iso_3166_2`
    const islands = cfg.minIsland ? `-filter-islands min-area=${cfg.minIsland} remove-empty` : ''
    const subs = await mapshaper.applyCommands(
      `-i admin1.json ${pick} ${shape} ${islands} ` +
      `-simplify ${cfg.simplify ?? '20%'} keep-shapes -o out.json format=geojson precision=0.0001`,
      { 'admin1.json': await getAdmin1() })
    fc = JSON.parse(subs['out.json'])
    countryName = fc.features[0]?.properties.admin          // e.g. "Romania"
    for (const f of fc.features) {
      delete f.properties.admin
      if (cfg.ids) f.properties.id = cfg.ids[f.properties.name] ?? f.properties.id
    }
  }
  if (!fc.features.length) { console.log(`✗ ${code}: no subdivisions found`); process.exitCode = 1; continue }

  // 1b. Insets: move far-off islands next to the mainland and frame them
  const frames = []
  for (const f of fc.features) {
    const d = cfg.shift?.[f.properties.id]
    if (!d) continue
    let [a0, b0, a1, b1] = [180, 90, -180, -90]
    const move = (c) => typeof c[0] === 'number'
      ? (c[0] = +(c[0] + d[0]).toFixed(4), c[1] = +(c[1] + d[1]).toFixed(4), a0 = Math.min(a0, c[0]), a1 = Math.max(a1, c[0]), b0 = Math.min(b0, c[1]), b1 = Math.max(b1, c[1]))
      : c.forEach(move)
    move(f.geometry.coordinates)
    const p = 0.35
    frames.push({ type: 'Feature', properties: { frame: true, of: f.properties.id },
      geometry: { type: 'LineString', coordinates: [[a0 - p, b0 - p], [a1 + p, b0 - p], [a1 + p, b1 + p], [a0 - p, b1 + p], [a0 - p, b0 - p]] } })
  }

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
  await writeFile(file, JSON.stringify({ type: 'FeatureCollection', features: [...fc.features, ...ctxFeatures, ...frames].map(rewind) }))
  console.log(`✓ ${code}: ${fc.features.length} subdivisions, ${ctxFeatures.length} neighbours, ${((await stat(file)).size / 1024).toFixed(0)} KB`)
}
