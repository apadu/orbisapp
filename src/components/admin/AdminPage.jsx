import { useCallback, useEffect, useMemo, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../auth/AuthContext'
import { gameMeta } from '../../utils/gameCatalog'
import './admin.css'
import CommentsAdmin from './CommentsAdmin'
import RatingsAdmin from './RatingsAdmin'

/**
 * /admin — only for accounts listed in public.admins (see supabase/admin.sql).
 * All numbers come from one RPC, admin_overview(), which refuses anyone else.
 * Admin-only screen, so it's written in Romanian directly instead of going through t().
 */

const PERIODS = [{ d: 1, label: 'Azi' }, { d: 7, label: '7 zile' }, { d: 30, label: '30 zile' }, { d: 90, label: '90 zile' }]
const nf = new Intl.NumberFormat('ro-RO')
const fmtN = (n) => nf.format(n ?? 0)
const fmtDate = (s) => s ? new Date(s).toLocaleString('ro-RO', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—'
const fmtDay = (s) => new Date(`${s}T12:00:00`).toLocaleDateString('ro-RO', { weekday: 'short', day: 'numeric', month: 'short' })

function ago(s) {
  if (!s) return '—'
  const m = Math.round((Date.now() - new Date(s)) / 60000)
  if (m < 1) return 'chiar acum'
  if (m < 60) return `acum ${m} min`
  const h = Math.round(m / 60)
  if (h < 24) return `acum ${h} h`
  return `acum ${Math.round(h / 24)} z`
}

// "/play/silhouette" → "🌍 Silhouette" — paths are easier to read as game names
function pageLabel(path) {
  const [, head, id] = path.split('/')
  if (!head) return '🏠 Acasă'
  if ((head === 'play' || head === 'quiz') && id) { const g = gameMeta(id); return `${g.icon} ${g.label}` }
  if (head === 'quiz') return '🧠 Quiz Hub'
  if (head === 'daily') return '📅 Quiz-ul zilei'
  if (head === 'profile') return '👤 Profil'
  return path
}
const gameLabel = (mode) => { const g = gameMeta(mode); return `${g.icon} ${g.label}` }

// ── Pieces ──────────────────────────────────────────────────────────────────

function Stat({ label, value, sub, tone }) {
  return (
    <div className={`adm-stat${tone ? ` adm-stat-${tone}` : ''}`}>
      <div className="adm-stat-label">{label}</div>
      <div className="adm-stat-value">{value}</div>
      {sub && <div className="adm-stat-sub">{sub}</div>}
    </div>
  )
}

/** One series per chart (small multiples): bars per day, hover shows the exact number. */
function DailyBars({ title, data, field, tone }) {
  const [hover, setHover] = useState(null)
  const W = 600, H = 140, PAD_T = 8, PAD_B = 18
  const max = Math.max(1, ...data.map(d => d[field]))
  const n = data.length || 1
  const slot = W / n
  const bw = Math.max(2, slot - 2)                       // 2px gap between bars
  const total = data.reduce((s, d) => s + d[field], 0)
  const y = (v) => PAD_T + (H - PAD_T - PAD_B) * (1 - v / max)
  const bar = (x, v) => {
    const top = y(v), base = H - PAD_B, r = Math.min(4, bw / 2, base - top)
    if (v <= 0) return null
    return `M${x},${base} V${top + r} Q${x},${top} ${x + r},${top} H${x + bw - r} Q${x + bw},${top} ${x + bw},${top + r} V${base} Z`
  }
  const h = hover != null ? data[hover] : null
  return (
    <div className="adm-card adm-chart">
      <div className="adm-chart-head">
        <h3>{title}</h3>
        {h
          ? <span className="adm-chart-total"><span className="adm-chart-day">{fmtDay(h.day)}</span> {fmtN(h[field])}</span>
          : <span className="adm-chart-total">{fmtN(total)}</span>}
      </div>
      <div className="adm-chart-wrap" onMouseLeave={() => setHover(null)}>
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" role="img" aria-label={`${title}: ${fmtN(total)} în total, maxim ${fmtN(max)} pe zi`}>
          {[0.5, 1].map(f => <line key={f} x1="0" x2={W} y1={y(max * f)} y2={y(max * f)} className="adm-grid" />)}
          <line x1="0" x2={W} y1={H - PAD_B} y2={H - PAD_B} className="adm-axis" />
          {data.map((d, i) => (
            <g key={d.day} onMouseEnter={() => setHover(i)}>
              <rect x={i * slot} y="0" width={slot} height={H} fill="transparent" />
              <path d={bar(i * slot + 1, d[field]) ?? ''} className={`adm-bar adm-bar-${tone}${hover === i ? ' is-hover' : ''}`} />
            </g>
          ))}
        </svg>
        <div className="adm-chart-axis">
          <span>{data[0] && fmtDay(data[0].day)}</span>
          <span>max {fmtN(max)}</span>
          <span>{data.length > 1 && fmtDay(data[data.length - 1].day)}</span>
        </div>
      </div>
    </div>
  )
}

/** Ranked list with a thin magnitude bar behind each row. */
function RankList({ title, rows, label, value, extra, empty = 'Nimic încă' }) {
  const max = Math.max(1, ...rows.map(value))
  return (
    <div className="adm-card">
      <h3>{title}</h3>
      {rows.length === 0 ? <p className="adm-empty">{empty}</p> : (
        <ul className="adm-rank">
          {rows.map((r, i) => (
            <li key={i}>
              <div className="adm-rank-bar" style={{ width: `${(value(r) / max) * 100}%` }} />
              <span className="adm-rank-label" title={typeof label(r) === 'string' ? label(r) : undefined}>{label(r)}</span>
              {extra && <span className="adm-rank-extra">{extra(r)}</span>}
              <span className="adm-rank-value">{fmtN(value(r))}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function ErrorItem({ e, onResolve }) {
  const [open, setOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  return (
    <li className="adm-err">
      <div className="adm-err-head" onClick={() => setOpen(o => !o)}>
        <span className={`adm-pill adm-pill-${e.kind}`}>{e.kind}</span>
        <span className="adm-err-msg">{e.message}</span>
        <span className="adm-err-meta">{fmtN(e.hits)}× · {fmtN(e.people)} pers. · {ago(e.last_seen)}</span>
      </div>
      {open && (
        <div className="adm-err-body">
          <div className="adm-err-facts">
            <span>Pagina: <code>{e.last_path ?? '—'}</code></span>
            <span>Versiune: <code>{e.last_version ?? '—'}</code></span>
            <span>Prima dată: {fmtDate(e.first_seen)}</span>
            <span>Ultima dată: {fmtDate(e.last_seen)}</span>
          </div>
          {e.last_agent && <div className="adm-err-agent">{e.last_agent}</div>}
          {e.stack && <pre>{e.stack}</pre>}
          {e.component_stack && <details><summary>Component stack</summary><pre>{e.component_stack}</pre></details>}
          <div className="adm-err-actions">
            <button className="adm-btn" onClick={() => navigator.clipboard?.writeText(`${e.message}\n\n${e.stack ?? ''}\n\nPagina: ${e.last_path}\nVersiune: ${e.last_version}\n${e.last_agent ?? ''}`)}>Copiază</button>
            <button className="adm-btn adm-btn-ok" disabled={busy} onClick={async () => { setBusy(true); await onResolve(e.message); setBusy(false) }}>✓ Rezolvat</button>
          </div>
        </div>
      )}
    </li>
  )
}

// ── Page ────────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const { ready, user, openAuth } = useAuth()
  const [days, setDays] = useState(7)
  const [data, setData] = useState(null)
  const [err, setErr] = useState(null)
  const [loading, setLoading] = useState(false)
  const [loadedAt, setLoadedAt] = useState(null)
  const [userQuery, setUserQuery] = useState('')

  useEffect(() => { document.title = 'Admin · Orbis' }, [])

  const load = useCallback(async () => {
    if (!supabase || !user) return
    setLoading(true)
    const { data: d, error } = await supabase.rpc('admin_overview', { p_days: days })
    setLoading(false)
    if (error) { setErr(/not_admin/.test(error.message) ? 'not_admin' : error.message); return }
    setErr(null); setData(d); setLoadedAt(new Date())
  }, [days, user])

  useEffect(() => { load() }, [load])
  // Refresh every minute while the tab is visible
  useEffect(() => {
    const id = setInterval(() => { if (document.visibilityState === 'visible') load() }, 60_000)
    return () => clearInterval(id)
  }, [load])

  const resolve = async (message) => {
    const { error } = await supabase.rpc('admin_resolve_error', { p_message: message })
    if (!error) setData(d => ({ ...d, errors: d.errors.filter(e => e.message !== message), totals: { ...d.totals, open_errors: Math.max(0, d.totals.open_errors - 1) } }))
  }

  const users = useMemo(() => {
    const q = userQuery.trim().toLowerCase()
    const all = data?.users ?? []
    return q ? all.filter(u => u.username?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q)) : all
  }, [data, userQuery])

  // ── Gates ──
  if (!supabase) return <Gate title="Backend neconfigurat" text="Lipsesc VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY." />
  if (!ready) return <Gate title="Se încarcă…" />
  if (!user) return <Gate title="Admin Orbis" text="Conectează-te cu contul de admin." action={<button className="adm-btn adm-btn-primary" onClick={openAuth}>Conectare</button>} />
  if (err === 'not_admin') return <Gate title="Acces interzis" text="Contul acesta nu are drepturi de admin." />
  if (err) return <Gate title="Eroare" text={err} action={<button className="adm-btn" onClick={load}>Reîncearcă</button>} />
  if (!data) return <Gate title="Se încarcă…" />

  const T = data.totals
  const pagesPerVisit = T.visits ? (T.views / T.visits).toFixed(1) : '0'

  return (
    <div className="adm">
      <header className="adm-top">
        <a href="/" className="adm-back">← Orbis</a>
        <h1>Admin</h1>
        <div className="adm-periods" role="group" aria-label="Perioadă">
          {PERIODS.map(p => (
            <button key={p.d} className={`adm-chip${days === p.d ? ' is-on' : ''}`} onClick={() => setDays(p.d)}>{p.label}</button>
          ))}
        </div>
        <button className="adm-btn" onClick={load} disabled={loading}>{loading ? '…' : '↻'}</button>
        <span className="adm-updated">{loadedAt && `actualizat ${loadedAt.toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' })}`}</span>
      </header>

      <section className="adm-stats">
        <Stat label="Vizite" value={fmtN(T.visits)} sub={`${pagesPerVisit} pagini / vizită`} />
        <Stat label="Pagini vizualizate" value={fmtN(T.views)} />
        <Stat label="Jocuri (cu cont)" value={fmtN(T.games)} sub={`${fmtN(T.games_all_time)} de la început`} />
        <Stat label="Jucători activi" value={fmtN(T.active_players)} />
        <Stat label="Conturi noi" value={fmtN(T.new_users)} sub={`${fmtN(T.users)} în total`} />
        <Stat label="Erori deschise" value={fmtN(T.open_errors)} sub={`${fmtN(T.errors)} rapoarte în perioadă`} tone={T.open_errors ? 'bad' : 'good'} />
      </section>

      {data.daily.length > 1 && (
        <section className="adm-grid4">
          <DailyBars title="Vizite pe zi" data={data.daily} field="visits" tone="accent" />
          <DailyBars title="Jocuri pe zi" data={data.daily} field="games" tone="accent" />
          <DailyBars title="Conturi noi pe zi" data={data.daily} field="signups" tone="accent" />
          <DailyBars title="Erori pe zi" data={data.daily} field="errors" tone="bad" />
        </section>
      )}

      <section className="adm-card">
        <h3>Erori deschise <span className="adm-muted">(ultimele 30 de zile, grupate după mesaj)</span></h3>
        {data.errors.length === 0 ? <p className="adm-empty">✓ Nicio eroare deschisă</p> : (
          <ul className="adm-errs">{data.errors.map(e => <ErrorItem key={e.kind + e.message} e={e} onResolve={resolve} />)}</ul>
        )}
      </section>

      <CommentsAdmin />

      <RatingsAdmin />

      <section className="adm-grid2">
        <RankList title="Pagini populare" rows={data.top_pages} label={r => pageLabel(r.path)} value={r => r.views} extra={r => `${fmtN(r.visits)} viz.`} />
        <RankList title="Jocuri populare (jucători cu cont)" rows={data.top_games} label={r => gameLabel(r.mode)} value={r => r.plays}
          extra={r => `${fmtN(r.players)} juc.${r.avg_accuracy != null ? ` · ${r.avg_accuracy}%` : ''}`} />
      </section>

      <section className="adm-grid3">
        <RankList title="De unde vin" rows={data.referrers} label={r => r.host === '(direct)' ? 'Direct / necunoscut' : r.host} value={r => r.visits} />
        <RankList title="Dispozitive" rows={data.devices} label={r => ({ mobile: '📱 Telefon', tablet: '📟 Tabletă', desktop: '💻 Desktop' }[r.device] ?? r.device)} value={r => r.visits} />
        <RankList title="Limbă" rows={data.langs} label={r => ({ ro: '🇷🇴 Română', en: '🇬🇧 Engleză' }[r.lang] ?? r.lang)} value={r => r.visits} />
      </section>

      <section className="adm-card">
        <div className="adm-card-head">
          <h3>Utilizatori <span className="adm-muted">(ultimii 50 înscriși)</span></h3>
          <input className="adm-search" placeholder="Caută nume sau email…" value={userQuery} onChange={e => setUserQuery(e.target.value)} />
        </div>
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead><tr><th>Utilizator</th><th>Email</th><th>Cont</th><th>Înscris</th><th>Ultima conectare</th><th className="num">Jocuri</th><th>Ultimul joc</th></tr></thead>
            <tbody>
              {users.map(u => (
                <tr key={u.username}>
                  <td><b>{u.username}</b></td>
                  <td className="adm-dim">{u.email}</td>
                  <td>{u.provider === 'google' ? 'Google' : u.provider === 'email' ? 'Email' : (u.provider ?? '—')}</td>
                  <td>{fmtDate(u.created_at)}</td>
                  <td>{ago(u.last_sign_in_at)}</td>
                  <td className="num">{fmtN(u.games)}</td>
                  <td>{ago(u.last_played)}</td>
                </tr>
              ))}
              {users.length === 0 && <tr><td colSpan={7} className="adm-empty">Niciun rezultat</td></tr>}
            </tbody>
          </table>
        </div>
      </section>

      <section className="adm-grid2">
        <RankList title="Cei mai activi jucători" rows={data.top_players} label={r => r.username} value={r => r.games} extra={r => ago(r.last_played)} />
        <div className="adm-card">
          <h3>Rezultate suspecte <span className="adm-muted">(scoase din clasamente automat)</span></h3>
          {data.flagged_results.length === 0 ? <p className="adm-empty">✓ Niciunul</p> : (
            <div className="adm-table-wrap">
              <table className="adm-table">
                <thead><tr><th>Jucător</th><th>Joc</th><th className="num">Scor</th><th className="num">Corecte</th><th className="num">Timp</th><th>Când</th></tr></thead>
                <tbody>
                  {data.flagged_results.map((r, i) => (
                    <tr key={i}>
                      <td>{r.username}</td><td>{gameLabel(r.mode)}</td><td className="num">{fmtN(r.score)}</td>
                      <td className="num">{r.correct}/{r.total}</td>
                      <td className="num">{r.duration_ms != null ? `${Math.round(r.duration_ms / 1000)} s` : '—'}</td>
                      <td>{fmtDate(r.played_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      <p className="adm-foot">
        Vizitele sunt numărate anonim de Orbis (fără cookie-uri; se păstrează 180 de zile). Jocurile vizitatorilor fără cont rămân doar în browserul lor, deci nu apar aici.
      </p>
    </div>
  )
}

function Gate({ title, text, action }) {
  return (
    <div className="adm adm-gate">
      <div className="adm-card">
        <h1>{title}</h1>
        {text && <p>{text}</p>}
        <div className="adm-gate-actions">
          {action}
          <a href="/" className="adm-btn">← Înapoi la Orbis</a>
        </div>
      </div>
    </div>
  )
}
