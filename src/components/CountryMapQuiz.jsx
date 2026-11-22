import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useCountryMap, divName, divLabel } from './countryMap/useCountryMap'
import { COUNTRY_MAP_QUIZZES } from '../data/countryMaps'
import { norm } from '../quizzes/tableQuizzes'
import { startSession, trackAnswer, finishGame, markSession, setPoolSize } from '../utils/results'
import { playCorrect, playWin, playWrong } from '../utils/sounds'
import { getSavedSetup, saveSetup } from './SetupCard'
import { ReadyOptions, StartButton, useTypeToStart } from './QuizReady'
import { setRules } from '../utils/rulesStore'
import { AttemptNote, QuizResultStats, pastRounds } from './QuizStats'
import GiveUpButton from './GiveUpButton'
import TryNext from './TryNext'
import QuizComments from './QuizComments'
import { t, isRo } from '../i18n'
import { inSiteLang } from '../utils/answerLang'
import GameIcon from './GameIcon'
import { plain } from '../utils/plain'
import ShareButton, { resultText } from './ShareButton'
import { useChallenge, ChallengeBanner, ChallengeResult, ChallengeButton } from './Challenge'
import StateNote from './StateNote'

/**
 * A flat 2D map of one country split into subdivisions (see data/countryMaps).
 * Type names in any order; each correct one fills in on the map with its label.
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

export default function CountryMapQuiz({ quizId, onOpen }) {
  const quiz = COUNTRY_MAP_QUIZZES[quizId]
  const mode = quizId
  const ch = useChallenge(quizId)   // opened from a friend's challenge link
  const { map, kind } = quiz

  // Items to find: every subdivision (or every one that has a seat, in seats mode)
  const items = useMemo(() => map.divisions
    .filter(d => kind === 'divisions' || d.seat)
    .map(d => ({
      id: d.id,
      answer: kind === 'seats' ? (isRo && d.seatRo) || d.seat : divName(d),
      county: divName(d),
      // only spellings in the site language (plus native / neutral ones)
      accepts: kind === 'seats'
        ? inSiteLang([d.seat, ...(d.seatRo ? [d.seatRo] : []), ...(d.seatAlt ?? [])], { en: d.seat, ro: d.seatRo ?? d.seat })
        : inSiteLang([d.name, ...(d.ro ? [d.ro] : []), ...(d.alt ?? [])], { en: d.name, ro: d.ro ?? d.name }),
    })), [map, kind])
  const index = useMemo(() => {
    const m = new Map()
    for (const it of items) for (const a of it.accepts) {
      const k = norm(a)
      if (!m.has(k)) m.set(k, [])
      if (!m.get(k).includes(it.id)) m.get(k).push(it.id)   // "Varșovia" and "Varsovia" are one key
    }
    return m
  }, [items])

  const { drawn, error: loadError } = useCountryMap(map)
  const options = useMemo(() => [CLOCK_OPTION()], [])
  const [phase, setPhase] = useState('setup')        // setup (map shown, not started) · playing · done
  const [setup, setSetup] = useState(() => getSavedSetup(quizId, options))
  const [timed, setTimed] = useState(() => setup.time !== 'free')
  const [timeLeft, setTimeLeft] = useState(TIME_S)
  const [found, setFound] = useState(() => new Set())
  const [recent, setRecent] = useState(null)
  const [input, setInput] = useState('')
  const [endReason, setEndReason] = useState(null)
  const [elapsed, setElapsed] = useState(0)
  const foundRef = useRef(found)
  const inputRef = useRef(null)
  const [lastRow, setLastRow] = useState(null)
  const prevRef = useRef([])
  const pendingRef = useRef(null)
  const startedAt = useRef(0)

  // ── Game flow ────────────────────────────────────────────────────────────
  const start = useCallback((values, typed) => {
    const isTimed = values?.time !== 'free'
    saveSetup(mode, values)
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
    setPoolSize(mode, items.length)   // left half-way: 9/42, not 9/9
    if (!isTimed) markSession(mode, { untimed: true })   // free play: no XP, medals or leaderboard
    inputRef.current?.focus()   // same input as before the start: keep the next keystrokes
    setTimeout(() => inputRef.current?.focus(), 30)
  }, [mode, items.length])

  // Before the start: the blank map, with the clock option in the answer bar
  const ready = phase === 'setup'
  const changeSetup = (v) => { saveSetup(mode, v); setSetup(v); setTimed(v.time !== 'free') }
  const beginNow = (typed) => start(setup, typed)
  useTypeToStart(ready, beginNow)
  const backToStart = () => {
    const empty = new Set()
    foundRef.current = empty
    setFound(empty); setRecent(null); setInput(''); setEndReason(null)
    setTimeLeft(TIME_S); setTimed(setup.time !== 'free')
    setPhase('setup')
  }

  useEffect(() => {
    setRules({
      icon: quiz.icon, title: quiz.title, desc: quiz.prompt,
      rules: [
        plain(t('⌨️ {prompt} — any order, no Enter needed', { prompt: quiz.prompt })),
        plain(t('🗺️ Each answer fills in on the map with its name')),
        ...(quiz.example ? [t('✅ Diacritics optional: "{plain}" works as well as "{exact}"', quiz.example)] : []),
        plain(t('🏳️ Give up any time to see what you missed')),
      ],
    })
  }, [quizId]) // eslint-disable-line react-hooks/exhaustive-deps

  const finish = useCallback((reason) => {
    clearTimeout(pendingRef.current)
    const done = foundRef.current
    for (const it of items) if (!done.has(it.id)) trackAnswer(mode, null, false, 0, it.id, { silent: true })
    setLastRow(finishGame(mode, { completed: true, meta: { map: map.id, kind } }))
    setElapsed(Date.now() - startedAt.current)
    setEndReason(reason)
    setPhase('done')
    if (reason === 'complete') playWin(); else playWrong()
  }, [items, mode, map.id, kind])

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
    // A longer open answer starts the same way? Wait a beat before accepting
    const mine = new Set(index.get(k))       // longer spellings of the same answer don't count
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

  // timer · untimed · score: in the sticky answer bar while playing, in the header once it's over
  const statsBlock = (
    <div className="tq-stats">
      {timed
        ? <span className={`tq-timer${playing && timeLeft <= 30 ? ' danger' : ''}`}>⏱ {fmt(timeLeft)}</span>
        : <span className="tq-timer tq-untimed" title={t('Untimed — this game earns no XP')}>{t('∞ Untimed · no XP')}</span>}
      <span className="tq-score"><strong>{score}</strong> / {total}</span>
    </div>
  )

  return (
    <div className={`tq cmq cmq-${kind}${over ? ' tq-done' : ''}${ready ? ' tq-ready' : ''}`}>
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

      {ready && <ReadyOptions options={options} values={setup} onChange={changeSetup} />}
      {ready && <AttemptNote mode={quizId} />}

      <div className="tq-bar">
        {!over ? (
          <>
            <input
              ref={inputRef}
              className="tq-input"
              value={input}
              onChange={ready ? (e => { if (/\p{L}/u.test(e.target.value)) beginNow(e.target.value) }) : onChange}
              onKeyDown={ready ? (e => { if (e.key === 'Enter') { e.preventDefault(); beginNow() } }) : onKeyDown}
              placeholder={ready ? t('Start typing to begin…') : quiz.placeholder ?? (kind === 'seats' ? t('Type a county seat…') : t('Type a county…'))}
              autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false}
              aria-label={quiz.prompt}
            />
            {statsBlock}
            {ready ? <StartButton onClick={() => beginNow()} /> : <GiveUpButton onConfirm={() => finish('giveup')} />}
          </>
        ) : (
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
              <button className="tq-btn tq-btn-primary" onClick={() => start({ time: timed ? '5' : 'free' })}>{t('▶ Play again')}</button>
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

      {(phase === 'done') && <QuizResultStats mode={quizId} row={lastRow} prev={prevRef.current} record={timed} />}

      <div className="cmq-map-wrap">
        {loadError && <StateNote kind="error">{t('Could not load the map. Check your connection and try again.')}</StateNote>}
        {!drawn && !loadError && <StateNote kind="loading">{t('Loading map…')}</StateNote>}
        {drawn && (
          <svg className="cmq-map" viewBox={`0 0 ${drawn.W} ${drawn.H}`} role="img" aria-label={quiz.title}>
            <defs><clipPath id={`cmq-clip-${mode}`}><rect width={drawn.W} height={drawn.H} /></clipPath></defs>
            <g className="cmq-ctx" clipPath={`url(#cmq-clip-${mode})`}>{drawn.ctx.map(c => <path key={c.key} d={c.d} />)}</g>
              {drawn.frames.length > 0 && <g className="cmq-frame">{drawn.frames.map(c => <path key={c.key} d={c.d} />)}</g>}
            {[false, true].map(cityLayer => (
              <g key={String(cityLayer)}>
                {drawn.subs.filter(s => s.city === cityLayer).map(s => {
                  const ok = found.has(s.id)
                  const inGame = !!itemById[s.id]
                  const cls = !inGame ? ' off' : ok ? (recent === s.id ? ' hit' : ' ok') : over ? ' missed' : ''
                  return <path key={s.id} d={s.d} className={`cmq-area${cls}`} />
                })}
              </g>
            ))}
            <g className="cmq-labels" aria-hidden="true">
              {drawn.subs.map(s => {
                const it = itemById[s.id]
                if (!it) return null
                const ok = found.has(s.id)
                if (!ok && !over) return null
                const [x, y] = drawn.labelPos[s.id] ?? [s.cx, s.cy]
                return (
                  <text key={s.id} x={x} y={y} className={`cmq-label${ok ? '' : ' missed'}${s.city || s.small ? ' tiny' : ''}`}>
                    {kind === 'seats' ? it.answer : divLabel(map.divisions.find(d => d.id === s.id), s.small, map)}
                  </text>
                )
              })}
            </g>
          </svg>
        )}
      </div>
      {phase === 'done' && onOpen && <TryNext mode={quizId} onOpen={onOpen} />}

      <QuizComments quiz={quizId} unlocked={over} />
      </div>
    </div>
  )
}
