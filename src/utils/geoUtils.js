import { geoCentroid, geoDistance } from 'd3-geo'

/** Extract all [lon, lat] coordinate pairs from a GeoJSON geometry */
function extractCoords(geometry) {
  const coords = []
  const walk = (arr) => {
    if (typeof arr[0] === 'number') coords.push(arr)
    else for (const child of arr) walk(child)
  }
  walk(geometry.coordinates)
  return coords
}

/**
 * Minimum border-to-border distance in km between two GeoJSON features.
 * Samples boundary vertices (every Nth point) for performance.
 */
function minBorderDistance(f1, f2) {
  const c1 = extractCoords(f1.geometry)
  const c2 = extractCoords(f2.geometry)

  // Sample density: keep at most ~300 points per country
  const step1 = Math.max(1, Math.floor(c1.length / 300))
  const step2 = Math.max(1, Math.floor(c2.length / 300))
  const s1 = c1.filter((_, i) => i % step1 === 0)
  const s2 = c2.filter((_, i) => i % step2 === 0)

  let minRad = Infinity
  for (const p1 of s1) {
    for (const p2 of s2) {
      const d = geoDistance(p1, p2)
      if (d < minRad) {
        minRad = d
        if (minRad < 0.001) return 0 // effectively adjacent, stop early
      }
    }
  }
  return Math.round(minRad * 6371)
}

/**
 * Build a name → Set<name> adjacency map from GeoJSON features.
 * Two countries are adjacent if they share at least one coordinate point
 * (rounded to 2 decimal places to handle floating-point variance).
 */
export function computeAdjacency(features) {
  // Extract all coordinate pairs as a Set of "lon,lat" strings per country
  const extractCoords = (geometry) => {
    const set = new Set()
    const walk = (arr) => {
      if (typeof arr[0] === 'number') {
        set.add(`${arr[0].toFixed(2)},${arr[1].toFixed(2)}`)
      } else {
        for (const child of arr) walk(child)
      }
    }
    walk(geometry.coordinates)
    return set
  }

  const entries = features.map(f => ({
    name: f.properties.NAME,
    coords: extractCoords(f.geometry),
  }))

  const adj = {}
  for (const f of entries) adj[f.name] = new Set()

  for (let i = 0; i < entries.length; i++) {
    for (let j = i + 1; j < entries.length; j++) {
      const a = entries[i], b = entries[j]
      let shared = false
      // Iterate the smaller set for speed
      const [small, large] = a.coords.size <= b.coords.size ? [a.coords, b.coords] : [b.coords, a.coords]
      for (const c of small) {
        if (large.has(c)) { shared = true; break }
      }
      if (shared) {
        adj[a.name].add(b.name)
        adj[b.name].add(a.name)
      }
    }
  }
  return adj
}

/**
 * Returns distance in km and a heat color between two GeoJSON features.
 * Color: red (hot/close) → orange → yellow → blue (cold/far)
 */
export function getDistanceInfo(guessFeature, mysteryFeature) {
  const km = minBorderDistance(guessFeature, mysteryFeature)

  // Direction arrow still uses centroids (bearing between centers)
  const c1 = geoCentroid(guessFeature)
  const c2 = geoCentroid(mysteryFeature)
  const radians = geoDistance(c1, c2)

  // t = 0 → right next to mystery, t = 1 → on the other side of Earth
  // Use border km for the color, normalized against Earth's max distance ~20000 km
  const t = Math.min(km / 20000, 1)

  // Piecewise color stops for richer hot→cold gradient
  // [t_threshold, hue, saturation, lightness]
  const stops = [
    [0.00, 0,   100, 55],   // deep red
    [0.10, 10,  100, 58],   // red-orange
    [0.20, 25,  100, 58],   // orange
    [0.32, 42,  100, 56],   // amber
    [0.44, 55,  100, 54],   // yellow
    [0.55, 80,  90,  50],   // yellow-green
    [0.65, 160, 85,  48],   // teal-green
    [0.75, 195, 90,  50],   // cyan
    [0.85, 215, 95,  52],   // sky blue
    [1.00, 230, 100, 48],   // deep blue
  ]

  let h = 230, s = 100, l = 48
  for (let i = 0; i < stops.length - 1; i++) {
    const [t0, h0, s0, l0] = stops[i]
    const [t1, h1, s1, l1] = stops[i + 1]
    if (t >= t0 && t <= t1) {
      const f = (t - t0) / (t1 - t0)
      h = Math.round(h0 + f * (h1 - h0))
      s = Math.round(s0 + f * (s1 - s0))
      l = Math.round(l0 + f * (l1 - l0))
      break
    }
  }
  const color = `hsl(${h}, ${s}%, ${l}%)`

  // Arrow hint: direction from guess toward mystery
  const [lon1, lat1] = c1
  const [lon2, lat2] = c2
  const dLon = lon2 - lon1
  const dLat = lat2 - lat1
  const angle = Math.atan2(dLon, dLat) * (180 / Math.PI)

  return { km, color, angle, radians }
}

/**
 * Convert a point on the Three.js sphere (local coords) to [lon, lat].
 * Three.js SphereGeometry has y as the pole axis.
 * Vertex formula: x = -sin(θ)cos(φ), y = cos(θ), z = sin(θ)sin(φ)
 * where θ ∈ [0, π] (polar), φ ∈ [0, 2π] (azimuthal)
 */
export function spherePointToLonLat(x, y, z) {
  const lat = Math.asin(Math.max(-1, Math.min(1, y))) * (180 / Math.PI)
  // atan2(z, -x) gives φ ∈ [-π, π]; offset -π maps to longitude
  let lon = Math.atan2(z, -x) * (180 / Math.PI) - 180
  if (lon < -180) lon += 360
  return [lon, lat]
}

/**
 * Label for the distance (e.g. "🔥 128 km" or "🧊 14,200 km")
 */
export function distanceLabel(km) {
  const formatted = km.toLocaleString()
  if (km === 0) return '🎯 Correct!'
  if (km < 500)  return `🔥 ${formatted} km`
  if (km < 2000) return `♨️  ${formatted} km`
  if (km < 6000) return `🌤  ${formatted} km`
  return `🧊 ${formatted} km`
}
