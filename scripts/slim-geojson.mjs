// Shrink a GeoJSON file for the browser: keep only the properties Orbis reads and
// round coordinates to 4 decimals (~11 m — far below what the globe can show).
const KEEP = new Set(['NAME', 'TYPE', 'SUBJECTO', 'PARTOF', 'featurecla', 'scalerank', 'name'])

const rounder = (k) => {
  const round = (c) => typeof c[0] === 'number' ? c.map(v => Math.round(v * k) / k) : c.map(round)
  return round
}

// Marine polygons: the app only ever shows seas, gulfs and bays with scalerank ≤ 3
// (same filter as App.jsx), and they're big enough that 3 decimals (~110 m) is plenty.
const isUsedSea = (f) => {
  const p = f.properties ?? {}
  if (!f.geometry || !p.name) return false
  if (p.scalerank > 3) return false
  if (p.name.toLowerCase().endsWith('ocean') || p.featurecla === 'ocean') return false
  return true
}

export function slimGeoJSON(data, { marine = false } = {}) {
  const round = rounder(marine ? 1e3 : 1e4)
  delete data.crs
  if (marine) data.features = (data.features ?? []).filter(isUsedSea)
  for (const f of data.features ?? []) {
    delete f.bbox
    if (f.properties) f.properties = Object.fromEntries(Object.entries(f.properties).filter(([k]) => KEEP.has(k)))
    if (f.geometry?.coordinates) f.geometry.coordinates = round(f.geometry.coordinates)
  }
  return data
}

// CLI: node scripts/slim-geojson.mjs public/data/*.geojson
if (import.meta.url === `file://${process.argv[1]}`) {
  const { readFile, writeFile, stat } = await import('node:fs/promises')
  for (const file of process.argv.slice(2)) {
    const before = (await stat(file)).size
    const data = slimGeoJSON(JSON.parse(await readFile(file, 'utf8')), { marine: file.includes('marine') })
    await writeFile(file, JSON.stringify(data))
    const after = (await stat(file)).size
    console.log(`${file}: ${(before / 1e6).toFixed(2)} MB → ${(after / 1e6).toFixed(2)} MB`)
  }
}
