// Download the map data into public/data so Orbis serves it itself.
// Usage: npm run fetch-maps
import { mkdir, writeFile, stat } from 'node:fs/promises'
import { DATA_SOURCES } from '../src/data/sources.js'

const OUT = new URL('../public/data/', import.meta.url)
await mkdir(OUT, { recursive: true })

for (const [key, { file, url }] of Object.entries(DATA_SOURCES)) {
  process.stdout.write(`↓ ${key.padEnd(12)} ${file} … `)
  const res = await fetch(url)
  if (!res.ok) { console.log(`failed (HTTP ${res.status})`); process.exitCode = 1; continue }
  const text = await res.text()
  JSON.parse(text) // sanity check: must be valid JSON
  await writeFile(new URL(file, OUT), text)
  const { size } = await stat(new URL(file, OUT))
  console.log(`${(size / 1024 / 1024).toFixed(2)} MB`)
}
console.log('Done — files are in public/data/. Commit them so your server ships them.')
