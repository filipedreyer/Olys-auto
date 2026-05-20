import type { EntitySheetAction, EntitySheetProjection } from '../domain/entitySheetTypes'
import { EntityAttachmentBlock } from './EntityAttachmentBlock'
import { EntityCompositionBlock } from './EntityCompositionBlock'
import { EntityDependencyBlock } from './EntityDependencyBlock'
import { EntityDerivedFields } from './EntityDerivedFields'
import { EntityEditableFields } from './EntityEditableFields'
import { EntityHistoryBlock } from './EntityHistoryBlock'
import { EntityRelationBlock } from './EntityRelationBlock'
import { EntitySheetActions } from './EntitySheetActions'
import { EntitySheetHeader } from './EntitySheetHeader'
import { EntitySpecificBlock } from './EntitySpecificBlock'

type EntitySheetProps = {
  projection: EntitySheetProjection
  busy?: boolean
  onRequestAction: (action: EntitySheetAction) => void
}

export function EntitySheet({
  projection,
  busy = false,
  onRequestAction,
}: EntitySheetProps) {
  return (
    <div className="entity-sheet" data-entity={projection.kind} data-state={projection.status}>
      <EntitySheetHeader projection={projection} />

      {projection.risks.length > 0 || projection.missingInformation.length > 0 ? (
        <section className="entity-sheet-section entity-sheet-section--signals" aria-label="Riscos e lacunas">
          <header>
            <small>Sinais</small>
            <h3>Riscos e informação faltante</h3>
          </header>
          {projection.risks.map((risk) => <p key={risk}>{risk}</p>)}
          {projection.missingInformation.map((missing) => <p key={missing}>{missing}</p>)}
        </section>
      ) : null}

      <EntityEditableFields fields={projection.editableFields} />
      <EntityDerivedFields fields={projection.derivedFields} />
      <EntitySpecificBlock projection={projection} />
      <EntityRelationBlock relations={projection.relationSummary} />
      <EntityDependencyBlock dependencies={projection.dependencySummary} />
      <EntityCompositionBlock composition={projection.compositionSummary} />
      <EntityHistoryBlock events={projection.historySummary} />
      <EntityAttachmentBlock attachment={projection.attachmentSummary} />
      <EntitySheetActions projection={projection} busy={busy} onRequestAction={onRequestAction} />
    </div>
  )
}
