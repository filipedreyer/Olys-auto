import type { DailyCycleProjection } from '../domain/dailyCycleProjection'
import { BreathingCard } from './BreathingCard'
import { CloseDayPanel } from './CloseDayPanel'
import { DayReadingCard } from './DayReadingCard'
import { OpenDayPanel } from './OpenDayPanel'

type DailyCyclePanelProps = {
  projection: DailyCycleProjection
  closingNote: string
  busy?: boolean
  onOpenDay: () => void
  onCloseDay: () => void
  onClosingNoteChange: (value: string) => void
}

export function DailyCyclePanel({
  projection,
  closingNote,
  busy = false,
  onOpenDay,
  onCloseDay,
  onClosingNoteChange,
}: DailyCyclePanelProps) {
  return (
    <section className="daily-cycle-panel" aria-label="Ciclo diário">
      <DayReadingCard projection={projection} />
      <div className="daily-cycle-panel__doors">
        <OpenDayPanel projection={projection} busy={busy} onOpenDay={onOpenDay} />
        <CloseDayPanel
          projection={projection}
          closingNote={closingNote}
          busy={busy}
          onClosingNoteChange={onClosingNoteChange}
          onCloseDay={onCloseDay}
        />
      </div>
      <BreathingCard projection={projection} />
    </section>
  )
}
