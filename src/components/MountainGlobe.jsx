import { useEffect, useRef, useCallback } from 'react'
import * as THREE from 'three'
import { prepareTexture, globeMaterial, addAtmosphere, addLights, oceanGradient, landColor, SHALLOW_OUTER, SHALLOW_INNER } from '../utils/globeFx'
import { geoEquirectangular, geoPath } from 'd3-geo'

const CANVAS_W = 4096
const CANVAS_H = 2048

function lonLatToXY(lon, lat) {
  return [
    (lon + 180) / 360 * CANVAS_W,
    (90 - lat)  / 180 * CANVAS_H,
  ]
}

const DEG_TO_PX = CANVAS_W / 360

// Deterministic pseudo-random: 0..1 for any integer
function pr(x) {
  return ((Math.sin(x * 127.1 + 311.7) * 43758.5453) % 1 + 1) % 1
}

// ── Old-map style ─────────────────────────────────────────────────────────
// Parchment land, muted sea, and each range drawn as a sinuous ridge spine with
// hachures (short strokes running downslope), darker on the "shadow" side —
// the way 18th/19th-century maps showed relief.
const PALETTE = {
  sea:        '#86a9b8',
  land:       '#e9dcb9',
  border:     'rgba(110, 80, 45, 0.45)',
  ink:        'rgba(92, 62, 34, 0.9)',     // unfound ranges: sepia ink
  found:      'rgba(24, 110, 40, 0.95)',
  foundWash:  'rgba(57, 160, 60, 0.28)',
  missed:     'rgba(170, 30, 30, 0.95)',
  missedWash: 'rgba(220, 60, 60, 0.25)',
}

