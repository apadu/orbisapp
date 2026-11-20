// ═══ FROZEN Daily Quiz schedule ═══════════════════════════════════════════════
// Daily #n = DAILY_SCHEDULE[(n - 1) % length]  →  [quizId, region, number of answers, kind?]
// kind: missing = table quiz, 'map' = LandformQuiz, 'diagram' = DiagramQuiz (region/size unused).
// Generated once on 2026-10-29 so the daily quiz never changes after the fact.
//
// ⚠️  Do NOT reorder or delete lines. To add new quizzes to the rotation, APPEND lines
//     at the end — days that have already happened keep their quiz (the list is long
//     enough that the first loop takes 115 days). A removed quiz is replaced in place.
//     Days that haven't happened yet may be swapped for new quizzes (done on 2026-11-21
//     from Daily #30 on: every other day is now a map, diagram or science quiz).
export const DAILY_SCHEDULE = [
  ["former-ussr", "World", 15],
  ["flag-colors", "Africa", 20],
  ["dollar-users", "World", 34],
  ["missing-vowels", "Europe", 20],
  ["area", "Africa", 30],
  ["area", "Oceania", 14],
  ["arabic-speaking", "World", 25],
  ["currency", "Asia", 48],
  ["pop-order", "World", 30],
  ["smallest", "World", 20],
  ["capitals-a-z", "Oceania", 11],
  ["drive-left", "Africa", 14],
  ["cap-to-country", "Americas", 35],
  ["capital-same-name", "World", 14],
  ["endonyms", "Europe", 20],
  ["capital", "Europe", 45],
  ["flags-crescent", "World", 13],
  ["missing-vowels", "Africa", 20],
  ["ww1", "World", 28],
  ["scramble", "Africa", 20],          // was emoji-quiz (quiz removed 2026-11-20)
  ["least-populous", "World", 20],
  ["pop-order", "Oceania", 14],
  ["monarchies", "Asia", 13],
  ["drive-left", "Americas", 12],
  ["drive-left", "World", 54],
  ["area", "World", 30],
  ["pop-order", "Americas", 30],
  ["scramble", "Europe", 20],          // was emoji-quiz
  ["flag-colors", "Americas", 20],
  ["volcanoes", "World", 23, "map"],   // was ["flag-colors", "Europe", 20]
  ["language", "Americas", 35],
  ["flags-historical", "World", 18],   // was ["flag-colors", "Asia", 20]
  ["capital", "Africa", 54],
  ["earth-layers", "World", 16, "diagram"],   // was ["language", "Africa", 53]
  ["landlocked", "Asia", 12],
  ["rivers-world", "World", 25, "map"],   // was ["former-names", "World", 39]
  ["english-speaking", "Africa", 23],
  ["minerals", "World", 19],   // was ["island-nations", "Oceania", 13]
  ["alphabet", "World", 24],
  ["cities-europe", "World", 33, "map"],   // was ["capitals-a-z", "Americas", 16]
  ["eu-members", "World", 27],
  ["solar-system", "World", 13, "diagram"],   // was ["scramble", "Europe", 20]
  ["flags-sun", "World", 12],
  ["hist-1914", "World", 16, "map"],   // was ["pop-order", "Africa", 30]
  ["pop-order", "Asia", 30],
  ["planets", "World", 13],   // was ["scramble", "Asia", 20]
  ["pop-order", "Europe", 30],
  ["volcano", "World", 10, "diagram"],   // was ["named-after", "World", 21]
  ["dollar-users", "Oceania", 10],
  ["islands", "World", 30, "map"],   // was ["country-fact", "World", 20]
  ["capital", "Asia", 48],
  ["earth-records", "World", 23],   // was ["language", "Oceania", 14]
  ["capitals-a-z", "Africa", 20],
  ["phys-europe", "World", 20, "map"],   // was ["drive-left", "Asia", 15]
  ["scramble", "Africa", 20],
  ["moon-phases", "World", 9, "diagram"],   // was ["language", "Europe", 43]
  ["currency", "Oceania", 14],
  ["plates", "World", 18, "map"],   // was ["drive-left", "Oceania", 10]
  ["landlocked", "Africa", 16],
  ["phenomena", "World", 18],   // was ["caribbean", "World", 13]
  ["missing-vowels", "Americas", 20],
  ["water-cycle", "World", 9, "diagram"],   // was ["monarchies", "World", 43]
  ["english-speaking", "World", 60],
  ["cities-world", "World", 34, "map"],   // was ["currency", "Europe", 44]
  ["alphabet", "Asia", 18],
  ["moons", "World", 15],   // was ["area", "Americas", 30]
  ["flag", "World", 20],
  ["wonders-new", "World", 8, "map"],   // was ["monarchies", "Europe", 12]
  ["alphabet", "Oceania", 9],
  ["landscape", "World", 17, "diagram"],   // was ["endonyms", "Asia", 20]
  ["equator", "World", 13],
  ["currents", "World", 14, "map"],   // was ["french-speaking", "Africa", 21]
  ["endonyms", "World", 20],
  ["biomes", "World", 14],   // was ["portuguese-speaking", "World", 9]
  ["alphabet", "Americas", 15],
  ["plate-boundaries", "World", 12, "diagram"],   // was ["cap-to-country", "Europe", 45]
  ["capitals-a-z", "Europe", 16],
  ["hist-100", "World", 16, "map"],   // was ["language", "Asia", 48]
  ["ww2", "World", 34],
  ["missions", "World", 21],   // was ["area", "Asia", 30]
  ["euro-users", "World", 27],
  ["lakes", "World", 27, "map"],   // was ["island-nations", "Asia", 9]
  ["currency", "Americas", 35],
  ["sky-map", "World", 24, "diagram"],   // was ["scramble", "World", 20]
  ["dollar-users", "Americas", 17],
  ["phys-asia", "World", 23, "map"],   // was ["flag-colors", "World", 20]
  ["g20", "World", 19],
  ["rocks", "World", 17],   // was ["french-speaking", "World", 29]
  ["cap-to-country", "Oceania", 14],
  ["climate-zones", "World", 12, "diagram"],   // was ["cap-to-country", "Africa", 54]
  ["cap-to-country", "Asia", 48],
  ["cities-romania", "World", 30, "map"],   // was ["capitals-a-z", "Asia", 17]
  ["island-nations", "Americas", 13],
  ["stars-constellations", "World", 20],   // was ["currency", "Africa", 53]
  ["capitals-a-z", "World", 24],
  ["straits", "World", 20, "map"],   // was ["spanish-speaking", "World", 20]
  ["english-speaking", "Americas", 14],
  ["eclipses", "World", 9, "diagram"],   // was ["scramble", "Americas", 20]
  ["capital", "Oceania", 14],
  ["ocean-floor", "World", 13, "map"],   // was ["alphabet", "Europe", 18]
  ["english-speaking", "Oceania", 14],
  ["geologic-time", "World", 13],   // was ["endonyms", "Asia", 20]
  ["missing-vowels", "World", 20],
  ["rock-cycle", "World", 10, "diagram"],   // was ["capital", "Americas", 35]
  ["flags-cross", "World", 13],
  ["hist-1700", "World", 16, "map"],   // was ["island-nations", "World", 45]
  ["landlocked", "Europe", 15],
  ["seas-map", "World", 28, "map"],   // was ["area", "Europe", 30]
  ["country-fact", "Asia", 20],
  ["sun-anatomy", "World", 10, "diagram"],   // was ["missing-vowels", "World", 20]
  ["alphabet", "Africa", 16],
  ["phys-africa", "World", 16, "map"],   // was ["nato-members", "World", 32]
  ["landlocked", "World", 45],
  ["earth-orbit", "World", 9, "diagram"],   // was ["monarchies", "Americas", 9]
  ["missing-vowels", "Asia", 20],
  // 2026-11-21: the new map, diagram and science quizzes (appended)
  ["peninsulas", "World", 21, "map"],
  ["wonders-ancient", "World", 7, "map"],
  ["deserts", "World", 0, "map"],
  ["phys-namerica", "World", 18, "map"],
  ["earth-lines", "World", 6, "map"],
  ["hist-1279", "World", 16, "map"],
  ["phys-samerica", "World", 17, "map"],
  ["phys-oceania", "World", 13, "map"],
  // 2026-11-21 (later): peaks, waterfalls, natural wonders, clouds, climates, scales, extreme points
  ["peaks", "World", 23, "map"],
  ["climates", "World", 13],
  ["clouds", "World", 11, "diagram"],
  ["waterfalls", "World", 19, "map"],
  ["scales", "World", 18],
  ["natural-wonders", "World", 26, "map"],
  ["extreme-points", "World", 22],
]
