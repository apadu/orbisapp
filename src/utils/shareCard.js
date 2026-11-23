/**
 * Result cards as images (1080×1350, the 4:5 size Instagram, WhatsApp and X all show whole).
 * Drawn on a canvas in the site's colours and fonts; then shared as a file on phones
 * (system share sheet) or downloaded elsewhere.
 */
import { SITE_URL } from './share'

const W = 1080, H = 1350
const C = { bg: '#0D1A2B', bg2: '#13263D', text: '#F2E9D8', dim: '#9FB0C4', accent: '#FF7A3D', line: 'rgba(242,233,216,0.08)' }
const DISPLAY = '"Fraunces Variable", Fraunces, Georgia, serif'
const BODY = '"Inter Variable", Inter, system-ui, sans-serif'
// canvas has no colour emoji on many systems: keep the text plain
const noEmoji = (s) => String(s ?? '').replace(/[\p{Extended_Pictographic}\u{FE0F}\u{200D}]/gu, '').replace(/\s+/g, ' ').trim()

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath()
}
// shrink the font until the text fits the width
function fit(ctx, text, font, size, maxW) {
  let s = size
  do { ctx.font = font.replace('{s}', s) } while (ctx.measureText(text).width > maxW && (s -= 2) > 12)
  return s
}

/**
 * @param {object} o
 * @param {string} o.kicker   small line at the top ("Febra zilei #28 · Europa")
 * @param {string} o.big      the score ("9")
 * @param {string} [o.bigSmall] after it, smaller ("/10")
 * @param {string} [o.sub]    under the score ("90% · 1:23 · 3 zile de febră")
 * @param {string[]} [o.squares] one colour per answer / guess
 * @param {string} [o.verdict]
 * @param {string} [o.cta]    the invitation at the bottom ("Poți mai bine?")
 * @param {string} [o.path]   link shown under it ("/daily")
 * @returns {Promise<Blob>}
 */
export async function makeResultCard({ kicker, big, bigSmall = '', sub = '', squares = [], verdict = '', cta = '', path = '/' }) {
  try { await Promise.all([document.fonts.load(`800 100px ${DISPLAY}`), document.fonts.load(`600 40px ${BODY}`)]) } catch { /* system fonts then */ }
  const cv = document.createElement('canvas'); cv.width = W; cv.height = H
  const ctx = cv.getContext('2d')

  // background: navy, a faint map grid, an orange glow
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, C.bg2); g.addColorStop(1, C.bg)
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H)
  ctx.strokeStyle = C.line; ctx.lineWidth = 2
  for (let x = 60; x < W; x += 80) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke() }
  for (let y = 60; y < H; y += 80) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke() }
  const glow = ctx.createRadialGradient(W * 0.82, H * 0.18, 0, W * 0.82, H * 0.18, 620)
  glow.addColorStop(0, 'rgba(255,122,61,0.28)'); glow.addColorStop(1, 'rgba(255,122,61,0)')
  ctx.fillStyle = glow; ctx.fillRect(0, 0, W, H)

  const X = 90, maxW = W - 2 * X
  ctx.textBaseline = 'alphabetic'
  // brand
  ctx.font = `800 64px ${DISPLAY}`
  ctx.fillStyle = C.text; ctx.fillText('Geo', X, 150)
  ctx.fillStyle = C.accent; ctx.fillText('Feverr', X + ctx.measureText('Geo').width, 150)
  // kicker
  ctx.fillStyle = C.accent
  fit(ctx, noEmoji(kicker), `700 {s}px ${BODY}`, 38, maxW)
  ctx.fillText(noEmoji(kicker), X, 250)

  // the score
  let y = 560
  const bigFont = `800 {s}px ${DISPLAY}`
  // the number and its smaller suffix together must fit the width
  const width = (s) => { ctx.font = bigFont.replace('{s}', s); const a = ctx.measureText(big).width; ctx.font = bigFont.replace('{s}', Math.round(s * 0.42)); return a + 8 + ctx.measureText(bigSmall).width }
  let bs = 300
  while (bs > 60 && width(bs) > maxW) bs -= 6
  ctx.font = bigFont.replace('{s}', bs); ctx.fillStyle = C.text
  ctx.fillText(big, X - 6, y)
  if (bigSmall) {
    const bw = ctx.measureText(big).width
    ctx.font = bigFont.replace('{s}', Math.round(bs * 0.42)); ctx.fillStyle = C.dim
    ctx.fillText(bigSmall, X + bw + 8, y)
  }
  if (sub) {
    y += 90; ctx.fillStyle = C.dim
    fit(ctx, noEmoji(sub), `600 {s}px ${BODY}`, 44, maxW)
    ctx.fillText(noEmoji(sub), X, y)
  }

  // one square per answer
  if (squares.length) {
    y += 70
    const n = squares.length, gap = 14
    const size = Math.min(78, Math.floor((maxW - gap * (Math.min(n, 10) - 1)) / Math.min(n, 10)))
    squares.forEach((col, i) => {
      const r = Math.floor(i / 10), c = i % 10
      ctx.fillStyle = col
      roundRect(ctx, X + c * (size + gap), y + r * (size + gap), size, size, 14); ctx.fill()
    })
    y += Math.ceil(n / 10) * (size + gap)
  }

  if (verdict) {
    y += 90; ctx.fillStyle = C.text
    fit(ctx, noEmoji(verdict), `italic 600 {s}px ${DISPLAY}`, 54, maxW)
    ctx.fillText(noEmoji(verdict), X, y)
  }

  // footer: the invitation and the link
  const host = SITE_URL.replace(/^https?:\/\//, '')
  ctx.fillStyle = C.accent; roundRect(ctx, X, H - 230, maxW, 130, 28); ctx.fill()
  ctx.fillStyle = '#1A0F08'
  fit(ctx, noEmoji(cta), `800 {s}px ${BODY}`, 46, maxW - 80)
  ctx.fillText(noEmoji(cta), X + 40, H - 168)
  ctx.font = `600 32px ${BODY}`; ctx.fillStyle = 'rgba(26,15,8,0.75)'
  ctx.fillText(`${host}${path === '/' ? '' : path}`, X + 40, H - 122)

  return new Promise((ok, fail) => cv.toBlob(b => (b ? ok(b) : fail(new Error('toBlob'))), 'image/png'))
}

/**
 * Phones: share the image (with the text) through the system share sheet.
 * Elsewhere: download it. → 'shared' | 'downloaded' | 'cancelled' | 'failed'
 */
export async function shareImage(blob, { text = '', filename = 'geofeverr.png' } = {}) {
  const file = new File([blob], filename, { type: 'image/png' })
  const touch = window.matchMedia?.('(pointer: coarse)').matches
  if (touch && navigator.canShare?.({ files: [file] })) {
    try { await navigator.share({ files: [file], text }); return 'shared' } catch (e) { if (e?.name === 'AbortError') return 'cancelled' }
  }
  try {
    const url = URL.createObjectURL(blob)
    const a = Object.assign(document.createElement('a'), { href: url, download: filename })
    document.body.appendChild(a); a.click(); a.remove()
    setTimeout(() => URL.revokeObjectURL(url), 5000)
    return 'downloaded'
  } catch { return 'failed' }
}

export const SQUARE = { ok: '#3FBF7F', bad: '#3A4A63', near: '#E5484D', mid: '#F08A3C', far: '#E9C46A', farthest: '#4F8FD6' }
