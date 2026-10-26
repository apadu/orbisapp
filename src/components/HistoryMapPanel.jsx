import { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import { fetchData } from '../utils/fetchData'
import GameIntro from './GameIntro'
import SetupCard, { TIMER_OPTION } from './SetupCard'
import GiveUpButton from './GiveUpButton'
import GameSummary from './GameSummary'
import { t } from '../i18n'

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
    label: t('Interwar Europe'),
    year:  '1920',
    dataKey: 'history1920',
    url:   'https://cdn.jsdelivr.net/gh/aourednik/historical-basemaps@master/geojson/world_1920.geojson',
    desc:  t('Name every country in Europe between WW1 and WW2.'),
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

    (era.dataKey ? fetchData(era.dataKey) : fetch(era.url))
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json() })
      .then(data => {
        const all   = data.features.filter(f => f.geometry && f.properties?.NAME)
        const euro  = all.filter(isEuropeanFeature)
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

  // Preload the (default) era as soon as the panel opens; start once data is ready
  const [pending, setPending] = useState(null) // { timer, typed }
  useEffect(() => { if (!era) setEra(ERAS[0]) }, []) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!pending || loadState !== 'ready') return
    startTimer(pending.timer)
    if (pending.typed) setInput(pending.typed)
    setPending(null)
  }, [pending, loadState]) // eslint-disable-line react-hooks/exhaustive-deps

  const [started, setStarted] = useState(false)
  if (!started) return (
    <GameIntro
      icon="🏛️"
      title={t('History Maps')}
      desc={t('Name countries in Europe as they were in different historical eras.')}
      rules={[
        t('🗺️ Country borders change across different eras'),
        t('💡 Historical names and modern names both accepted'),
        t('⏱ Choose countdown or free play'),
        t('📜 Pick an era to begin'),
      ]}
      onStart={() => setStarted(true)}
    />
  )

  if (!timerMode && !pending && loadState !== 'error') return (
    <SetupCard
      mode="history-maps"
      icon="🏛️"
      title={t('History Maps')}
      desc={t('Name countries in Europe as they were in different historical eras.')}
      rules={[
        t('🗺️ Country borders change across different eras'),
        t('💡 Historical names and modern names both accepted'),
        t('🌍 Countries appear on the globe as you name them'),
      ]}
      options={[
        { id: 'era', label: t('Era'), choices: ERAS.map(e => ({ value: e.id, label: `${e.label} · ${e.year}`, hint: e.desc })) },
        TIMER_OPTION,
      ]}
      typeToStart
      onStart={(v, typed) => {
        const next = ERAS.find(e => e.id === v.era) ?? ERAS[0]
        if (era?.id !== next.id) { setLoadState('loading'); setEra(next) }
        setPending({ timer: v.timer, typed })
      }}
    />
  )

  return (
    <>
      <div className="panel-header">
        <h2>{t('🗺️ History Maps')}</h2>
        <p className="panel-subtitle">
          {era ? era.desc : t('Pick a historical era and name every country in Europe.')}
        </p>
      </div>


      {/* Loading state */}
      {era && loadState === 'loading' && (
        <div className="history-loading">
          <div className="history-loading-spinner" />
          <span>{t('Loading')} {era.year} {t('map…')}</span>
        </div>
      )}

      {/* Error state */}
      {era && loadState === 'error' && (
        <div className="history-loading">
          <span>{t('⚠️ Could not load map data. Check your connection.')}</span>
          <button className="new-game-btn" onClick={handleBackToEra} style={{ marginTop: 8 }}>{t('Try Again')}</button>
        </div>
      )}


      {/* Active timer bar */}
      {timerMode && (
        <div className={`na-timer-bar${countdownDanger ? ' na-timer-danger' : ''}`}>
          <span className="na-timer-clock">
            {timerMode === 'countdown' ? formatTime(remaining) : formatTime(elapsed)}
          </span>
          <span className="na-timer-type">
            {timerMode === 'countdown' ? t('⏳ countdown') : t('⏱ count up')}
          </span>
          <div className="na-timer-controls">
            {!gameOver && !expired && !allFound && (
              <GiveUpButton compact onConfirm={() => { clearInterval(tickRef.current); setRunning(false); revealMissed() }} />
            )}
          </div>
        </div>
      )}


      {/* Time's up */}
      {expired && (
        <div className="na-expired">
          {t('⌛ Time\'s up! You found')} <strong>{found.length}</strong> / {total} {t('countries.')}
        </div>
      )}

      {/* Counter */}
      {timerMode && (
        <div className="na-counter">
          <span className="na-count-num">{found.length}</span>
          <span className="na-count-sep"> / </span>
          <span className="na-count-total">{total}</span>
          <span className="na-count-label"> {t('countries found')}</span>
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
            <strong>{t('You got them all!')}</strong>
            <p>
              {t('Every')} {era.label} {t('country named')}
              {timerMode === 'countup'   ? ` in ${formatTime(elapsed)}` : ''}
              {timerMode === 'countdown' ? t(' with {v} remaining', { v: formatTime(remaining) }) : ''}
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
              placeholder={!running ? t('Game paused') : t('Type a country name…')}
              value={input}
              onChange={onInputChange}
              onKeyDown={onKeyDown}
              autoComplete="off"
              spellCheck={false}
              disabled={!running}
            />
            <button className="guess-btn" onClick={() => tryGuess(input)} disabled={!running}>{t('Go')}</button>
          </div>
        </div>
      )}

      {/* End-of-game summary */}
      {(gameOver || allFound) && (
        <GameSummary
          noun={t('countries')}
          total={total}
          timeLabel={timerMode === 'countdown' ? t('{v} used', { v: formatTime(COUNTDOWN_SECONDS - remaining) }) : formatTime(elapsed)}
          found={found.map(f => ({ label: f.properties.NAME }))}
          missed={sortedEuro.filter(f => !foundSet.has(f.properties.NAME)).map(f => ({ label: f.properties.NAME }))}
        />
      )}

      {/* Found list (live, during play) */}
      {!(gameOver || allFound) && found.length > 0 && (
        <div className="guesses-section">
          <h3 className="guesses-title">{t('Found')} <span className="guess-count">{found.length}</span></h3>
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
        {!timerMode ? null : (gameOver || expired || allFound) ? (
          <>
            <button className="new-game-btn na-start-default" onClick={() => startTimer(timerMode)}>{t('▶ Play again')}</button>
            <button className="new-game-btn" onClick={handleReset}>{t('⚙ Settings')}</button>
          </>
        ) : (
          <button className="new-game-btn" onClick={handleReset}>{t('🔄 Reset')}</button>
        )}
      </div>
    </>
  )
}
