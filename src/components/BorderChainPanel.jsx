import { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import { resolveAlias } from '../utils/aliases'
import GameIntro from './GameIntro'

/** BFS: shortest path from `start` to `end` using adjacency map. Returns path array or null. */
function bfs(start, end, adjacency) {
  if (start === end) return [start]
  const queue = [[start]]
  const visited = new Set([start])
  while (queue.length) {
    const path = queue.shift()
    const node = path[path.length - 1]
    for (const nb of (adjacency[node] ?? [])) {
      if (nb === end) return [...path, nb]
      if (!visited.has(nb)) {
        visited.add(nb)
        queue.push([...path, nb])
      }
    }
  }
  return null
}

function calcScore(optimal, actual) {
  const extra = actual - optimal
  if (extra === 0) return 1000
  if (extra === 1) return 700
  if (extra === 2) return 400
  return 100
}

function norm(s) {
  return s.toLowerCase().replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, ' ').trim()
}

function getSuggestions(input, countryNames, max = 7) {
  if (!input || input.length < 1) return []
  const q = norm(input)
  // prefix matches first, then contains
  const prefix   = countryNames.filter(n => norm(n).startsWith(q))
  const contains = countryNames.filter(n => !norm(n).startsWith(q) && norm(n).includes(q))
  return [...prefix, ...contains].slice(0, max)
}

