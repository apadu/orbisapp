import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { TABLE_QUIZZES, REGIONS, norm, timeLimitFor } from '../quizzes/tableQuizzes'
import { startSession, trackAnswer, finishGame, markSession } from '../utils/results'
import { incrementDailyCount } from '../utils/dailyChallenges'
import { playCorrect, playWin, playWrong } from '../utils/sounds'
import SetupCard from './SetupCard'
import GiveUpButton from './GiveUpButton'
import FlagImg from './FlagImg'

const MIN_ROWS = 5
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

function Hint({ hint }) {
  switch (hint.type) {
    case 'flag':   return <FlagImg emoji={hint.value} className="tq-flag" />
    case 'emoji':  return <span className="tq-emoji">{hint.value}</span>
    case 'script': return (
      <span className="tq-script">
        <span>{hint.value}</span>
        {hint.sub && <small>{hint.sub}</small>}
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
export default function TableQuiz({ quizId, countryNames, onDaily, daily = null }) {
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
      id: 'region', label: 'Region', default: 'World',
      choices: regionChoices.map(r => ({
        value: r,
        label: `${r} · ${regionCounts[r]}`,
        hint: quiz.sample ? `${regionCounts[r]} countries in the pool — each game picks a fresh random set` : undefined,
      })),
    }]
    if (quiz.sample) opts.push({
      id: 'size', label: 'Countries per game', default: '20',
      choices: [
        { value: '20', label: '20', hint: 'Quick round' },
        { value: '30', label: '30', hint: 'Longer round' },
      ],
    })
    return opts
  }, [regionChoices.join(), regionCounts, quiz]) // eslint-disable-line react-hooks/exhaustive-deps

  const [phase,    setPhase]    = useState('setup')      // setup | playing | done
  const [region,   setRegion]   = useState('World')
  const [rows,     setRows]     = useState([])
  const [filled,   setFilled]   = useState(() => new Set())
  const [recent,   setRecent]   = useState(() => new Set())
  const [labels,   setLabels]   = useState({})            // row id → what the player typed (any-of rows)
  const [input,    setInput]    = useState('')
  const [timeLeft, setTimeLeft] = useState(0)
  const [endReason, setEndReason] = useState(null)       // complete | time | giveup
  const inputRef   = useRef(null)
  const startedAt  = useRef(0)
  const [result, setResult] = useState(null)
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

  const [size, setSize] = useState(20)
  const [untimed, setUntimed] = useState(false)            // clock off for this game — no XP
  const [confirmUntimed, setConfirmUntimed] = useState(false)
  const start = useCallback((reg, typed, n = size) => {
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
    setFilled(new Set())
    setRecent(new Set())
    setLabels({})
    setInput(typed ?? '')
    setTimeLeft(timeLimitFor(built.length))
    setEndReason(null)
    setUntimed(false)
    setConfirmUntimed(false)
    setPhase('playing')
    startedAt.current = Date.now()
    startSession(mode)
    if (daily) markSession(mode, { day: daily.day, quizId, region: reg })
    setTimeout(() => inputRef.current?.focus(), 30)
  }, [quiz, quizId, mode, daily, countryNames, size])

  const finish = useCallback((reason) => {
    clearTimeout(pendingRef.current)
    setPhase('done')
    setEndReason(reason)
    const done = filledRef.current
    for (const r of rows) {
      if (!done.has(r.id)) trackAnswer(mode, r.country ?? null, false, 0, r.country ? null : r.id, { silent: true })
    }
    finishGame(mode, { completed: true, meta: { region } })
    if (reason === 'complete') playWin(); else playWrong()
    const res = { score: done.size, total: rows.length, durationMs: Date.now() - startedAt.current, reason, region }
    setResult(res)
    daily?.onFinish?.(res)
  }, [rows, mode, region, daily])

  // Timer (stops for good once the player switches to untimed)
  useEffect(() => {
    if (phase !== 'playing' || untimed) return
    const t = setInterval(() => setTimeLeft(s => s - 1), 1000)
    return () => clearInterval(t)
  }, [phase, untimed])
  useEffect(() => { if (phase === 'playing' && !untimed && timeLeft <= 0 && rows.length) finish('time') }, [timeLeft]) // eslint-disable-line react-hooks/exhaustive-deps

  const goUntimed = () => {
    setUntimed(true)
    setConfirmUntimed(false)
    markSession(mode, { untimed: true })   // whole game: no XP, no medals, no leaderboard
    setTimeout(() => inputRef.current?.focus(), 30)
  }

  const accept = useCallback((key) => {
    const ids = (index.get(key) ?? []).filter(id => !filledRef.current.has(id))
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
      if (quizId === 'flag') { incrementDailyCount('flags'); onDaily?.() }
    }
    filledRef.current = next
    if (Object.keys(newLabels).length) setLabels(l => ({ ...l, ...newLabels }))
    setFilled(next)
    setRecent(new Set(ids))
    setInput('')
    if (next.size === rows.length) finish('complete')
    else playCorrect()
    return true
  }, [index, rows, quizId, mode, finish, onDaily])

  const onChange = (e) => {
    const v = e.target.value
    setInput(v)
    clearTimeout(pendingRef.current)
    const k = norm(v)
    if (!k || !index.has(k)) return
    if (!(index.get(k) ?? []).some(id => !filledRef.current.has(id))) return
    // Another unanswered answer starts with this one? ("Niger" → "Nigeria") — wait a beat
    let longer = false
    for (const [key, ids] of index) {
      if (key.length > k.length && key.startsWith(k) && ids.some(id => !filledRef.current.has(id))) { longer = true; break }
    }
    if (longer) pendingRef.current = setTimeout(() => accept(k), PREFIX_WAIT_MS)
    else accept(k)
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      clearTimeout(pendingRef.current)
      if (!accept(norm(input)) && input.trim()) {
        e.currentTarget.classList.remove('tq-shake'); void e.currentTarget.offsetWidth; e.currentTarget.classList.add('tq-shake')
      }
    }
  }

  useEffect(() => () => clearTimeout(pendingRef.current), [])

  // Daily quiz: no setup screen — start right away with the day's fixed selection
  useEffect(() => {
    if (daily && phase === 'setup' && countryNames.length) start(daily.region, undefined, daily.size ?? 20)
  }, [daily, phase, countryNames.length]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Setup ────────────────────────────────────────────────────────────────
  if (phase === 'setup') {
    if (daily) return <div className="game-intro-wait">Loading today's quiz…</div>
    return (
      <div className="tq-setup">
        <SetupCard
          mode={quizId}
          icon={quiz.icon}
          title={quiz.title}
          desc={quiz.prompt}
          rules={[
            `⌨️ ${quiz.prompt} — any order, no Enter needed`,
            '⏱ The clock depends on how many answers there are',
            '🏳️ Give up any time to see what you missed',
            '✨ XP only for answers you haven\'t got before',
          ]}
          options={setupOptions}
          typeToStart
          onStart={(v, typed) => {
            const n = Number(v.size) || 20
            setSize(n)
            start(v.region ?? 'World', typed, n)
          }}
        />
      </div>
    )
  }

  // ── Play / results ─────────────────────────────────────────────────────────
  const total = rows.length
  const score = filled.size
  const playing = phase === 'playing'
  const danger = playing && timeLeft <= 30
  const pct = total ? Math.round((score / total) * 100) : 0

  return (
    <div className={`tq${playing ? '' : ' tq-done'}`}>
      <header className="tq-head">
        <div className="tq-title">
          <span className="tq-icon">{quiz.icon}</span>
          <div>
            <h2>{quiz.title}{region !== 'World' && <span className="tq-region"> · {region}</span>}</h2>
            <p>{quiz.prompt}</p>
          </div>
        </div>
        <div className="tq-stats">
          {untimed ? (
            <span className="tq-timer tq-untimed" title="Untimed — this game earns no XP">∞ Untimed · no XP</span>
          ) : (
            <>
              <span className={`tq-timer${danger ? ' danger' : ''}`}>⏱ {fmt(timeLeft)}</span>
              {playing && !daily && (
                <button className="tq-untimed-btn" onClick={() => setConfirmUntimed(true)} title="Stop the clock (no XP)">∞</button>
              )}
            </>
          )}
          <span className="tq-score"><strong>{score}</strong> / {total}</span>
        </div>
      </header>

      {confirmUntimed && (
        <div className="tq-modal-backdrop" onClick={() => setConfirmUntimed(false)}>
          <div className="tq-modal" role="dialog" aria-modal="true" onClick={e => e.stopPropagation()}>
            <div className="tq-modal-icon">∞</div>
            <h3>Play untimed?</h3>
            <ul>
              <li>⏸ The clock stops for the rest of this game.</li>
              <li>🔒 You can't turn it back on until you start a new game.</li>
              <li>🚫 This game earns <strong>no XP</strong> — including answers you've already given — and won't count for medals or leaderboards.</li>
            </ul>
            <div className="tq-modal-btns">
              <button className="tq-btn" onClick={() => setConfirmUntimed(false)}>Keep the timer</button>
              <button className="tq-btn tq-btn-warn" onClick={goUntimed} autoFocus>Yes, play untimed</button>
            </div>
          </div>
        </div>
      )}

      <div className="tq-bar">
        {playing ? (
          <>
            <input
              ref={inputRef}
              className="tq-input"
              value={input}
              onChange={onChange}
              onKeyDown={onKeyDown}
              placeholder="Enter answer…"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
            />
            <GiveUpButton onConfirm={() => finish('giveup')} />
          </>
        ) : (
          daily && result ? daily.renderResult(result) : <div className="tq-result">
            <span className="tq-result-msg">
              {endReason === 'complete' ? '🎉 Perfect — you got them all!' : endReason === 'time' ? '⌛ Time\'s up!' : '🏳️ You gave up.'}
              {' '}<strong>{score}/{total}</strong> ({pct}%)
            </span>
            <div className="tq-result-btns">
              <button className="tq-btn tq-btn-primary" onClick={() => start(region)}>▶ Play again</button>
              <button className="tq-btn" onClick={() => setPhase('setup')}>⚙ Settings</button>
            </div>
          </div>
        )}
      </div>

      <div className="tq-progress"><div style={{ width: `${pct}%` }} /></div>

      {quiz.layout === 'grid' ? (
        <div className="tq-grid">
          {rows.map(r => {
            const ok = filled.has(r.id)
            const cls = ok ? (recent.has(r.id) ? ' hit' : ' ok') : !playing ? ' missed' : ''
            return (
              <div key={r.id} className={`tq-cell${cls}`}>
                <Hint hint={r.hint} />
                <span className="tq-cell-answer">{ok ? (labels[r.id] ?? r.display) : !playing ? r.display : ''}</span>
              </div>
            )
          })}
        </div>
      ) : (
        <div className={`tq-table${quiz.columns.extra ? ' has-extra' : ''}${rows.some(r => r.hint.long) ? ' long' : ''}`}>
          <div className="tq-table-label">
            {quiz.columns.hint}{quiz.columns.extra ? ` · ${quiz.columns.extra}` : ''} <span>→</span> {quiz.columns.answer}
          </div>
          {rows.map(r => {
            const ok = filled.has(r.id)
            const cls = ok ? (recent.has(r.id) ? ' hit' : ' ok') : !playing ? ' missed' : ''
            return (
              <div key={r.id} className={`tq-row${cls}`}>
                <span className="tq-hint"><Hint hint={r.hint} /></span>
                {quiz.columns.extra && <span className="tq-extra">{r.extra}</span>}
                <span className="tq-answer">{ok ? (labels[r.id] ?? r.display) : !playing ? r.display : ''}</span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

