import { useEffect, useMemo, useRef, useState } from 'react'
import { GRID_TRIES, gridNumber, gridFor, criterion, fits, gridShareText } from '../quizzes/countryGrid'
import { msToNextDaily } from '../quizzes/daily'
import { finishGame, loadResults } from '../utils/results'
import { resolveAlias, localName } from '../utils/aliases'
import { COUNTRY_INFO } from '../utils/countryInfo'
import { shareText, siteLink } from '../utils/share'
import { t, locale } from '../i18n'
import Icon from './Icon'
import StateNote from './StateNote'

const MODE = 'country-grid'
const KEY = (n) => `orbis-grid-${n}`

function load(n) {
  try { return JSON.parse(localStorage.getItem(KEY(n))) } catch { return null }
}
function save(n, s) {
  try { localStorage.setItem(KEY(n), JSON.stringify(s)) } catch { /* private mode */ }
}
function fmtClock(ms) {
  const s = Math.max(0, Math.floor(ms / 1000))
  return `${Math.floor(s / 3600)}:${String(Math.floor((s % 3600) / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
}

/** Today's Country Grid: one board a day, 9 tries for 9 cells, each country once. */
export default function CountryGrid({ countryNames }) {
  const n = gridNumber()
  const names = useMemo(() => countryNames.filter(c => COUNTRY_INFO[c]), [countryNames])
  const board = useMemo(() => (names.length ? gridFor(n, names) : null), [n, names])
  // A finished grid is also in the results (it syncs across devices); the board state is per device
  const played = useMemo(() => loadResults().find(r => r.mode === MODE && r.details?.day === n), [n])
  const [state, setState] = useState(() => load(n) ?? { cells: Array(9).fill(null), left: GRID_TRIES, started: null, done: !!played })
  const [sel, setSel] = useState(null)
  const [input, setInput] = useState('')
  const [msg, setMsg] = useState(null)
  const [copied, setCopied] = useState(false)
  const inputRef = useRef(null)
  const done = state.done || !!played
  const filled = state.cells.filter(Boolean).length

  useEffect(() => { save(n, state) }, [n, state])

  // Countdown to the next grid, once this one is over
  const [, tick] = useState(0)
  useEffect(() => {
    if (!done) return
    const id = setInterval(() => tick(x => x + 1), 1000)
    return () => clearInterval(id)
  }, [done])

  // First free cell selected, so you can just start typing
  useEffect(() => {
    if (!done && (sel == null || state.cells[sel])) {
      const i = state.cells.findIndex(c => !c)
      setSel(i >= 0 ? i : null)
    }
  }, [state.cells, done]) // eslint-disable-line react-hooks/exhaustive-deps

  const guess = (e) => {
    e?.preventDefault()
    if (done) return
    const typed = input.trim()
    if (sel == null) { setMsg({ err: true, text: t('Pick a cell first.') }); return }
    if (!typed) { setMsg({ err: true, text: t('Type a country.') }); return }
    const name = resolveAlias(typed, names)
    if (!name) { setMsg({ err: true, text: t('That isn\'t a country we know — check the spelling.') }); return }
    if (state.cells.includes(name)) { setMsg({ err: true, text: t('You\'ve already used {c}.', { c: localName(name) }) }); return }
    const r = board.rows[Math.floor(sel / 3)], c = board.cols[sel % 3]
    const ok = criterion(r).test(name) && criterion(c).test(name)
    const cells = ok ? state.cells.map((x, i) => (i === sel ? name : x)) : state.cells
    const left = state.left - 1
    const started = state.started ?? Date.now()
    const over = left === 0 || cells.every(Boolean)
    setState({ cells, left, started, done: over })
    setInput('')
    setMsg(ok
      ? { text: t('{c} fits!', { c: localName(name) }) }
      : { err: true, text: t('{c} doesn\'t fit both. {n} tries left.', { c: localName(name), n: left }) })
    if (over) {
      const got = cells.filter(Boolean).length
      finishGame(MODE, { correct: got, total: 9, score: got, durationMs: Date.now() - started, meta: { day: n, cells } })
    }
    inputRef.current?.focus()
  }

  const share = async () => {
    try {
      if (await shareText(gridShareText(n, state.cells, siteLink('/grid'))) === 'copied') { setCopied(true); setTimeout(() => setCopied(false), 2000) }
    } catch { /* cancelled */ }
  }

  if (!board) return <StateNote kind="loading">{t('Loading today\'s grid…')}</StateNote>
  const cellsShown = played?.details?.cells && !state.cells.some(Boolean) ? played.details.cells : state.cells
  const head = (id) => {
    const c = criterion(id)
    return <div className="cg-head"><Icon name={c.icon} size={18} /><span>{c.label()}</span></div>
  }

  return (
    <div className="cg">
      <div className="dq-header">
        <span className="dq-badge"><Icon name="grid" size={15} /> {t('Country Grid')} #{n}</span>
        <span className="dq-date">{new Date().toLocaleDateString(locale, { weekday: 'long', month: 'long', day: 'numeric' })}</span>
      </div>
      <p className="cg-rules">{t('Fill every cell with a country that fits both its row and its column. 9 tries, each country once.')}</p>

      <div className="cg-board">
        <div />
        {board.cols.map(id => <div key={id}>{head(id)}</div>)}
        {board.rows.map((rid, r) => [
          <div key={rid}>{head(rid)}</div>,
          ...board.cols.map((cid, c) => {
            const i = r * 3 + c, name = cellsShown[i]
            const answers = done && !name ? fits(names, rid, cid) : null
            return (
              <button key={cid} type="button" disabled={done || !!name}
                className={`cg-cell${name ? ' ok' : ''}${sel === i && !done ? ' sel' : ''}${answers ? ' missed' : ''}`}
                onClick={() => { setSel(i); setMsg(null); inputRef.current?.focus() }}
                aria-label={`${criterion(rid).label()} · ${criterion(cid).label()}`}>
                {name ? <><span className="cg-flag">{COUNTRY_INFO[name]?.flag}</span><span className="cg-name">{localName(name)}</span></>
                  : answers ? <span className="cg-answer">{t('e.g. {c}', { c: answers.slice(0, 2).map(localName).join(', ') })}</span>
                  : <span className="cg-plus">+</span>}
              </button>
            )
          }),
        ])}
      </div>

      {!done ? (
        <>
          <form className="cg-form" onSubmit={guess}>
            <input ref={inputRef} className="tq-input" value={input} autoComplete="off" spellCheck={false}
              placeholder={t('Type a country…')} onChange={e => { setInput(e.target.value); setMsg(null) }} />
            <button className="tq-btn tq-btn-primary" type="submit">{t('Try')}</button>
          </form>
          <div className={`cg-msg${msg?.err ? ' err' : ''}`} role="status">{msg?.text ?? ''}</div>
          <div className="cg-foot">
            <span>{t('{n} / 9 filled', { n: filled })}</span>
            <span className="cg-tries" aria-label={t('{n} tries left', { n: state.left })}>
              {Array.from({ length: GRID_TRIES }, (_, i) => <i key={i} className={i < state.left ? 'on' : ''} />)}
            </span>
          </div>
        </>
      ) : (
        <div className="cg-result">
          <div className="dq-result-score">
            <span className="dq-big">{played?.correct ?? filled}<small>/9</small></span>
          </div>
          <button className="tq-btn tq-btn-primary" onClick={share}>{copied ? <><Icon name="check" size={16} /> {t('Copied')}</> : t('Share result')}</button>
          <div className="dq-next"><span>{t('Next grid in')} <strong>{fmtClock(msToNextDaily())}</strong></span></div>
        </div>
      )}
    </div>
  )
}
