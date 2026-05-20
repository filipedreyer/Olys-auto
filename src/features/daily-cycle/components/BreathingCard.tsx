import type { DailyCycleProjection } from '../domain/dailyCycleProjection'
import { getBreathingCopy } from './dailyCyclePresentation'

type BreathingCardProps = {
  projection: DailyCycleProjection
}

export function BreathingCard({ projection }: BreathingCardProps) {
  if (!projection.canShowBreathingCard) {
    return null
  }

  return (
    <aside className="breathing-card" aria-label="Carta de Respiro">
      <small>Carta de Respiro</small>
      <p>{getBreathingCopy(projection)}</p>
      <span>Sem ação automática. Sem preencher tempo liberado por padrão.</span>
    </aside>
  )
}
