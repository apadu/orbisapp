import { useEffect, useMemo, useRef, useState } from 'react'
import { ALL_GAMES, GAME_GROUPS, searchGames } from '../utils/gameRegistry'
import { loadResults } from '../utils/results'
import { t } from '../i18n'

const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform ?? '')
export const PALETTE_SHORTCUT = isMac ? '⌘K' : 'Ctrl K'

function recentIds(n = 5) {
  const seen = []
  for (const r of loadResults()) {
    if (!seen.includes(r.mode) && ALL_GAMES.some(g => g.id === r.mode)) seen.push(r.mode)
    if (seen.length >= n) break
  }
  return seen
}

/**
 * Search every game (Ctrl/⌘ K). Arrow keys + Enter, Esc to close.
 * Empty query → recent games first, then everything grouped by category.
 */
export default function CommandPalette({ open, onClose, onSelect }) {
  const [q, setQ] = useState('')
  const [idx, setIdx] = useState(0)
  const inputRef = useRef(null)
  const listRef = useRef(null)

  useEffect(() => {
    if (!open) return
    setQ(''); setIdx(0)
    setTimeout(() => inputRef.current?.focus(), 10)
  }, [open])

  const sections = useMemo(() => {
    if (!open) return []
    if (q.trim()) return [{ id: 'results', label: null, items: searchGames(q) }]
    const rec = recentIds().map(id => ALL_GAMES.find(g => g.id === id))
    return [
      ...(rec.length ? [{ id: 'recent', label: t('Recently played'), items: rec }] : []),
      ...GAME_GROUPS.map(g => ({ id: g.id, label: `${g.icon} ${g.label}`, items: ALL_GAMES.filter(x => x.group === g.id) })),
    ]
  }, [q, open])

  const flat = useMemo(() => sections.flatMap(s => s.items), [sections])

  useEffect(() => { setIdx(0) }, [q])
  useEffect(() => {
    listRef.current?.querySelector(`[data-idx="${idx}"]`)?.scrollIntoView({ block: 'nearest' })
  }, [idx])

  if (!open) return null

  const pick = (g) => { if (g) { onSelect(g.id); onClose() } }
  const onKey = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setIdx(i => Math.min(flat.length - 1, i + 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setIdx(i => Math.max(0, i - 1)) }
    else if (e.key === 'Enter') { e.preventDefault(); pick(flat[idx]) }
    else if (e.key === 'Escape') { e.preventDefault(); onClose() }
  }

  let n = -1
  return (
    <div className="cp-backdrop" onMouseDown={onClose}>
      <div className="cp" role="dialog" aria-label={t('Search games')} onMouseDown={e => e.stopPropagation()}>
        <div className="cp-search">
          <span className="cp-search-icon">🔎</span>
          <input
            ref={inputRef}
            value={q}
            onChange={e => setQ(e.target.value)}
            onKeyDown={onKey}
            placeholder={t('Search {n} games…', { n: ALL_GAMES.length })}
            autoComplete="off" spellCheck={false}
          />
          <kbd className="cp-esc">Esc</kbd>
        </div>
        <div className="cp-list" ref={listRef}>
          {flat.length === 0 && <div className="cp-empty">{t('No games match "{q}"', { q })}</div>}
          {sections.map(s => s.items.length > 0 && (
            <div key={s.id} className="cp-section">
              {s.label && <div className="cp-section-label">{s.label}</div>}
              {s.items.map(g => {
                n++
                const i = n
                return (
                  <button
                    key={`${s.id}-${g.id}`}
                    data-idx={i}
                    className={`cp-item${i === idx ? ' active' : ''}`}
                    onMouseEnter={() => setIdx(i)}
                    onClick={() => pick(g)}
                  >
                    <span className="cp-item-icon">{g.icon}</span>
                    <span className="cp-item-text">
                      <span className="cp-item-label">{g.label}</span>
                      <span className="cp-item-desc">{g.desc}</span>
                    </span>
                    <span className="cp-item-group">{g.sub ?? GAME_GROUPS.find(x => x.id === g.group)?.label}</span>
                  </button>
                )
              })}
            </div>
          ))}
        </div>
        <div className="cp-foot">
          <span><kbd>↑</kbd><kbd>↓</kbd> {t('navigate')}</span>
          <span><kbd>Enter</kbd> {t('play')}</span>
          <span><kbd>{PALETTE_SHORTCUT}</kbd> {t('open anywhere')}</span>
        </div>
      </div>
    </div>
  )
}
