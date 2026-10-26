import { useCallback, useEffect, useRef, useState } from 'react'
import SetupCard from './SetupCard'
import FlagImg from './FlagImg'
import { tfStatement } from '../quizzes/arcade'
import { startSession, trackAnswer, finishGame, loadResults } from '../utils/results'
import { playCorrect, playWrong, playWin } from '../utils/sounds'
import { t } from '../i18n'

const MODE = 'true-false'
const OPTIONS = [{
  id: 'time', label: t('Time'),
  choices: [
    { value: '60', label: '⏱ 60 s', hint: t('Classic sprint') },
    { value: '30', label: '⚡ 30 s', hint: t('Short and frantic') },
    { value: '120', label: t('🧘 2 min'), hint: t('More time, more statements') },
  ],
}]
const RULES = [
  t('Statements about capitals, flags, currencies, languages, continents, population and size.'),
  t('Decide if each one is true or false — as many as you can before time runs out.'),
  t('A wrong answer costs 3 seconds.'),
  t('Keys: ← / F = false · → / T = true · Enter = play again'),
]
const PENALTY_MS = 3000

const bestOf = (time) => loadResults()
  .filter(r => r.mode === MODE && String(r.details?.time ?? '60') === time)
  .reduce((m, r) => Math.max(m, r.score), 0)

export default function TrueFalse({ countryNames = [] }) {
  const [phase, setPhase] = useState('setup')
  const [setup, setSetup] = useState(null)
  const [stmt, setStmt]   = useState(null)
  const [log, setLog]     = useState([])        // [{ ...stmt, said, ok }]
  const [flash, setFlash] = useState(null)      // { ok, id }
  const [endAt, setEndAt] = useState(0)
  const [now, setNow]     = useState(Date.now())
  const [best, setBest]   = useState(0)
  const seen = useRef(new Set())

  const next = useCallback(() => {
    const s = tfStatement(countryNames, seen.current)
    seen.current.add(s.text)
    setStmt(s)
  }, [countryNames])

  const begin = useCallback((values) => {
    seen.current = new Set()
    startSession(MODE)
    setSetup(values); setLog([]); setFlash(null)
    setBest(bestOf(values.time))
    setEndAt(Date.now() + Number(values.time) * 1000)
    setNow(Date.now())
    next()
    setPhase('playing')
  }, [next])

  const correct = log.filter(l => l.ok).length
  const left = Math.max(0, endAt - now)

  // Clock
  useEffect(() => {
    if (phase !== 'playing') return
    const t = setInterval(() => setNow(Date.now()), 100)
    return () => clearInterval(t)
  }, [phase])

  // Time's up
  useEffect(() => {
    if (phase === 'playing' && left <= 0) {
      finishGame(MODE, { score: correct, correct, total: log.length, completed: true, meta: { time: setup.time } })
      if (correct > best) playWin()
      setPhase('over')
    }
  }, [phase, left]) // eslint-disable-line react-hooks/exhaustive-deps

  const answer = useCallback((said) => {
    if (phase !== 'playing' || !stmt) return
    const ok = said === stmt.truth
    trackAnswer(MODE, stmt.country, ok, 0, null, { silent: true })
    ;(ok ? playCorrect : playWrong)()
    if (!ok) setEndAt(t => t - PENALTY_MS)
    setLog(l => [...l, { ...stmt, said, ok }])
    setFlash({ ok, id: Date.now() })
    next()
  }, [phase, stmt, next])

  useEffect(() => {
    if (phase === 'setup') return
    const onKey = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const k = e.key.toLowerCase()
      if (phase === 'playing') {
        if (e.key === 'ArrowLeft' || k === 'f') { e.preventDefault(); answer(false) }
        if (e.key === 'ArrowRight' || k === 't') { e.preventDefault(); answer(true) }
      } else if (e.key === 'Enter') { e.preventDefault(); begin(setup) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [phase, answer, begin, setup])

  if (phase === 'setup') {
    return (
      <div className="arc-wrap">
        <div className="arc-card">
          <SetupCard mode={MODE} icon="✅" title={t('True or False')} desc={t('Rapid-fire statements')} options={OPTIONS} rules={RULES} onStart={begin} />
        </div>
      </div>
    )
  }

  const total = Number(setup.time) * 1000
  const last = log[log.length - 1]

  if (phase === 'over') {
    const wrong = log.filter(l => !l.ok)
    const acc = log.length ? Math.round((correct / log.length) * 100) : 0
    return (
      <div className="arc-wrap">
        <div className="arc-over">
          <div className="arc-over-big">{correct}<small> {t('correct')}</small></div>
          <div className="arc-over-sub">
            {log.length} {t('answered ·')} {acc}{t('% accuracy ·')} {correct > best ? t('🎉 New personal best!') : t('best {best}', { best: best })}
          </div>
          <div className="arc-over-btns">
            <button className="arc-primary" onClick={() => begin(setup)}>{t('▶ Play again')} <kbd>{t('Enter')}</kbd></button>
            <button className="arc-secondary" onClick={() => setPhase('setup')}>{t('Settings')}</button>
          </div>
          {wrong.length > 0 && (
            <div className="tf-review">
              <div className="tf-review-head">{t('Your mistakes')}</div>
              {wrong.map((w, i) => (
                <div key={i} className="tf-review-row">
                  {w.flag && <FlagImg emoji={w.flag} className="tf-review-flag" />}
                  <div>
                    <div className="tf-review-text">{w.text} <b className={w.truth ? 'tf-t' : 'tf-f'}>{w.truth ? t('TRUE') : t('FALSE')}</b></div>
                    {!w.truth && w.fix && <div className="tf-review-fix">{w.fix}</div>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="arc-wrap">
      <div className="tf-top">
        <span className="tf-score">✓ {correct}</span>
        <div className="tf-timer"><span style={{ width: `${(left / total) * 100}%` }} className={left < 10000 ? 'low' : ''} /></div>
        <span className="tf-clock">{Math.ceil(left / 1000)}s</span>
      </div>

      <div className={`tf-card${flash ? (flash.ok ? ' tf-flash-ok' : ' tf-flash-bad') : ''}`} key={flash?.id ?? 0}>
        {stmt?.flag && <FlagImg emoji={stmt.flag} className="tf-flag" />}
        <div className="tf-text">{stmt?.text}</div>
      </div>

      <div className="tf-btns">
        <button className="tf-btn tf-false" onClick={() => answer(false)}>{t('✗ False')} <kbd>←</kbd></button>
        <button className="tf-btn tf-true" onClick={() => answer(true)}>{t('✓ True')} <kbd>→</kbd></button>
      </div>

      <div className="tf-last">
        {last && !last.ok && (
          <span className="tf-last-bad">✗ −3s · {last.truth ? t('That was true') : (last.fix ?? t('That was false'))}</span>
        )}
        {last && last.ok && <span className="tf-last-ok">{t('✓ Correct')}</span>}
      </div>
    </div>
  )
}
