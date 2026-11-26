import { useMemo } from 'react'
import { computeVisas } from '../../utils/visas'
import Visa from './Visa'
import { t } from '../../i18n'

/** The visa pages: the visas you hold, best first. */
export default function Visas({ results, holder, onOpen }) {
  const visas = useMemo(() => computeVisas(results), [results])
  const held = visas.filter(v => v.tier > 0).sort((a, b) => b.tier - a.tier || (b.date > a.date ? 1 : -1))
  const count = (n) => visas.filter(v => v.tier >= n).length

  return (
    <section className="passport-wrap">
      <div className="passport visas-page">
        <div className="passport-head">
          <span>GEOFEVERR · {t('VISAS')}</span>
          <span>{t('{n} of {m} countries', { n: held.length, m: visas.length })}</span>
        </div>
        <p className="visas-legend">
          <span><i className="vl vl-1" /> {t('Tourist')} <b>{count(1)}</b></span>
          <span><i className="vl vl-2" /> {t('Residence')} <b>{count(2)}</b></span>
          <span><i className="vl vl-3" /> {t('Citizenship')} <b>{count(3)}</b></span>
        </p>
        {held.length === 0 && <p className="visas-empty">{t('No visas yet. Finish any game on a country page and your first visa lands here.')}</p>}
        <div className="visas-grid">
          {held.map(v => <Visa key={v.id} visa={v} holder={holder} onOpen={onOpen} />)}
        </div>
      </div>

      <p className="passport-note visas-rules">
        {t('Tourist visa: finish one of the country\'s games (at least half right). Residence: finish them all. Citizenship: all of them at 100%.')}
      </p>
    </section>
  )
}
