import { OlysItem } from '../../../domain/entities/types'
import { OperationalRow } from './OperationalRow'

type OperationalCarouselProps = {
  items: OlysItem[]
  details: Record<string, string | undefined>
}

export function OperationalCarousel({ items, details }: OperationalCarouselProps) {
  return (
    <div className="operational-carousel" aria-label="Fluxo operacional agora">
      {items.map((item, index) => (
        <OperationalRow
          key={item.id}
          title={item.title}
          meta={item.sourceContext}
          detail={details[item.id]}
          entityType={item.entityType}
          priority={item.priority}
          dateStart={item.dateStart}
          startAt={item.startAt}
          endAt={item.endAt}
          durationMinutes={item.durationMinutes}
          size={resolveSize(index)}
        />
      ))}
    </div>
  )
}

function resolveSize(index: number) {
  if (index === 0) {
    return 'featured'
  }

  if (index === 1 || index === 2) {
    return 'secondary'
  }

  return 'tertiary'
}
