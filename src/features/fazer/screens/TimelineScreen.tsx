import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useOperationalStore } from '../../../shared/store/operationalStore'
import { TimelineHeader } from '../components/timeline/TimelineHeader'
import { TimelineReadings } from '../components/timeline/TimelineReadings'
import { TimelineSurface } from '../components/timeline/TimelineSurface'
import { TimelineLens } from '../domain/timelineLens'
import { buildTimelineProjection } from '../domain/timelineProjection'

export function TimelineScreen() {
  const items = useOperationalStore((state) => state.items)
  const conditions = useOperationalStore((state) => state.conditions)
  const dependencies = useOperationalStore((state) => state.dependencies)
  const [searchParams, setSearchParams] = useSearchParams()
  const [activeLens, setActiveLens] = useState<TimelineLens>(
    resolveLens(searchParams.get('lens')),
  )
  const projection = buildTimelineProjection(
    items,
    conditions,
    dependencies,
    activeLens,
  )

  function handleLensChange(lens: TimelineLens) {
    setActiveLens(lens)
    setSearchParams({ lens })
  }

  return (
    <section className="timeline-screen timeline-field">
      <TimelineHeader
        projection={projection}
        activeLens={activeLens}
        onLensChange={handleLensChange}
      />
      <TimelineReadings readings={projection.readings} />
      <TimelineSurface projection={projection} />
    </section>
  )
}

function resolveLens(value: string | null): TimelineLens {
  if (value === 'calendar' || value === 'capacity' || value === 'dependency') {
    return value
  }

  return 'capacity'
}
