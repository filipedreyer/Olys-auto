import { EntityType } from '../../../domain/entities/types'
import { OlysButton } from '../../../design-system'
import { getConvertLabel, type InboxLayerMode } from './inboxPresentation'

type InboxTriageActionsProps = {
  itemId: string
  suggestedType?: EntityType
  mode: InboxLayerMode
  busy: boolean
  onKeep?: (id: string) => void
  onConvert: (id: string, targetType: EntityType) => void
  onComplete: (id: string) => void
  onPostpone?: (id: string) => void
  onDiscard: (id: string) => void
}

export function InboxTriageActions({
  itemId,
  suggestedType,
  mode,
  busy,
  onKeep,
  onConvert,
  onComplete,
  onPostpone,
  onDiscard,
}: InboxTriageActionsProps) {
  const convertLabel = getConvertLabel(suggestedType)
  const targetType = suggestedType ?? 'task'

  return (
    <div className="inbox-triage-actions" aria-label="Ações de triagem">
      {mode === 'triage' ? (
        <OlysButton
          className="inbox-action inbox-action--quiet"
          variant="quiet"
          disabled={busy}
          aria-label="Manter entrada na Inbox para revisita"
          onClick={() => onKeep?.(itemId)}
        >
          Manter
        </OlysButton>
      ) : null}
      <OlysButton
        className="inbox-action inbox-action--primary"
        variant="primary"
        disabled={busy}
        aria-label={convertLabel}
        onClick={() => onConvert(itemId, targetType)}
      >
        {convertLabel}
      </OlysButton>
      <OlysButton
        className="inbox-action inbox-action--quiet"
        variant="secondary"
        disabled={busy}
        aria-label="Concluir entrada sem criar entidade"
        onClick={() => onComplete(itemId)}
      >
        Concluir
      </OlysButton>
      {mode === 'triage' ? (
        <OlysButton
          className="inbox-action inbox-action--quiet"
          variant="quiet"
          disabled={busy}
          aria-label="Adiar entrada mantendo rastreabilidade"
          onClick={() => onPostpone?.(itemId)}
        >
          Adiar
        </OlysButton>
      ) : null}
      <OlysButton
        className="inbox-action inbox-action--danger"
        variant="quiet"
        disabled={busy}
        aria-label="Descartar entrada da triagem"
        onClick={() => onDiscard(itemId)}
      >
        Descartar
      </OlysButton>
    </div>
  )
}
