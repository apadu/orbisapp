const KEY = 'orbis_profile_stats'

const DEFAULT = {
  username: 'Explorer',
  joinedAt: null,

  mystery: {
    gamesPlayed: 0,
    wins: 0,
    bestStreak: 0,
    currentStreak: 0,
  },
  nameAll: {
    completions: 0,         // full world completions
    bestTimeWorld: null,    // seconds
    continentPBs: {},       // { Africa: secs, ... }
  },
  capitals: {
    gamesPlayed: 0,
    correct: 0,
    bestStreak: 0,
  },
  locate: {
    roundsPlayed: 0,
    highScore: 0,
    perfectRounds: 0,       // score >= 900
  },
  capToCountry: {
    gamesPlayed: 0,
    correct: 0,
    bestStreak: 0,
  },
  borderChain: {
    roundsPlayed: 0,
    highScore: 0,
    optimalSolves: 0,       // pts === 1000
  },
  popOrder: {
    roundsPlayed: 0,
    highScore: 0,
    perfectRounds: 0,
  },
  flag: {
    roundsPlayed: 0,
    correct: 0,
    bestStreak: 0,
    highScore: 0,
  },
}

export function loadProfile() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) {
      const fresh = { ...DEFAULT, joinedAt: Date.now() }
      localStorage.setItem(KEY, JSON.stringify(fresh))
      return fresh
    }
    return { ...DEFAULT, ...JSON.parse(raw) }
  } catch {
    return { ...DEFAULT, joinedAt: Date.now() }
  }
}

export function saveProfile(data) {
  try { localStorage.setItem(KEY, JSON.stringify(data)) } catch {}
}

export function updateProfile(updater) {
  const current = loadProfile()
  const next = updater(current)
  saveProfile(next)
  return next
}

// ── Per-mode recorders ───────────────────────────────────────────────────────

export function recordMysteryResult(won) {
  return updateProfile(p => ({
    ...p,
    mystery: {
      ...p.mystery,
      gamesPlayed: p.mystery.gamesPlayed + 1,
      wins: p.mystery.wins + (won ? 1 : 0),
      currentStreak: won ? p.mystery.currentStreak + 1 : 0,
      bestStreak: won
        ? Math.max(p.mystery.bestStreak, p.mystery.currentStreak + 1)
        : p.mystery.bestStreak,
    },
  }))
}

export function recordNameAllCompletion(seconds) {
  return updateProfile(p => ({
    ...p,
    nameAll: {
      ...p.nameAll,
      completions: p.nameAll.completions + 1,
      bestTimeWorld: p.nameAll.bestTimeWorld === null
        ? seconds
        : Math.min(p.nameAll.bestTimeWorld, seconds),
    },
  }))
}

export function recordContinentPB(continent, seconds) {
  return updateProfile(p => ({
    ...p,
    nameAll: {
      ...p.nameAll,
      continentPBs: {
        ...p.nameAll.continentPBs,
        [continent]: seconds,
      },
    },
  }))
}

export function recordCapitalResult(correct, streak) {
  return updateProfile(p => ({
    ...p,
    capitals: {
      gamesPlayed: p.capitals.gamesPlayed + 1,
      correct: p.capitals.correct + (correct ? 1 : 0),
      bestStreak: Math.max(p.capitals.bestStreak, streak),
    },
  }))
}

export function recordLocateRound(pts) {
  return updateProfile(p => ({
    ...p,
    locate: {
      roundsPlayed: p.locate.roundsPlayed + 1,
      highScore: Math.max(p.locate.highScore, pts),
      perfectRounds: p.locate.perfectRounds + (pts >= 900 ? 1 : 0),
    },
  }))
}

export function recordC2cResult(correct, streak) {
  return updateProfile(p => ({
    ...p,
    capToCountry: {
      gamesPlayed: p.capToCountry.gamesPlayed + 1,
      correct: p.capToCountry.correct + (correct ? 1 : 0),
      bestStreak: Math.max(p.capToCountry.bestStreak, streak),
    },
  }))
}

export function recordBorderChainRound(pts) {
  return updateProfile(p => ({
    ...p,
    borderChain: {
      roundsPlayed: p.borderChain.roundsPlayed + 1,
      highScore: Math.max(p.borderChain.highScore, pts),
      optimalSolves: p.borderChain.optimalSolves + (pts === 1000 ? 1 : 0),
    },
  }))
}

export function recordPopOrderRound(pts) {
  return updateProfile(p => ({
    ...p,
    popOrder: {
      roundsPlayed: p.popOrder.roundsPlayed + 1,
      highScore: Math.max(p.popOrder.highScore, pts),
      perfectRounds: p.popOrder.perfectRounds + (pts === 1000 ? 1 : 0),
    },
  }))
}

