import { t } from '../i18n'
import { TRIPOINT_QUIZZES } from '../quizzes/tripointQuizzes'
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
  spotlight:             { label: t('Spotlight'),          icon: '🔦', cat: 'globe' },
  seas:                  { label: t('Name the Sea'),         icon: '🌊', cat: 'globe' },
  silhouette:            { label: t('Silhouette Spin'),   icon: '🌀', cat: 'globe', unit: t('Named') },
  'capital-drop':        { label: t('Capital Drop'),      icon: '📍', cat: 'globe', unit: t('Points') },
  'landmark-drop':       { label: t('Landmark Drop'),     icon: '🗽', cat: 'globe', unit: t('Points') },
  antipodes:             { label: t('Antipodes'),         icon: '🔄', cat: 'globe', unit: t('Points') },
  distance:              { label: t('How Far?'),          icon: '📏', cat: 'globe', unit: t('Points') },
  'line-up':             { label: t('Line Up'),           icon: '📐', cat: 'globe', unit: t('Found') },
  'time-zones':          { label: t('Time Zones'),        icon: '🕰️', cat: 'globe', unit: t('Correct') },
  // Name All
  'name-all':            { label: t('Name All Countries'),  icon: '🌍', cat: 'nameall', timed: true },
  'name-all-caps':       { label: t('Name All Capitals'),   icon: '🏙️', cat: 'nameall', timed: true },
  'name-all-currencies': { label: t('Name All Currencies'), icon: '💰', cat: 'nameall', timed: true },
  'name-all-languages':  { label: t('Name All Languages'),  icon: '🗣️', cat: 'nameall', timed: true },
  mountains:             { label: t('Name All Mountain Ranges'),     icon: '⛰️', cat: 'nameall', timed: true },
  'name-all-seas':       { label: t('Name All Seas'),       icon: '🌊', cat: 'nameall', timed: true },
  'name-all-rivers':     { label: t('Name All Rivers'),     icon: '🏞️', cat: 'nameall', timed: true },
  // HIDDEN until ready — uncomment to bring History Maps back:
  // 'history-maps':        { label: 'History Maps',        icon: '🏛️', cat: 'nameall', timed: true },
  // Quizzes
  scramble:          { label: t('Scramble'),          icon: '🔤', cat: 'quiz' },
  flag:              { label: t('Flag Fever'),             icon: '🚩', cat: 'quiz' },
  capital:           { label: t('Capital Fever'),          icon: '🏛️', cat: 'quiz' },
  'capitals-europe': { label: t('Capitals of Europe'), icon: '🏰', cat: 'quiz' },
  'capitals-asia': { label: t('Capitals of Asia'), icon: '🏯', cat: 'quiz' },
  'capitals-africa': { label: t('Capitals of Africa'), icon: '🦁', cat: 'quiz' },
  'capitals-americas': { label: t('Capitals of the Americas'), icon: '🗽', cat: 'quiz' },
  'capitals-oceania': { label: t('Capitals of Oceania'), icon: '🌊', cat: 'quiz' },
  'cap-to-country':  { label: t('Countries by Capital'),     icon: '🗺️', cat: 'quiz' },
  currency:          { label: t('Currencies'),        icon: '💰', cat: 'quiz' },
  language:          { label: t('Languages'),         icon: '🗣️', cat: 'quiz' },
  area:              { label: t('Largest Countries'), icon: '📏', cat: 'quiz' },
  'area-africa': { label: t('Largest Countries of Africa'), icon: '📏', cat: 'quiz' },
  'area-americas': { label: t('Largest Countries of the Americas'), icon: '📏', cat: 'quiz' },
  'area-asia': { label: t('Largest Countries of Asia'), icon: '📏', cat: 'quiz' },
  'area-europe': { label: t('Largest Countries of Europe'), icon: '📏', cat: 'quiz' },
  'pop-order':       { label: t('Most Populous Countries'),   icon: '📊', cat: 'quiz' },
  'pop-africa': { label: t('Most Populous Countries of Africa'), icon: '📊', cat: 'quiz' },
  'pop-americas': { label: t('Most Populous Countries of the Americas'), icon: '📊', cat: 'quiz' },
  'pop-asia': { label: t('Most Populous Countries of Asia'), icon: '📊', cat: 'quiz' },
  'pop-europe': { label: t('Most Populous Countries of Europe'), icon: '📊', cat: 'quiz' },
  'border-chain':    { label: t('Border Chain'),      icon: '🔗', cat: 'quiz' },
  'missing-vowels':  { label: t('Missing Vowels'),    icon: '🔡', cat: 'quiz' },
  'flag-colors':     { label: t('Flag Colors'),       icon: '🎨', cat: 'quiz' },
  connections:       { label: t('Country Connections'),       icon: '🧩', cat: 'quiz' },
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
  'daily-quiz': { label: t('Daily Fever'), icon: '📅', cat: 'quiz' },
  'country-grid': { label: t('Country Grid'), icon: '🔲', cat: 'quiz' },
  'named-after': { label: t('Countries Named After People'), icon: '👤', cat: 'quiz' },
  'former-names': { label: t('Former Country Names'), icon: '📜', cat: 'quiz' },
  monarchies: { label: t('Monarchies Today'), icon: '👑', cat: 'quiz' },
  'drive-left': { label: t('Countries Driving on the Left'), icon: '🚗', cat: 'quiz' },
  ww1: { label: t('World War I Countries'), icon: '🪖', cat: 'quiz' },
  ww2: { label: t('World War II Countries'), icon: '✈️', cat: 'quiz' },
  'euro-users': { label: t('Countries Using the Euro'), icon: '💶', cat: 'quiz' },
  'dollar-users': { label: t('Countries Using a Dollar'), icon: '💵', cat: 'quiz' },
  'english-speaking': { label: t('English-speaking'), icon: '🇬🇧', cat: 'quiz' },
  'arabic-speaking': { label: t('Arabic-speaking'), icon: '🕌', cat: 'quiz' },
  'capital-same-name': { label: t('Capital Namesakes'), icon: '🪞', cat: 'quiz' },
  'capitals-a-z': { label: t('Capitals A to Z'), icon: '🔠', cat: 'quiz' },
  'caribbean': { label: t('Caribbean Countries'), icon: '🌴', cat: 'quiz' },
  'central-america': { label: t('Central America'), icon: '🌋', cat: 'quiz' },
  'nordic': { label: t('Nordic Countries'), icon: '❄️', cat: 'quiz' },
  'gulf-states': { label: t('Gulf States'), icon: '🛢️', cat: 'quiz' },
  'smallest': { label: t('Smallest Countries'), icon: '🔬', cat: 'quiz' },
  'least-populous': { label: t('Least Populous'), icon: '🧍', cat: 'quiz' },
  // Country maps (2D)
  'ro-counties':    { label: t('Counties of Romania'),   icon: '🇷🇴', cat: 'quiz', timed: true },
  'ro-seats':       { label: t('Romanian County Seats'), icon: '🏙️', cat: 'quiz', timed: true },
  'ro-quiz':        { label: t('Quiz: Romania'),         icon: '❓', cat: 'quiz' },
  'country-ro':     { label: t('Romania — country page'), icon: '🇷🇴', cat: 'quiz' },
  'md-raions':      { label: t('Districts of Moldova'),  icon: '🇲🇩', cat: 'quiz', timed: true },
  'md-quiz':        { label: t('Quiz: Moldova'),         icon: '❓', cat: 'quiz' },
  'country-md':     { label: t('Moldova — country page'), icon: '🇲🇩', cat: 'quiz' },
  'us-states':      { label: t('US States'),             icon: '🇺🇸', cat: 'quiz', timed: true },
  'us-capitals':    { label: t('US State Capitals'),     icon: '🏛️', cat: 'quiz', timed: true },
  'us-quiz':        { label: t('Quiz: United States'),   icon: '❓', cat: 'quiz' },
  'country-us':     { label: t('United States — country page'), icon: '🇺🇸', cat: 'quiz' },
  'it-regions': { label: t('Regions of Italy'), icon: '🇮🇹', cat: 'quiz', timed: true },
  'it-capitals': { label: t('Regional Capitals of Italy'), icon: '🏛️', cat: 'quiz', timed: true },
  'it-quiz': { label: t('Quiz: Italy'), icon: '❓', cat: 'quiz' },
  'country-it': { label: t('Italy — country page'), icon: '🇮🇹', cat: 'quiz' },
  'fr-regions': { label: t('Regions of France'), icon: '🇫🇷', cat: 'quiz', timed: true },
  'fr-capitals': { label: t('Regional Capitals of France'), icon: '🏛️', cat: 'quiz', timed: true },
  'fr-quiz': { label: t('Quiz: France'), icon: '❓', cat: 'quiz' },
  'country-fr': { label: t('France — country page'), icon: '🇫🇷', cat: 'quiz' },
  'de-states': { label: t('States of Germany'), icon: '🇩🇪', cat: 'quiz', timed: true },
  'de-capitals': { label: t('State Capitals of Germany'), icon: '🏛️', cat: 'quiz', timed: true },
  'de-quiz': { label: t('Quiz: Germany'), icon: '❓', cat: 'quiz' },
  'country-de': { label: t('Germany — country page'), icon: '🇩🇪', cat: 'quiz' },
  'es-regions': { label: t('Autonomous Communities of Spain'), icon: '🇪🇸', cat: 'quiz', timed: true },
  'es-capitals': { label: t('Regional Capitals of Spain'), icon: '🏛️', cat: 'quiz', timed: true },
  'es-quiz': { label: t('Quiz: Spain'), icon: '❓', cat: 'quiz' },
  'country-es': { label: t('Spain — country page'), icon: '🇪🇸', cat: 'quiz' },
  'jp-prefectures': { label: t('Prefectures of Japan'), icon: '🇯🇵', cat: 'quiz', timed: true },
  'jp-capitals': { label: t('Prefectural Capitals of Japan'), icon: '🏯', cat: 'quiz', timed: true },
  'jp-quiz': { label: t('Quiz: Japan'), icon: '❓', cat: 'quiz' },
  'country-jp': { label: t('Japan — country page'), icon: '🇯🇵', cat: 'quiz' },
  'gb-regions': { label: t('Regions of the United Kingdom'), icon: '🇬🇧', cat: 'quiz', timed: true },
  'gb-quiz': { label: t('Quiz: United Kingdom'), icon: '❓', cat: 'quiz' },
  'country-gb': { label: t('United Kingdom — country page'), icon: '🇬🇧', cat: 'quiz' },
  'pl-voivodeships': { label: t('Voivodeships of Poland'), icon: '🇵🇱', cat: 'quiz', timed: true },
  'pl-capitals': { label: t('Voivodeship Capitals of Poland'), icon: '🏛️', cat: 'quiz', timed: true },
  'pl-quiz': { label: t('Quiz: Poland'), icon: '❓', cat: 'quiz' },
  'country-pl': { label: t('Poland — country page'), icon: '🇵🇱', cat: 'quiz' },
  'hu-counties': { label: t('Counties of Hungary'), icon: '🇭🇺', cat: 'quiz', timed: true },
  'hu-seats': { label: t('County Seats of Hungary'), icon: '🏛️', cat: 'quiz', timed: true },
  'hu-quiz': { label: t('Quiz: Hungary'), icon: '❓', cat: 'quiz' },
  'country-hu': { label: t('Hungary — country page'), icon: '🇭🇺', cat: 'quiz' },
  'br-states': { label: t('States of Brazil'), icon: '🇧🇷', cat: 'quiz', timed: true },
  'br-capitals': { label: t('State Capitals of Brazil'), icon: '🏛️', cat: 'quiz', timed: true },
  'br-quiz': { label: t('Quiz: Brazil'), icon: '❓', cat: 'quiz' },
  'country-br': { label: t('Brazil — country page'), icon: '🇧🇷', cat: 'quiz' },
  'ca-provinces': { label: t('Provinces and Territories of Canada'), icon: '🇨🇦', cat: 'quiz', timed: true },
  'ca-capitals': { label: t('Provincial Capitals of Canada'), icon: '🏛️', cat: 'quiz', timed: true },
  'ca-quiz': { label: t('Quiz: Canada'), icon: '❓', cat: 'quiz' },
  'country-ca': { label: t('Canada — country page'), icon: '🇨🇦', cat: 'quiz' },
  'au-states': { label: t('States and Territories of Australia'), icon: '🇦🇺', cat: 'quiz', timed: true },
  'au-capitals': { label: t('State Capitals of Australia'), icon: '🏛️', cat: 'quiz', timed: true },
  'au-quiz': { label: t('Quiz: Australia'), icon: '❓', cat: 'quiz' },
  'mx-states': { label: t("States of Mexico"), icon: '🇲🇽', cat: 'quiz', timed: true },
  'mx-capitals': { label: t("State Capitals of Mexico"), icon: '🏛️', cat: 'quiz', timed: true },
  'mx-quiz': { label: t("Quiz: Mexico"), icon: '❓', cat: 'quiz' },
  'country-mx': { label: t("Mexico \u2014 country page"), icon: '🇲🇽', cat: 'quiz' },
  'in-states': { label: t("States and Territories of India"), icon: '🇮🇳', cat: 'quiz', timed: true },
  'in-capitals': { label: t("State Capitals of India"), icon: '🏛️', cat: 'quiz', timed: true },
  'in-quiz': { label: t("Quiz: India"), icon: '❓', cat: 'quiz' },
  'country-in': { label: t("India \u2014 country page"), icon: '🇮🇳', cat: 'quiz' },
  'cn-provinces': { label: t("Provinces of China"), icon: '🇨🇳', cat: 'quiz', timed: true },
  'cn-capitals': { label: t("Provincial Capitals of China"), icon: '🏛️', cat: 'quiz', timed: true },
  'cn-quiz': { label: t("Quiz: China"), icon: '❓', cat: 'quiz' },
  'country-cn': { label: t("China \u2014 country page"), icon: '🇨🇳', cat: 'quiz' },
  'ru-subjects': { label: t("Federal Subjects of Russia"), icon: '🇷🇺', cat: 'quiz', timed: true },
  'ru-quiz': { label: t("Quiz: Russia"), icon: '❓', cat: 'quiz' },
  'country-ru': { label: t("Russia \u2014 country page"), icon: '🇷🇺', cat: 'quiz' },
  'ar-provinces': { label: t("Provinces of Argentina"), icon: '🇦🇷', cat: 'quiz', timed: true },
  'ar-capitals': { label: t("Provincial Capitals of Argentina"), icon: '🏛️', cat: 'quiz', timed: true },
  'ar-quiz': { label: t("Quiz: Argentina"), icon: '❓', cat: 'quiz' },
  'country-ar': { label: t("Argentina \u2014 country page"), icon: '🇦🇷', cat: 'quiz' },
  'tr-provinces': { label: t("Provinces of Turkey"), icon: '🇹🇷', cat: 'quiz', timed: true },
  'tr-quiz': { label: t("Quiz: Turkey"), icon: '❓', cat: 'quiz' },
  'country-tr': { label: t("Turkey \u2014 country page"), icon: '🇹🇷', cat: 'quiz' },
  'kr-provinces': { label: t("Provinces of South Korea"), icon: '🇰🇷', cat: 'quiz', timed: true },
  'kr-capitals': { label: t("Provincial Capitals of South Korea"), icon: '🏛️', cat: 'quiz', timed: true },
  'kr-quiz': { label: t("Quiz: South Korea"), icon: '❓', cat: 'quiz' },
  'country-kr': { label: t("South Korea — country page"), icon: '🇰🇷', cat: 'quiz' },
  'eg-governorates': { label: t("Governorates of Egypt"), icon: '🇪🇬', cat: 'quiz', timed: true },
  'eg-capitals': { label: t("Governorate Capitals of Egypt"), icon: '🏛️', cat: 'quiz', timed: true },
  'eg-quiz': { label: t("Quiz: Egypt"), icon: '❓', cat: 'quiz' },
  'country-eg': { label: t("Egypt — country page"), icon: '🇪🇬', cat: 'quiz' },
  'ng-states': { label: t("States of Nigeria"), icon: '🇳🇬', cat: 'quiz', timed: true },
  'ng-capitals': { label: t("State Capitals of Nigeria"), icon: '🏛️', cat: 'quiz', timed: true },
  'ng-quiz': { label: t("Quiz: Nigeria"), icon: '❓', cat: 'quiz' },
  'country-ng': { label: t("Nigeria — country page"), icon: '🇳🇬', cat: 'quiz' },
  'za-provinces': { label: t("Provinces of South Africa"), icon: '🇿🇦', cat: 'quiz', timed: true },
  'za-capitals': { label: t("Provincial Capitals of South Africa"), icon: '🏛️', cat: 'quiz', timed: true },
  'za-quiz': { label: t("Quiz: South Africa"), icon: '❓', cat: 'quiz' },
  'country-za': { label: t("South Africa — country page"), icon: '🇿🇦', cat: 'quiz' },
  'th-provinces': { label: t("Provinces of Thailand"), icon: '🇹🇭', cat: 'quiz', timed: true },
  'th-quiz': { label: t("Quiz: Thailand"), icon: '❓', cat: 'quiz' },
  'country-th': { label: t("Thailand — country page"), icon: '🇹🇭', cat: 'quiz' },
  'pe-regions': { label: t("Regions of Peru"), icon: '🇵🇪', cat: 'quiz', timed: true },
  'pe-capitals': { label: t("Regional Capitals of Peru"), icon: '🏛️', cat: 'quiz', timed: true },
  'pe-quiz': { label: t("Quiz: Peru"), icon: '❓', cat: 'quiz' },
  'country-pe': { label: t("Peru — country page"), icon: '🇵🇪', cat: 'quiz' },
  'co-departments': { label: t("Departments of Colombia"), icon: '🇨🇴', cat: 'quiz', timed: true },
  'co-capitals': { label: t("Departmental Capitals of Colombia"), icon: '🏛️', cat: 'quiz', timed: true },
  'co-quiz': { label: t("Quiz: Colombia"), icon: '❓', cat: 'quiz' },
  'country-co': { label: t("Colombia — country page"), icon: '🇨🇴', cat: 'quiz' },
  'ir-provinces': { label: t("Provinces of Iran"), icon: '🇮🇷', cat: 'quiz', timed: true },
  'ir-capitals': { label: t("Provincial Capitals of Iran"), icon: '🏛️', cat: 'quiz', timed: true },
  'ir-quiz': { label: t("Quiz: Iran"), icon: '❓', cat: 'quiz' },
  'country-ir': { label: t("Iran — country page"), icon: '🇮🇷', cat: 'quiz' },
  'gr-regions': { label: t("Regions of Greece"), icon: '🇬🇷', cat: 'quiz', timed: true },
  'gr-capitals': { label: t("Regional Capitals of Greece"), icon: '🏛️', cat: 'quiz', timed: true },
  'gr-quiz': { label: t("Quiz: Greece"), icon: '❓', cat: 'quiz' },
  'country-gr': { label: t("Greece — country page"), icon: '🇬🇷', cat: 'quiz' },
  'se-counties': { label: t("Counties of Sweden"), icon: '🇸🇪', cat: 'quiz', timed: true },
  'se-capitals': { label: t("County Seats of Sweden"), icon: '🏛️', cat: 'quiz', timed: true },
  'se-quiz': { label: t("Quiz: Sweden"), icon: '❓', cat: 'quiz' },
  'country-se': { label: t("Sweden — country page"), icon: '🇸🇪', cat: 'quiz' },
  'pt-districts': { label: t("Districts of Portugal"), icon: '🇵🇹', cat: 'quiz', timed: true },
  'pt-quiz': { label: t("Quiz: Portugal"), icon: '❓', cat: 'quiz' },
  'ch-cantons': { label: t("Cantons of Switzerland"), icon: '🇨🇭', cat: 'quiz', timed: true },
  'ch-capitals': { label: t("Cantonal Capitals of Switzerland"), icon: '🏛️', cat: 'quiz', timed: true },
  'ch-quiz': { label: t("Quiz: Switzerland"), icon: '❓', cat: 'quiz' },
  'cz-regions': { label: t("Regions of Czechia"), icon: '🇨🇿', cat: 'quiz', timed: true },
  'cz-capitals': { label: t("Regional Capitals of Czechia"), icon: '🏛️', cat: 'quiz', timed: true },
  'cz-quiz': { label: t("Quiz: Czechia"), icon: '❓', cat: 'quiz' },
  'be-provinces': { label: t("Provinces of Belgium"), icon: '🇧🇪', cat: 'quiz', timed: true },
  'be-capitals': { label: t("Provincial Capitals of Belgium"), icon: '🏛️', cat: 'quiz', timed: true },
  'be-quiz': { label: t("Quiz: Belgium"), icon: '❓', cat: 'quiz' },
  'sk-regions': { label: t("Regions of Slovakia"), icon: '🇸🇰', cat: 'quiz', timed: true },
  'sk-quiz': { label: t("Quiz: Slovakia"), icon: '❓', cat: 'quiz' },
  'ie-counties': { label: t("Counties of Ireland"), icon: '🇮🇪', cat: 'quiz', timed: true },
  'ie-quiz': { label: t("Quiz: Ireland"), icon: '❓', cat: 'quiz' },
  'my-states': { label: t("States of Malaysia"), icon: '🇲🇾', cat: 'quiz', timed: true },
  'my-capitals': { label: t("State Capitals of Malaysia"), icon: '🏛️', cat: 'quiz', timed: true },
  'my-quiz': { label: t("Quiz: Malaysia"), icon: '❓', cat: 'quiz' },
  'lk-provinces': { label: t("Provinces of Sri Lanka"), icon: '🇱🇰', cat: 'quiz', timed: true },
  'lk-capitals': { label: t("Provincial Capitals of Sri Lanka"), icon: '🏛️', cat: 'quiz', timed: true },
  'lk-quiz': { label: t("Quiz: Sri Lanka"), icon: '❓', cat: 'quiz' },
  'mn-aimags': { label: t("Aimags of Mongolia"), icon: '🇲🇳', cat: 'quiz', timed: true },
  'mn-capitals': { label: t("Aimag Centres of Mongolia"), icon: '🏛️', cat: 'quiz', timed: true },
  'mn-quiz': { label: t("Quiz: Mongolia"), icon: '❓', cat: 'quiz' },
  'ec-provinces': { label: t("Provinces of Ecuador"), icon: '🇪🇨', cat: 'quiz', timed: true },
  'ec-capitals': { label: t("Provincial Capitals of Ecuador"), icon: '🏛️', cat: 'quiz', timed: true },
  'ec-quiz': { label: t("Quiz: Ecuador"), icon: '❓', cat: 'quiz' },
  'bo-departments': { label: t("Departments of Bolivia"), icon: '🇧🇴', cat: 'quiz', timed: true },
  'bo-quiz': { label: t("Quiz: Bolivia"), icon: '❓', cat: 'quiz' },
  'bg-provinces': { label: t("Provinces of Bulgaria"), icon: '🇧🇬', cat: 'quiz', timed: true },
  'bg-quiz': { label: t("Quiz: Bulgaria"), icon: '❓', cat: 'quiz' },
  'ke-counties': { label: t("Counties of Kenya"), icon: '🇰🇪', cat: 'quiz', timed: true },
  'ke-quiz': { label: t("Quiz: Kenya"), icon: '❓', cat: 'quiz' },
  'gh-regions': { label: t("Regions of Ghana"), icon: '🇬🇭', cat: 'quiz', timed: true },
  'gh-capitals': { label: t("Regional Capitals of Ghana"), icon: '🏛️', cat: 'quiz', timed: true },
  'gh-quiz': { label: t("Quiz: Ghana"), icon: '❓', cat: 'quiz' },
  'tn-governorates': { label: t("Governorates of Tunisia"), icon: '🇹🇳', cat: 'quiz', timed: true },
  'tn-quiz': { label: t("Quiz: Tunisia"), icon: '❓', cat: 'quiz' },
  'sn-regions': { label: t("Regions of Senegal"), icon: '🇸🇳', cat: 'quiz', timed: true },
  'sn-quiz': { label: t("Quiz: Senegal"), icon: '❓', cat: 'quiz' },
  'cm-regions': { label: t("Regions of Cameroon"), icon: '🇨🇲', cat: 'quiz', timed: true },
  'cm-capitals': { label: t("Regional Capitals of Cameroon"), icon: '🏛️', cat: 'quiz', timed: true },
  'cm-quiz': { label: t("Quiz: Cameroon"), icon: '❓', cat: 'quiz' },
  'nl-provinces': { label: t("Provinces of the Netherlands"), icon: '🇳🇱', cat: 'quiz', timed: true },
  'nl-capitals': { label: t("Provincial Capitals of the Netherlands"), icon: '🏛️', cat: 'quiz', timed: true },
  'nl-quiz': { label: t("Quiz: Netherlands"), icon: '❓', cat: 'quiz' },
  'ua-oblasts': { label: t("Oblasts of Ukraine"), icon: '🇺🇦', cat: 'quiz', timed: true },
  'ua-capitals': { label: t("Oblast Centres of Ukraine"), icon: '🏛️', cat: 'quiz', timed: true },
  'ua-quiz': { label: t("Quiz: Ukraine"), icon: '❓', cat: 'quiz' },
  'at-states': { label: t("States of Austria"), icon: '🇦🇹', cat: 'quiz', timed: true },
  'at-capitals': { label: t("State Capitals of Austria"), icon: '🏛️', cat: 'quiz', timed: true },
  'at-quiz': { label: t("Quiz: Austria"), icon: '❓', cat: 'quiz' },
  'cl-regions': { label: t("Regions of Chile"), icon: '🇨🇱', cat: 'quiz', timed: true },
  'cl-capitals': { label: t("Regional Capitals of Chile"), icon: '🏛️', cat: 'quiz', timed: true },
  'cl-quiz': { label: t("Quiz: Chile"), icon: '❓', cat: 'quiz' },
  'nz-regions': { label: t("Regions of New Zealand"), icon: '🇳🇿', cat: 'quiz', timed: true },
  'nz-quiz': { label: t("Quiz: New Zealand"), icon: '❓', cat: 'quiz' },
  'sa-regions': { label: t("Regions of Saudi Arabia"), icon: '🇸🇦', cat: 'quiz', timed: true },
  'sa-capitals': { label: t("Regional Capitals of Saudi Arabia"), icon: '🏛️', cat: 'quiz', timed: true },
  'sa-quiz': { label: t("Quiz: Saudi Arabia"), icon: '❓', cat: 'quiz' },
  'country-pt': { label: t("Portugal — country page"), icon: '🇵🇹', cat: 'quiz' },
  'country-au': { label: t('Australia — country page'), icon: '🇦🇺', cat: 'quiz' },
  // Arcade
  'higher-lower':   { label: t('Higher or Lower'), icon: '⚖️', cat: 'quiz', unit: t('Streak') },
  'true-false':     { label: t('True or False'),   icon: '✅', cat: 'quiz', unit: t('Correct') },
  'flags-pick':     { label: t('Pick the Flag'),   icon: '🎯', cat: 'quiz', unit: t('Correct') },
  'flags-sprint':   { label: t('Fever Sprint'),     icon: '⚡', cat: 'quiz', unit: t('Correct') },
  'flags-survival': { label: t('Flag Survival'),   icon: '❤️', cat: 'quiz', unit: t('Correct') },
  'country-wordle': { label: t('Country Wordle'),  icon: '🟩', cat: 'quiz', unit: t('Points') },
}

