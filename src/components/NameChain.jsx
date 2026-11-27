import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import SetupCard from './SetupCard'
import UntimedConfirm from './UntimedConfirm'
import { startSession, trackAnswer, finishGame, markSession } from '../utils/results'
import { resolveAlias, localName } from '../utils/aliases'
import { COUNTRY_INFO } from '../utils/countryInfo'
import { t } from '../i18n'

const MODE = 'name-chain'
const TURN_MS = 20_000     // time for each link; a good answer resets it
const PENALTY_MS = 3_000   // a wrong country that does start with the right letter

/** First and last letter of a country's name in the site language, without diacritics. */
const letters = (name) => {
  const s = localName(name).normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase().replace(/[^A-Z]/g, '')
  return { first: s[0] ?? '', last: s[s.length - 1] ?? '' }
}

const RULES = [
  () => t('Each country must start with the last letter of the one before (Kenya → Afghanistan → Nepal).'),
  () => t('You have 20 seconds for every link; a good answer resets the clock.'),
  () => t('No country twice. The chain ends when time runs out or no country is left for the letter.'),
]

/** Name Chain: countries linked last letter → first letter, against the clock. */
export default function NameChain({ countryNames }) {
  const names = useMemo(() => countryNames.filter(c => COUNTRY_INFO[c]), [countryNames])
  const [phase, setPhase] = useState('setup')          // setup | play | over
  const [chain, setChain] = useState([])
  const [left, setLeft] = useState(TURN_MS)
  const [input, setInput] = useState('')
  const [msg, setMsg] = useState(null)
  const [untimed, setUntimed] = useState(false)
  const [confirmFree, setConfirmFree] = useState(false)
  const [endReason, setEndReason] = useState(null)     // 'time' | 'stuck' | 'gave-up'
  const deadline = useRef(0)
  const started = useRef(0)
  const inputRef = useRef(null)

  const need = chain.length ? letters(chain[chain.length - 1]).last : ''
  const options = useMemo(
    () => names.filter(n => !chain.includes(n) && letters(n).first === need),
    [names, chain, need],
  )

  const end = useCallback((reason, links) => {
    setPhase('over'); setEndReason(reason)
    finishGame(MODE, { score: links, correct: links, total: Math.max(links, 1), completed: true, durationMs: Date.now() - started.current })
  }, [])

  const begin = useCallback(() => {
    // a starting country whose last letter leads somewhere
    const pool = names.filter(n => names.some(m => m !== n && letters(m).first === letters(n).last))
    const first = pool[Math.floor(Math.random() * pool.length)]
    startSession(MODE)
    started.current = Date.now()
    deadline.current = Date.now() + TURN_MS
    setChain([first]); setLeft(TURN_MS); setInput(''); setMsg(null); setUntimed(false); setEndReason(null)
    setPhase('play')
    setTimeout(() => inputRef.current?.focus(), 30)
  }, [names])

  // The clock (paused while the "untimed?" question is open)
  useEffect(() => {
    if (phase !== 'play' || untimed || confirmFree) return
    deadline.current = Date.now() + left
    const id = setInterval(() => {
      const l = deadline.current - Date.now()
      if (l <= 0) { clearInterval(id); setLeft(0); end('time', chain.length - 1) } else setLeft(l)
    }, 100)
    return () => clearInterval(id)
  }, [phase, untimed, confirmFree, chain]) // eslint-disable-line react-hooks/exhaustive-deps

  const submit = (e) => {
    e.preventDefault()
    if (phase !== 'play') return
    const typed = input.trim()
    if (!typed) return
    const name = resolveAlias(typed, names)
    if (!name) { setMsg({ err: true, text: t('That isn\'t a country we know — check the spelling.') }); return }
    if (chain.includes(name)) { setMsg({ err: true, text: t('{c} is already in the chain.', { c: localName(name) }) }); return }
    if (letters(name).first !== need) {
      setMsg({ err: true, text: t('{c} doesn\'t start with {l}.', { c: localName(name), l: need }) })
      if (!untimed) { deadline.current -= PENALTY_MS; setLeft(l => Math.max(0, l - PENALTY_MS)) }
      return
    }
    trackAnswer(MODE, name, true)
    const next = [...chain, name]
    setChain(next); setInput(''); setMsg(null); setLeft(TURN_MS)
    const nextNeed = letters(name).last
    if (!names.some(n => !next.includes(n) && letters(n).first === nextNeed)) end('stuck', next.length - 1)
  }

  const goUntimed = () => {
    setConfirmFree(false); setUntimed(true)
    markSession(MODE, { untimed: true })
    inputRef.current?.focus()
  }

  if (phase === 'setup') {
    return (
      <div className="arc-wrap">
        <div className="arc-card">
          <SetupCard mode={MODE} icon="🔗" title={t('Name Chain')} desc={t('Kenya → Afghanistan → Nepal… how long can your chain get?')} rules={RULES.map(r => r())} onStart={begin} />
        </div>
      </div>
    )
  }

  const links = chain.length - 1
  if (phase === 'over') {
    return (
      <div className="arc-wrap">
        <div className="arc-over">
          <div className="arc-over-big">{links}<small> {t(links === 1 ? 'link' : 'links')}</small></div>
          <div className="arc-over-sub">
            {endReason === 'stuck' ? t('No country left that starts with {l} — you used them all!', { l: letters(chain[chain.length - 1]).last })
              : t('Time\'s up. You needed a country starting with {l}.', { l: need })}
          </div>
          {endReason !== 'stuck' && options.length > 0 && (
            <div className="nc-missed">{t('You could have said: {c}', { c: options.slice(0, 4).map(localName).join(', ') })}</div>
          )}
          <div className="nc-chain nc-chain-done">{chain.map((c, i) => <span key={c} className={i === 0 ? 'nc-link nc-start' : 'nc-link'}>{COUNTRY_INFO[c]?.flag} {localName(c)}</span>)}</div>
          <div className="arc-over-btns">
            <button className="arc-primary" onClick={begin}>{t('▶ Play again')}</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="arc-wrap nc">
      <div className="tf-top">
        <span className="tf-score">🔗 {links}</span>
        {untimed
          ? <span className="nc-free">∞ {t('Untimed')}</span>
          : <>
              <div className="tf-timer"><span style={{ width: `${(left / TURN_MS) * 100}%` }} className={left < 6000 ? 'low' : ''} /></div>
              <span className="tf-clock">{Math.ceil(left / 1000)}s</span>
              <button className="nc-inf" onClick={() => setConfirmFree(true)} title={t('Play untimed')} aria-label={t('Play untimed')}>∞</button>
            </>}
      </div>
      <div className="nc-need">
        <span className="nc-need-label">{t('Next country starts with')}</span>
        <span className="nc-letter">{need}</span>
      </div>
      <form className="cg-form" onSubmit={submit}>
        <input ref={inputRef} className="tq-input" value={input} autoComplete="off" spellCheck={false}
          placeholder={t('Type a country starting with {l}…', { l: need })} onChange={e => { setInput(e.target.value); setMsg(null) }} />
        <button className="tq-btn tq-btn-primary" type="submit">{t('Add')}</button>
      </form>
      <div className={`cg-msg${msg?.err ? ' err' : ''}`} role="status">{msg?.text ?? ''}</div>
      <div className="nc-chain">
        {[...chain].reverse().map((c, i) => <span key={c} className={i === chain.length - 1 ? 'nc-link nc-start' : 'nc-link'}>{COUNTRY_INFO[c]?.flag} {localName(c)}</span>)}
      </div>
      {confirmFree && <UntimedConfirm onCancel={() => setConfirmFree(false)} onConfirm={goUntimed} />}
    </div>
  )
}
