import {
  CaptureDestinationId,
  captureDestinations,
} from '../domain/captureDestination'

type CaptureGridProps = {
  selected: CaptureDestinationId
  onSelect: (destination: CaptureDestinationId) => void
}

export function CaptureGrid({ selected, onSelect }: CaptureGridProps) {
  return (
    <section className="capture-grid" aria-label="Destino contextual">
      {captureDestinations.map((destination) => (
        <button
          key={destination.id}
          type="button"
          className={`capture-grid__cell capture-grid__cell--${destination.id}`}
          aria-pressed={selected === destination.id}
          onClick={() => onSelect(destination.id)}
        >
          <span>{destination.id === 'inbox' ? 'Entrada' : 'Destino'}</span>
          {destination.label}
        </button>
      ))}
    </section>
  )
}
