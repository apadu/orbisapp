/**
 * The country map the globe downloads on every visit, as TopoJSON: shared borders are stored
 * once and coordinates are quantized (1e6 steps ≈ 40 m), so it's about half the size of the
 * Natural Earth GeoJSON once gzipped. Only the properties the app reads are kept (NAME, TYPE).
 *
 *   node scripts/build-countries-topo.mjs
 *   reads public/data/ne_50m_admin_0_countries.geojson (kept for the other build scripts),
 *   writes public/data/countries.topo.json
 */
import fs from 'node:fs'
import { topology } from 'topojson-server'

const src = JSON.parse(fs.readFileSync('public/data/ne_50m_admin_0_countries.geojson', 'utf8'))
const countries = {
  type: 'FeatureCollection',
  features: src.features.filter(f => f.geometry).map(f => ({
    type: 'Feature',
    properties: { NAME: f.properties.NAME, TYPE: f.properties.TYPE },
    geometry: f.geometry,
  })),
}
const json = JSON.stringify(topology({ countries }, 1e6))
fs.writeFileSync('public/data/countries.topo.json', json)
console.log(`✓ ${countries.features.length} countries, ${(json.length / 1024).toFixed(0)} KB`)
