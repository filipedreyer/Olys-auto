import { EmptyState } from '../../../shared/components/EmptyState'
import type { RhythmProjection } from '../domain/planningProjection'
import { PlanningEntityRow } from './PlanningEntityRow'
import { getRhythmLabel, polishPlanningText } from './planningPresentation'

type PlanningRhythmsLayerProps = {
  rhythms: RhythmProjection[]
}

export function PlanningRhythmsLayer({ rhythms }: PlanningRhythmsLayerProps) {
  return (
    <section className="planning-section planning-rhythms-layer" aria-label="Hábitos e rotinas">
      <header className="planning-section__header">
        <div>
          <small>Ritmos</small>
          <h2>Hábitos e rotinas contextuais</h2>
        </div>
        <strong>{rhythms.length}</strong>
      </header>

      <div className="planning-section__content">
        {rhythms.length === 0 ? (
          <EmptyState message="Nenhum hábito ou rotina ativo como ritmo contextual." />
        ) : null}

        {rhythms.map((rhythm) => (
          <PlanningEntityRow
            key={rhythm.id}
            entityType={rhythm.kind}
            title={rhythm.title}
            context={getRhythmLabel(rhythm.kind)}
            detail={rhythm.recurrence ?? 'Recorrência não declarada'}
            relation={polishPlanningText(rhythm.reading)}
            state="default"
            density="compact"
            itemId={rhythm.id}
          />
        ))}
      </div>
    </section>
  )
}
