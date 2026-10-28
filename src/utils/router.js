/**
 * Tiny URL router: every screen has its own address, so the browser's Back /
 * Forward buttons, refresh and shared links all work.
 *
 *   /                  Home
 *   /play/<mode>       globe games (mystery, capital-drop, name-all, learn…)
 *   /quiz              Quiz Hub
 *   /quiz/<mode>       a quiz (capital, ww2, country-wordle…)
 *   /daily             Quiz of the day
 *   /profile           Profile
 */
export function routeFor(page, mode, quizModes) {
  if (page === 'home') return '/'
  if (page === 'profile') return '/profile'
  if (page === 'quiz') {
    if (mode === 'daily-quiz') return '/daily'
    return quizModes.has(mode) ? `/quiz/${mode}` : '/quiz'
  }
  return `/play/${mode}`
}

/** → { page, mode } or null for an unknown address */
export function parseRoute(pathname, { quizModes, globeModes }) {
  const parts = pathname.replace(/\/+$/, '').split('/').filter(Boolean).map(decodeURIComponent)
  if (parts.length === 0) return { page: 'home' }
  const [head, id] = parts
  if (head === 'profile' && !id) return { page: 'profile' }
  if (head === 'daily' && !id) return { page: 'quiz', mode: 'daily-quiz' }
  if (head === 'quiz') {
    if (!id) return { page: 'quiz', mode: 'quiz-hub' }
    return quizModes.has(id) ? { page: 'quiz', mode: id } : null
  }
  if (head === 'play' && id && globeModes.has(id)) return { page: 'game', mode: id }
  return null
}
