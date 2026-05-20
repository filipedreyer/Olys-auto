import type {
  EntityCondition,
  EntityType,
  OlysItem,
} from '../../../domain/entities/types'
import type {
  EntityFieldType,
  EntitySheetField,
  EntitySheetKind,
  EntitySheetSpecificBlock,
} from './entitySheetTypes'

const editingFutureHelper =
  'Edição controlada futura: campo exibido em leitura até existir comando seguro nesta superfície.'

export const entitySheetLabelByKind: Record<EntitySheetKind, string> = {
  goal: 'Meta',
  project: 'Projeto',
  task: 'Tarefa',
  habit: 'Hábito',
  routine: 'Rotina',
  agenda: 'Agenda',
  event: 'Evento',
  reminder: 'Lembrete',
  note: 'Nota',
  list: 'Lista',
  template: 'Template',
}

export function buildEditableFields(item: OlysItem): EntitySheetField[] {
  const common = [
    editableField('title', 'Título', item.title, 'text', true),
    editableField('description', 'Descrição', item.description, 'long_text', false),
    editableField('status', 'Estado', item.status, 'status', true),
  ]

  if (item.entityType === 'note' || item.entityType === 'list') {
    return common
  }

  if (item.entityType === 'reminder') {
    return [
      ...common,
      editableField('dateStart', 'Data', item.dateStart, 'date', false),
      editableField('startAt', 'Horário', item.startAt, 'time', false),
    ]
  }

  if (item.entityType === 'habit' || item.entityType === 'routine') {
    return [
      ...common,
      editableField('recurrenceRule', 'Recorrência', item.recurrenceRule, 'recurrence', false),
      editableField('priority', 'Prioridade', item.priority, 'number', false),
    ]
  }

  if (item.entityType === 'agenda' || item.entityType === 'event') {
    return [
      ...common,
      editableField('dateStart', 'Data inicial', item.dateStart, 'date', false),
      editableField('dateEnd', 'Data final', item.dateEnd, 'date', false),
      editableField('startAt', 'Início', item.startAt, 'time', false),
      editableField('endAt', 'Fim', item.endAt, 'time', false),
      editableField('allDay', 'Dia inteiro', item.allDay, 'boolean', false),
      editableField('durationMinutes', 'Duração declarada', item.durationMinutes, 'number', false),
    ]
  }

  if (item.entityType === 'task') {
    return [
      ...common,
      editableField('priority', 'Prioridade', item.priority, 'number', false),
      editableField('dateStart', 'Data', item.dateStart, 'date', false),
      editableField('startAt', 'Início', item.startAt, 'time', false),
      editableField('endAt', 'Fim', item.endAt, 'time', false),
      editableField('durationMinutes', 'Duração declarada', item.durationMinutes, 'number', false),
    ]
  }

  if (item.entityType === 'project') {
    return [
      ...common,
      editableField('priority', 'Prioridade', item.priority, 'number', false),
      editableField('dateStart', 'Começo', item.dateStart, 'date', false),
      editableField('dateEnd', 'Fim previsto', item.dateEnd, 'date', false),
    ]
  }

  if (item.entityType === 'template') {
    return [
      ...common,
      editableField('template_entity_type', 'Tipo de reutilização', readMetadataText(item, 'template_entity_type'), 'readonly_text', false),
    ]
  }

  return [
    ...common,
    editableField('priority', 'Prioridade', item.priority, 'number', false),
  ]
}

export function buildDerivedFields(
  item: OlysItem,
  conditions: readonly EntityCondition[],
): EntitySheetField[] {
  const activeConditions = conditions
    .filter((condition) => condition.entityId === item.id && !condition.removedAt)
    .map((condition) => condition.conditionType)
    .join(', ')

  return [
    derivedField('id', 'ID', item.id),
    derivedField('entityType', 'Tipo canônico', entitySheetLabelByKind[item.entityType]),
    derivedField('userId', 'Usuário', item.userId),
    derivedField('createdAt', 'Criado em', item.createdAt),
    derivedField('updatedAt', 'Atualizado em', item.updatedAt),
    derivedField('completedAt', 'Concluído em', item.completedAt),
    derivedField('archivedAt', 'Arquivado em', item.archivedAt),
    derivedField('deletedAt', 'Removido em', item.deletedAt),
    derivedField('parentId', 'Composição superior', item.parentId),
    derivedField('durationKnown', 'Duração', typeof item.durationMinutes === 'number' ? `${item.durationMinutes} min` : 'Unknown'),
    derivedField('temporalSufficiency', 'Suficiência temporal', describeTemporalSufficiency(item)),
    derivedField('recurrenceDeclared', 'Recorrência declarada', item.recurrenceRule ? 'Sim' : 'Não'),
    derivedField('conditions', 'Condições ativas', activeConditions || 'Sem condição ativa carregada'),
  ]
}

