import { Link } from 'react-router-dom'
import { AccessCard } from '../../access/components/AccessCard'
import { AccessShell } from '../../access/components/AccessShell'
import { PwaInstallPrompt } from '../components/PwaInstallPrompt'

export function PwaInstallScreen() {
  return (
    <AccessShell>
      <AccessCard
        eyebrow="AC06"
        title="Instalar quando o browser permitir"
        description="A instalação é uma conveniência. Offline não significa sincronização completa."
      >
        <PwaInstallPrompt />
        <Link className="olys-button" to="/fazer/hoje">Continuar no app</Link>
      </AccessCard>
    </AccessShell>
  )
}
