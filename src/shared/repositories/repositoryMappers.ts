import {
  DailySession,
  DependencyEdge,
  DependencySource,
  DependencyStatus,
  DependencyType,
  EntityChangeEvent,
  EntityCondition,
  EntityLink,
  EntityType,
  InboxItem,
  InboxStatus,
  ItemStatus,
  LinkType,
  OlysItem,
  Priority,
} from '../../domain/entities/types'

type Row = Record<string, unknown>

export function mapItemFromRow(row: Row): OlysItem {
  return {
    id: String(row.id),
    userId: String(row.user_id),
    entityType: row.entity_type as EntityType,
    title: String(row.title),
    description: optionalString(row.description),
    status: row.status as ItemStatus,
    priority: Number(row.priority ?? 0) as Priority,
    dateStart: optionalString(row.date_start),
    dateEnd: optionalString(row.date_end),
    startAt: optionalString(row.start_at),
    endAt: optionalString(row.end_at),
    durationMinutes:
      typeof row.duration_minutes === 'number'
        ? row.duration_minutes
        : row.duration_minutes === null
          ? null
          : undefined,
    allDay: Boolean(row.all_day),
    recurrenceRule: optionalString(row.recurrence_rule),
    parentId: optionalString(row.parent_id),
    sourceContext: optionalString(row.source_context),
    metadata: asMetadata(row.metadata),
    completedAt: optionalString(row.completed_at),
    archivedAt: optionalString(row.archived_at),
    deletedAt: optionalString(row.deleted_at),
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  }
}

export function mapItemToRow(item: OlysItem) {
  return {
    id: item.id,
    user_id: item.userId,
    entity_type: item.entityType,
    title: item.title,
    description: item.description,
    status: item.status,
    priority: item.priority,
    date_start: item.dateStart,
    date_end: item.dateEnd,
    start_at: item.startAt,
    end_at: item.endAt,
    duration_minutes: item.durationMinutes,
    all_day: item.allDay ?? false,
    recurrence_rule: item.recurrenceRule,
    parent_id: item.parentId,
    source_context: item.sourceContext,
    metadata: item.metadata ?? {},
    completed_at: item.completedAt,
    archived_at: item.archivedAt,
    deleted_at: item.deletedAt,
    created_at: item.createdAt,
    updated_at: item.updatedAt,
  }
}

export function mapInboxFromRow(row: Row): InboxItem {
  return {
    id: String(row.id),
    userId: String(row.user_id),
    text: String(row.text),
    attachmentRef: optionalString(row.attachment_ref),
    suggestedType: row.suggested_type as EntityType | undefined,
    status: row.status as InboxStatus,
    sourceContext: String(row.source_context ?? 'capture'),
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
    convertedItemId: optionalString(row.converted_item_id),
    postponedAt: optionalString(row.postponed_at),
    needsRevisit: Boolean(row.needs_revisit),
  }
}

export function mapInboxToRow(item: InboxItem) {
  return {
    id: item.id,
    user_id: item.userId,
    text: item.text,
    attachment_ref: item.attachmentRef,
    suggested_type: item.suggestedType,
    status: item.status,
    source_context: item.sourceContext,
    converted_item_id: item.convertedItemId,
    postponed_at: item.postponedAt,
    needs_revisit: item.needsRevisit ?? false,
    created_at: item.createdAt,
    updated_at: item.updatedAt,
  }
}

export function mapConditionFromRow(row: Row): EntityCondition {
  return {
    id: String(row.id),
    userId: String(row.user_id),
    entityId: String(row.entity_id),
    conditionType: row.condition_type as EntityCondition['conditionType'],
    value: optionalString(row.value),
    createdBy: row.created_by as EntityCondition['createdBy'],
    createdAt: String(row.created_at),
    removedAt: optionalString(row.removed_at),
  }
}

export function mapConditionToRow(condition: EntityCondition) {
  return {
    id: condition.id,
    user_id: condition.userId,
    entity_id: condition.entityId,
    condition_type: condition.conditionType,
    value: condition.value,
    created_by: condition.createdBy,
    created_at: condition.createdAt,
    removed_at: condition.removedAt,
  }
}

export function mapLinkFromRow(row: Row): EntityLink {
  return {
    id: String(row.id),
    userId: String(row.user_id),
    sourceEntityId: String(row.source_entity_id),
    targetEntityId: String(row.target_entity_id),
    linkType: row.link_type as LinkType,
    createdBy: row.created_by as EntityLink['createdBy'],
    createdAt: String(row.created_at),
    removedAt: optionalString(row.removed_at),
  }
}

export function mapLinkToRow(link: EntityLink) {
  return {
    id: link.id,
    user_id: link.userId,
    source_entity_id: link.sourceEntityId,
    target_entity_id: link.targetEntityId,
    link_type: link.linkType,
    created_by: link.createdBy,
    created_at: link.createdAt,
    removed_at: link.removedAt,
  }
}

export function mapDependencyFromRow(row: Row): DependencyEdge {
  return {
    id: String(row.id),
    userId: String(row.user_id),
    predecessorId: String(row.predecessor_id),
    successorId: String(row.successor_id),
    type: row.type as DependencyType,
    status: row.status as DependencyStatus,
    source: row.source as DependencySource,
    confidence:
      typeof row.confidence === 'number' ? row.confidence : undefined,
    justification: String(row.justification),
    impact: String(row.impact),
    createdAt: String(row.created_at),
    removedAt: optionalString(row.removed_at),
  }
}

export function mapDependencyToRow(edge: DependencyEdge) {
  return {
    id: edge.id,
    user_id: edge.userId,
    predecessor_id: edge.predecessorId,
    successor_id: edge.successorId,
    type: edge.type,
    status: edge.status,
    source: edge.source,
    confidence: edge.confidence,
    justification: edge.justification,
    impact: edge.impact,
    created_at: edge.createdAt,
    removed_at: edge.removedAt,
  }
}

export function mapDailySessionFromRow(row: Row): DailySession {
  return {
    id: String(row.id),
    userId: String(row.user_id),
    date: String(row.date),
    openedAt: optionalString(row.opened_at),
    closedAt: optionalString(row.closed_at),
    closingNote: optionalString(row.closing_note),
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  }
}

export function mapDailySessionToRow(session: DailySession) {
  return {
    id: session.id,
    user_id: session.userId,
    date: session.date,
    opened_at: session.openedAt,
    closed_at: session.closedAt,
    closing_note: session.closingNote,
    created_at: session.createdAt,
    updated_at: session.updatedAt,
  }
}

export function mapEntityChangeEventFromRow(row: Row): EntityChangeEvent {
  return {
    id: String(row.id),
    userId: String(row.user_id),
    entityId: optionalString(row.entity_id),
    changeType: String(row.change_type),
    sourceContext: String(row.source_context),
    actor: row.actor as EntityChangeEvent['actor'],
    createdAt: String(row.created_at),
    metadata: asMetadata(row.metadata),
  }
}

export function mapEntityChangeEventToRow(event: EntityChangeEvent) {
  return {
    id: event.id,
    user_id: event.userId,
    entity_id: event.entityId,
    change_type: event.changeType,
    source_context: event.sourceContext,
    actor: event.actor,
    metadata: event.metadata ?? {},
    created_at: event.createdAt,
  }
}

function optionalString(value: unknown) {
  return typeof value === 'string' ? value : undefined
}

function asMetadata(value: unknown): Record<string, unknown> | undefined {
  return value && typeof value === 'object'
    ? (value as Record<string, unknown>)
    : undefined
}
