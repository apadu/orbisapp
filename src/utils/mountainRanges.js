// Mountain ranges defined as rotated ellipses.
// ef(name, centerLon, centerLat, rx, ry, rotDeg)
//   rx      = semi-length ALONG the range direction (degrees)
//   ry      = semi-width ACROSS the range (degrees)
//   rotDeg  = angle of the along-range axis from east, CCW positive
//
// A 36-point polygon approximation is stored as the geometry so the
// panel matching code (NAME lookup) keeps working unchanged.

function ef(name, cLon, cLat, rx, ry, rotDeg = 0) {
  const rot = (rotDeg * Math.PI) / 180
  const cos = Math.cos(rot)
  const sin = Math.sin(rot)
  const n = 48
  const pts = []
  for (let i = 0; i <= n; i++) {
    const a = (i / n) * Math.PI * 2
    const ex = rx * Math.cos(a)
    const ey = ry * Math.sin(a)
    pts.push([cLon + ex * cos - ey * sin, cLat + ex * sin + ey * cos])
  }
  return {
    type: 'Feature',
    properties: { NAME: name, cLon, cLat, rx, ry, rotDeg },
    geometry: { type: 'Polygon', coordinates: [pts] },
  }
}

export const MOUNTAIN_RANGES = {
  type: 'FeatureCollection',
  features: [
    // ── Asia ────────────────────────────────────────────────────────────────
    ef('Himalayas',           83,    28.5,  14,    1.5,    5),  // E-W arc, slightly N
    ef('Karakoram',           76.5,  36.5,   3,    1,    -45),  // NW-SE
    ef('Hindu Kush',          69,    35.7,   3.5,  1.2,   40),  // NNE-SSW
    ef('Kunlun Mountains',    87,    36.5,  11,    1,      0),  // pure E-W
    ef('Tian Shan',           81,    42.5,  13,    1.5,   -5),  // nearly E-W
    ef('Altai Mountains',     91,    50,     7.5,  1.5,  -20),  // WNW-ESE
    ef('Zagros Mountains',    50.5,  32,     7,    2.5,  -45),  // NW-SE
    ef('Alborz Mountains',    53,    37,     4.5,  0.8,   -5),  // E-W
    ef('Caucasus Mountains',  44,    42.8,   6,    1,     10),  // WNW-ESE
    ef('Ural Mountains',      60.5,  61,     9.5,  1.5,   90),  // N-S
    ef('Western Ghats',       76.5,  14.5,   6.5,  1,     85),  // mostly N-S
    ef('Taurus Mountains',    34,    37.3,   4.5,  0.8,  -10),  // E-W, slight tilt
    ef('Pontic Mountains',    36,    41,     5,    0.7,   -5),  // E-W
    ef('Verkhoyansk Range',  135,    67,     4,    1.5,   90),  // N-S
    ef('Chersky Range',      152,    65,     5.5,  1.5,   40),  // NE-SW
    ef('Stanovoy Range',     125,    56,     9,    1,    -10),  // WNW-ESE

    // ── Europe ──────────────────────────────────────────────────────────────
    ef('Alps',               10.5,  46.2,   4,    1.5,   10),  // WNW-ESE, slight NE
    ef('Pyrenees',            1,    42.9,   2.5,  0.6,    5),  // mostly E-W
    ef('Carpathians',        22,    48.8,   5.5,  1.5,  -20),  // WNW-ESE arc
    ef('Apennines',          13.5,  42,     4,    1.2,   85),  // mostly N-S
    ef('Scandinavian Mountains', 15.5, 65,  6,    1.5,   80),  // mostly N-S
    ef('Scottish Highlands', -3.5,  57.2,   2,    0.8,  -30),  // NE-SW
    ef('Dinaric Alps',       17,    44,     3,    1.2,  -45),  // NW-SE
    ef('Balkan Mountains',   24.5,  43,     2,    0.6,  -10),  // mostly E-W

    // ── Americas ────────────────────────────────────────────────────────────
    ef('Andes',             -70,   -20,    32,    2.5,   85),  // nearly N-S, very long
    ef('Rocky Mountains',  -110,    46,    12,    3.5,   85),  // mostly N-S
    ef('Appalachians',      -79,    39,     6.5,  2.5,   80),  // mostly N-S
    ef('Sierra Nevada',    -119,    38.5,   2.5,  1,     75),  // mostly N-S
    ef('Cascade Range',    -121.5,  45,     4.5,  1,     85),  // mostly N-S
    ef('Brooks Range',     -153,    68.5,  12.5,  0.8,    0),  // E-W
    ef('Sierra Madre',     -103,    23,     6,    2,     70),  // NNW
    ef('Coast Mountains',  -124.5,  54.5,   5,    1.5,   80),  // mostly N-S

    // ── Africa ──────────────────────────────────────────────────────────────
    ef('Atlas Mountains',    1.5,   32.5,   6.5,  2,     10),  // ENE-WSW
    ef('Drakensberg',       29.2,  -28.5,   2.5,  0.8,   60),  // NNE-SSW
    ef('Ethiopian Highlands',39,    10,     3.5,  3,      0),  // roughly circular plateau
    ef('Ruwenzori Mountains',30,     0.5,   1,    0.8,    0),
    ef('Tibesti Mountains',  19,    21.5,   3,    2,      0),
    ef('Ahaggar Mountains',   6.5,  24,     2,    1.8,    0),

    // ── Oceania ─────────────────────────────────────────────────────────────
    ef('Great Dividing Range',150,  -28,   11,    1.5,   85),  // mostly N-S
    ef('Southern Alps',      170,  -43.5,  1.5,  0.8,   70),
  ],
}

export const MOUNTAIN_RANGE_NAMES = MOUNTAIN_RANGES.features.map(f => f.properties.NAME)
