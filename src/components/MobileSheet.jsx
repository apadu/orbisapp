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
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const vv = window.visualViewport
    const root = document.documentElement
    let tallest = window.innerHeight
    const typing = () => {
      const el = document.activeElement
      return !!el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') && !/^(range|checkbox|radio|button)$/.test(el.type)
    }
    const update = () => {
      if (!typing()) tallest = Math.max(tallest, window.innerHeight)
      // iOS: the keyboard covers the page (visual viewport shrinks, window doesn't)
      const overlay = vv ? Math.max(0, Math.round(window.innerHeight - vv.height - vv.offsetTop)) : 0
      // Android Chrome: the keyboard shrinks the whole window instead
      const shrunk = tallest - window.innerHeight
      const isOpen = overlay > 80 || (shrunk > 150 && typing())
      root.style.setProperty('--kb', `${overlay > 80 ? overlay : 0}px`)
      setOpen(isOpen)
      // iOS scrolls the whole page up when an input gets focus — undo that
      if (isOpen && window.scrollY) window.scrollTo(0, 0)
    }
    const onRotate = () => { tallest = window.innerHeight; update() }
    update()
    vv?.addEventListener('resize', update)
    vv?.addEventListener('scroll', update)
    window.addEventListener('resize', update)
    window.addEventListener('orientationchange', onRotate)
    document.addEventListener('focusin', update)
    document.addEventListener('focusout', update)
    return () => {
      vv?.removeEventListener('resize', update); vv?.removeEventListener('scroll', update)
      window.removeEventListener('resize', update); window.removeEventListener('orientationchange', onRotate)
      document.removeEventListener('focusin', update); document.removeEventListener('focusout', update)
      root.style.setProperty('--kb', '0px')
    }
  }, [])
  return open
}

/**
 * While the keyboard is open, the game panel shrinks to just the row with the text box
 * (input + its button), sitting right on top of the keyboard, so the globe keeps the rest
 * of the screen. Returns the compact height (px) to use, or null.
 */
export function useTypingBar(kbOpen, panelRef) {
  const [h, setH] = useState(null)
  useEffect(() => {
    if (!kbOpen) { setH(null); return }
    const fit = () => {
      const panel = panelRef.current
      const el = document.activeElement
      if (!panel || !el || !panel.contains(el)) { setH(null); return }
      const row = el.closest('.input-wrap, .input-row, .missing-form, .dist-row, .na-input-row, .tq-input, form') ?? el
      const r = row.getBoundingClientRect()
      setH(Math.round(Math.min(r.height, 140) + 20))
      requestAnimationFrame(() => {
        const pr = panel.getBoundingClientRect(), rr = row.getBoundingClientRect()
        panel.scrollTop += rr.top - pr.top - 10
      })
    }
    fit()
    document.addEventListener('focusin', fit)
    return () => document.removeEventListener('focusin', fit)
  }, [kbOpen, panelRef])
  return h
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
