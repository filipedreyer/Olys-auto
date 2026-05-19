import type { CSSProperties } from 'react'
import type { TimelineProjection } from '../../domain/timelineProjection'

type TimelineDependencyLensProps = {
  projection: TimelineProjection
}

export function TimelineDependencyLens({ projection }: TimelineDependencyLensProps) {
  return (
    <section className="timeline-dependency-lens" aria-label="Lente de dependências">
      <header>
        <div>
          <small>Dependências</small>
          <h2>Cadeia de consequência operacional</h2>
        </div>
        <p>{projection.readings.dependencies.summary}</p>
      </header>

      <div className="timeline-dependency-lens__chain">
        {projection.entries.map((entry, index) => (
          <article
            key={entry.id}
            className="timeline-dependency-node"
            data-state={entry.tone}
            data-status={entry.dependencyStatus}
            style={{ '--timeline-depth': Math.min(index, 3) } as CSSProperties}
          >
            <span>Sequência {index + 1}</span>
            <div className="timeline-dependency-node__flow">
              <strong>{entry.predecessorTitle ?? entry.title}</strong>
              <span aria-hidden="true">→</span>
              <strong>{entry.successorTitle ?? 'Sucessor indisponível'}</strong>
            </div>
            <p>{entry.dependencyType ?? 'dependência'}: {entry.dependencyImpact ?? entry.detail}</p>
            <small>{entry.dependencyStatus ?? 'needs_review'}</small>
          </article>
        ))}
      </div>
    </section>
  )
}
