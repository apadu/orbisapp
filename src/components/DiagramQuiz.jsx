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
import { StartButton, useTypeToStart } from './QuizReady'
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
import { useChallenge, ChallengeBanner, ChallengeResult, ChallengeButton } from './Challenge'

/**
 * Diagram quizzes (layers of the Earth, the rock cycle…): a drawing with numbered parts and a
 * table of the numbers below (random order). Type names in any order; each correct one turns
 * green and shows its name on the drawing. Once the game is over every row shows a short fact.
 * The drawings live in src/quizzes/diagramQuizzes.jsx.
 */

const PREFIX_WAIT_MS = 700
const TIME_S = 5 * 60
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
  // On a phone the drawing is fitted to the screen: badges grow so they stay tappable/readable,
  // and a zoom button lets you see the drawing bigger (then it scrolls sideways).
  const wrapRef = useRef(null)
  const [px, setPx] = useState(1000)
  const [zoomed, setZoomed] = useState(false)
  useEffect(() => {
    const el = wrapRef.current
    if (!el || typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(([e]) => setPx(e.contentRect.width))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  const narrow = px < 640
  const k = narrow && !zoomed ? Math.min(2, Math.max(1, (w / px) * 0.5)) : 1
  return (
    <div ref={wrapRef} className={`dgq-wrap${narrow ? ' narrow' : ''}${zoomed ? ' zoomed' : ''}`}>
      {narrow && (
        <button type="button" className="dgq-zoom" onClick={() => setZoomed(z => !z)} aria-pressed={zoomed}>
          {zoomed ? t('Fit to screen') : t('Zoom in')}
        </button>
      )}
      <svg className="dgq-svg" viewBox={quiz.viewBox.join(' ')} role="img" aria-label={quiz.title} style={{ '--ar': w / h }}>
        <rect x={x} y={y} width={w} height={h} className="dgq-bg" />
        {quiz.draw({ cls, shown, name: (id) => nameOf[id] })}
        <g className="lfq-badges">
          {quiz.items.map(p => (
            <g key={p.id} className={`dgq-part${cls(p.id)}`}>
              {p.leader && <path d={`M${p.leader[0]} ${p.leader[1]} L${p.badge[0]} ${p.badge[1]}`} className="dgq-leader" />}
              <g className={`lfq-badge${cls(p.id)}`} transform={`translate(${p.badge[0]} ${p.badge[1]}) scale(${k})`}>
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
  const ch = useChallenge(daily ? null : quizId)   // opened from a friend's challenge link

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

  const [phase, setPhase] = useState('setup')        // setup (map shown, not started) · playing · done
  const [dailyResult, setDailyResult] = useState(null)
  // every game starts on the clock; ∞ (not in the daily) turns it off for the rest of that game
  const [timed, setTimed] = useState(true)
  const [confirmUntimed, setConfirmUntimed] = useState(false)
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
    if (reshuffle) setOrder(shuffled(items.map(it => it.id)))
    setTimed(true)
    setConfirmUntimed(false)
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
    inputRef.current?.focus()
    setTimeout(() => inputRef.current?.focus(), 30)
  }, [mode, items, daily, quizId])

  const ready = phase === 'setup'
  const goUntimed = () => {
    setTimed(false)
    setConfirmUntimed(false)
    markSession(mode, { untimed: true })   // whole game: no XP, no medals, no leaderboard
    setTimeout(() => inputRef.current?.focus(), 30)
  }
  const beginNow = (typed) => start(null, typed)
  useTypeToStart(ready, beginNow)
  const backToStart = () => {
    const empty = new Set()
    foundRef.current = empty
    setFound(empty); setRecent(null); setInput(''); setEndReason(null)
    setTimeLeft(TIME_S); setTimed(true); setConfirmUntimed(false)
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
    if (phase !== 'playing' || !timed || confirmUntimed) return
    const id = setInterval(() => setTimeLeft(s => s - 1), 1000)
    return () => clearInterval(id)
  }, [phase, timed, confirmUntimed])
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
        ? <>
            <span className={`tq-timer${playing && timeLeft <= 30 ? ' danger' : ''}`}>⏱ {fmt(timeLeft)}</span>
            {playing && !daily && <button className="tq-untimed-btn" onClick={() => setConfirmUntimed(true)} title={t('Stop the clock (no XP)')}>∞</button>}
          </>
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
      <ChallengeBanner ch={ch} />

      {confirmUntimed && (
        <div className="tq-modal-backdrop" onClick={() => setConfirmUntimed(false)}>
          <div className="tq-modal" role="dialog" aria-modal="true" onClick={e => e.stopPropagation()}>
            <div className="tq-modal-icon">∞</div>
            <h3>{t('Play untimed?')}</h3>
            <ul>
              <li>{plain(t('⏸ The clock stops for the rest of this game.'))}</li>
              <li>{plain(t('🔒 You can\'t turn it back on until you start a new game.'))}</li>
              <li>{plain(t('🚫 This game earns'))} <strong>{t('no XP')}</strong> {t('and won\'t count for leaderboards.')}</li>
            </ul>
            <div className="tq-modal-btns">
              <button className="tq-btn" onClick={() => setConfirmUntimed(false)}>{t('Keep the timer')}</button>
              <button className="tq-btn tq-btn-warn" onClick={goUntimed} autoFocus>{t('Yes, play untimed')}</button>
            </div>
          </div>
        </div>
      )}
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
            <ChallengeResult ch={ch} score={score} total={total} ms={endReason === 'complete' ? elapsed : undefined} />
            <div className="tq-result-btns">
              <button className="tq-btn tq-btn-primary" onClick={() => start(null, '', true)}>{t('▶ Play again')}</button>
              <button className="tq-btn" onClick={backToStart}>{plain(t('⚙ Settings'))}</button>
              <ShareButton text={() => resultText({ title: quiz.title, score, total, extra: endReason === 'complete' ? fmt(Math.round(elapsed / 1000)) : null })} />
              <ChallengeButton mode={quizId} title={quiz.title} score={score} total={total} ms={endReason === 'complete' ? elapsed : undefined} rematch={!!ch} />
            </div>
          </div>
        )}
      </div>

      {/* everything under the answer bar: on a phone with the keyboard open, only this scrolls */}
      <div className="tq-scroll">
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
    </div>
  )
}
