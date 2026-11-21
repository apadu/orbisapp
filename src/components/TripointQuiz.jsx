import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { TRIPOINT_QUIZZES } from '../quizzes/tripointQuizzes'
import { countryAnswers, norm } from '../quizzes/tableQuizzes'
import { startSession, trackAnswer, finishGame, setPoolSize } from '../utils/results'
import { playCorrect, playWin, playWrong } from '../utils/sounds'
import { StartButton, useTypeToStart } from './QuizReady'
import { setRules } from '../utils/rulesStore'
import { AttemptNote, QuizResultStats, pastRounds } from './QuizStats'
import GiveUpButton from './GiveUpButton'
import TryNext from './TryNext'
import QuizComments from './QuizComments'
import GameIcon from './GameIcon'
import ShareButton, { resultText } from './ShareButton'
import { useChallenge, ChallengeBanner, ChallengeResult, ChallengeButton } from './Challenge'
import { t, cn } from '../i18n'
import { plain } from '../utils/plain'
import StateNote from './StateNote'

/**
 * Tripoints: a grid of small atlas-style maps, each centred on a point where three countries meet.
 * One answer box for the whole quiz (JetPunk-style): a country fills every map it belongs to.
 * The maps are pre-rendered by scripts/build-tripoint-maps.mjs (public/data/tripoints/<n>.json).
 */

const TIME_S = 5 * 60
const PREFIX_WAIT_MS = 700
const fmt = (s) => `${Math.floor(Math.max(0, s) / 60)}:${String(Math.max(0, s) % 60).padStart(2, '0')}`

function useMaps(points) {
  const [maps, setMaps] = useState(null)
  const [error, setError] = useState(false)
  useEffect(() => {
    let alive = true
    Promise.all(points.map(p => fetch(`/data/tripoints/${p.file}.json`).then(r => { if (!r.ok) throw new Error(r.status); return r.json() })))
      .then(m => { if (alive) setMaps(m) })
      .catch(() => { if (alive) setError(true) })
    return () => { alive = false }
  }, [points])
  return [maps, error]
}

function TripointMap({ map, num, got, over, recent }) {
  return (
    <svg className="tpq-map" viewBox={`0 0 ${map.w} ${map.h}`} role="img" aria-label={t('Map #{n}', { n: num })}>
      <rect width={map.w} height={map.h} className="tpq-sea" />
      <path d={map.land} className="tpq-land" />
      {map.lakes && <path d={map.lakes} className="tpq-lake" />}
      {map.rivers && <path d={map.rivers} className="tpq-river" />}
      <path d={map.borders} className="tpq-border" />
      {map.dot && <circle cx={map.dot[0]} cy={map.dot[1]} r="12" className="tpq-ring" />}
      {Object.entries(map.labels).filter(([n]) => got.has(n) || over).map(([n, [x, y]]) => (
        <text key={n} x={x} y={y} className={`tpq-label${got.has(n) ? (recent === n ? ' hit' : '') : ' missed'}`}>{cn(n)}</text>
      ))}
    </svg>
  )
}

