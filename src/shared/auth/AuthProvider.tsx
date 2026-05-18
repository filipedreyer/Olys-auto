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
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: PropsWithChildren) {
  const [value, setValue] = useState<AuthContextValue>(() => {
    const supabase = getSupabaseClient()

    if (!supabase) {
      return {
        status: 'degraded',
        user: {
          id: seedUserId,
        },
        mode: 'local',
      }
    }

    return {
      status: 'loading',
      user: null,
      mode: 'supabase',
    }
  })

  useEffect(() => {
    const supabase = getSupabaseClient()

    if (!supabase) {
      setValue({
        status: 'degraded',
        user: {
          id: seedUserId,
        },
        mode: 'local',
      })
      return
    }

    let active = true

    supabase.auth.getSession().then(({ data }) => {
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
      })
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
      })
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [])

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
