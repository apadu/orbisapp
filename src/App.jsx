import { useState, useEffect, useCallback } from 'react'
import Globe from './components/Globe'
import HydroGlobe from './components/HydroGlobe'
import GamePanel from './components/GamePanel'
import NameAllPanel from './components/NameAllPanel'
import CapitalPanel from './components/CapitalPanel'
import SeaPanel from './components/SeaPanel'
import LocatePanel from './components/LocatePanel'
import PopOrderPanel from './components/PopOrderPanel'
import BorderChainPanel from './components/BorderChainPanel'
import CapToCountryPanel from './components/CapToCountryPanel'
import FlagPanel from './components/FlagPanel'
import MissingPanel from './components/MissingPanel'
import LearnPanel from './components/LearnPanel'
import SpotlightPanel from './components/SpotlightPanel'
import NameAllCapitalsPanel from './components/NameAllCapitalsPanel'
import { getDistanceInfo, computeAdjacency } from './utils/geoUtils'
import { geoDistance, geoCentroid, geoContains } from 'd3-geo'
import { union } from '@turf/union'
import { featureCollection } from '@turf/helpers'
import { CAPITALS } from './utils/capitals'
import { COUNTRY_INFO } from './utils/countryInfo'
import { pickDailyCountry, todayLabel } from './utils/daily'
import { getStats, recordWin } from './utils/stats'
import {
  loadProfile, recordMysteryResult, recordNameAllCompletion, recordContinentPB,
  recordCapitalResult, recordLocateRound, recordC2cResult,
  recordBorderChainRound, recordPopOrderRound, recordFlagRound,
} from './utils/profileStats'
import ProfilePage from './components/ProfilePage'
import './App.css'

const GEO_URL =
  'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_50m_admin_0_countries.geojson'
const MARINE_URL =
  'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_50m_geography_marine_polys.geojson'

const DROP_TYPES = new Set(['Dependency', 'Lease', 'Occupied Territory', 'Indeterminate', 'Disputed', 'Commonwealth'])
// Always keep these even if their TYPE would normally drop them
const KEEP_ALWAYS = new Set(['Kosovo', 'Israel', 'W. Sahara'])

// Merge these territories into the named target country (geometry union)
const MERGE_INTO = {}
// Rendered on the globe but not guessable in any game
const DISPLAY_ONLY = new Set(['Greenland', 'W. Sahara'])

// Never include these regardless of TYPE
const EXCLUDE_NAMES = new Set([
  'Antarctica', 'Aruba', 'Curaçao', 'Curacao',
  'N. Cyprus', 'Northern Cyprus', 'Somaliland',
  'Abkhazia', 'South Ossetia', 'Siachen Glacier',
  'Bajo Nuevo Bank (Petrel Is.)', 'Serranilla Bank', 'Scarborough Reef',
  'Indian Ocean Ter.',
  // French overseas departments (TYPE "Country" in Natural Earth but not sovereign states)
  'French Guiana', 'Guadeloupe', 'Martinique', 'Mayotte', 'Réunion',
  // Special administrative regions
  'Hong Kong', 'Macao',
  // Other territories that slip through
  'Puerto Rico',
  // Small dependent territories
  'Guernsey', 'Isle of Man', 'Jersey',
  'Sint Maarten', 'Åland', 'Aland',
  'Faeroe Is.',  // likely 6th extra
])

const NAME_OVERRIDES = {
  'S. Sudan':                 'South Sudan',
  'Eq. Guinea':               'Equatorial Guinea',
  'eSwatini':                 'Eswatini',
  'Dem. Rep. Congo':          'Democratic Republic of Congo',
  'Central African Rep.':     'Central African Republic',
  'Bosnia and Herz.':         'Bosnia and Herzegovina',
  'Czech Rep.':               'Czech Republic',
  'Czechia':                  'Czech Republic',
  'Dominican Rep.':           'Dominican Republic',
  'St. Kitts and Nevis':      'Saint Kitts and Nevis',
  'St. Vin. and Gren.':       'Saint Vincent and the Grenadines',
  'Antigua and Barb.':        'Antigua and Barbuda',
  'Marshall Is.':             'Marshall Islands',
  'Solomon Is.':              'Solomon Islands',
  'São Tomé and Príncipe':    'Sao Tome and Principe',
  'São Tomé and Principe':    'Sao Tome and Principe',
  "Côte d'Ivoire":            'Ivory Coast',
  "Cote d'Ivoire":            'Ivory Coast',
  'Micronesia':               'Federated States of Micronesia',
}

