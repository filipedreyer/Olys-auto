import { OperationalCardOlys } from '../../../design-system'
import type { OlysItem } from '../../../domain/entities/types'
import { toTodayItemViewModel } from './todayItemPresentation'

type OperationalCarouselProps = {
  items: OlysItem[]
  details: Record<string, string | undefined>
}

export function OperationalCarousel({ items, details }: OperationalCarouselProps) {
  return (
    <div className="operational-carousel now-operational-carousel" aria-label="Fluxo operacional agora">
      {items.map((item, index) => {
        const viewModel = toTodayItemViewModel({
          item,
          detail: details[item.id],
          density: resolveSize(index),
          reason: 'now',
        })

        return (
          <OperationalCardOlys
            key={item.id}
            entity={viewModel.entity}
            title={viewModel.title}
            context={viewModel.context}
            temporalContext={viewModel.temporalContext}
            detail={viewModel.detail}
            state={viewModel.state}
            density={viewModel.density}
            signals={viewModel.signals}
            className={`operational-row operational-row--${viewModel.state} operational-row--${viewModel.density}`}
          />
        )
      })}
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
