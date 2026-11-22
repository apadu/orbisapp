import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../auth/AuthContext'
import { DUEL_CATEGORIES, DUEL_GROUPS, duelCategory } from '../utils/duelCategories'
import { playCorrect, playWrong, playWin } from '../utils/sounds'
import { startSession, trackAnswer, finishGame, markSession } from '../utils/results'
import { t } from '../i18n'
import { DuelBoard } from './profile/Leaderboard'

/**
 * "Don't Say What I Say": 2–8 players in a room, one category (countries of Africa, US states…).
 * Every round everyone types one answer before the clock runs out; the answers are shown together.
 * Same answer as someone else, a wrong one, one already said in this match or none → lose a life.
 * Last player standing wins.
 *
 * Networking: one Supabase Realtime channel per room (broadcast + presence, no tables).
 * The player who joined first is the host: it runs the clock, scores the rounds and broadcasts
 * the whole game state; if it leaves, the next player in line takes over from the last state.
 */

const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
const newCode = () => Array.from({ length: 5 }, () => CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)]).join('')
const REVEAL_MS = 5000
const OPEN_MS = 3000       // after the round: time for everyone to send their real answer

// ── Commit → reveal: nobody (not even the host) can see an answer before the round ends ──
// While answering, a player sends only sha256(round|key|text|salt) with a random secret salt.
// When the round closes, everyone sends the answer and the salt; the host checks it against
// the hash, so an answer can't be changed after seeing the others'.
async function sha256(s) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s))
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('')
}
const commitText = (round, key, text, salt) => `${round}|${key ?? ''}|${text}|${salt}`
const newSalt = () => [...crypto.getRandomValues(new Uint8Array(16))].map(b => b.toString(16).padStart(2, '0')).join('')
const MAX_PLAYERS = 8
const AUTO_START_MS = 30000   // public rooms start on their own this long after a 2nd player arrives
const LOBBY_CHANNEL = 'geofeverr-duel-lobby'   // public rooms announce themselves here (presence, one key per room)

