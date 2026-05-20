import type { EntitySheetRelation } from '../domain/entitySheetTypes'

type EntityRelationBlockProps = {
  relations: readonly EntitySheetRelation[]
}

export function EntityRelationBlock({ relations }: EntityRelationBlockProps) {
  return (
    <section className="entity-sheet-section entity-relation-block" aria-label="Vínculos contextuais">
      <header>
        <small>Vínculos</small>
        <h3>EntityLink separado de dependência</h3>
      </header>

      {relations.length === 0 ? <p>Nenhum vínculo contextual carregado.</p> : null}

      {relations.map((relation) => (
        <article key={relation.id} className="entity-sheet-mini-row">
          <strong>{relation.relatedTitle}</strong>
          <span>{relation.linkType} / {relation.direction}</span>
          <small>{relation.relatedEntityType ?? 'tipo indisponível'}</small>
        </article>
      ))}
    </section>
  )
}
