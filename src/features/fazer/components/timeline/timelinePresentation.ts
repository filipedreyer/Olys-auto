import type { OperationalItemSignal } from '../../../../design-system'
import type { TimelineEntry } from '../../domain/timelineProjection'

export function getTimelineEntryContext(entry: TimelineEntry) {
  if (entry.entryKind === 'dependency') {
    return entry.dependencyStatus
      ? `Dependência ${entry.dependencyStatus}`
      : 'Dependência operacional'
  }

  return entry.sourceContext ?? entry.status ?? 'Campo temporal'
}

export function getTimelineEntrySignals(entry: TimelineEntry): OperationalItemSignal[] {
  const signals: OperationalItemSignal[] = []

  if (entry.entryKind === 'dependency') {
    signals.push({ kind: 'dependency' })

    if (entry.tone === 'blocked') {
      signals.push({ kind: 'blocked' })
    }

    return signals
  }

  if (entry.startAt || entry.dateStart) {
    signals.push({ kind: 'scheduled' })
  }

  if (entry.durationMinutes === null || entry.durationMinutes === undefined) {
    signals.push({ kind: 'unknown' })
  }

  return signals
}

export function describeTemporalWindow(entry: TimelineEntry) {
  if (entry.startAt && entry.endAt) {
    return [entry.dateStart, `${entry.startAt}-${entry.endAt}`].filter(Boolean).join(' ')
  }

  if (entry.startAt) {
    return [entry.dateStart, entry.startAt].filter(Boolean).join(' ')
  }

  if (entry.dateStart && entry.dateEnd) {
    return `${entry.dateStart} até ${entry.dateEnd}`
  }

  return entry.dateStart ?? entry.label
}

export function describeCapacityLoad(entry: TimelineEntry) {
  return typeof entry.durationMinutes === 'number'
    ? `${entry.durationMinutes} min declarados`
    : 'Carga unknown; duração não inventada'
}
