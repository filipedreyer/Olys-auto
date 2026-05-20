import { OlysButton } from '../../../design-system'
import type { EntitySheetAction, EntitySheetProjection } from '../domain/entitySheetTypes'

type EntitySheetActionsProps = {
  projection: EntitySheetProjection
  busy?: boolean
  onRequestAction: (action: EntitySheetAction) => void
}

const labelByAction: Record<EntitySheetAction, string> = {
  complete: 'Concluir',
  archive: 'Arquivar',
  restore: 'Restaurar',
  softDelete: 'Remover',
  update: 'Atualizar',
  openRelated: 'Abrir relacionado',
  applyEssentialProtected: 'Proteger essencial',
  removeEssentialProtected: 'Remover proteção',
  none: 'Sem ação',
}

export function EntitySheetActions({
  projection,
  busy = false,
  onRequestAction,
}: EntitySheetActionsProps) {
  const actions = projection.confirmationsRequired.filter((action) => action !== 'none')

  return (
    <section className="entity-sheet-section entity-sheet-actions" aria-label={`Ações de ${projection.title}`}>
      <header>
        <small>Ações</small>
        <h3>Persistência só com confirmação</h3>
      </header>
      <div className="entity-sheet-actions__buttons">
        {actions.map((action) => (
          <OlysButton
            key={action}
            variant={action === 'softDelete' ? 'danger' : 'secondary'}
            disabled={busy}
            aria-label={`${labelByAction[action]} ${projection.title}`}
            onClick={() => onRequestAction(action)}
          >
            {labelByAction[action]}
          </OlysButton>
        ))}
      </div>
    </section>
  )
}
