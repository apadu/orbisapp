import { useState, useEffect } from 'react'
import { useAuth } from '../auth/AuthContext'
import { loadResults } from '../utils/results'
import { t } from '../i18n'

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/>
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z"/>
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/>
    </svg>
  )
}

export default function AuthModal() {
  const { authModalOpen, closeAuth, signInWithGoogle, signInWithEmail, signUpWithEmail, resetPassword, backendEnabled, recovery, setNewPassword } = useAuth()
  const [tab,      setTab]      = useState('signin') // 'signin' | 'signup' | 'reset'
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [busy,     setBusy]     = useState(false)
  const [error,    setError]    = useState(null)
  const [info,     setInfo]     = useState(null)

  useEffect(() => {
    if (!authModalOpen) return
    setError(null); setInfo(null)
    const onKey = e => { if (e.key === 'Escape') closeAuth() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [authModalOpen, closeAuth])

  if (!authModalOpen) return null

  const run = async (fn) => {
    setBusy(true); setError(null); setInfo(null)
    try {
      const { error: err, data } = await fn()
      if (err) setError(err.message)
      return data
    } catch (e) {
      setError(e.message ?? t('Something went wrong'))
    } finally {
      setBusy(false)
    }
  }

  if (recovery) {
    const save = async (e) => {
      e.preventDefault()
      if (password.length < 8) { setError(t('Password must be at least 8 characters')); return }
      await run(() => setNewPassword(password))
    }
    return (
      <div className="auth-backdrop">
        <div className="auth-modal" role="dialog" aria-modal="true">
          <div className="auth-brand">🔑</div>
          <h2 className="auth-title">{t('Choose a new password')}</h2>
          <form className="auth-form" onSubmit={save}>
            <input
              className="auth-input" type="password" placeholder={t('New password')} autoComplete="new-password" required
              value={password} onChange={e => setPassword(e.target.value)}
            />
            {error && <div className="auth-error">{error}</div>}
            <button className="auth-submit" type="submit" disabled={busy}>{busy ? '…' : t('Save password')}</button>
          </form>
        </div>
      </div>
    )
  }

  const guestGames = loadResults().length

  const submit = async (e) => {
    e.preventDefault()
    if (tab === 'signin') {
      await run(() => signInWithEmail(email, password))
    } else if (tab === 'signup') {
      if (password.length < 8) { setError(t('Password must be at least 8 characters')); return }
      const data = await run(() => signUpWithEmail(email, password, username.trim()))
      if (data && !data.session) setInfo(t('Check your inbox to confirm your email, then sign in.'))
    } else {
      const data = await run(() => resetPassword(email))
      if (data !== undefined) setInfo(t('If that email has an account, a reset link is on its way.'))
    }
  }

  return (
    <div className="auth-backdrop" onClick={closeAuth}>
      <div className="auth-modal" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true">
        <button className="auth-close" onClick={closeAuth} aria-label={t('Close')}>✕</button>

        <div className="auth-brand">🌐</div>
        <h2 className="auth-title">
          {tab === 'signup' ? t('Create your Orbis account') : tab === 'reset' ? t('Reset password') : t('Welcome back')}
        </h2>
        <p className="auth-sub">
          {tab === 'reset'
            ? t('We\'ll email you a link to choose a new password.')
            : guestGames > 0
            ? t('Your {guestGames} guest game{v} will be saved to your account.', { guestGames: guestGames, v: guestGames === 1 ? '' : 's' })
            : t('Save your stats, unlock achievements and climb the leaderboards.')}
        </p>

        {!backendEnabled ? (
          <div className="auth-error">{t('Accounts aren\'t configured yet (missing Supabase keys).')}</div>
        ) : (
          <>
            {tab !== 'reset' && (
              <>
                <button className="auth-google" onClick={() => run(signInWithGoogle)} disabled={busy}>
                  <GoogleIcon /> {t('Continue with Google')}
                </button>
                <div className="auth-divider"><span>{t('or')}</span></div>
              </>
            )}

            <form className="auth-form" onSubmit={submit}>
              {tab === 'signup' && (
                <input
                  className="auth-input" type="text" placeholder={t('Username')} autoComplete="username"
                  value={username} onChange={e => setUsername(e.target.value)} maxLength={24}
                />
              )}
              <input
                className="auth-input" type="email" placeholder={t('Email')} autoComplete="email" required
                value={email} onChange={e => setEmail(e.target.value)}
              />
              {tab !== 'reset' && (
                <input
                  className="auth-input" type="password" placeholder={t('Password')} required
                  autoComplete={tab === 'signup' ? 'new-password' : 'current-password'}
                  value={password} onChange={e => setPassword(e.target.value)}
                />
              )}

              {error && <div className="auth-error">{error}</div>}
              {info  && <div className="auth-info">{info}</div>}

              <button className="auth-submit" type="submit" disabled={busy}>
                {busy ? '…' : tab === 'signup' ? t('Create account') : tab === 'reset' ? t('Send reset link') : t('Sign in')}
              </button>
            </form>

            <div className="auth-links">
              {tab === 'signin' && (
                <>
                  <button onClick={() => setTab('reset')}>{t('Forgot password?')}</button>
                  <span>·</span>
                  <button onClick={() => setTab('signup')}>{t('Create an account')}</button>
                </>
              )}
              {tab !== 'signin' && (
                <button onClick={() => setTab('signin')}>{t('Already have an account? Sign in')}</button>
              )}
            </div>
          </>
        )}

        <button className="auth-guest" onClick={closeAuth}>{t('Keep playing as guest')}</button>
      </div>
    </div>
  )
}
