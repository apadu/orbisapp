import { COUNTRY_RO, RO_ALIASES } from '../i18n/countriesRo'
import { isRo, isEs, langData } from '../i18n'

// Answers follow the site language: in English only English names count, in Romanian only
// Romanian names (plus a couple of international abbreviations). Never a mix — so "Brazil"
// can't sneak in halfway through typing "Brazilia".
// Alternate country names → canonical app name (after NAME_OVERRIDES)
export const ALIASES = {
  'cape verde':                       'Cabo Verde',
  'burma':                            'Myanmar',
  "cote d'ivoire":                    'Ivory Coast',
  "côte d'ivoire":                    'Ivory Coast',
  'cote divoire':                     'Ivory Coast',
  'st lucia':                         'Saint Lucia',
  'st. lucia':                        'Saint Lucia',
  'east timor':                       'Timor-Leste',
  'timor':                            'Timor-Leste',
  'macedonia':                        'North Macedonia',
  'car':                              'Central African Republic',
  'central african republic':         'Central African Republic',
  'swaziland':                        'Eswatini',
  'czechia':                          'Czech Republic',
  'turkiye':                          'Turkey',
  'türkiye':                          'Turkey',
  'bosnia':                           'Bosnia and Herzegovina',
  'bosnia herzegovina':               'Bosnia and Herzegovina',
  'dr congo':                         'Democratic Republic of Congo',
  'drc':                              'Democratic Republic of Congo',
  'democratic republic of congo':     'Democratic Republic of Congo',
  'democratic republic of the congo': 'Democratic Republic of Congo',
  'republic of the congo':            'Congo',
  'republic of korea':                'South Korea',
  'uk':                               'United Kingdom',
  'great britain':                    'United Kingdom',
  'britain':                          'United Kingdom',
  'england':                          'United Kingdom',
  'usa':                              'United States of America',
  'united states':                    'United States of America',
  'uae':                              'United Arab Emirates',
  'antigua':                          'Antigua and Barbuda',
  'st kitts':                         'Saint Kitts and Nevis',
  'st kitts and nevis':               'Saint Kitts and Nevis',
  'st. kitts and nevis':              'Saint Kitts and Nevis',
  'st vincent':                       'Saint Vincent and the Grenadines',
  'st vincent and the grenadines':    'Saint Vincent and the Grenadines',
  'st. vincent':                      'Saint Vincent and the Grenadines',
  'sao tome':                         'Sao Tome and Principe',
  'são tomé':                         'Sao Tome and Principe',
  'trinidad':                         'Trinidad and Tobago',
  'holland':                          'Netherlands',
  'the netherlands':                  'Netherlands',
  'ivory coast':                      'Ivory Coast',
  'guinea bissau':                    'Guinea-Bissau',
  'new guinea':                       'Papua New Guinea',
  'micronesia':                       'Federated States of Micronesia',
  'federated states of micronesia':   'Federated States of Micronesia',
}

/** Normalize a string for comparison */
export function normalizeInput(s) {
  return s.toLowerCase().trim().replace(/\s+/g, ' ')
}

const stripDiacritics = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[ș]/g, 's').replace(/[ț]/g, 't')
const key = (s) => stripDiacritics(normalizeInput(s))

// Abbreviations everyone uses, accepted in Romanian too
const RO_INTL = { usa: 'United States of America', uk: 'United Kingdom' }

/** The country's name in the site language (keys stay English everywhere). */
export const localName = (name) => (isRo ? COUNTRY_RO[name] ?? name : isEs ? langData.countries?.[name] ?? name : name)

// typed spelling (normalised, no diacritics) → canonical name, for the current language only
const LOOKUP = {}
const ALT_BY_COUNTRY = {}
if (isEs) {
  // Spanish: Spanish names and spellings (the dictionaries are loaded before this module runs)
  for (const [en, es] of Object.entries(langData.countries ?? {})) LOOKUP[key(es)] = en
  for (const [alias, en] of Object.entries(langData.countryAliases ?? {})) { LOOKUP[key(alias)] ??= en; (ALT_BY_COUNTRY[en] ??= []).push(alias) }
} else if (isRo) {
  for (const [en, ro] of Object.entries(COUNTRY_RO)) LOOKUP[key(ro)] = en
  for (const [alias, en] of Object.entries({ ...RO_ALIASES, ...RO_INTL })) { LOOKUP[key(alias)] ??= en; (ALT_BY_COUNTRY[en] ??= []).push(alias) }
} else {
  for (const [alias, en] of Object.entries(ALIASES)) { LOOKUP[key(alias)] = en; (ALT_BY_COUNTRY[en] ??= []).push(alias) }
}

/** Every spelling accepted for a country in the current language (for engines with their own matching). */
export function countryAnswers(name) {
  return [localName(name), ...(ALT_BY_COUNTRY[name] ?? [])]
}

/** Resolve typed input to a canonical country name, or null */
export function resolveAlias(typed, countryNames) {
  const q = key(typed)
  if (!q) return null
  const direct = countryNames.find(n => key(localName(n)) === q)
  if (direct) return direct
  const canonical = LOOKUP[q]
  return canonical && countryNames.includes(canonical) ? canonical : null
}

/** Levenshtein distance between two strings */
function levenshtein(a, b) {
  const m = a.length, n = b.length
  const dp = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)])
  for (let j = 0; j <= n; j++) dp[0][j] = j
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i-1] === b[j-1]
        ? dp[i-1][j-1]
        : 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])
    }
  }
  return dp[m][n]
}

/**
 * Find the closest country name to the typed input.
 * Returns the best match if within threshold, otherwise null.
 */
export function findClosestMatch(typed, countryNames) {
  const q = normalizeInput(typed)
  if (q.length < 3) return null

  let best = null, bestDist = Infinity
  for (const name of countryNames) {
    const d = levenshtein(stripDiacritics(q), key(localName(name)))
    if (d < bestDist) { bestDist = d; best = name }
  }

  // Threshold: allow up to 30% of the query length in edits, min 1, max 4
  const threshold = Math.min(4, Math.max(1, Math.floor(q.length * 0.3)))
  return bestDist <= threshold ? best : null
}
