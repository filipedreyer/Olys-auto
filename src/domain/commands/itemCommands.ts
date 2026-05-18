import {
  EntityChangeEvent,
  EntityCondition,
  EntityType,
  OlysItem,
  Priority,
} from '../entities/types'

const nowIso = () => new Date().toISOString()
const id = () => crypto.randomUUID()

export type CreateItemInput = {
  userId: string
  entityType: EntityType
  title: string
  description?: string
  priority?: Priority
  dateStart?: string
  dateEnd?: string
  startAt?: string
  endAt?: string
  durationMinutes?: number | null
  allDay?: boolean
  sourceContext?: string
}

export function createItem(items: OlysItem[], input: CreateItemInput): OlysItem[] {
  const createdAt = nowIso()
  const title = input.title.trim()

  if (!title) {
    return items
  }

  return [
    {
      id: id(),
      userId: input.userId,
      entityType: input.entityType,
      title,
      description: input.description,
      status: 'active',
      priority: input.priority ?? 0,
      dateStart: input.dateStart,
      dateEnd: input.dateEnd,
      startAt: input.startAt,
      endAt: input.endAt,
      durationMinutes: input.durationMinutes ?? null,
      allDay: input.allDay,
      sourceContext: input.sourceContext,
      createdAt,
      updatedAt: createdAt,
    },
    ...items,
  ]
}

export function updateItem(
  items: OlysItem[],
  idToUpdate: string,
  patch: Partial<Omit<OlysItem, 'id' | 'userId' | 'createdAt'>>,
): OlysItem[] {
  return items.map((item) =>
    item.id === idToUpdate
      ? {
          ...item,
          ...patch,
          updatedAt: nowIso(),
        }
      : item,
  )
}

export function completeItem(
  items: OlysItem[],
  idToComplete: string,
): OlysItem[] {
  const completedAt = nowIso()

  return updateItem(items, idToComplete, {
    status: 'completed',
    completedAt,
  })
}

export function archiveItem(items: OlysItem[], idToArchive: string): OlysItem[] {
  return updateItem(items, idToArchive, {
    status: 'archived',
    archivedAt: nowIso(),
  })
}

export function restoreItem(items: OlysItem[], idToRestore: string): OlysItem[] {
  return updateItem(items, idToRestore, {
    status: 'active',
    archivedAt: undefined,
    completedAt: undefined,
    deletedAt: undefined,
  })
}

export function softDeleteItem(
  items: OlysItem[],
  idToDelete: string,
): OlysItem[] {
  return updateItem(items, idToDelete, {
    status: 'deleted',
    deletedAt: nowIso(),
  })
}

export function applyEssentialProtected(
  conditions: EntityCondition[],
  item: OlysItem,
): EntityCondition[] {
  if (['goal', 'note', 'list', 'template', 'agenda'].includes(item.entityType)) {
    return conditions
  }

  const alreadyActive = conditions.some(
    (condition) =>
      condition.entityId === item.id &&
      condition.conditionType === 'essential_protected' &&
      !condition.removedAt,
  )

  if (alreadyActive) {
    return conditions
  }

  return [
    {
      id: id(),
      userId: item.userId,
      entityId: item.id,
      conditionType: 'essential_protected',
      createdBy: 'user',
      createdAt: nowIso(),
    },
    ...conditions,
  ]
}

export function removeEssentialProtected(
  conditions: EntityCondition[],
  entityId: string,
): EntityCondition[] {
  return conditions.map((condition) =>
    condition.entityId === entityId &&
    condition.conditionType === 'essential_protected' &&
    !condition.removedAt
      ? {
          ...condition,
          removedAt: nowIso(),
        }
      : condition,
  )
}

export function createEntityChangeEvent(
  userId: string,
  changeType: string,
  entityId?: string,
): EntityChangeEvent {
  return {
    id: id(),
    userId,
    entityId,
    changeType,
    sourceContext: 'local_p0',
    actor: 'user',
    createdAt: nowIso(),
  }
}
