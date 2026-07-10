import { useState, useEffect, useCallback, useMemo } from 'react'
import Globe, { FIXED_ELLIPSE_CENTERS, HULL_COUNTRY_NAMES } from './components/Globe'
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
import AreaPanel from './components/AreaPanel'
import CurrencyPanel from './components/CurrencyPanel'
import LanguagePanel from './components/LanguagePanel'
import NameAllCapitalsPanel from './components/NameAllCapitalsPanel'
import NameAllCurrenciesPanel from './components/NameAllCurrenciesPanel'
import NameAllLanguagesPanel from './components/NameAllLanguagesPanel'
import NameAllMountainsPanel from './components/NameAllMountainsPanel'
import NameAllSeasPanel from './components/NameAllSeasPanel'
import NeighborPanel from './components/NeighborPanel'
import OddOneOutPanel from './components/OddOneOutPanel'
import { generateQuestion } from './utils/oddOneOut'
import MountainGlobe from './components/MountainGlobe'
import NameAllSeaGlobe from './components/NameAllSeaGlobe'
import { getDistanceInfo, computeAdjacency } from './utils/geoUtils'
import { resolveAlias } from './utils/aliases'
import { geoDistance, geoCentroid, geoContains, geoBounds } from 'd3-geo'
import { union } from '@turf/union'
import { featureCollection } from '@turf/helpers'
import { MOUNTAIN_RANGES } from './utils/mountainRanges'
import { CAPITALS } from './utils/capitals'
import { COUNTRY_INFO } from './utils/countryInfo'
import { pickDailyCountry, todayLabel } from './utils/daily'
import { getStats, recordWin, recordGiveUp } from './utils/stats'
import {
  loadProfile, recordMysteryResult, recordNameAllCompletion, recordContinentPB,
  recordCapitalResult, recordLocateRound, recordC2cResult,
  recordBorderChainRound, recordPopOrderRound, recordFlagRound,
} from './utils/profileStats'
import ProfilePage from './components/ProfilePage'
import HomePage from './components/HomePage'
import Confetti from './components/Confetti'
import './App.css'
import { Analytics } from "@vercel/analytics/react"

const GEO_URL =
  'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_50m_admin_0_countries.geojson'
const MARINE_URL =
  'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_50m_geography_marine_polys.geojson'

const DROP_TYPES = new Set(['Dependency', 'Lease', 'Occupied Territory', 'Indeterminate', 'Disputed', 'Commonwealth'])
// Always keep these even if their TYPE would normally drop them
const KEEP_ALWAYS = new Set(['Kosovo', 'Israel', 'W. Sahara', 'Antarctica'])

// Merge these territories into the named target country (geometry union)
const MERGE_INTO = {}
// Rendered on the globe but not guessable in any game
const DISPLAY_ONLY = new Set(['Greenland', 'W. Sahara', 'Antarctica'])

