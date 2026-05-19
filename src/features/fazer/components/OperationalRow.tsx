import {
  OperationalRowOlys,
  type OperationalItemAction,
  type OperationalItemDensity,
  type OperationalItemSignal,
  type OperationalItemVisualEntity,
  type OperationalItemVisualState,
} from '../../../design-system'
import { EntityType, OperationalRowState, Priority } from '../../../domain/entities/types'
import { formatTemporalContext } from './todayItemPresentation'

type OperationalRowProps = {
  title: string
  meta?: string
  detail?: string
  state?: OperationalRowState | OperationalItemVisualState
  size?: OperationalItemDensity
  entityType?: EntityType | 'unclassified'
  priority?: Priority
  dateStart?: string
  startAt?: string
  endAt?: string
  durationMinutes?: number | null
  signals?: readonly OperationalItemSignal[]
  actions?: readonly OperationalItemAction[]
}

export function OperationalRow({
  title,
  meta,
  detail,
  state = 'default',
  size = 'regular',
  entityType = 'unclassified',
  priority,
  dateStart,
  startAt,
  endAt,
  durationMinutes,
  signals = [],
  actions = [],
}: OperationalRowProps) {
  const temporalContext = buildTemporalContext(dateStart, startAt, endAt)
  const resolvedSignals = mergeSignals(signals, {
    state,
    priority,
    temporalContext,
    durationMinutes,
    detail,
  })

  return (
    <OperationalRowOlys
      entity={entityType as OperationalItemVisualEntity}
      title={title}
      context={meta}
      temporalContext={temporalContext}
      detail={detail}
      state={state}
      density={size}
      signals={resolvedSignals}
      actions={actions}
      className={`operational-row operational-row--${state} operational-row--${size}`}
    />
  )
}

function buildTemporalContext(dateStart?: string, startAt?: string, endAt?: string) {
  return formatTemporalContext({
    dateStart,
    startAt,
    endAt,
  } as Parameters<typeof formatTemporalContext>[0])
}

function mergeSignals(
  signals: readonly OperationalItemSignal[],
  input: {
    state: OperationalRowProps['state']
    priority?: Priority
    temporalContext?: string
    durationMinutes?: number | null
    detail?: string
  },
) {
  const nextSignals = [...signals]
  const hasSignal = (kind: OperationalItemSignal['kind']) =>
    nextSignals.some((signal) => signal.kind === kind)

  if (input.priority && input.priority >= 2 && !hasSignal('high_priority')) {
    nextSignals.push({ kind: 'high_priority' })
  }

  if (input.temporalContext && !hasSignal('scheduled')) {
    nextSignals.push({ kind: 'scheduled' })
  }

  if (input.state === 'blocked' && !hasSignal('blocked')) {
    nextSignals.push({ kind: 'blocked' })
  }

  if (
    (input.state === 'unknown' || input.durationMinutes === null) &&
    !hasSignal('unknown')
  ) {
    nextSignals.push({ kind: 'unknown' })
  }

  return nextSignals
}
