import { useCallback, useEffect, useMemo, useState } from 'react'
import FlagImg from './FlagImg'
import { setRules } from '../utils/rulesStore'
import {
  WORDLE_TRIES, letters, wordleWord, wordleTargets, wordleGuessMap, dailyWordle, scoreGuess, wordleShareText, shortName,
} from '../quizzes/arcade'
import { msToNextDaily } from '../quizzes/daily'
import { COUNTRY_INFO } from '../utils/countryInfo'
import { startSession, trackAnswer, finishGame, loadResults } from '../utils/results'
import { playCorrect, playWrong, playWin } from '../utils/sounds'
import { t, isRo, continentName } from '../i18n'

const MODE = 'country-wordle'
const KEYS = ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM']
const HINT_AFTER = 3
const stateKey = (day) => isRo ? `orbis-wordle-ro-${day}` : `orbis-wordle-${day}`

const RULES = [
  t('Guess the country in 6 tries. Every guess must be a real country with the right number of letters.'),
  t('🟩 right letter, right spot · 🟨 in the name, wrong spot · ⬛ not in the name.'),
  t('After {HINT_AFTER} misses you get the continent as a hint.', { HINT_AFTER: HINT_AFTER }),
  t('One daily country for everyone — then practise with random ones.'),
]

function loadDaily(day) {
  try { return JSON.parse(localStorage.getItem(stateKey(day))) ?? null } catch { return null }
}
function saveDaily(day, guesses) {
  try { localStorage.setItem(stateKey(day), JSON.stringify({ guesses })) } catch {}
}

