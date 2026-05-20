import type {
  DependencyStatus,
  DependencyType,
  EntityChangeEvent,
  EntityType,
  ItemStatus,
  LinkType,
  OlysItem,
} from '../../../domain/entities/types'

export type EntitySheetKind = EntityType

export type EntityFieldRole =
  | 'editable'
  | 'derived'
  | 'historical'
  | 'future_contract'

export type EntityBlockKind =
  | 'header'
  | 'editable_fields'
  | 'derived_fields'
  | 'relations'
  | 'dependencies'
  | 'composition'
  | 'history'
  | 'attachments'
  | 'specific'

export type EntityFieldType =
  | 'text'
  | 'long_text'
  | 'status'
  | 'priority'
  | 'date'
  | 'time'
  | 'number'
  | 'boolean'
  | 'recurrence'
  | 'readonly_text'
  | 'future_contract'

export type EntitySheetField = {
  key: string
  label: string
  value?: string | number | boolean | null
  role: EntityFieldRole
  fieldType: EntityFieldType
  editable: boolean
  required: boolean
  source: 'item' | 'condition' | 'link' | 'dependency' | 'metadata' | 'system'
  helperText?: string
}

export type EntitySheetRelation = {
  id: string
  linkType: LinkType
  direction: 'outgoing' | 'incoming'
  relatedEntityId: string
  relatedTitle: string
  relatedEntityType?: EntityType
  createdAt: string
}

export type EntitySheetDependency = {
  id: string
  role: 'predecessor' | 'successor'
  type: DependencyType
  status: DependencyStatus
  predecessorId: string
  successorId: string
  predecessorTitle: string
  successorTitle: string
  impact: string
  justification: string
  createdAt: string
}

export type EntitySheetRelatedItem = {
  id: string
  title: string
  entityType: EntityType
  status: ItemStatus
}

export type EntitySheetHistoryEntry = Pick<
  EntityChangeEvent,
  'id' | 'changeType' | 'actor' | 'sourceContext' | 'createdAt'
>

export type EntitySheetSpecificBlock = {
  key: string
  title: string
  description: string
  fields: EntitySheetField[]
  blockKind?: EntityBlockKind
}

export type EntitySheetAttachmentSummary = {
  status: 'future_contract'
  description: string
}

export type EntitySheetProjection = {
  item: OlysItem
  kind: EntitySheetKind
  title: string
  status: ItemStatus
  entityLabel: string
  editableFields: EntitySheetField[]
  derivedFields: EntitySheetField[]
  relationSummary: EntitySheetRelation[]
  dependencySummary: EntitySheetDependency[]
  compositionSummary: {
    parent?: EntitySheetRelatedItem
    children: EntitySheetRelatedItem[]
  }
  historySummary: EntitySheetHistoryEntry[]
  attachmentSummary: EntitySheetAttachmentSummary
  specificBlocks: EntitySheetSpecificBlock[]
  risks: string[]
  missingInformation: string[]
  confirmationsRequired: EntitySheetAction[]
}

export type EntitySheetAction =
  | 'complete'
  | 'archive'
  | 'restore'
  | 'softDelete'
  | 'update'
  | 'openRelated'
  | 'applyEssentialProtected'
  | 'removeEssentialProtected'
  | 'none'
