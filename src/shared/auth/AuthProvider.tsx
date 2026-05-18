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
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

const degradedAuthValue = (logout: () => Promise<void>): AuthContextValue => ({
  status: 'degraded',
  user: {
    id: seedUserId,
  },
  mode: 'local',
  logout,
})

const loadingAuthValue = (logout: () => Promise<void>): AuthContextValue => ({
  status: 'loading',
  user: null,
  mode: 'supabase',
  logout,
})

export function AuthProvider({ children }: PropsWithChildren) {
  const logout = useMemo(
    () => async () => {
      const supabase = getSupabaseClient()

      if (!supabase) {
        setValue(degradedAuthValue(logout))
        return
      }

      await supabase.auth.signOut()
      setValue({
        status: 'unauthenticated',
        user: null,
        mode: 'supabase',
        logout,
      })
    },
    [],
  )

  const [value, setValue] = useState<AuthContextValue>(() => {
    const supabase = getSupabaseClient()

    return supabase ? loadingAuthValue(logout) : degradedAuthValue(logout)
  })

  useEffect(() => {
    const supabase = getSupabaseClient()

    if (!supabase) {
      setValue(degradedAuthValue(logout))
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
          logout,
        })
      })
      .catch(() => {
        if (active) {
          setValue(degradedAuthValue(logout))
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
        logout,
      })
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [logout])

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
