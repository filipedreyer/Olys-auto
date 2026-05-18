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
  DependencySource,
  DependencyType,
  EntityType,
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
import { inboxRepository } from '../repositories/inboxRepository'
import { itemsRepository } from '../repositories/itemsRepository'
import { linksRepository } from '../repositories/linksRepository'

export type OperationalSnapshot = Awaited<ReturnType<typeof loadOperationalSnapshot>>

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

  await itemsRepository.replaceAll(input.userId, nextItems)
  return loadOperationalSnapshot(input.userId)
}

export async function updateItem(
  userId: string,
  id: string,
  patch: Partial<Omit<OlysItem, 'id' | 'userId' | 'createdAt'>>,
) {
  const items = await itemsRepository.list(userId)
  const nextItems = updateItemDomain(items, id, patch)

  await itemsRepository.replaceAll(userId, nextItems)
  return loadOperationalSnapshot(userId)
}

export async function completeItem(userId: string, id: string) {
  const items = await itemsRepository.list(userId)
  const nextItems = completeItemDomain(items, id)

  await itemsRepository.replaceAll(userId, nextItems)
  return loadOperationalSnapshot(userId)
}

export async function archiveItem(userId: string, id: string) {
  const items = await itemsRepository.list(userId)
  const nextItems = archiveItemDomain(items, id)

  await itemsRepository.replaceAll(userId, nextItems)
  return loadOperationalSnapshot(userId)
}

export async function restoreItem(userId: string, id: string) {
  const items = await itemsRepository.list(userId)
  const nextItems = restoreItemDomain(items, id)

  await itemsRepository.replaceAll(userId, nextItems)
  return loadOperationalSnapshot(userId)
}

export async function softDeleteItem(userId: string, id: string) {
  const items = await itemsRepository.list(userId)
  const nextItems = softDeleteItemDomain(items, id)

  await itemsRepository.replaceAll(userId, nextItems)
  return loadOperationalSnapshot(userId)
}

export async function applyEssentialProtected(userId: string, id: string) {
  const [items, conditions] = await Promise.all([
    itemsRepository.list(userId),
    conditionsRepository.list(userId),
  ])
  const item = items.find((candidate) => candidate.id === id)

  if (!item) {
    return loadOperationalSnapshot(userId)
  }

  const nextConditions = applyEssentialProtectedDomain(conditions, item)

  await conditionsRepository.replaceAll(userId, nextConditions)
  return loadOperationalSnapshot(userId)
}

export async function removeEssentialProtected(userId: string, id: string) {
  const conditions = await conditionsRepository.list(userId)
  const nextConditions = removeEssentialProtectedDomain(conditions, id)

  await conditionsRepository.replaceAll(userId, nextConditions)
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

  await inboxRepository.replaceAll(input.userId, nextInboxItems)
  return loadOperationalSnapshot(input.userId)
}

export async function convertInboxItem(
  userId: string,
  id: string,
  targetType: EntityType = 'task',
) {
  const [inboxItems, items] = await Promise.all([
    inboxRepository.list(userId),
    itemsRepository.list(userId),
  ])
  const result = applyInboxTriage(inboxItems, items, id, {
    action: 'convert',
    targetType,
  })

  await Promise.all([
    inboxRepository.replaceAll(userId, result.inboxItems),
    itemsRepository.replaceAll(userId, result.items),
  ])
  return loadOperationalSnapshot(userId)
}

export async function postponeInboxItem(userId: string, id: string) {
  const [inboxItems, items] = await Promise.all([
    inboxRepository.list(userId),
    itemsRepository.list(userId),
  ])
  const result = applyInboxTriage(inboxItems, items, id, {
    action: 'postpone',
  })

  await inboxRepository.replaceAll(userId, result.inboxItems)
  return loadOperationalSnapshot(userId)
}

export async function triageInboxItem(
  userId: string,
  id: string,
  action: 'keep' | 'complete' | 'discard',
) {
  const [inboxItems, items] = await Promise.all([
    inboxRepository.list(userId),
    itemsRepository.list(userId),
  ])
  const result = applyInboxTriage(inboxItems, items, id, { action })

  await inboxRepository.replaceAll(userId, result.inboxItems)
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

  if (!result.error) {
    await dependenciesRepository.replaceAll(input.userId, result.edges)
  }

  return loadOperationalSnapshot(input.userId)
}

export async function removeDependency(userId: string, id: string) {
  const dependencies = await dependenciesRepository.list(userId)
  const nextDependencies = removeDependencyDomain(dependencies, id)

  await dependenciesRepository.replaceAll(userId, nextDependencies)
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

  await linksRepository.replaceAll(input.userId, nextLinks)
  return loadOperationalSnapshot(input.userId)
}

export async function removeLink(userId: string, id: string) {
  const links = await linksRepository.list(userId)
  const nextLinks = removeLinkDomain(links, id)

  await linksRepository.replaceAll(userId, nextLinks)
  return loadOperationalSnapshot(userId)
}

export async function openDay(userId: string, date: string) {
  const dailySessions = await dailySessionsRepository.list(userId)
  const nextDailySessions = openDayDomain(dailySessions, { userId, date })

  await dailySessionsRepository.replaceAll(userId, nextDailySessions)
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

  await dailySessionsRepository.replaceAll(userId, nextDailySessions)
  return loadOperationalSnapshot(userId)
}
