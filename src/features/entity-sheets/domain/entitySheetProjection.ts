import type {
  DependencyEdge,
  EntityChangeEvent,
  EntityCondition,
  EntityLink,
  OlysItem,
} from '../../../domain/entities/types'
import {
  buildDerivedFields,
  buildEditableFields,
  buildSpecificBlocks,
  entitySheetLabelByKind,
} from './entitySheetFields'
import type {
  EntitySheetAction,
  EntitySheetDependency,
  EntitySheetProjection,
  EntitySheetRelatedItem,
  EntitySheetRelation,
} from './entitySheetTypes'

export type BuildEntitySheetProjectionInput = {
  itemId: string
  items: readonly OlysItem[]
  conditions: readonly EntityCondition[]
  links: readonly EntityLink[]
  dependencies: readonly DependencyEdge[]
  events?: readonly EntityChangeEvent[]
}

export function buildEntitySheetProjection({
  itemId,
  items,
  conditions,
  links,
  dependencies,
  events = [],
}: BuildEntitySheetProjectionInput): EntitySheetProjection | undefined {
  const item = items.find((candidate) => candidate.id === itemId)

  if (!item) {
    return undefined
  }

  const activeLinks = links.filter(
    (link) =>
      !link.removedAt &&
      (link.sourceEntityId === item.id || link.targetEntityId === item.id),
  )
  const activeDependencies = dependencies.filter(
    (edge) =>
      !edge.removedAt &&
      (edge.predecessorId === item.id || edge.successorId === item.id),
  )
  const children = items.filter((candidate) => candidate.parentId === item.id)
  const parent = item.parentId ? items.find((candidate) => candidate.id === item.parentId) : undefined
  const relationSummary = buildRelationSummary(item, items, activeLinks)
  const dependencySummary = buildDependencySummary(item, items, activeDependencies)
  const itemConditions = conditions.filter(
    (condition) => condition.entityId === item.id && !condition.removedAt,
  )
  const missingInformation = buildMissingInformation(item, itemConditions)
  const risks = buildRisks(item, itemConditions, dependencySummary)

  return {
    item,
    kind: item.entityType,
    title: item.title,
    status: item.status,
    entityLabel: entitySheetLabelByKind[item.entityType],
    editableFields: buildEditableFields(item),
    derivedFields: buildDerivedFields(item, conditions),
    relationSummary,
    dependencySummary,
    compositionSummary: {
      parent: parent ? toRelatedItem(parent) : undefined,
      children: children.map(toRelatedItem),
    },
    historySummary: events
      .filter((event) => event.entityId === item.id)
      .map((event) => ({
        id: event.id,
        changeType: event.changeType,
        actor: event.actor,
        sourceContext: event.sourceContext,
        createdAt: event.createdAt,
      })),
    attachmentSummary: {
      status: 'future_contract',
      description: 'Anexos dependem de storage privado, metadata, permissões e governança.',
    },
    specificBlocks: buildSpecificBlocks({
      item,
      relatedProjects: countRelatedProjects(item, items, activeLinks),
      linkedGoalTitle: findLinkedGoalTitle(item, items, activeLinks),
      activeChildren: children.filter((child) => child.status === 'active').length,
      dependencyCount: dependencySummary.length,
      linkCount: relationSummary.length,
      missingInformation,
    }),
    risks,
    missingInformation,
    confirmationsRequired: buildConfirmations(item),
  }
}

function buildRelationSummary(
  item: OlysItem,
  items: readonly OlysItem[],
  links: readonly EntityLink[],
): EntitySheetRelation[] {
  return links.map((link) => {
    const direction = link.sourceEntityId === item.id ? 'outgoing' : 'incoming'
    const relatedEntityId = direction === 'outgoing' ? link.targetEntityId : link.sourceEntityId
    const related = items.find((candidate) => candidate.id === relatedEntityId)

    return {
      id: link.id,
      linkType: link.linkType,
      direction,
      relatedEntityId,
      relatedTitle: related?.title ?? 'Entidade relacionada indisponível',
      relatedEntityType: related?.entityType,
      createdAt: link.createdAt,
    }
  })
}

