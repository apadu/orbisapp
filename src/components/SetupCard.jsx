import { useEffect, useMemo, useState } from 'react'
import { loadResults } from '../utils/results'
import { GAME_CATALOG } from '../utils/gameCatalog'
import { setRules } from '../utils/rulesStore'
import { t } from '../i18n'
import GameIcon from './GameIcon'
import { plain } from '../utils/plain'
import { ReadyOptions, StartButton, carryKeystrokes } from './QuizReady'

const storeKey = (mode) => `orbis-setup-${mode}`

function loadSaved(mode) {
  try { return JSON.parse(localStorage.getItem(storeKey(mode))) ?? {} } catch { return {} }
}

export function saveSetup(mode, values) {
  try { localStorage.setItem(storeKey(mode), JSON.stringify(values)) } catch { /* private mode */ }
}

/** Remembered settings for a game (used by "Play again"). */
export function getSavedSetup(mode, options) {
  const saved = loadSaved(mode)
  const out = {}
  for (const o of options) {
    const ok = o.choices.some(c => c.value === saved[o.id])
    out[o.id] = ok ? saved[o.id] : (o.default ?? o.choices[0].value)
  }
  return out
}

function fmtTime(ms) {
  const s = Math.round(ms / 1000)
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

function bestLine(mode) {
  const rows = loadResults().filter(r => r.mode === mode && r.total > 0)
  if (!rows.length) return t('First time — good luck!')
  const timed = GAME_CATALOG[mode]?.timed
  if (timed) {
    const best = rows.reduce((a, b) => (b.correct > a.correct || (b.correct === a.correct && b.duration_ms < a.duration_ms) ? b : a))
    const clear = rows.filter(r => r.completed && r.correct === r.total).sort((a, b) => a.duration_ms - b.duration_ms)[0]
    return clear
      ? t('Best: full clear in {v}', { v: fmtTime(clear.duration_ms) })
      : t('Best: {correct}/{total}', { correct: best.correct, total: best.total })
  }
  const best = rows.reduce((a, b) => (b.score > a.score ? b : a))
  const unit = GAME_CATALOG[mode]?.unit
  if (unit) return t('Best: {score} {v} · {length} game{v2}', { score: best.score, v: unit.toLowerCase(), length: rows.length, v2: rows.length === 1 ? '' : 's' })
  return t('Best: {v} pts · {length} game{v2}', { v: best.score.toLocaleString(), length: rows.length, v2: rows.length === 1 ? '' : 's' })
}

/**
 * One-screen game setup: options as segmented toggles (remembered),
 * one Start button (Enter), and — for typing games — "just start typing".
 *
 * options: [{ id, label, choices: [{ value, label, hint? }], default? }]
 * onStart(values, typedChar?)
 */
export default function SetupCard({ mode, icon, title, desc, options = [], rules = [], onStart, typeToStart = false, startLabel = 'Start' }) {
  const [values, setValues] = useState(() => getSavedSetup(mode, options))
  const [showRules, setShowRules] = useState(false)
  const best = useMemo(() => bestLine(mode), [mode])

  useEffect(() => { setRules({ icon, title, desc, rules }) }, [mode]) // eslint-disable-line react-hooks/exhaustive-deps

  const start = (typed) => {
    try { localStorage.setItem(storeKey(mode), JSON.stringify(values)) } catch {}
    if (typeToStart) carryKeystrokes()   // the game's own answer box takes over the next keys
    onStart(values, typed)
  }

  // Enter = start · typing a letter = start and keep the letter
  useEffect(() => {
    const onKey = (e) => {
      const tag = document.activeElement?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || e.metaKey || e.ctrlKey || e.altKey) return
      if (e.key === 'Enter') { e.preventDefault(); start() }
      else if (typeToStart && e.key.length === 1 && /\p{L}/u.test(e.key)) { e.preventDefault(); start(e.key) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }) // re-bind each render so `values` is fresh

  // Same layout as the quiz pages before the start: title, compact options, then the answer
  // bar itself (typing games) — so the first keystroke is already the first answer.
  return (
    <div className="setup setup-ready">
      <div className="setup-head">
        <span className="setup-icon">{mode ? <GameIcon id={mode} size={26} strokeWidth={1.5} /> : icon}</span>
        <div className="setup-head-text">
          <h2>{plain(title)}</h2>
          <span className="setup-best">{best}</span>
        </div>
      </div>

      <ReadyOptions options={options} values={values} onChange={setValues} />

      <div className="setup-bar">
        {typeToStart && (
          <input
            className="tq-input setup-input"
            placeholder={t('Start typing to begin…')}
            value=""
            onChange={e => { if (/\p{L}/u.test(e.target.value)) start(e.target.value) }}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); start() } }}
            autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false}
            aria-label={plain(title)}
          />
        )}
        <StartButton onClick={() => start()} label={startLabel} />
      </div>

      {rules.length > 0 && (
        <div className="setup-rules">
          <button className="setup-rules-toggle" onClick={() => setShowRules(s => !s)} aria-expanded={showRules}>
            {t('How to play')} {showRules ? '▴' : '▾'}
          </button>
          {showRules && (
            <ul>{rules.map((r, i) => <li key={i}>{plain(r)}</li>)}</ul>
          )}
        </div>
      )}
    </div>
  )
}

/** Shared "time" option used by all Name-All style games. */
export const TIMER_OPTION = {
  id: 'timer',
  label: t('Time'),
  default: 'countup',
  choices: [
    { value: 'countup',   label: plain(t('⏱ Free play')), hint: t('No limit — the clock just tracks your time') },
    { value: 'countdown', label: plain(t('⏳ 15 min')),    hint: t('Race the clock: name as many as you can in 15 minutes') },
  ],
}
