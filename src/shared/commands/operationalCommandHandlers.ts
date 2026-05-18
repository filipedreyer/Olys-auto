import {
  closeDay as closeDayDomain,
  openDay as openDayDomain,
} from '../../domain/commands/dailySessionCommands'
import {
  createDependency as createDependencyDomain,
  removeDependency as removeDependencyDomain,
} from '../../domain/commands/dependencyCommands'
import {
  applyEssentialProtected as applyEssentialProtectedDomain,
  archiveItem as archiveItemDomain,
  completeItem as completeItemDomain,
  createItem as createItemDomain,
  CreateItemInput,
  removeEssentialProtected as removeEssentialProtectedDomain,
  restoreItem as restoreItemDomain,
  softDeleteItem as softDeleteItemDomain,
  updateItem as updateItemDomain,
} from '../../domain/commands/itemCommands'
import {
  createLink as createLinkDomain,
  removeLink as removeLinkDomain,
} from '../../domain/commands/linkCommands'
import {
  DailySession,
  DependencyEdge,
  DependencySource,
  DependencyType,
  EntityChangeEvent,
  EntityCondition,
  EntityLink,
  EntityType,
  InboxItem,
  LinkType,
  OlysItem,
} from '../../domain/entities/types'
import {
  applyInboxTriage,
  createInboxItem,
} from '../../features/inbox/domain/inboxTriage'
import { conditionsRepository } from '../repositories/conditionsRepository'
import { dailySessionsRepository } from '../repositories/dailySessionsRepository'
import { dependenciesRepository } from '../repositories/dependenciesRepository'
import { entityChangeEventsRepository } from '../repositories/entityChangeEventsRepository'
import { inboxRepository } from '../repositories/inboxRepository'
import { itemsRepository } from '../repositories/itemsRepository'
import { linksRepository } from '../repositories/linksRepository'

export type OperationalSnapshot = Awaited<ReturnType<typeof loadOperationalSnapshot>>

type PersistedEntity = { id: string; userId: string }

const nowIso = () => new Date().toISOString()
const id = () => crypto.randomUUID()

export async function loadOperationalSnapshot(userId: string) {
  const [items, inboxItems, conditions, links, dependencies, dailySessions] =
    await Promise.all([
      itemsRepository.list(userId),
      inboxRepository.list(userId),
      conditionsRepository.list(userId),
      linksRepository.list(userId),
      dependenciesRepository.list(userId),
      dailySessionsRepository.list(userId),
    ])

  return {
    userId,
    items,
    inboxItems,
    conditions,
    links,
    dependencies,
    dailySessions,
  }
}

export async function createItem(input: CreateItemInput) {
  const items = await itemsRepository.list(input.userId)
  const nextItems = createItemDomain(items, input)
  const created = findCreated(items, nextItems)

  if (created) {
    await itemsRepository.create(created)
    await emitChange({
      userId: input.userId,
      entityId: created.id,
      changeType: 'item_created',
      sourceContext: input.sourceContext ?? 'command:item',
    })
  }

  return loadOperationalSnapshot(input.userId)
}

export async function updateItem(
  userId: string,
  itemId: string,
  patch: Partial<Omit<OlysItem, 'id' | 'userId' | 'createdAt'>>,
) {
  const items = await itemsRepository.list(userId)
  const nextItems = updateItemDomain(items, itemId, patch)
  const updated = findUpdated(items, nextItems, itemId)

  if (updated) {
    await itemsRepository.update(updated)
    await emitChange({
      userId,
      entityId: updated.id,
      changeType: 'item_updated',
      sourceContext: 'command:item',
      metadata: {
        patchKeys: Object.keys(patch),
      },
    })
  }

  return loadOperationalSnapshot(userId)
}

