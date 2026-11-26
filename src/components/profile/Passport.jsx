import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../../auth/AuthContext'
import { STAMPS, fetchStamps, stampNeeds, stampValue, fmtMinutes } from '../../utils/stamps'
import { subscribeStamps } from '../../utils/stampWatch'
import Stamp from '../Stamp'
import Icon from '../Icon'
import { t, locale } from '../../i18n'

const ROTATIONS = [-6, 4, -3, 7, -8, 2, 5, -4, 3]
const INK_NAMES = () => [t('Black ink'), t('Blue ink'), t('Red ink, gold foil')]

/** "Your passport": every stamp, earned ones inked, the rest as faint outlines. */
export default function Passport() {
  const auth = useAuth()
  const uid = auth.user?.id ?? null
  const [rows, setRows] = useState(null)
  const [error, setError] = useState(false)
  const [open, setOpen] = useState(null)
  const detail = useRef(null)
  useEffect(() => { if (open) detail.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' }) }, [open])

  useEffect(() => {
    if (!uid) { setRows([]); return }
    let live = true
    const load = () => fetchStamps(uid).then(r => { if (live) { setRows(r); setError(false) } }).catch(() => { if (live) setError(true) })
    load()
    const off = subscribeStamps(load)   // a new stamp just came in
    return () => { live = false; off() }
  }, [uid])

  const byId = Object.fromEntries((rows ?? []).map(r => [r.stamp, r]))
  const earned = STAMPS.filter(s => byId[s.id]).length
  const sel = STAMPS.find(s => s.id === open)

  return (
    <section className="passport-wrap">
      <div className="passport">
        <div className="passport-head">
          <span>GEOFEVERR · {t('PASSPORT')}</span>
          <span>{t('{n} of {m} stamps', { n: earned, m: STAMPS.length })}</span>
        </div>

        {!uid && auth.backendEnabled && (
          <div className="passport-cta">
            <p>{t('Stamps are checked and kept on our server, so they need an account.')}</p>
            <button className="tq-btn tq-btn-primary" onClick={auth.openAuth}>{t('Sign in to collect stamps')}</button>
          </div>
        )}
        {error && <p className="passport-error">{t('Stamps could not be loaded.')}</p>}

        <div className="passport-grid">
          {STAMPS.map((s, i) => {
            const row = byId[s.id]
            const date = row ? new Date(row.earned_at).toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase().replace(/\./g, '') : ''
            return (
              <button key={s.id} className={`passport-slot${open === s.id ? ' open' : ''}${row ? '' : ' locked'}`} onClick={() => setOpen(o => o === s.id ? null : s.id)} aria-expanded={open === s.id}>
                <Stamp shape={s.shape} icon={s.icon} kicker={s.kicker()} big={row ? stampValue(s, row) : ''} date={date}
                  tier={row?.tier ?? 1} locked={!row} rotate={row ? ROTATIONS[i % ROTATIONS.length] : 0} size={150} title={s.label()} />
                <span className="passport-name">{s.label()}</span>
                <span className="passport-sub">
                  {row ? INK_NAMES()[row.tier - 1] + (s.kind === 'time' ? ` · ${fmtMinutes(row.value)}` : '') : t('Not stamped yet')}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {sel && (
        <div className="passport-detail" ref={detail}>
          <h3>{sel.label()}</h3>
          <ul>
            {stampNeeds(sel).map((need, k) => {
              const have = (byId[sel.id]?.tier ?? 0) > k
              return (
                <li key={k} className={have ? 'have' : ''}>
                  <span className={`ink-dot ink-${k + 1}`} aria-hidden="true" />
                  <strong>{INK_NAMES()[k]}</strong> — {need}
                  {have && <Icon name="check" size={14} />}
                </li>
              )
            })}
          </ul>
          {sel.kind === 'time' && <p className="passport-note">{t('Free play counts too: the clock is what decides the ink.')}</p>}
        </div>
      )}
    </section>
  )
}
