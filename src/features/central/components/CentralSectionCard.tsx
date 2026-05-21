import type { CentralSectionDefinition } from '../domain/centralPresentation'
import { centralStatusLabels } from '../domain/centralPresentation'

type CentralSectionCardProps = {
  section: CentralSectionDefinition
}

export function CentralSectionCard({ section }: CentralSectionCardProps) {
  return (
    <article className="central-section-card" data-status={section.status}>
      <small>
        {section.id} · {centralStatusLabels[section.status]}
      </small>
      <h3>{section.title}</h3>
      <p>{section.description}</p>
      <span>{section.limit}</span>
    </article>
  )
}
