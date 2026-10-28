import { useState, useEffect, useRef, useCallback } from 'react'
import { resolveAlias } from '../utils/aliases'
import SetupCard from './SetupCard'
import GiveUpButton from './GiveUpButton'
import GameSummary from './GameSummary'
import { t, cn } from '../i18n'
import { setPoolSize } from '../utils/results'

const TIMERS = { standard: 20 * 60, hard: 30 * 60 }
const fmt = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function SpotlightPanel({
  gameCountries,
  countryInfo,
  onCurrentChange,   // (feature | null) → highlighted on globe
  onFoundChange,     // (names[]) → shown green on globe
  onMissedChange,    // (names[]) → shown red at end
}) {
  const [phase,     setPhase]     = useState('select')   // select | playing | done
  const [gameMode,  setGameMode]  = useState(null)       // 'standard' | 'hard'
  const [queue,     setQueue]     = useState([])
  const [idx,       setIdx]       = useState(0)
  const [found,     setFound]     = useState([])
  const [timeLeft,  setTimeLeft]  = useState(0)
  const [input,     setInput]     = useState('')
  const [flash,     setFlash]     = useState(null)
  const [confirmGU, setConfirmGU] = useState(false)

  const inputRef  = useRef(null)
  const timerRef  = useRef(null)
  const idxRef    = useRef(0)
  const foundRef  = useRef([])
  const queueRef  = useRef([])
  const modeRef   = useRef(null)

  // keep refs in sync
  idxRef.current   = idx
  foundRef.current = found
  queueRef.current = queue
  modeRef.current  = gameMode

  const total   = queue.length
  useEffect(() => { setPoolSize('spotlight', total) }, [total])   // so an unfinished game is saved as found/total
  const current = queue[idx] ?? null

  // ── Globe sync ────────────────────────────────────────────────────────────
  useEffect(() => {
    onCurrentChange(phase === 'playing' ? current : null)
  }, [current, phase])

  // ── End game ──────────────────────────────────────────────────────────────
  const endGame = useCallback(() => {
    clearInterval(timerRef.current)
    setPhase('done')
    onCurrentChange(null)
    const foundSet = new Set(foundRef.current)
    const missed = queueRef.current.map(f => f.properties.NAME).filter(n => !foundSet.has(n))
    onMissedChange(missed)
    // Always show found (green) at end — both modes
    onFoundChange(foundRef.current)
  }, [onCurrentChange, onMissedChange, onFoundChange])

  // ── Countdown timer ───────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'playing') return
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { endGame(); return 0 }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [phase, endGame])

  // ── Start ─────────────────────────────────────────────────────────────────
  const startGame = (mode) => {
    clearInterval(timerRef.current)
    onMissedChange([])
    onFoundChange([])
    const shuffled = shuffle(gameCountries)
    queueRef.current = shuffled
    setQueue(shuffled)
    setIdx(0)
    idxRef.current = 0
    foundRef.current = []
    setFound([])
    modeRef.current = mode
    setGameMode(mode)
    setTimeLeft(TIMERS[mode])
    setInput('')
    setFlash(null)
    setConfirmGU(false)
    setPhase('playing')
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  // ── Guess checking ────────────────────────────────────────────────────────
  const tryGuess = (raw) => {
    if (phase !== 'playing') return
    const curr = queueRef.current[idxRef.current]
    if (!curr) return

    const allNames = queueRef.current.map(f => f.properties.NAME)
    const resolved = resolveAlias(raw, allNames)
    if (!resolved || resolved !== curr.properties.NAME) return

    // Correct!
    const next = [...foundRef.current, resolved]
    foundRef.current = next
    setFound(next)
    // In standard mode update globe live; in hard mode only update at end
    if (modeRef.current === 'standard') onFoundChange(next)
    setInput('')
    setFlash('correct')
    setTimeout(() => setFlash(null), 400)

    const nextIdx = idxRef.current + 1
    if (nextIdx >= queueRef.current.length) {
      endGame()
    } else {
      setIdx(nextIdx)
      idxRef.current = nextIdx
    }
  }

  const handleInputChange = e => {
    const val = e.target.value
    setInput(val)
    tryGuess(val)
  }

  const urgent = timeLeft <= 60 && phase === 'playing'

  // ── Setup screen ──────────────────────────────────────────────────────────
  if (phase === 'select') {
    return (
      <SetupCard
        mode="spotlight"
        icon="🔦"
        title={t('Solo Map')}
        desc={t('One country lights up on an otherwise empty globe — identify it to move on!')}
        rules={[
          t('🔦 One country at a time lights up'),
          t('⌨️ Type its name to move to the next'),
          t('🙈 Hard mode: only the current country is ever visible'),
        ]}
        options={[{
          id: 'difficulty', label: t('Mode'), default: 'standard',
          choices: [
            { value: 'standard', label: t('🟢 Standard'), hint: t('Guessed countries stay green · 20 min') },
            { value: 'hard',     label: t('🔴 Hard'),     hint: t('Only the current country is visible · 30 min') },
          ],
        }]}
        typeToStart
        onStart={(v, typed) => { startGame(v.difficulty); if (typed) setInput(typed) }}
      />
    )
  }

  // ── Playing / Done screen ─────────────────────────────────────────────────
  const missedList = phase === 'done'
    ? queue.map(f => f.properties.NAME).filter(n => !new Set(found).has(n))
    : []

  return (
    <div className="spotlight-panel">
      {/* Header: progress + timer */}
      <div className="missing-header">
        <div className="missing-progress-wrap">
          <div className="missing-progress-bar">
            <div className="missing-progress-fill" style={{ width: `${(found.length / total) * 100}%` }} />
          </div>
          <span className="missing-count">{found.length} / {total}</span>
        </div>
        <div className={`missing-timer ${urgent ? 'urgent' : ''}`}>{fmt(timeLeft)}</div>
      </div>

      <div className={`spotlight-badge ${gameMode}`}>
        {gameMode === 'hard' ? t('🔴 Hard') : t('🟢 Standard')}
      </div>

      {/* Input + give up */}
      {phase === 'playing' && (
        <div className="missing-form">
          <input
            ref={inputRef}
            className={`missing-input ${flash ?? ''}`}
            value={input}
            onChange={handleInputChange}
            placeholder={t('Which country is this?')}
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
          />
          <GiveUpButton compact onConfirm={() => endGame()} />
        </div>
      )}

      {/* Done banner */}
      {phase === 'done' && (
        <div className="missing-done-banner">
          {found.length === total
            ? <span className="missing-perfect">{t('🎉 All')} {total} {t('countries identified!')}</span>
            : <span className="missing-score">{t('Identified')} {found.length} / {total}</span>
          }
          <div className="locate-again-row">
            <button
              className="missing-start-btn"
              onClick={() => { onMissedChange([]); onFoundChange([]); startGame(gameMode) }}
            >
              {t('▶ Play again')}
            </button>
            <button
              className="new-game-btn"
              onClick={() => { onMissedChange([]); onFoundChange([]); setPhase('select') }}
            >
              {t('⚙ Settings')}
            </button>
          </div>
        </div>
      )}

      {/* End-of-game summary */}
      {phase === 'done' && (
        <GameSummary
          noun={t('countries')}
          total={total}
          found={found.map(n => ({ label: cn(n), icon: countryInfo[n]?.flag }))}
          missed={missedList.map(n => ({ label: cn(n), icon: countryInfo[n]?.flag }))}
        />
      )}

      {/* Found list (live, during play) */}
      {phase !== 'done' && found.length > 0 && (
        <div className="missing-list-block">
          <div className="missing-list-header found-header">{t('✓ Identified (')}{found.length})</div>
          {[...found].reverse().map(name => (
            <div key={name} className="missing-list-item found-item">
              <span className="missing-item-flag">{countryInfo[name]?.flag ?? '🏳️'}</span>
              <span className="missing-item-name">{cn(name)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
