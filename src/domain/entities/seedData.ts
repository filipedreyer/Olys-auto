import {
  DependencyEdge,
  EntityCondition,
  EntityLink,
  InboxItem,
  OlysItem,
} from './types'

export const seedUserId = 'local-user'
const now = '2026-05-17T12:00:00.000Z'

export const seedItems: OlysItem[] = [
  {
    id: 'item-release-review',
    userId: seedUserId,
    entityType: 'task',
    title: 'Revisar estrutura operacional do release',
    status: 'active',
    priority: 3,
    dateStart: '2026-05-17',
    durationMinutes: null,
    sourceContext: 'Release 1',
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'item-today-projections',
    userId: seedUserId,
    entityType: 'project',
    title: 'Consolidar projections do Hoje',
    status: 'active',
    priority: 2,
    dateStart: '2026-05-17',
    durationMinutes: 90,
    sourceContext: 'Fazer',
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'item-critical-dependencies',
    userId: seedUserId,
    entityType: 'task',
    title: 'Validar dependencias criticas',
    status: 'active',
    priority: 2,
    dateStart: '2026-05-12',
    durationMinutes: null,
    sourceContext: 'Timeline',
    createdAt: now,
    updatedAt: now,
  },
]

export const seedInboxItems: InboxItem[] = [
  {
    id: 'inbox-loose-notes',
    userId: seedUserId,
    text: 'Transformar notas soltas em decisao de produto',
    status: 'new',
    sourceContext: 'capture',
    createdAt: now,
    updatedAt: now,
  },
]

export const seedConditions: EntityCondition[] = [
  {
    id: 'condition-essential-release-review',
    userId: seedUserId,
    entityId: 'item-release-review',
    conditionType: 'essential_protected',
    createdBy: 'user',
    createdAt: now,
  },
  {
    id: 'condition-blocked-critical-dependencies',
    userId: seedUserId,
    entityId: 'item-critical-dependencies',
    conditionType: 'blocked',
    value: 'Aguardando decisao de escopo',
    createdBy: 'user',
    createdAt: now,
  },
]

export const seedDependencyEdges: DependencyEdge[] = [
  {
    id: 'dependency-critical-before-projection',
    userId: seedUserId,
    predecessorId: 'item-critical-dependencies',
    successorId: 'item-today-projections',
    type: 'blocks',
    status: 'active',
    source: 'manual',
    confidence: 1,
    justification: 'Validacao de dependencia precisa anteceder projection final.',
    impact: 'Pode atrasar a sequencia operacional da Timeline.',
    createdAt: now,
  },
]

export const seedEntityLinks: EntityLink[] = []
