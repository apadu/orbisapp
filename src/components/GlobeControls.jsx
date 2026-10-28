import { useEffect, useRef, useState } from 'react'
import { t } from '../i18n'

const MIN_Z = 1.4, MAX_Z = 5, HOME_Z = 3.0, STEP = 0.45

/**
 * Small floating controls for any of the three.js globes: zoom in / out,
 * re-centre (straighten the tilt + default zoom) and auto-rotate on/off.
 * Works with the refs every globe component already has.
 */
export default function GlobeControls({ camRef, sphereRef, spinRef }) {
  const [spin, setSpin] = useState(() => !!spinRef?.current)
  const anim = useRef(null)

  // Keep the button in sync if the game turns spinning on/off
  useEffect(() => {
    const id = setInterval(() => { if (spinRef && !!spinRef.current !== spin) setSpin(!!spinRef.current) }, 500)
    return () => clearInterval(id)
  }, [spin, spinRef])
  useEffect(() => () => cancelAnimationFrame(anim.current), [])

  const tween = (apply, ms = 260) => {
    cancelAnimationFrame(anim.current)
    const t0 = performance.now()
    const step = (now) => {
      const k = Math.min(1, (now - t0) / ms)
      apply(1 - Math.pow(1 - k, 3))
      if (k < 1) anim.current = requestAnimationFrame(step)
    }
    anim.current = requestAnimationFrame(step)
  }

  const zoom = (dir) => {
    const cam = camRef?.current
    if (!cam) return
    const from = cam.position.z
    const to = Math.max(MIN_Z, Math.min(MAX_Z, from + dir * STEP))
    tween(k => { cam.position.z = from + (to - from) * k })
  }

  const recenter = () => {
    const cam = camRef?.current, sphere = sphereRef?.current
    if (!cam || !sphere) return
    const z0 = cam.position.z, x0 = sphere.rotation.x
    tween(k => { cam.position.z = z0 + (HOME_Z - z0) * k; sphere.rotation.x = x0 * (1 - k) }, 420)
  }

  const toggleSpin = () => {
    if (!spinRef) return
    spinRef.current = !spinRef.current
    setSpin(spinRef.current)
  }

  return (
    <div className="globe-ctrl" onMouseDown={e => e.stopPropagation()} onWheel={e => e.stopPropagation()}>
      <button onClick={() => zoom(-1)} title={t('Zoom in')} aria-label={t('Zoom in')}>＋</button>
      <button onClick={() => zoom(1)} title={t('Zoom out')} aria-label={t('Zoom out')}>－</button>
      <span className="globe-ctrl-sep" />
      <button onClick={recenter} title={t('Re-centre the globe')} aria-label={t('Re-centre the globe')}>⌖</button>
      <button onClick={toggleSpin} className={spin ? 'on' : ''} title={spin ? t('Stop rotating') : t('Rotate automatically')} aria-pressed={spin}>⟳</button>
    </div>
  )
}
