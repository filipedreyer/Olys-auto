import type { MemorySubarea } from '../domain/memoryProjection'
import { subareaTone } from './memoryPresentation'

type MemorySubareaGridProps = {
  subareas: MemorySubarea[]
}

export function MemorySubareaGrid({ subareas }: MemorySubareaGridProps) {
  return (
    <section className="memory-subarea-grid" aria-label="Subáreas da Memória">
      {subareas
        .filter((subarea) => subarea.code !== 'RECOVERY')
        .map((subarea) => (
          <article
            key={subarea.id}
            className="memory-subarea-card"
            data-status={subarea.status}
            data-tone={subareaTone(subarea)}
          >
            <span>{subarea.code}</span>
            <strong>
              {subarea.label} <em>{subarea.count}</em>
            </strong>
            <p>{subarea.description}</p>
          </article>
        ))}
    </section>
  )
}
