import { localFlagSrc } from '../../utils/flags'
import { t, locale, isRo } from '../../i18n'

const TYPES = () => [null, t('TOURIST'), t('RESIDENCE'), t('CITIZENSHIP')]

/**
 * A regional visa: a wide sticker for a whole continent, with the flag of every country in it
 * (in colour once you hold that country's visa). Not issued yet: a slim progress card.
 */
export default function RegionalVisa({ region, holder }) {
  const { code, tier, date, done, total, members } = region
  const name = region.name()
  const d = date ? new Date(date) : null
  const issued = d ? d.toLocaleDateString(locale, { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase().replace(/\./g, '') : ''
  const yymmdd = d ? `${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}` : ''
  const holderCode = (holder ?? 'GUEST').normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase().replace(/[^A-Z0-9]/g, '<').slice(0, 14)
  const mrz = `VR<${code}<<${holderCode}<<${yymmdd}${'<'.repeat(44)}`.slice(0, 44)
  const countryName = (v) => (isRo ? v.page.name.ro : v.page.name.en)

  return (
    <div className={`rvisa rvisa-t${tier}`}>
      <span className="visa-top">
        <span>{t('REGIONAL VISA')}</span>
        <span className="visa-type">{tier ? TYPES()[tier] : t('{n} of {m}', { n: done, m: total })}</span>
      </span>
      <span className="rvisa-mid">
        <strong>{name}</strong>
        <span>{tier ? `${t('Issued')}: ${issued}` : t('A visa for every country here unlocks it')}</span>
      </span>
      <span className="rvisa-flags">
        {members.map(v => (
          <img key={v.id} src={localFlagSrc(v.code)} alt={countryName(v)} title={countryName(v)} className={v.tier > 0 ? 'on' : ''} loading="lazy" />
        ))}
      </span>
      {tier > 0 && <span className="visa-mrz rvisa-mrz">{mrz}</span>}
      {tier === 3 && <span className="visa-holo" aria-hidden="true" />}
    </div>
  )
}
