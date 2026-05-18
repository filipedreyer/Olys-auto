import { FormEvent, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from './AuthProvider'

export function LoginScreen() {
  const { login, mode, status, user } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | undefined>()

  if (status === 'authenticated' && user) {
    return <Navigate to="/fazer/hoje" replace />
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(undefined)

    const result = await login({ email, password })

    if (!result.ok) {
      setError(result.error ?? 'Falha ao autenticar')
    }
  }

  return (
    <section className="auth-screen">
      <header className="screen-header">
        <div>
          <small>Auth</small>
          <h1>Acesso operacional</h1>
        </div>

        <span className="quiet-status">
          {mode === 'local' ? 'Degraded/local' : status}
        </span>
      </header>

      {status === 'degraded' ? (
        <p className="surface-note">
          Supabase nao configurado. Olys esta rodando em modo local seguro.
        </p>
      ) : (
        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Email
            <input
              autoComplete="email"
              name="email"
              onChange={(event) => setEmail(event.target.value)}
              required
              type="email"
              value={email}
            />
          </label>

          <label>
            Senha
            <input
              autoComplete="current-password"
              name="password"
              onChange={(event) => setPassword(event.target.value)}
              required
              type="password"
              value={password}
            />
          </label>

          {error ? <p className="auth-form__error">{error}</p> : null}

          <button className="primary-action" disabled={status === 'loading'}>
            {status === 'loading' ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      )}
    </section>
  )
}
