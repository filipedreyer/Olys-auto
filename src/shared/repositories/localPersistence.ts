import {
  seedConditions,
  seedDependencyEdges,
  seedEntityLinks,
  seedInboxItems,
  seedItems,
} from '../../domain/entities/seedData'
import {
  DailySession,
  DependencyEdge,
  EntityChangeEvent,
  EntityCondition,
  EntityLink,
  InboxItem,
  OlysItem,
} from '../../domain/entities/types'

type LocalPersistenceState = {
  items: OlysItem[]
  inboxItems: InboxItem[]
  conditions: EntityCondition[]
  links: EntityLink[]
  dependencies: DependencyEdge[]
  dailySessions: DailySession[]
  entityChangeEvents: EntityChangeEvent[]
}

const localState: LocalPersistenceState = {
  items: [...seedItems],
  inboxItems: [...seedInboxItems],
  conditions: [...seedConditions],
  links: [...seedEntityLinks],
  dependencies: [...seedDependencyEdges],
  dailySessions: [],
  entityChangeEvents: [],
}

export function getLocalState() {
  return localState
}

export function replaceLocalState(patch: Partial<LocalPersistenceState>) {
  Object.assign(localState, patch)
}
