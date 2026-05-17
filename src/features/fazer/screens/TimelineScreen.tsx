import { TimelineLensSwitcher } from '../components/TimelineLensSwitcher'
import { timelineProjection } from '../domain/timelineProjection'

export function TimelineScreen() {
  return (
    <section className="timeline-screen">
      <header className="timeline-screen__header">
        <div>
          <small>Timeline</small>
          <h1>Capacidade</h1>
        </div>
      </header>

      <TimelineLensSwitcher />

      <section className="timeline-screen__surface">
        {timelineProjection.map((item) => (
          <article
            key={item.label}
            className={`timeline-card timeline-card--${item.lens}`}
          >
            <strong>{item.label}</strong>
            <span>{item.description}</span>
          </article>
        ))}
      </section>
    </section>
  )
}
