import { OlysButton } from '../../../design-system'
import type { DailyCycleProjection } from '../domain/dailyCycleProjection'
import { getOpenDayCopy, getSessionLabel } from './dailyCyclePresentation'

type OpenDayPanelProps = {
  projection: DailyCycleProjection
  busy?: boolean
  onOpenDay: () => void
}

export function OpenDayPanel({
  projection,
  busy = false,
  onOpenDay,
}: OpenDayPanelProps) {
  return (
    <section className="open-day-panel" aria-label="Abrir o Dia">
      <div>
        <small>Preparar o dia</small>
        <h3>{getSessionLabel(projection.sessionStatus)}</h3>
        <p>{getOpenDayCopy(projection)}</p>
      </div>
      <OlysButton
        variant="primary"
        disabled={busy || !projection.canOpenDay}
        aria-label="Abrir o Dia"
        onClick={onOpenDay}
      >
        Abrir o Dia
      </OlysButton>
    </section>
  )
}