function myId() {
  try {
    let id = sessionStorage.getItem('duel-id')
    if (!id) { id = Math.random().toString(36).slice(2, 10); sessionStorage.setItem('duel-id', id) }
    return id
  } catch { return Math.random().toString(36).slice(2, 10) }
}
const savedName = () => { try { return localStorage.getItem('duel-name') ?? '' } catch { return '' } }
const roomFromUrl = () => (new URLSearchParams(window.location.search).get('room') ?? '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 5)
function setRoomInUrl(code) {
  const u = new URL(window.location.href)
  if (code) u.searchParams.set('room', code); else u.searchParams.delete('room')
  window.history.replaceState(window.history.state, '', u)
}

const DEFAULT_SETTINGS = { cat: 'countries-europe', lives: 3, seconds: 15 }
const REACTIONS = ['👏', '😂', '😱', '🔥', '😤', '🤝']
function takePreset() {
  try { const c = sessionStorage.getItem('duel-cat'); sessionStorage.removeItem('duel-cat'); return c } catch { return null }
}
function takePublic() {
  try { const v = sessionStorage.getItem('duel-public') === '1'; sessionStorage.removeItem('duel-public'); return v } catch { return false }
}
const firstSettings = () => {
  const c = takePreset()
  return { ...DEFAULT_SETTINGS, ...(c && DUEL_CATEGORIES.some(x => x.id === c) ? { cat: c } : {}), public: takePublic() }
}

/** The public rooms waiting for players: [{ code, host, cat, n }] */
function useOpenRooms(active) {
  const [rooms, setRooms] = useState([])
  useEffect(() => {
    if (!supabase || !active) return
    const ch = supabase.channel(LOBBY_CHANNEL)
    ch.on('presence', { event: 'sync' }, () => {
      setRooms(Object.values(ch.presenceState()).map(m => m[0]).filter(r => r?.code && r.n < MAX_PLAYERS).sort((a, b) => b.n - a.n || a.at - b.at))
    })
    ch.subscribe()
    return () => { supabase.removeChannel(ch) }
  }, [active])
  return rooms
}
const lobbyState = (settings = DEFAULT_SETTINGS) => ({ phase: 'lobby', settings, players: {}, order: [], round: 0, answers: {}, results: null, used: [], winner: null })

// ── Scoring a round (host only) ─────────────────────────────────────────────
function scoreRound(g) {
  const players = structuredClone(g.players)
  const alive = g.order.filter(id => players[id].lives > 0)
  const used = new Set(g.used.map(u => u.key))
  const counts = {}
  for (const id of alive) { const k = g.answers[id]?.key; if (k && !used.has(k)) counts[k] = (counts[k] ?? 0) + 1 }
  const results = {}, newlyUsed = []
  for (const id of alive) {
    const a = g.answers[id]
    let outcome
    if (!a || !a.text) outcome = 'none'
    else if (!a.key) outcome = 'wrong'
    else if (used.has(a.key)) outcome = 'used'
    else if (counts[a.key] > 1) outcome = 'same'
    else outcome = 'ok'
    if (outcome === 'ok') players[id].score += 1
    else players[id].lives -= 1
    if (a?.key && !used.has(a.key) && !newlyUsed.some(u => u.key === a.key)) newlyUsed.push({ key: a.key, by: id })
    results[id] = { outcome, key: a?.key ?? null, text: a?.text ?? '' }
  }
  return { ...g, phase: 'reveal', players, results, used: [...g.used, ...newlyUsed] }
}

// After the reveal: next round, or the end of the match
function afterReveal(g) {
  const alive = g.order.filter(id => g.players[id].lives > 0)
  const total = duelCategory(g.settings.cat).total
  if (alive.length <= 1 || g.used.length >= total) {
    let winner = alive.length === 1 ? alive[0] : 'draw'
    if (alive.length > 1) {   // the category ran out: most points among the survivors
      const best = Math.max(...alive.map(id => g.players[id].score))
      const top = alive.filter(id => g.players[id].score === best)
      winner = top.length === 1 ? top[0] : 'draw'
    }
    return { ...g, phase: 'over', winner, results: g.results }
  }
  return { ...g, phase: 'answering', round: g.round + 1, answers: {}, results: null }
}

// ── The room: channel, presence, host election, shared state ───────────────
function useDuelRoom(code, name) {
  const me = useMemo(myId, [])
  const [status, setStatus] = useState('connecting')     // connecting · ready · error
  const [present, setPresent] = useState([])             // [{ id, name, joinedAt }] in join order
  const [g, setG] = useState(null)                       // shared game state
  const [deadline, setDeadline] = useState(0)            // local time the current round ends
  const chRef = useRef(null)
  const gRef = useRef(null); gRef.current = g
  const joinedAt = useRef(Date.now())
  const hostId = present[0]?.id ?? null
  const isHost = hostId === me
  const isHostRef = useRef(false); isHostRef.current = isHost
  const deadlineRef = useRef(0)
  const [reactions, setReactions] = useState({})       // player id → { emoji, at }
  // reactions fade after a few seconds
  useEffect(() => {
    if (!Object.keys(reactions).length) return
    const id = setTimeout(() => setReactions(r => Object.fromEntries(Object.entries(r).filter(([, v]) => Date.now() - v.at < 2600))), 2700)
    return () => clearTimeout(id)
  }, [reactions])

  const send = useCallback((event, payload) => {
    chRef.current?.send({ type: 'broadcast', event, payload: { ...payload, from: me } })
  }, [me])

  /** Host: change the state and broadcast it (with the time left in the round) */
  const publish = useCallback((next) => {
    const cur = gRef.current
    if ((next.phase === 'answering' || next.phase === 'revealing') && (cur?.phase !== next.phase || cur?.round !== next.round)) {
      deadlineRef.current = Date.now() + (next.phase === 'answering' ? next.settings.seconds * 1000 : OPEN_MS)
    }
    if (next.phase === 'lobby' && next.autoStart && !(cur?.phase === 'lobby' && cur?.autoStart)) deadlineRef.current = Date.now() + AUTO_START_MS
    gRef.current = next
    setG(next)
    if (next.phase === 'answering' || next.phase === 'revealing' || next.autoStart) setDeadline(deadlineRef.current)
    send('state', { state: next, remaining: Math.max(0, deadlineRef.current - Date.now()) })
  }, [send])

  useEffect(() => {
    if (!supabase || !code) return
    const ch = supabase.channel(`geofeverr-duel-${code}`, { config: { broadcast: { self: true }, presence: { key: me } } })
    chRef.current = ch
    ch.on('presence', { event: 'sync' }, () => {
      // names come from other people's browsers: keep them short and plain
      const list = Object.values(ch.presenceState()).map(metas => metas[0]).filter(m => m && typeof m.id === 'string')
        .map(m => ({ id: m.id.slice(0, 20), name: String(m.name ?? '').replace(/\s+/g, ' ').trim().slice(0, 20) || t('Player'), joinedAt: Number(m.joinedAt) || 0 }))
      list.sort((a, b) => a.joinedAt - b.joinedAt || (a.id < b.id ? -1 : 1))
      setPresent(list)
    })
    ch.on('broadcast', { event: 'state' }, ({ payload }) => {
      if (payload.from === me || !payload.state?.settings || !Array.isArray(payload.state.order)) return
      gRef.current = payload.state
      setG(payload.state)
      deadlineRef.current = Date.now() + (payload.remaining ?? 0)
      setDeadline(deadlineRef.current)
    })
    ch.on('broadcast', { event: 'hello' }, ({ payload }) => {
      if (payload.from !== me && isHostRef.current && gRef.current) publish(gRef.current)
    })
    ch.on('broadcast', { event: 'react' }, ({ payload }) => {
      if (!REACTIONS.includes(payload.emoji)) return
      setReactions(r => ({ ...r, [payload.from]: { emoji: payload.emoji, at: Date.now() } }))
    })
    // Host: a player locked in an answer (only its hash travels while the round is open)
    ch.on('broadcast', { event: 'commit' }, ({ payload }) => {
      const cur = gRef.current
      if (!isHostRef.current || !cur || cur.phase !== 'answering' || payload.round !== cur.round) return
      const p = cur.players[payload.from]
      if (!p || p.lives <= 0 || cur.answers[payload.from] || !/^[0-9a-f]{64}$/.test(payload.hash ?? '')) return
      publish({ ...cur, answers: { ...cur.answers, [payload.from]: { hash: payload.hash } } })
    })
    // Host: the real answer, after the round closed — accepted only if it matches the hash
    ch.on('broadcast', { event: 'reveal' }, async ({ payload }) => {
      if (!isHostRef.current) return
      const before = gRef.current
      const a = before?.answers[payload.from]
      if (!before || before.phase !== 'revealing' || payload.round !== before.round || !a?.hash || a.text != null) return
      const text = String(payload.text ?? '').slice(0, 60)
      const key = payload.key == null ? null : String(payload.key).slice(0, 80)
      if (await sha256(commitText(payload.round, key, text, String(payload.salt ?? ''))) !== a.hash) return
      const cur = gRef.current
      if (cur.phase !== 'revealing' || cur.round !== payload.round || cur.answers[payload.from]?.text != null) return
      publish({ ...cur, answers: { ...cur.answers, [payload.from]: { hash: a.hash, key, text } } })
    })
    ch.subscribe(async (s) => {
      if (s === 'SUBSCRIBED') {
        await ch.track({ id: me, name: name || t('Player'), joinedAt: joinedAt.current })
        setStatus('ready')
        ch.send({ type: 'broadcast', event: 'hello', payload: { from: me } })
      } else if (s === 'CHANNEL_ERROR' || s === 'TIMED_OUT') setStatus('error')
    })
    return () => { supabase.removeChannel(ch); chRef.current = null }
  }, [code, me]) // eslint-disable-line react-hooks/exhaustive-deps

  // A new name is shown to the others
  useEffect(() => {
    if (status === 'ready') chRef.current?.track({ id: me, name: name || t('Player'), joinedAt: joinedAt.current })
  }, [name, status, me])

  // A new room: the host opens the lobby (anyone joining later gets the state from the host)
  useEffect(() => {
    if (status !== 'ready' || !isHost) return
    // with others around, wait longer: the host's state (answer to "hello") should arrive first
    const id = setTimeout(() => { if (!gRef.current) publish(lobbyState(firstSettings())) }, present.length === 1 ? 1000 : 2500)
    return () => clearTimeout(id)
  }, [status, isHost, present.length, publish])

  // Host: a player who leaves mid-match is out (so nobody waits for them)
  useEffect(() => {
    const cur = gRef.current
    if (!isHost || !cur || cur.phase === 'lobby' || cur.phase === 'over') return
    const here = new Set(present.map(p => p.id))
    const gone = cur.order.filter(id => !here.has(id) && cur.players[id].lives > 0)
    if (!gone.length) return
    const players = structuredClone(cur.players)
    for (const id of gone) players[id].lives = 0
    let next = { ...cur, players }
    if (next.order.filter(id => players[id].lives > 0).length <= 1) next = afterReveal({ ...next, used: next.used })
    publish(next)
  }, [present, isHost, publish])

  // Host: close the round when everyone alive has locked in an answer, or when the clock runs out
  useEffect(() => {
    if (!isHost || !g || g.phase !== 'answering') return
    const alive = g.order.filter(id => g.players[id].lives > 0)
    const close = () => publish({ ...gRef.current, phase: 'revealing' })
    if (alive.every(id => g.answers[id])) { close(); return }
    const id = setTimeout(close, Math.max(0, deadlineRef.current - Date.now()) + 300)
    return () => clearTimeout(id)
  }, [g, isHost, publish])

  // Host: score once every locked-in answer has been opened (or after OPEN_MS: unopened = no answer)
  useEffect(() => {
    if (!isHost || !g || g.phase !== 'revealing') return
    const waiting = Object.values(g.answers).filter(a => a.text == null)
    if (!waiting.length) { publish(scoreRound(g)); return }
    const id = setTimeout(() => publish(scoreRound(gRef.current)), Math.max(0, deadlineRef.current - Date.now()) + 200)
    return () => clearTimeout(id)
  }, [g, isHost, publish])

  // Host: after the reveal, the next round
  useEffect(() => {
    if (!isHost || !g || g.phase !== 'reveal') return
    const id = setTimeout(() => publish(afterReveal(gRef.current)), REVEAL_MS)
    return () => clearTimeout(id)
  }, [g, isHost, publish])

  // Host of a public room: announce it in the shared lobby while it's waiting for players
  const ad = isHost && g?.settings.public && g.phase === 'lobby' && present.length < MAX_PLAYERS
    ? { code, host: present[0]?.name ?? '', cat: g.settings.cat, n: present.length } : null
  const adKey = ad ? JSON.stringify(ad) : ''
  const lobbyRef = useRef(null)
  useEffect(() => {
    if (!supabase) return
    if (!adKey) { if (lobbyRef.current) { supabase.removeChannel(lobbyRef.current); lobbyRef.current = null } return }
    const info = { ...JSON.parse(adKey), at: joinedAt.current }
    if (lobbyRef.current) { lobbyRef.current.track(info); return }
    const ch = supabase.channel(LOBBY_CHANNEL, { config: { presence: { key: code } } })
    lobbyRef.current = ch
    ch.subscribe(st => { if (st === 'SUBSCRIBED') ch.track(info) })
  }, [adKey, code])
  useEffect(() => () => { if (lobbyRef.current) supabase.removeChannel(lobbyRef.current) }, [])

  return { me, status, present, g, deadline, isHost, hostId, publish, send, reactions }
}

// ── UI ──────────────────────────────────────────────────────────────────────
const OUTCOME = {
  ok:    { icon: '✓', label: () => t('Safe') },
  same:  { icon: '⚡', label: () => t('Same answer!') },
  used:  { icon: '↺', label: () => t('Already said') },
  wrong: { icon: '✗', label: () => t('Not in the category') },
  none:  { icon: '⌛', label: () => t('No answer') },
}

function Hearts({ n, max }) {
  return <span className="duel-hearts" aria-label={t('{n} lives', { n })}>{Array.from({ length: max }, (_, i) => <span key={i} className={i < n ? 'on' : ''}>♥</span>)}</span>
}

function useCountdown(deadline, active) {
  const [left, setLeft] = useState(0)
  useEffect(() => {
    if (!active) return
    const tick = () => setLeft(Math.max(0, Math.ceil((deadline - Date.now()) / 1000)))
    tick()
    const id = setInterval(tick, 200)
    return () => clearInterval(id)
  }, [deadline, active])
  return left
}

function Room({ code, name, onLeave }) {
  const { me, status, present, g, deadline, isHost, hostId, publish, send, reactions } = useDuelRoom(code, name)
  const [confirmLeave, setConfirmLeave] = useState(false)
  const lastReact = useRef(0)
  const [input, setInput] = useState('')
  const [myAnswer, setMyAnswer] = useState(null)       // { round, text } sent this round
  const [copied, setCopied] = useState(false)
  const inputRef = useRef(null)
  const cat = g ? duelCategory(g.settings.cat) : null
  const left = useCountdown(deadline, g?.phase === 'answering')
  const nameOf = (id) => g?.players[id]?.name ?? present.find(p => p.id === id)?.name ?? '?'
  const inMatch = !!g?.players[me]
  const alive = inMatch && g.players[me].lives > 0

  useEffect(() => {
    if (g?.phase === 'answering' && alive) { setInput(''); setTimeout(() => inputRef.current?.focus(), 50) }
  }, [g?.phase, g?.round, alive])

  // Saved like any other game: one "answer" per round, the match result at the end (→ XP, profile, badges)
  const tracked = useRef('')
  useEffect(() => {
    if (!g || !g.players[me]) return
    const k = `${g.phase}-${g.round}`
    if (tracked.current === k) return
    tracked.current = k
    if (g.phase === 'answering' && g.round === 1) { startSession('duel'); markSession('duel', { cat: g.settings.cat, players: g.order.length }) }
    else if (g.phase === 'reveal' && g.results?.[me]) trackAnswer('duel', null, g.results[me].outcome === 'ok', 0, g.results[me].key ?? (g.results[me].text || '—'), { silent: true })
    else if (g.phase === 'over') finishGame('duel', { completed: true, score: g.players[me].score, meta: { won: g.winner === me, draw: g.winner === 'draw' } })
  }, [g, me])
  // leaving in the middle of a match: saved as unfinished
  const leave = () => {
    if (g && g.players[me] && g.phase !== 'lobby' && g.phase !== 'over') finishGame('duel', { completed: false })
    onLeave()
  }
  const react = (emoji) => {
    if (Date.now() - lastReact.current < 900) return
    lastReact.current = Date.now()
    send('react', { emoji })
  }
  const midMatch = !!g?.players[me] && g.phase !== 'lobby' && g.phase !== 'over'
  const bubble = (id) => reactions[id] && <span key={reactions[id].at} className="duel-bubble">{reactions[id].emoji}</span>

  // a sound for my own result
  const lastSound = useRef('')
  useEffect(() => {
    if (!g) return
    const k = `${g.phase}-${g.round}`
    if (lastSound.current === k) return
    lastSound.current = k
    if (g.phase === 'reveal' && g.results?.[me]) (g.results[me].outcome === 'ok' ? playCorrect : playWrong)()
    if (g.phase === 'over' && g.winner === me) playWin()
  }, [g, me])

  const link = `${window.location.origin}/quiz/duel?room=${code}`
  const copy = async () => {
    try {
      if (navigator.share && /Mobi|Android/i.test(navigator.userAgent)) await navigator.share({ title: 'GeoFeverr', text: t('Play "Don\'t Say What I Say" with me on GeoFeverr!'), url: link })
      else { await navigator.clipboard.writeText(link); setCopied(true); setTimeout(() => setCopied(false), 1800) }
    } catch {}
  }

  const submit = async (e) => {
    e?.preventDefault()
    if (!g || g.phase !== 'answering' || !alive || myAnswer?.round === g.round) return
    const text = input.trim().slice(0, 60)
    if (!text) return
    const round = g.round, key = cat.resolve(text), salt = newSalt()
    const mine = { round, key, text, salt }
    setMyAnswer(mine)
    send('commit', { round, hash: await sha256(commitText(round, key, text, salt)) })
  }
  // When the round closes, open my answer (again every second until the host has it)
  const opened = useRef({ round: 0, at: 0 })
  useEffect(() => {
    if (!g || g.phase !== 'revealing' || myAnswer?.round !== g.round || g.answers[me]?.text != null || !g.answers[me]) return
    const sendIt = () => {
      opened.current = { round: g.round, at: Date.now() }
      send('reveal', { round: myAnswer.round, key: myAnswer.key, text: myAnswer.text, salt: myAnswer.salt })
    }
    if (opened.current.round !== g.round || Date.now() - opened.current.at > 900) sendIt()
    const id = setInterval(sendIt, 1000)
    return () => clearInterval(id)
  }, [g, me, myAnswer, send])

  const setSettings = (patch) => publish({ ...g, settings: { ...g.settings, ...patch } })
  // Public rooms start on their own: a countdown once there are 2 players (the host can start sooner)
  const autoLeft = useCountdown(deadline, g?.phase === 'lobby' && !!g?.autoStart)
  useEffect(() => {
    if (!isHost || !g || g.phase !== 'lobby') return
    const want = !!g.settings.public && present.length >= 2
    if (want !== !!g.autoStart) { publish({ ...g, autoStart: want }); return }
    if (!want) return
    const id = setTimeout(() => startRef.current?.(), Math.max(0, deadline - Date.now()))
    return () => clearTimeout(id)
  }, [g, isHost, present.length, deadline, publish])
  const startRef = useRef(null)
  const start = () => {
    const ids = present.slice(0, MAX_PLAYERS).map(p => p.id)
    const players = Object.fromEntries(present.slice(0, MAX_PLAYERS).map(p => [p.id, { name: p.name, lives: g.settings.lives, score: 0 }]))
    publish({ ...lobbyState(g.settings), phase: 'answering', players, order: ids, round: 1 })
  }
  startRef.current = start

  if (status === 'error') return (
    <div className="duel-card duel-center">
      <p>{t('Could not connect to the room. Check your connection and try again.')}</p>
      <button className="duel-btn" onClick={onLeave}>{t('Back')}</button>
    </div>
  )
  if (status === 'connecting' || !g) return <div className="duel-card duel-center"><p>{t('Connecting…')}</p></div>

  const header = (
    <div className="duel-room-head">
      <div>
        <span className="duel-label">{t('Room')}</span>
        <span className="duel-code">{code}</span>
      </div>
      <button className="duel-btn ghost" onClick={copy}>{copied ? t('Link copied ✓') : t('Invite friends')}</button>
      {confirmLeave
        ? <span className="duel-confirm">{t('Leave the match?')} <button className="duel-btn ghost danger" onClick={leave}>{t('Leave')}</button> <button className="duel-btn ghost" onClick={() => setConfirmLeave(false)}>{t('Stay')}</button></span>
        : <button className="duel-btn ghost" onClick={() => (midMatch ? setConfirmLeave(true) : leave())}>{t('Leave')}</button>}
    </div>
  )
  const reactBar = (
    <div className="duel-reacts" aria-label={t('Reactions')}>
      {REACTIONS.map(e => <button key={e} type="button" onClick={() => react(e)}>{e}</button>)}
    </div>
  )

  // ── Lobby ──
  if (g.phase === 'lobby') return (
    <div className="duel">
      {header}
      <div className="duel-card">
        <h2>{t('Players')} <small>{present.length} / {MAX_PLAYERS}</small></h2>
        <ul className="duel-players">
          {present.map(p => (
            <li key={p.id}><span className="duel-dot" />{p.name}{p.id === me && <em> · {t('you')}</em>}{bubble(p.id)}{p.id === hostId && <span className="duel-host">{t('host')}</span>}</li>
          ))}
        </ul>
        {present.length >= 2 && reactBar}
        {present.length < 2 && <p className="duel-hint">{t('Send the link to a friend — the match starts when you have at least 2 players.')}</p>}
      </div>
      <div className="duel-card">
        <h2>{t('Settings')}</h2>
        {isHost ? (
          <div className="duel-settings">
            <label>{t('Category')}
              <select value={g.settings.cat} onChange={e => setSettings({ cat: e.target.value })}>
                {DUEL_GROUPS.map(gr => (
                  <optgroup key={gr.id} label={gr.label()}>
                    {DUEL_CATEGORIES.filter(c => c.group === gr.id).map(c => <option key={c.id} value={c.id}>{c.label()}</option>)}
                  </optgroup>
                ))}
              </select>
            </label>
            <div className="duel-row">
              <label>{t('Lives')}
                <select value={g.settings.lives} onChange={e => setSettings({ lives: +e.target.value })}>{[1, 2, 3, 5].map(n => <option key={n} value={n}>{n}</option>)}</select>
              </label>
              <label>{t('Seconds per round')}
                <select value={g.settings.seconds} onChange={e => setSettings({ seconds: +e.target.value })}>{[10, 15, 20, 30].map(n => <option key={n} value={n}>{n}</option>)}</select>
              </label>
            </div>
            <label className="duel-check">
              <input type="checkbox" checked={!!g.settings.public} onChange={e => setSettings({ public: e.target.checked })} />
              <span>{t('Public room')} <small>{t('Anyone can join from "Quick match". The match starts on its own 30 s after a second player arrives.')}</small></span>
            </label>
            <button className="duel-btn primary" disabled={present.length < 2} onClick={start}>
              {g.autoStart ? t('Start now ({n} s)', { n: autoLeft }) : t('Start the match')}
            </button>
          </div>
        ) : (
          <p className="duel-settings-ro">
            <b>{cat.label}</b> · {t('{n} lives', { n: g.settings.lives })} · {t('{n} s per round', { n: g.settings.seconds })}<br />
            <span className="duel-hint">{g.autoStart ? t('The match starts in {n} s…', { n: autoLeft }) : t('Waiting for {name} to start the match…', { name: present[0]?.name ?? '' })}</span>
          </p>
        )}
      </div>
      <Rules />
    </div>
  )

  // ── Match ──
  const sentThisRound = myAnswer?.round === g.round
  const scoreboard = (
    <ul className="duel-board">
      {g.order.map(id => {
        const p = g.players[id]
        const r = g.phase === 'reveal' || g.phase === 'over' ? g.results?.[id] : null
        return (
          <li key={id} className={`${p.lives <= 0 ? 'out' : ''}${id === me ? ' me' : ''}${r ? ` r-${r.outcome}` : ''}`}>
            <span className="duel-pname">{p.name}{id === me && <em> · {t('you')}</em>}{bubble(id)}</span>
            <Hearts n={Math.max(0, p.lives)} max={g.settings.lives} />
            <span className="duel-pscore">{p.score}</span>
            {g.phase === 'answering' && p.lives > 0 && <span className={`duel-ready${g.answers[id] ? ' on' : ''}`}>{g.answers[id] ? t('answered') : t('thinking…')}</span>}
            {g.phase === 'revealing' && p.lives > 0 && <span className="duel-ready">{t('revealing…')}</span>}
            {r && (
              <span className="duel-answer">
                <span className="duel-oicon">{OUTCOME[r.outcome].icon}</span>
                {r.key ? cat.show(r.key) : r.text || '—'}
                <small>{OUTCOME[r.outcome].label()}</small>
              </span>
            )}
          </li>
        )
      })}
    </ul>
  )

  return (
    <div className="duel">
      {header}
      <div className="duel-card duel-match">
        <div className="duel-topline">
          <span className="duel-cat">{cat.label}</span>
          <span className="duel-round">{t('Round {n}', { n: g.round })}</span>
          {g.phase === 'answering' && <span className={`duel-clock${left <= 3 ? ' urgent' : ''}`}>{left}s</span>}
        </div>

        {g.phase === 'answering' && (alive ? (
          <form className="duel-input" onSubmit={submit}>
            <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)} disabled={sentThisRound}
              placeholder={sentThisRound ? t('Answer sent: {a}', { a: myAnswer.text }) : t('Your answer…')} autoComplete="off" autoCapitalize="off" spellCheck={false} enterKeyHint="send" />
            <button className="duel-btn primary" disabled={sentThisRound || !input.trim()}>{t('Send')}</button>
          </form>
        ) : <p className="duel-hint">{inMatch ? t('You\'re out — watch the others finish.') : t('A match is in progress. You\'ll play in the next one.')}</p>)}

        {scoreboard}
        {reactBar}

        {g.phase === 'over' && (
          <div className="duel-over">
            <h2>{g.winner === 'draw' ? t('Draw!') : g.winner === me ? t('You won! 🏆') : t('{name} won! 🏆', { name: nameOf(g.winner) })}</h2>
            {isHost
              ? <button className="duel-btn primary" onClick={() => publish(lobbyState(g.settings))}>{t('Play again')}</button>
              : <p className="duel-hint">{t('Waiting for {name} to start a new match…', { name: present[0]?.name ?? '' })}</p>}
          </div>
        )}
      </div>

      {g.used.length > 0 && (
        <div className="duel-card">
          <h3>{t('Already said')} <small>{g.used.length} / {cat.total}</small></h3>
          <p className="duel-used">{g.used.map(u => cat.show(u.key)).join(' · ')}</p>
        </div>
      )}
    </div>
  )
}

