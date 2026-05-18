import { EntityType, InboxItem, OlysItem } from '../../../domain/entities/types'
import { buildInboxProjection as buildProjection } from './inboxProjection'

export type InboxTriageAction =
  | 'keep'
  | 'convert'
  | 'complete'
  | 'postpone'
  | 'discard'

type InboxTriageInput = {
  action: InboxTriageAction
  targetType?: EntityType
}

const nowIso = () => new Date().toISOString()
const id = () => crypto.randomUUID()

export function createInboxItem(
  inboxItems: InboxItem[],
  input: {
    userId: string
    text: string
    sourceContext?: string
    suggestedType?: EntityType
    metadata?: Record<string, unknown>
  },
): InboxItem[] {
  const text = input.text.trim()

  if (!text) {
    return inboxItems
  }

  const createdAt = nowIso()

  return [
    {
      id: id(),
      userId: input.userId,
      text,
      status: 'new',
      sourceContext: input.sourceContext ?? 'capture',
      suggestedType: input.suggestedType,
      metadata: input.metadata,
      createdAt,
      updatedAt: createdAt,
    },
    ...inboxItems,
  ]
}

export function applyInboxTriage(
  inboxItems: InboxItem[],
  items: OlysItem[],
  idToTriage: string,
  input: InboxTriageInput,
): { inboxItems: InboxItem[]; items: OlysItem[] } {
  const inboxItem = inboxItems.find((item) => item.id === idToTriage)

  if (!inboxItem) {
    return { inboxItems, items }
  }

  if (input.action === 'convert') {
    const createdAt = nowIso()
    const convertedItem: OlysItem = {
      id: id(),
      userId: inboxItem.userId,
      entityType: input.targetType ?? 'task',
      title: inboxItem.text,
      status: 'active',
      priority: 0,
      durationMinutes: null,
      sourceContext: `inbox:${inboxItem.id}`,
      metadata: {
        inbox_source_id: inboxItem.id,
        inbox_source_context: inboxItem.sourceContext,
      },
      createdAt,
      updatedAt: createdAt,
    }

    return {
      items: [convertedItem, ...items],
      inboxItems: markInbox(inboxItems, idToTriage, {
        status: 'converted',
        convertedItemId: convertedItem.id,
      }),
    }
  }

  if (input.action === 'postpone') {
    const postponedAt = nowIso()

    return {
      items,
      inboxItems: markInbox(inboxItems, idToTriage, {
        status: 'postponed',
        postponedAt,
        needsRevisit: true,
        metadata: {
          ...inboxItem.metadata,
          inbox_postponed: true,
          inbox_postponed_at: postponedAt,
          inbox_needs_revisit: true,
          inbox_source_id: inboxItem.id,
        },
    }),
    }
  }

  if (input.action === 'complete') {
    return {
      items,
      inboxItems: markInbox(inboxItems, idToTriage, { status: 'completed' }),
    }
  }

  if (input.action === 'discard') {
    return {
      items,
      inboxItems: markInbox(inboxItems, idToTriage, { status: 'discarded' }),
    }
  }

  return {
    items,
    inboxItems: markInbox(inboxItems, idToTriage, { status: 'kept' }),
  }
}

export function buildInboxProjection(inboxItems: InboxItem[]) {
  return buildProjection(inboxItems)
}

function markInbox(
  inboxItems: InboxItem[],
  idToMark: string,
  patch: Partial<InboxItem>,
): InboxItem[] {
  return inboxItems.map((item) =>
    item.id === idToMark
      ? {
          ...item,
          ...patch,
          updatedAt: nowIso(),
        }
      : item,
  )
}
