import {
  CaptureDestinationId,
  captureDestinations,
} from '../domain/captureDestination'
import {
  buildCaptureGridRows,
  getCaptureDestinationPresentation,
} from './capturePresentation'

type CaptureGridProps = {
  selected: CaptureDestinationId
  onSelect: (destination: CaptureDestinationId) => void
}

export function CaptureGrid({ selected, onSelect }: CaptureGridProps) {
  const rows = buildCaptureGridRows(captureDestinations)

  return (
    <section className="capture-grid" aria-label="Grade de destino contextual">
      {rows.flat().map((destination) => {
        const presentation = getCaptureDestinationPresentation(destination.id)
        const selectedCell = selected === destination.id

        return (
          <button
            key={destination.id}
            type="button"
            className={[
              'capture-grid__cell',
              `capture-grid__cell--${destination.id}`,
              `capture-grid__cell--${presentation.emphasis}`,
              selectedCell ? 'capture-grid__cell--selected' : undefined,
            ]
              .filter(Boolean)
              .join(' ')}
            aria-pressed={selectedCell}
            data-destination={destination.id}
            data-emphasis={presentation.emphasis}
            onClick={() => onSelect(destination.id)}
          >
            <strong>{presentation.label}</strong>
            <span>{presentation.description}</span>
            {destination.id === 'reminder' ? <small>Data necessária</small> : null}
          </button>
        )
      })}
    </section>
  )
}
