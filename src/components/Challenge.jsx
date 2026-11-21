import { useEffect, useState } from 'react'
import { challengeFor, challengeLink, dismissChallenge, onChallengeChange, verdict, savedName, saveName } from '../utils/challenge'
import { shareText } from '../utils/share'
import { useAuth } from '../auth/AuthContext'
import { t } from '../i18n'
import Icon from './Icon'

const fmtTime = (ms) => { const s = Math.round(ms / 1000); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}` }

/** The challenge for this quiz (re-renders when it's dismissed). */
export function useChallenge(mode) {
  const [, tick] = useState(0)
  useEffect(() => onChallengeChange(() => tick(x => x + 1)), [])
  return challengeFor(mode)
}

/** Shown above the quiz when it was opened from a friend's link. */
export function ChallengeBanner({ ch }) {
  if (!ch) return null
  const who = ch.n ?? t('A friend')
  return (
    <div className="ch-banner" role="status">
      <span className="ch-banner-icon"><Icon name="trophy" size={18} /></span>
      <span className="ch-banner-text">
        <strong>{t('{name} challenges you!', { name: who })}</strong>
        {' '}{ch.ms ? t('Their score: {s}/{t} in {time}. Can you beat it?', { s: ch.s, t: ch.t, time: fmtTime(ch.ms) }) : t('Their score: {s}/{t}. Can you beat it?', { s: ch.s, t: ch.t })}
      </span>
      <button className="ch-banner-x" onClick={dismissChallenge} aria-label={t('Close')}><Icon name="close" size={14} /></button>
    </div>
  )
}

/** At the end: you vs the friend, side by side. */
export function ChallengeResult({ ch, score, total, ms }) {
  if (!ch) return null
  if (total !== ch.t) return <p className="ch-mismatch">{t('This game had different settings from your friend\'s, so the scores can\'t be compared.')}</p>
  const v = verdict({ score, ms }, ch)
  const who = ch.n ?? t('A friend')
  return (
    <div className={`ch-result ${v}`}>
      <div className="ch-side me">
        <span className="ch-who">{t('You')}</span>
        <span className="ch-score">{score}/{total}</span>
        {ms ? <span className="ch-time">{fmtTime(ms)}</span> : null}
      </div>
      <div className="ch-verdict">
        {v === 'win' ? t('You win! 🏆') : v === 'lose' ? t('{name} wins this time', { name: who }) : t('It\'s a tie!')}
      </div>
      <div className="ch-side them">
        <span className="ch-who">{who}</span>
        <span className="ch-score">{ch.s}/{ch.t}</span>
        {ch.ms ? <span className="ch-time">{fmtTime(ch.ms)}</span> : null}
      </div>
    </div>
  )
}

/**
 * "Challenge a friend": makes the link with this result and shares it (phone) or copies it.
 * Guests are asked for a name the first time.
 */
export function ChallengeButton({ mode, title, score, total, ms, region, size, seed, rematch = false }) {
  const { profile } = useAuth()
  const [asking, setAsking] = useState(false)
  const [name, setName] = useState(() => profile?.username ?? savedName())
  const [done, setDone] = useState(false)
  const send = async (n) => {
    const link = challengeLink(mode, { name: n, score, total, ms, region, size, seed })
    const text = `${t('I scored {s}/{t} in “{quiz}” on GeoFeverr. Can you beat me?', { s: score, t: total, quiz: title })}\n${link}`
    const r = await shareText(text)
    if (r === 'copied') { setDone(true); setTimeout(() => setDone(false), 2500) }
  }
  const click = () => {
    if (profile?.username) return send(profile.username)
    if (!name) return setAsking(true)
    send(name)
  }
  return (
    <span className="ch-btn-wrap">
      <button className="tq-btn ch-btn" onClick={click}>
        <Icon name={done ? 'check' : 'trophy'} size={15} /> {done ? t('Link copied!') : rematch ? t('Challenge back') : t('Challenge a friend')}
      </button>
      {asking && (
        <form className="ch-name" onSubmit={e => { e.preventDefault(); const n = name.trim().slice(0, 24); if (!n) return; saveName(n); setAsking(false); send(n) }}>
          <label>{t('Your name, so your friend knows who it\'s from')}</label>
          <div>
            <input autoFocus value={name} maxLength={24} onChange={e => setName(e.target.value)} placeholder={t('Your name')} />
            <button className="tq-btn tq-btn-primary" type="submit">{t('Send')}</button>
          </div>
        </form>
      )}
    </span>
  )
}
