import Avatar from '../Avatar'
import Icon from '../Icon'
import { docNumber, mrzLines } from '../../utils/visas'
import { levelTitle, feverTemp } from '../../utils/profileData'
import { t, locale } from '../../i18n'

/** The passport's data page: photo, name, fever, numbers and the machine-readable lines. */
export default function IdentityPage({ auth, p, username, joined, visas, onPickAvatar, onAccount }) {
  const signedIn = !!auth.user
  const number = signedIn ? docNumber(auth.user.id) : 'GF0000000'
  const issued = joined ? new Date(joined).toLocaleDateString(locale, { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase().replace(/\./g, '') : '—'
  const [mrz1, mrz2] = mrzLines({ name: username, number, level: p.level.level, joined })
  const days = (n) => t(n === 1 ? '{n} day' : '{n} days', { n })

  return (
    <section className="idp" aria-label={t('Passport')}>
      <header className="idp-head">
        <span className="idp-emblem" aria-hidden="true"><Icon name="globe" size={18} /></span>
        <span className="idp-title">GEOFEVERR</span>
        <span className="idp-doc">{t('PASSPORT')} · PASSPORT</span>
        {signedIn
          ? <button className="idp-account" onClick={onAccount}><Icon name="user" size={15} /> {t('Account')}</button>
          : auth.backendEnabled && <button className="idp-account idp-cta" onClick={auth.openAuth}>{t('Sign in to save your progress')}</button>}
      </header>

      <div className="idp-body">
        <div className="idp-photo">
          {signedIn
            ? <button className="pp-avatar-btn idp-photo-btn" onClick={onPickAvatar} title={t('Change avatar')} aria-label={t('Change avatar')}>
                <Avatar className="idp-avatar" value={auth.profile?.avatar_url} name={auth.profile?.username} own />
                <span className="pp-avatar-edit" aria-hidden="true"><Icon name="pencil" size={13} /></span>
              </button>
            : <div className="idp-avatar idp-avatar-letter">{username.charAt(0).toUpperCase()}</div>}
          <span className="idp-temp">{feverTemp(p.level.level)}</span>
        </div>

        <dl className="idp-fields">
          <div className="idp-f idp-name"><dt>{t('Name')}</dt><dd>{username}</dd></div>
          <div className="idp-f"><dt>{t('Rank')}</dt><dd>{levelTitle(p.level.level)}</dd></div>
          <div className="idp-f"><dt>{t('Passport no.')}</dt><dd className="mono">{number}</dd></div>
          <div className="idp-f idp-date"><dt>{t('Date of issue')}</dt><dd>{issued}</dd></div>
          <div className="idp-f"><dt>{t('Games played')}</dt><dd>{p.totals.games.toLocaleString(locale)}</dd></div>
          <div className="idp-f"><dt>{t('Visas')}</dt><dd>{visas.held} <small>/ {visas.total}</small></dd></div>
          <div className="idp-f"><dt>{t('Fever streak')}</dt><dd>{days(p.streak.current)}</dd></div>
          <div className="idp-f"><dt>{t('Longest streak')}</dt><dd>{days(p.streak.best)}</dd></div>
          <div className="idp-f idp-xp">
            <dt>{t('Temperature')}</dt>
            <dd>
              <span className="idp-xp-bar"><span style={{ width: `${p.level.pct}%` }} /></span>
              <span className="idp-xp-label">{t('{temp} · {n} XP to {next}', { temp: feverTemp(p.level.level), n: (p.level.next - p.xp).toLocaleString(locale), next: feverTemp(p.level.level + 1) })}</span>
            </dd>
          </div>
        </dl>
      </div>

      <div className="idp-sign"><span>{t('Holder\'s signature')}</span><em>{username}</em></div>
      <div className="idp-mrz" aria-hidden="true"><span>{mrz1}</span><span>{mrz2}</span></div>
    </section>
  )
}
