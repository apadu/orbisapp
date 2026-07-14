// Module-level flag — toggled from App without threading props through every panel
let _enabled = true

export function setSoundEnabled(val) { _enabled = val }
export function isSoundEnabled()     { return _enabled }

function getCtx() {
  if (typeof window === 'undefined') return null
  if (!window.__orbisAudioCtx) {
    try { window.__orbisAudioCtx = new AudioContext() } catch { return null }
  }
  // Resume if suspended (browsers require user interaction first)
  if (window.__orbisAudioCtx.state === 'suspended') {
    window.__orbisAudioCtx.resume()
  }
  return window.__orbisAudioCtx
}

function tone(freq, startOffset, duration, gain = 0.2, type = 'sine') {
  const c = getCtx()
  if (!c) return
  const osc = c.createOscillator()
  const g   = c.createGain()
  osc.connect(g)
  g.connect(c.destination)
  osc.type = type
  osc.frequency.setValueAtTime(freq, c.currentTime + startOffset)
  g.gain.setValueAtTime(0.001, c.currentTime + startOffset)
  g.gain.linearRampToValueAtTime(gain, c.currentTime + startOffset + 0.01)
  g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + startOffset + duration)
  osc.start(c.currentTime + startOffset)
  osc.stop(c.currentTime + startOffset + duration + 0.02)
}

/** Short ascending two-note chime — correct answer */
export function playCorrect() {
  if (!_enabled) return
  tone(523.25, 0,    0.09, 0.18) // C5
  tone(659.25, 0.08, 0.15, 0.16) // E5
}

/** Low descending buzz — wrong answer / skip */
export function playWrong() {
  if (!_enabled) return
  tone(220, 0,    0.1,  0.16, 'sawtooth')
  tone(196, 0.08, 0.12, 0.1,  'sawtooth')
}

/** Ascending triad — streak bonus */
export function playStreak() {
  if (!_enabled) return
  tone(523.25, 0,    0.08, 0.18) // C5
  tone(659.25, 0.07, 0.08, 0.18) // E5
  tone(783.99, 0.14, 0.2,  0.2 ) // G5
}

/** Four-note fanfare — win / completion */
export function playWin() {
  if (!_enabled) return
  tone(523.25, 0,   0.1,  0.2 ) // C5
  tone(659.25, 0.1, 0.1,  0.2 ) // E5
  tone(783.99, 0.2, 0.1,  0.2 ) // G5
  tone(1046.5, 0.3, 0.4,  0.24) // C6
}
