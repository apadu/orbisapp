import { useState } from 'react'
import { shareText, siteLink } from '../utils/share'
import Icon from './Icon'
import { t } from '../i18n'

/** "Orbis · Capitals / 150/196 (77%) / 🟩🟩🟩🟩🟩🟩🟩🟩⬛⬛ / link" — for any quiz result. */
export function resultText({ title, score, total, extra }) {
  const pct = total ? score / total : 0
  const filled = Math.round(pct * 10)
  return [
    `Orbis · ${title}`,
    `${score}/${total} (${Math.round(pct * 100)}%)${extra ? ` · ${extra}` : ''}`,
    '🟩'.repeat(filled) + '⬛'.repeat(10 - filled),
    siteLink(typeof window !== 'undefined' ? window.location.pathname : '/'),
  ].join('\n')
}

export default function ShareButton({ text, className = 'tq-btn' }) {
  const [copied, setCopied] = useState(false)
  const go = async () => {
    if (await shareText(typeof text === 'function' ? text() : text) === 'copied') {
      setCopied(true); setTimeout(() => setCopied(false), 2000)
    }
  }
  return (
    <button className={`${className} share-result-btn`} onClick={go}>
      <Icon name={copied ? 'check' : 'link'} size={15} /> {copied ? t('Copied!') : t('Share')}
    </button>
  )
}
