import type {
  OperationalItemDensity,
  OperationalItemSignal,
  OperationalItemVisualState,
} from '../../../design-system'
import type { OlysItem, Priority } from '../../../domain/entities/types'

export type TodayItemViewModel = {
  title: string
  context?: string
  temporalContext?: string
  detail?: string
  state: OperationalItemVisualState
  density: OperationalItemDensity
  entity: OlysItem['entityType']
  signals: OperationalItemSignal[]
}

export function toTodayItemViewModel(input: {
  item: OlysItem
  detail?: string
  state?: OperationalItemVisualState
  density?: OperationalItemDensity
  context?: string
  reason?: 'now' | 'later' | 'attention' | 'blocked' | 'completed'
}): TodayItemViewModel {
  const temporalContext = formatTemporalContext(input.item)
  const detail = input.detail
  const reason = input.reason ?? 'later'

  return {
    title: input.item.title,
    context: input.context ?? input.item.sourceContext,
    temporalContext,
    detail,
    state: input.state ?? resolveVisualState(input.item),
    density: input.density ?? 'regular',
    entity: input.item.entityType,
    signals: buildSignals({
      priority: input.item.priority,
      state: input.state ?? resolveVisualState(input.item),
      temporalContext,
      durationMinutes: input.item.durationMinutes,
      detail,
      reason,
    }),
  }
}

export function formatTemporalContext(item: OlysItem) {
  if (item.startAt && item.endAt) {
    return [item.dateStart, `${item.startAt}-${item.endAt}`].filter(Boolean).join(' ')
  }

  if (item.startAt) {
    return [item.dateStart, item.startAt].filter(Boolean).join(' ')
  }

  return item.dateStart
}

function resolveVisualState(item: OlysItem): OperationalItemVisualState {
  if (item.status === 'completed') {
    return 'completed'
  }

  if (item.status === 'paused') {
    return 'paused'
  }

  return 'default'
}

function buildSignals(input: {
  priority: Priority
  state: OperationalItemVisualState
  temporalContext?: string
  durationMinutes?: number | null
  detail?: string
  reason: 'now' | 'later' | 'attention' | 'blocked' | 'completed'
}) {
  const signals: OperationalItemSignal[] = []

  if (input.priority >= 2) {
    signals.push({ kind: 'high_priority' })
  }

  if (input.temporalContext) {
    signals.push({ kind: 'scheduled' })
  }

  if (input.state === 'blocked' || input.reason === 'blocked') {
    signals.push({ kind: 'blocked' }, { kind: 'dependency' })
    return signals
  }

  if (
    input.reason === 'attention' &&
    (input.durationMinutes === null || input.detail?.toLowerCase().includes('unknown'))
  ) {
    signals.push({ kind: 'unknown' })
  }

  return signals
}
