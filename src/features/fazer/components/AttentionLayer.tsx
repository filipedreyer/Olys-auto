import type { OlysItem } from '../../../domain/entities/types'
import { EmptyState } from '../../../shared/components/EmptyState'
import { OperationalRow } from './OperationalRow'

type AttentionLayerProps = {
  attention: OlysItem[]
  blocked: OlysItem[]
  details: Record<string, string | undefined>
}

export function AttentionLayer({ attention, blocked, details }: AttentionLayerProps) {
  const total = attention.length + blocked.length

  return (
    <section className="attention-layer" aria-label="Atenção">
      <div className="attention-layer__header">
        <span>Atenção</span>
        <strong>{total}</strong>
      </div>

      <div className="attention-layer__content">
        {total === 0 ? (
          <EmptyState message="Sem riscos ou informações incompletas pedindo atenção." />
        ) : null}

        {attention.map((item) => (
          <OperationalRow
            key={item.id}
            title={item.title}
            meta={item.dateStart ?? item.sourceContext}
            detail={details[item.id] ?? 'Risco operacional, dependência ou informação incompleta'}
            state="attention"
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

        {blocked.map((item) => (
          <OperationalRow
            key={item.id}
            title={item.title}
            meta={item.sourceContext}
            detail={details[item.id]}
            state="blocked"
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