export default function TripointQuiz({ quizId, onOpen }) {
  const quiz = TRIPOINT_QUIZZES[quizId]
  const mode = quizId
  const ch = useChallenge(quizId)   // opened from a friend's challenge link
  const points = quiz.points
  const total = points.length * 3
  const [maps, mapError] = useMaps(points)

  // typed spelling → country (site language only), over every country in the quiz
  const index = useMemo(() => {
    const m = new Map()
    for (const tp of points) for (const n of tp.countries) for (const a of countryAnswers(n)) { const k = norm(a); if (k) m.set(k, n) }
    return m
  }, [points])

  const [phase, setPhase] = useState('setup')        // setup (maps shown) · playing · done
  const [found, setFound] = useState(() => points.map(() => []))   // per map: countries in the order found
  const [recent, setRecent] = useState(null)
  const [input, setInput] = useState('')
  const [timeLeft, setTimeLeft] = useState(TIME_S)
  const [endReason, setEndReason] = useState(null)
  const foundRef = useRef(found)
  foundRef.current = found
  const inputRef = useRef(null)
  const [lastRow, setLastRow] = useState(null)
  const prevRef = useRef([])
  const pendingRef = useRef(null)
  const playing = phase === 'playing'
  const over = phase === 'done'
  const ready = phase === 'setup'
  const score = found.reduce((a, s) => a + s.length, 0)

  useEffect(() => {
    setRules({
      icon: '⨯', title: quiz.title, desc: quiz.prompt,
      rules: [
        t('Each map is centred on a point where three countries meet'),
        t('Type the countries in any order — each one fills every map it belongs to'),
        t('Give up any time to see what you missed'),
      ],
    })
  }, [quizId]) // eslint-disable-line react-hooks/exhaustive-deps

  const begin = useCallback((typed) => {
    const empty = points.map(() => [])
    foundRef.current = empty
    setFound(empty)
    setRecent(null)
    setInput(typed ?? '')
    setTimeLeft(TIME_S)
    setEndReason(null)
    setPhase('playing')
    prevRef.current = pastRounds(mode)
    setLastRow(null)
    startSession(mode)
    setPoolSize(mode, total)
    inputRef.current?.focus()
    setTimeout(() => inputRef.current?.focus(), 30)
  }, [points, mode, total])

  const finish = useCallback((reason) => {
    clearTimeout(pendingRef.current)
    const done = foundRef.current
    points.forEach((tp, i) => tp.countries.forEach(n => { if (!done[i].includes(n)) trackAnswer(mode, n, false, 0, null, { silent: true }) }))
    setLastRow(finishGame(mode, { completed: true, meta: { set: quiz.num } }))
    setEndReason(reason)
    setPhase('done')
    if (reason === 'complete') playWin(); else playWrong()
  }, [points, mode, quiz.num])

  useEffect(() => {
    if (!playing) return
    const id = setInterval(() => setTimeLeft(s => s - 1), 1000)
    return () => clearInterval(id)
  }, [playing])
  useEffect(() => { if (playing && timeLeft <= 0) finish('time') }, [timeLeft]) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => () => clearTimeout(pendingRef.current), [])

  const missing = (name, sets = foundRef.current) => points.some((tp, i) => tp.countries.includes(name) && !sets[i].includes(name))

  // A country fills every map it belongs to
  const accept = (key) => {
    const name = index.get(key)
    if (!name || !missing(name)) return false
    const next = foundRef.current.map((s, i) => (points[i].countries.includes(name) && !s.includes(name) ? [...s, name] : s))
    const added = next.reduce((a, s, i) => a + s.length - foundRef.current[i].length, 0)
    foundRef.current = next
    setFound(next)
    setRecent(name)
    setInput('')
    for (let k = 0; k < added; k++) trackAnswer(mode, name, true, 10, null)
    if (next.every(s => s.length === 3)) finish('complete')
    else playCorrect()
    return true
  }

  const onChange = (e) => {
    const v = e.target.value
    setInput(v)
    clearTimeout(pendingRef.current)
    const k = norm(v)
    const name = index.get(k)
    if (!k || !name || !missing(name)) return
    // A longer spelling could still be coming ("Niger" → "Nigeria"): wait a beat
    let longer = false
    for (const [key, n] of index) if (key.length > k.length && key.startsWith(k) && missing(n)) { longer = true; break }
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

  useTypeToStart(ready, begin)

  const pct = Math.round((score / total) * 100)
  const missed = total - score

  // timer · untimed · score: in the sticky answer bar while playing, in the header once it's over
  const statsBlock = (
    <div className="tq-stats">
      <span className={`tq-timer${playing && timeLeft <= 30 ? ' danger' : ''}`}>⏱ {fmt(timeLeft)}</span>
      <span className="tq-score"><strong>{score}</strong> / {total}</span>
    </div>
  )

  return (
    <div className={`tq tpq${over ? ' tq-done' : ''}${ready ? ' tq-ready' : ''}`}>
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

      <div className="tq-bar">
        {!over ? (
          <>
            <input
              ref={inputRef}
              className="tq-input"
              value={input}
              onChange={ready ? (e => { if (/\p{L}/u.test(e.target.value)) begin(e.target.value) }) : onChange}
              onKeyDown={ready ? (e => { if (e.key === 'Enter') { e.preventDefault(); begin() } }) : onKeyDown}
              placeholder={ready ? t('Start typing to begin…') : t('Enter answer…')}
              autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false}
              aria-label={quiz.prompt}
            />
            {statsBlock}
            {ready ? <StartButton onClick={() => begin()} /> : <GiveUpButton onConfirm={() => finish('giveup')} />}
          </>
        ) : (
          <div className="tq-result">
            <span className="tq-result-msg">
              {endReason === 'complete' ? plain(t('🎉 Perfect — you got them all!')) : endReason === 'time' ? plain(t('⌛ Time\'s up!')) : plain(t('🏳️ You gave up.'))}
              {' '}<strong>{score}/{total}</strong> ({pct}%)
              {missed > 0 && <span className="cmq-missed-note"> · {t('{n} missed, shown in red', { n: missed })}</span>}
            </span>
            <ChallengeResult ch={ch} score={score} total={total} ms={endReason === 'complete' ? undefined : undefined} />
            <div className="tq-result-btns">
              <button className="tq-btn tq-btn-primary" onClick={() => begin()}>{t('▶ Play again')}</button>
              <ShareButton text={() => resultText({ title: quiz.title, score, total })} />
              <ChallengeButton mode={quizId} title={quiz.title} score={score} total={total} ms={endReason === 'complete' ? undefined : undefined} rematch={!!ch} />
            </div>
          </div>
        )}
      </div>

      <div className="tq-progress"><div style={{ width: `${pct}%` }} /></div>

      {ready && <AttemptNote mode={quizId} />}

      {(phase === 'done') && <QuizResultStats mode={quizId} row={lastRow} prev={prevRef.current} record={true} />}

      {mapError ? <StateNote kind="error">{t('Could not load the map. Check your connection and try again.')}</StateNote>
        : !maps ? <StateNote kind="loading">{t('Loading map…')}</StateNote> : (
        <div className="tpq-grid">
          {points.map((tp, i) => {
            const got = found[i]
            const gotSet = new Set(got)
            const left = tp.countries.filter(n => !gotSet.has(n)).sort()
            return (
              <div key={tp.id} className={`tpq-card${got.length === 3 ? ' done' : ''}`}>
                <div className="tpq-map-wrap">
                  <span className="tpq-num">{i + 1}</span>
                  <TripointMap map={maps[i]} num={i + 1} got={gotSet} over={over} recent={recent} />
                </div>
                <div className="tpq-slots">
                  {[0, 1, 2].map(k => {
                    const n = got[k] ?? (over ? left[k - got.length] : null)
                    return <span key={k} className={`tpq-slot${got[k] ? (recent === got[k] ? ' ok hit' : ' ok') : over ? ' missed' : ''}`}>{n ? cn(n) : ''}</span>
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}
      {over && onOpen && <TryNext mode={quizId} onOpen={onOpen} />}

      <QuizComments quiz={quizId} unlocked={over} />
    </div>
  )
}
