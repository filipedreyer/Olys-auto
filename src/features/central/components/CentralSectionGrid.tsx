import { centralSections } from '../domain/centralPresentation'
import { CentralSectionCard } from './CentralSectionCard'

export function CentralSectionGrid() {
  return (
    <section className="central-section-grid" aria-label="Mapa da Central CTR00 a CTR07">
      {centralSections.map((section) => (
        <CentralSectionCard key={section.id} section={section} />
      ))}
    </section>
  )
}
