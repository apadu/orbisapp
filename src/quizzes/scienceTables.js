/**
 * Rows of the science & history table quizzes, loaded only when one of them is opened
 * (see lazyTable in tableQuizzes.js). Each build() returns TableQuiz rows.
 */
import { isRo } from '../i18n'
import { ROCKS, ROCK_TYPES } from '../data/rocks'
import { MINERALS, RECORDS, PHENOMENA, PERIODS, BIOMES } from '../data/earthTables'
import { PLANETS, MOONS, MISSIONS, SKY } from '../data/spaceTables'
import { HISTORICAL_FLAGS } from '../data/historicalFlags'
import { EXTREME_POINTS, CLIMATES, SCALES } from '../data/worldTables'

// same shuffle as tableQuizzes.js, so the row order doesn't change
function seededShuffle(arr, seed = 7) {
  const a = [...arr]
  let s = seed
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280
    const j = Math.floor((s / 233280) * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const roNum = (v) => v.replace(/[.,]/g, c => (c === '.' ? ',' : '.')).replace(/ M /g, ' mil. ').replace('year', 'an').replace('today', 'azi')
const extraOf = (x) => (Array.isArray(x) ? (isRo ? x[1] : x[0]) : isRo ? roNum(x) : x)
const answersOf = (r) => (isRo ? [r.roName, ...(r.roAlt ?? []), r.name, ...(r.alt ?? [])] : [r.name, ...(r.alt ?? [])])
const earthTable = (rows, { shuffle = true, seed = 3 } = {}) => () => (shuffle ? seededShuffle(rows, seed) : rows).map(r => ({
  id: r.id,
  hint: { type: 'text', value: isRo ? r.ro : r.en, long: true },
  extra: extraOf(r.extra),
  answers: answersOf(r),
  display: isRo ? r.roName : r.name,
}))

export const SCIENCE_BUILDS = {
  rocks: () => seededShuffle(ROCKS, 5).map(r => ({
    id: r.id,
    hint: { type: 'text', value: isRo ? r.roDesc : r.en, long: true },
    extra: isRo ? ROCK_TYPES[r.type].ro : ROCK_TYPES[r.type].en,
    answers: isRo ? [r.ro, ...(r.roAlt ?? []), r.name, ...(r.alt ?? [])] : [r.name, ...(r.alt ?? [])],
    display: isRo ? r.ro : r.name,
  })),
  minerals: earthTable(MINERALS, { seed: 4 }),
  'earth-records': earthTable(RECORDS, { seed: 6 }),
  phenomena: earthTable(PHENOMENA, { seed: 2 }),
  'geologic-time': earthTable(PERIODS, { shuffle: false }),
  biomes: earthTable(BIOMES, { seed: 8 }),
  planets: earthTable(PLANETS, { seed: 5 }),
  moons: earthTable(MOONS, { seed: 9 }),
  missions: earthTable(MISSIONS, { shuffle: false }),
  'stars-constellations': earthTable(SKY, { seed: 11 }),
  'extreme-points': earthTable(EXTREME_POINTS, { seed: 15 }),
  climates: earthTable(CLIMATES, { seed: 17 }),
  scales: earthTable(SCALES, { seed: 19 }),
  'flags-historical': () => seededShuffle(HISTORICAL_FLAGS, 13).map(r => ({
    id: r.id,
    hint: { type: 'histflag', value: r.id },
    extra: r.extra,
    answers: answersOf(r),
    display: isRo ? r.roName : r.name,
  })),
}
