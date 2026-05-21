import { type FormEvent, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { OlysButton } from '../../../design-system'
import { useAuth } from '../../../shared/auth/AuthProvider'
import { AccessCard } from '../components/AccessCard'
import { AccessFormField } from '../components/AccessFormField'
import { AccessShell } from '../components/AccessShell'
import { AccessTrustBlock } from '../components/AccessTrustBlock'
import { getAuthModeLabel } from '../domain/accessPresentation'

export function LoginScreen() {
  const { login, mode, status, user } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | undefined>()

  if ((status === 'authenticated' || status === 'degraded') && user) {
    return <Navigate to="/fazer/hoje" replace />
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(undefined)

    const result = await login({ email, password })

    if (!result.ok) {
      setError(result.error ?? 'Não foi possível entrar agora.')
    }
  }

  return (
    <AccessShell>
      <AccessCard
        eyebrow="AC02"
        title="Entrar no Olys"
        description="Entre para retomar seu contexto."
        aside={<AccessTrustBlock />}
      >
        <span className="access-mode">{getAuthModeLabel(mode)}</span>
        {mode === 'local' ? (
          <p className="access-note" role="status">
            Supabase não está configurado. O modo local degradado continua disponível para desenvolvimento.
          </p>
        ) : (
          <form className="access-form" onSubmit={handleSubmit}>
            <AccessFormField
              autoComplete="email"
              label="Email"
              name="email"
              required
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <AccessFormField
              autoComplete="current-password"
              label="Senha"
              name="password"
              required
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            {error ? <p className="access-form__error" role="alert">{error}</p> : null}
            <OlysButton variant="primary" disabled={status === 'loading'} type="submit">
              {status === 'loading' ? 'Entrando...' : 'Entrar'}
            </OlysButton>
          </form>
        )}
        <nav className="access-links" aria-label="Acesso">
          <Link to="/signup">Criar acesso</Link>
          <Link to="/recover">Recuperar senha</Link>
        </nav>
      </AccessCard>
    </AccessShell>
  )
}
