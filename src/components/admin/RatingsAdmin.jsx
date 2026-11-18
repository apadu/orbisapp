import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { gameMeta } from '../../utils/gameCatalog'

/** Admin: how players rate each quiz — lowest first, so the ones worth fixing are on top. */
export default function RatingsAdmin() {
  const [rows, setRows] = useState(null)
  const [err, setErr] = useState(null)

  useEffect(() => {
    supabase.rpc('admin_quiz_ratings').then(({ data, error }) => {
      if (error) { setErr(/admin_quiz_ratings|function|schema cache/i.test(error.message) ? 'Rulează supabase/schema.sql (partea cu quiz_stats) în SQL Editor ca să vezi notele.' : error.message); return }
      setRows(data ?? [])
    })
  }, [])

  return (
    <section className="adm-card">
      <h3>Notele quiz-urilor <span className="adm-muted">(cele mai slab notate primele)</span></h3>
      {err && <p className="adm-empty">{err}</p>}
      {!err && rows === null && <p className="adm-empty">Se încarcă…</p>}
      {!err && rows?.length === 0 && <p className="adm-empty">Nicio notă încă</p>}
      {!err && rows?.length > 0 && (
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead><tr><th>Quiz</th><th>Medie</th><th>Note</th><th>Distribuție (1★ → 5★)</th><th>Jocuri</th><th>Scor mediu</th><th>Comentarii</th><th>Ultima notă</th></tr></thead>
            <tbody>
              {rows.map(r => {
                const max = Math.max(1, r.s1, r.s2, r.s3, r.s4, r.s5)
                return (
                  <tr key={r.quiz}>
                    <td>{gameMeta(r.quiz)?.label ?? r.quiz}</td>
                    <td><strong className={Number(r.avg_stars) < 3 ? 'adm-bad' : Number(r.avg_stars) >= 4 ? 'adm-good' : ''}>{Number(r.avg_stars).toFixed(1)}</strong></td>
                    <td>{r.ratings}</td>
                    <td>
                      <span className="adm-stars-dist" title={`1★ ${r.s1} · 2★ ${r.s2} · 3★ ${r.s3} · 4★ ${r.s4} · 5★ ${r.s5}`}>
                        {[r.s1, r.s2, r.s3, r.s4, r.s5].map((n, i) => <span key={i} style={{ height: `${Math.round((n / max) * 100)}%` }} />)}
                      </span>
                    </td>
                    <td>{r.plays || '—'}</td>
                    <td>{r.avg_pct != null ? `${r.avg_pct}%` : '—'}</td>
                    <td>{r.comments || '—'}</td>
                    <td>{new Date(r.last_rated).toLocaleDateString('ro-RO', { day: '2-digit', month: 'short' })}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
