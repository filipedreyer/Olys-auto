export type EntityType =
  | 'inbox'
  | 'meta'
  | 'projeto'
  | 'tarefa'
  | 'habito'
  | 'rotina'
  | 'agenda'
  | 'evento'
  | 'lembrete'
  | 'nota'
  | 'lista'
  | 'template'

export type OperationalState =
  | 'active'
  | 'paused'
  | 'completed'
  | 'blocked'
  | 'archived'

export type OperationalRowState =
  | 'default'
  | 'attention'
  | 'completed'
  | 'blocked'
  | 'paused'

export type CapacityDemand = 'low' | 'medium' | 'high' | 'unknown'

export type DependencyKind = 'blocker' | 'sequence' | 'risk' | 'impact'

export type DependencySignal = {
  kind: DependencyKind
  reason: string
  impact: string
  dependsOn?: string
}

export type OlysItem = {
  id: string
  type: EntityType
  title: string
  state: OperationalState
  essentialProtected?: boolean
  dependency?: DependencySignal
  durationMinutes?: number | null
  capacityDemand?: CapacityDemand
  dueLabel?: string
  scheduledLabel?: string
  contextLabel?: string
  inboxStatus?: 'untriaged' | 'kept' | 'converted' | 'postponed'
  createdAtLabel?: string
}
