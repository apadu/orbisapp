import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { LANDFORM_QUIZZES } from '../quizzes/landformQuizzes'
import { LANDFORMS } from '../data/landforms'
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
import { useChallenge, ChallengeBanner, ChallengeResult, ChallengeButton } from './Challenge'
import StateNote from './StateNote'

/**
 * Famous islands / peninsulas: every one is lit up and numbered on a 2D world map, with a
 * table of the numbers below (random order). Type names in any order; each correct one
 * turns green on the map and fills its row. Maps are pre-rendered (scripts/build-landforms.mjs).
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

// "Peninsula Iberică" / "Iberian Peninsula" / "Insula Baffin" / "Baffin Island" → also "Iberică", "Iberian", "Baffin"
// (and likewise "Lacul Baikal" → "Baikal", "Strait of Gibraltar" → "Gibraltar", "Gobi Desert" → "Gobi")
const GENERIC = /^((mount|cascada|cascadele|vârful|varful|insulele|lacurile|ghețarul|ghetarul|fiordul|depresiunea|delta|tropicul|curentul|fosa|groapa|dorsala|riftul|muntele|vulcanul|placa|peninsula|insula|isla|ile|lacul|lake|lago|lac|marea|deșertul|desertul|strâmtoarea|stramtoarea|canalul|pasajul|golful|portul)\s+|(strait|straits|sea|gulf|bay|lake|tropic) of\s+(the\s+)?)|\s+(falls|waterfall|waterfalls|glacier|islands|delta|depression|lakes|current|trench|ridge|rise|plate|peninsula|island|isle|lake|sea|desert|strait|channel|passage|gulf|bay|canal)$/i
const shortForms = (s) => { const x = s.replace(GENERIC, '').trim(); return x && x !== s ? [s, x] : [s] }

const base = (import.meta.env?.BASE_URL ?? '/').replace(/\/$/, '')
const cache = new Map()
function loadJson(file) {
  if (!cache.has(file)) {
    cache.set(file, fetch(`${base}/data/landforms/${file}`).then(r => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`)
      return r.json()
    }).catch(e => { cache.delete(file); throw e }))
  }
  return cache.get(file)
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

// ── Zoomable map ─────────────────────────────────────────────────────────────
const MAX_ZOOM = 6
const MARGIN_X = 0.012, MARGIN_Y = 0.035    // ocean around the world when zoomed out (share of the map size)
/** Zoom / pan inside the frame { x0, y0, W, H } (map units); the view keeps the frame's proportions. */
function useZoom({ x0, y0, W, H }, initial = null) {
  const [view, setView] = useState(initial)            // { x, y, w } in map units; h follows the aspect ratio
  const full = { x: x0, y: y0, w: W }
  const v = view ?? full
  const clamp = useCallback((n) => {
    const w = Math.min(W, Math.max(W / MAX_ZOOM, n.w))
    const h = w * H / W
    return { w, x: Math.min(x0 + W - w, Math.max(x0, n.x)), y: Math.min(y0 + H - h, Math.max(y0, n.y)) }
  }, [x0, y0, W, H])
  const zoomAt = useCallback((factor, fx = 0.5, fy = 0.5) => setView(cur => {
    const c = cur ?? { x: x0, y: y0, w: W }
    const h = c.w * H / W
    const w = c.w / factor
    return clamp({ w, x: c.x + (c.w - w) * fx, y: c.y + (h - w * H / W) * fy })
  }), [x0, y0, W, H, clamp])
  const panBy = useCallback((dx, dy) => setView(cur => {
    const c = cur ?? { x: x0, y: y0, w: W }
    return clamp({ ...c, x: c.x + dx, y: c.y + dy })
  }), [x0, y0, W, clamp])
  const reset = useCallback(() => setView(initial), [initial])
  return { v, h: v.w * H / W, zoomAt, panBy, reset, zoomed: !!view && view.w < W - 0.5 }
}

