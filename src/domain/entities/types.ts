export type EntityType =
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

export type OperationalState = 'active' | 'paused' | 'completed' | 'archived'

export type OlysItem = {
  id: string
  type: EntityType
  title: string
  state: OperationalState
  essentialProtected?: boolean
  hasDependencyRisk?: boolean
  dueLabel?: string
  contextLabel?: string
}
