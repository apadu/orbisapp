// Shrink a GeoJSON file for the browser: keep only the properties Orbis reads and
// round coordinates to 4 decimals (~11 m — far below what the globe can show).
const KEEP = new Set(['NAME', 'TYPE', 'SUBJECTO', 'PARTOF', 'featurecla', 'scalerank', 'name'])

const round = (c) => typeof c[0] === 'number'
  ? c.map(v => Math.round(v * 1e4) / 1e4)
  : c.map(round)

export function slimGeoJSON(data) {
  for (const f of data.features ?? []) {
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
    const data = slimGeoJSON(JSON.parse(await readFile(file, 'utf8')))
    await writeFile(file, JSON.stringify(data))
    const after = (await stat(file)).size
    console.log(`${file}: ${(before / 1e6).toFixed(2)} MB → ${(after / 1e6).toFixed(2)} MB`)
  }
}
