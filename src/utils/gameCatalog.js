/**
 * Metadata for every tracked game mode.
 * cat:      'globe' | 'nameall' | 'quiz'
 * timed:    leaderboard tie-breaks on time (name-all style)
 */
export const GAME_CATALOG = {
  // Globe games
  mystery:               { label: 'Mystery Country',   icon: '🔍', cat: 'globe' },
  locate:                { label: 'Pinpoint Country',  icon: '📍', cat: 'globe' },
  neighbor:              { label: 'Neighbors',         icon: '📌', cat: 'globe' },
  missing:               { label: 'Blind Map',         icon: '🗺️', cat: 'globe' },
  spotlight:             { label: 'Solo Map',          icon: '🔦', cat: 'globe' },
  seas:                  { label: 'Seas Quiz',         icon: '🌊', cat: 'globe' },
  // Name All
  'name-all':            { label: 'Name All Countries',  icon: '🌍', cat: 'nameall', timed: true },
  'name-all-caps':       { label: 'Name All Capitals',   icon: '🏙️', cat: 'nameall', timed: true },
  'name-all-currencies': { label: 'Name All Currencies', icon: '💰', cat: 'nameall', timed: true },
  'name-all-languages':  { label: 'Name All Languages',  icon: '🗣️', cat: 'nameall', timed: true },
  mountains:             { label: 'Mountain Ranges',     icon: '⛰️', cat: 'nameall', timed: true },
  'name-all-seas':       { label: 'Name All Seas',       icon: '🌊', cat: 'nameall', timed: true },
  'name-all-rivers':     { label: 'Name All Rivers',     icon: '🏞️', cat: 'nameall', timed: true },
  // HIDDEN until ready — uncomment to bring History Maps back:
  // 'history-maps':        { label: 'History Maps',        icon: '🏛️', cat: 'nameall', timed: true },
  // Quizzes
  scramble:          { label: 'Scramble',          icon: '🔤', cat: 'quiz' },
  flag:              { label: 'Flags',             icon: '🚩', cat: 'quiz' },
  capital:           { label: 'Capitals',          icon: '🏛️', cat: 'quiz' },
  'cap-to-country':  { label: 'Countries by Capital',     icon: '🗺️', cat: 'quiz' },
  currency:          { label: 'Currencies',        icon: '💰', cat: 'quiz' },
  language:          { label: 'Languages',         icon: '🗣️', cat: 'quiz' },
  area:              { label: 'Largest Countries', icon: '📏', cat: 'quiz' },
  'pop-order':       { label: 'Most Populous',   icon: '📊', cat: 'quiz' },
  'border-chain':    { label: 'Border Chain',      icon: '🔗', cat: 'quiz' },
  'missing-vowels':  { label: 'Missing Vowels',    icon: '🔡', cat: 'quiz' },
  'flag-colors':     { label: 'Flag Colors',       icon: '🎨', cat: 'quiz' },
  connections:       { label: 'Connections',       icon: '🧩', cat: 'quiz' },
  'emoji-quiz':      { label: 'Country Emoji',     icon: '🌍', cat: 'quiz' },
  'country-fact':    { label: 'Country by Fact',   icon: '📖', cat: 'quiz' },
  endonyms:          { label: 'Endonyms',          icon: '🗺️', cat: 'quiz' },
  'flags-crescent': { label: 'Flags with a Crescent', icon: '☪️', cat: 'quiz' },
  'flags-cross': { label: 'Flags with a Cross', icon: '✝️', cat: 'quiz' },
  'flags-sun': { label: 'Flags with a Sun', icon: '☀️', cat: 'quiz' },
  'landlocked': { label: 'Landlocked Countries', icon: '🏔️', cat: 'quiz' },
  'island-nations': { label: 'Island Nations', icon: '🏝️', cat: 'quiz' },
  'eu-members': { label: 'EU Members', icon: '🇪🇺', cat: 'quiz' },
  'nato-members': { label: 'NATO Members', icon: '🛡️', cat: 'quiz' },
  'g20': { label: 'G20 Countries', icon: '💼', cat: 'quiz' },
  'former-ussr': { label: 'Former Soviet Republics', icon: '☭', cat: 'quiz' },
  'former-yugoslavia': { label: 'Former Yugoslavia', icon: '🧩', cat: 'quiz' },
  'equator': { label: 'On the Equator', icon: '🌐', cat: 'quiz' },
  'stans': { label: 'The -stans', icon: '🐎', cat: 'quiz' },
  'spanish-speaking': { label: 'Spanish-speaking', icon: '🇪🇸', cat: 'quiz' },
  'portuguese-speaking': { label: 'Portuguese-speaking', icon: '🇵🇹', cat: 'quiz' },
  'french-speaking': { label: 'French-speaking', icon: '🇫🇷', cat: 'quiz' },
  'alphabet': { label: 'A to Z', icon: '🔤', cat: 'quiz' },
  'daily-quiz': { label: 'Daily Quiz', icon: '📅', cat: 'quiz' },
  'euro-users': { label: 'Countries Using the Euro', icon: '💶', cat: 'quiz' },
  'dollar-users': { label: 'Countries Using a Dollar', icon: '💵', cat: 'quiz' },
  'english-speaking': { label: 'English-speaking', icon: '🇬🇧', cat: 'quiz' },
  'arabic-speaking': { label: 'Arabic-speaking', icon: '🕌', cat: 'quiz' },
  'capital-same-name': { label: 'Capital Shares the Name', icon: '🪞', cat: 'quiz' },
  'capitals-a-z': { label: 'Capitals A to Z', icon: '🔠', cat: 'quiz' },
  'caribbean': { label: 'Caribbean Countries', icon: '🌴', cat: 'quiz' },
  'central-america': { label: 'Central America', icon: '🌋', cat: 'quiz' },
  'nordic': { label: 'Nordic Countries', icon: '❄️', cat: 'quiz' },
  'gulf-states': { label: 'Gulf States', icon: '🛢️', cat: 'quiz' },
  'smallest': { label: 'Smallest Countries', icon: '🔬', cat: 'quiz' },
  'least-populous': { label: 'Least Populous', icon: '🧍', cat: 'quiz' },
}

export const CAT_LABELS = { globe: 'Globe Games', nameall: 'Name All', quiz: 'Quizzes' }

export function gameMeta(mode) {
  return GAME_CATALOG[mode] ?? { label: mode, icon: '🎮', cat: 'quiz' }
}
