import { EntityType } from '../../../domain/entities/types'
import type { InboxProjectionItem } from '../domain/inboxProjection'
import { InboxTriageActions } from './InboxTriageActions'
import {
  getInboxDecisionHint,
  getInboxStatusLabel,
  getSuggestedTypeLabel,
  type InboxLayerMode,
} from './inboxPresentation'

type InboxTriageItemProps = {
  item: InboxProjectionItem
  busy: boolean
  mode: InboxLayerMode
  onKeep?: (id: string) => void
  onConvert: (id: string, targetType: EntityType) => void
  onComplete: (id: string) => void
  onPostpone?: (id: string) => void
  onDiscard: (id: string) => void
}

export function InboxTriageItem({
  item,
  busy,
  mode,
  onKeep,
  onConvert,
  onComplete,
  onPostpone,
  onDiscard,
}: InboxTriageItemProps) {
  const suggestedLabel = getSuggestedTypeLabel(item.suggestedType)
  const statusLabel = getInboxStatusLabel(item.status)
  const decisionHint = getInboxDecisionHint(mode, item.status)

  return (
    <article
      className="inbox-triage-item"
      data-mode={mode}
      data-status={item.status}
      data-inbox-item="true"
    >
      <div className="inbox-triage-item__rail" aria-hidden="true" />
      <div className="inbox-triage-item__body">
        <div className="inbox-triage-item__meta">
          <span>{statusLabel}</span>
          <span>{item.origin}</span>
          <time dateTime={item.capturedAt}>{item.capturedAt}</time>
        </div>
        <strong>{item.text}</strong>
        <p>{item.detail}</p>
        <div className="inbox-triage-item__signals" aria-label="Sinais da entrada">
          <span>InboxItem</span>
          <span>{decisionHint}</span>
          {item.suggestedType ? (
            <span>Sugestão: {suggestedLabel}</span>
          ) : (
            <span>Sem sugestão; converter como Tarefa</span>
          )}
        </div>
      </div>
      <InboxTriageActions
        itemId={item.id}
        suggestedType={item.suggestedType}
        mode={mode}
        busy={busy}
        onKeep={onKeep}
        onConvert={onConvert}
        onComplete={onComplete}
        onPostpone={onPostpone}
        onDiscard={onDiscard}
      />
    </article>
  )
}