// Never include these regardless of TYPE
const EXCLUDE_NAMES = new Set([
  'Aruba', 'Curaçao', 'Curacao',
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

  // ── Refocus last input after globe interaction ───────────────────────────
  // Tracks the most recently focused <input> and restores focus on mouseup
  // when the click didn't land on an interactive element (e.g. spinning the globe).
  useEffect(() => {
    let lastInput = null
    const onFocus = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        lastInput = e.target
      }
    }
    const onMouseUp = () => {
      if (!lastInput) return
      setTimeout(() => {
        const tag = document.activeElement?.tagName?.toLowerCase()
        if (!['input', 'textarea', 'button', 'select', 'a'].includes(tag)) {
          lastInput.focus()
        }
      }, 80)
    }
    window.addEventListener('focus', onFocus, true)
    window.addEventListener('mouseup', onMouseUp)
    return () => {
      window.removeEventListener('focus', onFocus, true)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [])

  // ── Theme ────────────────────────────────────────────────────────────────
  const [lightMode, setLightMode] = useState(() => localStorage.getItem('orbis-theme') === 'light')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', lightMode ? 'light' : 'dark')
    localStorage.setItem('orbis-theme', lightMode ? 'light' : 'dark')
  }, [lightMode])

  // ── App page & profile ───────────────────────────────────────────────────
  const [page,    setPage]    = useState('home') // 'home' | 'game' | 'profile'
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
  const [flyToFeature,   setFlyToFeature]  = useState(null)

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
  const [locateResult,   setLocateResult]   = useState(null)  // { km, pts, isHit }
  const [locateHistory,  setLocateHistory]  = useState([])
  const [locateScore,    setLocateScore]    = useState(0)
  const [locateMarker,   setLocateMarker]   = useState(null)  // { lon, lat }
  const [locateMode,     setLocateMode]     = useState(null)  // null | 'classic' | 'sprint' | 'sudden'
  const [locateUsedSet,  setLocateUsedSet]  = useState(() => new Set())
  const [locateGameOver, setLocateGameOver] = useState(false)
  const [locateExpired,  setLocateExpired]  = useState(false) // sprint time up

  // ── Globe controls ───────────────────────────────────────────────────────
  const [globeSpin,      setGlobeSpin]      = useState(true)

  // ── Solo Map (Spotlight) state ───────────────────────────────────────────
  const [spotlightCurrentFeature, setSpotlightCurrentFeature] = useState(null)
  const [spotlightFoundNames,     setSpotlightFoundNames]     = useState([])
  const [spotlightMissedNames,    setSpotlightMissedNames]    = useState([])

  // ── Name All Capitals state ──────────────────────────────────────────────
  const [capsFound,      setCapsFound]      = useState([]) // [{name, capital, feature}]
  const [capsAllMissed,  setCapsAllMissed]  = useState([]) // features[]

  // ── Name All Currencies state ────────────────────────────────────────────
  const [currenciesFound,  setCurrenciesFound]  = useState([]) // [{currencyName, code, countries:[{name,feature}]}]
  const [currenciesMissed, setCurrenciesMissed] = useState([]) // features[]

  // ── Name All Languages state ─────────────────────────────────────────────
  const [languagesFound,  setLanguagesFound]  = useState([]) // [{language, countries:[{name,feature}]}]
  const [languagesMissed, setLanguagesMissed] = useState([]) // features[]

  // ── Mountain Ranges state ────────────────────────────────────────────────
  const mountains = MOUNTAIN_RANGES.features                   // static — no fetch needed
  const [mountainsFound,   setMountainsFound]   = useState([]) // found features
  const [mountainsMissed,  setMountainsMissed]  = useState([]) // missed features

  // ── Name All Seas state ──────────────────────────────────────────────────
  const [seasAllFound,  setSeasAllFound]  = useState([]) // found sea features
  const [seasAllMissed, setSeasAllMissed] = useState([]) // missed sea features

  // ── Neighbor Challenge state ─────────────────────────────────────────────
  const [neighborTarget,  setNeighborTarget]  = useState(null)
  const [neighborFound,   setNeighborFound]   = useState([])
  const [neighborMissed,  setNeighborMissed]  = useState([])
  const [neighborDone,    setNeighborDone]    = useState(false)
  const [neighborScore,   setNeighborScore]   = useState(0)
  const [neighborHistory, setNeighborHistory] = useState([])

  // ── Odd One Out state ────────────────────────────────────────────────────
  const [oooQuestion,  setOooQuestion]  = useState(null)
  const [oooAnswered,  setOooAnswered]  = useState(false)
  const [oooChosen,    setOooChosen]    = useState(null)
  const [oooScore,     setOooScore]     = useState(0)
  const [oooStreak,    setOooStreak]    = useState(0)
  const [oooHistory,   setOooHistory]   = useState([])
  const [oooLastCat,   setOooLastCat]   = useState(null)

  // ── Learn mode state ─────────────────────────────────────────────────────
  const [learnSelected, setLearnSelected] = useState(null)   // feature
  const [learnHistory,  setLearnHistory]  = useState([])     // [name, ...]

  // ── Bigger/Smaller (Area) state ──────────────────────────────────────────
  const [areaPair, setAreaPair] = useState([]) // [featureA, featureB]

  // ── Blind Map (Missing Countries) state ─────────────────────────────────
  const [missingHidden,      setMissingHidden]      = useState(new Set())
  const [missingMissedNames, setMissingMissedNames] = useState([])
  const [missingFound,       setMissingFound]       = useState([])
  const [missingComplete,    setMissingComplete]    = useState(false)

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
    if (isCorrect) {
      const f = gameCountries.find(c => c.properties.NAME === c2cCurrent.country)
      if (f) setFlyToFeature({ ...f, _ts: Date.now() })
    }
  }, [c2cCurrent, c2cAnswered, c2cScore, gameCountries])

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

  // ── Fly to sea when it changes ───────────────────────────────────────────
  useEffect(() => {
    if (mode === 'seas' && seaCurrent) {
      setFlyToFeature({ ...seaCurrent, _ts: Date.now() })
    }
  }, [seaCurrent, mode])

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

  // ── Fly to midpoint between start & end when a new border-chain pair loads ─
  useEffect(() => {
    if (!bcStart || !bcEnd) return
    const [lonA, latA] = geoCentroid(bcStart)
    const [lonB, latB] = geoCentroid(bcEnd)
    // Average lon, but handle antimeridian wrap: if diff > 180° go the short way
    let dLon = lonB - lonA
    if (dLon >  180) dLon -= 360
    if (dLon < -180) dLon += 360
    const midLon = lonA + dLon / 2
    const midLat = (latA + latB) / 2
    const midFeature = {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [midLon, midLat] },
      properties: {},
      _ts: Date.now(),
    }
    setFlyToFeature(midFeature)
  }, [bcStart, bcEnd])

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
      setLocateMode(null)
      setLocateUsedSet(new Set())
      setLocateGameOver(false)
      setLocateExpired(false)
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
    if (m !== 'name-all-currencies') {
      setCurrenciesFound([])
      setCurrenciesMissed([])
    }
    if (m !== 'name-all-languages') {
      setLanguagesFound([])
      setLanguagesMissed([])
    }
    if (m !== 'mountains') {
      setMountainsFound([])
      setMountainsMissed([])
    }
    if (m !== 'name-all-seas') {
      setSeasAllFound([])
      setSeasAllMissed([])
    }
    if (m !== 'neighbor') {
      setNeighborTarget(null)
      setNeighborFound([])
      setNeighborMissed([])
      setNeighborDone(false)
      setNeighborScore(0)
      setNeighborHistory([])
    }
    if (m !== 'ooo') {
      setOooQuestion(null)
      setOooAnswered(false)
      setOooChosen(null)
      setOooScore(0)
      setOooStreak(0)
      setOooHistory([])
      setOooLastCat(null)
    }
    if (m !== 'learn') {
      setLearnSelected(null)
      setLearnHistory([])
    }
    if (m !== 'area') {
      setAreaPair([])
    }
  }, [gameCountries, pickNextCapital])

  // ── Mystery: handle a guess ──────────────────────────────────────────────
  const handleMysteryGuess = useCallback((feature) => {
    if (gameWon || !mystery) return
    const name = feature.properties.NAME
    if (mysteryGuesses.some(g => g.name === name)) return

    setFlyToFeature({ ...feature, _ts: Date.now() })

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
    // Canvas is 4096×2048 for 360°×180° → 1px ≈ 0.0879°; use 1.8× slack for click tolerance
    const PX_TO_DEG = (180 / 2048) * 1.8

    // 1. Fixed-ellipse countries (Fiji, Kiribati, Micronesia, etc.) — check by
    //    proximity to their known visual center, scaled from canvas pixel radii
    let hit = countries.find(f => {
      const fe = FIXED_ELLIPSE_CENTERS[f.properties.NAME]
      if (!fe) return false
      const dLon = Math.abs(lon - fe.lon)
      const dLat = Math.abs(lat - fe.lat)
      return dLon < fe.rx * PX_TO_DEG && dLat < fe.ry * PX_TO_DEG
    })

    // 2. Hull countries (Bahamas, Solomon Is., etc.) — check before geoContains
    //    so neighbouring large countries don't shadow them
    if (!hit) {
      hit = countries.find(f => {
        if (!HULL_COUNTRY_NAMES.has(f.properties.NAME)) return false
        try {
          const [[minLon, minLat], [maxLon, maxLat]] = geoBounds(f)
          const pad = 3.5
          return lon >= minLon - pad && lon <= maxLon + pad &&
                 lat >= minLat - pad && lat <= maxLat + pad
        } catch { return false }
      })
    }

    // 3. Exact polygon containment (covers all normal-sized countries)
    if (!hit) hit = countries.find(f => geoContains(f, [lon, lat]))

    // 4. Padded bounding-box fallback for remaining small countries
    if (!hit) {
      hit = countries.find(f => {
        try {
          const [[minLon, minLat], [maxLon, maxLat]] = geoBounds(f)
          const w = maxLon - minLon
          const h = maxLat - minLat
          if (w >= 12 || h >= 12) return false
          const pad = 3.5
          return lon >= minLon - pad && lon <= maxLon + pad &&
                 lat >= minLat - pad && lat <= maxLat + pad
        } catch { return false }
      })
    }

    if (!hit) return
    const name = hit.properties.NAME
    setLearnSelected(hit)
    setLearnHistory(h => {
      const filtered = h.filter(n => n !== name)
      return [name, ...filtered].slice(0, 10)
    })
  }, [countries])

  // ── Locate It handlers ──────────────────────────────────────────────────
  const LOCATE_EXCLUDE = new Set([
    'Dominica', 'St. Lucia', 'Saint Kitts and Nevis', 'Saint Vincent and the Grenadines',
    'Barbados', 'Antigua and Barbuda', 'Trinidad and Tobago',
    'Luxembourg', 'Andorra', 'Monaco', 'San Marino', 'Vatican', 'Liechtenstein',
    'Singapore', 'Timor-Leste', 'Bahrain', 'Brunei',
    'Gambia', 'Gambia, The',
    'Grenada',
  ])

  const pickLocateCountry = useCallback((usedSet = new Set()) => {
    const eligible = gameCountries.filter(f => !LOCATE_EXCLUDE.has(f.properties.NAME) && !usedSet.has(f.properties.NAME))
    // If all countries used, start a new cycle
    const pool = eligible.length > 0 ? eligible : gameCountries.filter(f => !LOCATE_EXCLUDE.has(f.properties.NAME))
    return pool[Math.floor(Math.random() * pool.length)] ?? gameCountries[0]
  }, [gameCountries])

  const handleLocateClick = useCallback((lon, lat) => {
    if (locateGuessed || !locateCurrent || locateGameOver || locateExpired) return
    const PX_TO_DEG = (180 / 2048) * 1.8

    // ── Identify which country was actually clicked (same 4-step logic as Learn mode) ──
    // Step 1: fixed-ellipse countries (Fiji, Kiribati, Micronesia, etc.)
    let clicked = countries.find(f => {
      const fe = FIXED_ELLIPSE_CENTERS[f.properties.NAME]
      if (!fe) return false
      return Math.abs(lon - fe.lon) < fe.rx * PX_TO_DEG &&
             Math.abs(lat - fe.lat) < fe.ry * PX_TO_DEG
    })
    // Step 2: hull countries (Bahamas, Solomon Is., etc.) — padded bbox
    if (!clicked) {
      clicked = countries.find(f => {
        if (!HULL_COUNTRY_NAMES.has(f.properties.NAME)) return false
        try {
          const [[w, s], [e, n]] = geoBounds(f)
          const p = 3.5
          return lon >= w - p && lon <= e + p && lat >= s - p && lat <= n + p
        } catch { return false }
      })
    }
    // Step 3: exact polygon containment
    if (!clicked) clicked = countries.find(f => geoContains(f, [lon, lat]))
    // Step 4: small country padded bbox fallback
    if (!clicked) {
      clicked = countries.find(f => {
        try {
          const [[w, s], [e, n]] = geoBounds(f)
          if (e - w >= 12 || n - s >= 12) return false
          const p = 3.5
          return lon >= w - p && lon <= e + p && lat >= s - p && lat <= n + p
        } catch { return false }
      })
    }

    // ── Compare clicked country to target ──────────────────────────────────
    const isHit = clicked?.properties?.NAME === locateCurrent.properties.NAME
    const km = isHit ? 0 : Math.round(geoDistance([lon, lat], geoCentroid(locateCurrent)) * 6371)
    const pts = isHit ? 1000 : km < 500 ? Math.round(1000 * (1 - km / 500)) : 0

    setLocateMarker({ lon, lat })
    setLocateResult({ km, pts, isHit })
    setLocateGuessed(true)
    setLocateScore(s => s + pts)
    setLocateHistory(h => [...h, { name: locateCurrent.properties.NAME, km, pts, isHit }])
    setProfile(recordLocateRound(pts))

    // Sudden death: score < 950 → game over after a brief pause to show the result
    if (locateMode === 'sudden' && pts < 950) {
      setTimeout(() => setLocateGameOver(true), 1200)
    }
  }, [locateGuessed, locateCurrent, locateGameOver, locateExpired, locateMode, countries])

  const handleLocateNext = useCallback(() => {
    const newUsed = new Set(locateUsedSet)
    if (locateCurrent) newUsed.add(locateCurrent.properties.NAME)
    const next = pickLocateCountry(newUsed)
    setLocateUsedSet(newUsed)
    setLocateCurrent(next)
    setLocateGuessed(false)
    setLocateResult(null)
    setLocateMarker(null)
  }, [locateCurrent, locateUsedSet, pickLocateCountry])

  const handleLocateNewGame = useCallback((mode = null) => {
    setLocateMode(mode)
    setLocateGameOver(false)
    setLocateExpired(false)
    setLocateHistory([])
    setLocateScore(0)
    setLocateUsedSet(new Set())
    if (mode === null) {
      // Return to mode selection
      setLocateCurrent(null)
      setLocateGuessed(false)
      setLocateResult(null)
      setLocateMarker(null)
      return
    }
    const first = pickLocateCountry(new Set())
    setLocateCurrent(first)
    setLocateGuessed(false)
    setLocateResult(null)
    setLocateMarker(null)
  }, [pickLocateCountry])

  // Auto-advance: sprint always, sudden death only on success (pts ≥ 950)
  useEffect(() => {
    if (!locateGuessed || locateGameOver || locateExpired) return
    const isSprint = locateMode === 'sprint'
    const isSuddenSuccess = locateMode === 'sudden' && locateResult?.pts >= 950
    if (!isSprint && !isSuddenSuccess) return
    const t = setTimeout(handleLocateNext, 1200)
    return () => clearTimeout(t)
  }, [locateGuessed, locateMode, locateGameOver, locateExpired, locateResult, handleLocateNext])

  // ── Neighbor Challenge handlers ──────────────────────────────────────────
  // Normalised name map: stripped → canonical, rebuilt when gameCountries loads
  const countryNameMap = useMemo(() => {
    const map = {}
    for (const f of gameCountries) {
      const n = f.properties.NAME
      map[n.toLowerCase().replace(/[^a-z]/g, '')] = n
    }
    return map
  }, [gameCountries])

  const pickNeighborTarget = useCallback((exclude = null) => {
    const pool = gameCountries.filter(f => {
      if (f === exclude) return false
      const nb = adjacency[f.properties.NAME]
      return nb && nb.size >= 1
    })
    return pool[Math.floor(Math.random() * pool.length)] ?? null
  }, [gameCountries, adjacency])

  const handleNeighborGuess = useCallback((raw) => {
    if (!neighborTarget || neighborDone) return false
    const neighborNames = [...(adjacency[neighborTarget.properties.NAME] ?? new Set())]
    const canonical = resolveAlias(raw, neighborNames)
    if (!canonical) return false
    const neighbors = adjacency[neighborTarget.properties.NAME] ?? new Set()
    if (!neighbors.has(canonical) || neighborFound.includes(canonical)) return false

    const newFound = [...neighborFound, canonical]
    setNeighborFound(newFound)
    setNeighborScore(s => s + 100)

    if (newFound.length === neighbors.size) {
      setNeighborDone(true)
      setNeighborHistory(h => [...h, { target: neighborTarget.properties.NAME, found: newFound.length, total: neighbors.size }])
    }
    return true
  }, [neighborTarget, neighborDone, neighborFound, adjacency, countryNameMap])

  const handleNeighborGiveUp = useCallback(() => {
    if (!neighborTarget || neighborDone) return
    const neighbors = adjacency[neighborTarget.properties.NAME] ?? new Set()
    const missed = [...neighbors].filter(n => !neighborFound.includes(n))
    setNeighborMissed(missed)
    setNeighborDone(true)
    setNeighborHistory(h => [...h, { target: neighborTarget.properties.NAME, found: neighborFound.length, total: neighbors.size }])
  }, [neighborTarget, neighborDone, neighborFound, adjacency])

  const handleNeighborNext = useCallback(() => {
    const next = pickNeighborTarget(neighborTarget)
    setNeighborTarget(next)
    setNeighborFound([])
    setNeighborMissed([])
    setNeighborDone(false)
  }, [neighborTarget, pickNeighborTarget])

  // Auto-start neighbor game
  useEffect(() => {
    if (mode === 'neighbor' && gameCountries.length > 0 && Object.keys(adjacency).length > 0 && !neighborTarget) {
      setNeighborTarget(pickNeighborTarget())
    }
  }, [mode, gameCountries, adjacency, neighborTarget, pickNeighborTarget])

  // Fly to neighbor target when it changes
  useEffect(() => {
    if (mode === 'neighbor' && neighborTarget) {
      setFlyToFeature({ ...neighborTarget, _ts: Date.now() })
    }
  }, [neighborTarget, mode])

  // ── Odd One Out handlers ─────────────────────────────────────────────────
  const pickOooQuestion = useCallback((lastCat = null) => {
    const q = generateQuestion(gameCountries, lastCat)
    setOooQuestion(q)
    setOooAnswered(false)
    setOooChosen(null)
    if (q) setOooLastCat(q.category)
  }, [gameCountries])

  const handleOooGuess = useCallback((index) => {
    if (oooAnswered || !oooQuestion) return
    const correct = index === oooQuestion.oddIndex
    const streakMult = [1, 1, 1.5, 2, 3, 4]
    const newStreak = correct ? oooStreak + 1 : 0
    const mult = streakMult[Math.min(oooStreak, streakMult.length - 1)]
    const pts = correct ? Math.round(100 * mult) : 0
    setOooChosen(index)
    setOooAnswered(true)
    setOooStreak(newStreak)
    if (pts) setOooScore(s => s + pts)
    setOooHistory(h => [...h, {
      odd: oooQuestion.options[oooQuestion.oddIndex].name,
      correct,
      pts,
    }])
  }, [oooAnswered, oooQuestion, oooStreak])

  const handleOooNext = useCallback(() => {
    pickOooQuestion(oooLastCat)
  }, [pickOooQuestion, oooLastCat])

  // Auto-start OOO
  useEffect(() => {
    if (mode === 'ooo' && gameCountries.length > 0 && !oooQuestion) {
      pickOooQuestion(null)
    }
  }, [mode, gameCountries, oooQuestion, pickOooQuestion])

  // ── Missed features for end-states (show red on globe) ──────────────────
  const missingMissedFeatures  = missingMissedNames.map(n => countries.find(f => f.properties.NAME === n)).filter(Boolean)
  const spotlightMissedFeatures = spotlightMissedNames.map(n => countries.find(f => f.properties.NAME === n)).filter(Boolean)

  // ── Derive guesses + highlighted for globe ───────────────────────────────
  const missingGuesses = missingFound.map(name => {
    const f = countries.find(c => c.properties.NAME === name)
    return f ? { name, color: '#39ff14', feature: f } : null
  }).filter(Boolean)

  const globeGuesses = mode === 'name-all-currencies'
    ? currenciesFound.flatMap(c => c.countries.map(({ name, feature }) => ({ name, color: '#39ff14', feature })))
    : mode === 'name-all-languages'
    ? (() => {
        const seen = new Set()
        return languagesFound.flatMap(l => l.countries.map(({ name, feature }) => ({ name, color: '#39ff14', feature })))
          .filter(g => { if (seen.has(g.name)) return false; seen.add(g.name); return true })
      })()
    : mode === 'name-all-caps'
    ? capsFound.map(f => ({ name: f.name, color: '#39ff14', feature: f.feature }))
    : mode === 'spotlight'
    ? spotlightFoundNames.map(n => {
        const f = countries.find(c => c.properties.NAME === n)
        return f ? { name: n, color: '#39ff14', feature: f } : null
      }).filter(Boolean)
    : mode === 'missing'
    ? missingGuesses
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
          : mode === 'neighbor'
          ? [
              ...neighborFound.map(n => { const f = gameCountries.find(c => c.properties.NAME === n); return f ? { name: n, color: '#39ff14', feature: f } : null }).filter(Boolean),
              ...neighborMissed.map(n => { const f = gameCountries.find(c => c.properties.NAME === n); return f ? { name: n, color: '#ef4444', feature: f } : null }).filter(Boolean),
            ]
          : mode === 'area'
          ? areaPair.map((f, i) => ({ name: f.properties.NAME, color: i === 0 ? '#3b82f6' : '#f97316', feature: f }))
          : capHistory.map(h => ({
            name: h.country,
            color: h.correct ? '#39ff14' : '#ef4444',
            feature: gameCountries.find(c => c.properties.NAME === h.country),
          })).filter(g => g.feature)

  const globeHighlighted = mode === 'spotlight' ? spotlightCurrentFeature
    : mode === 'capital' ? capCurrent
    : mode === 'learn' ? learnSelected
    : mode === 'neighbor' ? neighborTarget
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
    <>
    <div className="app-shell">
      {/* ── Top bar ── */}
      <header className="topbar">
        <div className="topbar-brand" onClick={() => setPage('home')} style={{ cursor: 'pointer' }}>
          <span className="topbar-logo">🌐</span>
          <span className="topbar-name">Orbis</span>
          <span className="topbar-tagline">Geography Games</span>
        </div>
        <div className="topbar-auth">
          <a
            className="bug-report-btn"
            href="https://forms.gle/hDpMyhns9PD7ghdBA"
            target="_blank"
            rel="noopener noreferrer"
            title="Report a bug"
          >
            🐛 Report bug
          </a>
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
        </div>
      </header>

      {page === 'profile' && (
        <ProfilePage
          profile={profile}
          onBack={() => setPage('game')}
          onProfileUpdate={setProfile}
        />
      )}

      {page === 'home' && (
        <HomePage
          onEnter={() => setPage('game')}
          onSelectMode={(id) => { switchMode(id); setPage('game') }}
        />
      )}

      <div className="layout" style={{ display: page === 'profile' ? 'none' : 'flex' }}>

        {/* ── Left sidebar nav ── */}
        <nav className="sidebar" style={{ display: page === 'home' ? 'none' : undefined }}>
          {[
            { section: 'Guess' },
            { id: 'mystery',        icon: '🔍', label: 'Mystery Country' },
            { id: 'locate',         icon: '📍', label: 'Pinpoint Country' },
            { id: 'neighbor',       icon: '📌', label: 'Neighbors' },
            { id: 'ooo',            icon: '🤔', label: 'Odd One Out' },
            { id: 'missing',        icon: '🗺️', label: 'Blind Map' },
            { section: 'Name All' },
            { id: 'name-all',              icon: '🌍', label: 'Countries' },
            { id: 'name-all-caps',         icon: '🏙️', label: 'Capitals' },
            { id: 'name-all-currencies',   icon: '💰', label: 'Currencies' },
            { id: 'name-all-languages',    icon: '🗣️', label: 'Languages' },
            { id: 'mountains',             icon: '⛰️', label: 'Mountain Ranges' },
            { id: 'name-all-seas',         icon: '🌊', label: 'Seas' },
            { section: 'Quiz' },
            { id: 'capital',        icon: '🏛️', label: 'Capitals Quiz' },
            { id: 'seas',           icon: '🌊', label: 'Seas' },
            { id: 'cap-to-country', icon: '🗺️', label: 'Cap to Country' },
            { id: 'flag',           icon: '🚩', label: 'Flags' },
            { id: 'border-chain',   icon: '🔗', label: 'Borders' },
            { id: 'pop-order',      icon: '📊', label: 'Population' },
            { id: 'area',           icon: '📏', label: 'Bigger or Smaller' },
            { id: 'currency',       icon: '💰', label: 'Currency Quiz' },
            { id: 'language',       icon: '🗣️', label: 'Language Quiz' },
            { section: 'Explore' },
            { id: 'learn',          icon: '🎓', label: 'Learn' },
            { id: 'spotlight',      icon: '🔦', label: 'Solo Map' },
          ].map((item, i) =>
            item.section ? (
              <div key={`sec-${i}`} className="sidebar-section">{item.section}</div>
            ) : (
              <button
                key={item.id}
                className={`sidebar-btn ${mode === item.id ? 'active' : ''}`}
                onClick={() => switchMode(item.id)}
              >
                <span className="sidebar-icon">{item.icon}</span>
                <span className="sidebar-label">{item.label}</span>
              </button>
            )
          )}
        </nav>

        {/* ── Globe pane ── */}
        <div className="globe-pane">
          {mode === 'seas' ? (
            <HydroGlobe
              countries={countries}
              highlightedSea={seaCurrent}
              status={seaStatus}
            />
          ) : mode === 'mountains' ? (
            <MountainGlobe
              countries={countries}
              ranges={mountains}
              foundNames={new Set(mountainsFound.map(f => f.properties.NAME))}
              missedNames={new Set(mountainsMissed.map(f => f.properties.NAME))}
            />
          ) : mode === 'name-all-seas' ? (
            <NameAllSeaGlobe
              countries={countries}
              seas={seas}
              foundNames={new Set(seasAllFound.map(f => f.properties.NAME))}
              missedNames={new Set(seasAllMissed.map(f => f.properties.NAME))}
            />
          ) : (
            <>
              <Globe
                countries={countries}
                guesses={globeGuesses}
                mystery={mode === 'mystery' ? mystery : null}
                gameWon={mode === 'mystery' ? gameWon : false}
                highlighted={globeHighlighted}
                missed={mode === 'name-all' ? nameAllMissed : mode === 'name-all-caps' ? capsAllMissed : mode === 'name-all-currencies' ? currenciesMissed : mode === 'name-all-languages' ? languagesMissed : mode === 'missing' ? missingMissedFeatures : mode === 'spotlight' ? spotlightMissedFeatures : []}
                hiddenCountries={mode === 'missing' ? missingHidden : undefined}
                soloMode={mode === 'spotlight'}
                onGlobeClick={mode === 'locate' ? handleLocateClick : mode === 'learn' ? handleLearnClick : null}
                locateMarker={mode === 'locate' ? locateMarker : null}
                locateCorrectMarker={
                  mode === 'locate' && locateGuessed && locateResult && !locateResult.isHit && locateCurrent
                    ? (([lon, lat]) => ({ lon, lat }))(geoCentroid(locateCurrent))
                    : null
                }
                spinEnabled={globeSpin}
                lightMode={lightMode}
                flyToFeature={flyToFeature}
              />
              <Confetti active={(mode === 'mystery' && gameWon) || missingComplete} />
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

      <div className="panel" style={{ display: page === 'home' ? 'none' : undefined }}>
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
            onGiveUp={() => { setGaveUp(true); if (!practiceMode) setStats(recordGiveUp()) }}
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
        {mode === 'name-all-currencies' && (
          <NameAllCurrenciesPanel
            gameCountries={gameCountries}
            onFoundChange={setCurrenciesFound}
            onMissedChange={setCurrenciesMissed}
            onNewGame={() => { setCurrenciesFound([]); setCurrenciesMissed([]) }}
          />
        )}
        {mode === 'name-all-languages' && (
          <NameAllLanguagesPanel
            gameCountries={gameCountries}
            onFoundChange={setLanguagesFound}
            onMissedChange={setLanguagesMissed}
            onNewGame={() => { setLanguagesFound([]); setLanguagesMissed([]) }}
          />
        )}
        {mode === 'mountains' && (
          <NameAllMountainsPanel
            ranges={mountains}
            onFoundChange={setMountainsFound}
            onMissedChange={setMountainsMissed}
            onNewGame={() => { setMountainsFound([]); setMountainsMissed([]) }}
          />
        )}
        {mode === 'name-all-seas' && (
          <NameAllSeasPanel
            seas={seas}
            onFoundChange={setSeasAllFound}
            onMissedChange={setSeasAllMissed}
            onNewGame={() => { setSeasAllFound([]); setSeasAllMissed([]) }}
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
        {mode === 'area' && (
          <AreaPanel
            gameCountries={gameCountries}
            onPairChange={setAreaPair}
          />
        )}
        {mode === 'currency' && (
          <CurrencyPanel />
        )}
        {mode === 'language' && (
          <LanguagePanel />
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
            gameMode={locateMode}
            gameOver={locateGameOver}
            onModeSelect={(m) => handleLocateNewGame(m)}
            onNext={handleLocateNext}
            onNewGame={() => handleLocateNewGame(null)}
            onTimeout={() => setLocateGameOver(true)}
            onSprintExpired={() => setLocateExpired(true)}
          />
        )}
        {mode === 'neighbor' && (
          <NeighborPanel
            target={neighborTarget}
            neighbors={[...(adjacency[neighborTarget?.properties?.NAME] ?? new Set())]}
            found={neighborFound}
            missed={neighborMissed}
            done={neighborDone}
            score={neighborScore}
            history={neighborHistory}
            onGuess={handleNeighborGuess}
            onGiveUp={handleNeighborGiveUp}
            onNext={handleNeighborNext}
          />
        )}
        {mode === 'ooo' && (
          <OddOneOutPanel
            question={oooQuestion}
            answered={oooAnswered}
            chosen={oooChosen}
            score={oooScore}
            streak={oooStreak}
            history={oooHistory}
            onGuess={handleOooGuess}
            onNext={handleOooNext}
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
            onFoundChange={setMissingFound}
            onComplete={() => { setMissingComplete(true); setTimeout(() => setMissingComplete(false), 4000) }}
          />
        )}
      </div>
    </div>
    </div>
    <Analytics />
    </>
  )
}
