import { EntityType } from '../../../domain/entities/types'
import { EmptyState } from '../../../shared/components/EmptyState'
import type { InboxProjectionItem } from '../domain/inboxProjection'
import { InboxTriageItem } from './InboxTriageItem'

type InboxTriageLayerProps = {
  items: InboxProjectionItem[]
  busy: boolean
  onKeep: (id: string) => void
  onConvert: (id: string, targetType: EntityType) => void
  onComplete: (id: string) => void
  onPostpone: (id: string) => void
  onDiscard: (id: string) => void
}

export function InboxTriageLayer({
  items,
  busy,
  onKeep,
  onConvert,
  onComplete,
  onPostpone,
  onDiscard,
}: InboxTriageLayerProps) {
  return (
    <section className="inbox-triage-layer" aria-label="Entradas em triagem">
      <header>
        <div>
          <small>Triagem nova</small>
          <h2>Decidir antes de virar trabalho</h2>
        </div>
        <strong>{items.length}</strong>
      </header>
      {items.length === 0 ? (
        <EmptyState message="Nenhuma entrada nova aguardando decisão." />
      ) : null}
      <div className="inbox-triage-layer__items">
        {items.map((item) => (
          <InboxTriageItem
            key={item.id}
            item={item}
            busy={busy}
            mode="triage"
            onKeep={onKeep}
            onConvert={onConvert}
            onComplete={onComplete}
            onPostpone={onPostpone}
            onDiscard={onDiscard}
          />
        ))}
      </div>
    </section>
  )
}
