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

/** Resolve typed input to a canonical country name, or null */
export function resolveAlias(typed, countryNames) {
  const q = normalizeInput(typed)
  // Direct match
  const direct = countryNames.find(n => normalizeInput(n) === q)
  if (direct) return direct
  // Alias match
  const canonical = ALIASES[q]
  if (canonical && countryNames.includes(canonical)) return canonical
  return null
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
    const n = normalizeInput(name)
    // Also check aliases
    const d = levenshtein(q, n)
    if (d < bestDist) { bestDist = d; best = name }
  }

  // Threshold: allow up to 30% of the query length in edits, min 1, max 4
  const threshold = Math.min(4, Math.max(1, Math.floor(q.length * 0.3)))
  return bestDist <= threshold ? best : null
}
