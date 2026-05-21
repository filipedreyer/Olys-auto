import { type FormEvent, useState } from 'react'
import { Link } from 'react-router-dom'
import { OlysButton } from '../../../design-system'
import { useAuth } from '../../../shared/auth/AuthProvider'
import { AccessCard } from '../components/AccessCard'
import { AccessFormField } from '../components/AccessFormField'
import { AccessShell } from '../components/AccessShell'
import { AccessTrustBlock } from '../components/AccessTrustBlock'

export function SignupScreen() {
  const { signup, mode, status } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState<string | undefined>()
  const [error, setError] = useState<string | undefined>()

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage(undefined)
    setError(undefined)

    const result = await signup({ email, password })

    if (!result.ok) {
      setError(result.error ?? 'Cadastro indisponível agora.')
      return
    }

    setMessage('Cadastro solicitado. Verifique o fluxo configurado pelo provedor.')
  }

  return (
    <AccessShell>
      <AccessCard
        eyebrow="AC03"
        title="Criar acesso"
        description="Cadastro prepara uma sessão protegida; não cria dados operacionais falsos."
        aside={<AccessTrustBlock />}
      >
        {mode === 'local' ? (
          <p className="access-note" role="alert">
            Cadastro exige Supabase configurado. O modo local não cria usuário remoto.
          </p>
        ) : (
          <form className="access-form" onSubmit={handleSubmit}>
            <AccessFormField
              autoComplete="email"
              label="Email"
              name="signup-email"
              required
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <AccessFormField
              autoComplete="new-password"
              label="Senha"
              minLength={8}
              name="signup-password"
              required
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            {error ? <p className="access-form__error" role="alert">{error}</p> : null}
            {message ? <p className="access-form__status" role="status">{message}</p> : null}
            <OlysButton variant="primary" disabled={status === 'loading'} type="submit">
              Criar acesso
            </OlysButton>
          </form>
        )}
        <nav className="access-links" aria-label="Voltar">
          <Link to="/login">Já tenho acesso</Link>
        </nav>
      </AccessCard>
    </AccessShell>
  )
}