export default function BorderChainPanel({
  startCountry, endCountry, adjacency, countries,
  onWin, totalScore, history, onNext, onGiveUp
}) {
  const [chain,       setChain]       = useState([startCountry?.properties?.NAME])
  const [input,       setInput]       = useState('')
  const [error,       setError]       = useState(null)
  const [won,         setWon]         = useState(false)
  const [gaveUp,      setGaveUp]      = useState(false)
  const [optimalPath, setOptimalPath] = useState(null)
  const [activeIdx,   setActiveIdx]   = useState(-1)  // highlighted suggestion index
  const inputRef      = useRef(null)
  const dropdownRef   = useRef(null)

  const countryNames = useMemo(() => countries.map(f => f.properties.NAME), [countries])

  const startName = startCountry?.properties?.NAME
  const endName   = endCountry?.properties?.NAME

  const suggestions = useMemo(
    () => (won || gaveUp) ? [] : getSuggestions(input, countryNames),
    [input, countryNames, won, gaveUp]
  )

  const remaining = useMemo(() => {
    const tail = chain[chain.length - 1]
    if (!tail || !endName) return null
    const path = bfs(tail, endName, adjacency)
    return path ? path.length - 1 : null
  }, [chain, endName, adjacency])

  useEffect(() => {
    if (startName) {
      setChain([startName])
      setInput('')
      setError(null)
      setWon(false)
      setGaveUp(false)
      setOptimalPath(null)
      setActiveIdx(-1)
    }
  }, [startName, endName])

  useEffect(() => { inputRef.current?.focus() }, [won, gaveUp])

  // Reset active index when suggestions change
  useEffect(() => { setActiveIdx(-1) }, [suggestions.length])

  // Scroll active item into view
  useEffect(() => {
    if (activeIdx < 0 || !dropdownRef.current) return
    const el = dropdownRef.current.children[activeIdx]
    el?.scrollIntoView({ block: 'nearest' })
  }, [activeIdx])

  const trySubmit = useCallback((nameOverride) => {
    const raw = (nameOverride ?? input).trim()
    if (!raw) return
    const resolved = resolveAlias(raw, countryNames)
    if (!resolved) { setError(`"${raw}" not recognised.`); return }

    const tail = chain[chain.length - 1]
    const nbSet = new Set(adjacency[tail] ?? [])

    if (!nbSet.has(resolved)) { setError(`${resolved} doesn't border ${tail}.`); return }
    if (chain.includes(resolved)) { setError(`${resolved} is already in your chain.`); return }

    const newChain = [...chain, resolved]
    setChain(newChain)
    setInput('')
    setError(null)
    setActiveIdx(-1)
    inputRef.current?.focus()

    if (resolved === endName) {
      const optimal = bfs(startName, endName, adjacency)
      const optLen  = optimal ? optimal.length - 1 : newChain.length - 1
      const pts     = calcScore(optLen, newChain.length - 1)
      setOptimalPath(optimal)
      setWon(true)
      onWin(pts, newChain, optimal)
    }
  }, [input, countryNames, chain, adjacency, endName, startName, onWin])

  const handleGiveUp = () => {
    const optimal = bfs(startName, endName, adjacency)
    setOptimalPath(optimal)
    setGaveUp(true)
    onGiveUp()
  }

  const selectSuggestion = useCallback((name) => {
    setInput(name)
    setActiveIdx(-1)
    // Submit immediately on click/selection
    trySubmit(name)
  }, [trySubmit])

  const onKeyDown = useCallback((e) => {
    if (suggestions.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setActiveIdx(i => Math.min(i + 1, suggestions.length - 1))
        return
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setActiveIdx(i => Math.max(i - 1, -1))
        return
      }
      if ((e.key === 'Enter' || e.key === 'Tab') && activeIdx >= 0) {
        e.preventDefault()
        selectSuggestion(suggestions[activeIdx])
        return
      }
      if (e.key === 'Escape') {
        setActiveIdx(-1)
        return
      }
    }
    if (e.key === 'Enter') { e.preventDefault(); trySubmit() }
  }, [suggestions, activeIdx, selectSuggestion, trySubmit])

  const lastResult = history.length > 0 ? history[history.length - 1] : null
  const showDropdown = suggestions.length > 0 && !won && !gaveUp

  const [started, setStarted] = useState(false)
  if (!started) return (
    <GameIntro
      icon="🔗"
      title="Border Chain"
      desc="Connect two highlighted countries through a chain of shared borders."
      rules={[
        '🗺️ Each step must share a land border with the previous',
        '⭐ Fewer steps = more points',
        '💡 The optimal path is calculated — try to match it',
        '🔄 New challenge after each round',
      ]}
      onStart={() => setStarted(true)}
      disabled={!startCountry || !endCountry}
    />
  )

  return (
    <>
      <div className="panel-header">
        <h2>🔗 Border Chain</h2>
        <p className="panel-subtitle">
          Connect the two countries by naming a chain of bordering nations.
        </p>
      </div>

      {/* Score bar */}
      <div className="locate-score-bar">
        <span className="locate-score-num">{totalScore}</span>
        <span className="locate-score-label">total points</span>
        <span className="locate-round-count">{history.length} rounds</span>
      </div>

      {/* Start / End */}
      <div className="bc-endpoints">
        <div className="bc-endpoint bc-start">
          <span className="bc-ep-label">From</span>
          <span className="bc-ep-name">{startName}</span>
        </div>
        <div className="bc-arrow">→</div>
        <div className="bc-endpoint bc-end">
          <span className="bc-ep-label">To</span>
          <span className="bc-ep-name">{endName}</span>
        </div>
      </div>

      {/* Chain so far */}
      <div className="bc-chain-wrap">
        {chain.map((name, i) => (
          <span key={i} className="bc-chain-item">
            <span className={`bc-chip ${name === startName ? 'bc-chip-start' : name === endName ? 'bc-chip-end' : 'bc-chip-mid'}`}>
              {name}
            </span>
            {i < chain.length - 1 && <span className="bc-chain-sep">→</span>}
          </span>
        ))}
        {!won && !gaveUp && <span className="bc-chain-cursor">…</span>}
      </div>

      {/* Hint */}
      {!won && !gaveUp && remaining !== null && (
        <p className="bc-hint">
          {remaining === 1
            ? `${chain[chain.length - 1]} borders ${endName} — type it!`
            : `~${remaining} more hop${remaining !== 1 ? 's' : ''} to go`}
        </p>
      )}

      {/* Input + autocomplete */}
      {!won && !gaveUp && (
        <div className="input-wrap">
          {error && <div className="bc-error">{error}</div>}
          <div className="bc-input-container">
            <div className="input-row">
              <input
                ref={inputRef}
                className="country-input"
                type="text"
                placeholder="Next bordering country…"
                value={input}
                onChange={e => { setInput(e.target.value); setError(null) }}
                onKeyDown={onKeyDown}
                autoComplete="off"
                spellCheck={false}
              />
              <button className="guess-btn" onClick={() => trySubmit()}>Go</button>
            </div>

            {showDropdown && (
              <ul className="bc-dropdown" ref={dropdownRef}>
                {suggestions.map((name, i) => (
                  <li
                    key={name}
                    className={`bc-dropdown-item ${i === activeIdx ? 'bc-dd-active' : ''}`}
                    onMouseDown={e => { e.preventDefault(); selectSuggestion(name) }}
                    onMouseEnter={() => setActiveIdx(i)}
                  >
                    {name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* Win result */}
      {won && lastResult && (() => {
        const { pts } = lastResult
        const color = pts === 1000 ? '#39ff14' : pts >= 700 ? '#a3e635' : pts >= 400 ? '#eab308' : '#f97316'
        const label = pts === 1000 ? 'Optimal!' : pts >= 700 ? 'Great!' : pts >= 400 ? 'Good' : 'Could be shorter'
        return (
          <div className="po-result" style={{ color }}>
            🎉 {label} — {chain.length - 1} hop{chain.length - 1 !== 1 ? 's' : ''}, +{pts} pts
            {optimalPath && optimalPath.length - 1 < chain.length - 1 && (
              <div className="bc-optimal">
                Shortest: {optimalPath.join(' → ')}
              </div>
            )}
          </div>
        )
      })()}

      {/* Give up reveal */}
      {gaveUp && optimalPath && (
        <div className="give-up-reveal" style={{ padding: '12px 18px' }}>
          Shortest path: <strong>{optimalPath.join(' → ')}</strong>
        </div>
      )}

      {/* Next / Give up buttons */}
      <div className="panel-footer">
        {won || gaveUp ? (
          <button className="new-game-btn" onClick={onNext}>Next →</button>
        ) : (
          <>
            <button className="new-game-btn" onClick={onNext}>🔄 New Pair</button>
            <button className="give-up-btn" onClick={handleGiveUp}>Give up</button>
          </>
        )}
      </div>

      {/* History */}
      {history.length > 0 && (
        <div className="guesses-section">
          <h3 className="guesses-title">History <span className="guess-count">{history.length}</span></h3>
          <ul className="guess-list">
            {[...history].reverse().map((h, i) => {
              const color = h.pts === 1000 ? '#39ff14' : h.pts >= 700 ? '#a3e635' : h.pts >= 400 ? '#eab308' : '#f97316'
              return (
                <li key={i} className="guess-item">
                  <span className="guess-swatch" style={{ background: color }} />
                  <span className="guess-name" style={{ fontSize: '0.75rem' }}>
                    {h.chain[0]} → {h.chain[h.chain.length - 1]}
                  </span>
                  <span className="guess-dist">{h.chain.length - 1} hops</span>
                  <span className="guess-dist" style={{ color }}>+{h.pts}</span>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </>
  )
}
