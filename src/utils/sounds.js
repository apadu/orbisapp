// GeoFeverr is silent by design: these stay as no-ops so the games can keep calling them
// without each one needing a change. To bring sound back, restore the Web Audio version
// from git history (src/utils/sounds.js before 2026-11-26).
export function setSoundEnabled() {}
export function isSoundEnabled() { return false }
export function playCorrect() {}
export function playWrong() {}
export function playStreak() {}
export function playWin() {}
