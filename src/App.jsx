import { useState, useEffect, useCallback, useMemo, useRef, lazy, Suspense } from 'react'
import Globe, { FIXED_ELLIPSE_CENTERS } from './components/Globe'
import GamePanel from './components/GamePanel'
import CommandPalette, { PALETTE_SHORTCUT } from './components/CommandPalette'
import RailNav from './components/RailNav'
import MobileNav from './components/MobileNav'
import GameHud from './components/GameHud'
import { useIsMobile, useKeyboardInset, useTypingBar, SheetHandle, useSheet, snapHeights } from './components/MobileSheet'
import { GAME_GROUPS, gamesInGroup } from './utils/gameRegistry'
import { setSoundEnabled, playCorrect, playWrong, playWin } from './utils/sounds'
import StreakBadge from './components/StreakBadge'
import QuizHub from './components/QuizHub'
import { getDistanceInfo, computeAdjacency } from './utils/geoUtils'
import { resolveAlias } from './utils/aliases'
import { geoDistance, geoCentroid, geoContains, geoBounds } from 'd3-geo'
import { union } from '@turf/union'
import { featureCollection } from '@turf/helpers'
import { MOUNTAIN_RANGES } from './utils/mountainRanges'
import { WORLD_RIVERS } from './utils/rivers'
import { COUNTRY_INFO } from './utils/countryInfo'
import { pickDailyCountry, todayLabel } from './utils/daily'
import { getStats, recordWin, recordGiveUp } from './utils/stats'
import { useAuth } from './auth/AuthContext'
import { startSession, trackAnswer, finishGame, flushSessions, hasActiveGame } from './utils/results'
import { routeFor, parseRoute, INFO_PAGES } from './utils/router'
import { GAME_CATALOG } from './utils/gameCatalog'
import ConfirmLeave from './components/ConfirmLeave'
import { useListTracking } from './utils/useListTracking'
import GlobeFeedback from './components/GlobeFeedback'
import UserMenu from './components/UserMenu'
import RulesHint from './components/RulesHint'
import { TABLE_QUIZ_IDS, TABLE_QUIZZES } from './quizzes/tableQuizzes'
import { clearRules } from './utils/rulesStore'
import HomePage from './components/HomePage'
import Confetti from './components/Confetti'
import CompletionModal from './components/CompletionModal'
import './App.css'
import { Analytics } from "@vercel/analytics/react"
import { fetchData } from './utils/fetchData'
import { t } from './i18n'

// Code-split: each game / page is loaded the first time it's opened
const HydroGlobe = lazy(() => import('./components/HydroGlobe'))
const NameAllPanel = lazy(() => import('./components/NameAllPanel'))
const SeaPanel = lazy(() => import('./components/SeaPanel'))
const LocatePanel = lazy(() => import('./components/LocatePanel'))
const BorderChainPanel = lazy(() => import('./components/BorderChainPanel'))
const MissingPanel = lazy(() => import('./components/MissingPanel'))
const LearnPanel = lazy(() => import('./components/LearnPanel'))
const SpotlightPanel = lazy(() => import('./components/SpotlightPanel'))
const SilhouettePanel = lazy(() => import('./components/SilhouettePanel'))
const CapitalDropPanel = lazy(() => import('./components/CapitalDropPanel'))
const LandmarkDropPanel = lazy(() => import('./components/LandmarkDropPanel'))
const AntipodePanel = lazy(() => import('./components/AntipodePanel'))
const DistancePanel = lazy(() => import('./components/DistancePanel'))
const LineUpPanel = lazy(() => import('./components/LineUpPanel'))
const TimeZonesPanel = lazy(() => import('./components/TimeZonesPanel'))
const NameAllCapitalsPanel = lazy(() => import('./components/NameAllCapitalsPanel'))
const NameAllCurrenciesPanel = lazy(() => import('./components/NameAllCurrenciesPanel'))
const NameAllLanguagesPanel = lazy(() => import('./components/NameAllLanguagesPanel'))
const NameAllMountainsPanel = lazy(() => import('./components/NameAllMountainsPanel'))
const NameAllSeasPanel = lazy(() => import('./components/NameAllSeasPanel'))
const NameAllRiversPanel = lazy(() => import('./components/NameAllRiversPanel'))
const RiverGlobe = lazy(() => import('./components/RiverGlobe'))
const HistoryMapPanel = lazy(() => import('./components/HistoryMapPanel'))
const HistoryGlobe = lazy(() => import('./components/HistoryGlobe'))
const NeighborPanel = lazy(() => import('./components/NeighborPanel'))
const ConnectionsPanel = lazy(() => import('./components/ConnectionsPanel'))
const MountainGlobe = lazy(() => import('./components/MountainGlobe'))
const NameAllSeaGlobe = lazy(() => import('./components/NameAllSeaGlobe'))
const ProfilePage = lazy(() => import('./components/ProfilePage'))
const InfoPage = lazy(() => import('./components/InfoPage'))
const TableQuiz = lazy(() => import('./components/TableQuiz'))
const DailyQuiz = lazy(() => import('./components/DailyQuiz'))
const HigherLower = lazy(() => import('./components/HigherLower'))
const TrueFalse = lazy(() => import('./components/TrueFalse'))
const CountryWordle = lazy(() => import('./components/CountryWordle'))

// Map data: served from /data (see `npm run fetch-maps`), remote fallback in src/data/sources.js

const DROP_TYPES = new Set(['Dependency', 'Lease', 'Occupied Territory', 'Indeterminate', 'Disputed', 'Commonwealth'])
// Always keep these even if their TYPE would normally drop them
const KEEP_ALWAYS = new Set(['Kosovo', 'Israel', 'W. Sahara', 'Antarctica'])

// Merge these territories into the named target country (geometry union)
const MERGE_INTO = {}
// Rendered on the globe but not guessable in any game
const DISPLAY_ONLY = new Set(['Greenland', 'W. Sahara', 'Antarctica', 'N. Pole'])

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