export async function completeItem(userId: string, itemId: string) {
  const items = await itemsRepository.list(userId)
  const nextItems = completeItemDomain(items, itemId)
  const updated = findUpdated(items, nextItems, itemId)

  if (updated) {
    await itemsRepository.update(updated)
    await emitChange({
      userId,
      entityId: updated.id,
      changeType: 'item_completed',
      sourceContext: 'command:item',
    })
  }

  return loadOperationalSnapshot(userId)
}

export async function archiveItem(userId: string, itemId: string) {
  const items = await itemsRepository.list(userId)
  const nextItems = archiveItemDomain(items, itemId)
  const updated = findUpdated(items, nextItems, itemId)

  if (updated) {
    await itemsRepository.update(updated)
    await emitChange({
      userId,
      entityId: updated.id,
      changeType: 'item_archived',
      sourceContext: 'command:item',
    })
  }

  return loadOperationalSnapshot(userId)
}

export async function restoreItem(userId: string, itemId: string) {
  const items = await itemsRepository.list(userId)
  const nextItems = restoreItemDomain(items, itemId)
  const updated = findUpdated(items, nextItems, itemId)

  if (updated) {
    await itemsRepository.update(updated)
    await emitChange({
      userId,
      entityId: updated.id,
      changeType: 'item_restored',
      sourceContext: 'command:item',
    })
  }

  return loadOperationalSnapshot(userId)
}

export async function softDeleteItem(userId: string, itemId: string) {
  const items = await itemsRepository.list(userId)
  const nextItems = softDeleteItemDomain(items, itemId)
  const updated = findUpdated(items, nextItems, itemId)

  if (updated) {
    await itemsRepository.update(updated)
    await emitChange({
      userId,
      entityId: updated.id,
      changeType: 'item_deleted',
      sourceContext: 'command:item',
    })
  }

  return loadOperationalSnapshot(userId)
}

export async function applyEssentialProtected(userId: string, itemId: string) {
  const [items, conditions] = await Promise.all([
    itemsRepository.list(userId),
    conditionsRepository.list(userId),
  ])
  const item = items.find((candidate) => candidate.id === itemId)

  if (!item) {
    return loadOperationalSnapshot(userId)
  }

  const nextConditions = applyEssentialProtectedDomain(conditions, item)
  const created = findCreated(conditions, nextConditions)

  if (created) {
    await conditionsRepository.create(created)
    await emitChange({
      userId,
      entityId: item.id,
      changeType: 'essential_protected_applied',
      sourceContext: 'command:condition',
      metadata: {
        conditionId: created.id,
      },
    })
  }

  return loadOperationalSnapshot(userId)
}

export async function removeEssentialProtected(userId: string, itemId: string) {
  const conditions = await conditionsRepository.list(userId)
  const nextConditions = removeEssentialProtectedDomain(conditions, itemId)
  const updated = findFirstUpdated(conditions, nextConditions)

  if (updated) {
    await conditionsRepository.update(updated)
    await emitChange({
      userId,
      entityId: itemId,
      changeType: 'essential_protected_removed',
      sourceContext: 'command:condition',
      metadata: {
        conditionId: updated.id,
      },
    })
  }

  return loadOperationalSnapshot(userId)
}

export async function captureInput(input: {
  userId: string
  title: string
  type?: EntityType
}) {
  if (input.type) {
    return createItem({
      userId: input.userId,
      entityType: input.type,
      title: input.title,
      sourceContext: 'capture',
      durationMinutes: null,
    })
  }

  const inboxItems = await inboxRepository.list(input.userId)
  const nextInboxItems = createInboxItem(inboxItems, {
    userId: input.userId,
    text: input.title,
    sourceContext: 'capture',
  })
  const created = findCreated(inboxItems, nextInboxItems)

  if (created) {
    await inboxRepository.create(created)
  }

  return loadOperationalSnapshot(input.userId)
}

