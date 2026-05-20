import type {
  DependencyEdge,
  EntityCondition,
  EntityLink,
  EntityType,
  InboxItem,
  OlysItem,
} from '../../../domain/entities/types'

export type IdeaSurfaceContext =
  | 'today'
  | 'timeline'
  | 'capture'
  | 'inbox'
  | 'planning'
  | 'memory'
  | 'global'
  | 'unknown'

export type IdeaOutputType =
  | 'reading'
  | 'suggestion'
  | 'report'
  | 'proposed_action'
  | 'unavailable'
  | 'safety_blocked'

export type IdeaActionType =
  | 'open'
  | 'review'
  | 'create'
  | 'defer'
  | 'convert'
  | 'link'
  | 'keep'
  | 'highlight'
  | 'none'

export type IdeaConfidence = 'low' | 'medium' | 'high'

export type IdeaSafetySeverity = 'info' | 'warning' | 'critical'

export type IdeaProposedAction = {
  actionType: IdeaActionType
  label: string
  targetId?: string
  targetType?: EntityType
  payload?: Record<string, unknown>
  destructive?: boolean
  reversible?: boolean
  confirmationCopy: string
}

export type IdeaSafetyResult = {
  allowed: boolean
  reasonCode?: string
  userFacingReason?: string
  severity?: IdeaSafetySeverity
}

export type IdeaOutput = {
  id: string
  type: IdeaOutputType
  title: string
  description: string
  confidence: IdeaConfidence
  assumptions: string[]
  missingInformation: string[]
  sourceSurface: IdeaSurfaceContext
  createdAt: string
  action?: IdeaProposedAction
  requiresConfirmation: boolean
  safety?: IdeaSafetyResult
}

export type IdeaContextInput = {
  currentPath: string
  items: OlysItem[]
  inboxItems: InboxItem[]
  conditions: EntityCondition[]
  dependencies: DependencyEdge[]
  links: EntityLink[]
  textInput?: string
}

export type IdeaContextSummary = {
  surface: IdeaSurfaceContext
  counts: {
    items: number
    inboxPending: number
    blockedConditions: number
    unknownConditions: number
    activeDependencies: number
    links: number
    completed: number
    archived: number
    templates: number
    memoryRecoverable: number
    directionalItems: number
  }
  relevantSignals: string[]
  selectedContextSummary: string
  hasUnknown: boolean
  hasBlocked: boolean
  hasInboxPending: boolean
  hasMemoryRecoverable: boolean
  hasPlanningDirection: boolean
  hasTimelinePressure: boolean
  userPromptPreview?: string
}
