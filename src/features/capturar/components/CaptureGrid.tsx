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
          className="capture-chip"
          aria-pressed={selected === destination.id}
          onClick={() => onSelect(destination.id)}
        >
          {destination.label}
        </button>
      ))}
    </section>
  )
}
