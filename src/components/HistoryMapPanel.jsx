import { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import GameIntro from './GameIntro'

const COUNTDOWN_SECONDS = 15 * 60

function formatTime(secs) {
  const m = Math.floor(Math.abs(secs) / 60).toString().padStart(2, '0')
  const s = (Math.abs(secs) % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

// Normalize input: lowercase, strip punctuation/spaces
function norm(str) {
  return str.trim().toLowerCase().replace(/[^a-z0-9]/g, '')
}

// Alternate accepted spellings → canonical name in the GeoJSON
// These resolve common English aliases and alternate historical names.
// Canonical names (values) must match f.properties.NAME exactly.
const HISTORY_ALIASES = {
  // United Kingdom
  'uk':                             'United Kingdom of Great Britain and Ireland',
  'unitedkingdom':                  'United Kingdom of Great Britain and Ireland',
  'greatbritain':                   'United Kingdom of Great Britain and Ireland',
  'britain':                        'United Kingdom of Great Britain and Ireland',
  'england':                        'United Kingdom of Great Britain and Ireland',
  'gb':                             'United Kingdom of Great Britain and Ireland',
  'greatbritainandireland':         'United Kingdom of Great Britain and Ireland',
  'unitedkingdomofgreatbritain':    'United Kingdom of Great Britain and Ireland',
  // Yugoslavia / Kingdom of Serbs Croats and Slovenes
  'yugoslavia':                     'Kingdom of Serbs, Croats and Slovenes',
  'yugoslvia':                      'Kingdom of Serbs, Croats and Slovenes',
  'kingdomofserbscroatsandslovenes':'Kingdom of Serbs, Croats and Slovenes',
  'serbiacroatiaslovenia':          'Kingdom of Serbs, Croats and Slovenes',
  'serbia':                         'Kingdom of Serbs, Croats and Slovenes',
  'scs':                            'Kingdom of Serbs, Croats and Slovenes',
  // Germany
  'germany':                        'Germany',
  'weimarrepublic':                 'Germany',
  'germanrepublic':                 'Germany',
  'deutschlandrepublik':            'Germany',
  'deutschland':                    'Germany',
  'germanempire':                   'Germany',
  // Austria
  'austria':                        'Austria',
  'austrianrepublic':               'Austria',
  'republicofaustria':              'Austria',
  // Hungary
  'hungary':                        'Hungary',
  'kingdomofhungary':               'Hungary',
  // Czechoslovakia
  'czechoslovakia':                 'Czechoslovakia',
  'czechia':                        'Czechoslovakia',
  'czechrepublic':                  'Czechoslovakia',
  'czechslovakia':                  'Czechoslovakia',
  // Poland
  'poland':                         'Poland',
  'polishrepublic':                 'Poland',
  'polska':                         'Poland',
  // Romania
  'romania':                        'Romania',
  'rumania':                        'Romania',
  'roumania':                       'Romania',
  // Bulgaria
  'bulgaria':                       'Bulgaria',
  // Greece
  'greece':                         'Greece',
  'hellas':                         'Greece',
  // Albania
  'albania':                        'Albania',
  // Turkey / Ottoman
  'turkey':                         'Turkey',
  'ottoman':                        'Turkey',
  'ottomanempire':                  'Turkey',
  'turkishrepublic':                'Turkey',
  // Finland
  'finland':                        'Finland',
  'suomi':                          'Finland',
  // Estonia
  'estonia':                        'Estonia',
  'eesti':                          'Estonia',
  // Latvia
  'latvia':                         'Latvia',
  'lettland':                       'Latvia',
  // Lithuania
  'lithuania':                      'Lithuania',
  'lietuva':                        'Lithuania',
  // Sweden
  'sweden':                         'Sweden',
  'sverige':                        'Sweden',
  // Norway
  'norway':                         'Norway',
  'norge':                          'Norway',
  // Denmark
  'denmark':                        'Denmark',
  'danmark':                        'Denmark',
  // Spain
  'spain':                          'Spain',
  'espana':                         'Spain',
  'espanya':                        'Spain',
  // Portugal
  'portugal':                       'Portugal',
  // Belgium
  'belgium':                        'Belgium',
  'belgique':                       'Belgium',
  // Netherlands / Holland
  'netherlands':                    'Netherlands',
  'holland':                        'Netherlands',
  'thenetherlands':                 'Netherlands',
  // Luxembourg
  'luxembourg':                     'Luxembourg',
  // Switzerland
  'switzerland':                    'Switzerland',
  'swiss':                          'Switzerland',
  'helvetia':                       'Switzerland',
  'confoedetatiohelvetica':         'Switzerland',
  // Italy
  'italy':                          'Italy',
  'italia':                         'Italy',
  // France
  'france':                         'France',
  // Ireland / Irish Free State
  'ireland':                        'Ireland',
  'eire':                           'Ireland',
  'irishfreestate':                 'Ireland',
  // Russia / Soviet Union
  'russia':                         'Russia',
  'sovietunion':                    'Russia',
  'ussr':                           'Russia',
  'sovietrussia':                   'Russia',
  'russiansfsr':                    'Russia',
  'rsfsr':                          'Russia',
  'russiansovietfederativesocialistrepublic': 'Russia',
  // Iceland
  'iceland':                        'Iceland',
  'island':                         'Iceland',
  // Andorra
  'andorra':                        'Andorra',
  // Monaco
  'monaco':                         'Monaco',
  // Liechtenstein
  'liechtenstein':                  'Liechtenstein',
  // San Marino
  'sanmarino':                      'San Marino',
  // Malta
  'malta':                          'Malta',
}

const ERAS = [
  {
    id:    'interwar',
    label: 'Interwar Europe',
    year:  '1920',
    url:   'https://cdn.jsdelivr.net/gh/aourednik/historical-basemaps@master/geojson/world_1920.geojson',
    desc:  'Name every country in Europe between WW1 and WW2.',
  },
  // Future eras:
  // { id: 'preww1', label: 'Pre-WW1 Europe', year: '1900', url: '...world_1900.geojson', desc: '...' },
  // { id: 'postww2', label: 'Post-WW2 Europe', year: '1945', url: '...world_1945.geojson', desc: '...' },
]

// European bounding box filter (centroid-based)
// Returns true if a feature's first coordinate polygon centroid is in Europe
function isEuropeanFeature(f) {
  // Only include sovereign states (SUBJECTO = NAME) or European territories
  const name  = f.properties.NAME
  const subj  = f.properties.SUBJECTO
  if (subj && subj !== name) return false // skip colonies/protectorates
  // Rough bounding box for Europe
  const geom = f.geometry
  if (!geom || !geom.coordinates) return false
  // Get a representative lon/lat from the first coordinate in the geometry
  let lon, lat
  try {
    if (geom.type === 'Polygon') {
      ;[lon, lat] = geom.coordinates[0][0]
    } else if (geom.type === 'MultiPolygon') {
      ;[lon, lat] = geom.coordinates[0][0][0]
    } else {
      return false
    }
  } catch {
    return false
  }
  // Broad European lon/lat bounds
  return lon >= -30 && lon <= 50 && lat >= 33 && lat <= 75
}

export default function HistoryMapPanel({ onFeaturesChange, onFoundChange, onMissedChange, onNewGame }) {
  const [era,         setEra]         = useState(null)   // null | era object
  const [features,    setFeatures]    = useState([])     // all GeoJSON features from the fetched file
  const [euroFeatures,setEuroFeatures]= useState([])     // filtered to European sovereign states
  const [loadState,   setLoadState]   = useState('idle') // 'idle' | 'loading' | 'error'
  const [found,       setFound]       = useState([])     // found feature objects
  const [input,       setInput]       = useState('')
  const [flash,       setFlash]       = useState(null)
  const [timerMode,   setTimerMode]   = useState(null)   // null | 'countdown' | 'countup'
  const [elapsed,     setElapsed]     = useState(0)
  const [remaining,   setRemaining]   = useState(COUNTDOWN_SECONDS)
  const [running,     setRunning]     = useState(false)
  const [expired,     setExpired]     = useState(false)
  const [confirmStop, setConfirmStop] = useState(false)
  const [gameOver,    setGameOver]    = useState(false)

  const inputRef = useRef(null)
  const tickRef  = useRef(null)
  const foundRef = useRef([])
  foundRef.current = found

  // Fetch historical GeoJSON when era is selected
  useEffect(() => {
    if (!era) return
    setLoadState('loading')
    setFeatures([])
    setEuroFeatures([])
    setFound([])
    foundRef.current = []
    onFoundChange([])
    onMissedChange([])
    onFeaturesChange([], [])

    fetch(era.url)
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json() })
      .then(data => {
        const all   = data.features.filter(f => f.geometry && f.properties?.NAME)
        const euro  = all.filter(isEuropeanFeature)
        console.log(`[HistoryMap ${era.year}] Total features: ${all.length}, European: ${euro.length}`)
        console.log(`[HistoryMap ${era.year}] European countries:`, euro.map(f => f.properties.NAME).sort().join(', '))
        setFeatures(all)
        setEuroFeatures(euro)
        onFeaturesChange(all, euro)
        setLoadState('ready')
      })
      .catch(e => {
        console.error('Failed to load historical GeoJSON:', e)
        setLoadState('error')
      })
  }, [era])

  // Build answer map: normalized name / alias → feature
  const answerMap = useMemo(() => {
    const map = {}
    for (const f of euroFeatures) {
      const name = f.properties.NAME
      // Canonical normalized key
      map[norm(name)] = f
      // Also map each word in the name individually for short-name matching
    }
    // Apply aliases
    for (const [alias, canonical] of Object.entries(HISTORY_ALIASES)) {
      const f = euroFeatures.find(x => x.properties.NAME === canonical)
      if (f) map[alias] = f
    }
    return map
  }, [euroFeatures])

  const total    = euroFeatures.length
  const foundSet = useMemo(() => new Set(found.map(f => f.properties.NAME)), [found])
  const allFound = found.length === total && total > 0

  useEffect(() => { if (timerMode) inputRef.current?.focus() }, [timerMode])

  // Timer tick
  useEffect(() => {
    if (!running || !timerMode) return
    tickRef.current = setInterval(() => {
      if (timerMode === 'countdown') {
        setRemaining(t => {
          if (t <= 1) { clearInterval(tickRef.current); setRunning(false); setExpired(true); return 0 }
          return t - 1
        })
      } else {
        setElapsed(t => t + 1)
      }
    }, 1000)
    return () => clearInterval(tickRef.current)
  }, [running, timerMode])

  const revealMissed = useCallback(() => {
    const foundNames = new Set(foundRef.current.map(f => f.properties.NAME))
    const missed = euroFeatures.filter(f => !foundNames.has(f.properties.NAME))
    onMissedChange(missed)
    setGameOver(true)
  }, [euroFeatures, onMissedChange])

  useEffect(() => { if (expired) revealMissed() }, [expired, revealMissed])
  useEffect(() => {
    if (allFound && running) { clearInterval(tickRef.current); setRunning(false) }
  }, [allFound, running])

  const startTimer = (mode) => {
    onNewGame()
    onMissedChange([])
    onFoundChange([])
    foundRef.current = []
    setFound([])
    clearInterval(tickRef.current)
    setTimerMode(mode)
    setElapsed(0)
    setRemaining(COUNTDOWN_SECONDS)
    setExpired(false)
    setConfirmStop(false)
    setGameOver(false)
    setRunning(true)
    setInput('')
    setFlash(null)
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  const handleReset = () => {
    clearInterval(tickRef.current)
    setRunning(false)
    setTimerMode(null)
    setElapsed(0)
    setRemaining(COUNTDOWN_SECONDS)
    setExpired(false)
    setConfirmStop(false)
    setGameOver(false)
    foundRef.current = []
    setFound([])
    setInput('')
    setFlash(null)
    onMissedChange([])
    onFoundChange([])
    onNewGame()
  }

  const handleBackToEra = () => {
    handleReset()
    setEra(null)
    setFeatures([])
    setEuroFeatures([])
    setLoadState('idle')
    onFeaturesChange([], [])
  }

  const tryGuess = (raw) => {
    if (expired || gameOver) return
    if (!raw.trim()) return
    const key   = norm(raw)
    const entry = answerMap[key]
    if (!entry) return
    if (foundRef.current.some(f => f.properties.NAME === entry.properties.NAME)) return

    const next = [...foundRef.current, entry]
    foundRef.current = next
    setFound(next)
    onFoundChange(next)
    setInput('')
    setFlash('hit')
    setTimeout(() => setFlash(null), 500)

    if (next.length === total) revealMissed()
  }

  const onInputChange = e => { const v = e.target.value; setInput(v); tryGuess(v) }
  const onKeyDown     = e => { if (e.key === 'Enter') tryGuess(input) }

  const countdownDanger = timerMode === 'countdown' && remaining < 120
  const sortedEuro      = useMemo(() => [...euroFeatures].sort((a, b) => a.properties.NAME.localeCompare(b.properties.NAME)), [euroFeatures])

  const [started, setStarted] = useState(false)
  if (!started) return (
    <GameIntro
      icon="🏛️"
      title="History Maps"
      desc="Name countries in Europe as they were in different historical eras."
      rules={[
        '🗺️ Country borders change across different eras',
        '💡 Historical names and modern names both accepted',
        '⏱ Choose countdown or free play',
        '📜 Pick an era to begin',
      ]}
      onStart={() => setStarted(true)}
    />
  )

  return (
    <>
      <div className="panel-header">
        <h2>🗺️ History Maps</h2>
        <p className="panel-subtitle">
          {era ? era.desc : 'Pick a historical era and name every country in Europe.'}
        </p>
      </div>

      {/* Era picker */}
      {!era && (
        <div className="na-map-picker">
          <p className="na-map-picker-label">Choose an era</p>
          {ERAS.map(e => (
            <button key={e.id} className="na-map-opt" onClick={() => setEra(e)}>
              <span className="na-map-opt-icon">🗓️</span>
              <div className="na-map-opt-text">
                <strong>{e.label}</strong>
                <span>Europe circa {e.year}</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Loading state */}
      {era && loadState === 'loading' && (
        <div className="history-loading">
          <div className="history-loading-spinner" />
          <span>Loading {era.year} map…</span>
        </div>
      )}

      {/* Error state */}
      {era && loadState === 'error' && (
        <div className="history-loading">
          <span>⚠️ Could not load map data. Check your connection.</span>
          <button className="new-game-btn" onClick={handleBackToEra} style={{ marginTop: 8 }}>Try Again</button>
        </div>
      )}

      {/* Timer / mode picker */}
      {era && loadState === 'ready' && !timerMode && !allFound && (
        <>
          <div className="na-timer-picker">
            <span className="na-timer-label">🇪🇺 {era.label}</span>
            <button className="na-timer-opt" onClick={() => startTimer('countdown')}>⏳ 15 min countdown</button>
          </div>
          <div className="history-back-row">
            <button className="history-back-btn" onClick={handleBackToEra}>← Change era</button>
          </div>
        </>
      )}

      {/* Active timer bar */}
      {timerMode && (
        <div className={`na-timer-bar${countdownDanger ? ' na-timer-danger' : ''}`}>
          <span className="na-timer-clock">
            {timerMode === 'countdown' ? formatTime(remaining) : formatTime(elapsed)}
          </span>
          <span className="na-timer-type">
            {timerMode === 'countdown' ? '⏳ countdown' : '⏱ count up'}
          </span>
          <div className="na-timer-controls">
            {!expired && !allFound && !gameOver && (
              <button className="na-timer-btn" onClick={() => setRunning(r => !r)}>
                {running ? '⏸' : '▶'}
              </button>
            )}
            {!gameOver && (
              <button className="na-timer-btn na-timer-stop" onClick={() => setConfirmStop(true)} title="Stop">✕</button>
            )}
          </div>
        </div>
      )}

      {/* Confirm stop */}
      {confirmStop && (
        <div className="na-confirm-stop">
          <span>Stop? This will reveal missed countries.</span>
          <div className="na-confirm-btns">
            <button className="na-confirm-yes" onClick={() => {
              clearInterval(tickRef.current); setRunning(false); setConfirmStop(false); revealMissed()
            }}>Stop</button>
            <button className="na-confirm-no" onClick={() => setConfirmStop(false)}>Keep going</button>
          </div>
        </div>
      )}

      {/* Time's up */}
      {expired && (
        <div className="na-expired">
          ⌛ Time's up! You found <strong>{found.length}</strong> / {total} countries.
        </div>
      )}

      {/* Counter */}
      {timerMode && (
        <div className="na-counter">
          <span className="na-count-num">{found.length}</span>
          <span className="na-count-sep"> / </span>
          <span className="na-count-total">{total}</span>
          <span className="na-count-label"> countries found</span>
          <div className="na-progress-track">
            <div className="na-progress-fill" style={{ width: `${total ? (found.length / total) * 100 : 0}%` }} />
          </div>
        </div>
      )}

      {/* Win banner */}
      {allFound && (
        <div className="win-banner">
          <span className="win-emoji">🎉</span>
          <div>
            <strong>You got them all!</strong>
            <p>
              Every {era.label} country named
              {timerMode === 'countup'   ? ` in ${formatTime(elapsed)}` : ''}
              {timerMode === 'countdown' ? ` with ${formatTime(remaining)} remaining` : ''}
              !
            </p>
          </div>
        </div>
      )}

      {/* Input */}
      {timerMode && !allFound && !expired && !gameOver && (
        <div className="input-wrap">
          <div className={`input-row ${flash ? `flash-${flash}` : ''}`}>
            <input
              ref={inputRef}
              className="country-input"
              type="text"
              placeholder={!running ? 'Game paused' : `Type a country name…`}
              value={input}
              onChange={onInputChange}
              onKeyDown={onKeyDown}
              autoComplete="off"
              spellCheck={false}
              disabled={!running}
            />
            <button className="guess-btn" onClick={() => tryGuess(input)} disabled={!running}>Go</button>
          </div>
        </div>
      )}

      {/* Missed list */}
      {gameOver && found.length < total && (
        <div className="guesses-section">
          <h3 className="guesses-title">
            Missed <span className="guess-count" style={{ background: '#ef4444' }}>{total - found.length}</span>
          </h3>
          <ul className="guess-list">
            {sortedEuro
              .filter(f => !foundSet.has(f.properties.NAME))
              .map(f => (
                <li key={f.properties.NAME} className="guess-item">
                  <span className="guess-swatch" style={{ background: '#ef4444' }} />
                  <span className="guess-name">{f.properties.NAME}</span>
                </li>
              ))}
          </ul>
        </div>
      )}

      {/* Found list */}
      {found.length > 0 && (
        <div className="guesses-section">
          <h3 className="guesses-title">Found <span className="guess-count">{found.length}</span></h3>
          <ul className="guess-list">
            {[...found].reverse().map(f => (
              <li key={f.properties.NAME} className="guess-item">
                <span className="guess-swatch" style={{ background: '#39ff14' }} />
                <span className="guess-name">{f.properties.NAME}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="panel-footer">
        {era && loadState === 'ready' && !timerMode
          ? <button className="new-game-btn na-start-default" onClick={() => startTimer('countup')}>▶ Start</button>
          : timerMode
          ? <button className="new-game-btn" onClick={handleReset}>🔄 Reset</button>
          : null
        }
      </div>
    </>
  )
}
