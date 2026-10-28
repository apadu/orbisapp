/**
 * World War quizzes — countries under the names they had at the time
 * (Austria-Hungary, Ottoman Empire, Yugoslavia, Czechoslovakia, Soviet Union…).
 * Answers accept the period name in English and Romanian, plus the modern country
 * (when there is a clear one) so "Turkey" counts for the Ottoman Empire.
 *
 * Each row: [id, English name, Romanian name, side, year entered, modern country | null, extra answers[]]
 */
import { t, isRo } from '../i18n'

const WW1 = [
  // Central Powers
  ['de-empire',  'German Empire',      'Imperiul German',     'central', 1914, 'Germany',  ['Imperial Germany', 'Deutsches Reich', 'Kaiserreich']],
  ['a-h',        'Austria-Hungary',    'Austro-Ungaria',      'central', 1914, null,       ['Austro-Hungary', 'Austria Hungary', 'Austro-Hungarian Empire', 'Austria', 'Imperiul Austro-Ungar', 'Austria-Ungaria']],
  ['ottoman',    'Ottoman Empire',     'Imperiul Otoman',     'central', 1914, 'Turkey',   ['Ottomans', 'Turkey', 'Otomani']],
  ['bulgaria1',  'Bulgaria',           'Bulgaria',            'central', 1915, 'Bulgaria', ['Kingdom of Bulgaria', 'Regatul Bulgariei']],
  // Allies (Entente) — by date of entry
  ['serbia',     'Serbia',             'Serbia',              'allies',  1914, 'Serbia',   ['Kingdom of Serbia', 'Regatul Serbiei']],
  ['ru-empire',  'Russian Empire',     'Imperiul Rus',        'allies',  1914, 'Russia',   ['Tsarist Russia', 'Rusia țaristă']],
  ['france1',    'France',             'Franța',              'allies',  1914, 'France',   []],
  ['brit-empire','British Empire',     'Imperiul Britanic',   'allies',  1914, 'United Kingdom', ['Britain', 'Great Britain', 'Marea Britanie']],
  ['belgium1',   'Belgium',            'Belgia',              'allies',  1914, 'Belgium',  []],
  ['montenegro', 'Montenegro',         'Muntenegru',          'allies',  1914, 'Montenegro', ['Kingdom of Montenegro', 'Regatul Muntenegrului']],
  ['japan1',     'Empire of Japan',    'Imperiul Japonez',    'allies',  1914, 'Japan',    ['Imperial Japan']],
  ['italy1',     'Italy',              'Italia',              'allies',  1915, 'Italy',    ['Kingdom of Italy', 'Regatul Italiei']],
  ['portugal1',  'Portugal',           'Portugalia',          'allies',  1916, 'Portugal', []],
  ['romania1',   'Romania',            'România',             'allies',  1916, 'Romania',  ['Kingdom of Romania', 'Regatul României']],
  ['hejaz',      'Hejaz',              'Hejaz',               'allies',  1916, null,       ['Hijaz', 'Kingdom of Hejaz', 'Regatul Hejaz']],
  ['usa1',       'United States',      'Statele Unite',       'allies',  1917, 'United States of America', []],
  ['greece1',    'Greece',             'Grecia',              'allies',  1917, 'Greece',   []],
  ['siam',       'Siam',               'Siam',                'allies',  1917, 'Thailand', []],
  ['china1',     'China',              'China',               'allies',  1917, 'China',    ['Republic of China', 'Republica Chineză']],
  ['brazil1',    'Brazil',             'Brazilia',            'allies',  1917, 'Brazil',   []],
  ['cuba1',      'Cuba',               'Cuba',                'allies',  1917, 'Cuba',     []],
  ['panama1',    'Panama',             'Panama',              'allies',  1917, 'Panama',   []],
  ['liberia1',   'Liberia',            'Liberia',             'allies',  1917, 'Liberia',  []],
  ['guatemala1', 'Guatemala',          'Guatemala',           'allies',  1918, 'Guatemala', []],
  ['nicaragua1', 'Nicaragua',          'Nicaragua',           'allies',  1918, 'Nicaragua', []],
  ['costarica1', 'Costa Rica',         'Costa Rica',          'allies',  1918, 'Costa Rica', []],
  ['haiti1',     'Haiti',              'Haiti',               'allies',  1918, 'Haiti',    []],
  ['honduras1',  'Honduras',           'Honduras',            'allies',  1918, 'Honduras', []],
]

