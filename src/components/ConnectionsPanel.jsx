import { useState, useCallback, useMemo } from 'react'
import GameIntro from './GameIntro'
import { CONNECTIONS_ROUNDS, DIFF_COLORS } from '../utils/connectionsData'
import { playCorrect, playWrong, playWin } from '../utils/sounds'

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function ConnectionsPanel() {
  const [started,    setStarted]    = useState(false)
  const [roundIdx,   setRoundIdx]   = useState(0)
  const [tiles,      setTiles]      = useState([])       // [{ country, solved, diffIdx }]
  const [selected,   setSelected]   = useState([])       // up to 4 country names
  const [solvedCats, setSolvedCats] = useState([])       // [{label, difficulty, countries}]
  const [mistakes,   setMistakes]   = useState(0)
  const [oneAway,    setOneAway]    = useState(false)
  const [shake,      setShake]      = useState(false)
  const [done,       setDone]       = useState(false)

  const round = CONNECTIONS_ROUNDS[roundIdx % CONNECTIONS_ROUNDS.length]

  const buildTiles = useCallback((r) => {
    const all = r.categories.flatMap(cat =>
      cat.countries.map(country => ({ country, solved: false, diffIdx: cat.difficulty }))
    )
    return shuffle(all)
  }, [])

  const startGame = useCallback((rIdx = 0) => {
    const r = CONNECTIONS_ROUNDS[rIdx % CONNECTIONS_ROUNDS.length]
    setRoundIdx(rIdx)
    setTiles(buildTiles(r))
    setSelected([])
    setSolvedCats([])
    setMistakes(0)
    setOneAway(false)
    setShake(false)
    setDone(false)
  }, [buildTiles])

  const toggleSelect = useCallback((country) => {
    if (selected.includes(country)) {
      setSelected(s => s.filter(c => c !== country))
    } else if (selected.length < 4) {
      setSelected(s => [...s, country])
    }
    setOneAway(false)
  }, [selected])

  const submit = useCallback(() => {
    if (selected.length !== 4) return
    const r = CONNECTIONS_ROUNDS[roundIdx % CONNECTIONS_ROUNDS.length]

    // Check if selection exactly matches a category
    const match = r.categories.find(cat => {
      const set = new Set(cat.countries)
      return selected.length === 4 && selected.every(c => set.has(c))
    })

    if (match) {
      // Correct!
      setSolvedCats(sc => [...sc, match])
      setTiles(t => t.map(tile =>
        match.countries.includes(tile.country) ? { ...tile, solved: true } : tile
      ))
      setSelected([])
      playCorrect()

      // Check if all 4 categories are solved
      if (solvedCats.length + 1 === 4) {
        setDone(true)
        playWin()
      }
      setOneAway(false)
    } else {
      // Wrong — check for one-away
      const isOneAway = r.categories.some(cat => {
        const hits = selected.filter(c => cat.countries.includes(c)).length
        return hits === 3
      })
      setOneAway(isOneAway)
      setMistakes(m => m + 1)
      setShake(true)
      setTimeout(() => setShake(false), 600)
      playWrong()
    }
  }, [selected, roundIdx, solvedCats])

  const nextRound = useCallback(() => {
    startGame(roundIdx + 1)
  }, [roundIdx, startGame])

  const unsolvedTiles = useMemo(
    () => tiles.filter(t => !t.solved),
    [tiles]
  )

  if (!started) return (
    <GameIntro
      icon="🔗"
      title="Country Connections"
      desc="Group 16 countries into 4 categories of 4. Each category has a hidden connection."
      rules={[
        '🟡 Yellow = easiest, 🟣 Purple = hardest',
        '✅ Select 4 countries then press Submit',
        '❌ You have unlimited guesses',
        '💡 "One away!" means 3 of your 4 are correct',
      ]}
      onStart={() => { setStarted(true); startGame(0) }}
    />
  )

  if (done) {
    return (
      <>
        <div className="panel-header"><h2>🔗 Country Connections</h2></div>
        <div className="quiz-done-wrap">
          <div className="quiz-done-icon">🎉</div>
          <div className="quiz-done-title">Puzzle solved!</div>
          <div className="quiz-done-score">
            {mistakes === 0 ? 'Perfect — no mistakes!' : `${mistakes} mistake${mistakes !== 1 ? 's' : ''}`}
          </div>
          {/* Show all categories */}
          <div className="conn-results">
            {[...solvedCats].sort((a, b) => a.difficulty - b.difficulty).map((cat, i) => {
              const dc = DIFF_COLORS[cat.difficulty]
              return (
                <div key={i} className="conn-result-cat" style={{ background: dc.bg, border: `1px solid ${dc.active}` }}>
                  <span className="conn-result-label" style={{ color: dc.text }}>{cat.label}</span>
                  <span className="conn-result-items">{cat.countries.join(', ')}</span>
                </div>
              )
            })}
          </div>
          <div className="conn-done-btns">
            <button className="quiz-reset-btn" onClick={() => startGame(roundIdx)}>↺ Replay</button>
            <button className="quiz-reset-btn" onClick={nextRound}>Next puzzle →</button>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <div className="panel-header">
        <div className="quiz-header-row">
          <h2>🔗 Country Connections</h2>
          <span className="conn-round-label">Puzzle {(roundIdx % CONNECTIONS_ROUNDS.length) + 1}</span>
        </div>
        <p className="panel-subtitle">Find four groups of four countries.</p>
      </div>

      {/* Solved categories */}
      {solvedCats.map((cat, i) => {
        const dc = DIFF_COLORS[cat.difficulty]
        return (
          <div key={i} className="conn-solved-row" style={{ background: dc.bg, borderColor: dc.active }}>
            <span className="conn-solved-label" style={{ color: dc.text }}>{cat.label}</span>
            <span className="conn-solved-items">{cat.countries.join(', ')}</span>
          </div>
        )
      })}

      {/* Tile grid */}
      <div className={`conn-grid ${shake ? 'conn-shake' : ''}`}>
        {unsolvedTiles.map((tile) => {
          const isSel = selected.includes(tile.country)
          return (
            <button
              key={tile.country}
              className={`conn-tile ${isSel ? 'conn-tile-sel' : ''}`}
              onClick={() => toggleSelect(tile.country)}
            >
              {tile.country}
            </button>
          )
        })}
      </div>

      {/* Controls */}
      <div className="conn-controls">
        {oneAway && <div className="conn-one-away">💡 One away!</div>}
        <div className="conn-btn-row">
          <button
            className="conn-btn-deselect"
            onClick={() => { setSelected([]); setOneAway(false) }}
            disabled={selected.length === 0}
          >
            Deselect all
          </button>
          <button
            className="conn-btn-submit"
            onClick={submit}
            disabled={selected.length !== 4}
          >
            Submit ({selected.length}/4)
          </button>
        </div>
        <div className="conn-mistakes">
          Mistakes: {mistakes}
          {mistakes === 0 && <span className="conn-perfect-hint"> · Stay perfect!</span>}
        </div>
      </div>
    </>
  )
}
