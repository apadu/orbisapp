/**
 * Test fakes for Supabase: REST/auth calls get empty answers, and a tiny in-memory
 * Realtime server (Phoenix protocol, vsn 2.0.0) lets several pages play "Don't Say What I Say"
 * together without a real backend.
 */
const enc = new TextEncoder(), dec = new TextDecoder()
let refN = 1

export function createRealtime() {
  const topics = new Map()   // topic → Set(conn)
  function bin(topic, event, payload) {     // server → client user broadcast (binary kind 4)
    const t = enc.encode(topic), e = enc.encode(event)
    const out = new Uint8Array(5 + t.length + e.length + payload.length)
    out.set([4, t.length, e.length, 0, 1], 0); out.set(t, 5); out.set(e, 5 + t.length); out.set(payload, 5 + t.length + e.length)
    return Buffer.from(out)
  }
  return function attach(ws) {
    const conn = { ws, joined: new Map(), presence: new Map(), keys: new Map() }
    const send = (arr) => ws.send(JSON.stringify(arr))
    const members = (topic) => [...(topics.get(topic) ?? [])]
    const diff = (topic, joins, leaves) => { for (const c of members(topic)) c.ws.send(JSON.stringify([c.joined.get(topic), null, topic, 'presence_diff', { joins, leaves }])) }
    const leave = (topic) => {
      const p = conn.presence.get(topic)
      topics.get(topic)?.delete(conn); conn.presence.delete(topic)
      if (p) diff(topic, {}, { [p.key]: { metas: [p.meta] } })
    }
    ws.onMessage(raw => {
      if (typeof raw !== 'string') {                       // client user broadcast (binary kind 3)
        const b = new Uint8Array(raw)
        if (b[0] !== 3) return
        const [jl, rl, tl, el, ml] = [b[1], b[2], b[3], b[4], b[5]]
        let o = 7
        const joinRef = dec.decode(b.slice(o, o += jl)), ref = dec.decode(b.slice(o, o += rl))
        const topic = dec.decode(b.slice(o, o += tl)), event = dec.decode(b.slice(o, o += el)); o += ml
        for (const c of members(topic)) c.ws.send(bin(topic, event, b.slice(o)))
        if (ref) send([joinRef, ref, topic, 'phx_reply', { status: 'ok', response: {} }])
        return
      }
      const [joinRef, ref, topic, event, payload] = JSON.parse(raw)
      const reply = (response = {}) => send([joinRef, ref, topic, 'phx_reply', { status: 'ok', response }])
      if (event === 'phx_join') {
        if (!topics.has(topic)) topics.set(topic, new Set())
        topics.get(topic).add(conn); conn.joined.set(topic, joinRef)
        conn.keys.set(topic, payload.config?.presence?.key || `anon${refN++}`)
        reply({ postgres_changes: [] })
        const state = {}
        for (const c of members(topic)) { const p = c.presence.get(topic); if (p) state[p.key] = { metas: [p.meta] } }
        send([joinRef, null, topic, 'presence_state', state])
      } else if (event === 'presence' && payload.event === 'track') {
        const key = conn.keys.get(topic), meta = { ...payload.payload, phx_ref: String(refN++) }
        const old = conn.presence.get(topic)
        conn.presence.set(topic, { key, meta })
        reply()
        diff(topic, { [key]: { metas: [meta] } }, old ? { [key]: { metas: [old.meta] } } : {})
      } else if (event === 'phx_leave') { leave(topic); reply() } else reply()
    })
    ws.onClose(() => { for (const tp of [...conn.joined.keys()]) leave(tp) })
  }
}

/** Every page: no real backend, a fixed language, optional saved results. */
export async function setup(page, { lang = 'ro', results = null, realtime = null } = {}) {
  await page.route('**/rest/v1/**', r => r.fulfill({ status: 200, contentType: 'application/json', body: '[]' }))
  await page.route('**/auth/v1/**', r => r.fulfill({ status: 200, contentType: 'application/json', body: '{}' }))
  if (realtime) await page.routeWebSocket(/realtime/, realtime)
  await page.addInitScript(({ lang, results }) => {
    if (sessionStorage.getItem('e2e-seeded')) return
    sessionStorage.setItem('e2e-seeded', '1')
    localStorage.setItem('orbis-lang', lang)
    if (results) localStorage.setItem('orbis_results_guest', JSON.stringify(results))
  }, { lang, results })
  const errors = []
  page.on('pageerror', e => errors.push(e.message))
  return errors
}

export const finished = (n) => Array.from({ length: n }, (_, i) => ({
  client_id: `seed${i}`, mode: 'flag', score: 50, correct: 8, total: 10, completed: true,
  duration_ms: 60000, details: {}, played_at: new Date(Date.now() - i * 3600e3).toISOString(),
}))