export function recordFlagRound(correct, streak, pts) {
  return updateProfile(p => ({
    ...p,
    flag: {
      roundsPlayed: p.flag.roundsPlayed + 1,
      correct: p.flag.correct + (correct ? 1 : 0),
      bestStreak: Math.max(p.flag.bestStreak, streak),
      highScore: Math.max(p.flag.highScore, pts),
    },
  }))
}

// ── Achievements ─────────────────────────────────────────────────────────────

export const ACHIEVEMENTS = [
  // Mystery
  { id: 'mystery_first',    icon: '🔍', label: 'First Solve',        desc: 'Solve your first mystery country',         check: p => p.mystery.wins >= 1 },
  { id: 'mystery_streak5',  icon: '🔥', label: 'Hot Streak',         desc: 'Win 5 mystery games in a row',             check: p => p.mystery.bestStreak >= 5 },
  { id: 'mystery_streak10', icon: '💥', label: 'Unstoppable',        desc: 'Win 10 mystery games in a row',            check: p => p.mystery.bestStreak >= 10 },
  { id: 'mystery_100',      icon: '🧭', label: 'Seasoned Explorer',  desc: 'Play 100 mystery games',                   check: p => p.mystery.gamesPlayed >= 100 },

  // Name All
  { id: 'nameall_first',    icon: '🌍', label: 'World Named',        desc: 'Name all countries in the world',          check: p => p.nameAll.completions >= 1 },
  { id: 'nameall_5',        icon: '🗺️', label: 'Cartographer',       desc: 'Complete All Countries 5 times',           check: p => p.nameAll.completions >= 5 },
  { id: 'continent_all',    icon: '🏁', label: 'Continental',        desc: 'Complete all 5 continent speedruns',       check: p => Object.keys(p.nameAll.continentPBs).length >= 5 },

  // Flags
  { id: 'flag_streak5',     icon: '🚩', label: 'Flag Fan',           desc: 'Get a 5-flag streak',                      check: p => p.flag.bestStreak >= 5 },
  { id: 'flag_streak10',    icon: '🎌', label: 'Vexillologist',      desc: 'Get a 10-flag streak',                     check: p => p.flag.bestStreak >= 10 },
  { id: 'flag_100',         icon: '🏳️', label: 'Flag Collector',     desc: 'Play 100 flag rounds',                     check: p => p.flag.roundsPlayed >= 100 },

  // Locate
  { id: 'locate_perfect',   icon: '📍', label: 'Bullseye',           desc: 'Score a perfect 1000 in Pinpoint Country',        check: p => p.locate.perfectRounds >= 1 },
  { id: 'locate_10perfect', icon: '🎯', label: 'Sharpshooter',       desc: 'Score 10 perfect rounds in Pinpoint Country',     check: p => p.locate.perfectRounds >= 10 },

  // Border Chain
  { id: 'border_optimal',   icon: '🔗', label: 'Optimal Route',      desc: 'Solve a Border Chain with optimal hops',   check: p => p.borderChain.optimalSolves >= 1 },
  { id: 'border_10optimal', icon: '⛓️', label: 'Chain Master',       desc: '10 optimal Border Chain solves',           check: p => p.borderChain.optimalSolves >= 10 },

  // Capitals
  { id: 'cap_streak10',     icon: '🏛️', label: 'Capital Expert',     desc: 'Get a 10-correct capitals streak',         check: p => p.capitals.bestStreak >= 10 },

  // Pop Order
  { id: 'pop_perfect',      icon: '📊', label: 'Demographer',        desc: 'Get a perfect score in Population Order',  check: p => p.popOrder.perfectRounds >= 1 },

  // Cap to Country
  { id: 'c2c_streak10',     icon: '🗺️', label: 'Capital Savant',     desc: '10-correct Cap→Country streak',            check: p => p.capToCountry.bestStreak >= 10 },

  // General
  { id: 'all_modes',        icon: '⭐', label: 'Jack of All Trades',  desc: 'Play every game mode at least once',
    check: p =>
      p.mystery.gamesPlayed >= 1 &&
      p.nameAll.completions >= 1 &&
      p.capitals.gamesPlayed >= 1 &&
      p.locate.roundsPlayed >= 1 &&
      p.capToCountry.gamesPlayed >= 1 &&
      p.borderChain.roundsPlayed >= 1 &&
      p.popOrder.roundsPlayed >= 1 &&
      p.flag.roundsPlayed >= 1
  },
]

export function getUnlockedAchievements(profile) {
  return ACHIEVEMENTS.filter(a => { try { return a.check(profile) } catch { return false } })
}
