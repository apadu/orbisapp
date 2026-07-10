import { useEffect, useRef, useCallback } from 'react'
import * as THREE from 'three'
import { geoEquirectangular, geoPath, geoCentroid, geoBounds } from 'd3-geo'

const CANVAS_W = 4096
const CANVAS_H = 2048


// Countries that get a semi-transparent white ellipse marker.
// Includes accent variants since Natural Earth NAME field varies by version.
// Countries that get a convex-hull territory blob instead of an ellipse
const HULL_COUNTRIES = new Set(['Bahamas', 'Solomon Islands', 'Marshall Islands', 'Comoros', 'Mauritius'])
// Extra canvas-pixel padding around each hull point (inflates the blob)
const HULL_PAD = 2

// Collect all projected [x,y] points from every ring of a feature's geometry
function collectProjectedPoints(feature, proj) {
  const pts = []
  const geom = feature.geometry
  const rings = geom.type === 'Polygon'
    ? [geom.coordinates[0]]
    : geom.type === 'MultiPolygon'
      ? geom.coordinates.map(p => p[0])
      : []
  for (const ring of rings) {
    for (const coord of ring) {
      const p = proj(coord)
      if (p && isFinite(p[0]) && isFinite(p[1])) pts.push(p)
    }
  }
  return pts
}

// Gift-wrapping convex hull — returns ordered hull points
function convexHull(pts) {
  const n = pts.length
  if (n < 3) return pts
  const cross = (o, a, b) => (a[0]-o[0])*(b[1]-o[1]) - (a[1]-o[1])*(b[0]-o[0])
  let l = 0
  for (let i = 1; i < n; i++) if (pts[i][0] < pts[l][0]) l = i
  const hull = []; let p = l, itr = 0
  do {
    hull.push(pts[p])
    let q = (p + 1) % n
    for (let i = 0; i < n; i++) if (cross(pts[p], pts[q], pts[i]) < 0) q = i
    p = q
    if (++itr > n + 2) break
  } while (p !== l)
  return hull
}

// Inflate each hull point outward from the centroid by `pad` pixels
function expandHull(hull, pad) {
  const cx = hull.reduce((s, p) => s + p[0], 0) / hull.length
  const cy = hull.reduce((s, p) => s + p[1], 0) / hull.length
  return hull.map(([x, y]) => {
    const dx = x - cx, dy = y - cy
    const d = Math.sqrt(dx*dx + dy*dy) || 1
    return [x + (dx/d)*pad, y + (dy/d)*pad]
  })
}

// Draw the hull as a smooth closed bezier curve (midpoint method)
function drawSmoothHull(ctx, hull) {
  if (hull.length < 2) return
  const n = hull.length
  const mid = (a, b) => [(a[0]+b[0])/2, (a[1]+b[1])/2]
  ctx.beginPath()
  const start = mid(hull[n-1], hull[0])
  ctx.moveTo(start[0], start[1])
  for (let i = 0; i < n; i++) {
    const m = mid(hull[i], hull[(i+1)%n])
    ctx.quadraticCurveTo(hull[i][0], hull[i][1], m[0], m[1])
  }
  ctx.closePath()
}

const ELLIPSE_COUNTRIES = new Set([
  'Malta',
  'Cabo Verde', 'Cape Verde',
  'Sao Tome and Principe',
  'Seychelles', 'Maldives',
  'Fiji', 'Kiribati', 'Tuvalu', 'Nauru', 'Palau', 'Tonga',
  'Vanuatu', 'Marshall Is.',
  'Federated States of Micronesia', 'Micronesia', 'Samoa',
])

// Canvas is 4096×2048 covering 360°×180° → 1 px ≈ 0.0879°
// Exposed so App.jsx can use the same centers for click detection
export const FIXED_ELLIPSE_CENTERS = {
  'Malta':                          { lon:  14.4, lat:  35.9, rx: 14, ry: 11 },
  'Fiji':                           { lon: 178,   lat: -18,   rx: 32, ry: 20 },
  'Kiribati':                       { lon: 173,   lat:   1,   rx: 24, ry: 14 },
  'Federated States of Micronesia': { lon: 153,   lat:   7,   rx: 44, ry: 14 },
  'Tuvalu':                         { lon: 179,   lat:  -8,   rx: 10, ry: 24 },
  'Marshall Islands':               { lon: 168,   lat:   7,   rx: 18, ry: 26 },
  'Samoa':                          { lon: -172,  lat: -13.5, rx: 16, ry: 12 },
}

