import { NavLink } from 'react-router-dom'
import { TimelineLensSwitcher } from '../TimelineLensSwitcher'
import type { TimelineProjection } from '../../domain/timelineProjection'
import type { TimelineLens } from '../../domain/timelineLens'

type TimelineHeaderProps = {
  projection: TimelineProjection
  activeLens: TimelineLens
  onLensChange: (lens: TimelineLens) => void
}

export function TimelineHeader({
  projection,
  activeLens,
  onLensChange,
}: TimelineHeaderProps) {
  return (
    <header className="timeline-header">
      <div className="timeline-header__topline">
        <nav className="fazer-tabs" aria-label="Fazer">
          <NavLink to="/fazer/hoje">Hoje</NavLink>
          <NavLink to="/fazer/timeline">Timeline</NavLink>
        </nav>
        <TimelineLensSwitcher activeLens={activeLens} onChange={onLensChange} />
      </div>

      <div className="timeline-header__body">
        <div>
          <small>Timeline</small>
          <h1>{projection.title}</h1>
          <p>{projection.readings.direction.statement}</p>
        </div>
      </div>
    </header>
  )
}
