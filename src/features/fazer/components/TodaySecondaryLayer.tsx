import type { OlysItem } from '../../../domain/entities/types'
import { EmptyState } from '../../../shared/components/EmptyState'
import { OperationalRow } from './OperationalRow'

type TodaySecondaryLayerProps = {
  items: OlysItem[]
  details: Record<string, string | undefined>
}

export function TodaySecondaryLayer({ items, details }: TodaySecondaryLayerProps) {
  return (
    <details className="today-secondary" open>
      <summary>
        <span>Cabe hoje</span>
        <strong>{items.length}</strong>
      </summary>
      <div className="today-secondary__grid">
        {items.length === 0 ? (
          <EmptyState message="Nenhum item qualificado para depois hoje." />
        ) : null}

        {items.map((item) => (
          <OperationalRow
            key={item.id}
            title={item.title}
            meta={item.sourceContext}
            detail={details[item.id]}
            state={item.status === 'paused' ? 'paused' : 'default'}
            entityType={item.entityType}
            priority={item.priority}
            dateStart={item.dateStart}
            startAt={item.startAt}
            endAt={item.endAt}
            durationMinutes={item.durationMinutes}
            size="compact"
          />
        ))}
      </div>
    </details>
  )
}
