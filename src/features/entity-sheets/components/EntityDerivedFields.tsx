import type { EntitySheetField } from '../domain/entitySheetTypes'
import { formatFieldValue } from './EntityEditableFields'

type EntityDerivedFieldsProps = {
  fields: readonly EntitySheetField[]
}

export function EntityDerivedFields({ fields }: EntityDerivedFieldsProps) {
  return (
    <section className="entity-sheet-section entity-derived-fields" aria-label="Campos derivados">
      <header>
        <small>Derivado</small>
        <h3>Não editável por Entity Sheet</h3>
      </header>
      <div className="entity-field-list">
        {fields.map((field) => (
          <div key={field.key} className="entity-field entity-field--derived" data-role={field.role}>
            <span>{field.label}</span>
            <strong>{formatFieldValue(field.value)}</strong>
          </div>
        ))}
      </div>
    </section>
  )
}
