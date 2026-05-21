import { Link } from 'react-router-dom'
import { AccessCard } from '../components/AccessCard'
import { AccessShell } from '../components/AccessShell'
import { AccessTrustBlock } from '../components/AccessTrustBlock'

export function SessionExpiredScreen() {
  return (
    <AccessShell>
      <AccessCard
        eyebrow="AC07"
        title="Sessão expirada"
        description="Entre novamente para proteger seus dados. Isso não significa perda de contexto."
        aside={<AccessTrustBlock />}
      >
        <Link className="olys-button" to="/login">Entrar novamente</Link>
      </AccessCard>
    </AccessShell>
  )
}
