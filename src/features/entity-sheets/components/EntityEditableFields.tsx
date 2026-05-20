import type { EntitySheetField } from '../domain/entitySheetTypes'

type EntityEditableFieldsProps = {
  fields: readonly EntitySheetField[]
}

export function EntityEditableFields({ fields }: EntityEditableFieldsProps) {
  return (
    <section className="entity-sheet-section entity-editable-fields" aria-label="Campos editáveis controlados">
      <header>
        <small>Campos editáveis</small>
        <h3>Leitura controlada nesta fase</h3>
      </header>
      <div className="entity-field-list">
        {fields.map((field) => (
          <div
            key={field.key}
            className="entity-field entity-field--editable"
            data-role={field.role}
            data-editable={field.editable ? 'true' : 'false'}
          >
            <span>{field.label}</span>
            <strong>{formatFieldValue(field.value)}</strong>
            {field.helperText ? <small>{field.helperText}</small> : null}
          </div>
        ))}
      </div>
    </section>
  )
}

export function formatFieldValue(value: EntitySheetField['value']) {
  if (value === undefined || value === null || value === '') {
    return 'Não declarado'
  }

  if (typeof value === 'boolean') {
    return value ? 'Sim' : 'Não'
  }

  return String(value)
}