const WW2 = [
  // Axis and co-belligerents
  ['nazi-de',    'Nazi Germany',            'Germania nazistă',         'axis',        1939, 'Germany',  ['Third Reich', 'German Reich', 'Al Treilea Reich', 'Reich']],
  ['slovakia2',  'Slovakia',                'Slovacia',                 'axis',        1939, 'Slovakia', ['Slovak Republic', 'Slovak State', 'Republica Slovacă', 'Statul Slovac']],
  ['japan2',     'Empire of Japan',         'Imperiul Japonez',         'axis',        1937, 'Japan',    ['Imperial Japan']],
  ['hungary2',   'Hungary',                 'Ungaria',                  'axis',        1941, 'Hungary',  ['Kingdom of Hungary', 'Regatul Ungariei']],
  ['croatia2',   'Independent State of Croatia', 'Statul Independent Croat', 'axis',   1941, 'Croatia',  ['NDH', 'Croatia']],
  ['thailand2',  'Thailand',                'Thailanda',                'axis',        1942, 'Thailand', ['Siam']],
  ['italy2',     'Italy',                   'Italia',                   'axis-1943',   1940, 'Italy',    ['Kingdom of Italy', 'Fascist Italy', 'Regatul Italiei', 'Italia fascistă']],
  ['romania2',   'Romania',                 'România',                  'axis-1944',   1941, 'Romania',  ['Kingdom of Romania', 'Regatul României']],
  ['bulgaria2',  'Bulgaria',                'Bulgaria',                 'axis-1944',   1941, 'Bulgaria', ['Kingdom of Bulgaria', 'Regatul Bulgariei']],
  ['finland2',   'Finland',                 'Finlanda',                 'cobell',      1941, 'Finland',  []],
  // Allies — by date of entry
  ['china2',     'China',                   'China',                    'allies',      1937, 'China',    ['Republic of China', 'Republica Chineză']],
  ['poland2',    'Poland',                  'Polonia',                  'allies',      1939, 'Poland',   []],
  ['uk2',        'United Kingdom',          'Regatul Unit',             'allies',      1939, 'United Kingdom', ['Britain', 'Great Britain', 'British Empire', 'Marea Britanie', 'Imperiul Britanic']],
  ['france2',    'France',                  'Franța',                   'allies',      1939, 'France',   ['Free France', 'Franța Liberă']],
  ['australia2', 'Australia',               'Australia',                'allies',      1939, 'Australia', []],
  ['nz2',        'New Zealand',             'Noua Zeelandă',            'allies',      1939, 'New Zealand', []],
  ['india2',     'British India',           'India Britanică',          'allies',      1939, 'India',    ['India', 'British Raj']],
  ['nepal2',     'Nepal',                   'Nepal',                    'allies',      1939, 'Nepal',    ['Kingdom of Nepal']],
  ['sa2',        'Union of South Africa',   'Uniunea Sud-Africană',     'allies',      1939, 'South Africa', ['South Africa', 'Africa de Sud']],
  ['canada2',    'Canada',                  'Canada',                   'allies',      1939, 'Canada',   []],
  ['czechoslovakia', 'Czechoslovakia',      'Cehoslovacia',             'allies',      1939, null,       ['Czecho-Slovakia']],
  ['norway2',    'Norway',                  'Norvegia',                 'allies',      1940, 'Norway',   []],
  ['netherlands2','Netherlands',            'Țările de Jos',            'allies',      1940, 'Netherlands', ['Holland', 'Olanda']],
  ['belgium2',   'Belgium',                 'Belgia',                   'allies',      1940, 'Belgium',  []],
  ['luxembourg2','Luxembourg',              'Luxemburg',                'allies',      1940, 'Luxembourg', []],
  ['greece2',    'Greece',                  'Grecia',                   'allies',      1940, 'Greece',   []],
  ['yugoslavia', 'Yugoslavia',              'Iugoslavia',               'allies',      1941, null,       ['Kingdom of Yugoslavia', 'Regatul Iugoslaviei', 'Jugoslavia']],
  ['ussr',       'Soviet Union',            'Uniunea Sovietică',        'allies',      1941, 'Russia',   ['USSR', 'URSS', 'Soviets', 'Sovietici', 'Uniunea Sovietica']],
  ['usa2',       'United States',           'Statele Unite',            'allies',      1941, 'United States of America', []],
  ['philippines2','Philippines',            'Filipine',                 'allies',      1941, 'Philippines', ['Commonwealth of the Philippines']],
  ['mexico2',    'Mexico',                  'Mexic',                    'allies',      1942, 'Mexico',   []],
  ['brazil2',    'Brazil',                  'Brazilia',                 'allies',      1942, 'Brazil',   []],
  ['ethiopia2',  'Ethiopia',                'Etiopia',                  'allies',      1942, 'Ethiopia', ['Abyssinia', 'Abisinia']],
  ['mongolia2',  'Mongolia',                'Mongolia',                 'allies',      1945, 'Mongolia', ["Mongolian People's Republic", 'Republica Populară Mongolă']],
]

const SIDES = {
  central:     () => t('Central Powers'),
  allies:      () => t('Allies'),
  axis:        () => t('Axis'),
  'axis-1943': () => t('Axis → Allies (1943)'),
  'axis-1944': () => t('Axis → Allies (1944)'),
  cobell:      () => t('Fought alongside Germany (1941–44)'),
}
const SIDE_ORDER = ['central', 'axis', 'axis-1943', 'axis-1944', 'cobell', 'allies']

function warQuiz({ title, icon, prompt, rows }) {
  return {
    title, icon, prompt, regions: false,
    columns: { hint: t('Side'), extra: t('Entered'), answer: t('Country') },
    build: ({ countryAnswers }) => rows
      .slice()
      .sort((a, b) => SIDE_ORDER.indexOf(a[3]) - SIDE_ORDER.indexOf(b[3]) || a[4] - b[4] || a[1].localeCompare(b[1]))
      .map(([id, en, ro, side, year, modern, extra]) => ({
        id,
        country: null,                                   // historical states don't feed the modern knowledge map
        hint: { type: 'text', value: SIDES[side]() },
        extra: String(year),
        answers: [en, ro, ...extra, ...(modern ? countryAnswers(modern) : [])],
        display: isRo ? ro : en,
      })),
  }
}

export const WAR_QUIZZES = {
  ww1: warQuiz({ title: t('World War I Countries'), icon: '🪖', prompt: t('Name the countries that fought in World War I — under their names at the time'), rows: WW1 }),
  ww2: warQuiz({ title: t('World War II Countries'), icon: '✈️', prompt: t('Name the main countries that fought in World War II — under their names at the time'), rows: WW2 }),
}
