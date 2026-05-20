import type { OlysItem } from '../../../domain/entities/types'
import { OperationalRow } from './OperationalRow'

type CompletedLayerProps = {
  items: OlysItem[]
  details: Record<string, string | undefined>
}

export function CompletedLayer({ items, details }: CompletedLayerProps) {
  if (items.length === 0) {
    return null
  }

  return (
    <section className="completed-layer" aria-label="Concluídos">
      <div className="completed-layer__header">
        <span>Concluídos</span>
        <strong>{items.length}</strong>
      </div>

      <div className="completed-layer__content">
        {items.map((item) => (
          <OperationalRow
            key={item.id}
            title={item.title}
            meta={item.sourceContext}
            detail={details[item.id]}
            state="completed"
            entityType={item.entityType}
            priority={item.priority}
            dateStart={item.dateStart}
            startAt={item.startAt}
            endAt={item.endAt}
            durationMinutes={item.durationMinutes}
            size="compact"
            itemId={item.id}
          />
        ))}
      </div>
    </section>
  )
}