function Rules() {
  return (
    <div className="duel-card duel-rules">
      <h3>{t('How to play')}</h3>
      <ul>
        <li>{t('Every round, everyone types one answer from the category before the clock runs out.')}</li>
        <li>{t('The answers are revealed together. Same answer as someone else? You both lose a life.')}</li>
        <li>{t('A wrong answer, one already said in this match, or no answer also costs a life.')}</li>
        <li>{t('The easy answers go fast — the last player standing wins.')}</li>
      </ul>
    </div>
  )
}

export default function Duel() {
  const { profile } = useAuth()
  const [name, setName] = useState(() => savedName() || profile?.username || '')
  const [code, setCode] = useState(roomFromUrl)
  const [entered, setEntered] = useState(() => !!roomFromUrl() && !!savedName())   // an invite link with a known name goes straight in
  const [joinCode, setJoinCode] = useState('')
  useEffect(() => { if (!name && profile?.username) setName(profile.username) }, [profile, name])
  useEffect(() => { try { localStorage.setItem('duel-name', name) } catch {} }, [name])

  const enter = (c) => { setRoomInUrl(c); setCode(c); setEntered(true) }
  const rooms = useOpenRooms(!entered)
  // Quick match: the fullest public room waiting for players, or a new public room
  const quick = () => {
    if (!name.trim()) return
    if (rooms.length) { enter(rooms[0].code); return }
    try { sessionStorage.setItem('duel-public', '1') } catch {}
    enter(newCode())
  }
  const leave = () => { setRoomInUrl(null); setCode(''); setEntered(false) }

  if (!supabase) return <div className="duel"><div className="duel-card duel-center"><p>{t('Multiplayer needs an internet connection to the GeoFeverr server.')}</p></div></div>

  if (code && entered && name.trim()) return <Room key={code} code={code} name={name.trim().slice(0, 20)} onLeave={leave} />

  return (
    <div className="duel">
      <header className="duel-intro">
        <h1>{t('Don\'t Say What I Say')}</h1>
        <p>{t('A multiplayer game for 2–8 players: name things from a category, but never the same as someone else.')}</p>
      </header>
      <div className="duel-card">
        <label className="duel-name">{t('Your name')}
          <input value={name} maxLength={20} onChange={e => setName(e.target.value)} placeholder={t('e.g. Alex')} />
        </label>
        {code ? (
          <button className="duel-btn primary" disabled={!name.trim()} onClick={() => enter(code)}>{t('Join room {code}', { code })}</button>
        ) : (
          <div className="duel-join">
            <button className="duel-btn primary" disabled={!name.trim()} onClick={quick}>{t('Quick match')}</button>
            <button className="duel-btn" disabled={!name.trim()} onClick={() => enter(newCode())}>{t('Room with friends')}</button>
            <span className="duel-or">{t('or')}</span>
            <form onSubmit={e => { e.preventDefault(); const c = joinCode.toUpperCase().replace(/[^A-Z0-9]/g, ''); if (c.length === 5 && name.trim()) enter(c) }}>
              <input value={joinCode} onChange={e => setJoinCode(e.target.value.toUpperCase().slice(0, 5))} placeholder={t('Room code')} className="duel-codein" autoCapitalize="characters" />
              <button className="duel-btn" disabled={joinCode.length !== 5 || !name.trim()}>{t('Join')}</button>
            </form>
          </div>
        )}
      </div>
      {!code && (
        <div className="duel-card">
          <h3>{t('Open rooms')} <small>{rooms.length}</small></h3>
          {rooms.length === 0
            ? <p className="duel-hint duel-hint-top">{t('No public rooms right now. "Quick match" opens one — others will find you here.')}</p>
            : (
              <ul className="duel-rooms">
                {rooms.slice(0, 8).map(r => (
                  <li key={r.code}>
                    <span className="duel-rooms-cat">{duelCategory(r.cat).label}</span>
                    <span className="duel-rooms-meta">{r.host} · {t('{n} / {max} players', { n: r.n, max: MAX_PLAYERS })}</span>
                    <button className="duel-btn" disabled={!name.trim()} onClick={() => enter(r.code)}>{t('Join')}</button>
                  </li>
                ))}
              </ul>
            )}
        </div>
      )}
      <DuelBoard compact />
      <Rules />
    </div>
  )
}
