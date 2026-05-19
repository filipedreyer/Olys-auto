import type { OlysItem } from '../../../domain/entities/types'
import { EmptyState } from '../../../shared/components/EmptyState'
import { OperationalCarousel } from './OperationalCarousel'

type NowStageProps = {
  items: OlysItem[]
  details: Record<string, string | undefined>
}

export function NowStage({ items, details }: NowStageProps) {
  return (
    <section className="now-stage" aria-label="Para fazer agora">
      <div className="now-stage__header">
        <span>Para fazer agora</span>
        <strong>{items.length}</strong>
      </div>

      {items.length === 0 ? (
        <EmptyState message="Nada puxado para agora; capture ou abra o dia quando houver contexto." />
      ) : (
        <OperationalCarousel items={items} details={details} />
      )}
    </section>
  )
}
