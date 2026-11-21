/**
 * Ids of the diagram quizzes (DiagramQuiz). Kept apart from diagramQuizzes.jsx so the app shell
 * doesn't load every drawing up front; titles come from GAME_CATALOG.
 * ⚠️ Keep in step with DIAGRAM_QUIZZES (DiagramQuiz warns in dev when they differ).
 */
export const DIAGRAM_IDS = new Set([
  'earth-layers', 'rock-cycle', 'volcano', 'water-cycle', 'plate-boundaries', 'climate-zones', 'earth-orbit', 'landscape',
  'clouds', 'solar-system', 'moon-phases', 'eclipses', 'sun-anatomy', 'sky-map',
  'river-coast', 'atmosphere', 'volcano-types', 'milky-way', 'star-life', 'moon-map', 'mars-map',
])
