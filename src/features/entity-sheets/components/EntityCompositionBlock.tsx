import type { EntitySheetProjection } from '../domain/entitySheetTypes'

type EntityCompositionBlockProps = {
  composition: EntitySheetProjection['compositionSummary']
}

export function EntityCompositionBlock({ composition }: EntityCompositionBlockProps) {
  return (
    <section className="entity-sheet-section entity-composition-block" aria-label="Composição">
      <header>
        <small>Composição</small>
        <h3>Parent e filhos sem quadro de gestão</h3>
      </header>

      {composition.parent ? (
        <article className="entity-sheet-mini-row">
          <strong>Superior: {composition.parent.title}</strong>
          <span>{composition.parent.entityType} / {composition.parent.status}</span>
        </article>
      ) : (
        <p>Sem composição superior carregada.</p>
      )}

      {composition.children.length > 0 ? (
        <div className="entity-sheet-nested-list">
          {composition.children.map((child) => (
            <article key={child.id} className="entity-sheet-mini-row">
              <strong>{child.title}</strong>
              <span>{child.entityType} / {child.status}</span>
            </article>
          ))}
        </div>
      ) : (
        <p>Sem filhos carregados.</p>
      )}
    </section>
  )
}
