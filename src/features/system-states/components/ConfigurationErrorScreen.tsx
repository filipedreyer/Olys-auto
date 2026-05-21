import { Link } from 'react-router-dom'
import { AccessShell } from '../../access/components/AccessShell'
import { AccessCard } from '../../access/components/AccessCard'
import { getConfigurationErrorCopy } from '../domain/systemStatePresentation'

export function ConfigurationErrorScreen() {
  return (
    <AccessShell>
      <AccessCard
        eyebrow="Configuração"
        title="Acesso remoto indisponível"
        description={getConfigurationErrorCopy()}
      >
        <p className="configuration-error-screen" role="alert">
          Verifique as variáveis de Supabase antes de prometer login, cadastro ou recuperação.
        </p>
        <Link className="olys-button" to="/login">Voltar ao acesso</Link>
      </AccessCard>
    </AccessShell>
  )
}
