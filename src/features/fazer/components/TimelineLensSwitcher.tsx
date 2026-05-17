import { TimelineLens, timelineLenses } from '../domain/timelineLens'

type TimelineLensSwitcherProps = {
  activeLens: TimelineLens
  onChange: (lens: TimelineLens) => void
}

export function TimelineLensSwitcher({
  activeLens,
  onChange,
}: TimelineLensSwitcherProps) {
  return (
    <div className="timeline-lens-switcher" role="tablist" aria-label="Lentes">
      {timelineLenses.map((lens) => (
        <button
          key={lens.id}
          type="button"
          role="tab"
          aria-selected={activeLens === lens.id}
          className="timeline-lens-switcher__button"
          onClick={() => onChange(lens.id)}
        >
          {lens.label}
        </button>
      ))}
    </div>
  )
}
