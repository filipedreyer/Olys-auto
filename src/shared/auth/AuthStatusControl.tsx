import { NavLink } from 'react-router-dom'
import { useAuth } from './AuthProvider'

export function AuthStatusControl() {
  const { logout, mode, status, user } = useAuth()

  if (status === 'loading') {
    return <span className="auth-status">Carregando</span>
  }

  if (status === 'degraded') {
    return <span className="auth-status">Local</span>
  }

  if (status === 'authenticated' && user) {
    return (
      <button
        aria-label="Sair da sessao"
        className="auth-status"
        type="button"
        onClick={() => void logout()}
      >
        Sair
      </button>
    )
  }

  return (
    <NavLink className="auth-status" to="/login">
      {mode === 'supabase' ? 'Entrar' : 'Local'}
    </NavLink>
  )
}
