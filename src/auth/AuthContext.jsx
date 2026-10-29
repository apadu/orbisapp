import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase, isBackendEnabled } from '../lib/supabase'
import { setResultsUser } from '../utils/results'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null)   // supabase auth user
  const [profile, setProfile] = useState(null)   // row from public.profiles
  const [ready,   setReady]   = useState(!isBackendEnabled)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [recovery, setRecovery] = useState(false) // arrived via password-reset link

  const loadProfile = useCallback(async (u) => {
    if (!u || !supabase) { setProfile(null); return }
    // The profile row is created by a DB trigger — retry briefly right after sign-up
    for (let i = 0; i < 4; i++) {
      const { data } = await supabase.from('profiles').select('*').eq('id', u.id).maybeSingle()
      if (data) { setProfile(data); return }
      await new Promise(r => setTimeout(r, 600))
    }
  }, [])

  useEffect(() => {
    if (!supabase) return
    let active = true

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return
      const u = data.session?.user ?? null
      setUser(u)
      setResultsUser(u?.id ?? null)
      loadProfile(u)
      setReady(true)
    })

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      const u = session?.user ?? null
      setUser(u)
      setResultsUser(u?.id ?? null)
      loadProfile(u)
      if (event === 'PASSWORD_RECOVERY') { setRecovery(true); setAuthModalOpen(true) }
      else if (u) setAuthModalOpen(false)
    })

    return () => { active = false; sub.subscription.unsubscribe() }
  }, [loadProfile])

  // ── actions ──────────────────────────────────────────────────────────────

  // Sign in with an email OR a username. Usernames are turned into the account's email by a
  // database function that only answers when the password is right (so emails can't be looked up).
  const signInWithEmail = async (login, password) => {
    const id = login.trim()
    if (id.includes('@')) return supabase.auth.signInWithPassword({ email: id, password })
    const { data: email, error } = await supabase.rpc('email_for_login', { p_login: id, p_password: password })
    if (error) {
      if (/too_many_attempts/.test(error.message)) return { error: { message: 'too_many_attempts' } }
      if (/email_for_login|function|schema cache/i.test(error.message)) return { error: { message: 'username_login_unavailable' } }
      return { error }
    }
    if (!email) return { error: { message: 'Invalid login credentials' } }
    return supabase.auth.signInWithPassword({ email, password })
  }

  /** Is this username free? (profiles are publicly readable) */
  const isUsernameTaken = async (username) => {
    const { data } = await supabase.from('profiles').select('id').ilike('username', username.trim().replace(/[\\%_]/g, '\\$&')).limit(1)
    return !!data?.length
  }

  const signUpWithEmail = (email, password, username) =>
    supabase.auth.signUp({
      email, password,
      options: { data: { username }, emailRedirectTo: window.location.origin },
    })

  const resetPassword = (email) =>
    supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin })

  const setNewPassword = async (password) => {
    const res = await supabase.auth.updateUser({ password })
    if (!res.error) { setRecovery(false); setAuthModalOpen(false) }
    return res
  }

  const signOut = async () => {
    await supabase?.auth.signOut()
    setUser(null)
    setProfile(null)
    setResultsUser(null)
  }

  // Permanently delete the signed-in account (profile + all results go with it — ON DELETE CASCADE)
  const deleteAccount = async () => {
    if (!user) return { error: { message: 'Not signed in' } }
    const uid = user.id
    const { error } = await supabase.rpc('delete_my_account')
    if (error) return { error }
    try { localStorage.removeItem(`orbis_results_${uid}`) } catch {}
    await signOut()
    return {}
  }


  const value = {
    backendEnabled: isBackendEnabled,
    ready, user, profile,
    authModalOpen, openAuth: () => setAuthModalOpen(true), closeAuth: () => setAuthModalOpen(false),
    recovery, setNewPassword,
    signInWithEmail, signUpWithEmail, resetPassword, signOut, deleteAccount, isUsernameTaken,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
