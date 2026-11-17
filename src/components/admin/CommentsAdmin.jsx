import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { gameMeta } from '../../utils/gameCatalog'

const FILTERS = [
  { id: 'reported', label: 'Raportate' },
  { id: 'latest',   label: 'Cele mai noi' },
  { id: 'hidden',   label: 'Ascunse' },
]

/** Admin: quiz comments — reported first; hide, show again or delete. */
export default function CommentsAdmin() {
  const [filter, setFilter] = useState('reported')
  const [rows, setRows] = useState(null)
  const [err, setErr] = useState(null)

  const load = useCallback(async () => {
    const { data, error } = await supabase.rpc('admin_comments', { p_filter: filter, p_limit: 100 })
    if (error) { setErr(/admin_comments|function|schema cache/i.test(error.message) ? 'Rulează supabase/comments.sql în SQL Editor ca să activezi comentariile.' : error.message); return }
    setErr(null); setRows(data ?? [])
  }, [filter])
  useEffect(() => { load() }, [load])

  const setHidden = async (id, hidden) => {
    const { error } = await supabase.rpc('admin_set_comment_hidden', { p_id: id, p_hidden: hidden })
    if (!error) setRows(r => r.filter(c => c.id !== id))
  }
  const remove = async (id) => {
    if (!window.confirm('Ștergi definitiv comentariul (și răspunsurile lui)?')) return
    const { error } = await supabase.from('quiz_comments').delete().eq('id', id)
    if (!error) setRows(r => r.filter(c => c.id !== id && c.parent_id !== id))
  }

  return (
    <section className="adm-card">
      <h3>Comentarii
        <span className="adm-periods" style={{ marginLeft: 12 }}>
          {FILTERS.map(f => <button key={f.id} className={`adm-chip${filter === f.id ? ' is-on' : ''}`} onClick={() => setFilter(f.id)}>{f.label}</button>)}
        </span>
      </h3>
      {err && <p className="adm-empty">{err}</p>}
      {!err && rows === null && <p className="adm-empty">Se încarcă…</p>}
      {!err && rows?.length === 0 && <p className="adm-empty">{filter === 'reported' ? '✓ Niciun comentariu raportat' : 'Nimic aici'}</p>}
      {!err && rows?.length > 0 && (
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead><tr><th>Când</th><th>Quiz</th><th>Utilizator</th><th>Comentariu</th><th>Rapoarte</th><th>Like</th><th></th></tr></thead>
            <tbody>
              {rows.map(c => (
                <tr key={c.id}>
                  <td>{new Date(c.created_at).toLocaleString('ro-RO', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</td>
                  <td>{gameMeta(c.quiz)?.label ?? c.quiz}</td>
                  <td>{c.username}{c.parent_id ? ' (răspuns)' : ''}</td>
                  <td style={{ maxWidth: 420, whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>{c.body}</td>
                  <td>{c.reports || '—'}</td>
                  <td>{c.like_count || '—'}</td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    {c.hidden
                      ? <button className="adm-btn" onClick={() => setHidden(c.id, false)}>Arată</button>
                      : <button className="adm-btn" onClick={() => setHidden(c.id, true)}>Ascunde</button>}
                    {' '}<button className="adm-btn" onClick={() => remove(c.id)}>Șterge</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
