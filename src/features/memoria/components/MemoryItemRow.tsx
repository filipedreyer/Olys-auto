import { OlysButton } from '../../../design-system'
import { OperationalRow } from '../../fazer/components/OperationalRow'
import type { MemoryProjectionItem } from '../domain/memoryProjection'
import {
  formatMemoryAction,
  formatMemoryOrigin,
  formatMemoryRelation,
  formatMemoryStatus,
} from './memoryPresentation'

type MemoryItemRowProps = {
  item: MemoryProjectionItem
  busy?: boolean
  mode: MemoryProjectionItem['recoveryKind']
  onRestore?: (id: string) => void
  onReuse?: (id: string) => void
  onOpen?: (id: string) => void
}

export function MemoryItemRow({
  item,
  busy = false,
  mode,
  onRestore,
  onReuse,
  onOpen,
}: MemoryItemRowProps) {
  const entityType = item.originKind === 'inbox' || item.isFutureContract
    ? 'unclassified'
    : item.entityType ?? 'unclassified'
  const state = item.status === 'completed'
    ? 'completed'
    : item.status === 'paused'
      ? 'paused'
      : item.isFutureContract
        ? 'unknown'
        : 'default'
  const relation = formatMemoryRelation(item)
  const detail = [item.detail, relation].filter(Boolean).join(' / ')

  return (
    <article className="memory-item-row" data-mode={mode} data-origin={item.originKind}>
      <OperationalRow
        title={item.title}
        meta={`${formatMemoryStatus(item)} / ${formatMemoryOrigin(item)}`}
        detail={detail}
        entityType={entityType}
        state={state}
        size="compact"
      />
      <div className="memory-item-actions" aria-label={`Ações de memória para ${item.title}`}>
        {item.isRecoverable && onRestore ? (
          <OlysButton
            disabled={busy}
            variant="secondary"
            aria-label={`Restaurar contexto de ${item.title}`}
            onClick={() => onRestore(item.id)}
          >
            {formatMemoryAction(item)}
          </OlysButton>
        ) : null}
        {item.isReusable && onReuse ? (
          <OlysButton
            disabled={busy}
            variant="secondary"
            aria-label={`Reutilizar template ${item.title}`}
            onClick={() => onReuse(item.id)}
          >
            {formatMemoryAction(item)}
          </OlysButton>
        ) : null}
        {!item.isRecoverable && !item.isReusable && onOpen && !item.isFutureContract ? (
          <OlysButton
            disabled={busy}
            variant="quiet"
            aria-label={`Revisar contexto de ${item.title}`}
            onClick={() => onOpen(item.id)}
          >
            {formatMemoryAction(item)}
          </OlysButton>
        ) : null}
        {item.isFutureContract ? <span>Privado por contrato futuro</span> : null}
      </div>
    </article>
  )
}