function fmtClock(ms) {
  const s = Math.max(0, Math.floor(ms / 1000))
  return `${Math.floor(s / 3600)}:${String(Math.floor((s % 3600) / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
}

function wordleStreak(today) {
  const days = new Set(loadResults().filter(r => r.mode === MODE && r.details?.daily && r.correct > 0).map(r => r.details.day))
  let d = days.has(today) ? today : today - 1, n = 0
  while (days.has(d)) { n++; d-- }
  return n
}

export default function CountryWordle({ countryNames = [] }) {
  const daily = useMemo(() => dailyWordle(countryNames), [countryNames])
  const guessMap = useMemo(() => wordleGuessMap(countryNames), [countryNames])
  const targets = useMemo(() => wordleTargets(countryNames), [countryNames])

  const [game, setGame] = useState(null)     // { daily, day?, country }
  const [guesses, setGuesses] = useState([]) // LETTERS strings
  const [typed, setTyped] = useState('')
  const [error, setError] = useState(null)
  const [copied, setCopied] = useState(false)
  const [left, setLeft] = useState(msToNextDaily())

  useEffect(() => { setRules({ icon: '🟩', title: t('Country Wordle'), desc: t('Guess the country letter by letter'), rules: RULES }) }, [])

  // Start on today's daily (restoring progress) as soon as the countries are in
  useEffect(() => {
    if (game || !daily) return
    const saved = loadDaily(daily.day)
    setGame({ daily: true, day: daily.day, country: daily.country })
    setGuesses(saved?.guesses ?? [])
    if (!saved?.guesses?.length) startSession(MODE)
  }, [daily, game])

  useEffect(() => {
    const t = setInterval(() => setLeft(msToNextDaily()), 1000)
    return () => clearInterval(t)
  }, [])

  const target = game ? wordleWord(game.country) : ''
  const rows = useMemo(() => guesses.map(g => scoreGuess(g, target)), [guesses, target])
  const solved = guesses.includes(target)
  const over = solved || guesses.length >= WORDLE_TRIES
  const misses = guesses.length - (solved ? 1 : 0)

  // Keyboard colouring: best state seen per letter
  const keyState = useMemo(() => {
    const rank = { miss: 1, near: 2, hit: 3 }
    const out = {}
    guesses.forEach((g, i) => g.split('').forEach((ch, j) => {
      const st = rows[i][j]
      if (!out[ch] || rank[st] > rank[out[ch]]) out[ch] = st
    }))
    return out
  }, [guesses, rows])

  const submit = useCallback(() => {
    if (!game || over) return
    if (typed.length !== target.length) { setError(t('Needs {length} letters', { length: target.length })); return }
    if (!guessMap.has(typed)) { setError(t('Not a country we know')); playWrong(); return }
    if (guesses.includes(typed)) { setError(t('Already tried')); return }
    const next = [...guesses, typed]
    setGuesses(next); setTyped(''); setError(null)
    if (game.daily) saveDaily(game.day, next)

    const won = typed === target
    if (won || next.length >= WORDLE_TRIES) {
      if (!game.daily || !loadResults().some(r => r.mode === MODE && r.details?.daily && r.details?.day === game.day)) {
        trackAnswer(MODE, game.country, won, 0)
        finishGame(MODE, {
          score: won ? WORDLE_TRIES + 1 - next.length : 0,
          correct: won ? 1 : 0, total: 1, completed: true,
          meta: { daily: game.daily, day: game.day ?? null, guesses: next.length },
        })
      }
      ;(won ? playWin : playWrong)()
    } else playCorrect()
  }, [game, over, typed, target, guessMap, guesses])

  const press = useCallback((k) => {
    if (over) return
    setError(null)
    if (k === 'ENTER') return submit()
    if (k === 'BACK') return setTyped(t => t.slice(0, -1))
    setTyped(t => (t.length < target.length ? t + k : t))
  }, [over, submit, target])

  useEffect(() => {
    const onKey = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      if (document.activeElement?.tagName === 'INPUT') return
      if (e.key === 'Enter') { e.preventDefault(); over ? practice() : press('ENTER') }
      else if (e.key === 'Backspace') { e.preventDefault(); press('BACK') }
      else if (/^[a-zA-Z]$/.test(e.key)) press(e.key.toUpperCase())
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const practice = () => {
    let c = targets[Math.floor(Math.random() * targets.length)]
    if (c === game?.country && targets.length > 1) c = targets[(targets.indexOf(c) + 1) % targets.length]
    startSession(MODE)
    setGame({ daily: false, country: c })
    setGuesses([]); setTyped(''); setError(null); setCopied(false)
  }

  const backToDaily = () => {
    const saved = loadDaily(daily.day)
    setGame({ daily: true, day: daily.day, country: daily.country })
    setGuesses(saved?.guesses ?? []); setTyped(''); setError(null)
  }

  const share = async () => {
    const text = wordleShareText(game.day, rows, solved)
    try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000) } catch {}
  }

  if (!game) return <div className="arc-wrap"><div className="game-intro-wait">{t('Loading…')}</div></div>

  const info = COUNTRY_INFO[game.country]
  const streak = game.daily ? wordleStreak(game.day) : 0

  return (
    <div className="arc-wrap wd-wrap">
      <div className="wd-head">
        {game.daily
          ? <span className="dq-badge">{t('🟩 Wordle #')}{game.day}</span>
          : <span className="wd-practice">{t('🎲 Practice')}</span>}
        <span className="wd-len">{target.length} {t('letters')}</span>
        {streak > 0 && <span className="dq-streak">🔥 {streak}</span>}
        {!game.daily && <button className="wd-link" onClick={backToDaily}>{t('← Today\'s Wordle')}</button>}
      </div>

      <div className="wd-grid" style={{ '--n': target.length }}>
        {Array.from({ length: WORDLE_TRIES }, (_, r) => {
          const g = guesses[r]
          const isCur = r === guesses.length && !over
          const txt = g ?? (isCur ? typed : '')
          return (
            <div key={r} className={`wd-row${isCur && error ? ' wd-shake' : ''}`}>
              {Array.from({ length: target.length }, (_, c) => (
                <div key={c} className={`wd-tile${g ? ` wd-${rows[r][c]} wd-flip` : txt[c] ? ' wd-filled' : ''}`} style={g ? { animationDelay: `${c * 70}ms` } : undefined}>
                  {txt[c] ?? ''}
                </div>
              ))}
              {g && <span className="wd-row-name">{shortName(guessMap.get(g))}</span>}
            </div>
          )
        })}
      </div>

      <div className="wd-msg">
        {error ? <span className="wd-error">{error}</span>
          : !over && misses >= HINT_AFTER ? <span className="wd-hint">{t('💡 It\'s in')} {info?.continent === 'Americas' ? t('the Americas') : continentName(info?.continent)}</span>
          : null}
      </div>

      {over ? (
        <div className="wd-result">
          <FlagImg emoji={info?.flag} className="wd-flag" title={game.country} />
          <div className="wd-result-text">
            <div className="wd-result-name">{solved ? '🎉 ' : ''}{shortName(game.country)}</div>
            <div className="wd-result-sub">{solved ? t('Solved in {length}/{WORDLE_TRIES}', { length: guesses.length, WORDLE_TRIES: WORDLE_TRIES }) : t('Out of tries — tomorrow is a new country')}</div>
          </div>
          <div className="wd-result-btns">
            {game.daily && <button className="arc-secondary" onClick={share}>{copied ? t('✓ Copied') : t('📋 Share')}</button>}
            <button className="arc-primary" onClick={practice}>{t('🎲 Practice')} <kbd>{t('Enter')}</kbd></button>
          </div>
          {game.daily && <div className="dq-next">{t('Next Wordle in')} <strong>{fmtClock(left)}</strong></div>}
        </div>
      ) : (
        <div className="wd-kb">
          {KEYS.map((row, i) => (
            <div key={i} className="wd-kb-row">
              {i === 2 && <button className="wd-key wd-key-wide" onClick={() => press('ENTER')}>{t('Enter')}</button>}
              {row.split('').map(k => (
                <button key={k} className={`wd-key${keyState[k] ? ` wd-${keyState[k]}` : ''}`} onClick={() => press(k)}>{k}</button>
              ))}
              {i === 2 && <button className="wd-key wd-key-wide" onClick={() => press('BACK')}>⌫</button>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
