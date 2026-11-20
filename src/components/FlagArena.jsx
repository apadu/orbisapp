import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import SetupCard from './SetupCard'
import FlagImg from './FlagImg'
import { COUNTRY_INFO } from '../utils/countryInfo'
import { FLAG_COLORS } from '../utils/flagColors'
import { countryAnswers } from '../utils/aliases'
import { norm } from '../quizzes/tableQuizzes'
import { startSession, trackAnswer, finishGame, loadResults } from '../utils/results'
import { playCorrect, playWrong, playWin } from '../utils/sounds'
import { t, cn } from '../i18n'
import { feverVerdict } from './QuizStats'
import { plain } from '../utils/plain'

/**
 * Three quick flag games on one engine:
 *   flags-pick     — a country name, four flags: pick the right one (20 rounds)
 *   flags-sprint   — one flag at a time, type the country; as many as you can in 30 / 60 / 120 s
 *   flags-survival — one flag, four countries; three lives, the choices get trickier as you go
 */
export const FLAG_ARENA = {
  'flags-pick': {
    icon: '🎯', title: t('Pick the Flag'),
    desc: t('A country name and four flags — pick the right one. 20 rounds.'),
    rules: [
      t('Each round shows a country: click its flag (or press 1–4).'),
      t('The wrong flags often share colours with the right one.'),
      t('20 rounds — your score and time are saved.'),
    ],
  },
  'flags-sprint': {
    icon: '⚡', title: t('Fever Sprint'),
    desc: t('One flag at a time — name as many as you can before the clock runs out.'),
    rules: [
      t('Type the country of the flag shown — no Enter needed.'),
      t('Tab or the Skip button moves on to another flag.'),
      t('Your score is how many you name in time.'),
    ],
    options: [{
      id: 'time', label: t('Time'),
      choices: [
        { value: '60', label: '⏱ 60 s', hint: t('Classic sprint') },
        { value: '30', label: '⚡ 30 s', hint: t('Short and frantic') },
        { value: '120', label: plain(t('🧘 2 min')), hint: t('More time, more flags') },
      ],
    }],
  },
  'flags-survival': {
    icon: '❤️', title: t('Flag Survival'),
    desc: t('Three lives. Name each flag from four choices — how far can you go?'),
    rules: [
      t('Pick the country of the flag shown (or press 1–4).'),
      t('A wrong answer costs a life — three and you\'re out.'),
      t('The further you get, the more alike the choices look.'),
    ],
  },
}
export const FLAG_ARENA_IDS = new Set(Object.keys(FLAG_ARENA))

const ROUNDS = 20
const LIVES = 3
const FEEDBACK_MS = 750

const shuffle = (a) => {
  const x = [...a]
  for (let i = x.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [x[i], x[j]] = [x[j], x[i]] }
  return x
}
const colorsOf = (n) => new Set((FLAG_COLORS[n] ?? []).map(c => c.name.toLowerCase()))
// How easy two flags are to mix up: shared colours, plus a bit for the same continent
function likeness(a, b) {
  const ca = colorsOf(a), cb = colorsOf(b)
  let shared = 0
  for (const c of ca) if (cb.has(c)) shared++
  const union = new Set([...ca, ...cb]).size || 1
  return shared / union + (COUNTRY_INFO[a]?.continent === COUNTRY_INFO[b]?.continent ? 0.35 : 0)
}
/** Three wrong choices for `target`. hard ∈ [0, 1]: 0 = any flags, 1 = the most alike ones. */
function distractors(target, pool, hard) {
  const others = pool.filter(n => n !== target)
  if (hard <= 0) return shuffle(others).slice(0, 3)
  const ranked = others.map(n => [n, likeness(target, n) + Math.random() * (1.2 - hard)]).sort((x, y) => y[1] - x[1])
  return shuffle(ranked.slice(0, 8).map(r => r[0])).slice(0, 3)
}

