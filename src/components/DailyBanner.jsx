import { useEffect, useMemo, useState } from 'react'
import { dailyNumber, dailyQuizFor, msToNextDaily } from '../quizzes/daily'
import { loadResults, subscribeResults } from '../utils/results'
import { t, continentName } from '../i18n'

/** "Daily Quiz #N" banner — shows today's quiz, or your result + countdown if played. */
export default function DailyBanner({ countryNames, onOpen }) {
  const [results, setResults] = useState(loadResults)
  useEffect(() => subscribeResults(() => setResults(loadResults())), [])
  const [left, setLeft] = useState(msToNextDaily())
  useEffect(() => { const t = setInterval(() => setLeft(msToNextDaily()), 30_000); return () => clearInterval(t) }, [])

  const today = dailyNumber()
  const info = useMemo(() => countryNames.length ? dailyQuizFor(today, countryNames) : null, [today, countryNames])
  if (!info) return null
  const played = results.find(r => r.mode === 'daily-quiz' && r.details?.day === today)
  const h = Math.floor(left / 3_600_000), m = Math.floor((left % 3_600_000) / 60_000)

  return (
    <button className={`daily-banner${played ? ' played' : ''}`} onClick={onOpen}>
      <span className="daily-banner-cal">
        <small>{t('DAILY')}</small>
        <strong>#{info.day}</strong>
      </span>
      <span className="daily-banner-body">
        <span className="daily-banner-kicker">{played ? t('Today\'s quiz — done') : t('Quiz of the day')}</span>
        <span className="daily-banner-title">{info.icon} {info.title}{info.region !== 'World' ? ` · ${continentName(info.region)}` : ''}</span>
        <span className="daily-banner-sub">
          {played
            ? t('You scored {correct}/{total} · next quiz in {h}h {m}m', { correct: played.correct, total: played.total, h: h, m: m })
            : t('{size} answers · one attempt · same quiz for everyone', { size: info.size })}
        </span>
      </span>
      <span className="daily-banner-cta">{played ? t('Results ▸') : t('Play ▸')}</span>
    </button>
  )
}
