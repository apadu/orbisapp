import { useEffect, useRef } from 'react'
import { getDifficulty, COMPLETION_RATE } from '../utils/completionDifficulty'
import { t, cn } from '../i18n'
import { plain } from '../utils/plain'
import { shareText, siteLink } from '../utils/share'
import { curName, langName, seaName, riverName, rangeName } from '../i18n/names'

// found names are stored in English; show them in the site language
const NAME_BY_TYPE = { currencies: curName, languages: langName, seas: seaName, rivers: riverName, mountains: rangeName }

/**
 * stats shape:
 * {
 *   game: string,        e.g. "Countries"
 *   icon: string,        e.g. "🌍"
 *   total: number,
 *   foundNames: string[],  display names in order found
 *   // for capitals/currencies: foundKeys maps name→country for difficulty lookup
 *   foundKeys?: string[],
 *   timeLabel: string,   e.g. "in 12:34" or "with 3:22 to spare" or ""
 *   type: 'countries'|'capitals'|'currencies'|'languages'|'seas'|'rivers'
 * }
 */
export default function CompletionModal({ stats, onClose, onPlayAgain }) {
  const { game, icon, total, foundNames, foundKeys, timeLabel, type } = stats
  const keys = foundKeys ?? foundNames

  // Pick 3 hardest finds (lowest difficulty %) that were still guessed
  const hardest = [...foundNames]
    .map((name, i) => ({ name, pct: getDifficulty(type, keys[i] ?? name) }))
    .sort((a, b) => a.pct - b.pct)
    .slice(0, 3)

  const completionRate = COMPLETION_RATE[type] ?? 10

  // Share text
  const shareMsg = [`Orbis · ${game}`, `${total}/${total} · ${timeLabel}`, siteLink(window.location.pathname)].join('\n')

  const handleShare = () => {
    shareText(shareMsg).then((r) => {
      if (r !== 'copied') return
      const btn = document.getElementById('cm-share-btn')
      if (btn) { btn.textContent = plain(t('✅ Copied!')); setTimeout(() => { btn.textContent = plain(t('📋 Copy result')) }, 2000) }
    })
  }

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  // Trap focus
  const modalRef = useRef(null)
  useEffect(() => { modalRef.current?.focus() }, [])

  return (
    <div className="cm-backdrop" onClick={onClose}>
      <div
        className="cm-card"
        onClick={e => e.stopPropagation()}
        ref={modalRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={t('{game} complete', { game: game })}
      >
        {/* Header */}
        <div className="cm-header">
          <div className="cm-trophy">🏆</div>
          <div className="cm-title">{t('All')} {total} {game}!</div>
          {timeLabel && <div className="cm-time">{timeLabel}</div>}
          <button className="cm-close" onClick={onClose} aria-label={t('Close')}>✕</button>
        </div>

        {/* Hardest finds */}
        {hardest.length > 0 && (
          <div className="cm-section">
            <div className="cm-section-label">{t('Your toughest finds')}</div>
            <div className="cm-hardest-list">
              {hardest.map(({ name, pct }) => (
                <div key={name} className="cm-hardest-row">
                  <span className="cm-hardest-name">{(NAME_BY_TYPE[type] ?? cn)(name)}</span>
                  <div className="cm-hardest-bar-wrap">
                    <div className="cm-hardest-bar" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="cm-hardest-pct">{pct}%</span>
                </div>
              ))}
            </div>
            <div className="cm-hardest-legend">{t('% of players who guess this')}</div>
          </div>
        )}

        {/* Completion stat */}
        <div className="cm-completion-stat">
          {t('You\'re among the')} <strong>~{completionRate}%</strong> {t('of players who finish')} {game}!
        </div>

        {/* Actions */}
        <div className="cm-actions">
          <button id="cm-share-btn" className="cm-btn cm-btn-share" onClick={handleShare}>
            {plain(t('📋 Copy result'))}
          </button>
          <button className="cm-btn cm-btn-again" onClick={() => { onClose(); onPlayAgain?.() }}>
            {t('↺ Play again')}
          </button>
        </div>
      </div>
    </div>
  )
}
