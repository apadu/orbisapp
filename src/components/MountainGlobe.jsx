import { useEffect, useRef, useCallback, useState } from 'react'
import * as THREE from 'three'
import { prepareTexture, globeMaterial, addAtmosphere, addLights, SMALL_SCREEN, TEX_SCALE } from '../utils/globeFx'
import { geoEquirectangular, geoPath } from 'd3-geo'
import GlobeControls from './GlobeControls'
import { rangeName } from '../i18n/names'
import { RANGE_INDEX } from '../data/mountainRelief'

const CANVAS_W = 4096
const CANVAS_H = 2048

function lonLatToXY(lon, lat) {
  return [
    (lon + 180) / 360 * CANVAS_W,
    (90 - lat)  / 180 * CANVAS_H,
  ]
}

// ── Relief map ───────────────────────────────────────────────────────────
// The map is pre-rendered (scripts/build-relief.py): parchment land with real shaded relief
// from NASA elevation data. Each range is its real high ground, stored as an index image
// (ranges.png: pixel value = range number, see data/mountainRelief.js). Unfound ranges get a
// faint sepia wash and outline, found ones turn green, missed ones red.
const PALETTE = {
  sea:   '#86a9b8',
  land:  '#e9dcb9',
  border: 'rgba(110, 80, 45, 0.45)',
  ink:   'rgba(92, 62, 34, 0.9)',
  found: 'rgba(24, 110, 40, 0.95)',
  missed: 'rgba(170, 30, 30, 0.95)',
}
// [fill, edge] RGBA per state
const OVERLAY = {
  unfound: [[120, 80, 40, 40], [92, 62, 34, 200]],
  found:   [[40, 160, 60, 130], [20, 105, 40, 245]],
  missed:  [[205, 50, 50, 120], [165, 25, 25, 245]],
}

const base = (import.meta.env?.BASE_URL ?? '/').replace(/\/$/, '')
let assetsPromise = null
/** → { base: HTMLImageElement, W, H, pixels: Int32Array (index of every range pixel), ids, edge } */
function loadAssets() {
  return (assetsPromise ??= (async () => {
    const img = (src) => new Promise((ok, fail) => { const i = new Image(); i.onload = () => ok(i); i.onerror = fail; i.src = src })
    const [map, idxImg] = await Promise.all([
      img(`${base}/data/relief/base-${SMALL_SCREEN ? '2k' : '4k'}.jpg`),
      img(`${base}/data/relief/ranges.png`),
    ])
    const W = idxImg.width, H = idxImg.height
    const c = document.createElement('canvas'); c.width = W; c.height = H
    const cx = c.getContext('2d', { willReadFrequently: true })
    cx.drawImage(idxImg, 0, 0)
    const rgba = cx.getImageData(0, 0, W, H).data
    const idx = new Uint8Array(W * H)
    for (let p = 0, n = W * H; p < n; p++) idx[p] = rgba[p * 4]
    // only the range pixels are touched on every redraw
    const list = []
    for (let p = 0; p < idx.length; p++) if (idx[p]) list.push(p)
    const pixels = Int32Array.from(list)
    const ids = new Uint8Array(pixels.length), edge = new Uint8Array(pixels.length)
    pixels.forEach((p, k) => {
      const v = idx[p]
      ids[k] = v
      const x = p % W
      edge[k] = (x === 0 || idx[p - 1] !== v || x === W - 1 || idx[p + 1] !== v || idx[p - W] !== v || idx[p + W] !== v) ? 1 : 0
    })
    return { base: map, W, H, pixels, ids, edge }
  })().catch(e => { assetsPromise = null; throw e }))
}