export async function convertInboxItem(
  userId: string,
  inboxId: string,
  targetType: EntityType = 'task',
) {
  const [inboxItems, items] = await Promise.all([
    inboxRepository.list(userId),
    itemsRepository.list(userId),
  ])
  const result = applyInboxTriage(inboxItems, items, inboxId, {
    action: 'convert',
    targetType,
  })
  const createdItem = findCreated(items, result.items)
  const updatedInbox = findUpdated(inboxItems, result.inboxItems, inboxId)

  await Promise.all([
    createdItem ? itemsRepository.create(createdItem) : Promise.resolve(),
    updatedInbox ? inboxRepository.update(updatedInbox) : Promise.resolve(),
  ])

  if (createdItem) {
    await emitChange({
      userId,
      entityId: createdItem.id,
      changeType: 'inbox_converted',
      sourceContext: 'command:inbox',
      metadata: {
        inboxId,
        targetType,
      },
    })
  }

  return loadOperationalSnapshot(userId)
}

export async function postponeInboxItem(userId: string, inboxId: string) {
  const [inboxItems, items] = await Promise.all([
    inboxRepository.list(userId),
    itemsRepository.list(userId),
  ])
  const result = applyInboxTriage(inboxItems, items, inboxId, {
    action: 'postpone',
  })
  const updatedInbox = findUpdated(inboxItems, result.inboxItems, inboxId)

  if (updatedInbox) {
    await inboxRepository.update(updatedInbox)
    await emitChange({
      userId,
      changeType: 'inbox_postponed',
      sourceContext: 'command:inbox',
      metadata: {
        inboxId,
      },
    })
  }

  return loadOperationalSnapshot(userId)
}

export async function triageInboxItem(
  userId: string,
  inboxId: string,
  action: 'keep' | 'complete' | 'discard',
) {
  const [inboxItems, items] = await Promise.all([
    inboxRepository.list(userId),
    itemsRepository.list(userId),
  ])
  const result = applyInboxTriage(inboxItems, items, inboxId, { action })
  const updatedInbox = findUpdated(inboxItems, result.inboxItems, inboxId)

  if (updatedInbox) {
    await inboxRepository.update(updatedInbox)
  }

  return loadOperationalSnapshot(userId)
}

export async function createDependency(input: {
  userId: string
  predecessorId: string
  successorId: string
  type?: DependencyType
  source?: DependencySource
  justification: string
  impact: string
}) {
  const [items, dependencies] = await Promise.all([
    itemsRepository.list(input.userId),
    dependenciesRepository.list(input.userId),
  ])
  const result = createDependencyDomain(items, dependencies, {
    userId: input.userId,
    predecessorId: input.predecessorId,
    successorId: input.successorId,
    type: input.type ?? 'blocks',
    source: input.source ?? 'manual',
    justification: input.justification,
    impact: input.impact,
  })
  const created = result.error ? undefined : findCreated(dependencies, result.edges)

  if (created) {
    await dependenciesRepository.create(created)
    await emitChange({
      userId: input.userId,
      changeType: 'dependency_created',
      sourceContext: 'command:dependency',
      metadata: {
        dependencyId: created.id,
        predecessorId: created.predecessorId,
        successorId: created.successorId,
        type: created.type,
        impact: created.impact,
      },
    })
  }

  return loadOperationalSnapshot(input.userId)
}

export async function removeDependency(userId: string, dependencyId: string) {
  const dependencies = await dependenciesRepository.list(userId)
  const nextDependencies = removeDependencyDomain(dependencies, dependencyId)
  const updated = findUpdated(dependencies, nextDependencies, dependencyId)

  if (updated) {
    await dependenciesRepository.update(updated)
  }

  return loadOperationalSnapshot(userId)
}

export async function createLink(input: {
  userId: string
  sourceEntityId: string
  targetEntityId: string
  linkType?: LinkType
}) {
  const links = await linksRepository.list(input.userId)
  const nextLinks = createLinkDomain(links, {
    userId: input.userId,
    sourceEntityId: input.sourceEntityId,
    targetEntityId: input.targetEntityId,
    linkType: input.linkType ?? 'relates_to',
  })
  const created = findCreated(links, nextLinks)

  if (created) {
    await linksRepository.create(created)
  }

  return loadOperationalSnapshot(input.userId)
}

