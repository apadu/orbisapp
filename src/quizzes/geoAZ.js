/**
 * Geography from A to Z: one table quiz per letter, built from src/data/geoAZ.js.
 * A row is kept only if its answer starts with the letter in the site language, so every
 * language gets its own set (up to 20); the rows are written so most letters reach 20.
 */
import { lang } from '../i18n'
import { localName, countryAnswers } from '../utils/aliases'
import { GEO_AZ } from '../data/geoAZ'

export const AZ_SIZE = 20

const firstLetter = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase().replace(/[^A-Z0-9]/g, '')[0] ?? ''

// same shuffle as the other table quizzes, so the order is stable
function seededShuffle(arr, seed) {
  const a = [...arr]
  let s = seed
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280
    const j = Math.floor((s / 233280) * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function rowFor(r, i, L) {
  const answers = r.c ? countryAnswers(r.c)
    : Array.isArray(r.a) ? r.a
    : (r.a[lang] ?? r.a.en)
  const display = r.c ? localName(r.c) : answers[0]
  return { id: `${L}-${i}`, hint: { type: 'text', value: r[lang] ?? r.en, long: true }, answers, display }
}

/** The rows of the quiz for letter L in the site language. */
export function azRows(L) {
  const rows = (GEO_AZ[L] ?? []).map((r, i) => rowFor(r, i, L)).filter(r => firstLetter(r.display) === L).slice(0, AZ_SIZE)
  return seededShuffle(rows, L.charCodeAt(0) * 31)
}