function LandformMap({ world, map, numberOf, found, recent, over, focus, title, bounds }) {
  const frame = useMemo(() => {
    const mx = world.W * MARGIN_X, my = world.H * MARGIN_Y
    return { x0: -mx, y0: -my, W: world.W + 2 * mx, H: world.H + 2 * my }
  }, [world.W, world.H])
  // A quiz about one continent opens zoomed in on it: bounds = [west, south, east, north]
  const initial = useMemo(() => {
    if (!bounds) return null
    const k = world.W / 360, LAT_TOP = 84
    const [w, s, e, n] = bounds
    const bx = (w + 180) * k, by = (LAT_TOP - n) * k, bw = (e - w) * k, bh = (n - s) * k
    const vw = Math.min(frame.W, Math.max(bw, bh * frame.W / frame.H))
    const vh = vw * frame.H / frame.W
    const x = Math.min(frame.x0 + frame.W - vw, Math.max(frame.x0, bx + bw / 2 - vw / 2))
    const y = Math.min(frame.y0 + frame.H - vh, Math.max(frame.y0, by + bh / 2 - vh / 2))
    return { x, y, w: vw }
  }, [bounds, world.W, frame])
  const { v, h, zoomAt, panBy, reset, zoomed } = useZoom(frame, initial)
  const svgRef = useRef(null)
  const drag = useRef(null)
  // map units per screen pixel: rings, badges and lines keep the same size on screen at any zoom
  const [widthPx, setWidthPx] = useState(1000)
  useEffect(() => {
    const el = svgRef.current
    if (!el) return
    const ro = new ResizeObserver(() => setWidthPx(el.getBoundingClientRect().width || 1000))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  const px = v.w / widthPx

  // wheel to zoom at the cursor (not passive, so the page doesn't scroll)
  useEffect(() => {
    const el = svgRef.current
    if (!el) return
    const onWheel = (e) => {
      if (!e.ctrlKey && !e.metaKey && !zoomed && e.deltaY > 0) return   // let the page scroll past an unzoomed map
      e.preventDefault()
      const r = el.getBoundingClientRect()
      zoomAt(e.deltaY < 0 ? 1.25 : 0.8, (e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height)
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [zoomAt, zoomed])

  const onPointerDown = (e) => {
    if (!zoomed) return
    drag.current = { x: e.clientX, y: e.clientY, w: svgRef.current.getBoundingClientRect().width }
    e.currentTarget.setPointerCapture(e.pointerId)
  }
  const onPointerMove = (e) => {
    const d = drag.current
    if (!d) return
    const k = v.w / d.w
    panBy(-(e.clientX - d.x) * k, -(e.clientY - d.y) * k)
    drag.current = { ...d, x: e.clientX, y: e.clientY }
  }
  const endDrag = () => { drag.current = null }

  const stateOf = (id) => found.has(id) ? (recent === id ? ' hit' : ' ok') : over ? ' missed' : ''
  const items = [...map.items].sort((a, b) => (a.small === b.small ? 0 : a.small ? 1 : -1))   // small ones on top

  return (
    <div className={`lfq-map-wrap${zoomed ? ' zoomed' : ''}`}>
      <svg
        ref={svgRef} className="lfq-map" viewBox={`${v.x} ${v.y} ${v.w} ${h}`} role="img" aria-label={title}
        style={{ '--ar': frame.W / frame.H }}
        onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={endDrag} onPointerCancel={endDrag}
        onDoubleClick={(e) => { const r = svgRef.current.getBoundingClientRect(); zoomAt(2, (e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height) }}
      >
        <rect x={frame.x0} y={frame.y0} width={frame.W} height={frame.H} className="lfq-sea" />
        <path d={world.land} className="lfq-land" />
        <path d={world.lakes} className="lfq-lake" />
        <path d={world.borders} className="lfq-border" style={{ strokeWidth: 0.6 * px }} />
        {items.some(it => it.arrow) && (
          <defs>
            <marker id="lfq-arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="3.2" markerHeight="3.2" orient="auto">
              <path d="M0 0 L10 5 L0 10 z" className="lfq-arrowhead" />
            </marker>
          </defs>
        )}
        {items.map(it => it.line ? (
          <path key={it.id} d={it.d} className={`lfq-item lfq-line${stateOf(it.id)}${focus === it.id ? ' focus' : ''}`}
            markerEnd={it.arrow ? 'url(#lfq-arrow)' : undefined}
            style={{ strokeWidth: 3.2 * px, ...(it.color && !stateOf(it.id) && focus !== it.id ? { stroke: it.color } : {}) }} />
        ) : (
          <path key={it.id} d={it.d} className={`lfq-item${stateOf(it.id)}${focus === it.id ? ' focus' : ''}${it.color ? ' tinted' : ''}`} style={{ strokeWidth: 1 * px, ...(it.color && !stateOf(it.id) && focus !== it.id ? { fill: it.color } : {}) }} />
        ))}
        {items.filter(it => it.small).map(it => (
          <circle key={it.id} cx={it.cx} cy={it.cy} r={10 * px} className={`lfq-ring${stateOf(it.id)}${focus === it.id ? ' focus' : ''}`} style={{ strokeWidth: 1.6 * px }} />
        ))}
        <g className="lfq-badges" aria-hidden="true">
          {items.map(it => {
            const r = 8 * px
            const x = it.small ? it.cx + 10 * px : it.cx, y = it.small ? it.cy - 10 * px : it.cy
            return (
              <g key={it.id} className={`lfq-badge${stateOf(it.id)}${focus === it.id ? ' focus' : ''}`} transform={`translate(${x} ${y})`}>
                <circle r={r} style={{ strokeWidth: 1.3 * px }} />
                <text style={{ fontSize: 9.5 * px }} dy={0.35 * 9.5 * px}>{numberOf[it.id]}</text>
              </g>
            )
          })}
        </g>
      </svg>
      <div className="lfq-zoom">
        <button type="button" onClick={() => zoomAt(1.6)} aria-label={t('Zoom in')}>+</button>
        <button type="button" onClick={() => zoomAt(1 / 1.6)} aria-label={t('Zoom out')} disabled={!zoomed}>−</button>
        {(zoomed || initial) && <button type="button" className="lfq-zoom-reset" onClick={reset}>{t('Reset')}</button>}
      </div>
    </div>
  )
}

/** daily: { day, seed, onStart(), onFinish(result), renderResult(result) } — Daily Fever mode:
 *  one attempt, timed, numbers in a seeded order (the same for everyone), tracked as 'daily-quiz'. */
export default function LandformQuiz({ quizId, onOpen, daily = null }) {
  const quiz = LANDFORM_QUIZZES[quizId]
  const mode = daily ? 'daily-quiz' : quizId
  const ch = useChallenge(daily ? null : quizId)   // opened from a friend's challenge link

  const items = useMemo(() => LANDFORMS[quiz.set].map(d => {
    const name = (isRo && d.ro) || d.name
    const pool = isRo ? [d.ro ?? d.name, ...(d.roAlt ?? d.alt ?? [])] : [d.name, ...(d.alt ?? [])]
    return { id: d.id, answer: name, accepts: pool.flatMap(shortForms), hint: (isRo && d.roHint) || d.hint || null }
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

  // Maps: the shared world background + this quiz's items
  const [world, setWorld] = useState(null)
  const [map, setMap] = useState(null)
  const [loadError, setLoadError] = useState(false)
  useEffect(() => {
    let alive = true
    Promise.all([loadJson('world.json'), loadJson(quiz.file)])
      .then(([w, m]) => { if (alive) { setWorld(w); setMap(m) } })
      .catch(() => { if (alive) setLoadError(true) })
    return () => { alive = false }
  }, [quiz.file])

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
  const [colsRef, cols] = useColumns(items.some(x => x.hint) ? 400 : 250)   // clues need wider cells

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
        plain(t('🔢 Each one has a number on the map; the table below follows those numbers')),
        plain(t('🔍 Zoom with the + / − buttons, the mouse wheel or a double click; drag to move around')),
        plain(t('🏳️ Give up any time to see what you missed')),
      ],
    })
  }, [quizId]) // eslint-disable-line react-hooks/exhaustive-deps

  const finish = useCallback((reason) => {
    clearTimeout(pendingRef.current)
    const done = foundRef.current
    for (const it of items) if (!done.has(it.id)) trackAnswer(mode, null, false, 0, it.id, { silent: true })
    setLastRow(finishGame(mode, { completed: true, meta: { landforms: quizId } }))
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
    <div className={`tq lfq${over ? ' tq-done' : ''}${ready ? ' tq-ready' : ''}`}>
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
            <ChallengeResult ch={ch} score={score} total={total} ms={endReason === 'complete' ? elapsed : undefined} />
            <div className="tq-result-btns">
              <button className="tq-btn tq-btn-primary" onClick={() => start({ time: timed ? '5' : 'free' }, '', true)}>{t('▶ Play again')}</button>
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

      {loadError && <StateNote kind="error">{t('Could not load the map. Check your connection and try again.')}</StateNote>}
      {!loadError && !(world && map) && <StateNote kind="loading">{t('Loading map…')}</StateNote>}
      {world && map && (
        <LandformMap world={world} map={map} numberOf={numberOf} found={found} recent={recent} over={over} focus={focus} title={quiz.title} bounds={quiz.view} />
      )}

      <div className={`tq-table lfq-table${items.some(x => x.hint) ? ' lfq-hinted' : ''}`}>
        <div ref={colsRef} className="tq-cols" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
          {order.map((id, i) => {
            const it = itemById[id]
            const ok = found.has(id)
            const cls = ok ? (recent === id ? ' hit' : ' ok') : over ? ' missed' : ''
            return (
              <div key={id} className={`tq-row lfq-row${cls}`} style={cellOf(i, order.length, cols)}
                onMouseEnter={() => setFocus(id)} onMouseLeave={() => setFocus(f => (f === id ? null : f))}>
                <span className="lfq-num">{i + 1}</span>
                {it.hint && <span className="lfq-hint">{it.hint}</span>}
                <span className="tq-answer">{ok || over ? it.answer : ''}</span>
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