let overlayCanvas = null
function drawOverlay(ctx, assets, foundNames, missedNames) {
  const { W, H, pixels, ids, edge } = assets
  if (!overlayCanvas) { overlayCanvas = document.createElement('canvas'); overlayCanvas.width = W; overlayCanvas.height = H }
  const oc = overlayCanvas.getContext('2d')
  const data = oc.createImageData(W, H)
  const d = data.data
  // state of each range number
  const state = new Array(256).fill(OVERLAY.unfound)
  for (const [name, { i }] of Object.entries(RANGE_INDEX)) {
    if (foundNames.has(name)) state[i] = OVERLAY.found
    else if (missedNames.has(name)) state[i] = OVERLAY.missed
  }
  for (let k = 0; k < pixels.length; k++) {
    const col = state[ids[k]][edge[k]]
    const o = pixels[k] * 4
    d[o] = col[0]; d[o + 1] = col[1]; d[o + 2] = col[2]; d[o + 3] = col[3]
  }
  oc.putImageData(data, 0, 0)
  ctx.imageSmoothingEnabled = true
  ctx.drawImage(overlayCanvas, 0, 0, CANVAS_W, CANVAS_H)
}

function drawLabel(ctx, name, ink) {
  const pos = RANGE_INDEX[name]
  if (!pos) return
  const [x, y] = lonLatToXY(pos.lon, pos.lat)
  const label = rangeName(name)
  ctx.font = 'italic 600 30px Georgia, "Times New Roman", serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.lineJoin = 'round'
  ctx.lineWidth = 6
  ctx.strokeStyle = 'rgba(240, 230, 200, 0.92)'
  ctx.strokeText(label, x, y)
  ctx.fillStyle = ink
  ctx.fillText(label, x, y)
}

function redrawMountains(canvas, countries, foundNames, missedNames, assets) {
  const ctx = canvas.getContext('2d')
  ctx.setTransform(canvas.width / CANVAS_W, 0, 0, canvas.height / CANVAS_H, 0, 0)   // drawn in 4096-px units at any texture size

  if (assets) {
    ctx.drawImage(assets.base, 0, 0, CANVAS_W, CANVAS_H)
    drawOverlay(ctx, assets, foundNames, missedNames)
  } else {
    // until the relief map arrives: plain sea and land
    const path = geoPath().projection(geoEquirectangular().scale(CANVAS_W / (2 * Math.PI)).translate([CANVAS_W / 2, CANVAS_H / 2])).context(ctx)
    ctx.fillStyle = PALETTE.sea
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H)
    ctx.fillStyle = PALETTE.land
    ctx.strokeStyle = PALETTE.border
    ctx.lineWidth = 0.8
    for (const f of countries) { ctx.beginPath(); path(f); ctx.fill(); ctx.stroke() }
  }
  for (const name of foundNames) drawLabel(ctx, name, PALETTE.found)
  for (const name of missedNames) drawLabel(ctx, name, PALETTE.missed)
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

  // The relief map and the ranges image load once; redraw when they arrive
  const assetsRef = useRef(null)
  const [assetsReady, setAssetsReady] = useState(false)
  useEffect(() => {
    let live = true
    loadAssets().then(a => { if (live) { assetsRef.current = a; setAssetsReady(true) } }).catch(() => {})
    return () => { live = false }
  }, [])


  // Init Three.js scene
  useEffect(() => {
    if (!mountRef.current || countries.length === 0) return
    const el = mountRef.current
    const W  = el.clientWidth
    const H  = el.clientHeight

    const offscreen = document.createElement('canvas')
    offscreen.width  = CANVAS_W * TEX_SCALE
    offscreen.height = CANVAS_H * TEX_SCALE
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
    texture.minFilter  = SMALL_SCREEN ? THREE.LinearFilter : THREE.LinearMipmapLinearFilter
    texture.generateMipmaps = !SMALL_SCREEN
    texRef.current = texture
    redrawMountains(offscreen, countries, new Set(), new Set(), assetsRef.current)
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
      renderer.render(scene, camera)   // a resized canvas stays blank until drawn
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
    redrawMountains(canvasRef.current, countries, foundNames, missedNames, assetsRef.current)
    texRef.current.needsUpdate = true
  }, [foundNames, missedNames, countries, ranges, assetsReady])

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
    <>
      <div
        ref={mountRef}
        style={{ width: '100%', height: '100%', cursor: 'grab', touchAction: 'none' }}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onWheel={onWheel}
      />
      <GlobeControls camRef={camRef} sphereRef={sphereRef} spinRef={spinRef} />
    </>
  )
}