export const HULL_COUNTRY_NAMES = new Set([
  'Bahamas', 'Solomon Islands', 'Marshall Islands', 'Comoros', 'Mauritius',
])

// When a country is guessed, these satellite countries get the same color
const LINKED_COUNTRIES = {
  'Greenland': 'Denmark',
}

// These territories are drawn merged into their host country (same canvas path → no visible border)
const DISPLAY_MERGE = {
  'W. Sahara': 'Mauritania',
}

// Countries where geoBounds is unreliable (antimeridian crossers or weirdly shaped).
// lon/lat = visual center to project; rx/ry = canvas pixels.
// Note: keys here use the raw GeoJSON names (pre-override) for the rendering pass.
const FIXED_ELLIPSE = {
  'Malta':            { lon:  14.4, lat:  35.9, rx: 14, ry: 11 },
  'Fiji':             { lon: 178,   lat: -18,  rx: 32, ry: 20 },
  'Kiribati':         { lon: 173,   lat:   1,  rx: 24, ry: 14 },
  'Federated States of Micronesia': { lon: 153, lat: 7, rx: 44, ry: 14 },
  'Micronesia':       { lon: 153,   lat:   7,  rx: 44, ry: 14 },
  'Tuvalu':           { lon: 179,   lat:  -8,  rx: 10, ry: 24 },
  'Marshall Is.':    { lon: 168,   lat:   7,  rx: 18, ry: 26 },
  'Samoa':           { lon: -172,  lat: -13.5, rx: 16, ry: 12 },
}

const PAD   = 6   // extra px padding around the bounding box
const MIN_R = 8   // minimum radius

