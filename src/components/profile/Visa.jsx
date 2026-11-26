import { localFlagSrc } from '../../utils/flags'
import { docNumber } from '../../utils/visas'
import { t, locale, isRo } from '../../i18n'

const TYPES = () => [null, t('TOURIST'), t('RESIDENCE'), t('CITIZENSHIP')]

/** One visa sticker. Locked (tier 0): a faint outline with a greyed flag. */
export default function Visa({ visa, holder, onOpen }) {
  const { id, code, page, tier, date, done, total } = visa
  const name = isRo ? page.name.ro : page.name.en
  const issued = date ? new Date(date).toLocaleDateString(locale, { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase().replace(/\./g, '') : ''
  // machine-readable line: country · holder · date of issue (YYMMDD).
  // The date is when the current type was reached, so it moves on when the visa is upgraded.
  const d = date ? new Date(date) : null
  const yymmdd = d ? `${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}` : '000000'
  const holderCode = (holder ?? 'GUEST').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase().replace(/[^A-Z0-9]/g, '<').slice(0, 14)
  const mrz = `V<${(code ?? 'xx').toUpperCase()}<<${holderCode}<<${yymmdd}${'<'.repeat(34)}`.slice(0, 34)

  return (
    <button className={`visa visa-t${tier}`} onClick={() => onOpen?.(id)} title={tier ? name : t('Finish one of {country}\'s games to get this visa', { country: name })}>
      <span className="visa-top">
        <span>{t('VISA')}</span>
        <span className="visa-type">{tier ? TYPES()[tier] : t('NOT ISSUED')}</span>
      </span>
      <span className="visa-mid">
        {code && <img className="visa-flag" src={localFlagSrc(code)} alt="" loading="lazy" />}
        <span className="visa-info">
          <strong>{name}</strong>
          {tier
            ? <><span>{t('Issued')}: {issued}</span><span>{t('No.')} {docNumber(id + holder, (code ?? '').toUpperCase())}</span></>
            : <span>{t('{n} of {m} games', { n: done, m: total })}</span>}
        </span>
      </span>
      <span className="visa-foot">
        <span className="visa-pips" aria-label={t('{n} of {m} games', { n: done, m: total })}>
          {Array.from({ length: total }, (_, i) => <i key={i} className={i < done ? 'on' : ''} />)}
        </span>
        {tier > 0 && <span className="visa-mrz">{mrz}</span>}
      </span>
      {tier === 3 && <span className="visa-holo" aria-hidden="true" />}
    </button>
  )
}
