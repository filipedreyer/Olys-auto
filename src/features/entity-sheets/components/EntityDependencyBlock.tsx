import type { EntitySheetDependency } from '../domain/entitySheetTypes'

type EntityDependencyBlockProps = {
  dependencies: readonly EntitySheetDependency[]
}

export function EntityDependencyBlock({ dependencies }: EntityDependencyBlockProps) {
  return (
    <section className="entity-sheet-section entity-dependency-block" aria-label="Dependências operacionais">
      <header>
        <small>Dependências</small>
        <h3>DependencyEdge com impacto e cadeia</h3>
      </header>

      {dependencies.length === 0 ? <p>Nenhuma dependência operacional carregada.</p> : null}

      {dependencies.map((dependency) => (
        <article key={dependency.id} className="entity-sheet-mini-row" data-state={dependency.status}>
          <strong>{dependency.predecessorTitle} → {dependency.successorTitle}</strong>
          <span>{dependency.type} / {dependency.status} / {dependency.role}</span>
          <small>{dependency.impact}</small>
          <p>{dependency.justification}</p>
        </article>
      ))}
    </section>
  )
}
