import { useState, useEffect } from 'react'
import { useAuth } from '../auth/AuthContext'
import { loadResults } from '../utils/results'
import { t } from '../i18n'

const USERNAME_RE = /^[A-Za-z0-9_]{3,24}$/

// Supabase error codes → readable messages
function friendly(msg = '') {
  if (msg === 'too_many_attempts') return t('Too many failed attempts — try again in 15 minutes.')
  if (msg === 'username_login_unavailable') return t('Signing in with a username isn\'t available yet — use your email.')
  if (/invalid login credentials/i.test(msg)) return t('Wrong email/username or password.')
  if (/email not confirmed/i.test(msg)) return t('Please confirm your email first — check your inbox.')
  if (/already registered|already been registered/i.test(msg)) return t('An account with this email already exists.')
  return msg
}

export default function AuthModal() {
  const { authModalOpen, closeAuth, signInWithEmail, signUpWithEmail, resetPassword, backendEnabled, recovery, setNewPassword, isUsernameTaken } = useAuth()
  const [tab,      setTab]      = useState('signin') // 'signin' | 'signup' | 'reset'
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [confirm,  setConfirm]  = useState('')
  const [username, setUsername] = useState('')
  const [busy,     setBusy]     = useState(false)
  const [error,    setError]    = useState(null)
  const [info,     setInfo]     = useState(null)

  useEffect(() => {
    if (!authModalOpen) return
    // Every time the window opens it starts fresh, on "Sign in"
    if (!recovery) { setTab('signin'); setPassword(''); setConfirm(''); setUsername('') }
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
      if (err) setError(friendly(err.message))
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
      if (password !== confirm) { setError(t('The passwords don\'t match')); return }
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
            <input
              className="auth-input" type="password" placeholder={t('Confirm new password')} autoComplete="new-password" required
              value={confirm} onChange={e => setConfirm(e.target.value)}
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
      const name = username.trim()
      if (!USERNAME_RE.test(name)) { setError(t('Username: 3–24 letters, digits or _')); return }
      if (password.length < 8) { setError(t('Password must be at least 8 characters')); return }
      if (password !== confirm) { setError(t('The passwords don\'t match')); return }
      setBusy(true)
      const taken = await isUsernameTaken(name).catch(() => false)
      setBusy(false)
      if (taken) { setError(t('That username is taken — try another one')); return }
      const data = await run(() => signUpWithEmail(email, password, name))
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
            <form className="auth-form" onSubmit={submit}>
              {tab === 'signup' && (
                <input
                  className="auth-input" type="text" placeholder={t('Username')} autoComplete="username" required
                  value={username} onChange={e => setUsername(e.target.value)} maxLength={24}
                />
              )}
              <input
                className="auth-input"
                type={tab === 'signin' ? 'text' : 'email'}
                placeholder={tab === 'signin' ? t('Email or username') : t('Email')}
                autoComplete={tab === 'signin' ? 'username' : 'email'}
                autoCapitalize="none" spellCheck={false} required
                value={email} onChange={e => setEmail(e.target.value)}
              />
              {tab !== 'reset' && (
                <input
                  className="auth-input" type="password" placeholder={t('Password')} required
                  autoComplete={tab === 'signup' ? 'new-password' : 'current-password'}
                  value={password} onChange={e => setPassword(e.target.value)}
                />
              )}
              {tab === 'signup' && (
                <input
                  className={`auth-input${confirm && confirm !== password ? ' auth-input-bad' : ''}`}
                  type="password" placeholder={t('Confirm password')} autoComplete="new-password" required
                  value={confirm} onChange={e => setConfirm(e.target.value)}
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
                  <button onClick={() => { setTab('reset'); setError(null); setInfo(null) }}>{t('Forgot password?')}</button>
                  <span>·</span>
                  <button onClick={() => { setTab('signup'); setError(null); setInfo(null); setConfirm('') }}>{t('Create an account')}</button>
                </>
              )}
              {tab !== 'signin' && (
                <button onClick={() => { setTab('signin'); setError(null); setInfo(null) }}>{t('Already have an account? Sign in')}</button>
              )}
            </div>
          </>
        )}

        <button className="auth-guest" onClick={closeAuth}>{t('Keep playing as guest')}</button>
      </div>
    </div>
  )
}
