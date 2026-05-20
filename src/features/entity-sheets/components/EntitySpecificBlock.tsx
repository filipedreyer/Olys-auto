import type { EntitySheetProjection } from '../domain/entitySheetTypes'
import { formatFieldValue } from './EntityEditableFields'

type EntitySpecificBlockProps = {
  projection: EntitySheetProjection
}

export function EntitySpecificBlock({ projection }: EntitySpecificBlockProps) {
  return (
    <section className="entity-sheet-section entity-specific-block" aria-label={`Blocos específicos de ${projection.entityLabel}`}>
      <header>
        <small>Específico</small>
        <h3>{projection.entityLabel}</h3>
      </header>

      {projection.specificBlocks.map((block) => (
        <article key={block.key} className="entity-specific-block__item" data-entity={projection.kind}>
          <h4>{block.title}</h4>
          <p>{block.description}</p>
          <div className="entity-field-list">
            {block.fields.map((field) => (
              <div key={field.key} className="entity-field entity-field--future-contract" data-role={field.role}>
                <span>{field.label}</span>
                <strong>{formatFieldValue(field.value)}</strong>
              </div>
            ))}
          </div>
        </article>
      ))}
    </section>
  )
}

export function GoalSpecificBlock() {
  return null
}

export function ProjectSpecificBlock() {
  return null
}

export function TaskSpecificBlock() {
  return null
}

export function HabitSpecificBlock() {
  return null
}

export function RoutineSpecificBlock() {
  return null
}

export function AgendaEventSpecificBlock() {
  return null
}

export function ReminderSpecificBlock() {
  return null
}

export function NoteSpecificBlock() {
  return null
}

export function ListSpecificBlock() {
  return null
}

export function TemplateSpecificBlock() {
  return null
}
