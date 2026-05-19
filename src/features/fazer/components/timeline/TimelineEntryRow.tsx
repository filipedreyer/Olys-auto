import { OperationalRow } from '../OperationalRow'
import type { TimelineEntry } from '../../domain/timelineProjection'
import {
  describeTemporalWindow,
  getTimelineEntryContext,
  getTimelineEntrySignals,
} from './timelinePresentation'

type TimelineEntryRowProps = {
  entry: TimelineEntry
  detail?: string
  compact?: boolean
}

export function TimelineEntryRow({
  entry,
  detail = entry.detail,
  compact = true,
}: TimelineEntryRowProps) {
  return (
    <OperationalRow
      title={entry.title}
      meta={getTimelineEntryContext(entry)}
      detail={detail}
      state={entry.tone}
      entityType={entry.entityType ?? 'unclassified'}
      dateStart={entry.dateStart}
      startAt={entry.startAt}
      endAt={entry.endAt}
      durationMinutes={entry.durationMinutes}
      signals={getTimelineEntrySignals(entry)}
      size={compact ? 'compact' : 'regular'}
    />
  )
}

export function getTimelineTemporalLabel(entry: TimelineEntry) {
  return describeTemporalWindow(entry)
}
