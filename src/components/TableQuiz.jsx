import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { TABLE_QUIZZES, REGIONS, norm, timeLimitFor } from '../quizzes/tableQuizzes'
import { startSession, trackAnswer, finishGame, markSession, setPoolSize } from '../utils/results'
import { playCorrect, playWin, playWrong } from '../utils/sounds'
import { getSavedSetup, saveSetup } from './SetupCard'
import { ReadyOptions, StartButton, useTypeToStart } from './QuizReady'
import { setRules } from '../utils/rulesStore'
import { AttemptNote, QuizResultStats, pastRounds } from './QuizStats'
import GiveUpButton from './GiveUpButton'
import TryNext from './TryNext'
import QuizComments from './QuizComments'
import FlagImg from './FlagImg'
import HistoricalFlag from './HistoricalFlag'
import { t, continentName } from '../i18n'
import { QUIZ_ITEMS } from './QuizHub'
import { countryGame } from '../data/countryPages'
import GameIcon from './GameIcon'
import { plain } from '../utils/plain'
import ShareButton, { resultText } from './ShareButton'
import StateNote from './StateNote'

const MIN_ROWS = 5
const COL_GAP = 18

/**
 * Splits the table into equal columns, filled top to bottom. A CSS grid (not CSS columns)
 * so every row lines up across columns and all columns end on the same line.
 */
