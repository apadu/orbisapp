import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import SetupCard from './SetupCard'
import GameHeader from './GameHeader'
import GiveUpButton from './GiveUpButton'
import { resolveAlias } from '../utils/aliases'
import { COUNTRY_INFO } from '../utils/countryInfo'
import { FAMOUS_LINES, countriesOnLine, randomLine, lineLabel, lineFocus } from '../quizzes/globeGames'
import { startSession, trackAnswer, finishGame } from '../utils/results'
import { playCorrect, playWin } from '../utils/sounds'
import { t, cn } from '../i18n'
import { useGameHud } from '../utils/hudStore'

const MODE = 'line-up'
const OPTIONS = [{
  id: 'kind', label: t('Line'),
  choices: [
    { value: 'parallel', label: t('↔ Parallels'), hint: t('A random line of latitude') },
    { value: 'meridian', label: t('↕ Meridians'), hint: t('A random line of longitude') },
    { value: 'mixed',    label: t('🎲 Mixed'),     hint: t('Parallel or meridian') },
    { value: 'famous',   label: t('⭐ Famous'),    hint: t('Equator, the Tropics, the Arctic Circle, the Prime Meridian') },
  ],
}]
const RULES = [
  t('A line is drawn across the globe. Name every country it passes through.'),
  t('Type in any order — the count tells you how many there are.'),
  t('The line uses the map\'s borders: if it clips a country\'s corner, that country counts.'),
  t('No timer. Give up to reveal the rest.'),
]

export default function LineUpPanel({ gameCountries, onGlobe }) {
  const [phase, setPhase] = useState('setup')
  const [setup, setSetup] = useState(null)
  const [line, setLine] = useState(null)
  const [found, setFound] = useState([])
  const [input, setInput] = useState('')
  const [flash, setFlash] = useState(null)
  const inputRef = useRef(null)
  const lastFamous = useRef(-1)

  const names = useMemo(() => gameCountries.map(f => f.properties.NAME), [gameCountries])
  const byName = useMemo(() => Object.fromEntries(gameCountries.map(f => [f.properties.NAME, f])), [gameCountries])
  const missed = phase === 'over' && line ? line.names.filter(n => !found.includes(n)) : []

  const begin = useCallback((values) => {
    let l
    if (values.kind === 'famous') {
      let i = Math.floor(Math.random() * FAMOUS_LINES.length)
      if (i === lastFamous.current) i = (i + 1) % FAMOUS_LINES.length
      lastFamous.current = i
      l = { ...FAMOUS_LINES[i], names: countriesOnLine(gameCountries, FAMOUS_LINES[i]) }
    } else {
      l = randomLine(gameCountries, values.kind)
    }
    startSession(MODE)
    setSetup(values); setLine(l); setFound([]); setInput(''); setFlash(null)
    setPhase('playing')
    setTimeout(() => inputRef.current?.focus(), 60)
  }, [gameCountries])

  const finish = useCallback((all) => {
    if (!line) return
    if (!all) for (const n of line.names) if (!found.includes(n)) trackAnswer(MODE, n, false, 0, null, { silent: true })
    finishGame(MODE, { score: all ? line.names.length : found.length, completed: true, meta: { line: lineLabel(line), total: line.names.length } })
    if (all) playWin()
    setPhase('over')
  }, [line, found])

  const onType = (val) => {
    setInput(val)
    const n = resolveAlias(val, names)
    if (!n || found.includes(n)) return
    if (!line.names.includes(n)) return
    trackAnswer(MODE, n, true, 0)
    playCorrect()
    const next = [...found, n]
    setFound(next); setInput(''); setFlash('correct')
    setTimeout(() => setFlash(null), 350)
    if (next.length === line.names.length) setTimeout(() => finish(true), 300)
  }

  // Globe
  useEffect(() => {
    if (phase === 'setup' || !line) { onGlobe({}); return }
    const color = line.type === 'parallel' ? '#facc15' : '#38bdf8'
    onGlobe({
      guesses: found.map(n => ({ name: n, color: '#39ff14' })),
      missed: missed.map(n => byName[n]).filter(Boolean),
      overlay: { lines: [{ type: line.type, lat: line.lat, lon: line.lon, color, width: 5 }] },
      flyTo: { ...lineFocus(line), zoom: 3.4, hold: 8000, _k: lineLabel(line) },
    })
  }, [phase, line, found]) // eslint-disable-line react-hooks/exhaustive-deps

  // Phones: key numbers stay visible over the globe
  useGameHud(phase === 'playing' && line ? [{ icon: '✓', text: `${found.length}/${line.names.length}` }] : null)
  if (phase === 'setup') {
    return <SetupCard mode={MODE} icon="📐" title={t('Line Up')} desc={t('Name every country on the line')} options={OPTIONS} rules={RULES} onStart={begin} />
  }

  const total = line.names.length
  return (
    <div className="gg">
        <GameHeader icon="📐" title={t('Line Up')} />
      <div className="gg-prompt">
        <span className="gg-prompt-label">{line.type === 'parallel' ? t('Parallel') : t('Meridian')}</span>
        <span className="gg-prompt-big">{lineLabel(line)}</span>
      </div>
      <div className="missing-progress-wrap">
        <div className="missing-progress-bar"><div className="missing-progress-fill" style={{ width: `${(found.length / total) * 100}%` }} /></div>
        <span className="missing-count">{found.length} / {total}</span>
      </div>

      {phase === 'playing' ? (
        <>
          <input
            ref={inputRef}
            className={`missing-input ${flash ?? ''}`}
            value={input}
            onChange={e => onType(e.target.value)}
            placeholder={t('Type a country on the line…')}
            autoComplete="off" autoCorrect="off" spellCheck={false}
          />
          <div className="gg-chips">
            {found.map(n => <span key={n} className="gg-chip ok">{COUNTRY_INFO[n]?.flag} {cn(n)}</span>)}
          </div>
          <GiveUpButton onConfirm={() => finish(false)} />
        </>
      ) : (
        <div className="gg-over">
          <div className="gg-over-big">{found.length}<small> / {total}</small></div>
          <div className="gg-chips">
            {found.map(n => <span key={n} className="gg-chip ok">{COUNTRY_INFO[n]?.flag} {cn(n)}</span>)}
            {missed.map(n => <span key={n} className="gg-chip bad">{COUNTRY_INFO[n]?.flag} {cn(n)}</span>)}
          </div>
          <div className="gg-btns">
            <button className="arc-primary" onClick={() => begin(setup)}>{t('▶ New line')}</button>
            <button className="arc-secondary" onClick={() => setPhase('setup')}>{t('Settings')}</button>
          </div>
        </div>
      )}
    </div>
  )
}
