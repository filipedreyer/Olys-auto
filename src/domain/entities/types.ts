export type EntityType =
  | 'goal'
  | 'project'
  | 'task'
  | 'habit'
  | 'routine'
  | 'agenda'
  | 'event'
  | 'reminder'
  | 'note'
  | 'list'
  | 'template'

export const ENTITY_TYPES = [
  'goal',
  'project',
  'task',
  'habit',
  'routine',
  'agenda',
  'event',
  'reminder',
  'note',
  'list',
  'template',
] as const satisfies readonly EntityType[]

export type ItemStatus =
  | 'active'
  | 'paused'
  | 'completed'
  | 'archived'
  | 'deleted'

export type ConditionType =
  | 'essential_protected'
  | 'blocked'
  | 'recurring'
  | 'overdue'
  | 'attention'
  | 'unknown'
  | 'has_time'
  | 'has_date'
  | 'no_time'
  | 'no_date'

export type DependencyType = 'blocks' | 'precedes' | 'requires' | 'enables'

export const DEPENDENCY_TYPES = [
  'blocks',
  'precedes',
  'requires',
  'enables',
] as const satisfies readonly DependencyType[]

export type DependencyStatus =
  | 'active'
  | 'candidate'
  | 'inactive'
  | 'needs_review'

export type DependencySource = 'manual' | 'ia_suggested' | 'imported' | 'template'

export type LinkType =
  | 'relates_to'
  | 'supports'
  | 'belongs_to'
  | 'references'
  | 'derived_from'

export const LINK_TYPES = [
  'relates_to',
  'supports',
  'belongs_to',
  'references',
  'derived_from',
] as const satisfies readonly LinkType[]

export type InboxStatus =
  | 'new'
  | 'kept'
  | 'converted'
  | 'completed'
  | 'postponed'
  | 'discarded'
  | 'archived'
  | 'error'

export type TodayLane =
  | 'now'
  | 'later'
  | 'attention'
  | 'blocked'
  | 'paused'
  | 'completed'

export type CapacityState =
  | 'fits'
  | 'balanced'
  | 'near_limit'
  | 'exceeded'
  | 'partial'
  | 'unknown'

export type DirectionState =
  | 'aligned'
  | 'present'
  | 'weak'
  | 'absent'
  | 'unknown'

export type OperationalRowState =
  | 'default'
  | 'attention'
  | 'completed'
  | 'blocked'
  | 'paused'

export type Priority = 0 | 1 | 2 | 3

export type OlysItem = {
  id: string
  userId: string
  entityType: EntityType
  title: string
  description?: string
  status: ItemStatus
  priority: Priority
  dateStart?: string
  dateEnd?: string
  startAt?: string
  endAt?: string
  durationMinutes?: number | null
  allDay?: boolean
  recurrenceRule?: string
  parentId?: string
  sourceContext?: string
  metadata?: Record<string, unknown>
  completedAt?: string
  archivedAt?: string
  deletedAt?: string
  createdAt: string
  updatedAt: string
}

export type InboxItem = {
  id: string
  userId: string
  text: string
  attachmentRef?: string
  suggestedType?: EntityType
  status: InboxStatus
  sourceContext: string
  metadata?: Record<string, unknown>
  createdAt: string
  updatedAt: string
  convertedItemId?: string
  postponedAt?: string
  needsRevisit?: boolean
}

export type EntityCondition = {
  id: string
  userId: string
  entityId: string
  conditionType: ConditionType
  value?: string
  createdBy: 'user' | 'system' | 'ia'
  createdAt: string
  removedAt?: string
}

export type EntityLink = {
  id: string
  userId: string
  sourceEntityId: string
  targetEntityId: string
  linkType: LinkType
  createdBy: 'user' | 'system' | 'ia'
  createdAt: string
  removedAt?: string
}

export type DependencyEdge = {
  id: string
  userId: string
  predecessorId: string
  successorId: string
  type: DependencyType
  status: DependencyStatus
  source: DependencySource
  confidence?: number
  justification: string
  impact: string
  createdAt: string
  removedAt?: string
}

export type EntityChangeEvent = {
  id: string
  userId: string
  entityId?: string
  changeType: string
  sourceContext: string
  actor: 'user' | 'system' | 'ia'
  createdAt: string
  metadata?: Record<string, unknown>
}

export type DailySession = {
  id: string
  userId: string
  date: string
  openedAt?: string
  closedAt?: string
  openingReading?: Record<string, unknown>
  capacityReading?: Record<string, unknown>
  directionReading?: Record<string, unknown>
  attentionSummary?: string
  sessionStatus?: 'open' | 'closed'
  closingNote?: string
  createdAt: string
  updatedAt: string
}