export async function removeLink(userId: string, linkId: string) {
  const links = await linksRepository.list(userId)
  const nextLinks = removeLinkDomain(links, linkId)
  const updated = findUpdated(links, nextLinks, linkId)

  if (updated) {
    await linksRepository.update(updated)
  }

  return loadOperationalSnapshot(userId)
}

export async function openDay(userId: string, date: string) {
  const dailySessions = await dailySessionsRepository.list(userId)
  const nextDailySessions = openDayDomain(dailySessions, { userId, date })
  const created = findCreated(dailySessions, nextDailySessions)
  const updated =
    created ?? findSessionUpdated(dailySessions, nextDailySessions, userId, date)

  if (created) {
    await dailySessionsRepository.create(created)
  } else if (updated) {
    await dailySessionsRepository.update(updated)
  }

  if (updated) {
    await emitChange({
      userId,
      changeType: 'day_opened',
      sourceContext: 'command:daily-session',
      metadata: {
        sessionId: updated.id,
        date,
      },
    })
  }

  return loadOperationalSnapshot(userId)
}

export async function closeDay(
  userId: string,
  date: string,
  closingNote: string,
) {
  const dailySessions = await dailySessionsRepository.list(userId)
  const nextDailySessions = closeDayDomain(dailySessions, {
    userId,
    date,
    closingNote,
  })
  const created = findCreated(dailySessions, nextDailySessions)
  const updated =
    created ?? findSessionUpdated(dailySessions, nextDailySessions, userId, date)

  if (created) {
    await dailySessionsRepository.create(created)
  } else if (updated) {
    await dailySessionsRepository.update(updated)
  }

  if (updated) {
    await emitChange({
      userId,
      changeType: 'day_closed',
      sourceContext: 'command:daily-session',
      metadata: {
        sessionId: updated.id,
        date,
      },
    })
  }

  return loadOperationalSnapshot(userId)
}

function findCreated<T extends PersistedEntity>(
  previous: T[],
  next: T[],
): T | undefined {
  const previousIds = new Set(previous.map((entity) => entity.id))

  return next.find((entity) => !previousIds.has(entity.id))
}

function findUpdated<T extends PersistedEntity>(
  previous: T[],
  next: T[],
  entityId: string,
): T | undefined {
  const before = previous.find((entity) => entity.id === entityId)
  const after = next.find((entity) => entity.id === entityId)

  if (!before || !after || JSON.stringify(before) === JSON.stringify(after)) {
    return undefined
  }

  return after
}

function findFirstUpdated<T extends PersistedEntity>(
  previous: T[],
  next: T[],
): T | undefined {
  return next.find((entity) => findUpdated(previous, next, entity.id))
}

function findSessionUpdated(
  previous: DailySession[],
  next: DailySession[],
  userId: string,
  date: string,
) {
  const session = next.find(
    (candidate) => candidate.userId === userId && candidate.date === date,
  )

  return session ? findUpdated(previous, next, session.id) : undefined
}

function buildChangeEvent(input: {
  userId: string
  changeType: string
  entityId?: string
  sourceContext: string
  metadata?: Record<string, unknown>
}): EntityChangeEvent {
  return {
    id: id(),
    userId: input.userId,
    entityId: input.entityId,
    changeType: input.changeType,
    sourceContext: input.sourceContext,
    actor: 'user',
    createdAt: nowIso(),
    metadata: input.metadata,
  }
}

async function emitChange(input: {
  userId: string
  changeType: string
  entityId?: string
  sourceContext: string
  metadata?: Record<string, unknown>
}) {
  await entityChangeEventsRepository.create(buildChangeEvent(input))
}