function buildDependencySummary(
  item: OlysItem,
  items: readonly OlysItem[],
  dependencies: readonly DependencyEdge[],
): EntitySheetDependency[] {
  return dependencies.map((edge) => {
    const predecessor = items.find((candidate) => candidate.id === edge.predecessorId)
    const successor = items.find((candidate) => candidate.id === edge.successorId)

    return {
      id: edge.id,
      role: edge.predecessorId === item.id ? 'predecessor' : 'successor',
      type: edge.type,
      status: edge.status,
      predecessorId: edge.predecessorId,
      successorId: edge.successorId,
      predecessorTitle: predecessor?.title ?? 'Predecessor indisponível',
      successorTitle: successor?.title ?? 'Sucessor indisponível',
      impact: edge.impact,
      justification: edge.justification,
      createdAt: edge.createdAt,
    }
  })
}

function buildMissingInformation(item: OlysItem, conditions: readonly EntityCondition[]) {
  const missing: string[] = []

  if (!item.description) {
    missing.push('Descrição não declarada')
  }

  if (item.entityType === 'reminder' && !item.dateStart && !item.startAt) {
    missing.push('Lembrete sem data ou horário suficiente')
  }

  if (
    ['task', 'agenda', 'event'].includes(item.entityType) &&
    item.durationMinutes === null
  ) {
    missing.push('Duração explicitamente unknown')
  }

  if (conditions.some((condition) => condition.conditionType === 'unknown')) {
    missing.push('Condição unknown ativa')
  }

  return missing
}

function buildRisks(
  item: OlysItem,
  conditions: readonly EntityCondition[],
  dependencies: readonly EntitySheetDependency[],
) {
  const risks: string[] = []

  if (conditions.some((condition) => condition.conditionType === 'blocked')) {
    risks.push('Bloqueio ativo')
  }

  if (conditions.some((condition) => condition.conditionType === 'overdue')) {
    risks.push('Atraso ativo')
  }

  if (dependencies.some((edge) => edge.status === 'active')) {
    risks.push('Dependência ativa com impacto')
  }

  if (item.status === 'paused') {
    risks.push('Item pausado')
  }

  return risks
}

function buildConfirmations(item: OlysItem): EntitySheetAction[] {
  const actions: EntitySheetAction[] = []

  if (item.status === 'active' || item.status === 'paused') {
    actions.push('complete', 'archive', 'softDelete')
  }

  if (item.status === 'archived' || item.status === 'completed') {
    actions.push('restore')
  }

  actions.push('applyEssentialProtected', 'removeEssentialProtected')

  return actions
}

function toRelatedItem(item: OlysItem): EntitySheetRelatedItem {
  return {
    id: item.id,
    title: item.title,
    entityType: item.entityType,
    status: item.status,
  }
}

function countRelatedProjects(
  item: OlysItem,
  items: readonly OlysItem[],
  links: readonly EntityLink[],
) {
  return items.filter(
    (candidate) =>
      candidate.entityType === 'project' &&
      (candidate.parentId === item.id ||
        links.some(
          (link) =>
            link.sourceEntityId === candidate.id ||
            link.targetEntityId === candidate.id,
        )),
  ).length
}

function findLinkedGoalTitle(
  item: OlysItem,
  items: readonly OlysItem[],
  links: readonly EntityLink[],
) {
  const goal = items.find(
    (candidate) =>
      candidate.entityType === 'goal' &&
      (item.parentId === candidate.id ||
        links.some(
          (link) =>
            (link.sourceEntityId === item.id && link.targetEntityId === candidate.id) ||
            (link.targetEntityId === item.id && link.sourceEntityId === candidate.id),
        )),
  )

  return goal?.title
}
