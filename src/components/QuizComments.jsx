import { useCallback, useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../auth/AuthContext'
import { loadResults } from '../utils/results'
import Icon from './Icon'
import { t, locale } from '../i18n'

/**
 * Comments under a quiz (see supabase/comments.sql): one level of replies, likes, reports.
 * Hidden until you've finished (or given up on) the quiz once, so nobody reads the answers
 * before playing. Only signed-in players write; everyone can read.
 */

const MAX = 500
const PAGE = 50
// Words that never get posted (the report button + admin tab catch the rest)
const BLOCKED = ['pula', 'pizda', 'muie', 'futu', 'futut', 'fute', 'coaie', 'curva', 'fuck', 'fucking', 'shit', 'bitch', 'cunt', 'nigger', 'faggot', 'retard']
const fold = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
const isBlocked = (s) => fold(s).split(/[^a-z0-9]+/).some(w => BLOCKED.includes(w))

function ago(iso) {
  const s = (Date.now() - new Date(iso)) / 1000
  if (s < 60) return t('just now')
  if (s < 3600) return t('{n} min ago', { n: Math.floor(s / 60) })
  if (s < 86400) return t('{v}h ago', { v: Math.floor(s / 3600) })
  if (s < 2 * 86400) return t('yesterday')
  if (s < 30 * 86400) return t('{v}d ago', { v: Math.floor(s / 86400) })
  return new Date(iso).toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' })
}

const errorText = (e) => /rate_limited/.test(e?.message ?? '') ? t('Slow down a little — try again in a minute.') : t('Could not save. Check your connection and try again.')

/** Has this quiz been played to the end (or given up) at least once on this device / account? */
const playedBefore = (quiz) => loadResults().some(r => r.mode === quiz && (r.completed || r.details?.answers?.length))

export default function QuizComments({ quiz, unlocked }) {
  const auth = useAuth()
  const me = auth.user?.id ?? null
  const open = unlocked || playedBefore(quiz)
  const [count, setCount] = useState(null)
  const [rows, setRows] = useState(null)          // all comments (top level + replies), newest first
  const [liked, setLiked] = useState(() => new Set())
  const [sort, setSort] = useState('top')         // top · new
  const [error, setError] = useState(null)

  // Before the quiz is done: just the number
  useEffect(() => {
    if (!supabase || open) return
    supabase.from('quiz_comments').select('id', { count: 'exact', head: true }).eq('quiz', quiz).is('parent_id', null)
      .then(({ count: n }) => setCount(n ?? 0))
  }, [quiz, open])

  const load = useCallback(async () => {
    if (!supabase) return
    const { data, error: e } = await supabase.from('quiz_comments')
      .select('id, created_at, edited_at, user_id, parent_id, body, like_count, hidden, profiles(username, avatar_url)')
      .eq('quiz', quiz).order('created_at', { ascending: false }).limit(PAGE * 4)
    if (e) { setError(t('Comments could not be loaded.')); return }
    setRows(data ?? [])
    if (me && data?.length) {
      const { data: mine } = await supabase.from('comment_likes').select('comment_id').eq('user_id', me).in('comment_id', data.map(c => c.id))
      setLiked(new Set((mine ?? []).map(l => l.comment_id)))
    } else setLiked(new Set())
  }, [quiz, me])
  useEffect(() => { if (open) load() }, [open, load])

  const threads = useMemo(() => {
    if (!rows) return []
    const top = rows.filter(c => !c.parent_id)
    const replies = rows.filter(c => c.parent_id)
    const sorted = sort === 'top'
      ? [...top].sort((a, b) => b.like_count - a.like_count || new Date(b.created_at) - new Date(a.created_at))
      : top
    return sorted.slice(0, PAGE).map(c => ({ ...c, replies: replies.filter(r => r.parent_id === c.id).reverse() }))
  }, [rows, sort])

  // ── actions ──
  const post = async (body, parentId = null) => {
    const { data, error: e } = await supabase.from('quiz_comments')
      .insert({ quiz, parent_id: parentId, body })
      .select('id, created_at, edited_at, user_id, parent_id, body, like_count, hidden, profiles(username, avatar_url)').single()
    if (e) throw e
    setRows(r => [data, ...(r ?? [])])
  }
  const edit = async (id, body) => {
    const { error: e } = await supabase.from('quiz_comments').update({ body }).eq('id', id)
    if (e) throw e
    setRows(r => r.map(c => c.id === id ? { ...c, body, edited_at: new Date().toISOString() } : c))
  }
  const remove = async (id) => {
    if (!window.confirm(t('Delete this comment?'))) return
    const { error: e } = await supabase.from('quiz_comments').delete().eq('id', id)
    if (e) { setError(errorText(e)); return }
    setRows(r => r.filter(c => c.id !== id && c.parent_id !== id))
  }
  const toggleLike = async (c) => {
    if (!me) { auth.openAuth(); return }
    const on = liked.has(c.id)
    setLiked(s => { const n = new Set(s); on ? n.delete(c.id) : n.add(c.id); return n })
    setRows(r => r.map(x => x.id === c.id ? { ...x, like_count: x.like_count + (on ? -1 : 1) } : x))
    const { error: e } = on
      ? await supabase.from('comment_likes').delete().eq('comment_id', c.id).eq('user_id', me)
      : await supabase.from('comment_likes').insert({ comment_id: c.id })
    if (e && !/duplicate/i.test(e.message)) load()
  }
  const report = async (id) => {
    if (!me) { auth.openAuth(); return }
    const { error: e } = await supabase.from('comment_reports').insert({ comment_id: id })
    if (e && !/duplicate/i.test(e.message)) { setError(errorText(e)); return }
    setError(null)
    window.alert(t('Thanks — a moderator will take a look.'))
  }

  if (!supabase) return null

  if (!open) {
    return (
      <section className="qc qc-locked" aria-label={t('Comments')}>
        <Icon name="speech" size={18} />
        <span>
          {count ? t('{n} comments', { n: count }) : t('Comments')}
          {' · '}{t('finish the quiz to read them — no spoilers before you play')}
        </span>
      </section>
    )
  }

  const total = rows?.length ?? 0
  return (
    <section className="qc" aria-labelledby={`qc-title-${quiz}`}>
      <header className="qc-head">
        <h2 id={`qc-title-${quiz}`}>{t('Discussion')} {total > 0 && <span className="qc-count">{total}</span>}</h2>
        {total > 1 && (
          <div className="qc-sort" role="group" aria-label={t('Sort comments')}>
            <button className={sort === 'top' ? 'active' : ''} aria-pressed={sort === 'top'} onClick={() => setSort('top')}>{t('Top')}</button>
            <button className={sort === 'new' ? 'active' : ''} aria-pressed={sort === 'new'} onClick={() => setSort('new')}>{t('Newest')}</button>
          </div>
        )}
      </header>

      {me
        ? <Composer onSubmit={(b) => post(b)} placeholder={t('What did you think of this quiz?')} />
        : (
          <div className="qc-signin">
            <span>{t('Sign in to comment, reply and like.')}</span>
            <button className="tq-btn" onClick={auth.openAuth}>{t('Sign in')}</button>
          </div>
        )}

      {error && <p className="qc-error" role="alert">{error}</p>}
      {rows === null && !error && <p className="qc-muted">{t('Loading comments…')}</p>}
      {rows && threads.length === 0 && <p className="qc-muted">{t('No comments yet. Be the first to say something about this quiz.')}</p>}

      <ul className="qc-list">
        {threads.map(c => (
          <li key={c.id}>
            <Comment c={c} me={me} liked={liked.has(c.id)} onLike={() => toggleLike(c)} onEdit={edit} onDelete={remove} onReport={report}
              onReply={me ? (b) => post(b, c.id) : null} onNeedAuth={auth.openAuth} />
            {c.replies.length > 0 && (
              <ul className="qc-replies">
                {c.replies.map(r => (
                  <li key={r.id}>
                    <Comment c={r} me={me} liked={liked.has(r.id)} onLike={() => toggleLike(r)} onEdit={edit} onDelete={remove} onReport={report} />
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}

function Composer({ onSubmit, placeholder, initial = '', submitLabel, onCancel, autoFocus = false }) {
  const [text, setText] = useState(initial)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState(null)
  const left = MAX - text.length
  const send = async (e) => {
    e.preventDefault()
    const body = text.trim()
    if (!body || busy) return
    if (isBlocked(body)) { setErr(t('Please keep it friendly — that word isn\'t allowed.')); return }
    setBusy(true); setErr(null)
    try { await onSubmit(body); setText('') } catch (ex) { setErr(errorText(ex)) } finally { setBusy(false) }
  }
  return (
    <form className="qc-form" onSubmit={send}>
      <textarea value={text} onChange={e => setText(e.target.value.slice(0, MAX))} placeholder={placeholder} rows={initial ? 3 : 2}
        aria-label={placeholder} autoFocus={autoFocus}
        onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) send(e) }} />
      <div className="qc-form-row">
        <span className={`qc-left${left < 40 ? ' low' : ''}`}>{left}</span>
        {err && <span className="qc-error">{err}</span>}
        <span className="qc-grow" />
        {onCancel && <button type="button" className="tq-btn" onClick={onCancel}>{t('Cancel')}</button>}
        <button type="submit" className="tq-btn tq-btn-primary" disabled={!text.trim() || busy}>{submitLabel ?? t('Post')}</button>
      </div>
    </form>
  )
}

function Comment({ c, me, liked, onLike, onEdit, onDelete, onReport, onReply, onNeedAuth }) {
  const [mode, setMode] = useState(null)   // edit · reply
  const mine = me && c.user_id === me
  const name = c.profiles?.username ?? t('player')
  return (
    <article className={`qc-item${c.hidden ? ' qc-hidden' : ''}`}>
      {c.profiles?.avatar_url
        ? <img className="qc-avatar" src={c.profiles.avatar_url} alt="" referrerPolicy="no-referrer" />
        : <span className="qc-avatar qc-avatar-letter" aria-hidden="true">{name[0]?.toUpperCase()}</span>}
      <div className="qc-main">
        <div className="qc-meta">
          <strong>{name}</strong>
          <span>{ago(c.created_at)}{c.edited_at ? ` · ${t('edited')}` : ''}</span>
          {c.hidden && <span className="qc-flag">{t('hidden by a moderator')}</span>}
        </div>
        {mode === 'edit'
          ? <Composer initial={c.body} submitLabel={t('Save')} onCancel={() => setMode(null)} autoFocus
              onSubmit={async (b) => { await onEdit(c.id, b); setMode(null) }} />
          : <p className="qc-body">{c.body}</p>}
        {mode !== 'edit' && (
          <div className="qc-actions">
            <button className={`qc-like${liked ? ' on' : ''}`} onClick={onLike} aria-pressed={liked} aria-label={liked ? t('Unlike') : t('Like')}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden="true"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" /></svg>
              {c.like_count > 0 && <span>{c.like_count}</span>}
            </button>
            {onReply !== undefined && (
              <button onClick={() => onReply ? setMode(m => m === 'reply' ? null : 'reply') : onNeedAuth()}>{t('Reply')}</button>
            )}
            {mine && <button onClick={() => setMode('edit')}>{t('Edit')}</button>}
            {mine && <button onClick={() => onDelete(c.id)}>{t('Delete')}</button>}
            {!mine && <button onClick={() => onReport(c.id)}>{t('Report')}</button>}
          </div>
        )}
        {mode === 'reply' && onReply && (
          <Composer placeholder={t('Reply to {name}…', { name })} submitLabel={t('Reply')} onCancel={() => setMode(null)} autoFocus
            onSubmit={async (b) => { await onReply(b); setMode(null) }} />
        )}
      </div>
    </article>
  )
}