const fmt = (ms) => { const s = Math.round(ms / 1000); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}` }
const bestOf = (mode, variant) => loadResults()
  .filter(r => r.mode === mode && (variant == null || String(r.details?.time ?? '60') === variant))
  .reduce((m, r) => Math.max(m, r.correct ?? 0), 0)

export default function FlagArena({ mode, countryNames = [] }) {
  const game = FLAG_ARENA[mode]
  const pool = useMemo(() => countryNames.filter(n => COUNTRY_INFO[n]?.flag), [countryNames])
  const [phase, setPhase] = useState('setup')       // setup · playing · over
  const [setup, setSetup] = useState(null)
  const [round, setRound] = useState(null)          // { target, choices }
  const [log, setLog] = useState([])                // [{ target, ok, said }]
  const [picked, setPicked] = useState(null)        // choice clicked, while the feedback shows
  const [lives, setLives] = useState(LIVES)
  const [best, setBest] = useState(0)
  const [input, setInput] = useState('')
  const [flash, setFlash] = useState(null)
  const [now, setNow] = useState(Date.now())
  const startedAt = useRef(0)
  const endAt = useRef(0)
  const queue = useRef([])
  const inputRef = useRef(null)
  const timerRef = useRef(null)

  const sprint = mode === 'flags-sprint'
  const survival = mode === 'flags-survival'
  const correct = log.filter(l => l.ok).length

  // Next country: from a shuffled queue, so nothing repeats until the pool runs out
  const draw = useCallback(() => {
    if (!queue.current.length) queue.current = shuffle(pool)
    return queue.current.pop()
  }, [pool])

  const newRound = useCallback((done) => {
    const target = draw()
    if (sprint) { setRound({ target }); return }
    // survival gets harder as you go; pick-the-flag always uses look-alikes, a bit randomised
    const hard = survival ? Math.min(1, done / 15) : 0.7
    setRound({ target, choices: shuffle([target, ...distractors(target, pool, hard)]) })
  }, [draw, pool, sprint, survival])

  const begin = useCallback((values, typed = '') => {
    clearTimeout(timerRef.current)
    queue.current = []
    startSession(mode)
    setSetup(values ?? {})
    setLog([]); setPicked(null); setLives(LIVES); setFlash(null)
    setInput(typed ?? '')
    setBest(bestOf(mode, sprint ? values?.time ?? '60' : null))
    startedAt.current = Date.now()
    endAt.current = sprint ? Date.now() + Number(values?.time ?? 60) * 1000 : 0
    setNow(Date.now())
    newRound(0)
    setPhase('playing')
    setTimeout(() => inputRef.current?.focus(), 30)
  }, [mode, sprint, newRound])

  const end = useCallback((finalLog) => {
    clearTimeout(timerRef.current)
    const ok = finalLog.filter(l => l.ok).length
    finishGame(mode, {
      score: ok, correct: ok, total: mode === 'flags-pick' ? ROUNDS : finalLog.length || ok,
      completed: true, durationMs: Date.now() - startedAt.current,
      meta: sprint ? { time: setup?.time ?? '60' } : {},
    })
    if (ok > best) playWin()
    setPhase('over')
  }, [mode, sprint, setup, best])

  // Clock
  useEffect(() => {
    if (phase !== 'playing') return
    const id = setInterval(() => setNow(Date.now()), 100)
    return () => clearInterval(id)
  }, [phase])
  useEffect(() => {
    if (phase === 'playing' && sprint && now >= endAt.current) end(log)
  }, [now]) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => () => clearTimeout(timerRef.current), [])

  // ── Choice games (pick / survival) ─────────────────────────────────────────
  const choose = useCallback((choice) => {
    if (phase !== 'playing' || picked || !round) return
    const ok = choice === round.target
    trackAnswer(mode, round.target, ok, ok ? 10 : 0)
    ;(ok ? playCorrect : playWrong)()
    const nextLog = [...log, { target: round.target, ok, said: choice }]
    const nextLives = ok ? lives : lives - 1
    setLog(nextLog); setLives(nextLives); setPicked(choice)
    timerRef.current = setTimeout(() => {
      setPicked(null)
      const over = mode === 'flags-pick' ? nextLog.length >= ROUNDS : nextLives <= 0
      if (over) end(nextLog)
      else newRound(nextLog.filter(l => l.ok).length)
    }, ok ? FEEDBACK_MS : FEEDBACK_MS * 1.6)
  }, [phase, picked, round, mode, log, lives, end, newRound])

  // ── Sprint (typed) ─────────────────────────────────────────────────────────
  const answers = useMemo(() => (round && sprint ? new Set(countryAnswers(round.target).map(norm)) : null), [round, sprint])
  const onType = (e) => {
    const v = e.target.value
    setInput(v)
    if (!answers?.has(norm(v))) return
    trackAnswer(mode, round.target, true, 10)
    playCorrect()
    setLog(l => [...l, { target: round.target, ok: true }])
    setFlash({ ok: true, id: Date.now() })
    setInput('')
    newRound(0)
  }
  const skip = useCallback(() => {
    if (phase !== 'playing' || !sprint || !round) return
    trackAnswer(mode, round.target, false, 0, null, { silent: true })
    setLog(l => [...l, { target: round.target, ok: false }])
    setFlash({ ok: false, id: Date.now() })
    setInput('')
    newRound(0)
    inputRef.current?.focus()
  }, [phase, sprint, round, mode, newRound])

  // Keys: 1–4 choose · Tab skip (sprint) · Enter play again
  useEffect(() => {
    if (phase === 'setup') return
    const onKey = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      if (phase === 'over') { if (e.key === 'Enter') { e.preventDefault(); begin(setup) } return }
      if (sprint) { if (e.key === 'Tab') { e.preventDefault(); skip() } return }
      const i = '1234'.indexOf(e.key)
      if (i >= 0 && round?.choices?.[i]) { e.preventDefault(); choose(round.choices[i]) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [phase, sprint, round, choose, skip, begin, setup])

  // ── Render ─────────────────────────────────────────────────────────────────
  if (phase === 'setup') {
    return (
      <div className="arc-wrap">
        <div className="arc-card">
          <SetupCard mode={mode} icon={game.icon} title={game.title} desc={game.desc} options={game.options ?? []} rules={game.rules}
            typeToStart={sprint} onStart={(v, typed) => begin(v, typed)} />
        </div>
      </div>
    )
  }

  if (phase === 'over') {
    const missed = log.filter(l => !l.ok)
    const isBest = correct > best
    return (
      <div className="arc-wrap">
        <div className="arc-over">
          <div className="arc-over-big">
            {correct}<small>{mode === 'flags-pick' ? ` / ${ROUNDS}` : ` ${t(correct === 1 ? 'flag' : 'flags')}`}</small>
          </div>
          {mode === 'flags-pick' && <div className={`qs-fever qs-fever-${feverVerdict(Math.round((correct / ROUNDS) * 100)).cls}`}>{feverVerdict(Math.round((correct / ROUNDS) * 100)).text}</div>}
          <div className="arc-over-sub">
            {mode === 'flags-pick' && <>⏱ {fmt(Date.now() - startedAt.current)} · </>}
            {sprint && <>{t('{n} skipped', { n: missed.length })} · </>}
            {isBest ? plain(t('🎉 New personal best!')) : t('best {best}', { best })}
          </div>
          <div className="arc-over-btns">
            <button className="arc-primary" onClick={() => begin(setup)}>{t('▶ Play again')} <kbd>{t('Enter')}</kbd></button>
            <button className="arc-secondary" onClick={() => setPhase('setup')}>{t('Settings')}</button>
          </div>
          {missed.length > 0 && (
            <div className="fa-review">
              <div className="tf-review-head">{sprint ? t('Flags you skipped') : t('Your mistakes')}</div>
              <div className="fa-review-grid">
                {missed.map((m, i) => (
                  <div key={i} className="fa-review-item">
                    <FlagImg emoji={COUNTRY_INFO[m.target].flag} className="fa-review-flag" />
                    <span>{cn(m.target)}</span>
                    {m.said && <small>{t('you picked {x}', { x: cn(m.said) })}</small>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  const left = sprint ? Math.max(0, endAt.current - now) : 0
  const total = sprint ? Number(setup?.time ?? 60) * 1000 : 1
  const target = round?.target

  return (
    <div className="arc-wrap fa">
      <div className="tf-top">
        <span className="tf-score">✓ {correct}</span>
        {sprint && <div className="tf-timer"><span style={{ width: `${(left / total) * 100}%` }} className={left < 10000 ? 'low' : ''} /></div>}
        {sprint && <span className="tf-clock">{Math.ceil(left / 1000)}s</span>}
        {mode === 'flags-pick' && <span className="fa-progress">{t('Round {n} / {total}', { n: Math.min(log.length + (picked ? 0 : 1), ROUNDS), total: ROUNDS })}</span>}
        {survival && <span className="fa-lives" aria-label={t('{n} lives left', { n: lives })}>{Array.from({ length: LIVES }, (_, i) => <span key={i} className={i < lives ? 'on' : ''}>♥</span>)}</span>}
      </div>

      {mode === 'flags-pick' ? (
        <>
          <div className="fa-prompt">{cn(target)}</div>
          <div className="fa-flags">
            {round?.choices.map((c, i) => {
              const state = picked ? (c === target ? ' right' : c === picked ? ' wrong' : ' dim') : ''
              return (
                <button key={c} className={`fa-flag-btn${state}`} onClick={() => choose(c)} aria-label={t('Flag {n}', { n: i + 1 })}>
                  <FlagImg emoji={COUNTRY_INFO[c].flag} className="fa-flag" />
                  <kbd>{i + 1}</kbd>
                  {picked && c === picked && c !== target && <span className="fa-flag-name">{cn(c)}</span>}
                </button>
              )
            })}
          </div>
        </>
      ) : (
        <div className={`fa-card${flash ? (flash.ok ? ' tf-flash-ok' : ' tf-flash-bad') : ''}`} key={sprint ? target : undefined}>
          {target && <FlagImg emoji={COUNTRY_INFO[target].flag} className="fa-big-flag" />}
        </div>
      )}

      {sprint && (
        <div className="fa-type">
          <input ref={inputRef} className="tq-input" value={input} onChange={onType} placeholder={t('Which country is this?')}
            autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false} aria-label={t('Which country is this?')} />
          <button className="arc-secondary" onClick={skip}>{t('Skip')} <kbd>Tab</kbd></button>
        </div>
      )}

      {survival && (
        <div className="fa-choices">
          {round?.choices.map((c, i) => {
            const state = picked ? (c === target ? ' right' : c === picked ? ' wrong' : ' dim') : ''
            return <button key={c} className={`fa-choice${state}`} onClick={() => choose(c)}><kbd>{i + 1}</kbd> {cn(c)}</button>
          })}
        </div>
      )}
    </div>
  )
}
