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
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

const degradedAuthValue = (
  login: AuthContextValue['login'],
  logout: () => Promise<void>,
): AuthContextValue => ({
  status: 'degraded',
  user: {
    id: seedUserId,
  },
  mode: 'local',
  login,
  logout,
})

const loadingAuthValue = (
  login: AuthContextValue['login'],
  logout: () => Promise<void>,
): AuthContextValue => ({
  status: 'loading',
  user: null,
  mode: 'supabase',
  login,
  logout,
})

export function AuthProvider({ children }: PropsWithChildren) {
  const login = useMemo(
    () =>
      async ({ email, password }: { email: string; password: string }) => {
        const supabase = getSupabaseClient()

        if (!supabase) {
          setValue(degradedAuthValue(login, logout))
          return {
            ok: false,
            error: 'Supabase environment is not configured',
          }
        }

        setValue(loadingAuthValue(login, logout))

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
  const logout = useMemo(
    () => async () => {
      const supabase = getSupabaseClient()

      if (!supabase) {
        setValue(degradedAuthValue(login, logout))
        return
      }

      await supabase.auth.signOut()
      setValue({
        status: 'unauthenticated',
        user: null,
        mode: 'supabase',
        login,
        logout,
      })
    },
    [login],
  )

  const [value, setValue] = useState<AuthContextValue>(() => {
    const supabase = getSupabaseClient()

    return supabase ? loadingAuthValue(login, logout) : degradedAuthValue(login, logout)
  })

  useEffect(() => {
    const supabase = getSupabaseClient()

    if (!supabase) {
      setValue(degradedAuthValue(login, logout))
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
          logout,
        })
      })
      .catch(() => {
        if (active) {
          setValue(degradedAuthValue(login, logout))
        }
      })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const sessionUser = session?.user

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
        logout,
      })
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [login, logout])

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
