import { EntityType } from '../../../domain/entities/types'
import { EmptyState } from '../../../shared/components/EmptyState'
import type { InboxProjectionItem } from '../domain/inboxProjection'
import { InboxTriageItem } from './InboxTriageItem'

type InboxRevisitLayerProps = {
  items: InboxProjectionItem[]
  busy: boolean
  onConvert: (id: string, targetType: EntityType) => void
  onComplete: (id: string) => void
  onDiscard: (id: string) => void
}

export function InboxRevisitLayer({
  items,
  busy,
  onConvert,
  onComplete,
  onDiscard,
}: InboxRevisitLayerProps) {
  return (
    <section className="inbox-revisit-layer" aria-label="Revisita controlada">
      <header>
        <div>
          <small>Revisita controlada</small>
          <h2>Fora da fila ativa</h2>
        </div>
        <strong>{items.length}</strong>
      </header>
      {items.length === 0 ? (
        <EmptyState message="Nada mantido ou adiado competindo por atenção." />
      ) : null}
      <div className="inbox-revisit-layer__items">
        {items.map((item) => (
          <InboxTriageItem
            key={item.id}
            item={item}
            busy={busy}
            mode="revisit"
            onConvert={onConvert}
            onComplete={onComplete}
            onDiscard={onDiscard}
          />
        ))}
      </div>
    </section>
  )
}