for (const q of Object.values(TRIPOINT_QUIZZES)) GAME_CATALOG[q.id] = { label: q.title, icon: '⨯', cat: 'quiz' }
GAME_CATALOG.islands = { label: t('Famous Islands'), icon: '🏝️', cat: 'quiz', timed: true }
GAME_CATALOG.peninsulas = { label: t('Famous Peninsulas'), icon: '🗺️', cat: 'quiz', timed: true }
GAME_CATALOG['lakes'] = { label: t('Famous Lakes'), icon: '💧', cat: 'quiz', timed: true }
GAME_CATALOG['deserts'] = { label: t('Famous Deserts'), icon: '🏜️', cat: 'quiz', timed: true }
GAME_CATALOG['seas-map'] = { label: t('Seas and Gulfs'), icon: '🌊', cat: 'quiz', timed: true }
GAME_CATALOG['straits'] = { label: t('Famous Straits'), icon: '⚓', cat: 'quiz', timed: true }
GAME_CATALOG['ports'] = { label: t('Ports and Canals'), icon: '🚢', cat: 'quiz', timed: true }
GAME_CATALOG["volcanoes"] = { label: t("Famous Volcanoes"), icon: '🌋', cat: 'quiz', timed: true }
GAME_CATALOG["volcano"] = { label: t("Anatomy of a Volcano"), icon: '🌋', cat: 'quiz', timed: true }
GAME_CATALOG["plate-boundaries"] = { label: t("Plate Boundaries"), icon: '↔️', cat: 'quiz', timed: true }
GAME_CATALOG["ocean-floor"] = { label: t("Trenches and Ridges"), icon: '🌊', cat: 'quiz', timed: true }
GAME_CATALOG["water-cycle"] = { label: t("The Water Cycle"), icon: '💧', cat: 'quiz', timed: true }
GAME_CATALOG["currents"] = { label: t("Ocean Currents"), icon: '🌀', cat: 'quiz', timed: true }
GAME_CATALOG["climate-zones"] = { label: t("Climate Zones"), icon: '🌡️', cat: 'quiz', timed: true }
GAME_CATALOG["earth-lines"] = { label: t("Imaginary Lines"), icon: '🧭', cat: 'quiz', timed: true }
GAME_CATALOG["earth-orbit"] = { label: t("The Earth in Space"), icon: '☀️', cat: 'quiz', timed: true }
GAME_CATALOG["landscape"] = { label: t("Landforms"), icon: '⛰️', cat: 'quiz', timed: true }
GAME_CATALOG["biomes"] = { label: t("Biomes"), icon: '🌳', cat: 'quiz', timed: true }
GAME_CATALOG["minerals"] = { label: t("Minerals"), icon: '💎', cat: 'quiz', timed: true }
GAME_CATALOG["phenomena"] = { label: t("Natural Phenomena"), icon: '🌪️', cat: 'quiz', timed: true }
GAME_CATALOG["earth-records"] = { label: t("Records of the Earth"), icon: '🏆', cat: 'quiz', timed: true }
GAME_CATALOG["geologic-time"] = { label: t("Geological Time"), icon: '🦕', cat: 'quiz', timed: true }
GAME_CATALOG["solar-system"] = { label: t("The Solar System"), icon: '🪐', cat: 'quiz', timed: true }
GAME_CATALOG["planets"] = { label: t("Planets by Clues"), icon: '🪐', cat: 'quiz', timed: true }
GAME_CATALOG["moon-phases"] = { label: t("Phases of the Moon"), icon: '🌓', cat: 'quiz', timed: true }
GAME_CATALOG["eclipses"] = { label: t("Eclipses"), icon: '🌑', cat: 'quiz', timed: true }
GAME_CATALOG["sun-anatomy"] = { label: t("Inside the Sun"), icon: '☀️', cat: 'quiz', timed: true }
GAME_CATALOG["moons"] = { label: t("Moons of the Solar System"), icon: '🌙', cat: 'quiz', timed: true }
GAME_CATALOG["sky-map"] = { label: t("The Night Sky"), icon: '🌌', cat: 'quiz', timed: true }
GAME_CATALOG["stars-constellations"] = { label: t("Stars and Constellations"), icon: '✨', cat: 'quiz', timed: true }
GAME_CATALOG["missions"] = { label: t("Space Exploration"), icon: '🚀', cat: 'quiz', timed: true }
GAME_CATALOG["phys-europe"] = { label: t("Physical Map of Europe"), icon: '🏔️', cat: 'quiz', timed: true }
GAME_CATALOG["phys-asia"] = { label: t("Physical Map of Asia"), icon: '🏔️', cat: 'quiz', timed: true }
GAME_CATALOG["phys-africa"] = { label: t("Physical Map of Africa"), icon: '🏔️', cat: 'quiz', timed: true }
GAME_CATALOG["phys-namerica"] = { label: t("Physical Map of North America"), icon: '🏔️', cat: 'quiz', timed: true }
GAME_CATALOG["phys-samerica"] = { label: t("Physical Map of South America"), icon: '🏔️', cat: 'quiz', timed: true }
GAME_CATALOG["phys-oceania"] = { label: t("Physical Map of Oceania"), icon: '🏔️', cat: 'quiz', timed: true }
GAME_CATALOG["rivers-world"] = { label: t("Great Rivers of the World"), icon: '🏞️', cat: 'quiz', timed: true }
GAME_CATALOG["wonders-ancient"] = { label: t("Seven Wonders of the Ancient World"), icon: '🏛️', cat: 'quiz', timed: true }
GAME_CATALOG["wonders-new"] = { label: t("New Seven Wonders"), icon: '🗿', cat: 'quiz', timed: true }
GAME_CATALOG["cities-world"] = { label: t("Great Cities of the World"), icon: '🏙️', cat: 'quiz', timed: true }
GAME_CATALOG["cities-europe"] = { label: t("Cities of Europe"), icon: '🏰', cat: 'quiz', timed: true }
GAME_CATALOG["cities-romania"] = { label: t("Cities of Romania"), icon: '🇷🇴', cat: 'quiz', timed: true }
GAME_CATALOG["hist-100"] = { label: t("The World in AD 100"), icon: '🏛️', cat: 'quiz', timed: true }
GAME_CATALOG["hist-1279"] = { label: t("The Mongol Empire, 1279"), icon: '🐎', cat: 'quiz', timed: true }
GAME_CATALOG["hist-1700"] = { label: t("The World in 1700"), icon: '👑', cat: 'quiz', timed: true }
GAME_CATALOG["hist-1914"] = { label: t("Colonial Empires in 1914"), icon: '🗺️', cat: 'quiz', timed: true }
GAME_CATALOG['flags-historical'] = { label: t('Historical Flags'), icon: '🏴', cat: 'quiz', timed: true }
GAME_CATALOG["peaks"] = { label: t("Famous Peaks"), icon: '🏔️', cat: 'quiz', timed: true }
GAME_CATALOG["waterfalls"] = { label: t("Famous Waterfalls"), icon: '💦', cat: 'quiz', timed: true }
GAME_CATALOG["natural-wonders"] = { label: t("Natural Wonders"), icon: '🏞️', cat: 'quiz', timed: true }
GAME_CATALOG["extreme-points"] = { label: t("Extreme Points of the Continents"), icon: '🧭', cat: 'quiz', timed: true }
GAME_CATALOG["clouds"] = { label: t("Types of Clouds"), icon: '☁️', cat: 'quiz', timed: true }
GAME_CATALOG["climates"] = { label: t("Climate Types"), icon: '🌦️', cat: 'quiz', timed: true }
GAME_CATALOG["scales"] = { label: t("Scales and Units"), icon: '📐', cat: 'quiz', timed: true }
GAME_CATALOG["river-coast"] = { label: t("Rivers and Coasts"), icon: '🏞️', cat: 'quiz', timed: true }
GAME_CATALOG["atmosphere"] = { label: t("What's Up There? The Atmosphere"), icon: '🛰️', cat: 'quiz', timed: true }
GAME_CATALOG["volcano-types"] = { label: t("Kinds of Volcanoes"), icon: '🌋', cat: 'quiz', timed: true }
GAME_CATALOG["milky-way"] = { label: t("Our Galaxy, the Milky Way"), icon: '🌀', cat: 'quiz', timed: true }
GAME_CATALOG["star-life"] = { label: t("The Life of a Star"), icon: '⭐', cat: 'quiz', timed: true }
GAME_CATALOG["moon-map"] = { label: t("Map of the Moon"), icon: '🌕', cat: 'quiz', timed: true }
GAME_CATALOG["mars-map"] = { label: t("Map of Mars"), icon: '🔴', cat: 'quiz', timed: true }
GAME_CATALOG["bright-stars"] = { label: t("The Brightest Stars"), icon: '🌟', cat: 'quiz', timed: true }
GAME_CATALOG["zodiac"] = { label: t("Constellations of the Zodiac"), icon: '♈', cat: 'quiz', timed: true }
GAME_CATALOG["glaciers"] = { label: t("Glaciers and Ice Caps"), icon: '🧊', cat: 'quiz', timed: true }
GAME_CATALOG["records-map"] = { label: t("Record-Breaking Places"), icon: '🏆', cat: 'quiz', timed: true }
GAME_CATALOG.duel = { label: t('Don\'t Say What I Say'), icon: '👥', cat: 'quiz' }
GAME_CATALOG['scale-sort'] = { label: t('The Scale of Things'), icon: '📏', cat: 'quiz', unit: t('Points') }
GAME_CATALOG.rocks = { label: t('Rock Types'), icon: '🪨', cat: 'quiz', timed: true }
GAME_CATALOG.plates = { label: t('Tectonic Plates'), icon: '🧩', cat: 'quiz', timed: true }
GAME_CATALOG['earth-layers'] = { label: t('Layers of the Earth'), icon: '🌍', cat: 'quiz', timed: true }
GAME_CATALOG['rock-cycle'] = { label: t('The Rock Cycle'), icon: '🔄', cat: 'quiz', timed: true }

export const CAT_LABELS = { globe: 'Globe Games', nameall: 'Name All', quiz: 'Quizzes' }

export function gameMeta(mode) {
  return GAME_CATALOG[mode] ?? { label: mode, icon: '🎮', cat: 'quiz' }
}
