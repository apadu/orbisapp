import { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import GiveUpButton from './GiveUpButton'
import { resolveAlias } from '../utils/aliases'
import GameIntro from './GameIntro'
import { t, cn } from '../i18n'

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
  return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, ' ').trim()
}

function getSuggestions(input, countryNames, max = 7) {
  if (!input || input.length < 1) return []
  const q = norm(input)
  // prefix matches first, then contains
  const key = (n) => norm(cn(n))
  const prefix   = countryNames.filter(n => key(n).startsWith(q) || norm(n).startsWith(q))
  const contains = countryNames.filter(n => !prefix.includes(n) && key(n).includes(q))
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
    if (!resolved) { setError(t('"{raw}" not recognised.', { raw: raw })); return }

    const tail = chain[chain.length - 1]
    const nbSet = new Set(adjacency[tail] ?? [])

    if (!nbSet.has(resolved)) { setError(t('{resolved} doesn\'t border {tail}.', { resolved: cn(resolved), tail: cn(tail) })); return }
    if (chain.includes(resolved)) { setError(t('{resolved} is already in your chain.', { resolved: cn(resolved) })); return }

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
      title={t('Border Chain')}
      desc={t('Connect two highlighted countries through a chain of shared borders.')}
      rules={[
        t('🗺️ Each step must share a land border with the previous'),
        t('⭐ Try to find the shortest chain'),
        t('💡 The optimal path is calculated — try to match it'),
        t('🔄 New challenge after each round'),
      ]}
      onStart={() => setStarted(true)}
      disabled={!startCountry || !endCountry}
    />
  )

  return (
    <>
      <div className="panel-header">
        <h2>{t('🔗 Border Chain')}</h2>
        <p className="panel-subtitle">
          {t('Connect the two countries by naming a chain of bordering nations.')}
        </p>
      </div>

      {/* Score bar */}
      <div className="locate-score-bar">
        <span className="locate-score-num">{history.filter(h => h.pts > 0).length}</span>
        <span className="locate-score-label">{t('chains solved')}</span>
        <span className="locate-round-count">{history.length} {t('rounds')}</span>
      </div>

      {/* Start / End */}
      <div className="bc-endpoints">
        <div className="bc-endpoint bc-start">
          <span className="bc-ep-label">{t('From')}</span>
          <span className="bc-ep-name">{cn(startName)}</span>
        </div>
        <div className="bc-arrow">→</div>
        <div className="bc-endpoint bc-end">
          <span className="bc-ep-label">{t('To')}</span>
          <span className="bc-ep-name">{cn(endName)}</span>
        </div>
      </div>

      {/* Chain so far */}
      <div className="bc-chain-wrap">
        {chain.map((name, i) => (
          <span key={i} className="bc-chain-item">
            <span className={`bc-chip ${name === startName ? 'bc-chip-start' : name === endName ? 'bc-chip-end' : 'bc-chip-mid'}`}>
              {cn(name)}
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
            ? t('{v} borders {endName} — type it!', { v: cn(chain[chain.length - 1]), endName: cn(endName) })
            : t('~{remaining} more hop{v} to go', { remaining: remaining, v: remaining !== 1 ? 's' : '' })}
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
                placeholder={t('Next bordering country…')}
                value={input}
                onChange={e => { setInput(e.target.value); setError(null) }}
                onKeyDown={onKeyDown}
                autoComplete="off"
                spellCheck={false}
              />
              <button className="guess-btn" onClick={() => trySubmit()}>{t('Go')}</button>
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
                    {cn(name)}
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
        const label = pts === 1000 ? t('Optimal!') : pts >= 700 ? t('Great!') : pts >= 400 ? t('Good') : t('Could be shorter')
        return (
          <div className="po-result" style={{ color }}>
            🎉 {label} — {chain.length - 1} {t('hop')}{chain.length - 1 !== 1 ? 's' : ''}
            {optimalPath && optimalPath.length - 1 < chain.length - 1 && (
              <div className="bc-optimal">
                {t('Shortest:')} {optimalPath.join(' → ')}
              </div>
            )}
          </div>
        )
      })()}

      {/* Give up reveal */}
      {gaveUp && optimalPath && (
        <div className="give-up-reveal" style={{ padding: '12px 18px' }}>
          {t('Shortest path:')} <strong>{optimalPath.join(' → ')}</strong>
        </div>
      )}

      {/* Next / Give up buttons */}
      <div className="panel-footer">
        {won || gaveUp ? (
          <button className="new-game-btn" onClick={onNext}>{t('Next →')}</button>
        ) : (
          <>
            <button className="new-game-btn" onClick={onNext}>{t('🔄 New Pair')}</button>
            <GiveUpButton compact onConfirm={handleGiveUp} />
          </>
        )}
      </div>

      {/* History */}
      {history.length > 0 && (
        <div className="guesses-section">
          <h3 className="guesses-title">{t('History')} <span className="guess-count">{history.length}</span></h3>
          <ul className="guess-list">
            {[...history].reverse().map((h, i) => {
              const color = h.pts === 1000 ? '#39ff14' : h.pts >= 700 ? '#a3e635' : h.pts >= 400 ? '#eab308' : '#f97316'
              return (
                <li key={i} className="guess-item">
                  <span className="guess-swatch" style={{ background: color }} />
                  <span className="guess-name" style={{ fontSize: '0.75rem' }}>
                    {h.chain[0]} → {h.chain[h.chain.length - 1]}
                  </span>
                  <span className="guess-dist">{h.chain.length - 1} {t('hops')}</span>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </>
  )
}
