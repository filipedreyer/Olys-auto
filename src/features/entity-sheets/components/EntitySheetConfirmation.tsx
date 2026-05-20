import { OlysButton, OlysSheet } from '../../../design-system'
import type { EntitySheetAction } from '../domain/entitySheetTypes'

type EntitySheetConfirmationProps = {
  action?: EntitySheetAction
  title: string
  busy?: boolean
  onCancel: () => void
  onConfirm: () => void
}

const copyByAction: Record<EntitySheetAction, { title: string; impact: string; reversible: string }> = {
  complete: {
    title: 'Confirmar conclusão',
    impact: 'Move o item para histórico operacional quando o handler existente confirmar.',
    reversible: 'Pode ser recuperado por restore quando a regra existente permitir.',
  },
  archive: {
    title: 'Confirmar arquivamento',
    impact: 'Retira o item do fluxo ativo sem tratá-lo como lixeira.',
    reversible: 'Pode ser restaurado por restoreItem.',
  },
  restore: {
    title: 'Confirmar restauração',
    impact: 'Traz o item de volta ao ciclo operacional existente.',
    reversible: 'Pode ser arquivado novamente por ação separada.',
  },
  softDelete: {
    title: 'Confirmar remoção controlada',
    impact: 'Marca o item como deleted pelo handler existente.',
    reversible: 'A restauração depende da regra já existente.',
  },
  update: {
    title: 'Atualização controlada',
    impact: 'Edição real não é executada nesta fase.',
    reversible: 'Sem persistência nesta fase.',
  },
  openRelated: {
    title: 'Abrir relacionado',
    impact: 'Apenas navega dentro da sheet.',
    reversible: 'Sem persistência.',
  },
  applyEssentialProtected: {
    title: 'Aplicar essencial protegido',
    impact: 'Cria condição essencial_protected existente, sem tratar como entidade.',
    reversible: 'Pode ser removida por ação correspondente.',
  },
  removeEssentialProtected: {
    title: 'Remover essencial protegido',
    impact: 'Remove a condição essencial_protected existente.',
    reversible: 'Pode ser aplicada novamente por ação correspondente.',
  },
  none: {
    title: 'Sem ação',
    impact: 'Nenhuma ação persistente será executada.',
    reversible: 'Sem persistência.',
  },
}

export function EntitySheetConfirmation({
  action,
  title,
  busy = false,
  onCancel,
  onConfirm,
}: EntitySheetConfirmationProps) {
  const copy = action ? copyByAction[action] : undefined

  return (
    <OlysSheet
      open={Boolean(action && copy)}
      title={copy?.title ?? 'Confirmação'}
      eyebrow="Confirmação"
      description={title}
      onClose={onCancel}
      className="entity-sheet-confirmation"
      closeLabel="Cancelar"
      actions={
        <OlysButton
          variant={action === 'softDelete' ? 'danger' : 'primary'}
          disabled={busy || !action || action === 'none'}
          onClick={onConfirm}
          aria-label={`Confirmar ${copy?.title ?? 'ação'}`}
        >
          Confirmar
        </OlysButton>
      }
    >
      {copy ? (
        <div className="entity-sheet-confirmation__body">
          <p>{copy.impact}</p>
          <p>{copy.reversible}</p>
          <small>A confirmação usa apenas handlers existentes; não há IA ou comando novo.</small>
        </div>
      ) : null}
    </OlysSheet>
  )
}
