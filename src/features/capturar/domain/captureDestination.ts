import { EntityType } from '../../../domain/entities/types'

export type CaptureDestinationId = 'inbox' | EntityType

export type CaptureDestination = {
  id: CaptureDestinationId
  label: string
  entityType?: EntityType
}

export type CaptureInputDraft = {
  title: string
  destination?: CaptureDestinationId
  dateStart?: string
  startAt?: string
}

export type ResolvedCaptureTarget =
  | {
      kind: 'inbox'
      suggestedType?: EntityType
      reason?: string
    }
  | {
      kind: 'item'
      entityType: EntityType
    }

export const captureDestinations: CaptureDestination[] = [
  { id: 'inbox', label: 'Inbox' },
  { id: 'goal', label: 'Meta', entityType: 'goal' },
  { id: 'project', label: 'Projeto', entityType: 'project' },
  { id: 'task', label: 'Tarefa', entityType: 'task' },
  { id: 'agenda', label: 'Agenda', entityType: 'agenda' },
  { id: 'note', label: 'Nota', entityType: 'note' },
  { id: 'list', label: 'Lista', entityType: 'list' },
  { id: 'habit', label: 'Habito', entityType: 'habit' },
  { id: 'routine', label: 'Rotina', entityType: 'routine' },
  { id: 'template', label: 'Template', entityType: 'template' },
  { id: 'event', label: 'Evento', entityType: 'event' },
  { id: 'reminder', label: 'Lembrete', entityType: 'reminder' },
]

export function resolveCaptureTarget(
  draft: CaptureInputDraft,
): ResolvedCaptureTarget {
  const destination = draft.destination ?? 'inbox'

  if (destination === 'inbox') {
    return {
      kind: 'inbox',
    }
  }

  if (destination === 'reminder' && !hasReminderSufficiency(draft)) {
    return {
      kind: 'inbox',
      suggestedType: 'reminder',
      reason: 'reminder_requires_date_or_time',
    }
  }

  return {
    kind: 'item',
    entityType: destination,
  }
}

function hasReminderSufficiency(draft: CaptureInputDraft) {
  return Boolean(draft.dateStart || draft.startAt)
}
