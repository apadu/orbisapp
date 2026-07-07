import { useEffect, useRef, useCallback } from 'react'
import * as THREE from 'three'
import { geoEquirectangular, geoPath } from 'd3-geo'

const CANVAS_W = 4096
const CANVAS_H = 2048

function redrawHydro(canvas, countries, highlightedSea, status) {
  // status: null | 'correct' | 'skipped'
  const ctx = canvas.getContext('2d')
  const proj = geoEquirectangular()
    .scale(CANVAS_W / (2 * Math.PI))
    .translate([CANVAS_W / 2, CANVAS_H / 2])
  const path = geoPath().projection(proj).context(ctx)

  // Ocean background
  ctx.fillStyle = '#1a4fa8'
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H)

  // Land polygons
  for (const feature of countries) {
    ctx.beginPath()
    path(feature)
    ctx.fillStyle = '#28b558'
    ctx.fill()
    ctx.strokeStyle = '#05184a'
    ctx.lineWidth = 0.7
    ctx.stroke()
  }

  // Highlighted sea
  if (highlightedSea) {
    ctx.beginPath()
    path(highlightedSea)
    if (status === 'correct') {
      ctx.fillStyle = 'rgba(57, 255, 20, 0.55)'
    } else if (status === 'skipped') {
      ctx.fillStyle = 'rgba(239, 68, 68, 0.45)'
    } else {
      ctx.fillStyle = 'rgba(249, 115, 22, 0.6)'
    }
    ctx.fill()
    // Bright border around the highlighted sea
    ctx.strokeStyle = status === 'correct' ? '#39ff14'
                    : status === 'skipped' ? '#ef4444'
                    : '#f97316'
    ctx.lineWidth = 2.5
    ctx.stroke()
  }
}

export default function HydroGlobe({ countries, highlightedSea, status }) {
  const mountRef  = useRef(null)
  const rendRef   = useRef(null)
  const sphereRef = useRef(null)
  const texRef    = useRef(null)
  const canvasRef = useRef(null)
  const camRef    = useRef(null)
  const animRef   = useRef(null)
  const drag      = useRef({ active: false, prev: { x: 0, y: 0 } })
  const autoRotate = useRef(true)
  const autoTimer  = useRef(null)

  // Init Three.js scene
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
    scene.background = new THREE.Color('#08050f')

    const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 500)
    camera.position.z = 2.6
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
    redrawHydro(offscreen, countries, null, null)
    texture.needsUpdate = true

    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(1, 72, 72),
      new THREE.MeshPhongMaterial({ map: texture, specular: new THREE.Color(0x111111), shininess: 10 })
    )
    scene.add(sphere)
    sphereRef.current = sphere

    // Atmosphere halo
    scene.add(new THREE.Mesh(
      new THREE.SphereGeometry(1.025, 72, 72),
      new THREE.MeshPhongMaterial({ color: '#4aa8ff', transparent: true, opacity: 0.13, side: THREE.FrontSide })
    ))

    // Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.55))
    const sun = new THREE.DirectionalLight(0xffd9a0, 0.9)
    sun.position.set(5, 3, 5)
    scene.add(sun)
    const fill = new THREE.DirectionalLight(0x4080ff, 0.2)
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
      if (autoRotate.current && !drag.current.active) sphere.rotation.y += 0.0008
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
  }, [countries])

  // Redraw when highlighted sea or status changes
  useEffect(() => {
    if (!canvasRef.current || !texRef.current) return
    redrawHydro(canvasRef.current, countries, highlightedSea, status)
    texRef.current.needsUpdate = true
  }, [highlightedSea, status, countries])

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

  const onTouchEnd = useCallback(() => { drag.current.active = false }, [])

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
