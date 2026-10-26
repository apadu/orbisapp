/**
 * Helpers for the click / line based globe games:
 * Silhouette Spin, Capital Drop, Line Up (parallels & meridians), Time Zones.
 */
import { geoContains, geoDistance } from 'd3-geo'
import { locale, t } from '../i18n'

export const shuffle = (arr) => {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const outerRings = (f) => {
  const g = f.geometry
  if (!g) return []
  if (g.type === 'Polygon') return [g.coordinates[0]]
  if (g.type === 'MultiPolygon') return g.coordinates.map(p => p[0])
  return []
}

/** Country under a clicked point; if none (sea), the nearest one within `snapKm`. */
export function countryAt(features, lon, lat, snapKm = 120) {
  const hit = features.find(f => geoContains(f, [lon, lat]))
  if (hit) return hit
  let best = null, bestKm = snapKm
  for (const f of features) {
    for (const ring of outerRings(f)) {
      for (let i = 0; i < ring.length; i += 2) {
        const km = geoDistance(ring[i], [lon, lat]) * 6371
        if (km < bestKm) { bestKm = km; best = f }
      }
    }
  }
  return best
}

/**
 * Countries a parallel (lat) or meridian (lon) passes through.
 * Exact for the map data: polygon edges are straight in lon/lat, so a ring crosses
 * the line iff it has vertices on both sides of it.
 */
export function countriesOnLine(features, line) {
  const axis = line.type === 'parallel' ? 1 : 0
  const v = line.type === 'parallel' ? line.lat : line.lon
  return features.filter(f => outerRings(f).some(ring => {
    let below = false, above = false
    for (const c of ring) {
      if (c[axis] < v) below = true; else if (c[axis] > v) above = true
      if (below && above) return true
    }
    return false
  })).map(f => f.properties.NAME)
}

export const FAMOUS_LINES = [
  { type: 'parallel', lat: 0,       label: 'The Equator' },
  { type: 'parallel', lat: 23.436,  label: 'Tropic of Cancer' },
  { type: 'parallel', lat: -23.436, label: 'Tropic of Capricorn' },
  { type: 'parallel', lat: 66.563,  label: 'Arctic Circle' },
  { type: 'meridian', lon: 0,       label: 'Prime Meridian' },
]

export function lineLabel(line) {
  if (line.label) return t(line.label)
  if (line.type === 'parallel') return t('{d}°{h} parallel', { d: Math.abs(line.lat), h: line.lat >= 0 ? 'N' : 'S' })
  return t('{d}°{h} meridian', { d: Math.abs(line.lon), h: line.lon >= 0 ? 'E' : t('W') })
}

/** A random line with between `min` and `max` countries on it. */
export function randomLine(features, kind = 'mixed', { min = 5, max = 22 } = {}) {
  for (let t = 0; t < 200; t++) {
    const type = kind === 'mixed' ? (Math.random() < 0.6 ? 'parallel' : 'meridian') : kind
    const line = type === 'parallel'
      ? { type, lat: (Math.floor(Math.random() * 25) - 9) * 5 }      // 45°S … 75°N
      : { type, lon: (Math.floor(Math.random() * 72) - 36) * 5 }     // 180°W … 175°E
    const names = countriesOnLine(features, line)
    if (names.length >= min && names.length <= max) return { ...line, names }
  }
  const line = FAMOUS_LINES[0]
  return { ...line, names: countriesOnLine(features, line) }
}

/** Point on the line closest to the "middle" of its countries — for flying the camera. */
export function lineFocus(line) {
  return line.type === 'parallel' ? { lat: line.lat, lon: 20 } : { lat: 15, lon: line.lon }
}

export function fmtKm(km) {
  return km < 10 ? `${km.toFixed(1)} km` : `${Math.round(km).toLocaleString(locale)} km`
}

/** Capital Drop scoring: 1000 for a bullseye, half at ~700 km, ~0 past 5000 km. */
export function dropPoints(km) {
  if (km <= 25) return 1000
  return Math.max(0, Math.round(1000 * Math.exp(-km / 1000)))
}

export function fmtOffset(min) {
  const s = min < 0 ? '−' : '+'
  const a = Math.abs(min)
  return `UTC${s}${Math.floor(a / 60)}${a % 60 ? ':' + String(a % 60).padStart(2, '0') : ''}`
}

/** Clock time (HH:MM) in a zone with the given offset (minutes), at `at`. */
export function clockAt(offsetMin, at = new Date()) {
  const m = ((Math.floor(at.getTime() / 60000) + offsetMin) % 1440 + 1440) % 1440
  return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`
}
