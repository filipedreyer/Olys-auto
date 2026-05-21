import { type FormEvent, useState } from 'react'
import { Link } from 'react-router-dom'
import { OlysButton } from '../../../design-system'
import { useAuth } from '../../../shared/auth/AuthProvider'
import { AccessCard } from '../components/AccessCard'
import { AccessFormField } from '../components/AccessFormField'
import { AccessShell } from '../components/AccessShell'
import { AccessTrustBlock } from '../components/AccessTrustBlock'

export function PasswordRecoveryScreen() {
  const { recoverPassword, mode } = useAuth()
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState<string | undefined>()
  const [error, setError] = useState<string | undefined>()

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage(undefined)
    setError(undefined)

    const result = await recoverPassword({ email })

    if (!result.ok) {
      setError(result.error ?? 'Recuperação indisponível agora.')
      return
    }

    setMessage('Se houver conta para este email, o provedor seguirá o fluxo de recuperação.')
  }

  return (
    <AccessShell>
      <AccessCard
        eyebrow="AC04"
        title="Recuperar acesso"
        description="Informe o email. A resposta não precisa revelar se a conta existe."
        aside={<AccessTrustBlock />}
      >
        {mode === 'local' ? (
          <p className="access-note" role="alert">
            Recuperação exige Supabase configurado. Nenhum envio é prometido no modo local.
          </p>
        ) : (
          <form className="access-form" onSubmit={handleSubmit}>
            <AccessFormField
              autoComplete="email"
              label="Email"
              name="recover-email"
              required
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            {error ? <p className="access-form__error" role="alert">{error}</p> : null}
            {message ? <p className="access-form__status" role="status">{message}</p> : null}
            <OlysButton variant="primary" type="submit">
              Solicitar recuperação
            </OlysButton>
          </form>
        )}
        <nav className="access-links" aria-label="Voltar">
          <Link to="/login">Voltar ao login</Link>
        </nav>
      </AccessCard>
    </AccessShell>
  )
}
