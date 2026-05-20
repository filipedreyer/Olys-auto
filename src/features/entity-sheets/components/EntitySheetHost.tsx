import { useState } from 'react'
import { OlysSheet } from '../../../design-system'
import type {
  DependencyEdge,
  EntityChangeEvent,
  EntityCondition,
  EntityLink,
  OlysItem,
} from '../../../domain/entities/types'
import { useEntitySheet } from '../context/EntitySheetContext'
import { buildEntitySheetProjection } from '../domain/entitySheetProjection'
import type { EntitySheetAction } from '../domain/entitySheetTypes'
import { EntitySheet } from './EntitySheet'
import { EntitySheetConfirmation } from './EntitySheetConfirmation'

type EntitySheetHostActions = {
  completeItem?: (id: string) => Promise<void>
  archiveItem?: (id: string) => Promise<void>
  restoreItem?: (id: string) => Promise<void>
  softDeleteItem?: (id: string) => Promise<void>
  applyEssentialProtected?: (id: string) => Promise<void>
  removeEssentialProtected?: (id: string) => Promise<void>
}

export type EntitySheetHostProps = {
  items: readonly OlysItem[]
  conditions: readonly EntityCondition[]
  links: readonly EntityLink[]
  dependencies: readonly DependencyEdge[]
  events?: readonly EntityChangeEvent[]
  busy?: boolean
  actions?: EntitySheetHostActions
}

export function EntitySheetHost({
  items,
  conditions,
  links,
  dependencies,
  events = [],
  busy = false,
  actions = {},
}: EntitySheetHostProps) {
  const { activeEntityId, closeEntitySheet } = useEntitySheet()
  const [pendingAction, setPendingAction] = useState<EntitySheetAction | undefined>()
  const projection = activeEntityId
    ? buildEntitySheetProjection({
        itemId: activeEntityId,
        items,
        conditions,
        links,
        dependencies,
        events,
      })
    : undefined

  async function confirmAction() {
    if (!projection || !pendingAction) {
      return
    }

    const id = projection.item.id

    if (pendingAction === 'complete') {
      await actions.completeItem?.(id)
    } else if (pendingAction === 'archive') {
      await actions.archiveItem?.(id)
    } else if (pendingAction === 'restore') {
      await actions.restoreItem?.(id)
    } else if (pendingAction === 'softDelete') {
      await actions.softDeleteItem?.(id)
    } else if (pendingAction === 'applyEssentialProtected') {
      await actions.applyEssentialProtected?.(id)
    } else if (pendingAction === 'removeEssentialProtected') {
      await actions.removeEssentialProtected?.(id)
    }

    setPendingAction(undefined)
  }

  return (
    <>
      <OlysSheet
        open={Boolean(activeEntityId)}
        title={projection?.title ?? 'Entity Sheet'}
        eyebrow={projection?.entityLabel ?? 'Entidade'}
        description="Detalhe contextual sem rota principal ou formulário universal."
        onClose={() => {
          setPendingAction(undefined)
          closeEntitySheet()
        }}
        className="entity-sheet-layer"
        panelClassName="entity-sheet-panel"
      >
        {projection ? (
          <EntitySheet
            projection={projection}
            busy={busy}
            onRequestAction={setPendingAction}
          />
        ) : (
          <div className="entity-sheet entity-sheet--unavailable">
            <p>Entidade indisponível no contexto carregado.</p>
          </div>
        )}
      </OlysSheet>

      <EntitySheetConfirmation
        action={pendingAction}
        title={projection?.title ?? 'Entidade'}
        busy={busy}
        onCancel={() => setPendingAction(undefined)}
        onConfirm={() => void confirmAction()}
      />
    </>
  )
}
