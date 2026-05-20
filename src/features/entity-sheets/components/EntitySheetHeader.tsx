import type { EntitySheetProjection } from '../domain/entitySheetTypes'

type EntitySheetHeaderProps = {
  projection: EntitySheetProjection
}

export function EntitySheetHeader({ projection }: EntitySheetHeaderProps) {
  const { item } = projection

  return (
    <header className="entity-sheet-header" data-entity={projection.kind} data-state={projection.status}>
      <div>
        <small>{projection.entityLabel}</small>
        <h2>{projection.title}</h2>
        <p>{item.sourceContext ?? 'Contexto de origem não declarado'}</p>
      </div>
      <div className="entity-sheet-header__status" aria-label={`Estado ${projection.status}`}>
        <span>{projection.status}</span>
        {projection.missingInformation.length > 0 ? (
          <strong>{projection.missingInformation.length} lacuna(s)</strong>
        ) : null}
      </div>
    </header>
  )
}
