import { useCallback, useEffect, useRef, useState } from 'react'
import { t } from '../i18n'

/** true while the viewport is phone-sized */
export function useIsMobile(query = '(max-width: 700px)') {
  const get = () => typeof window !== 'undefined' && !!window.matchMedia?.(query).matches
  const [m, setM] = useState(get)
  useEffect(() => {
    const mq = window.matchMedia?.(query)
    if (!mq) return
    const on = () => setM(mq.matches)
    mq.addEventListener?.('change', on)
    return () => mq.removeEventListener?.('change', on)
  }, [query])
  return m
}

/**
 * Keeps --kb (on-screen keyboard height, px) up to date on <html>, so fixed bottom
 * elements can sit on top of the keyboard instead of behind it (iOS Safari especially).
 */
export function useKeyboardInset() {
  useEffect(() => {
    const vv = window.visualViewport
    if (!vv) return
    const root = document.documentElement
    const update = () => {
      const kb = Math.max(0, Math.round(window.innerHeight - vv.height - vv.offsetTop))
      root.style.setProperty('--kb', `${kb > 60 ? kb : 0}px`)
    }
    update()
    vv.addEventListener('resize', update)
    vv.addEventListener('scroll', update)
    return () => { vv.removeEventListener('resize', update); vv.removeEventListener('scroll', update); root.style.setProperty('--kb', '0px') }
  }, [])
}

export const SNAPS = ['mini', 'peek', 'full']
/** Sheet heights in px for the current window */
export function snapHeights() {
  const vh = window.innerHeight
  return { mini: 118, peek: Math.round(vh * 0.46), full: Math.round(vh - 58) }
}

/**
 * Drag handle at the top of the game panel on phones. Drag to resize; it snaps to
 * mini (just the header), peek (about half the screen) or full. Tap toggles peek ↔ full.
 */
export function SheetHandle({ snap, onSnap, panelRef }) {
  const st = useRef(null)
  const [dragging, setDragging] = useState(false)

  const onPointerDown = (e) => {
    const panel = panelRef.current
    if (!panel) return
    st.current = { y: e.clientY, h: panel.getBoundingClientRect().height, moved: false }
    setDragging(true)
    e.currentTarget.setPointerCapture?.(e.pointerId)
  }
  const onPointerMove = (e) => {
    const s = st.current, panel = panelRef.current
    if (!s || !panel) return
    const dy = s.y - e.clientY
    if (Math.abs(dy) > 6) s.moved = true
    const { mini, full } = snapHeights()
    panel.style.height = `${Math.max(mini - 30, Math.min(full, s.h + dy))}px`
  }
  const onPointerUp = () => {
    const s = st.current, panel = panelRef.current
    st.current = null
    setDragging(false)
    if (!s || !panel) return
    if (!s.moved) { panel.style.height = ''; onSnap(snap === 'full' ? 'peek' : snap === 'peek' ? 'full' : 'peek'); return }
    const h = panel.getBoundingClientRect().height
    panel.style.height = ''
    const hs = snapHeights()
    const best = SNAPS.reduce((a, b) => (Math.abs(hs[b] - h) < Math.abs(hs[a] - h) ? b : a))
    onSnap(best)
  }

  return (
    <div
      className={`sheet-handle${dragging ? ' dragging' : ''}`}
      onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp}
      role="button" aria-label={snap === 'full' ? t('Show more of the globe') : t('Expand the panel')}
    >
      <span />
    </div>
  )
}

/** Sheet state for the game panel: resets to "peek" whenever a new game opens. */
export function useSheet(resetKey) {
  const [snap, setSnap] = useState('peek')
  useEffect(() => { setSnap('peek') }, [resetKey])
  const onFocusIn = useCallback(() => { setSnap(s => (s === 'mini' ? 'peek' : s)) }, [])
  return { snap, setSnap, onFocusIn }
}