export default function App() {
  const [countries,      setCountries]      = useState([]) // all features (globe rendering)
  const [gameCountries,  setGameCountries]  = useState([]) // guessable subset
  const [adjacency,      setAdjacency]      = useState({})
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState(null)

  // ── Theme ────────────────────────────────────────────────────────────────
  const [lightMode, setLightMode] = useState(() => localStorage.getItem('orbis-theme') === 'light')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', lightMode ? 'light' : 'dark')
    localStorage.setItem('orbis-theme', lightMode ? 'light' : 'dark')
  }, [lightMode])

  // ── App page & profile ───────────────────────────────────────────────────
  const [page,    setPage]    = useState('game') // 'game' | 'profile'
  const [profile, setProfile] = useState(() => loadProfile())

  // ── Shared game mode ─────────────────────────────────────────────────────
  const [mode, setMode] = useState('mystery')

  // ── Mystery Country state ────────────────────────────────────────────────
  const [mystery,        setMystery]       = useState(null)
  const [mysteryGuesses, setMysteryGuesses] = useState([])
  const [gameWon,        setGameWon]       = useState(false)
  const [stats,          setStats]         = useState(getStats)
  const [practiceMode,   setPracticeMode]  = useState(false)
  const [gaveUp,         setGaveUp]        = useState(false)

  // ── Name All Countries state ─────────────────────────────────────────────
  const [found, setFound] = useState([]) // [{ name, feature }]

  // ── Capital Quiz state ───────────────────────────────────────────────────
  const [capCurrent,  setCapCurrent]  = useState(null)   // current feature
  const [capAnswered, setCapAnswered] = useState(false)   // answered/skipped this round
  const [capHistory,  setCapHistory]  = useState([])      // [{country, capital, correct}]
  const [capScore,    setCapScore]    = useState({ correct: 0, total: 0 })
  const [capUsed,     setCapUsed]     = useState(new Set())

  // ── Cap-to-Country state ─────────────────────────────────────────────────
  const [c2cCurrent,  setC2cCurrent]  = useState(null) // { country, capital }
  const [c2cAnswered, setC2cAnswered] = useState(false)
  const [c2cCorrect,  setC2cCorrect]  = useState(false)
  const [c2cScore,    setC2cScore]    = useState({ correct: 0, total: 0 })
  const [c2cHistory,  setC2cHistory]  = useState([])
  const [c2cUsed,     setC2cUsed]     = useState(new Set())

  // ── Flag Quiz state ──────────────────────────────────────────────────────
  const [flagCurrent,  setFlagCurrent]  = useState(null)
  const [flagAnswered, setFlagAnswered] = useState(false)
  const [flagCorrect,  setFlagCorrect]  = useState(false)
  const [flagScore,    setFlagScore]    = useState({ correct: 0, total: 0, points: 0 })
  const [flagHistory,  setFlagHistory]  = useState([])
  const [flagUsed,     setFlagUsed]     = useState(new Set())
  const [flagStreak,   setFlagStreak]   = useState(0)

  // ── Border Chain state ───────────────────────────────────────────────────
  const [bcStart,   setBcStart]   = useState(null)
  const [bcEnd,     setBcEnd]     = useState(null)
  const [bcScore,   setBcScore]   = useState(0)
  const [bcHistory, setBcHistory] = useState([])

  // ── Population Order state ───────────────────────────────────────────────
  const [popCountries,  setPopCountries]  = useState([]) // 3 features
  const [popScore,      setPopScore]      = useState(0)
  const [popHistory,    setPopHistory]    = useState([])

  // ── Locate It state ─────────────────────────────────────────────────────
  const [locateCurrent,  setLocateCurrent]  = useState(null)
  const [locateGuessed,  setLocateGuessed]  = useState(false)
  const [locateResult,   setLocateResult]   = useState(null)  // { km, pts }
  const [locateHistory,  setLocateHistory]  = useState([])
  const [locateScore,    setLocateScore]    = useState(0)
  const [locateMarker,   setLocateMarker]   = useState(null)  // { lon, lat }

  // ── Globe controls ───────────────────────────────────────────────────────
  const [globeSpin,      setGlobeSpin]      = useState(true)

  // ── Solo Map (Spotlight) state ───────────────────────────────────────────
  const [spotlightCurrentFeature, setSpotlightCurrentFeature] = useState(null)
  const [spotlightFoundNames,     setSpotlightFoundNames]     = useState([])
  const [spotlightMissedNames,    setSpotlightMissedNames]    = useState([])

  // ── Name All Capitals state ──────────────────────────────────────────────
  const [capsFound,      setCapsFound]      = useState([]) // [{name, capital, feature}]
  const [capsAllMissed,  setCapsAllMissed]  = useState([]) // features[]

  // ── Learn mode state ─────────────────────────────────────────────────────
  const [learnSelected, setLearnSelected] = useState(null)   // feature
  const [learnHistory,  setLearnHistory]  = useState([])     // [name, ...]

  // ── Blind Map (Missing Countries) state ─────────────────────────────────
  const [missingHidden,      setMissingHidden]      = useState(new Set())
  const [missingMissedNames, setMissingMissedNames] = useState([])

  // ── Seas Quiz state ──────────────────────────────────────────────────────
  const [seas,        setSeas]        = useState([])
  const [seaCurrent,  setSeaCurrent]  = useState(null)
  const [seaAnswered, setSeaAnswered] = useState(false)
  const [seaHistory,  setSeaHistory]  = useState([])
  const [seaScore,    setSeaScore]    = useState({ correct: 0, total: 0 })
  const [seaUsed,     setSeaUsed]     = useState(new Set())
  const [seaStatus,   setSeaStatus]   = useState(null) // null | 'correct' | 'skipped'

  // ── Fetch GeoJSON ────────────────────────────────────────────────────────
  useEffect(() => {
    fetch(GEO_URL)
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json() })
      .then(data => {
        const features = data.features
          .filter(f =>
            f.geometry &&
            (KEEP_ALWAYS.has(f.properties.NAME) || !DROP_TYPES.has(f.properties.TYPE)) &&
            !EXCLUDE_NAMES.has(f.properties.NAME)
          )
          .map(f => {
            const override = NAME_OVERRIDES[f.properties.NAME]
            if (override) f.properties.NAME = override
            return f
          })
        // Merge territories into their target country (dissolves shared borders)
        for (const [srcName, targetName] of Object.entries(MERGE_INTO)) {
          const srcIdx    = features.findIndex(f => f.properties.NAME === srcName)
          const targetIdx = features.findIndex(f => f.properties.NAME === targetName)
          if (srcIdx === -1 || targetIdx === -1) continue
          try {
            const merged = union(featureCollection([features[targetIdx], features[srcIdx]]))
            if (merged) {
              merged.properties = features[targetIdx].properties
              features[targetIdx] = merged
            }
          } catch (e) {
            console.warn(`Could not merge ${srcName} into ${targetName}:`, e)
          }
          features.splice(srcIdx, 1)
        }

        console.log(`Loaded ${features.length} countries:`,
          features.map(f => `${f.properties.NAME} (${f.properties.TYPE})`).sort().join('\n'))
        const game = features.filter(f => !DISPLAY_ONLY.has(f.properties.NAME))
        setCountries(features)
        setGameCountries(game)
        setAdjacency(computeAdjacency(features))
        pickMystery(game)
        setCapCurrent(pickNextCapital(new Set(), game))
        setLoading(false)
      })
      .catch(e => {
        console.error(e)
        setError('Could not load country data. Check your internet connection.')
        setLoading(false)
      })
  }, [])

  // ── Fetch marine polygons ────────────────────────────────────────────────
  useEffect(() => {
    fetch(MARINE_URL)
      .then(r => r.json())
      .then(data => {
        // Marine polys use lowercase property names (name, scalerank)
        // Normalize to uppercase NAME so the rest of the app is consistent
        const features = data.features
          .filter(f => f.geometry && f.properties.name && f.properties.scalerank <= 3)
          .map(f => ({
            ...f,
            properties: { ...f.properties, NAME: f.properties.name },
          }))
        console.log(`Loaded ${features.length} seas:`, features.map(f => f.properties.NAME).sort().join(', '))
        setSeas(features)
        setSeaCurrent(pickNextSea(new Set(), features))
      })
      .catch(e => console.warn('Could not load marine data:', e))
  }, [])

  function pickMystery(features, practice = false) {
    const pool = features ?? gameCountries
    if (practice) {
      setMystery(pool[Math.floor(Math.random() * pool.length)])
    } else {
      setMystery(pickDailyCountry(pool))
    }
  }

  // ── Capital Quiz: pick next country ─────────────────────────────────────
  const pickNextCapital = useCallback((used, pool) => {
    const eligible = pool.filter(f => CAPITALS[f.properties.NAME] && !used.has(f.properties.NAME))
    if (!eligible.length) return null
    return eligible[Math.floor(Math.random() * eligible.length)]
  }, [])

  // ── Sea Quiz: pick next sea ──────────────────────────────────────────────
  function pickNextSea(used, pool) {
    const p = pool ?? seas
    const eligible = p.filter(f => !used.has(f.properties.NAME))
    if (!eligible.length) return null
    return eligible[Math.floor(Math.random() * eligible.length)]
  }

  // ── Sea Quiz handlers ────────────────────────────────────────────────────
  const handleSeaCorrect = useCallback(() => {
    if (!seaCurrent) return
    const name = seaCurrent.properties.NAME
    if (!seaAnswered) {
      setSeaScore(s => ({ correct: s.correct + 1, total: s.total + 1 }))
      setSeaHistory(h => [...h, { name, correct: true }])
      setSeaStatus('correct')
      setTimeout(() => {
        setSeaStatus(null)
        const newUsed = new Set(seaUsed).add(name)
        setSeaUsed(newUsed)
        setSeaAnswered(false)
        setSeaCurrent(pickNextSea(newUsed))
      }, 700)
    } else {
      const newUsed = new Set(seaUsed).add(name)
      setSeaUsed(newUsed)
      setSeaAnswered(false)
      setSeaStatus(null)
      setSeaCurrent(pickNextSea(newUsed))
    }
  }, [seaCurrent, seaAnswered, seaUsed, seas])

  const handleSeaSkip = useCallback(() => {
    if (!seaCurrent || seaAnswered) return
    const name = seaCurrent.properties.NAME
    setSeaScore(s => ({ ...s, total: s.total + 1 }))
    setSeaHistory(h => [...h, { name, correct: false }])
    setSeaAnswered(true)
    setSeaStatus('skipped')
  }, [seaCurrent, seaAnswered])

  const handleSeaNewGame = useCallback(() => {
    const fresh = new Set()
    setSeaUsed(fresh)
    setSeaScore({ correct: 0, total: 0 })
    setSeaHistory([])
    setSeaAnswered(false)
    setSeaStatus(null)
    setSeaCurrent(pickNextSea(fresh))
  }, [seas])

  // ── Switch mode — reset both games ───────────────────────────────────────
  // ── Cap-to-Country handlers ──────────────────────────────────────────────
  const pickNextC2c = useCallback((used, pool) => {
    const eligible = pool.filter(f => CAPITALS[f.properties.NAME] && !used.has(f.properties.NAME))
    if (!eligible.length) return null
    const f = eligible[Math.floor(Math.random() * eligible.length)]
    return { country: f.properties.NAME, capital: CAPITALS[f.properties.NAME][0] }
  }, [])

  const handleC2cGuess = useCallback((guessed) => {
    if (!c2cCurrent || c2cAnswered) return
    const isCorrect = guessed === c2cCurrent.country
    const newStreak = isCorrect ? (c2cScore.streak ?? 0) + 1 : 0
    setC2cCorrect(isCorrect)
    setC2cAnswered(true)
    setC2cScore(s => ({ correct: s.correct + (isCorrect ? 1 : 0), total: s.total + 1, streak: newStreak }))
    setC2cHistory(h => [...h, { capital: c2cCurrent.capital, country: c2cCurrent.country, correct: isCorrect }])
    setProfile(recordC2cResult(isCorrect, newStreak))
  }, [c2cCurrent, c2cAnswered, c2cScore])

  const handleC2cSkip = useCallback(() => {
    if (!c2cCurrent || c2cAnswered) return
    setC2cCorrect(false)
    setC2cAnswered(true)
    setC2cScore(s => ({ ...s, total: s.total + 1 }))
    setC2cHistory(h => [...h, { capital: c2cCurrent.capital, country: c2cCurrent.country, correct: false }])
  }, [c2cCurrent, c2cAnswered])

  const handleC2cNext = useCallback(() => {
    const newUsed = new Set(c2cUsed).add(c2cCurrent?.country)
    // Reset used if all exhausted
    const eligible = gameCountries.filter(f => CAPITALS[f.properties.NAME] && !newUsed.has(f.properties.NAME))
    const finalUsed = eligible.length ? newUsed : new Set()
    setC2cUsed(finalUsed)
    setC2cCurrent(pickNextC2c(finalUsed, gameCountries))
    setC2cAnswered(false)
    setC2cCorrect(false)
  }, [c2cCurrent, c2cUsed, gameCountries, pickNextC2c])

  useEffect(() => {
    if (mode === 'cap-to-country' && gameCountries.length > 0 && !c2cCurrent) {
      setC2cCurrent(pickNextC2c(new Set(), gameCountries))
    }
  }, [mode, gameCountries, c2cCurrent, pickNextC2c])

  // ── Flag Quiz handlers ───────────────────────────────────────────────────
  const calcFlagPoints = (streak) => {
    if (streak <= 1) return 100
    if (streak === 2) return 150
    if (streak === 3) return 200
    if (streak === 4) return 300
    return 400
  }

  const pickNextFlag = useCallback((used, pool) => {
    const eligible = pool.filter(f => {
      const name = f.properties.NAME
      return COUNTRY_INFO[name]?.flag && !used.has(name)
    })
    const src = eligible.length ? eligible : pool.filter(f => COUNTRY_INFO[f.properties.NAME]?.flag)
    if (!src.length) return null
    const f = src[Math.floor(Math.random() * src.length)]
    return { name: f.properties.NAME, flag: COUNTRY_INFO[f.properties.NAME].flag }
  }, [])

  const handleFlagGuess = useCallback((guessed) => {
    if (!flagCurrent || flagAnswered) return
    const isCorrect = guessed === flagCurrent.name
    const newStreak = isCorrect ? flagStreak + 1 : 0
    const pts = isCorrect ? calcFlagPoints(newStreak) : 0
    setFlagCorrect(isCorrect)
    setFlagAnswered(true)
    setFlagStreak(newStreak)
    setFlagScore(s => ({
      correct: s.correct + (isCorrect ? 1 : 0),
      total: s.total + 1,
      points: s.points + pts,
    }))
    setFlagHistory(h => [...h, { name: flagCurrent.name, flag: flagCurrent.flag, correct: isCorrect, pts }])
    setProfile(recordFlagRound(isCorrect, newStreak, pts))
  }, [flagCurrent, flagAnswered, flagStreak])

  const handleFlagSkip = useCallback(() => {
    if (!flagCurrent || flagAnswered) return
    setFlagCorrect(false)
    setFlagAnswered(true)
    setFlagStreak(0)
    setFlagScore(s => ({ ...s, total: s.total + 1 }))
    setFlagHistory(h => [...h, { name: flagCurrent.name, flag: flagCurrent.flag, correct: false, pts: 0 }])
  }, [flagCurrent, flagAnswered])

  const handleFlagNext = useCallback(() => {
    const newUsed = new Set(flagUsed).add(flagCurrent?.name)
    const eligible = gameCountries.filter(f => COUNTRY_INFO[f.properties.NAME]?.flag && !newUsed.has(f.properties.NAME))
    const finalUsed = eligible.length ? newUsed : new Set()
    setFlagUsed(finalUsed)
    setFlagCurrent(pickNextFlag(finalUsed, gameCountries))
    setFlagAnswered(false)
    setFlagCorrect(false)
  }, [flagCurrent, flagUsed, gameCountries, pickNextFlag])

  useEffect(() => {
    if (mode === 'flag' && gameCountries.length > 0 && !flagCurrent) {
      setFlagCurrent(pickNextFlag(new Set(), gameCountries))
    }
  }, [mode, gameCountries, flagCurrent, pickNextFlag])

  // ── Border Chain handlers ────────────────────────────────────────────────
  const pickBcPair = useCallback(() => {
    // Only use countries that have at least one land border
    const landlocked = gameCountries.filter(f => {
      const nb = adjacency[f.properties.NAME]
      return nb && nb.size > 0
    })
    if (landlocked.length < 2) return

    // Convert adjacency Sets to plain arrays for BFS
    const adjMap = {}
    for (const [k, v] of Object.entries(adjacency)) adjMap[k] = [...v]

    // BFS helper
    const bfs = (start, end) => {
      if (start === end) return 0
      const visited = new Set([start])
      let frontier = [start]
      let dist = 0
      while (frontier.length) {
        dist++
        const next = []
        for (const node of frontier) {
          for (const nb of (adjMap[node] ?? [])) {
            if (nb === end) return dist
            if (!visited.has(nb)) { visited.add(nb); next.push(nb) }
          }
        }
        frontier = next
      }
      return Infinity
    }

    // Pick a random start, then find a country 3-7 hops away
    for (let attempt = 0; attempt < 50; attempt++) {
      const start = landlocked[Math.floor(Math.random() * landlocked.length)]
      const startName = start.properties.NAME
      const candidates = landlocked.filter(f => {
        const d = bfs(startName, f.properties.NAME)
        return d >= 3 && d <= 7
      })
      if (candidates.length > 0) {
        const end = candidates[Math.floor(Math.random() * candidates.length)]
        setBcStart(start)
        setBcEnd(end)
        return
      }
    }
  }, [gameCountries, adjacency])

  const handleBcWin = useCallback((pts, chain, optimal) => {
    setBcScore(s => s + pts)
    setBcHistory(h => [...h, { pts, chain, optimal }])
    setProfile(recordBorderChainRound(pts))
  }, [])

  const handleBcNext = useCallback(() => pickBcPair(), [pickBcPair])
  const handleBcGiveUp = useCallback(() => {
    setBcHistory(h => [...h, { pts: 0, chain: [bcStart?.properties?.NAME], optimal: null }])
  }, [bcStart])

  useEffect(() => {
    if (mode === 'border-chain' && gameCountries.length > 0 && Object.keys(adjacency).length > 0 && !bcStart) {
      pickBcPair()
    }
  }, [mode, gameCountries, adjacency, bcStart, pickBcPair])

  // ── Population Order handlers ────────────────────────────────────────────
  const pickPopCountries = useCallback((exclude = []) => {
    const pool = gameCountries.filter(f => !exclude.includes(f))
    const picks = []
    while (picks.length < 3 && pool.length > picks.length) {
      const idx = Math.floor(Math.random() * pool.length)
      if (!picks.includes(pool[idx])) picks.push(pool[idx])
    }
    return picks
  }, [gameCountries])

  const handlePopScore = useCallback((pts, names, correctOrder) => {
    setPopScore(s => s + pts)
    setPopHistory(h => [...h, { pts, names, correctOrder }])
    setProfile(recordPopOrderRound(pts))
  }, [])

  const handlePopNext = useCallback(() => {
    setPopCountries(pickPopCountries())
  }, [pickPopCountries])

  useEffect(() => {
    if (mode === 'pop-order' && gameCountries.length > 0 && popCountries.length === 0) {
      setPopCountries(pickPopCountries())
    }
  }, [mode, gameCountries, popCountries, pickPopCountries])

  const switchMode = useCallback((m) => {
    setMode(m)
    setMysteryGuesses([])
    setGameWon(false)
    setFound([])
    setCapHistory([])
    setCapScore({ correct: 0, total: 0 })
    setCapUsed(new Set())
    setCapAnswered(false)
    if (m === 'mystery') pickMystery(gameCountries)
    if (m === 'capital') setCapCurrent(pickNextCapital(new Set(), gameCountries))
    if (m === 'cap-to-country') {
      setC2cCurrent(null)
      setC2cAnswered(false)
      setC2cCorrect(false)
      setC2cScore({ correct: 0, total: 0 })
      setC2cHistory([])
      setC2cUsed(new Set())
    }
    if (m === 'border-chain') {
      setBcStart(null)
      setBcEnd(null)
      setBcScore(0)
      setBcHistory([])
    }
    if (m === 'pop-order') {
      setPopCountries([])
      setPopScore(0)
      setPopHistory([])
    }
    if (m === 'locate') {
      setLocateCurrent(null)
      setLocateGuessed(false)
      setLocateResult(null)
      setLocateHistory([])
      setLocateScore(0)
      setLocateMarker(null)
    }
    if (m === 'flag') {
      setFlagCurrent(null)
      setFlagAnswered(false)
      setFlagCorrect(false)
      setFlagScore({ correct: 0, total: 0, points: 0 })
      setFlagHistory([])
      setFlagUsed(new Set())
      setFlagStreak(0)
    }
    if (m !== 'missing') {
      setMissingHidden(new Set())
      setMissingMissedNames([])
    }
    if (m !== 'spotlight') {
      setSpotlightCurrentFeature(null)
      setSpotlightFoundNames([])
      setSpotlightMissedNames([])
    }
    if (m !== 'name-all-caps') {
      setCapsFound([])
      setCapsAllMissed([])
    }
    if (m !== 'learn') {
      setLearnSelected(null)
      setLearnHistory([])
    }
  }, [gameCountries, pickNextCapital])

  // ── Mystery: handle a guess ──────────────────────────────────────────────
  const handleMysteryGuess = useCallback((feature) => {
    if (gameWon || !mystery) return
    const name = feature.properties.NAME
    if (mysteryGuesses.some(g => g.name === name)) return

    if (name === mystery.properties.NAME) {
      setMysteryGuesses(prev => [...prev, { name, km: 0, color: '#22c55e', angle: 0, isAdjacent: false, feature }])
      setGameWon(true)
      if (!practiceMode) setStats(recordWin())
      setProfile(recordMysteryResult(true))
    } else {
      const { km, color, angle } = getDistanceInfo(feature, mystery)
      const isAdjacent = !!(adjacency[mystery.properties.NAME]?.has(name))
      setMysteryGuesses(prev => [...prev, { name, km, color, angle, isAdjacent, feature }])
    }
  }, [mystery, mysteryGuesses, gameWon, adjacency])

  const handleMysteryNewGame = useCallback(() => {
    if (!gameCountries.length) return
    pickMystery(gameCountries, practiceMode)
    setMysteryGuesses([])
    setGameWon(false)
    setGaveUp(false)
  }, [gameCountries, practiceMode])

  const handleTogglePractice = useCallback((on) => {
    setPracticeMode(on)
    pickMystery(gameCountries, on)
    setMysteryGuesses([])
    setGameWon(false)
    setGaveUp(false)
  }, [gameCountries])

  // ── Name All: handle a guess ─────────────────────────────────────────────
  const handleNameAllGuess = useCallback((feature) => {
    const name = feature.properties.NAME
    if (found.some(f => f.name === name)) return
    setFound(prev => [...prev, { name, feature }])
  }, [found])

  const [nameAllMissed, setNameAllMissed] = useState([])

  const handleNameAllNewGame = useCallback(() => {
    setFound([])
    setNameAllMissed([])
  }, [])

  const handleNameAllMissed = useCallback((missedFeatures) => {
    setNameAllMissed(missedFeatures)
  }, [])

  // ── Capital Quiz handlers ────────────────────────────────────────────────
  const handleCapCorrect = useCallback(() => {
    if (!capCurrent) return
    const name = capCurrent.properties.NAME
    const cap  = CAPITALS[name]?.[0]

    if (!capAnswered) {
      const newStreak = (capScore.streak ?? 0) + 1
      setCapScore(s => ({ correct: s.correct + 1, total: s.total + 1, streak: newStreak }))
      setCapHistory(h => [...h, { country: name, capital: cap, correct: true }])
      setProfile(recordCapitalResult(true, newStreak))
    }

    const newUsed = new Set(capUsed).add(name)
    setCapUsed(newUsed)
    setCapAnswered(false)
    setCapCurrent(pickNextCapital(newUsed, countries))
  }, [capCurrent, capAnswered, capUsed, countries, pickNextCapital])

  const handleCapSkip = useCallback(() => {
    if (!capCurrent || capAnswered) return
    const name = capCurrent.properties.NAME
    const cap  = CAPITALS[name]?.[0]
    setCapScore(s => ({ ...s, total: s.total + 1 }))
    setCapHistory(h => [...h, { country: name, capital: cap, correct: false }])
    setCapAnswered(true)
  }, [capCurrent, capAnswered])

  const handleCapNewGame = useCallback(() => {
    const fresh = new Set()
    setCapUsed(fresh)
    setCapScore({ correct: 0, total: 0 })
    setCapHistory([])
    setCapAnswered(false)
    setCapCurrent(pickNextCapital(fresh, gameCountries))
  }, [gameCountries, pickNextCapital])

  // ── Learn mode handler ──────────────────────────────────────────────────
  const handleLearnClick = useCallback((lon, lat) => {
    const hit = countries.find(f => geoContains(f, [lon, lat]))
    if (!hit) return
    const name = hit.properties.NAME
    setLearnSelected(hit)
    setLearnHistory(h => {
      const filtered = h.filter(n => n !== name)
      return [name, ...filtered].slice(0, 10)
    })
  }, [countries])

  // ── Locate It handlers ──────────────────────────────────────────────────
  const pickLocateCountry = useCallback((exclude) => {
    const pool = gameCountries.filter(f => f !== exclude)
    return pool[Math.floor(Math.random() * pool.length)] ?? gameCountries[0]
  }, [gameCountries])

  const handleLocateClick = useCallback((lon, lat) => {
    if (locateGuessed || !locateCurrent) return
    let km = 0
    if (!geoContains(locateCurrent, [lon, lat])) {
      const centroid = geoCentroid(locateCurrent)
      km = Math.round(geoDistance([lon, lat], centroid) * 6371)
    }
    const pts = Math.max(10, Math.round(1000 * Math.exp(-km / 2000)))
    setLocateMarker({ lon, lat })
    setLocateResult({ km, pts })
    setLocateGuessed(true)
    setLocateScore(s => s + pts)
    setLocateHistory(h => [...h, { name: locateCurrent.properties.NAME, km, pts }])
    setProfile(recordLocateRound(pts))
  }, [locateGuessed, locateCurrent])

  const handleLocateNext = useCallback(() => {
    const next = pickLocateCountry(locateCurrent)
    setLocateCurrent(next)
    setLocateGuessed(false)
    setLocateResult(null)
    setLocateMarker(null)
  }, [locateCurrent, pickLocateCountry])

  const handleLocateNewGame = useCallback(() => {
    const first = pickLocateCountry(null)
    setLocateCurrent(first)
    setLocateGuessed(false)
    setLocateResult(null)
    setLocateHistory([])
    setLocateScore(0)
    setLocateMarker(null)
  }, [pickLocateCountry])

  // Start locate game when switching to locate mode
  useEffect(() => {
    if (mode === 'locate' && gameCountries.length > 0 && !locateCurrent) {
      handleLocateNewGame()
    }
  }, [mode, gameCountries, locateCurrent, handleLocateNewGame])

  // ── Missed features for end-states (show red on globe) ──────────────────
  const missingMissedFeatures  = missingMissedNames.map(n => countries.find(f => f.properties.NAME === n)).filter(Boolean)
  const spotlightMissedFeatures = spotlightMissedNames.map(n => countries.find(f => f.properties.NAME === n)).filter(Boolean)

  // ── Derive guesses + highlighted for globe ───────────────────────────────
  const globeGuesses = mode === 'name-all-caps'
    ? capsFound.map(f => ({ name: f.name, color: '#39ff14', feature: f.feature }))
    : mode === 'spotlight'
    ? spotlightFoundNames.map(n => {
        const f = countries.find(c => c.properties.NAME === n)
        return f ? { name: n, color: '#39ff14', feature: f } : null
      }).filter(Boolean)
    : mode === 'mystery'
    ? mysteryGuesses
    : mode === 'name-all'
      ? found.map(f => ({ name: f.name, color: '#39ff14', feature: f.feature }))
      : mode === 'locate' && locateGuessed && locateCurrent
        ? [{ name: locateCurrent.properties.NAME, color: '#39ff14', feature: locateCurrent }]
        : mode === 'cap-to-country' && c2cCurrent && c2cAnswered
          ? (() => {
              const f = gameCountries.find(c => c.properties.NAME === c2cCurrent.country)
              return f ? [{ name: f.properties.NAME, color: c2cCorrect ? '#39ff14' : '#ef4444', feature: f }] : []
            })()
        : mode === 'border-chain' && bcStart && bcEnd
          ? [
              { name: bcStart.properties.NAME, color: '#39ff14', feature: bcStart },
              { name: bcEnd.properties.NAME,   color: '#f97316', feature: bcEnd },
            ]
          : mode === 'pop-order'
          ? popCountries.map(f => ({ name: f.properties.NAME, color: '#c77dff', feature: f }))
          : capHistory.map(h => ({
            name: h.country,
            color: h.correct ? '#39ff14' : '#ef4444',
            feature: gameCountries.find(c => c.properties.NAME === h.country),
          })).filter(g => g.feature)

  const globeHighlighted = mode === 'spotlight' ? spotlightCurrentFeature
    : mode === 'capital' ? capCurrent
    : mode === 'learn' ? learnSelected
    : mode === 'flag' && flagAnswered ? gameCountries.find(f => f.properties.NAME === flagCurrent?.name) ?? null
    : null

  // ── Render ───────────────────────────────────────────────────────────────
  if (loading) return (
    <div className="loading-screen"><div className="spinner" /><p>Loading the globe…</p></div>
  )
  if (error) return (
    <div className="error-screen"><p>⚠️ {error}</p></div>
  )

  return (
    <div className="app-shell">
      {/* ── Top bar ── */}
      <header className="topbar">
        <div className="topbar-brand">
          <span className="topbar-logo">🌐</span>
          <span className="topbar-name">Orbis</span>
          <span className="topbar-tagline">Geography Games</span>
        </div>
        <div className="topbar-auth">
          <button
            className="theme-toggle"
            onClick={() => setLightMode(m => !m)}
            title={lightMode ? 'Switch to dark mode' : 'Switch to light mode'}
          >
            {lightMode ? '🌙' : '☀️'}
          </button>
          <button
            className="topbar-avatar"
            onClick={() => setPage(p => p === 'profile' ? 'game' : 'profile')}
            title="View profile"
          >
            <span className="topbar-avatar-letter">{profile.username.charAt(0).toUpperCase()}</span>
            <span className="topbar-avatar-name">{profile.username}</span>
          </button>
          <button className="auth-btn auth-login">Log in</button>
          <button className="auth-btn auth-register">Sign up</button>
        </div>
      </header>

      {page === 'profile' && (
        <ProfilePage
          profile={profile}
          onBack={() => setPage('game')}
          onProfileUpdate={setProfile}
        />
      )}

      <div className="layout" style={{ display: page === 'profile' ? 'none' : 'flex' }}>
        {/* ── Left sidebar nav ── */}
        <nav className="sidebar">
          {[
            { id: 'mystery',        icon: '🔍', label: 'Mystery' },
            { id: 'name-all',       icon: '🌍', label: 'Name All' },
            { id: 'capital',        icon: '🏛️', label: 'Capitals' },
            { id: 'name-all-caps',  icon: '🏙️', label: 'All Caps' },
            { id: 'seas',           icon: '🌊', label: 'Seas' },
            { id: 'locate',         icon: '📍', label: 'Locate It' },
            { id: 'cap-to-country', icon: '🗺️', label: 'Cap → Country' },
            { id: 'border-chain',   icon: '🔗', label: 'Borders' },
            { id: 'pop-order',      icon: '📊', label: 'Population' },
            { id: 'flag',           icon: '🚩', label: 'Flags' },
            { id: 'learn',          icon: '🎓', label: 'Learn' },
            { id: 'missing',        icon: '🗺️', label: 'Blind Map' },
            { id: 'spotlight',      icon: '🔦', label: 'Solo Map' },
          ].map(({ id, icon, label }) => (
            <button
              key={id}
              className={`sidebar-btn ${mode === id ? 'active' : ''}`}
              onClick={() => switchMode(id)}
            >
              <span className="sidebar-icon">{icon}</span>
              <span className="sidebar-label">{label}</span>
            </button>
          ))}
        </nav>

        {/* ── Globe pane ── */}
        <div className="globe-pane">
          {mode === 'seas' ? (
            <HydroGlobe
              countries={countries}
              highlightedSea={seaCurrent}
              status={seaStatus}
            />
          ) : (
            <>
              <Globe
                countries={countries}
                guesses={globeGuesses}
                mystery={mode === 'mystery' ? mystery : null}
                gameWon={mode === 'mystery' ? gameWon : false}
                highlighted={globeHighlighted}
                missed={mode === 'name-all' ? nameAllMissed : mode === 'name-all-caps' ? capsAllMissed : mode === 'missing' ? missingMissedFeatures : mode === 'spotlight' ? spotlightMissedFeatures : []}
                hiddenCountries={mode === 'missing' ? missingHidden : undefined}
                soloMode={mode === 'spotlight'}
                onGlobeClick={mode === 'locate' ? handleLocateClick : mode === 'learn' ? handleLearnClick : null}
                locateMarker={mode === 'locate' ? locateMarker : null}
                spinEnabled={globeSpin}
                lightMode={lightMode}
              />
              <button
                className={`spin-toggle ${globeSpin ? 'spin-on' : 'spin-off'}`}
                onClick={() => setGlobeSpin(s => !s)}
                title={globeSpin ? 'Stop globe spin' : 'Start globe spin'}
              >
                {globeSpin ? '⏸' : '▶'}
              </button>
            </>
          )}
        </div>

      <div className="panel">
        {mode === 'mystery' && (
          <GamePanel
            countries={gameCountries}
            guesses={mysteryGuesses}
            mystery={mystery}
            gameWon={gameWon}
            onGuess={handleMysteryGuess}
            onNewGame={handleMysteryNewGame}
            stats={practiceMode ? null : stats}
            dateLabel={todayLabel()}
            practiceMode={practiceMode}
            onTogglePractice={handleTogglePractice}
            gaveUp={gaveUp}
            onGiveUp={() => setGaveUp(true)}
          />
        )}
        {mode === 'name-all' && (
          <NameAllPanel
            countries={gameCountries}
            found={found}
            onGuess={handleNameAllGuess}
            onNewGame={handleNameAllNewGame}
            onMissed={handleNameAllMissed}
            countryInfo={COUNTRY_INFO}
          />
        )}
        {mode === 'capital' && (
          <CapitalPanel
            countries={gameCountries}
            current={capCurrent}
            answered={capAnswered}
            onCorrect={handleCapCorrect}
            onSkip={handleCapSkip}
            onNewGame={handleCapNewGame}
            score={capScore}
            history={capHistory}
          />
        )}
        {mode === 'name-all-caps' && (
          <NameAllCapitalsPanel
            gameCountries={gameCountries}
            countryInfo={COUNTRY_INFO}
            onFoundChange={setCapsFound}
            onMissedChange={setCapsAllMissed}
            onNewGame={() => { setCapsFound([]); setCapsAllMissed([]) }}
          />
        )}
        {mode === 'cap-to-country' && (
          <CapToCountryPanel
            current={c2cCurrent}
            answered={c2cAnswered}
            correct={c2cCorrect}
            countryNames={gameCountries.map(f => f.properties.NAME)}
            onGuess={handleC2cGuess}
            onSkip={handleC2cSkip}
            onNext={handleC2cNext}
            score={c2cScore}
            history={c2cHistory}
          />
        )}
        {mode === 'border-chain' && bcStart && bcEnd && (
          <BorderChainPanel
            startCountry={bcStart}
            endCountry={bcEnd}
            adjacency={Object.fromEntries(
              Object.entries(adjacency).map(([k, v]) => [k, [...v]])
            )}
            countries={gameCountries}
            onWin={handleBcWin}
            totalScore={bcScore}
            history={bcHistory}
            onNext={handleBcNext}
            onGiveUp={handleBcGiveUp}
          />
        )}
        {mode === 'pop-order' && (
          <PopOrderPanel
            countries={popCountries}
            onScore={handlePopScore}
            totalScore={popScore}
            history={popHistory}
            onNext={handlePopNext}
          />
        )}
        {mode === 'flag' && (
          <FlagPanel
            current={flagCurrent}
            answered={flagAnswered}
            correct={flagCorrect}
            countryNames={gameCountries.map(f => f.properties.NAME)}
            onGuess={handleFlagGuess}
            onSkip={handleFlagSkip}
            onNext={handleFlagNext}
            score={flagScore}
            history={flagHistory}
            streak={flagStreak}
          />
        )}
        {mode === 'locate' && (
          <LocatePanel
            current={locateCurrent}
            guessed={locateGuessed}
            clickResult={locateResult}
            totalScore={locateScore}
            history={locateHistory}
            onNext={handleLocateNext}
          />
        )}
        {mode === 'seas' && (
          <SeaPanel
            current={seaCurrent}
            answered={seaAnswered}
            onCorrect={handleSeaCorrect}
            onSkip={handleSeaSkip}
            onNewGame={handleSeaNewGame}
            score={seaScore}
            history={seaHistory}
          />
        )}
        {mode === 'spotlight' && (
          <SpotlightPanel
            gameCountries={gameCountries}
            countryInfo={COUNTRY_INFO}
            onCurrentChange={setSpotlightCurrentFeature}
            onFoundChange={setSpotlightFoundNames}
            onMissedChange={setSpotlightMissedNames}
          />
        )}
        {mode === 'learn' && (
          <LearnPanel
            selected={learnSelected}
            history={learnHistory.slice(1)}
          />
        )}
        {mode === 'missing' && (
          <MissingPanel
            gameCountries={gameCountries}
            countryInfo={COUNTRY_INFO}
            onHiddenChange={setMissingHidden}
            onMissedChange={setMissingMissedNames}
          />
        )}
      </div>
    </div>
    </div>
  )
}
