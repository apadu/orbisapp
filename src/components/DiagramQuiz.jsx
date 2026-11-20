import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { DIAGRAM_QUIZZES } from '../quizzes/diagramQuizzes'
import { DIAGRAM_IDS } from '../quizzes/diagramIds'

if (import.meta.env?.DEV) {
  const a = Object.keys(DIAGRAM_QUIZZES).sort().join(), b = [...DIAGRAM_IDS].sort().join()
  if (a !== b) console.warn('[DiagramQuiz] diagramIds.js is out of step with DIAGRAM_QUIZZES')
}
import { norm } from '../quizzes/tableQuizzes'
import { startSession, trackAnswer, finishGame, markSession, setPoolSize } from '../utils/results'
import { playCorrect, playWin, playWrong } from '../utils/sounds'
import { getSavedSetup, saveSetup } from './SetupCard'
import { ReadyOptions, StartButton, useTypeToStart } from './QuizReady'
import { setRules } from '../utils/rulesStore'
import { AttemptNote, QuizResultStats, pastRounds } from './QuizStats'
import { useColumns, cellOf } from './TableQuiz'
import GiveUpButton from './GiveUpButton'
import TryNext from './TryNext'
import QuizComments from './QuizComments'
import { t, isRo } from '../i18n'
import GameIcon from './GameIcon'
import { plain } from '../utils/plain'
import ShareButton, { resultText } from './ShareButton'

/**
 * Diagram quizzes (layers of the Earth, the rock cycle…): a drawing with numbered parts and a
 * table of the numbers below (random order). Type names in any order; each correct one turns
 * green and shows its name on the drawing. Once the game is over every row shows a short fact.
 * The drawings live in src/quizzes/diagramQuizzes.jsx.
 */