function drawMountainRange(ctx, feature, state) {
  const { NAME, cLon, cLat, rx, ry, rotDeg } = feature.properties
  const [cx, cy] = lonLatToXY(cLon, cLat)
  const rxPx = rx * DEG_TO_PX
  const halfW = Math.max(ry * DEG_TO_PX, 12)
  const seed = Math.round(Math.abs(cLon * 13 + cLat * 7)) % 100

  const ink  = state === 'found' ? PALETTE.found : state === 'missed' ? PALETTE.missed : PALETTE.ink
  const wash = state === 'found' ? PALETTE.foundWash : state === 'missed' ? PALETTE.missedWash : null

  // Ridge spine: gentle S-curve along the range axis
  const spineY = (x) => halfW * 0.28 * Math.sin((x / rxPx) * Math.PI * 1.25 + seed)

  ctx.save()
  ctx.translate(cx, cy)
  ctx.rotate(-rotDeg * Math.PI / 180)
  ctx.lineCap = 'round'

  // Soft colour wash under found / missed ranges
  if (wash) {
    ctx.beginPath()
    ctx.ellipse(0, 0, rxPx + halfW * 0.6, halfW * 1.5, 0, 0, Math.PI * 2)
    ctx.fillStyle = wash
    ctx.fill()
  }

  // Hachures: tapered wedges radiating downslope from the crest.
  // Shadow flank = longer, denser, darker; lit flank = short and sparse.
  ctx.fillStyle = ink
  ctx.strokeStyle = ink
  const step = Math.max(4, Math.min(7, rxPx / 45))
  let i = 0
  for (let x = -rxPx; x <= rxPx; x += step, i++) {
    const t = (x + rxPx) / (2 * rxPx)
    const env = Math.sin(Math.PI * t) ** 0.55
    if (env < 0.1) continue
    const y0 = spineY(x)
    const alt = i % 2 === 0 ? 1 : 0.62                      // long/short rhythm
    for (const side of [-1, 1]) {
      const shadow = side === 1
      if (!shadow && i % 2 === 1) continue                  // lit side: every other stroke
      const r = pr(i * 3 + (shadow ? 7 : 1) + seed)
      const len = halfW * env * alt * (0.6 + 0.5 * r) * (shadow ? 1.15 : 0.7)
      const ang = (t - 0.5) * 0.9 * side + (r - 0.5) * 0.25 // fan outwards toward the ends
      const tipX = x + Math.sin(ang) * len
      const tipY = y0 + side * Math.cos(ang) * len
      const base = shadow ? 2.1 : 1.2
      ctx.beginPath()
      ctx.moveTo(x - base, y0)
      ctx.lineTo(x + base, y0)
      ctx.lineTo(tipX, tipY)
      ctx.closePath()
      ctx.fill()
    }
    // Occasional spur: a longer branching ridge on the shadow side
    if (env > 0.5 && pr(i * 17 + seed) > 0.86) {
      const len = halfW * 1.35 * env
      const dir = (t - 0.5) * 1.2
      ctx.lineWidth = 1.6
      ctx.beginPath()
      ctx.moveTo(x, y0)
      ctx.quadraticCurveTo(x + dir * len * 0.3, y0 + len * 0.5, x + dir * len * 0.6, y0 + len)
      ctx.stroke()
    }
  }

  // Ridge crest line
  ctx.lineWidth = 2
  ctx.beginPath()
  for (let x = -rxPx * 0.96; x <= rxPx * 0.96; x += 6) {
    const y = spineY(x)
    if (x === -rxPx * 0.96) ctx.moveTo(x, y); else ctx.lineTo(x, y)
  }
  ctx.stroke()

  // Copperplate-style label once revealed
  if (state !== 'unfound') {
    const size = Math.max(22, Math.min(34, rxPx / 6))
    ctx.font = `italic 600 ${size}px Georgia, "Times New Roman", serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'top'
    // keep text upright
    const upsideDown = Math.cos(rotDeg * Math.PI / 180) < 0
    if (upsideDown) ctx.rotate(Math.PI)
    ctx.lineWidth = 5
    ctx.strokeStyle = 'rgba(233, 220, 185, 0.9)'
    ctx.strokeText(NAME, 0, halfW * 1.05)
    ctx.fillStyle = ink
    ctx.fillText(NAME, 0, halfW * 1.05)
  }

  ctx.restore()
}

function redrawMountains(canvas, countries, ranges, foundNames, missedNames) {
  const ctx  = canvas.getContext('2d')
  const proj = geoEquirectangular()
    .scale(CANVAS_W / (2 * Math.PI))
    .translate([CANVAS_W / 2, CANVAS_H / 2])
  const path = geoPath().projection(proj).context(ctx)

  // Sea
  ctx.fillStyle = PALETTE.sea
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H)

  // Land (parchment) + faint borders
  for (const f of countries) {
    ctx.beginPath()
    path(f)
    ctx.fillStyle = PALETTE.land
    ctx.fill()
    ctx.strokeStyle = PALETTE.border
    ctx.lineWidth = 0.8
    ctx.stroke()
  }

  for (const f of ranges) {
    const name = f.properties.NAME
    if (!foundNames.has(name) && !missedNames.has(name)) drawMountainRange(ctx, f, 'unfound')
  }
  for (const f of ranges) {
    if (foundNames.has(f.properties.NAME))  drawMountainRange(ctx, f, 'found')
    if (missedNames.has(f.properties.NAME)) drawMountainRange(ctx, f, 'missed')
  }
}

export default function MountainGlobe({ countries, ranges, foundNames, missedNames, spinEnabled = true }) {
  const mountRef   = useRef(null)
  const rendRef    = useRef(null)
  const sphereRef  = useRef(null)
  const texRef     = useRef(null)
  const canvasRef  = useRef(null)
  const camRef     = useRef(null)
  const animRef    = useRef(null)
  const drag       = useRef({ active: false, prev: { x: 0, y: 0 } })
  const autoRotate = useRef(true)
  const autoTimer  = useRef(null)
  const spinRef    = useRef(spinEnabled)
  useEffect(() => { spinRef.current = spinEnabled }, [spinEnabled])

  // Init Three.js scene
  useEffect(() => {
    if (!mountRef.current || countries.length === 0) return
    const el = mountRef.current
    const W  = el.clientWidth
    const H  = el.clientHeight

    const offscreen = document.createElement('canvas')
    offscreen.width  = CANVAS_W
    offscreen.height = CANVAS_H
    canvasRef.current = offscreen

    const scene = new THREE.Scene()
    scene.background = null  // transparent — the starfield behind the canvas is CSS

    const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 500)
    camera.position.z = 3.0
    camRef.current = camera

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(W, H)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    el.appendChild(renderer.domElement)
    rendRef.current = renderer

    const texture = prepareTexture(new THREE.CanvasTexture(offscreen))
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy()
    texture.minFilter  = THREE.LinearMipmapLinearFilter
    texture.generateMipmaps = true
    texRef.current = texture
    redrawMountains(offscreen, countries, ranges, new Set(), new Set())
    texture.needsUpdate = true

    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(1, 72, 72),
      globeMaterial(texture)
    )
    scene.add(sphere)
    sphereRef.current = sphere

    addAtmosphere(scene)

    addLights(scene)

    // Starfield
    const starPos = new Float32Array(3000 * 3)
    for (let i = 0; i < starPos.length; i++) starPos[i] = (Math.random() - 0.5) * 200
    const starGeo = new THREE.BufferGeometry()
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3))
    scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.06 })))

    const animate = () => {
      animRef.current = requestAnimationFrame(animate)
      if (autoRotate.current && !drag.current.active && spinRef.current) sphere.rotation.y += 0.0008
      renderer.render(scene, camera)
    }
    animate()

    const onResize = () => {
      const w = el.clientWidth, h = el.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('resize', onResize)
      cancelAnimationFrame(animRef.current)
      renderer.dispose()
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement)
    }
  }, [countries, ranges])

  // Redraw when found/missed sets change
  useEffect(() => {
    if (!canvasRef.current || !texRef.current) return
    redrawMountains(canvasRef.current, countries, ranges, foundNames, missedNames)
    texRef.current.needsUpdate = true
  }, [foundNames, missedNames, countries, ranges])

  const pauseAutoRotate = useCallback(() => {
    autoRotate.current = false
    clearTimeout(autoTimer.current)
    autoTimer.current = setTimeout(() => { autoRotate.current = true }, 4000)
  }, [])

  const onMouseDown = useCallback((e) => {
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
    const onUp = () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
      drag.current.active = false
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }, [pauseAutoRotate])

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

  const onTouchEnd  = useCallback(() => { drag.current.active = false }, [])

  const onWheel = useCallback((e) => {
    const cam = camRef.current
    if (cam) cam.position.z = Math.max(1.4, Math.min(5, cam.position.z + e.deltaY * 0.003))
  }, [])

  return (
    <div
      ref={mountRef}
      style={{ width: '100%', height: '100%', cursor: 'grab' }}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onWheel={onWheel}
    />
  )
}
