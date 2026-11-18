/**
 * World-map quizzes of famous landforms: every island / peninsula is lit up and numbered
 * on a 2D world map, with a table of numbers below (random order). Type the names.
 * Data: src/data/landforms.js · maps: public/data/landforms/ (scripts/build-landforms.mjs)
 */
import { LANDFORMS } from '../data/landforms'
import { t } from '../i18n'

export const LANDFORM_QUIZZES = {
  'islands': {
    id: 'islands', file: 'islands.json', icon: '🏝️',
    title: t('Famous Islands'),
    prompt: t('Name the islands lit up on the map'),
    placeholder: t('Type an island…'),
    items: LANDFORMS.islands,
  },
  'peninsulas': {
    id: 'peninsulas', file: 'peninsulas.json', icon: '🗺️',
    title: t('Famous Peninsulas'),
    prompt: t('Name the peninsulas lit up on the map'),
    placeholder: t('Type a peninsula…'),
    items: LANDFORMS.peninsulas,
  },
}
export const LANDFORM_IDS = new Set(Object.keys(LANDFORM_QUIZZES))