// Quiz modes that render on the dedicated quiz page (no globe)
const QUIZ_MODES = new Set([
  'scramble', 'flag', 'capital', 'cap-to-country',
  'currency', 'language', 'area', 'pop-order', 'border-chain',
  'missing-vowels', 'flag-colors', 'connections', 'emoji-quiz', 'country-fact', 'endonyms',
  ...TABLE_QUIZ_IDS,
  'daily-quiz',
  'higher-lower', 'true-false', 'country-wordle',
])

// Globe games that drive the globe through one generic "extras" object (see onGlobe)
const EXTRA_GLOBE_MODES = new Set(['silhouette', 'capital-drop', 'landmark-drop', 'antipodes', 'distance', 'line-up', 'time-zones'])
const NO_EXTRAS = {}
const EMPTY_LIST = []

const QUIZ_LABELS = {
  scramble:         '🔤 Scramble',
  flag:             '🚩 Flags Quiz',
  capital:          '🏛️ Capitals Quiz',
  'cap-to-country': '🗺️ Cap → Country',
  currency:         '💰 Currency Quiz',
  language:         '🗣️ Language Quiz',
  area:             '📏 Bigger or Smaller',
  'pop-order':      '📊 Population Rank',
  'border-chain':   '🔗 Border Chain',
  'missing-vowels': '🔡 Missing Vowels',
  'flag-colors':    '🎨 Flag Colors',
  connections:      '🔗 Connections',
  'emoji-quiz':     '🌍 Country Emoji',
  'country-fact':   '📖 Country by Fact',
  endonyms:         '🗺️ Endonyms',
  'higher-lower':   '⚖️ Higher or Lower',
  'true-false':     '✅ True or False',
  'country-wordle': '🟩 Country Wordle',
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
  // Dark theme only
  useEffect(() => { document.documentElement.setAttribute('data-theme', 'dark'); try { localStorage.removeItem('orbis-theme') } catch {} }, [])

  // ── Sound ────────────────────────────────────────────────────────────────
  const [soundEnabled, setSoundEnabledState] = useState(() => localStorage.getItem('orbis-sound') !== 'off')

  useEffect(() => {
    setSoundEnabled(soundEnabled)
    localStorage.setItem('orbis-sound', soundEnabled ? 'on' : 'off')
  }, [soundEnabled])

  // ── Daily challenges ─────────────────────────────────────────────────────

  // ── App page & profile ───────────────────────────────────────────────────
  const [page,        setPage]        = useState('home') // 'home' | 'game' | 'quiz' | 'profile'
  const [drawerOpen,     setDrawerOpen]     = useState(false)
  const [completionStats,     setCompletionStats]     = useState(null)
  const auth = useAuth()
  const displayName = auth.profile?.username ?? (auth.user ? '…' : t('Guest'))
  const [prevPage, setPrevPage] = useState('home')
  const openProfile = () => { if (page !== 'profile') setPrevPage(page); setPage('profile') }

  // ── Shared game mode ─────────────────────────────────────────────────────
  const [mode, setMode] = useState('mystery')
  const [gameKey, setGameKey] = useState(0)   // bumps every time a game is (re)opened

  // ── Phones: the game panel is a draggable bottom sheet over the globe ────
  const isMobile = useIsMobile()
  const kbOpen = useKeyboardInset()
  const sheet = useSheet(`${mode}-${gameKey}`)
  const panelRef = useRef(null)
  const typingH = useTypingBar(isMobile && kbOpen, panelRef)   // keyboard up → panel shrinks to the input row

  // Close any open (endless) game session whenever the player switches game or page
  useEffect(() => () => flushSessions(), [mode, page])

  // ── Mystery Country state ────────────────────────────────────────────────
  const [mystery,        setMystery]       = useState(null)
  const [mysteryGuesses, setMysteryGuesses] = useState([])
  const [gameWon,        setGameWon]       = useState(false)
  const [stats,          setStats]         = useState(getStats)
  const [practiceMode,   setPracticeMode]  = useState(false)
  const [gaveUp,         setGaveUp]        = useState(false)
  const [flyToFeature,   setFlyToFeature]  = useState(null)
  const [paletteOpen,    setPaletteOpen]   = useState(false)
  const [globeExtra,     setGlobeExtra]    = useState(NO_EXTRAS) // { guesses, highlighted, missed, soloMode, overlay, flyTo, onClick }
  const onGlobe = useCallback((x) => setGlobeExtra(x ?? NO_EXTRAS), [])

  // ── Name All Countries state ─────────────────────────────────────────────
  const [found, setFound] = useState([]) // [{ name, feature }]

  // ── Capital Quiz state ───────────────────────────────────────────────────

  // ── Cap-to-Country state ─────────────────────────────────────────────────

  // ── Flag Quiz state ──────────────────────────────────────────────────────

  // ── Border Chain state ───────────────────────────────────────────────────
  const [bcStart,   setBcStart]   = useState(null)
  const [bcEnd,     setBcEnd]     = useState(null)
  const [bcScore,   setBcScore]   = useState(0)
  const [bcHistory, setBcHistory] = useState([])

  // ── Population Order state ───────────────────────────────────────────────

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

  // ── Globe spin: auto-on when idle (home page or learn mode), off during any game
  const globeSpin = (page === 'home' || page === 'quiz') || mode === 'learn'

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

  // ── Name All Rivers state ────────────────────────────────────────────────
  const rivers = WORLD_RIVERS.features                 // static — no fetch needed
  const [riversFound,  setRiversFound]  = useState([]) // found river features
  const [riversMissed, setRiversMissed] = useState([]) // missed river features

  // ── History Maps state ───────────────────────────────────────────────────
  const [histAllFeatures,  setHistAllFeatures]  = useState([]) // all world features from historical GeoJSON
  const [histEuroFeatures, setHistEuroFeatures] = useState([]) // filtered European sovereign states
  const [histFound,        setHistFound]        = useState([]) // found features
  const [histMissed,       setHistMissed]       = useState([]) // missed features

  // ── Neighbor Challenge state ─────────────────────────────────────────────
  const [neighborTarget,  setNeighborTarget]  = useState(null)
  const [neighborFound,   setNeighborFound]   = useState([])
  const [neighborMissed,  setNeighborMissed]  = useState([])
  const [neighborDone,    setNeighborDone]    = useState(false)
  const [neighborScore,   setNeighborScore]   = useState(0)
  const [neighborHistory, setNeighborHistory] = useState([])

  // ── Odd One Out state ────────────────────────────────────────────────────

  // ── Learn mode state ─────────────────────────────────────────────────────
  const [learnSelected, setLearnSelected] = useState(null)   // feature
  const [learnHistory,  setLearnHistory]  = useState([])     // [name, ...]

  // ── Bigger/Smaller (Area) state ──────────────────────────────────────────

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

  // ── Intro "game started" flags (suppress globe highlight until user clicks Start) ──
  const [seaGameStarted,      setSeaGameStarted]      = useState(false)
  const [neighborGameStarted, setNeighborGameStarted] = useState(false)
  const [seaStatus,   setSeaStatus]   = useState(null) // null | 'correct' | 'skipped'

  // ── Fetch GeoJSON ────────────────────────────────────────────────────────
  useEffect(() => {
    fetchData('countries')
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

        const game = features.filter(f => !DISPLAY_ONLY.has(f.properties.NAME))
        setCountries(features)
        setGameCountries(game)
        setAdjacency(computeAdjacency(features))
        pickMystery(game)
        setLoading(false)
      })
      .catch(e => {
        console.error(e)
        setError(t('Could not load country data. Check your internet connection.'))
        setLoading(false)
      })
  }, [])

  // ── Fetch marine polygons ────────────────────────────────────────────────
  useEffect(() => {
    fetchData('marine')
      .then(r => r.json())
      .then(data => {
        // Marine polys use lowercase property names (name, scalerank)
        // Normalize to uppercase NAME so the rest of the app is consistent
        const features = data.features
          .filter(f => {
            if (!f.geometry || !f.properties.name) return false
            if (f.properties.scalerank > 3) return false
            // Exclude the five major oceans — keep only seas, gulfs, bays, channels etc.
            const name = f.properties.name.toLowerCase()
            if (name.endsWith('ocean')) return false
            if (f.properties.featurecla === 'ocean') return false
            return true
          })
          .map(f => ({
            ...f,
            properties: { ...f.properties, NAME: f.properties.name },
          }))
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
      trackAnswer('seas', null, true, 10, name)
      playCorrect()
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
    trackAnswer('seas', null, false, 0, name)
    playWrong()
  }, [seaCurrent, seaAnswered])

  const handleSeaNewGame = useCallback(() => {
    startSession('seas')
    const fresh = new Set()
    setSeaUsed(fresh)
    setSeaScore({ correct: 0, total: 0 })
    setSeaHistory([])
    setSeaAnswered(false)
    setSeaStatus(null)
    setSeaCurrent(pickNextSea(fresh))
  }, [seas])


  // ── Fly to sea when it changes ───────────────────────────────────────────
  useEffect(() => {
    if (mode === 'seas' && seaCurrent) {
      setFlyToFeature({ ...seaCurrent, _ts: Date.now() })
    }
  }, [seaCurrent, mode])


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
    trackAnswer('border-chain', null, true, pts, chain?.join('>'))
  }, [])

  const handleBcNext = useCallback(() => pickBcPair(), [pickBcPair])
  const handleBcGiveUp = useCallback(() => {
    setBcHistory(h => [...h, { pts: 0, chain: [bcStart?.properties?.NAME], optimal: null }])
    trackAnswer('border-chain', null, false, 0, `${bcStart?.properties?.NAME}>${bcEnd?.properties?.NAME}`)
  }, [bcStart, bcEnd])

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


  const switchMode = useCallback((m) => {
    clearRules()
    setGameKey(k => k + 1)          // remount the game panel → a brand-new instance
    setGlobeExtra(NO_EXTRAS)
    setMode(m)
    setMysteryGuesses([])
    setGameWon(false)
    setFound([])
    if (m === 'mystery') pickMystery(gameCountries)
    if (m === 'border-chain') {
      setBcStart(null)
      setBcEnd(null)
      setBcScore(0)
      setBcHistory([])
    }
    if (m === 'pop-order') {
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
    }
    setMissingHidden(new Set())
    setMissingMissedNames([])
    setSpotlightCurrentFeature(null)
    setSpotlightFoundNames([])
    setSpotlightMissedNames([])
    setCapsFound([])
    setCapsAllMissed([])
    setCurrenciesFound([])
    setCurrenciesMissed([])
    setLanguagesFound([])
    setLanguagesMissed([])
    setMountainsFound([])
    setMountainsMissed([])
    setSeasAllFound([])
    setSeasAllMissed([])
    setRiversFound([])
    setRiversMissed([])
    setHistFound([])
    setHistMissed([])
    setNeighborTarget(null)
    setNeighborFound([])
    setNeighborMissed([])
    setNeighborDone(false)
    setNeighborScore(0)
    setNeighborHistory([])
    setNeighborGameStarted(false)
    setSeaGameStarted(false)
    setSeaHistory([])
    setSeaScore({ correct: 0, total: 0 })
    setMissingFound([])
    setMissingComplete(false)
    setLearnSelected(null)
    setLearnHistory([])
  }, [gameCountries])

  // ── Mystery: handle a guess ──────────────────────────────────────────────
  const handleMysteryGuess = useCallback((feature) => {
    if (gameWon || !mystery) return
    const name = feature.properties.NAME
    if (mysteryGuesses.some(g => g.name === name)) return

    setFlyToFeature({ ...feature, _ts: Date.now() })

    if (name === mystery.properties.NAME) {
      setMysteryGuesses(prev => [...prev, { name, km: 0, color: '#22c55e', angle: 0, isAdjacent: false, feature }])
      setGameWon(true)
      playWin()
      if (!practiceMode) {
        setStats(recordWin())
      }
      const guesses = mysteryGuesses.length + 1
      startSession('mystery')
      trackAnswer('mystery', name, true, Math.max(100, 1100 - guesses * 100))
      finishGame('mystery', { meta: { guesses, practice: practiceMode } })
    } else {
      const { km, color, angle } = getDistanceInfo(feature, mystery)
      const isAdjacent = !!(adjacency[mystery.properties.NAME]?.has(name))
      setMysteryGuesses(prev => [...prev, { name, km, color, angle, isAdjacent, feature }])
    }
  }, [mystery, mysteryGuesses, gameWon, adjacency, practiceMode])

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
  const [nameAllBlind,  setNameAllBlind]  = useState(false)

  const handleNameAllNewGame = useCallback(() => {
    setFound([])
    setNameAllMissed([])
  }, [])

  const handleNameAllMissed = useCallback((missedFeatures) => {
    setNameAllMissed(missedFeatures)
  }, [])

  // ── Capital Quiz handlers ────────────────────────────────────────────────



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

    // 2. geoContains — with bbox pre-filter to block wrongly-wound polygons
    //    from claiming clicks thousands of km from their actual territory
    if (!hit) {
      hit = countries.find(f => {
        try {
          const [[w, s], [e, n]] = geoBounds(f)
          if (lon < w - 0.5 || lon > e + 0.5 || lat < s - 0.5 || lat > n + 0.5) return false
          return geoContains(f, [lon, lat])
        } catch { return false }
      })
    }

    // 3. Nearest centroid within 2°-padded bbox — catches multi-island nations
    //    (Bahamas, etc.) and small islands where geoContains fails.
    //    Using nearest-centroid instead of first-match avoids Bahamas shadowing Cuba.
    if (!hit) {
      let best = null, bestDist = Infinity
      for (const f of countries) {
        try {
          const [[w, s], [e, n]] = geoBounds(f)
          const p = 2.0
          if (lon < w - p || lon > e + p || lat < s - p || lat > n + p) continue
          const [clon, clat] = geoCentroid(f)
          const d = Math.hypot(lon - clon, lat - clat)
          if (d < bestDist) { bestDist = d; best = f }
        } catch { /* skip */ }
      }
      hit = best
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
    // Step 2: geoContains with bbox pre-filter
    if (!clicked) {
      clicked = countries.find(f => {
        try {
          const [[w, s], [e, n]] = geoBounds(f)
          if (lon < w - 0.5 || lon > e + 0.5 || lat < s - 0.5 || lat > n + 0.5) return false
          return geoContains(f, [lon, lat])
        } catch { return false }
      })
    }
    // Step 3: nearest centroid within 2°-padded bbox
    // (nearest-centroid avoids Bahamas/hull countries shadowing Cuba etc.)
    if (!clicked) {
      let best = null, bestDist = Infinity
      for (const f of countries) {
        try {
          const [[w, s], [e, n]] = geoBounds(f)
          const p = 2.0
          if (lon < w - p || lon > e + p || lat < s - p || lat > n + p) continue
          const [clon, clat] = geoCentroid(f)
          const d = Math.hypot(lon - clon, lat - clat)
          if (d < bestDist) { bestDist = d; best = f }
        } catch { /* skip */ }
      }
      clicked = best
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
    trackAnswer('locate', locateCurrent.properties.NAME, isHit, pts)

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
    startSession('locate')
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
    trackAnswer('neighbor', canonical, true, 100)

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
    for (const n of missed) trackAnswer('neighbor', n, false, 0, null, { silent: true })
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

  // Pick neighbor target when entering the mode (pre-loads so the Start button is enabled)
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


  // ── Leaving a game in progress needs a confirmation ──────────────────────
  const [pendingNav, setPendingNav] = useState(null)        // () => void, run on "Leave"
  const guard = useCallback((fn) => {
    if (hasActiveGame()) setPendingNav(() => fn)
    else fn()
  }, [])

  // Show a route (no guard) — used by openGame and by the browser's Back/Forward
  const applyRoute = useCallback((r) => {
    if (r.page === 'home') { setPage('home'); return }
    if (r.page === 'profile') { setPage('profile'); return }
    if (INFO_PAGES.has(r.page)) { setPage(r.page); return }
    if (r.mode === 'quiz-hub') { setMode('quiz-hub'); setPage('quiz'); return }
    switchMode(r.mode)
    setPage(r.page)
  }, [switchMode])

  // Open any game / page by id (used by the rail, the search palette, Home…)
  const openGame = useCallback((id) => guard(() => {
    applyRoute(id === 'quiz-hub' ? { page: 'quiz', mode: 'quiz-hub' } : { page: QUIZ_MODES.has(id) ? 'quiz' : 'game', mode: id })
  }), [guard, applyRoute])
  const goHome = useCallback(() => guard(() => setPage('home')), [guard])
  const openInfo = useCallback((doc) => guard(() => setPage(doc)), [guard])
  // Back from the profile: reopen the previous screen as a fresh game
  const backFromProfile = () => (prevPage === 'game' || prevPage === 'quiz') ? applyRoute({ page: prevPage, mode }) : setPage(prevPage)

  // ── URL ⇄ screen (Back / Forward / refresh / shared links) ───────────────
  const routeInit = useRef(false)
  const fromPop   = useRef(false)
  const here      = useRef({ page, mode })
  here.current = { page, mode }
  const routeOpts = useMemo(() => ({
    quizModes: QUIZ_MODES,
    globeModes: new Set([...Object.keys(GAME_CATALOG).filter(m => !QUIZ_MODES.has(m)), 'learn']),
  }), [])

  useEffect(() => {
    if (loading) return
    // First load: open whatever the address points to
    if (!routeInit.current) {
      routeInit.current = true
      const r = parseRoute(window.location.pathname, routeOpts)
      const want = r ? routeFor(r.page, r.mode, QUIZ_MODES) : '/'
      if (want !== routeFor(page, mode, QUIZ_MODES)) {
        fromPop.current = true
        if (r) applyRoute(r); else window.history.replaceState(null, '', '/')
        return
      }
    }
    const path = routeFor(page, mode, QUIZ_MODES)
    // Tab title per screen: "Capitals · Orbis"
    const name = page === 'home' ? null
      : page === 'profile' ? t('Profile')
      : page === 'privacy' ? t('Privacy Policy') : page === 'terms' ? t('Terms of Use') : page === 'credits' ? t('Credits')
      : mode === 'quiz-hub' ? t('Quiz Hub') : mode === 'learn' ? t('Learn')
      : GAME_CATALOG[mode]?.label ?? null
    document.title = name ? `${name} · Orbis` : t('Orbis — Geography Games on a 3D Globe')
    if (window.location.pathname !== path) {
      if (fromPop.current) window.history.replaceState(null, '', path)
      else window.history.pushState(null, '', path)
    }
    fromPop.current = false
  }, [loading, page, mode, applyRoute, routeOpts])

  // Browser Back / Forward
  useEffect(() => {
    const onPop = () => {
      const r = parseRoute(window.location.pathname, routeOpts) ?? { page: 'home' }
      const go = () => { fromPop.current = true; applyRoute(r) }
      if (hasActiveGame()) {
        // Put the current screen back in the address bar until the player decides
        window.history.pushState(null, '', routeFor(here.current.page, here.current.mode, QUIZ_MODES))
        setPendingNav(() => go)
      } else go()
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [applyRoute, routeOpts])

  // Closing / reloading the tab mid-game → the browser's own "Leave site?" prompt
  useEffect(() => {
    const onUnload = (e) => { if (hasActiveGame()) { e.preventDefault(); e.returnValue = '' } }
    window.addEventListener('beforeunload', onUnload)
    return () => window.removeEventListener('beforeunload', onUnload)
  }, [])

  // Ctrl/⌘ K → search palette
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setPaletteOpen(o => !o) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const gameCountryNames = useMemo(() => gameCountries.map(f => f.properties.NAME), [gameCountries])
  const playQuizFromDaily = useCallback((id) => switchMode(id), [switchMode])

  // ── Result tracking for "name them all" games ───────────────────────────
  const names   = (arr) => arr.map(f => f.properties?.NAME ?? f.name)
  const nameAllKeys   = useMemo(() => found.map(f => f.name), [found])
  const nameAllMissK  = useMemo(() => names(nameAllMissed), [nameAllMissed])
  const capsKeys      = useMemo(() => capsFound.map(f => f.name), [capsFound])
  const capsMissK     = useMemo(() => names(capsAllMissed), [capsAllMissed])
  const currKeys      = useMemo(() => currenciesFound.map(c => c.code ?? c.currencyName), [currenciesFound])
  const currMissK     = useMemo(() => names(currenciesMissed), [currenciesMissed])
  const langKeys      = useMemo(() => languagesFound.map(l => l.language), [languagesFound])
  const langMissK     = useMemo(() => names(languagesMissed), [languagesMissed])
  const mtnKeys       = useMemo(() => names(mountainsFound), [mountainsFound])
  const mtnMissK      = useMemo(() => names(mountainsMissed), [mountainsMissed])
  const seaAllKeys    = useMemo(() => names(seasAllFound), [seasAllFound])
  const seaAllMissK   = useMemo(() => names(seasAllMissed), [seasAllMissed])
  const riverKeys     = useMemo(() => names(riversFound), [riversFound])
  const riverMissK    = useMemo(() => names(riversMissed), [riversMissed])
  const histKeys      = useMemo(() => names(histFound), [histFound])
  const histMissK     = useMemo(() => names(histMissed), [histMissed])
  const allDone       = !!completionStats
  const inGame        = page === 'game'

  useListTracking({ mode: 'name-all',            active: inGame && mode === 'name-all',            found: nameAllKeys, missed: nameAllMissK, complete: allDone })
  useListTracking({ mode: 'name-all-caps',       active: inGame && mode === 'name-all-caps',       found: capsKeys,    missed: capsMissK,    complete: allDone })
  useListTracking({ mode: 'name-all-currencies', active: inGame && mode === 'name-all-currencies', found: currKeys,    missed: currMissK,    complete: allDone, countryKeyed: false })
  useListTracking({ mode: 'name-all-languages',  active: inGame && mode === 'name-all-languages',  found: langKeys,    missed: langMissK,    complete: allDone, countryKeyed: false })
  useListTracking({ mode: 'mountains',           active: inGame && mode === 'mountains',           found: mtnKeys,     missed: mtnMissK,     complete: allDone, countryKeyed: false })
  useListTracking({ mode: 'name-all-seas',       active: inGame && mode === 'name-all-seas',       found: seaAllKeys,  missed: seaAllMissK,  complete: allDone, countryKeyed: false })
  useListTracking({ mode: 'name-all-rivers',     active: inGame && mode === 'name-all-rivers',     found: riverKeys,   missed: riverMissK,   complete: allDone, countryKeyed: false })
  useListTracking({ mode: 'history-maps',        active: inGame && mode === 'history-maps',        found: histKeys,    missed: histMissK,    complete: allDone, countryKeyed: false })
  useListTracking({ mode: 'spotlight',           active: inGame && mode === 'spotlight',           found: spotlightFoundNames, missed: spotlightMissedNames })
  useListTracking({ mode: 'missing',             active: inGame && mode === 'missing',             found: missingFound,        missed: missingMissedNames,  complete: missingComplete })

  // Locate: sudden-death / sprint end
  useEffect(() => {
    if (mode === 'locate' && (locateGameOver || locateExpired)) finishGame('locate', { meta: { variant: locateMode } })
  }, [locateGameOver, locateExpired]) // eslint-disable-line react-hooks/exhaustive-deps

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
        : mode === 'border-chain' && bcStart && bcEnd
          ? [
              { name: bcStart.properties.NAME, color: '#39ff14', feature: bcStart },
              { name: bcEnd.properties.NAME,   color: '#f97316', feature: bcEnd },
            ]
          : mode === 'neighbor'
          ? [
              ...neighborFound.map(n => { const f = gameCountries.find(c => c.properties.NAME === n); return f ? { name: n, color: '#39ff14', feature: f } : null }).filter(Boolean),
              ...neighborMissed.map(n => { const f = gameCountries.find(c => c.properties.NAME === n); return f ? { name: n, color: '#ef4444', feature: f } : null }).filter(Boolean),
            ]
          : []

  const globeHighlighted = mode === 'spotlight' ? spotlightCurrentFeature
    : mode === 'learn' ? learnSelected
    : mode === 'neighbor' ? (neighborGameStarted ? neighborTarget : null)
    : null

  // Extra-mode globe: only re-fly when the target actually changes
  const extraMode = EXTRA_GLOBE_MODES.has(mode) && page === 'game'
  const extraFlyKey = JSON.stringify(globeExtra.flyTo ?? null)
  const extraFlyTo = useMemo(() => globeExtra.flyTo ?? null, [extraFlyKey]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Render ───────────────────────────────────────────────────────────────
  if (loading) return (
    <div className="loading-screen">
      <div className="loading-globe">🌐</div>
      <h1 className="loading-title">{t('Orbis')}</h1>
      <div className="loading-spinner-wrap"><div className="spinner" /></div>
      <p className="loading-text">{t('Loading the globe…')}</p>
    </div>
  )
  if (error) return (
    <div className="error-screen">
      <div className="error-icon">⚠️</div>
      <p className="error-msg">{error}</p>
      <button className="error-retry-btn" onClick={() => window.location.reload()}>{t('↺ Retry')}</button>
    </div>
  )

  return (
    <>
    <div
      className={`app-shell page-${page}${isMobile ? ` is-mobile sheet-${sheet.snap}` : ''}${isMobile && typingH ? ' kb-typing' : ''}`}
      style={isMobile && typeof window !== 'undefined' ? { '--sheet-h': `${typingH ?? snapHeights()[sheet.snap]}px` } : undefined}
    >
      {/* ── Top bar ── */}
      <header className="topbar">
        <div className="topbar-left">
          <button className="mobile-menu-btn" onClick={() => setDrawerOpen(true)} aria-label={t('Open menu')}>
            ☰
          </button>
          <div className="topbar-brand" onClick={goHome} style={{ cursor: 'pointer' }}>
            <span className="topbar-logo">🌐</span>
            <span className="topbar-name">{t('Orbis')}</span>
            <span className="topbar-tagline">{t('Geography Games')}</span>
          </div>
        </div>
        <div className="topbar-auth">
          <button className="topbar-search" onClick={() => setPaletteOpen(true)} title={t('Search games')}>
            <span>🔎</span><span className="topbar-search-text">{t('Search games')}</span><kbd>{PALETTE_SHORTCUT}</kbd>
          </button>
          <StreakBadge
            onSelectMode={openGame}
          />
          <UserMenu
            displayName={displayName}
            onOpenInfo={openInfo}
            onProfile={() => page === 'profile' ? backFromProfile() : guard(openProfile)}
            soundEnabled={soundEnabled}
            onToggleSound={() => setSoundEnabledState(x => !x)}
          />
        </div>
      </header>

      {INFO_PAGES.has(page) && (
        <Suspense fallback={null}><InfoPage doc={page} onBack={() => setPage('home')} onOpen={openInfo} /></Suspense>
      )}

      {page === 'profile' && (
        <Suspense fallback={null}><ProfilePage
          countries={countries}
          onBack={backFromProfile}
          onPlay={openGame}
        /></Suspense>
      )}

      {page === 'home' && (
        <HomePage
          onEnter={() => openGame(mode === 'quiz-hub' || QUIZ_MODES.has(mode) ? 'mystery' : mode)}
          onSelectMode={openGame}
          onEnterQuiz={() => { setMode('quiz-hub'); setPage('quiz') }}
          onProfile={openProfile}
          countryNames={gameCountryNames}
          onDailyQuiz={() => { switchMode('daily-quiz'); setPage('quiz') }}
          onOpenInfo={openInfo}
        />
      )}

      {/* ── Quiz page (no globe) ── */}
      {page === 'quiz' && (
        <div className="quiz-shell">
          <div className="quiz-nav-bar">
            <button className="quiz-nav-back" onClick={goHome}>
              {t('← Home')}
            </button>
            {QUIZ_MODES.has(mode) && (
              <button className="quiz-nav-hub" onClick={() => guard(() => setMode('quiz-hub'))}>
                {t('← All Quizzes')}
              </button>
            )}
            <span className="quiz-nav-title">
              {mode === 'daily-quiz' ? t('📅 Daily Quiz') : TABLE_QUIZ_IDS.has(mode) ? `${TABLE_QUIZZES[mode].icon} ${TABLE_QUIZZES[mode].title}` : QUIZ_MODES.has(mode) ? t(QUIZ_LABELS[mode]) : t('🎯 Quiz Hub')}
            </span>
            {QUIZ_MODES.has(mode) && !TABLE_QUIZ_IDS.has(mode) && <RulesHint className="rules-hint-quiz" />}
          </div>

          <div className="quiz-content"><Suspense fallback={null}>
            {!QUIZ_MODES.has(mode) ? (
              <QuizHub onSelect={openGame} countryNames={gameCountryNames} />
            ) : mode === 'daily-quiz' ? (
              <DailyQuiz countryNames={gameCountryNames} onPlayQuiz={playQuizFromDaily} />
            ) : mode === 'higher-lower' ? (
              <HigherLower key={mode} countryNames={gameCountryNames} />
            ) : mode === 'true-false' ? (
              <TrueFalse key={mode} countryNames={gameCountryNames} />
            ) : mode === 'country-wordle' ? (
              <CountryWordle key={mode} countryNames={gameCountryNames} />
            ) : TABLE_QUIZ_IDS.has(mode) ? (
              <TableQuiz key={mode} quizId={mode} countryNames={gameCountryNames} />
            ) : (
              <div className="quiz-panel-wrap">
                <div className="panel quiz-panel-inner">
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
                  {mode === 'connections' && (
                    <ConnectionsPanel />
                  )}
                </div>
              </div>
            )}
          </Suspense></div>
        </div>
      )}

      {/* ── Mobile drawer ── */}
      {drawerOpen && (
        <div className="mobile-drawer-backdrop" onClick={() => setDrawerOpen(false)}>
          <nav className="mobile-drawer" onClick={e => e.stopPropagation()}>
            <div className="drawer-header">
              <span className="drawer-title">{t('🌐 Orbis')}</span>
              <button className="drawer-close" onClick={() => setDrawerOpen(false)}>✕</button>
            </div>
            <div className="drawer-scroll">
              <button className="sidebar-btn" onClick={() => { setDrawerOpen(false); setPaletteOpen(true) }}>
                <span className="sidebar-icon">🔎</span><span className="sidebar-label">{t('Search games')}</span>
              </button>
              {GAME_GROUPS.map(g => (
                <div key={g.id}>
                  <div className="sidebar-section">{g.icon} {g.label}</div>
                  {gamesInGroup(g.id).map(item => (
                    <button
                      key={item.id}
                      className={`sidebar-btn ${mode === item.id ? 'active' : ''}`}
                      onClick={() => { setDrawerOpen(false); openGame(item.id) }}
                    >
                      <span className="sidebar-icon">{item.icon}</span>
                      <span className="sidebar-label">{item.label}</span>
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </nav>
        </div>
      )}

      <div className="layout" style={{ display: (page === 'game' || page === 'home') ? 'flex' : 'none' }}>

        {/* ── Left rail: categories + flyouts ── */}
        {page === 'game' && (
          <RailNav mode={mode} onOpen={openGame} onSearch={() => setPaletteOpen(true)} onHome={goHome} />
        )}

        {/* ── Globe pane ── */}
        <div className="globe-pane"><Suspense fallback={null}>
          {page !== 'game' ? (
            // Home / other pages: a clean decorative globe — no leftovers from the last game
            <Globe
              countries={countries}
              guesses={EMPTY_LIST}
              missed={EMPTY_LIST}
              spinEnabled={globeSpin}
            />
          ) : mode === 'seas' ? (
            <HydroGlobe
              countries={countries}
              highlightedSea={seaGameStarted ? seaCurrent : null}
              status={seaGameStarted ? seaStatus : null}
              spinEnabled={false}
            />
          ) : mode === 'mountains' ? (
            <MountainGlobe
              countries={countries}
              ranges={mountains}
              foundNames={new Set(mountainsFound.map(f => f.properties.NAME))}
              missedNames={new Set(mountainsMissed.map(f => f.properties.NAME))}
              spinEnabled={false}
            />
          ) : mode === 'name-all-seas' ? (
            <NameAllSeaGlobe
              countries={countries}
              seas={seas}
              foundNames={new Set(seasAllFound.map(f => f.properties.NAME))}
              missedNames={new Set(seasAllMissed.map(f => f.properties.NAME))}
              spinEnabled={false}
            />
          ) : mode === 'name-all-rivers' ? (
            <RiverGlobe
              countries={countries}
              rivers={rivers}
              foundNames={new Set(riversFound.map(f => f.properties.NAME))}
              missedNames={new Set(riversMissed.map(f => f.properties.NAME))}
              spinEnabled={false}
            />
          ) : mode === 'history-maps' ? (
            <HistoryGlobe
              features={histAllFeatures}
              targetNames={new Set(histEuroFeatures.map(f => f.properties.NAME))}
              foundNames={new Set(histFound.map(f => f.properties.NAME))}
              missedNames={new Set(histMissed.map(f => f.properties.NAME))}
              spinEnabled={false}
            />
          ) : (
            extraMode ? (
            <Globe
                countries={countries}
                guesses={globeExtra.guesses ?? EMPTY_LIST}
                highlighted={globeExtra.highlighted ?? null}
                missed={globeExtra.missed ?? EMPTY_LIST}
                soloMode={!!globeExtra.soloMode}
                onGlobeClick={globeExtra.onClick ?? null}
                overlay={globeExtra.overlay ?? null}
                flyToPoint={extraFlyTo}
                spinEnabled={false}
              />
            ) : (
            <Globe
                countries={(mode === 'spotlight') ? gameCountries : countries}
                guesses={globeGuesses}
                mystery={mode === 'mystery' ? mystery : null}
                gameWon={mode === 'mystery' ? gameWon : false}
                highlighted={globeHighlighted}
                missed={mode === 'name-all' ? nameAllMissed : mode === 'name-all-caps' ? capsAllMissed : mode === 'name-all-currencies' ? currenciesMissed : mode === 'name-all-languages' ? languagesMissed : mode === 'missing' ? missingMissedFeatures : mode === 'spotlight' ? spotlightMissedFeatures : []}
                hiddenCountries={mode === 'missing' ? missingHidden : undefined}
                soloMode={mode === 'spotlight' || (mode === 'name-all' && nameAllBlind)}
                onGlobeClick={mode === 'locate' ? handleLocateClick : mode === 'learn' ? handleLearnClick : null}
                confirmTap={mode !== 'learn'}
                locateMarker={mode === 'locate' ? locateMarker : null}
                locateCorrectMarker={
                  mode === 'locate' && locateGuessed && locateResult && !locateResult.isHit && locateCurrent
                    ? (([lon, lat]) => ({ lon, lat }))(geoCentroid(locateCurrent))
                    : null
                }
                spinEnabled={globeSpin}
                flyToFeature={flyToFeature}
              />
            )
          )}
          {page === 'game' && <GlobeFeedback />}
          {page === 'game' && isMobile && <GameHud />}
        </Suspense></div>

      {page !== 'home' && <RulesHint className="rules-hint-floating" />}
      <div key={`${mode}-${gameKey}`} ref={panelRef} onFocus={sheet.onFocusIn} className="panel panel-float" style={{ display: page === 'game' ? undefined : 'none' }}>
        {isMobile && page === 'game' && <SheetHandle snap={sheet.snap} onSnap={sheet.setSnap} panelRef={panelRef} />}
        <Suspense fallback={<div className="panel-skeleton"><span /><span /><span /></div>}>
        {page === 'game' && <>
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
            onGiveUp={() => {
              setGaveUp(true)
              if (!practiceMode) setStats(recordGiveUp())
              if (mystery) {
                startSession('mystery')
                trackAnswer('mystery', mystery.properties.NAME, false)
                finishGame('mystery', { meta: { guesses: mysteryGuesses.length, practice: practiceMode, gaveUp: true } })
              }
            }}
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
            blindMode={nameAllBlind}
            onBlindChange={setNameAllBlind}
            onComplete={setCompletionStats}
          />
        )}
        {mode === 'name-all-caps' && (
          <NameAllCapitalsPanel
            gameCountries={gameCountries}
            countryInfo={COUNTRY_INFO}
            onFoundChange={setCapsFound}
            onMissedChange={setCapsAllMissed}
            onNewGame={() => { setCapsFound([]); setCapsAllMissed([]) }}
            onComplete={setCompletionStats}
          />
        )}
        {mode === 'name-all-currencies' && (
          <NameAllCurrenciesPanel
            gameCountries={gameCountries}
            onFoundChange={setCurrenciesFound}
            onMissedChange={setCurrenciesMissed}
            onNewGame={() => { setCurrenciesFound([]); setCurrenciesMissed([]) }}
            onComplete={setCompletionStats}
          />
        )}
        {mode === 'name-all-languages' && (
          <NameAllLanguagesPanel
            gameCountries={gameCountries}
            onFoundChange={setLanguagesFound}
            onMissedChange={setLanguagesMissed}
            onNewGame={() => { setLanguagesFound([]); setLanguagesMissed([]) }}
            onComplete={setCompletionStats}
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
            onComplete={setCompletionStats}
          />
        )}
        {mode === 'name-all-rivers' && (
          <NameAllRiversPanel
            rivers={rivers}
            onFoundChange={setRiversFound}
            onMissedChange={setRiversMissed}
            onNewGame={() => { setRiversFound([]); setRiversMissed([]) }}
            onComplete={setCompletionStats}
          />
        )}
        {mode === 'history-maps' && (
          <HistoryMapPanel
            onFeaturesChange={(all, euro) => { setHistAllFeatures(all); setHistEuroFeatures(euro) }}
            onFoundChange={setHistFound}
            onMissedChange={setHistMissed}
            onNewGame={() => { setHistFound([]); setHistMissed([]) }}
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
            onGameStart={() => setNeighborGameStarted(true)}
            onGiveUp={handleNeighborGiveUp}
            onNext={handleNeighborNext}
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
            onGameStart={() => setSeaGameStarted(true)}
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
        {mode === 'silhouette'   && <SilhouettePanel  gameCountries={gameCountries} onGlobe={onGlobe} />}
        {mode === 'capital-drop' && <CapitalDropPanel gameCountries={gameCountries} onGlobe={onGlobe} />}
        {mode === 'landmark-drop' && <LandmarkDropPanel onGlobe={onGlobe} />}
        {mode === 'antipodes'    && <AntipodePanel onGlobe={onGlobe} />}
        {mode === 'distance'     && <DistancePanel onGlobe={onGlobe} />}
        {mode === 'line-up'      && <LineUpPanel      gameCountries={gameCountries} onGlobe={onGlobe} />}
        {mode === 'time-zones'   && <TimeZonesPanel   gameCountries={gameCountries} onGlobe={onGlobe} />}
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
      </>}
        </Suspense>
      </div>
    </div>
    </div>
    <Confetti active={(mode === 'mystery' && gameWon) || missingComplete || !!completionStats} />
    <Analytics />
    {/* hidden while playing (globe game or a quiz) — the game needs the bottom of the screen */}
    {isMobile && page !== 'game' && !(page === 'quiz' && mode !== 'quiz-hub') && (
      <MobileNav
        page={page} mode={mode}
        onHome={goHome}
        onGames={() => setDrawerOpen(true)}
        onSearch={() => setPaletteOpen(true)}
        onDaily={() => openGame('daily-quiz')}
        onProfile={() => page === 'profile' ? undefined : guard(openProfile)}
      />
    )}
    <ConfirmLeave open={!!pendingNav} onStay={() => setPendingNav(null)} onLeave={() => { const fn = pendingNav; setPendingNav(null); fn?.() }} />
    <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} onSelect={openGame} />
    {completionStats && (
      <CompletionModal
        stats={completionStats}
        onClose={() => setCompletionStats(null)}
        onPlayAgain={() => setCompletionStats(null)}
      />
    )}
    </>
  )
}