// ─── Draw all countries + tiny-country markers onto an offscreen canvas ──────
function redrawTexture(canvas, countries, guessMap, mysteryName, gameWon, highlightedName, missedSet, locateMarker, hiddenSet, soloMode, locateCorrectMarker) {
  const ctx = canvas.getContext('2d')
  const proj = geoEquirectangular()
    .scale(CANVAS_W / (2 * Math.PI))
    .translate([CANVAS_W / 2, CANVAS_H / 2])
  const path = geoPath().projection(proj).context(ctx)

  // Ocean
  ctx.fillStyle = '#1254c0'
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H)

  // ── Arctic ice cap (gradient band at top of equirectangular canvas) ────────
  // lat 72°N → y = (90-72)/180 * CANVAS_H from top
  const arcticY = (90 - 72) / 180 * CANVAS_H
  const arcticGrad = ctx.createLinearGradient(0, 0, 0, arcticY)
  arcticGrad.addColorStop(0,   'rgba(220,240,255,0.96)')
  arcticGrad.addColorStop(0.65,'rgba(200,230,255,0.55)')
  arcticGrad.addColorStop(1,   'rgba(200,230,255,0)')
  ctx.fillStyle = arcticGrad
  ctx.fillRect(0, 0, CANVAS_W, arcticY)


  // Build a lookup of merged-territory features keyed by host name
  const mergedFeatures = {}
  for (const feature of countries) {
    const host = DISPLAY_MERGE[feature.properties.NAME]
    if (host) {
      if (!mergedFeatures[host]) mergedFeatures[host] = []
      mergedFeatures[host].push(feature)
    }
  }
  const isMergedTerritory = name => DISPLAY_MERGE[name] != null

  // ── Pass 1: fill + stroke all country polygons ───────────────────────────
  // For hosts with merged territories: fill combined path (no internal border
  // in the fill), then stroke the HOST outline only (not merged territory outlines).
  // Track fill color per host for the post-pass below.
  const hostFillColors = {}

  for (const feature of countries) {
    const name = feature.properties.NAME
    if (isMergedTerritory(name)) continue

    // Linked countries (e.g. Greenland follows Denmark's color)
    const linkedName = LINKED_COUNTRIES[name]
    const effectiveColor = guessMap[name] ?? (linkedName ? guessMap[linkedName] : null)

    // Antarctica: solid white landmass, no game logic
    if (name === 'Antarctica') {
      ctx.beginPath()
      path(feature)
      ctx.fillStyle = '#ffffff'
      ctx.fill()
      ctx.strokeStyle = '#ccddee'
      ctx.lineWidth = 0.7
      ctx.stroke()
      continue
    }

    // In solo mode every country defaults to ocean unless it's highlighted / guessed / missed
    const isOcean =
      hiddenSet?.has(name) ||
      (soloMode &&
        !effectiveColor &&
        name !== highlightedName &&
        !missedSet?.has(name) &&
        !(gameWon && name === mysteryName))

    let fillStyle
    if (isOcean) {
      fillStyle = '#1254c0'
    } else if (gameWon && name === mysteryName) {
      fillStyle = '#39ff14'
    } else if (name === highlightedName) {
      fillStyle = '#f97316'
    } else if (effectiveColor) {
      fillStyle = effectiveColor
    } else if (missedSet?.has(name) || (linkedName && missedSet?.has(linkedName))) {
      fillStyle = '#ef4444'
    } else {
      fillStyle = '#22c45c'
    }

    // Fill: combined path includes merged territories (no internal border visible)
    ctx.beginPath()
    path(feature)
    if (mergedFeatures[name]) {
      for (const mf of mergedFeatures[name]) path(mf)
      hostFillColors[name] = fillStyle
    }
    ctx.fillStyle = fillStyle
    ctx.fill()

    // Stroke: host polygon ONLY — avoids drawing the shared edge with merged territory
    // Ocean-colored countries get an ocean stroke so borders are invisible too
    ctx.beginPath()
    path(feature)
    ctx.strokeStyle = fillStyle === '#1254c0' ? '#1254c0' : '#071a42'
    ctx.lineWidth = 0.7
    ctx.stroke()
  }

  // ── Pass 1b: erase internal borders + restore exterior edges for merged territories
  //
  // Problem: the host's stroke (pass 1) draws a ~0.7px line along the shared
  // boundary (0.35px into each polygon). We need to erase that internal line
  // while keeping the exterior borders (Morocco + coast for W. Sahara).
  //
  // Strategy:
  //  1. Stroke the merged territory with the FILL color at 2× lineWidth → erases
  //     all its border strokes on both sides of every edge (1px coverage > 0.35px)
  //  2. Re-fill the merged territory so its interior is clean
  //  3. Clip to the complement of (host ∪ merged), then stroke at 2× lineWidth →
  //     only the external half of the stroke is visible, but at 2× width that
  //     half equals a normal 0.7px border
  for (const [hostName, fillColor] of Object.entries(hostFillColors)) {
    const hostFeature = countries.find(f => f.properties.NAME === hostName)
    const mfs = mergedFeatures[hostName]
    if (!hostFeature || !mfs) continue

    // Step 1: paint over every edge of the merged territory with fill color
    for (const mf of mfs) {
      ctx.beginPath()
      path(mf)
      ctx.strokeStyle = fillColor
      ctx.lineWidth = 2.0   // 1px on each side — fully covers 0.35px host stroke
      ctx.stroke()
    }

    // Step 2: re-fill merged territory (clean fill over any bleed)
    for (const mf of mfs) {
      ctx.beginPath()
      path(mf)
      ctx.fillStyle = fillColor
      ctx.fill()
    }

    // Step 3: restore exterior borders with clip to complement of (host + merged).
    // Stroking at 1.4px means 0.7px goes into the neighboring country (drawn) and
    // 0.7px into the merged area (clipped) → net visible width = normal 0.7px.
    ctx.save()
    ctx.beginPath()
    ctx.rect(0, 0, CANVAS_W, CANVAS_H)
    path(hostFeature)           // Mauritania
    for (const mf of mfs) path(mf)  // W. Sahara
    ctx.clip('evenodd')         // clip = everything OUTSIDE (Mauritania ∪ W. Sahara)

    for (const mf of mfs) {
      ctx.beginPath()
      path(mf)
      ctx.strokeStyle = hostFillColors[hostName] === '#1254c0' ? '#1254c0' : '#071a42'
      ctx.lineWidth = 1.4       // doubled so only external half → 0.7px apparent width
      ctx.stroke()
    }
    ctx.restore()
  }

  // ── Pass 2a: convex-hull territory blob for archipelago countries ────────
  for (const feature of countries) {
    const name = feature.properties.NAME
    if (!HULL_COUNTRIES.has(name)) continue

    const pts = collectProjectedPoints(feature, proj)
    if (pts.length < 3) continue
    const hull = expandHull(convexHull(pts), HULL_PAD)
    if (hull.length < 3) continue

    const linkedName = LINKED_COUNTRIES[name]
    const guessColor = guessMap[name] ?? (linkedName ? guessMap[linkedName] : null)
    const isWinner   = gameWon && name === mysteryName
    const isHidden   = hiddenSet?.has(name) ||
      (soloMode && !guessColor && name !== highlightedName && !missedSet?.has(name) && !isWinner)

    let blobFill, blobStroke
    if (isHidden) {
      blobFill   = '#1254c0'
      blobStroke = '#1254c0'
    } else if (isWinner) {
      blobFill   = '#39ff14'; blobStroke = '#39ff14'
    } else if (name === highlightedName) {
      blobFill   = '#f97316'; blobStroke = '#f97316'
    } else if (guessColor) {
      blobFill   = guessColor; blobStroke = guessColor
    } else if (missedSet?.has(name)) {
      blobFill   = '#ef4444'; blobStroke = '#ef4444'
    } else {
      blobFill   = 'rgba(255,255,255,0.38)'; blobStroke = 'rgba(255,255,255,0.55)'
    }

    drawSmoothHull(ctx, hull)
    ctx.fillStyle = blobFill
    ctx.fill()
    ctx.strokeStyle = blobStroke
    ctx.lineWidth = 1.2
    ctx.stroke()
  }

  // ── Pass 2: semi-transparent ellipse over small / island countries ──────
  for (const feature of countries) {
    const name = feature.properties.NAME
    if (!ELLIPSE_COUNTRIES.has(name)) continue

    let rx, ry, cx, cy

    if (FIXED_ELLIPSE[name]) {
      // Antimeridian-crossing: use hardcoded visual center + size
      const { lon, lat, rx: frx, ry: fry } = FIXED_ELLIPSE[name]
      const cp = proj([lon, lat])
      if (!cp) continue
      ;[cx, cy] = cp
      rx = frx
      ry = fry
    } else {
      // Derive ellipse size from the projected bounding box
      let bounds
      try { bounds = geoBounds(feature) } catch { continue }
      const [[minLon, minLat], [maxLon, maxLat]] = bounds

      // Project the four corners and take the pixel extent
      const p1 = proj([minLon, minLat])
      const p2 = proj([maxLon, maxLat])
      if (!p1 || !p2) continue

      const pxW = Math.abs(p2[0] - p1[0])
      const pxH = Math.abs(p2[1] - p1[1])

      rx = Math.max(MIN_R, pxW / 2 + PAD)
      ry = Math.max(MIN_R, pxH / 2 + PAD)

      // Center on the midpoint of the bounding box (better than centroid for archipelagos)
      cx = (p1[0] + p2[0]) / 2
      cy = (p1[1] + p2[1]) / 2
    }

    // Ellipse color: guess color when guessed, white semi-transparent otherwise
    const linkedName = LINKED_COUNTRIES[name]
    const guessColor = guessMap[name] ?? (linkedName ? guessMap[linkedName] : null)
    const isWinner = gameWon && name === mysteryName
    const isEllipseHidden = hiddenSet?.has(name) ||
      (soloMode && !guessColor && name !== highlightedName && !missedSet?.has(name) && !isWinner)

    ctx.save()
    ctx.translate(cx, cy)
    ctx.beginPath()
    ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2)
    if (isEllipseHidden) {
      ctx.fillStyle = '#1254c0'  // exact ocean color → invisible
    } else if (isWinner) {
      ctx.fillStyle = '#39ff14'
    } else if (name === highlightedName) {
      ctx.fillStyle = '#f97316'
    } else if (guessColor) {
      ctx.fillStyle = guessColor
    } else if (missedSet?.has(name)) {
      ctx.fillStyle = '#ef4444'
    } else {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.45)'
    }
    ctx.fill()
    ctx.restore()
  }

  // ── Locate marker: dot where the user clicked ────────────────────────────
  if (locateMarker) {
    const proj2 = geoEquirectangular()
      .scale(CANVAS_W / (2 * Math.PI))
      .translate([CANVAS_W / 2, CANVAS_H / 2])
    const pt = proj2([locateMarker.lon, locateMarker.lat])
    if (pt) {
      const [mx, my] = pt
      const r = 13   // head radius
      const stem = 32 // stem length

      ctx.save()
      ctx.translate(mx, my)

      // Drop shadow
      ctx.shadowColor = 'rgba(0,0,0,0.5)'
      ctx.shadowBlur = 12
      ctx.shadowOffsetX = 4
      ctx.shadowOffsetY = 6

      // Pin body (teardrop): circle + triangle pointing down
      ctx.beginPath()
      ctx.arc(0, -stem + r, r, Math.PI * 0.15, Math.PI * 0.85, true)  // top arc
      ctx.lineTo(0, 0)  // tip
      ctx.closePath()
      ctx.fillStyle = '#ff3366'
      ctx.fill()
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 3
      ctx.stroke()

      ctx.shadowColor = 'transparent'

      // Inner dot (hole in pin head)
      ctx.beginPath()
      ctx.arc(0, -stem + r, r * 0.38, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(255,255,255,0.85)'
      ctx.fill()

      ctx.restore()
    }
  }

  // ── Correct-location marker: green pin at target country centroid ─────────
  if (locateCorrectMarker) {
    const proj2 = geoEquirectangular()
      .scale(CANVAS_W / (2 * Math.PI))
      .translate([CANVAS_W / 2, CANVAS_H / 2])
    const pt = proj2([locateCorrectMarker.lon, locateCorrectMarker.lat])
    if (pt) {
      const [mx, my] = pt
      const r = 13
      const stem = 32

      ctx.save()
      ctx.translate(mx, my)

      ctx.shadowColor = 'rgba(0,0,0,0.5)'
      ctx.shadowBlur = 12
      ctx.shadowOffsetX = 4
      ctx.shadowOffsetY = 6

      ctx.beginPath()
      ctx.arc(0, -stem + r, r, Math.PI * 0.15, Math.PI * 0.85, true)
      ctx.lineTo(0, 0)
      ctx.closePath()
      ctx.fillStyle = '#22c55e'
      ctx.fill()
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 3
      ctx.stroke()

      ctx.shadowColor = 'transparent'

      ctx.beginPath()
      ctx.arc(0, -stem + r, r * 0.38, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(255,255,255,0.85)'
      ctx.fill()

      ctx.restore()
    }
  }
}

// ─── Globe Component ─────────────────────────────────────────────────────────
export default function Globe({ countries, guesses, mystery, gameWon, highlighted, missed, onGlobeClick, locateMarker, locateCorrectMarker, spinEnabled = true, hiddenCountries, soloMode, lightMode, flyToFeature }) {
  const mountRef  = useRef(null)
  const rendRef   = useRef(null)
  const sphereRef = useRef(null)
  const texRef    = useRef(null)
  const canvasRef = useRef(null)
  const camRef    = useRef(null)
  const animRef   = useRef(null)
  const sceneRef  = useRef(null)
  const drag      = useRef({ active: false, prev: { x: 0, y: 0 } })
  const autoRotate = useRef(true)
  const autoTimer  = useRef(null)
  const raycaster  = useRef(new THREE.Raycaster())
  const spinRef    = useRef(spinEnabled)
  const flyTarget  = useRef(null) // { y, x } target rotation in radians
  const camTargetZ = useRef(null) // smooth camera zoom target

  // ── Init Three.js scene ──────────────────────────────────────────────────
  useEffect(() => {
    if (!mountRef.current || countries.length === 0) return
    const el = mountRef.current
    const W = el.clientWidth
    const H = el.clientHeight

    const offscreen = document.createElement('canvas')
    offscreen.width  = CANVAS_W
    offscreen.height = CANVAS_H
    canvasRef.current = offscreen

    const scene = new THREE.Scene()
    scene.background = new THREE.Color('#040c1c')
    sceneRef.current = scene

    const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 500)
    camera.position.z = 3.0
    camRef.current = camera

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(W, H)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    el.appendChild(renderer.domElement)
    rendRef.current = renderer

    const texture = new THREE.CanvasTexture(offscreen)
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy()
    texture.minFilter = THREE.LinearMipmapLinearFilter
    texture.generateMipmaps = true
    texRef.current = texture
    redrawTexture(offscreen, countries, {}, null, false, null)
    texture.needsUpdate = true

    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(1, 72, 72),
      new THREE.MeshPhongMaterial({ map: texture, specular: new THREE.Color(0x222233), shininess: 20 })
    )
    scene.add(sphere)
    sphereRef.current = sphere

    // Atmosphere halo
    scene.add(new THREE.Mesh(
      new THREE.SphereGeometry(1.025, 72, 72),
      new THREE.MeshPhongMaterial({ color: '#5ab4ff', transparent: true, opacity: 0.18, side: THREE.FrontSide })
    ))

    // Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.65))
    const sun = new THREE.DirectionalLight(0xfff0d0, 1.1)
    sun.position.set(5, 3, 5)
    scene.add(sun)
    const fill = new THREE.DirectionalLight(0x4488ff, 0.3)
    fill.position.set(-5, -2, -3)
    scene.add(fill)

    // Starfield
    const starPos = new Float32Array(3000 * 3)
    for (let i = 0; i < starPos.length; i++) starPos[i] = (Math.random() - 0.5) * 200
    const starGeo = new THREE.BufferGeometry()
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3))
    scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.06 })))

    const animate = () => {
      animRef.current = requestAnimationFrame(animate)
      if (flyTarget.current) {
        const t = flyTarget.current
        // Shortest-path lerp on Y (handles wrapping)
        let dy = t.y - sphere.rotation.y
        if (dy >  Math.PI) dy -= Math.PI * 2
        if (dy < -Math.PI) dy += Math.PI * 2
        sphere.rotation.y += dy * 0.06
        sphere.rotation.x += (t.x - sphere.rotation.x) * 0.06
        // Stop when close enough
        if (Math.abs(dy) < 0.001 && Math.abs(t.x - sphere.rotation.x) < 0.001) {
          sphere.rotation.y = t.y
          sphere.rotation.x = t.x
          flyTarget.current = null
        }
      } else if (autoRotate.current && !drag.current.active && spinRef.current) {
        sphere.rotation.y += 0.0008
      }
      // Smooth camera zoom
      if (camTargetZ.current !== null) {
        camera.position.z += (camTargetZ.current - camera.position.z) * 0.05
        if (Math.abs(camera.position.z - camTargetZ.current) < 0.005) {
          camera.position.z = camTargetZ.current
          camTargetZ.current = null
        }
      }
      renderer.render(scene, camera)
    }
    animate()

    const onResize = () => {
      const w = el.clientWidth; const h = el.clientHeight
      if (!w || !h) return
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', onResize)

    // Also watch the container directly so layout changes (panel show/hide) trigger a resize
    const ro = new ResizeObserver(onResize)
    ro.observe(el)

    return () => {
      window.removeEventListener('resize', onResize)
      ro.disconnect()
      cancelAnimationFrame(animRef.current)
      renderer.dispose()
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement)
    }
  }, [countries])

  // ── Redraw texture when game state changes ───────────────────────────────
  useEffect(() => {
    if (!canvasRef.current || !texRef.current || countries.length === 0) return
    const guessMap = {}
    for (const g of guesses) guessMap[g.name] = g.color
    const missedSet = missed?.length ? new Set(missed.map(f => f.properties.NAME)) : null
    redrawTexture(canvasRef.current, countries, guessMap, mystery?.properties?.NAME, gameWon, highlighted?.properties?.NAME ?? null, missedSet, locateMarker, hiddenCountries, soloMode, locateCorrectMarker)
    texRef.current.needsUpdate = true
  }, [guesses, mystery, gameWon, countries, highlighted, missed, locateMarker, locateCorrectMarker, hiddenCountries, soloMode])

  // ── Fly to feature when a guess is made ─────────────────────────────────
  useEffect(() => {
    if (!flyToFeature || !sphereRef.current) return
    const [lon, lat] = geoCentroid(flyToFeature)
    // Three.js SphereGeometry UV: rotation.y=0 shows ~90°W (Americas).
    // To center longitude L: targetY = -π/2 - L*(π/180)
    flyTarget.current = {
      y: -(Math.PI / 2) - lon * (Math.PI / 180),
      x:  lat * (Math.PI / 180),
    }
    autoRotate.current = false
    clearTimeout(autoTimer.current)
    autoTimer.current = setTimeout(() => { autoRotate.current = true }, 6000)
  }, [flyToFeature])

  // ── Zoom out + fly to correct country on a wrong locate guess ───────────
  useEffect(() => {
    if (!locateCorrectMarker) {
      camTargetZ.current = 3.0  // zoom back in when cleared
      return
    }
    flyTarget.current = {
      y: -(Math.PI / 2) - locateCorrectMarker.lon * (Math.PI / 180),
      x:  locateCorrectMarker.lat * (Math.PI / 180),
    }
    autoRotate.current = false
    clearTimeout(autoTimer.current)
    autoTimer.current = setTimeout(() => { autoRotate.current = true }, 6000)
    camTargetZ.current = 3.7
  }, [locateCorrectMarker])

  // ── Sync spinEnabled prop → ref ─────────────────────────────────────────
  useEffect(() => { spinRef.current = spinEnabled }, [spinEnabled])

  // ── Sync light/dark theme → scene background ─────────────────────────────
  useEffect(() => {
    if (sceneRef.current) {
      sceneRef.current.background = new THREE.Color(lightMode ? '#c8ddf5' : '#040c1c')
    }
  }, [lightMode])

  // ── Pause auto-rotate on interaction ────────────────────────────────────
  const pauseAutoRotate = useCallback(() => {
    autoRotate.current = false
    clearTimeout(autoTimer.current)
    autoTimer.current = setTimeout(() => { autoRotate.current = true }, 4000)
  }, [])

  // ── Mouse drag to rotate ─────────────────────────────────────────────────
  const onMouseDown = useCallback((e) => {
    const startX = e.clientX, startY = e.clientY
    drag.current = { active: true, prev: { x: e.clientX, y: e.clientY } }
    pauseAutoRotate()

    const onMove = (e2) => {
      if (!drag.current.active) return
      const dx = e2.clientX - drag.current.prev.x
      const dy = e2.clientY - drag.current.prev.y
      const sphere = sphereRef.current
      if (sphere) {
        sphere.rotation.y += dx * 0.004
        sphere.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, sphere.rotation.x + dy * 0.004))
      }
      drag.current.prev = { x: e2.clientX, y: e2.clientY }
    }
    const onUp = (e2) => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
      drag.current.active = false

      // If mouse barely moved, treat as a click
      const moved = Math.hypot(e2.clientX - startX, e2.clientY - startY)
      if (moved < 5 && onGlobeClick) {
        const el = mountRef.current
        const cam = camRef.current
        const sphere = sphereRef.current
        if (!el || !cam || !sphere) return
        const rect = el.getBoundingClientRect()
        const nx = ((e2.clientX - rect.left) / rect.width)  * 2 - 1
        const ny = -((e2.clientY - rect.top) / rect.height) * 2 + 1
        raycaster.current.setFromCamera({ x: nx, y: ny }, cam)
        const hits = raycaster.current.intersectObject(sphere)
        if (hits.length && hits[0].uv) {
          const uv = hits[0].uv
          const lon = (uv.x - 0.5) * 360
          const lat = (uv.y - 0.5) * 180
          onGlobeClick(lon, lat)
        }
      }
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }, [pauseAutoRotate, onGlobeClick])

  // ── Touch drag ───────────────────────────────────────────────────────────
  const onTouchStart = useCallback((e) => {
    if (e.touches.length !== 1) return
    const t = e.touches[0]
    drag.current = { active: true, prev: { x: t.clientX, y: t.clientY } }
    pauseAutoRotate()
  }, [pauseAutoRotate])

  const onTouchMove = useCallback((e) => {
    if (!drag.current.active || e.touches.length !== 1) return
    e.preventDefault()
    const t = e.touches[0]
    const dx = t.clientX - drag.current.prev.x
    const dy = t.clientY - drag.current.prev.y
    const sphere = sphereRef.current
    if (sphere) {
      sphere.rotation.y += dx * 0.005
      sphere.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, sphere.rotation.x + dy * 0.005))
    }
    drag.current.prev = { x: t.clientX, y: t.clientY }
  }, [])

  const onTouchEnd = useCallback(() => { drag.current.active = false }, [])

  // ── Scroll to zoom ───────────────────────────────────────────────────────
  const onWheel = useCallback((e) => {
    const cam = camRef.current
    if (cam) cam.position.z = Math.max(1.4, Math.min(5, cam.position.z + e.deltaY * 0.003))
  }, [])

  return (
    <div
      ref={mountRef}
      style={{ width: '100%', height: '100%', cursor: onGlobeClick ? 'crosshair' : 'grab' }}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onWheel={onWheel}
    />
  )
}
