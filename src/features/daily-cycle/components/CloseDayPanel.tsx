import { OlysButton } from '../../../design-system'
import type { DailyCycleProjection } from '../domain/dailyCycleProjection'
import { getCloseDayCopy } from './dailyCyclePresentation'
import { DiaryClosingField } from './DiaryClosingField'

type CloseDayPanelProps = {
  projection: DailyCycleProjection
  closingNote: string
  busy?: boolean
  onClosingNoteChange: (value: string) => void
  onCloseDay: () => void
}

export function CloseDayPanel({
  projection,
  closingNote,
  busy = false,
  onClosingNoteChange,
  onCloseDay,
}: CloseDayPanelProps) {
  return (
    <section className="close-day-panel" aria-label="Fechar o Dia">
      <div>
        <small>Fechar o Dia</small>
        <h3>{projection.closingState}</h3>
        <p>{getCloseDayCopy(projection)}</p>
      </div>
      <DiaryClosingField
        value={closingNote}
        disabled={busy || projection.sessionStatus === 'closed'}
        onChange={onClosingNoteChange}
      />
      <OlysButton
        variant="secondary"
        disabled={busy || !projection.canCloseDay}
        aria-label="Fechar o Dia"
        onClick={onCloseDay}
      >
        Fechar o Dia
      </OlysButton>
    </section>
  )
}
