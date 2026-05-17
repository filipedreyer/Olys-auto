import { timelineLenses } from '../domain/timelineLens'

export function TimelineLensSwitcher() {
  return (
    <div className="timeline-lens-switcher">
      {timelineLenses.map((lens) => (
        <button key={lens} className="timeline-lens-switcher__button">
          {lens}
        </button>
      ))}
    </div>
  )
}
