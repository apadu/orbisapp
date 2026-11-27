/**
 * Tiny URL router: every screen has its own address, so the browser's Back /
 * Forward buttons, refresh and shared links all work.
 *
 *   /                  Home
 *   /play/<mode>       globe games (mystery, capital-drop, name-all…)
 *   /quiz              Quiz Hub
 *   /quiz/<mode>       a quiz (capital, ww2, country-wordle…)
 *   /daily             Quiz of the day
 *   /globe /name-all   section pages (globe games · Name them all)
 *   /countries         Countries (pick a country)
 *   /countries/<slug>  a country page (Romania, Moldova…) with its games
 *   /profile           Profile
 *   /privacy /terms /credits   info pages
 */
import { COUNTRY_PAGES, pageIdForSlug } from '../data/countryPages'

export const INFO_PAGES = new Set(['privacy', 'terms', 'credits'])

export function routeFor(page, mode, quizModes) {
  if (page === 'home') return '/'
  if (page === 'profile') return '/profile'
  if (INFO_PAGES.has(page)) return `/${page}`
  if (page === 'quiz') {
    if (mode === 'daily-quiz') return '/daily'
    if (mode === 'country-grid') return '/grid'
    if (mode === 'countries') return '/countries'
    if (mode === 'globe-hub') return '/globe'
    if (mode === 'nameall-hub') return '/name-all'
    if (COUNTRY_PAGES[mode]) return `/countries/${COUNTRY_PAGES[mode].slug}`
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
  if (INFO_PAGES.has(head) && !id) return { page: head }
  if (head === 'daily' && !id) return { page: 'quiz', mode: 'daily-quiz' }
  if (head === 'grid' && !id) return { page: 'quiz', mode: 'country-grid' }
  if (head === 'globe' && !id) return { page: 'quiz', mode: 'globe-hub' }
  if (head === 'name-all' && !id) return { page: 'quiz', mode: 'nameall-hub' }
  if (head === 'countries') {
    if (!id) return { page: 'quiz', mode: 'countries' }
    const pageId = pageIdForSlug(id)
    return pageId ? { page: 'quiz', mode: pageId } : null
  }
  if (head === 'quiz') {
    if (!id) return { page: 'quiz', mode: 'quiz-hub' }
    return quizModes.has(id) ? { page: 'quiz', mode: id } : null
  }
  if (head === 'play' && id && globeModes.has(id)) return { page: 'game', mode: id }
  return null
}
