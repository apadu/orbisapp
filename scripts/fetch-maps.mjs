// Download the map data into public/data so Orbis serves it itself.
// Usage: npm run fetch-maps
import { mkdir, writeFile, stat } from 'node:fs/promises'
import { DATA_SOURCES } from '../src/data/sources.js'
import { slimGeoJSON } from './slim-geojson.mjs'

const OUT = new URL('../public/data/', import.meta.url)
await mkdir(OUT, { recursive: true })

for (const [key, { file, url }] of Object.entries(DATA_SOURCES)) {
  process.stdout.write(`↓ ${key.padEnd(12)} ${file} … `)
  const res = await fetch(url)
  if (!res.ok) { console.log(`failed (HTTP ${res.status})`); process.exitCode = 1; continue }
  const text = await res.text()
  const data = slimGeoJSON(JSON.parse(text)) // valid JSON + keep only what the app needs
  await writeFile(new URL(file, OUT), JSON.stringify(data))
  const { size } = await stat(new URL(file, OUT))
  console.log(`${(size / 1024 / 1024).toFixed(2)} MB`)
}
// ── Flags (SVG, from flagcdn.com) → public/flags/<code>.svg ──────────────
const { COUNTRY_INFO } = await import('../src/utils/countryInfo.js')
const FLAGS = new URL('../public/flags/', import.meta.url)
await mkdir(FLAGS, { recursive: true })
const codes = [...new Set(Object.values(COUNTRY_INFO).map(({ flag }) => {
  const cps = [...(flag ?? '')].map(c => c.codePointAt(0))
  return cps.length === 2 ? cps.map(p => String.fromCharCode(p - 0x1F1E6 + 97)).join('') : null
}).filter(Boolean))]
let ok = 0
process.stdout.write(`↓ flags        ${codes.length} SVGs … `)
for (const code of codes) {
  const res = await fetch(`https://flagcdn.com/${code}.svg`)
  if (!res.ok) { console.log(`\n  ⚠ ${code}: HTTP ${res.status}`); process.exitCode = 1; continue }
  await writeFile(new URL(`${code}.svg`, FLAGS), await res.text())
  ok++
}
console.log(`${ok}/${codes.length}`)

console.log('Done — files are in public/data/ and public/flags/. Commit them so your server ships them.')
