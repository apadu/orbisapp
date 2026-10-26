import { t } from '../i18n'
/**
 * Metadata for every tracked game mode.
 * cat:      'globe' | 'nameall' | 'quiz'
 * timed:    leaderboard tie-breaks on time (name-all style)
 */
export const GAME_CATALOG = {
  // Globe games
  mystery:               { label: t('Mystery Country'),   icon: '🔍', cat: 'globe' },
  locate:                { label: t('Pinpoint Country'),  icon: '📍', cat: 'globe' },
  neighbor:              { label: t('Neighbors'),         icon: '📌', cat: 'globe' },
  missing:               { label: t('Blind Map'),         icon: '🗺️', cat: 'globe' },
  spotlight:             { label: t('Solo Map'),          icon: '🔦', cat: 'globe' },
  seas:                  { label: t('Seas Quiz'),         icon: '🌊', cat: 'globe' },
  silhouette:            { label: t('Silhouette Spin'),   icon: '🌀', cat: 'globe', unit: t('Named') },
  'capital-drop':        { label: t('Capital Drop'),      icon: '📍', cat: 'globe', unit: t('Points') },
  'line-up':             { label: t('Line Up'),           icon: '📐', cat: 'globe', unit: t('Found') },
  'time-zones':          { label: t('Time Zones'),        icon: '🕰️', cat: 'globe', unit: t('Correct') },
  // Name All
  'name-all':            { label: t('Name All Countries'),  icon: '🌍', cat: 'nameall', timed: true },
  'name-all-caps':       { label: t('Name All Capitals'),   icon: '🏙️', cat: 'nameall', timed: true },
  'name-all-currencies': { label: t('Name All Currencies'), icon: '💰', cat: 'nameall', timed: true },
  'name-all-languages':  { label: t('Name All Languages'),  icon: '🗣️', cat: 'nameall', timed: true },
  mountains:             { label: t('Mountain Ranges'),     icon: '⛰️', cat: 'nameall', timed: true },
  'name-all-seas':       { label: t('Name All Seas'),       icon: '🌊', cat: 'nameall', timed: true },
  'name-all-rivers':     { label: t('Name All Rivers'),     icon: '🏞️', cat: 'nameall', timed: true },
  // HIDDEN until ready — uncomment to bring History Maps back:
  // 'history-maps':        { label: 'History Maps',        icon: '🏛️', cat: 'nameall', timed: true },
  // Quizzes
  scramble:          { label: t('Scramble'),          icon: '🔤', cat: 'quiz' },
  flag:              { label: t('Flags'),             icon: '🚩', cat: 'quiz' },
  capital:           { label: t('Capitals'),          icon: '🏛️', cat: 'quiz' },
  'cap-to-country':  { label: t('Countries by Capital'),     icon: '🗺️', cat: 'quiz' },
  currency:          { label: t('Currencies'),        icon: '💰', cat: 'quiz' },
  language:          { label: t('Languages'),         icon: '🗣️', cat: 'quiz' },
  area:              { label: t('Largest Countries'), icon: '📏', cat: 'quiz' },
  'pop-order':       { label: t('Most Populous'),   icon: '📊', cat: 'quiz' },
  'border-chain':    { label: t('Border Chain'),      icon: '🔗', cat: 'quiz' },
  'missing-vowels':  { label: t('Missing Vowels'),    icon: '🔡', cat: 'quiz' },
  'flag-colors':     { label: t('Flag Colors'),       icon: '🎨', cat: 'quiz' },
  connections:       { label: t('Connections'),       icon: '🧩', cat: 'quiz' },
  'emoji-quiz':      { label: t('Country Emoji'),     icon: '🌍', cat: 'quiz' },
  'country-fact':    { label: t('Country by Fact'),   icon: '📖', cat: 'quiz' },
  endonyms:          { label: t('Endonyms'),          icon: '🗺️', cat: 'quiz' },
  'flags-crescent': { label: t('Flags with a Crescent'), icon: '☪️', cat: 'quiz' },
  'flags-cross': { label: t('Flags with a Cross'), icon: '✝️', cat: 'quiz' },
  'flags-sun': { label: t('Flags with a Sun'), icon: '☀️', cat: 'quiz' },
  'landlocked': { label: t('Landlocked Countries'), icon: '🏔️', cat: 'quiz' },
  'island-nations': { label: t('Island Nations'), icon: '🏝️', cat: 'quiz' },
  'eu-members': { label: t('EU Members'), icon: '🇪🇺', cat: 'quiz' },
  'nato-members': { label: t('NATO Members'), icon: '🛡️', cat: 'quiz' },
  'g20': { label: t('G20 Countries'), icon: '💼', cat: 'quiz' },
  'former-ussr': { label: t('Former Soviet Republics'), icon: '☭', cat: 'quiz' },
  'former-yugoslavia': { label: t('Former Yugoslavia'), icon: '🧩', cat: 'quiz' },
  'equator': { label: t('On the Equator'), icon: '🌐', cat: 'quiz' },
  'stans': { label: t('The -stans'), icon: '🐎', cat: 'quiz' },
  'spanish-speaking': { label: t('Spanish-speaking'), icon: '🇪🇸', cat: 'quiz' },
  'portuguese-speaking': { label: t('Portuguese-speaking'), icon: '🇵🇹', cat: 'quiz' },
  'french-speaking': { label: t('French-speaking'), icon: '🇫🇷', cat: 'quiz' },
  'alphabet': { label: t('A to Z'), icon: '🔤', cat: 'quiz' },
  'daily-quiz': { label: t('Daily Quiz'), icon: '📅', cat: 'quiz' },
  'euro-users': { label: t('Countries Using the Euro'), icon: '💶', cat: 'quiz' },
  'dollar-users': { label: t('Countries Using a Dollar'), icon: '💵', cat: 'quiz' },
  'english-speaking': { label: t('English-speaking'), icon: '🇬🇧', cat: 'quiz' },
  'arabic-speaking': { label: t('Arabic-speaking'), icon: '🕌', cat: 'quiz' },
  'capital-same-name': { label: t('Capital Shares the Name'), icon: '🪞', cat: 'quiz' },
  'capitals-a-z': { label: t('Capitals A to Z'), icon: '🔠', cat: 'quiz' },
  'caribbean': { label: t('Caribbean Countries'), icon: '🌴', cat: 'quiz' },
  'central-america': { label: t('Central America'), icon: '🌋', cat: 'quiz' },
  'nordic': { label: t('Nordic Countries'), icon: '❄️', cat: 'quiz' },
  'gulf-states': { label: t('Gulf States'), icon: '🛢️', cat: 'quiz' },
  'smallest': { label: t('Smallest Countries'), icon: '🔬', cat: 'quiz' },
  'least-populous': { label: t('Least Populous'), icon: '🧍', cat: 'quiz' },
  // Arcade
  'higher-lower':   { label: t('Higher or Lower'), icon: '⚖️', cat: 'quiz', unit: t('Streak') },
  'true-false':     { label: t('True or False'),   icon: '✅', cat: 'quiz', unit: t('Correct') },
  'country-wordle': { label: t('Country Wordle'),  icon: '🟩', cat: 'quiz', unit: t('Points') },
}

export const CAT_LABELS = { globe: 'Globe Games', nameall: 'Name All', quiz: 'Quizzes' }

export function gameMeta(mode) {
  return GAME_CATALOG[mode] ?? { label: mode, icon: '🎮', cat: 'quiz' }
}
