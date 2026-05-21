import { useState } from 'react'
import { OlysButton } from '../../../design-system'

type CentralGovernedFlowProps = {
  flowType: 'export' | 'deletion' | 'support' | 'preference'
  title: string
  description: string
  consequence: string
  limitation: string
  requiresBackend: boolean
  dangerous?: boolean
  onAcknowledge?: () => void
}

export function CentralGovernedFlow({
  flowType,
  title,
  description,
  consequence,
  limitation,
  requiresBackend,
  dangerous = false,
  onAcknowledge,
}: CentralGovernedFlowProps) {
  const [acknowledged, setAcknowledged] = useState(false)

  return (
    <section
      className="central-governed-flow"
      data-flow={flowType}
      data-dangerous={dangerous ? 'true' : 'false'}
      role={dangerous ? 'alert' : undefined}
      aria-label={title}
    >
      <header>
        <small>{requiresBackend ? 'Fluxo governado futuro' : 'Fluxo controlado'}</small>
        <h3>{title}</h3>
        <p>{description}</p>
      </header>
      <dl>
        <div>
          <dt>Consequência</dt>
          <dd>{consequence}</dd>
        </div>
        <div>
          <dt>Limite atual</dt>
          <dd>{limitation}</dd>
        </div>
      </dl>
      <OlysButton
        variant={dangerous ? 'danger' : 'secondary'}
        aria-label={`Reconhecer limite de ${title}`}
        onClick={() => {
          setAcknowledged(true)
          onAcknowledge?.()
        }}
      >
        {dangerous ? 'Entendi; não excluir agora' : 'Entendi o limite'}
      </OlysButton>
      {acknowledged ? (
        <p className="central-governed-flow__status" role="status">
          Registrado apenas nesta interface. Nenhuma ação persistente foi executada.
        </p>
      ) : null}
    </section>
  )
}