const PREFIX_WAIT_MS = 700
const TIME_S = 5 * 60
const CLOCK_OPTION = () => ({
  id: 'time', label: t('Clock'),
  choices: [
    { value: '5', label: plain(t('⏱ 5 minutes')), hint: t('Earns XP and counts for the leaderboard') },
    { value: 'free', label: t('∞ No limit'), hint: t('Take your time — no XP, no leaderboard') },
  ],
})
const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.max(0, s) % 60).padStart(2, '0')}`

// "Linia Kármán" / "Kármán line" → also "Kármán"; "Ozone layer" → "Ozone"; "Igneous rock" → "Igneous"
const GENERIC = /^(linia|discontinuitatea|stratul( de)?|roca|roci|rocă|the)\s+|\s+(layer|line|discontinuity|rock|rocks)$/i
const shortForms = (s) => { const x = s.replace(GENERIC, '').trim(); return x && x !== s ? [s, x] : [s] }

/** The drawing, with a numbered badge on every part; found parts turn green and get their name. */
function Diagram({ quiz, items, numberOf, found, recent, over, focus }) {
  const stateOf = (id) => found.has(id) ? (recent === id ? ' hit' : ' ok') : over ? ' missed' : ''
  const nameOf = Object.fromEntries(items.map(it => [it.id, it.answer]))
  const shown = (id) => found.has(id) || over
  const cls = (id) => `${stateOf(id)}${focus === id ? ' focus' : ''}`
  const [x, y, w, h] = quiz.viewBox
  return (
    <div className="dgq-wrap">
      <svg className="dgq-svg" viewBox={quiz.viewBox.join(' ')} role="img" aria-label={quiz.title} style={{ '--ar': w / h }}>
        <rect x={x} y={y} width={w} height={h} className="dgq-bg" />
        {quiz.draw({ cls, shown, name: (id) => nameOf[id] })}
        <g className="lfq-badges">
          {quiz.items.map(p => (
            <g key={p.id} className={`dgq-part${cls(p.id)}`}>
              {p.leader && <path d={`M${p.leader[0]} ${p.leader[1]} L${p.badge[0]} ${p.badge[1]}`} className="dgq-leader" />}
              <g className={`lfq-badge${cls(p.id)}`} transform={`translate(${p.badge[0]} ${p.badge[1]})`}>
                <circle r={15} style={{ strokeWidth: 2.4 }} />
                <text style={{ fontSize: 17 }} dy={6}>{numberOf[p.id]}</text>
              </g>
            </g>
          ))}
        </g>
      </svg>
    </div>
  )
}

// The same order for every player on a given day
function seededShuffle(a, seed) {
  let t = seed >>> 0
  const rnd = () => { t += 0x6D2B79F5; let r = Math.imul(t ^ (t >>> 15), 1 | t); r ^= r + Math.imul(r ^ (r >>> 7), 61 | r); return ((r ^ (r >>> 14)) >>> 0) / 4294967296 }
  const x = [...a]
  for (let i = x.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [x[i], x[j]] = [x[j], x[i]] }
  return x
}

const shuffled = (a) => {
  const x = [...a]
  for (let i = x.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [x[i], x[j]] = [x[j], x[i]] }
  return x
}

/** daily: { day, seed, onStart(), onFinish(result), renderResult(result) } — Daily Fever mode:
 *  one attempt, timed, numbers in a seeded order (the same for everyone), tracked as 'daily-quiz'. */
export default function DiagramQuiz({ quizId, onOpen, daily = null }) {
  const quiz = DIAGRAM_QUIZZES[quizId]
  const mode = daily ? 'daily-quiz' : quizId

  const items = useMemo(() => quiz.items.map(d => {
    const name = (isRo && d.ro) || d.name
    const pool = isRo ? [d.ro ?? d.name, ...(d.roAlt ?? d.alt ?? [])] : [d.name, ...(d.alt ?? [])]
    return { id: d.id, answer: name, accepts: pool.flatMap(shortForms), info: isRo ? d.roInfo : d.info }
  }), [quiz])
  const index = useMemo(() => {
    const m = new Map()
    for (const it of items) for (const a of it.accepts) {
      const k = norm(a)
      if (!k) continue
      if (!m.has(k)) m.set(k, [])
      if (!m.get(k).includes(it.id)) m.get(k).push(it.id)
    }
    return m
  }, [items])

  // Table order (and the numbers on the map): random, new every game
  const [order, setOrder] = useState(() => (daily ? seededShuffle(items.map(it => it.id), daily.seed) : shuffled(items.map(it => it.id))))
  const numberOf = useMemo(() => Object.fromEntries(order.map((id, i) => [id, i + 1])), [order])

  const options = useMemo(() => [CLOCK_OPTION()], [])
  const [phase, setPhase] = useState('setup')        // setup (map shown, not started) · playing · done
  const [setup, setSetup] = useState(() => (daily ? { time: '5' } : getSavedSetup(quizId, options)))
  const [dailyResult, setDailyResult] = useState(null)
  const [timed, setTimed] = useState(() => setup.time !== 'free')
  const [timeLeft, setTimeLeft] = useState(TIME_S)
  const [found, setFound] = useState(() => new Set())
  const [recent, setRecent] = useState(null)
  const [focus, setFocus] = useState(null)
  const [input, setInput] = useState('')
  const [endReason, setEndReason] = useState(null)
  const [elapsed, setElapsed] = useState(0)
  const foundRef = useRef(found)
  const inputRef = useRef(null)
  const [lastRow, setLastRow] = useState(null)
  const prevRef = useRef([])
  const pendingRef = useRef(null)
  const startedAt = useRef(0)
  const [colsRef, cols] = useColumns(250)

  const start = useCallback((values, typed, reshuffle = false) => {
    const isTimed = values?.time !== 'free'
    if (!daily) saveSetup(mode, values)
    if (reshuffle) setOrder(shuffled(items.map(it => it.id)))
    setTimed(isTimed)
    setTimeLeft(TIME_S)
    const empty = new Set()
    foundRef.current = empty
    setFound(empty)
    setRecent(null)
    setInput(typed ?? '')
    setEndReason(null)
    setPhase('playing')
    startedAt.current = Date.now()
    prevRef.current = pastRounds(mode)
    setLastRow(null)
    startSession(mode)
    if (daily) { markSession(mode, { day: daily.day, quizId }); daily.onStart?.() }
    setPoolSize(mode, items.length)
    if (!isTimed) markSession(mode, { untimed: true })
    inputRef.current?.focus()
    setTimeout(() => inputRef.current?.focus(), 30)
  }, [mode, items, daily, quizId])

  const ready = phase === 'setup'
  const changeSetup = (v) => { saveSetup(mode, v); setSetup(v); setTimed(v.time !== 'free') }
  const beginNow = (typed) => start(setup, typed)
  useTypeToStart(ready, beginNow)
  const backToStart = () => {
    const empty = new Set()
    foundRef.current = empty
    setFound(empty); setRecent(null); setInput(''); setEndReason(null)
    setTimeLeft(TIME_S); setTimed(setup.time !== 'free')
    setOrder(shuffled(items.map(it => it.id)))
    setPhase('setup')
  }

  useEffect(() => {
    setRules({
      icon: quiz.icon, title: quiz.title, desc: quiz.prompt,
      rules: [
        plain(t('⌨️ {prompt} — any order, no Enter needed', { prompt: quiz.prompt })),
        plain(t('🔢 Each part has a number on the drawing; the table below follows those numbers')),
        plain(t('💡 When the game ends, every row shows a short fact')),
        plain(t('🏳️ Give up any time to see what you missed')),
      ],
    })
  }, [quizId]) // eslint-disable-line react-hooks/exhaustive-deps

  const finish = useCallback((reason) => {
    clearTimeout(pendingRef.current)
    const done = foundRef.current
    for (const it of items) if (!done.has(it.id)) trackAnswer(mode, null, false, 0, it.id, { silent: true })
    setLastRow(finishGame(mode, { completed: true, meta: { diagram: quizId } }))
    setElapsed(Date.now() - startedAt.current)
    setEndReason(reason)
    setPhase('done')
    if (reason === 'complete') playWin(); else playWrong()
    if (daily) {
      const res = { score: done.size, total: items.length, durationMs: Date.now() - startedAt.current, reason }
      setDailyResult(res)
      daily.onFinish?.(res)
    }
  }, [items, mode, quizId, daily])

  useEffect(() => {
    if (phase !== 'playing' || !timed) return
    const id = setInterval(() => setTimeLeft(s => s - 1), 1000)
    return () => clearInterval(id)
  }, [phase, timed])
  useEffect(() => { if (phase === 'playing' && timed && timeLeft <= 0) finish('time') }, [timeLeft]) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => () => clearTimeout(pendingRef.current), [])

  const accept = useCallback((key) => {
    const ids = (index.get(key) ?? []).filter(id => !foundRef.current.has(id))
    if (!ids.length) return false
    const next = new Set(foundRef.current)
    for (const id of ids) { next.add(id); trackAnswer(mode, null, true, 10, id) }
    foundRef.current = next
    setFound(next)
    setRecent(ids[0])
    setInput('')
    if (next.size === items.length) finish('complete')
    else playCorrect()
    return true
  }, [index, mode, items.length, finish])

  const onChange = (e) => {
    const v = e.target.value
    setInput(v)
    clearTimeout(pendingRef.current)
    const k = norm(v)
    if (!k || !(index.get(k) ?? []).some(id => !foundRef.current.has(id))) return
    const mine = new Set(index.get(k))
    let longer = false
    for (const [key, ids] of index) {
      if (key.length > k.length && key.startsWith(k) && ids.some(id => !foundRef.current.has(id) && !mine.has(id))) { longer = true; break }
    }
    if (longer) pendingRef.current = setTimeout(() => accept(k), PREFIX_WAIT_MS)
    else accept(k)
  }
  const onKeyDown = (e) => {
    if (e.key !== 'Enter') return
    clearTimeout(pendingRef.current)
    if (!accept(norm(input)) && input.trim()) {
      e.currentTarget.classList.remove('tq-shake'); void e.currentTarget.offsetWidth; e.currentTarget.classList.add('tq-shake')
    }
  }

  // ── Render ───────────────────────────────────────────────────────────────
  const total = items.length
  const score = found.size
  const playing = phase === 'playing'
  const over = phase === 'done'
  const pct = total ? Math.round((score / total) * 100) : 0
  const itemById = Object.fromEntries(items.map(it => [it.id, it]))
  const missedCount = total - score

  const statsBlock = (
    <div className="tq-stats">
      {timed
        ? <span className={`tq-timer${playing && timeLeft <= 30 ? ' danger' : ''}`}>⏱ {fmt(timeLeft)}</span>
        : <span className="tq-timer tq-untimed" title={t('Untimed — this game earns no XP')}>{t('∞ Untimed · no XP')}</span>}
      <span className="tq-score"><strong>{score}</strong> / {total}</span>
    </div>
  )

  return (
    <div className={`tq lfq dgq${over ? ' tq-done' : ''}${ready ? ' tq-ready' : ''}`}>
      <header className="tq-head">
        <div className="tq-title">
          <span className="tq-icon"><GameIcon id={quizId} size={24} /></span>
          <div>
            <h2>{quiz.title}</h2>
            <p>{quiz.prompt}</p>
          </div>
        </div>
        {over && statsBlock}
      </header>

      {ready && !daily && <ReadyOptions options={options} values={setup} onChange={changeSetup} />}
      {ready && !daily && <AttemptNote mode={quizId} />}
      {ready && daily && <p className="qs-attempt tq-daily-note">{t('One attempt — once you start, leaving counts as your attempt.')}</p>}

      <div className="tq-bar">
        {!over ? (
          <>
            <input
              ref={inputRef}
              className="tq-input"
              value={input}
              onChange={ready ? (e => { if (/\p{L}/u.test(e.target.value)) beginNow(e.target.value) }) : onChange}
              onKeyDown={ready ? (e => { if (e.key === 'Enter') { e.preventDefault(); beginNow() } }) : onKeyDown}
              placeholder={ready ? t('Start typing to begin…') : quiz.placeholder}
              autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false}
              aria-label={quiz.prompt}
            />
            {statsBlock}
            {ready ? <StartButton onClick={() => beginNow()} /> : <GiveUpButton onConfirm={() => finish('giveup')} />}
          </>
        ) : daily && dailyResult ? daily.renderResult(dailyResult) : (
          <div className="tq-result">
            <span className="tq-result-msg">
              {endReason === 'complete'
                ? plain(t('🎉 All {total} in {time}!', { total, time: fmt(Math.round(elapsed / 1000)) }))
                : endReason === 'time' ? plain(t('⌛ Time\'s up!')) : plain(t('🏳️ You gave up.'))}
              {' '}<strong>{score}/{total}</strong> ({pct}%)
              {endReason !== 'complete' && missedCount > 0 && <span className="cmq-missed-note"> · {t('{n} missed, shown in red', { n: missedCount })}</span>}
            </span>
            <div className="tq-result-btns">
              <button className="tq-btn tq-btn-primary" onClick={() => start({ time: timed ? '5' : 'free' }, '', true)}>{t('▶ Play again')}</button>
              <button className="tq-btn" onClick={backToStart}>{plain(t('⚙ Settings'))}</button>
              <ShareButton text={() => resultText({ title: quiz.title, score, total, extra: endReason === 'complete' ? fmt(Math.round(elapsed / 1000)) : null })} />
            </div>
          </div>
        )}
      </div>

      <div className="tq-progress"><div style={{ width: `${pct}%` }} /></div>

      {over && !daily && <QuizResultStats mode={quizId} row={lastRow} prev={prevRef.current} record={timed} />}

      <Diagram quiz={quiz} items={items} numberOf={numberOf} found={found} recent={recent} over={over} focus={focus} />
      {quiz.note && <p className="dgq-note">{quiz.note}</p>}

      <div className="tq-table lfq-table">
        <div ref={colsRef} className="tq-cols" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
          {order.map((id, i) => {
            const it = itemById[id]
            const ok = found.has(id)
            const cls = ok ? (recent === id ? ' hit' : ' ok') : over ? ' missed' : ''
            return (
              <div key={id} className={`tq-row lfq-row${cls}`} style={cellOf(i, order.length, cols)}
                onMouseEnter={() => setFocus(id)} onMouseLeave={() => setFocus(f => (f === id ? null : f))}>
                <span className="lfq-num">{i + 1}</span>
                <span className="tq-answer">{ok || over ? it.answer : ''}</span>
                {over && it.info && <span className="dgq-info">{it.info}</span>}
              </div>
            )
          })}
        </div>
      </div>

      {over && !daily && onOpen && <TryNext mode={quizId} onOpen={onOpen} />}
      {!daily && <QuizComments quiz={quizId} unlocked={over} />}
    </div>
  )
}