export function useColumns(minWidth) {
  const [el, setEl] = useState(null)      // callback ref: the table may mount after the first render
  const [cols, setCols] = useState(1)
  useEffect(() => {
    if (!el) return
    const measure = () => setCols(Math.max(1, Math.floor((el.clientWidth + COL_GAP) / (minWidth + COL_GAP))))
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [el, minWidth])
  return [setEl, cols]
}

/** Grid cell of row i when n rows are split as evenly as possible into `cols` columns (top to bottom). */
export function cellOf(i, n, cols) {
  const base = Math.floor(n / cols), extra = n % cols   // the first `extra` columns get one more row
  const big = extra * (base + 1)
  const col = i < big ? Math.floor(i / (base + 1)) : extra + Math.floor((i - big) / Math.max(1, base))
  const row = i < big ? i % (base + 1) : (i - big) % Math.max(1, base)
  return { gridColumn: col + 1, gridRow: row + 1 }
}
const sizeOf = (v) => (v.size === 'all' ? Infinity : (Number(v.size) || 20))
const PREFIX_WAIT_MS = 700   // "Niger" waits a moment in case you're typing "Nigeria"

function fmt(secs) {
  const s = Math.max(0, secs)
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

function seededRandom(seed) {
  let t = seed >>> 0
  return () => {
    t += 0x6D2B79F5
    let r = Math.imul(t ^ (t >>> 15), 1 | t)
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r)
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}

// `reveal`: the game is over — show extras kept hidden while playing (an endonym's romanization)
function Hint({ hint, reveal = false }) {
  switch (hint.type) {
    case 'flag':   return <FlagImg emoji={hint.value} className="tq-flag" />
    case 'histflag': return <HistoricalFlag id={hint.value} className="tq-flag tq-hist-flag" />
    case 'script': return (
      <span className="tq-script">
        <span>{hint.value}</span>
        {(reveal || hint.subAlways) && hint.sub && <small>{hint.sub}</small>}
      </span>
    )
    case 'colors': return (
      <span className="tq-colors" title={hint.value.map(c => `${c.name} ${c.pct}%`).join(' · ')}>
        {hint.value.map((c, i) => <span key={i} style={{ background: c.hex, flexGrow: c.pct }} />)}
      </span>
    )
    default: return (
      <span className={`tq-text${hint.mono ? ' tq-mono' : ''}${hint.long ? ' tq-long' : ''}`}>
        {hint.flag && <FlagImg emoji={hint.flag} className="tq-mini-flag" />}
        {hint.value}
      </span>
    )
  }
}

/**
 * daily: optional { day, region, size, seed, onFinish(result), renderResult(result) }
 *   → plays straight away with a fixed, seeded selection, tracked as mode 'daily-quiz'.
 */
/** Quizzes whose rows load on demand (quiz.load) are shown once their rows are in. */
export default function TableQuiz(props) {
  const quiz = TABLE_QUIZZES[props.quizId]
  const [loaded, setLoaded] = useState(() => !quiz?.load || !!quiz.loaded)
  const [failed, setFailed] = useState(false)
  useEffect(() => {
    if (loaded || !quiz?.load) return
    let alive = true
    quiz.load()
      .then(build => { quiz.build = build; quiz.loaded = true; if (alive) setLoaded(true) })
      .catch(() => { if (alive) setFailed(true) })
    return () => { alive = false }
  }, [quiz, loaded])
  if (failed) return <StateNote kind="error">{t('Could not load the quiz. Check your connection and try again.')}</StateNote>
  if (!loaded) return <StateNote kind="loading">{t('Loading…')}</StateNote>
  return <TableQuizBoard {...props} />
}

function TableQuizBoard({ quizId, countryNames, onDaily, daily = null, onOpen }) {
  const quiz = TABLE_QUIZZES[quizId]
  const mode = daily ? 'daily-quiz' : quizId   // results / XP bucket

  // Regions with enough rows to be worth playing
  const regionCounts = useMemo(() => {
    const out = {}
    for (const r of REGIONS) {
      const n = quiz.build({ countries: countryNames, region: r }).length
      out[r] = n
    }
    return out
  }, [quiz, countryNames])
  const regionChoices = REGIONS.filter(r => regionCounts[r] >= MIN_ROWS)
  const setupOptions = useMemo(() => {
    const opts = quiz.regions === false ? [] : [{
      id: 'region', label: t('Region'), default: 'World',
      choices: regionChoices.map(r => ({
        value: r,
        label: `${continentName(r)} · ${regionCounts[r]}`,
        hint: quiz.sample ? t('{v} countries in the pool — each game picks a fresh random set', { v: regionCounts[r] }) : undefined,
      })),
    }]
    if (quiz.sample) opts.push({
      id: 'size', label: quiz.focus ? t('Flags per game') : t('Countries per game'), default: '20',
      choices: quiz.sizes ?? [
        { value: '20', label: '20', hint: t('Quick round') },
        { value: '30', label: '30', hint: t('Longer round') },
      ],
    })
    return opts
  }, [regionChoices.join(), regionCounts, quiz]) // eslint-disable-line react-hooks/exhaustive-deps

  const [phase,    setPhase]    = useState('setup')      // setup (board shown, not started) | playing | done
  const [setup,    setSetup]    = useState(() => getSavedSetup(quizId, setupOptions))
  const [region,   setRegion]   = useState('World')
  const [rows,     setRows]     = useState([])
  const [filled,   setFilled]   = useState(() => new Set())
  const [recent,   setRecent]   = useState(() => new Set())
  const [labels,   setLabels]   = useState({})            // row id → what the player typed (any-of rows)
  const [activeId, setActiveId] = useState(null)          // focus quizzes: the one row being asked
  const [input,    setInput]    = useState('')
  const [timeLeft, setTimeLeft] = useState(0)
  const [endReason, setEndReason] = useState(null)       // complete | time | giveup
  const inputRef   = useRef(null)
  const startedAt  = useRef(0)
  const [result, setResult] = useState(null)
  const [lastRow, setLastRow] = useState(null)          // the round just finished (for the stats panel)
  const prevRef = useRef([])                            // earlier rounds, taken when this one started
  const pendingRef = useRef(null)
  const filledRef  = useRef(filled)
  filledRef.current = filled

  // answer → row ids
  const index = useMemo(() => {
    const m = new Map()
    for (const r of rows) for (const a of r.answers) {
      const k = norm(a)
      if (!k) continue
      if (!m.has(k)) m.set(k, [])
      if (!m.get(k).includes(r.id)) m.get(k).push(r.id)
    }
    return m
  }, [rows])

  const longRows = rows.some(r => r.hint.long)
  const textHint = !!quiz.columns?.extra && quiz.columns?.hint !== '#'
  const colMin = longRows ? 460 : textHint ? 420 : quiz.columns?.extra ? 340 : 290
  const [colsRef, cols] = useColumns(colMin)
  const [size, setSize] = useState(20)
  const [untimed, setUntimed] = useState(false)            // clock off for this game — no XP
  const [confirmUntimed, setConfirmUntimed] = useState(false)
  // Lay out a fresh board (not started yet)
  const prepare = useCallback((reg, n = size) => {
    let built = quiz.build({ countries: countryNames, region: reg })
    if (quiz.sample && built.length > n) {
      // fresh random selection every play
      const a = [...built]
      const rnd = daily ? seededRandom(daily.seed) : Math.random
      for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]] }
      built = a.slice(0, n)
    }
    setRegion(reg)
    setRows(built)
    setActiveId(quiz.focus ? (built[0]?.id ?? null) : null)
    setFilled(new Set())
    setRecent(new Set())
    setLabels({})
    setInput('')
    setTimeLeft(quiz.timeLimit ?? timeLimitFor(built.length))
    setEndReason(null)
    setUntimed(false)
    setConfirmUntimed(false)
    return built
  }, [quiz, daily, countryNames, size])

  // Start the clock on the board that's laid out
  const begin = useCallback((typed, built = rows, reg = region) => {
    if (!built.length) return
    setInput(typed ?? '')
    setPhase('playing')
    startedAt.current = Date.now()
    prevRef.current = pastRounds(mode)
    setLastRow(null)
    startSession(mode)
    setPoolSize(mode, built.length)   // left half-way: 9/196, not 9/9
    if (daily) { markSession(mode, { day: daily.day, quizId, region: reg }); daily.onStart?.() }
    inputRef.current?.focus()   // same input as before the start: keep the next keystrokes
    setTimeout(() => inputRef.current?.focus(), 30)
  }, [rows, region, mode, daily, quizId])

  const start = useCallback((reg, typed, n = size) => {
    begin(typed, prepare(reg, n), reg)
  }, [prepare, begin, size])

  const finish = useCallback((reason) => {
    clearTimeout(pendingRef.current)
    setPhase('done')
    setEndReason(reason)
    const done = filledRef.current
    for (const r of rows) {
      if (!done.has(r.id)) trackAnswer(mode, r.country ?? null, false, 0, r.country ? null : r.id, { silent: true })
    }
    setLastRow(finishGame(mode, { completed: true, meta: { region, variant: `${region}|${rows.length}` } }))
    if (reason === 'complete') playWin(); else playWrong()
    const res = { score: done.size, total: rows.length, durationMs: Date.now() - startedAt.current, reason, region }
    setResult(res)
    daily?.onFinish?.(res)
  }, [rows, mode, region, daily])

  // Timer (stops for good once the player switches to untimed; paused while the confirm prompt is open)
  useEffect(() => {
    if (phase !== 'playing' || untimed || confirmUntimed) return
    const t = setInterval(() => setTimeLeft(s => s - 1), 1000)
    return () => clearInterval(t)
  }, [phase, untimed, confirmUntimed])
  useEffect(() => { if (phase === 'playing' && !untimed && timeLeft <= 0 && rows.length) finish('time') }, [timeLeft]) // eslint-disable-line react-hooks/exhaustive-deps

  const goUntimed = () => {
    setUntimed(true)
    setConfirmUntimed(false)
    markSession(mode, { untimed: true })   // whole game: no XP, no medals, no leaderboard
    setTimeout(() => inputRef.current?.focus(), 30)
  }

  // Focus quizzes: next unanswered row after `fromId` (wraps around)
  const nextOpen = useCallback((fromId, filledSet, dir = 1) => {
    if (!rows.length) return null
    const start = Math.max(0, rows.findIndex(r => r.id === fromId))
    for (let k = 1; k <= rows.length; k++) {
      const r = rows[(start + dir * k + rows.length * 2) % rows.length]
      if (!filledSet.has(r.id)) return r.id
    }
    return null
  }, [rows])

  const accept = useCallback((key) => {
    let ids = (index.get(key) ?? []).filter(id => !filledRef.current.has(id))
    if (quiz.focus) ids = ids.filter(id => id === activeId)   // only the highlighted one counts
    if (!ids.length) return false
    const next = new Set(filledRef.current)
    const newLabels = {}
    for (const id of ids) {
      next.add(id)
      const row = rows.find(r => r.id === id)
      // any-of rows (e.g. A to Z): remember which country was given
      const typedAnswer = row.labels ? row.answers.find(a => norm(a) === key) : null
      const lab = typedAnswer ? row.labels[typedAnswer] : null       // string (country) or { show, country }
      const country = row.country ?? (typeof lab === 'object' && lab ? lab.country : lab)
      if (lab) newLabels[id] = typeof lab === 'object' ? lab.show : lab
      trackAnswer(mode, country, true, 10, country ? null : row.id)
    }
    filledRef.current = next
    if (Object.keys(newLabels).length) setLabels(l => ({ ...l, ...newLabels }))
    setFilled(next)
    setRecent(new Set(ids))
    setInput('')
    if (quiz.focus) setActiveId(nextOpen(ids[0], next))
    if (next.size === rows.length) finish('complete')
    else playCorrect()
    return true
  }, [index, rows, quizId, mode, finish, onDaily, quiz.focus, activeId, nextOpen])

  const onChange = (e) => {
    const v = e.target.value
    setInput(v)
    clearTimeout(pendingRef.current)
    const k = norm(v)
    if (!k || !index.has(k)) return
    if (quiz.focus) { if ((index.get(k) ?? []).includes(activeId)) accept(k); return }
    if (!(index.get(k) ?? []).some(id => !filledRef.current.has(id))) return
    // Another unanswered answer starts with this one? ("Niger" → "Nigeria") — wait a beat.
    // Longer spellings of the same answer ("Cluj" → "Cluj-Napoca") don't count.
    const mine = new Set(index.get(k))
    let longer = false
    for (const [key, ids] of index) {
      if (key.length > k.length && key.startsWith(k) && ids.some(id => !filledRef.current.has(id) && !mine.has(id))) { longer = true; break }
    }
    if (longer) pendingRef.current = setTimeout(() => accept(k), PREFIX_WAIT_MS)
    else accept(k)
  }

  const onKeyDown = (e) => {
    if (quiz.focus && e.key === 'Tab') {
      e.preventDefault()
      setActiveId(id => nextOpen(id, filledRef.current, e.shiftKey ? -1 : 1) ?? id)
      setInput('')
      return
    }
    if (e.key === 'Enter') {
      clearTimeout(pendingRef.current)
      if (!accept(norm(input)) && input.trim()) {
        e.currentTarget.classList.remove('tq-shake'); void e.currentTarget.offsetWidth; e.currentTarget.classList.add('tq-shake')
      }
    }
  }

  useEffect(() => () => clearTimeout(pendingRef.current), [])

  // Keep the highlighted flag on screen
  useEffect(() => {
    if (!quiz.focus || !activeId || phase !== 'playing') return
    document.querySelector(`[data-row-id="${CSS.escape(activeId)}"]`)?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [activeId, phase, quiz.focus])

  // Daily quiz: board first with the day's fixed selection (no options); Start / typing begins it
  useEffect(() => {
    if (daily && phase === 'setup' && countryNames.length) prepare(daily.region, daily.size ?? 20)
  }, [daily?.day, phase, countryNames.length]) // eslint-disable-line react-hooks/exhaustive-deps

  // Board first: lay out the (empty) quiz with the saved options; Start / typing begins it
  useEffect(() => {
    if (daily || phase !== 'setup' || !countryNames.length) return
    const n = sizeOf(setup)
    setSize(n)
    prepare(quiz.region ?? setup.region ?? 'World', n)
  }, [phase, setup, countryNames.length]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (daily) return
    setRules({
      icon: quiz.icon, title: quiz.title,
      desc: (QUIZ_ITEMS.find(q => q.id === quizId) ?? countryGame(quizId))?.desc ?? quiz.prompt,
      rules: [
        plain(t('⌨️ {prompt} — any order, no Enter needed', { prompt: quiz.prompt })),
        plain(t('⏱ The clock depends on how many answers there are')),
        plain(t('🏳️ Give up any time to see what you missed')),
        plain(t('✨ XP only for answers you haven\'t got before')),
      ],
    })
  }, [quizId]) // eslint-disable-line react-hooks/exhaustive-deps

  const ready = phase === 'setup'
  const changeSetup = (v) => { saveSetup(quizId, v); setSetup(v) }
  const beginNow = (typed) => { if (!daily) saveSetup(quizId, setup); begin(typed) }
  useTypeToStart(ready && rows.length > 0, beginNow)

  if (phase === 'setup' && daily && !rows.length) return <StateNote kind="loading">{t('Loading today\'s quiz…')}</StateNote>

  // ── Play / results ─────────────────────────────────────────────────────────
  const total = rows.length
  const score = filled.size
  const playing = phase === 'playing'
  const over = phase === 'done'
  const danger = playing && timeLeft <= 30
  const pct = total ? Math.round((score / total) * 100) : 0
  const activeRow = quiz.focus ? rows.find(r => r.id === activeId) : null

  // timer · untimed · score: in the sticky answer bar while playing, in the header once it's over
  const statsBlock = (
    <div className="tq-stats">
      {untimed ? (
        <span className="tq-timer tq-untimed" title={t('Untimed — this game earns no XP')}>{t('∞ Untimed · no XP')}</span>
      ) : (
        <>
          <span className={`tq-timer${danger ? ' danger' : ''}`}>⏱ {fmt(timeLeft)}</span>
          {playing && !daily && (
            <button className="tq-untimed-btn" onClick={() => setConfirmUntimed(true)} title={t('Stop the clock (no XP)')}>∞</button>
          )}
        </>
      )}
      <span className="tq-score"><strong>{score}</strong> / {total}</span>
    </div>
  )

  return (
    <div className={`tq${over ? ' tq-done' : ''}${ready ? ' tq-ready' : ''}`}>
      <header className="tq-head">
        <div className="tq-title">
          <span className="tq-icon"><GameIcon id={daily ? 'daily-quiz' : quizId} size={24} /></span>
          <div>
            <h2>{quiz.title}{region !== 'World' && !quiz.region && <span className="tq-region"> · {continentName(region)}</span>}</h2>
            <p>{quiz.prompt}</p>
          </div>
        </div>
        {over && !daily && statsBlock}
      </header>

      {confirmUntimed && (
        <div className="tq-modal-backdrop" onClick={() => setConfirmUntimed(false)}>
          <div className="tq-modal" role="dialog" aria-modal="true" onClick={e => e.stopPropagation()}>
            <div className="tq-modal-icon">∞</div>
            <h3>{t('Play untimed?')}</h3>
            <ul>
              <li>{plain(t('⏸ The clock stops for the rest of this game.'))}</li>
              <li>{plain(t('🔒 You can\'t turn it back on until you start a new game.'))}</li>
              <li>{plain(t('🚫 This game earns'))} <strong>{t('no XP')}</strong> {t('— including answers you\'ve already given — and won\'t count for leaderboards.')}</li>
            </ul>
            <div className="tq-modal-btns">
              <button className="tq-btn" onClick={() => setConfirmUntimed(false)}>{t('Keep the timer')}</button>
              <button className="tq-btn tq-btn-warn" onClick={goUntimed} autoFocus>{t('Yes, play untimed')}</button>
            </div>
          </div>
        </div>
      )}

      {ready && !daily && <ReadyOptions options={setupOptions} values={setup} onChange={changeSetup} />}
      {ready && !daily && <AttemptNote mode={quizId} />}
      {ready && daily && <p className="qs-attempt tq-daily-note">{t('One attempt — once you start, leaving counts as your attempt.')}</p>}

      <div className="tq-bar">
        {!over ? (
          <>
            {playing && quiz.focus && activeRow && (
              <span className="tq-active-preview" title={t('Name this flag')}>
                <Hint hint={activeRow.hint} />
              </span>
            )}
            <input
              ref={inputRef}
              className="tq-input"
              value={input}
              onChange={ready ? (e => { if (/\p{L}/u.test(e.target.value)) beginNow(e.target.value) }) : onChange}
              onKeyDown={ready ? (e => { if (e.key === 'Enter') { e.preventDefault(); beginNow() } }) : onKeyDown}
              placeholder={ready ? t('Start typing to begin…') : quiz.focus ? t('Which country is this?  (Tab = skip)') : t('Enter answer…')}
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
            />
            {statsBlock}
            {ready ? <StartButton onClick={() => beginNow()} /> : <GiveUpButton onConfirm={() => finish('giveup')} />}
          </>
        ) : (
          daily && result ? daily.renderResult(result) : <div className="tq-result">
            <span className="tq-result-msg">
              {endReason === 'complete' ? plain(t('🎉 Perfect — you got them all!')) : endReason === 'time' ? plain(t('⌛ Time\'s up!')) : plain(t('🏳️ You gave up.'))}
              {' '}<strong>{score}/{total}</strong> ({pct}%)
            </span>
            <div className="tq-result-btns">
              <button className="tq-btn tq-btn-primary" onClick={() => start(region)}>{t('▶ Play again')}</button>
              <button className="tq-btn" onClick={() => setPhase('setup')}>{plain(t('⚙ Settings'))}</button>
              <ShareButton text={() => resultText({ title: quiz.title + (region !== 'World' && !quiz.region ? ` · ${continentName(region)}` : ''), score, total })} />
            </div>
          </div>
        )}
      </div>

      <div className="tq-progress"><div style={{ width: `${pct}%` }} /></div>

      {phase === 'done' && !daily && <QuizResultStats mode={quizId} variant={`${region}|${rows.length}`} row={lastRow} prev={prevRef.current} record={!untimed} />}

      {quiz.layout === 'grid' ? (
        <div className="tq-grid">
          {rows.map(r => {
            const ok = filled.has(r.id)
            const cls = ok ? (recent.has(r.id) ? ' hit' : ' ok') : over ? ' missed' : ''
            return (
              <div
                key={r.id}
                data-row-id={r.id}
                className={`tq-cell${cls}${quiz.focus && playing && r.id === activeId ? ' active' : ''}${quiz.focus && playing && !ok ? ' clickable' : ''}`}
                onClick={quiz.focus && playing && !ok ? () => { setActiveId(r.id); setInput(''); inputRef.current?.focus() } : undefined}
              >
                <Hint hint={r.hint} reveal={over} />
                <span className="tq-cell-answer" title={ok || over ? (labels[r.id] ?? r.display) : undefined}>{ok ? (labels[r.id] ?? r.display) : over ? r.display : ''}</span>
              </div>
            )
          })}
        </div>
      ) : (
        <div className={`tq-table${quiz.columns.extra ? ' has-extra' : ''}${quiz.columns.extra && quiz.columns.hint !== '#' ? ' text-hint' : ''}${rows.some(r => r.hint.long) ? ' long' : ''}`}>
          <div className="tq-table-label">
            {quiz.columns.hint}{quiz.columns.extra ? ` · ${quiz.columns.extra}` : ''} <span>→</span> {quiz.columns.answer}
          </div>
          <div
            ref={colsRef}
            className="tq-cols"
            style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
          >
          {rows.map((r, i) => {
            const ok = filled.has(r.id)
            const cls = ok ? (recent.has(r.id) ? ' hit' : ' ok') : over ? ' missed' : ''
            return (
              <div key={r.id} className={`tq-row${cls}`} style={cellOf(i, rows.length, cols)}>
                <span className="tq-hint"><Hint hint={r.hint} reveal={over} /></span>
                {quiz.columns.extra && <span className="tq-extra">{r.extra}</span>}
                <span className="tq-answer">{ok ? (labels[r.id] ?? r.display) : over ? r.display : ''}</span>
              </div>
            )
          })}
          </div>
        </div>
      )}
      {phase === 'done' && !daily && onOpen && <TryNext mode={quizId} onOpen={onOpen} />}

      {!daily && <QuizComments quiz={quizId} unlocked={phase === 'done'} />}
    </div>
  )
}

