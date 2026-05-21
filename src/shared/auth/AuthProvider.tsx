import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { getSupabaseClient } from '../../lib/supabase/client'
import { seedUserId } from '../../domain/entities/seedData'

export type AuthStatus =
  | 'unauthenticated'
  | 'loading'
  | 'authenticated'
  | 'degraded'
  | 'expired'
  | 'configurationError'
  | 'recoverableError'

type AuthUser = {
  id: string
  email?: string
}

type AuthContextValue = {
  status: AuthStatus
  user: AuthUser | null
  mode: 'supabase' | 'local'
  login: (input: { email: string; password: string }) => Promise<{
    ok: boolean
    error?: string
  }>
  signup: (input: { email: string; password: string }) => Promise<{
    ok: boolean
    error?: string
  }>
  recoverPassword: (input: { email: string }) => Promise<{
    ok: boolean
    error?: string
  }>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

const degradedAuthValue = (
  login: AuthContextValue['login'],
  signup: AuthContextValue['signup'],
  recoverPassword: AuthContextValue['recoverPassword'],
  logout: () => Promise<void>,
): AuthContextValue => ({
  status: 'degraded',
  user: {
    id: seedUserId,
  },
  mode: 'local',
  login,
  signup,
  recoverPassword,
  logout,
})

const loadingAuthValue = (
  login: AuthContextValue['login'],
  signup: AuthContextValue['signup'],
  recoverPassword: AuthContextValue['recoverPassword'],
  logout: () => Promise<void>,
): AuthContextValue => ({
  status: 'loading',
  user: null,
  mode: 'supabase',
  login,
  signup,
  recoverPassword,
  logout,
})

export function AuthProvider({ children }: PropsWithChildren) {
  const login = useMemo(
    () =>
      async ({ email, password }: { email: string; password: string }) => {
        const supabase = getSupabaseClient()

        if (!supabase) {
          setValue(degradedAuthValue(login, signup, recoverPassword, logout))
          return {
            ok: false,
            error: 'Supabase environment is not configured',
          }
        }

        setValue(loadingAuthValue(login, signup, recoverPassword, logout))

        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) {
          setValue({
            status: 'unauthenticated',
            user: null,
            mode: 'supabase',
            login,
            signup,
            recoverPassword,
            logout,
          })
          return {
            ok: false,
            error: error.message,
          }
        }

        return {
          ok: true,
        }
      },
    [],
  )
  const signup = useMemo(
    () =>
      async ({ email, password }: { email: string; password: string }) => {
        const supabase = getSupabaseClient()

        if (!supabase) {
          return {
            ok: false,
            error: 'Cadastro exige Supabase configurado.',
          }
        }

        setValue(loadingAuthValue(login, signup, recoverPassword, logout))

        const { error } = await supabase.auth.signUp({
          email,
          password,
        })

        if (error) {
          setValue({
            status: 'unauthenticated',
            user: null,
            mode: 'supabase',
            login,
            signup,
            recoverPassword,
            logout,
          })
          return {
            ok: false,
            error: error.message,
          }
        }

        return { ok: true }
      },
    [login],
  )
  const recoverPassword = useMemo(
    () =>
      async ({ email }: { email: string }) => {
        const supabase = getSupabaseClient()

        if (!supabase) {
          return {
            ok: false,
            error: 'Recuperação exige Supabase configurado.',
          }
        }

        const { error } = await supabase.auth.resetPasswordForEmail(email)

        if (error) {
          return {
            ok: false,
            error: error.message,
          }
        }

        return { ok: true }
      },
    [],
  )
  const logout = useMemo(
    () => async () => {
      const supabase = getSupabaseClient()

      if (!supabase) {
        setValue(degradedAuthValue(login, signup, recoverPassword, logout))
        return
      }

      await supabase.auth.signOut()
      setValue({
        status: 'unauthenticated',
        user: null,
        mode: 'supabase',
        login,
        signup,
        recoverPassword,
        logout,
      })
    },
    [login, recoverPassword, signup],
  )

  const [value, setValue] = useState<AuthContextValue>(() => {
    const supabase = getSupabaseClient()

    return supabase
      ? loadingAuthValue(login, signup, recoverPassword, logout)
      : degradedAuthValue(login, signup, recoverPassword, logout)
  })

  useEffect(() => {
    const supabase = getSupabaseClient()

    if (!supabase) {
      setValue(degradedAuthValue(login, signup, recoverPassword, logout))
      return
    }

    let active = true

    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!active) {
          return
        }

        const sessionUser = data.session?.user

        setValue({
          status: sessionUser ? 'authenticated' : 'unauthenticated',
          user: sessionUser
            ? {
                id: sessionUser.id,
                email: sessionUser.email,
            }
            : null,
          mode: 'supabase',
          login,
          signup,
          recoverPassword,
          logout,
        })
      })
      .catch(() => {
        if (active) {
          setValue({
            status: 'recoverableError',
            user: null,
            mode: 'supabase',
            login,
            signup,
            recoverPassword,
            logout,
          })
        }
      })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      const sessionUser = session?.user

      setValue({
        status: event === 'SIGNED_OUT' && !sessionUser ? 'expired' : sessionUser ? 'authenticated' : 'unauthenticated',
        user: sessionUser
          ? {
              id: sessionUser.id,
              email: sessionUser.email,
          }
          : null,
        mode: 'supabase',
        login,
        signup,
        recoverPassword,
        logout,
      })
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [login, logout, recoverPassword, signup])

  const contextValue = useMemo(() => value, [value])

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }

  return context
}