export function buildSpecificBlocks(input: {
  item: OlysItem
  relatedProjects: number
  linkedGoalTitle?: string
  activeChildren: number
  dependencyCount: number
  linkCount: number
  missingInformation: string[]
}): EntitySheetSpecificBlock[] {
  const { item } = input

  switch (item.entityType) {
    case 'goal':
      return [
        specificBlock('goal-direction', 'Direção da meta', 'Meta mostra relação qualitativa com projetos e execução, sem métrica artificial.', [
          controlledField('Projetos relacionados', input.relatedProjects),
          controlledField('Relação com execução', input.activeChildren > 0 ? 'Há filhos ativos carregados' : 'Sem reflexo ativo carregado'),
          controlledField('Progresso qualitativo', readMetadataText(item, 'goal_progress') ?? 'Não declarado'),
        ]),
      ]
    case 'project':
      return [
        specificBlock('project-control', 'Projeto como continuidade operacional', 'Project Stages, milestones e riscos aparecem apenas como metadata controlada quando existirem.', [
          controlledField('Meta vinculada', input.linkedGoalTitle ?? 'Não carregada'),
          controlledField('Itens operacionais ativos', input.activeChildren),
          controlledField('Project Stages', readMetadataText(item, 'project_stages') ?? 'Contrato/metadata não declarado'),
          controlledField('Milestones', readMetadataText(item, 'milestones') ?? 'Contrato/metadata não declarado'),
          controlledField('Riscos', readMetadataText(item, 'risks') ?? 'Contrato/metadata não declarado'),
        ]),
      ]
    case 'task':
      return [
        specificBlock('task-operational', 'Tarefa operacional', 'Prioridade, temporalidade, bloqueio e unknown são leitura, não checklist complexo.', [
          controlledField('Prioridade', item.priority),
          controlledField('Temporalidade', describeTemporalSufficiency(item)),
          controlledField('Dependências carregadas', input.dependencyCount),
        ]),
      ]
    case 'habit':
      return [
        specificBlock('habit-rhythm', 'Hábito como ritmo', 'Recorrência declarada sem contagem performática ou gamificação.', [
          controlledField('Recorrência', item.recurrenceRule ?? 'Não declarada'),
          controlledField('Vínculos carregados', input.linkCount),
        ]),
      ]
    case 'routine':
      return [
        specificBlock('routine-sequence', 'Rotina como sequência operacional', 'Composição pode aparecer por parentId/children sem checklist ornamental.', [
          controlledField('Recorrência', item.recurrenceRule ?? 'Não declarada'),
          controlledField('Filhos carregados', input.activeChildren),
        ]),
      ]
    case 'agenda':
    case 'event':
      return [
        specificBlock('agenda-event-window', 'Janela temporal e preparação', 'Event Prep é contrato contextual de agenda/evento, não entidade.', [
          controlledField('Janela', describeTemporalSufficiency(item)),
          controlledField('Event Prep', readMetadataText(item, 'event_prep') ?? 'Contrato futuro/controlado não declarado'),
        ]),
      ]
    case 'reminder':
      return [
        specificBlock('reminder-sufficiency', 'Suficiência do lembrete', 'Lembrete precisa de data ou horário suficiente para existir fora da Inbox.', [
          controlledField('Data', item.dateStart ?? 'Ausente'),
          controlledField('Horário', item.startAt ?? 'Ausente'),
          controlledField('Suficiência', item.dateStart || item.startAt ? 'Suficiente' : 'Insuficiente'),
        ]),
      ]
    case 'note':
      return [
        specificBlock('note-context', 'Nota como recuperação contextual', 'Nota solta pode aparecer na Caixola; não vira wiki ou knowledge base.', [
          controlledField('Origem', item.sourceContext ?? 'Não declarada'),
          controlledField('Vínculos carregados', input.linkCount),
        ]),
      ]
    case 'list':
      return [
        specificBlock('list-simple', 'Lista simples', 'Lista mantém estrutura simples; não vira planilha geral.', [
          controlledField('Composição superior', item.parentId ?? 'Sem composição superior'),
          controlledField('Filhos carregados', input.activeChildren),
        ]),
      ]
    case 'template':
      return [
        specificBlock('template-reuse', 'Template reutilizável', 'Template prepara reuso governado, sem marketplace.', [
          controlledField('Tipo de reutilização', readMetadataText(item, 'template_entity_type') ?? 'Rotina por fallback de reuso existente'),
        ]),
      ]
  }
}

function editableField(
  key: string,
  label: string,
  value: EntitySheetField['value'],
  fieldType: EntityFieldType,
  required: boolean,
): EntitySheetField {
  return {
    key,
    label,
    value: normalizeValue(value),
    role: 'editable',
    fieldType,
    editable: false,
    required,
    source: key === 'template_entity_type' ? 'metadata' : 'item',
    helperText: editingFutureHelper,
  }
}

function derivedField(key: string, label: string, value: EntitySheetField['value']): EntitySheetField {
  return {
    key,
    label,
    value: normalizeValue(value),
    role: 'derived',
    fieldType: 'readonly_text',
    editable: false,
    required: false,
    source: 'item',
    helperText: 'Campo derivado. Não pode ser editado diretamente.',
  }
}

function controlledField(label: string, value: EntitySheetField['value']): EntitySheetField {
  return {
    key: label.toLowerCase().replace(/\s+/g, '_'),
    label,
    value: normalizeValue(value),
    role: 'future_contract',
    fieldType: 'readonly_text',
    editable: false,
    required: false,
    source: 'metadata',
  }
}

function specificBlock(
  key: string,
  title: string,
  description: string,
  fields: EntitySheetField[],
): EntitySheetSpecificBlock {
  return {
    key,
    title,
    description,
    fields,
    blockKind: 'specific',
  }
}

function readMetadataText(item: OlysItem, key: string) {
  const value = item.metadata?.[key]

  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return String(value)
  }

  return undefined
}

function normalizeValue(value: EntitySheetField['value']) {
  if (value === undefined || value === null || value === '') {
    return 'Não declarado'
  }

  return value
}

function describeTemporalSufficiency(item: OlysItem) {
  if (item.allDay && item.dateStart) {
    return 'Dia inteiro com data'
  }

  if (item.dateStart && item.startAt && item.endAt) {
    return 'Data e janela de horário'
  }

  if (item.dateStart || item.startAt) {
    return 'Temporalidade parcial'
  }

  return 'Temporalidade unknown'
}
