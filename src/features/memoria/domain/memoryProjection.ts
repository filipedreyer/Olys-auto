import {
  DependencyEdge,
  EntityLink,
  EntityType,
  InboxItem,
  InboxStatus,
  ItemStatus,
  OlysItem,
} from '../../../domain/entities/types'

export type MemoryRecoveryKind =
  | 'archived'
  | 'completed'
  | 'caixola'
  | 'template'
  | 'attachment'
  | 'search'

export type MemoryOriginKind = 'item' | 'inbox' | 'future_contract'

export type MemoryActionKind = 'restore' | 'reuse' | 'open' | 'review' | 'none'

export type MemoryProjectionItem = {
  id: string
  title: string
  meta: string
  detail: string
  entityType?: EntityType
  status?: ItemStatus | InboxStatus
  sourceContext?: string
  createdAt?: string
  updatedAt?: string
  completedAt?: string
  archivedAt?: string
  parentId?: string
  linkCount?: number
  dependencyCount?: number
  recoveryKind: MemoryRecoveryKind
  originKind: MemoryOriginKind
  actionKind: MemoryActionKind
  inboxStatus?: InboxStatus
  suggestedType?: EntityType
  isRecoverable: boolean
  isReusable: boolean
  isLoose: boolean
  isFutureContract: boolean
}

export type MemoryProjection = {
  archived: MemoryProjectionItem[]
  completed: MemoryProjectionItem[]
  caixola: MemoryProjectionItem[]
  templates: MemoryProjectionItem[]
  attachments: MemoryProjectionItem[]
  search: MemoryProjectionItem[]
  recovery: MemoryProjectionItem[]
  continuity: {
    recentCompletions: number
    recoverable: number
    reusableTemplates: number
    caixola: number
    archived: number
    statement: string
  }
  groups: MemorySubarea[]
  subareas: MemorySubarea[]
}

export type MemorySubarea = {
  id:
    | 'home'
    | 'shortcuts'
    | 'caixola'
    | 'templates'
    | 'archived'
    | 'completed'
    | 'attachments'
    | 'search'
    | 'recovery'
    label: string
    count: number
    description: string
    status: 'available' | 'future_contract'
    code: 'MEM00' | 'MEM01' | 'MEM02' | 'MEM03' | 'MEM04' | 'MEM05' | 'MEM06' | 'MEM07' | 'RECOVERY'
}

export function buildMemoryProjection(
  items: OlysItem[],
  inboxItems: InboxItem[],
  links: EntityLink[] = [],
  dependencies: DependencyEdge[] = [],
): MemoryProjection {
  const completed = items.filter((item) => item.status === 'completed')
  const archived = items.filter((item) => item.status === 'archived')
  const caixola = buildCaixola(items, inboxItems)
  const templates = items.filter(
    (item) => item.entityType === 'template' && item.status !== 'deleted',
  )
  const recovery = [...archived, ...completed].slice(0, 8)
  const attachments = [buildAttachmentContractItem()]
  const archivedProjection = archived.map((item) =>
    toProjectionItem(item, {
      meta: 'Arquivado',
      detail: relationDetail(item, links, dependencies),
      recoveryKind: 'archived',
      actionKind: 'restore',
      linkCount: countLinks(item, links),
      dependencyCount: countDependencies(item, dependencies),
    }),
  )
  const completedProjection = completed.map((item) =>
    toProjectionItem(item, {
      meta: 'Concluído',
      detail: item.completedAt ?? 'Histórico recuperável',
      recoveryKind: 'completed',
      actionKind: 'restore',
      linkCount: countLinks(item, links),
      dependencyCount: countDependencies(item, dependencies),
    }),
  )
  const templatesProjection = templates.map((item) =>
    toProjectionItem(item, {
      meta: 'Template',
      detail: resolveTemplateDetail(item),
      recoveryKind: 'template',
      actionKind: 'reuse',
      isReusable: true,
    }),
  )
  const recoveryProjection = recovery.map((item) =>
    toProjectionItem(item, {
      meta: 'Recuperação',
      detail: 'Pode restaurar contexto sem virar arquivo morto',
      recoveryKind: item.status === 'completed' ? 'completed' : 'archived',
      actionKind: 'restore',
      linkCount: countLinks(item, links),
      dependencyCount: countDependencies(item, dependencies),
    }),
  )
  const search = [
    ...recoveryProjection,
    ...caixola,
    ...templatesProjection,
    ...attachments,
  ]
  const subareas = buildSubareas({
    completed: completed.length,
    archived: archived.length,
    caixola: caixola.length,
    templates: templates.length,
    attachments: attachments.length,
    search: search.length,
  })

  return {
    archived: archivedProjection,
    completed: completedProjection,
    caixola,
    templates: templatesProjection,
    attachments,
    search,
    recovery: recoveryProjection,
    continuity: {
      recentCompletions: completed.length,
      recoverable: recovery.length,
      reusableTemplates: templates.length,
      caixola: caixola.length,
      archived: archived.length,
      statement:
        recovery.length > 0 || caixola.length > 0
          ? 'Memória preserva continuidade e recuperação contextual'
          : 'Memória ainda sem material longitudinal relevante',
    },
    groups: subareas.filter((subarea) =>
      ['completed', 'archived', 'caixola', 'templates', 'recovery'].includes(subarea.id),
    ),
    subareas,
  }
}

export function resolveTemplateReuseType(item: OlysItem): OlysItem['entityType'] {
  const reuseType = item.metadata?.template_entity_type

  if (
    reuseType === 'task' ||
    reuseType === 'routine' ||
    reuseType === 'habit' ||
    reuseType === 'list' ||
    reuseType === 'note'
  ) {
    return reuseType
  }

  return 'routine'
}

function buildCaixola(items: OlysItem[], inboxItems: InboxItem[]): MemoryProjectionItem[] {
  const looseNotes = items
    .filter(
      (item) =>
        item.entityType === 'note' &&
        item.status === 'active' &&
        !item.parentId,
    )
    .map((item) =>
      toProjectionItem(item, {
        meta: 'Nota solta',
        detail: 'Fragmento com recuperação operacional',
        recoveryKind: 'caixola',
        actionKind: 'review',
        isLoose: true,
      }),
    )
  const parkedInbox = inboxItems
    .filter((item) => ['kept', 'postponed'].includes(item.status))
    .map((item) => ({
      id: item.id,
      title: item.text,
      meta: item.status === 'postponed' ? 'Revisita' : 'Mantido',
      detail: 'Entrada em espera controlada, separada da triagem nova',
      status: item.status,
      sourceContext: item.sourceContext,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      recoveryKind: 'caixola' as const,
      originKind: 'inbox' as const,
      actionKind: 'review' as const,
      inboxStatus: item.status,
      suggestedType: item.suggestedType,
      isRecoverable: false,
      isReusable: false,
      isLoose: true,
      isFutureContract: false,
    }))

  return [...looseNotes, ...parkedInbox]
}

function toProjectionItem(
  item: OlysItem,
  input: {
    meta: string
    detail: string
    recoveryKind: MemoryRecoveryKind
    actionKind: MemoryActionKind
    linkCount?: number
    dependencyCount?: number
    isReusable?: boolean
    isLoose?: boolean
  },
): MemoryProjectionItem {
  return {
    id: item.id,
    title: item.title,
    meta: input.meta,
    detail: input.detail,
    entityType: item.entityType,
    status: item.status,
    sourceContext: item.sourceContext,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    completedAt: item.completedAt,
    archivedAt: item.archivedAt,
    parentId: item.parentId,
    linkCount: input.linkCount,
    dependencyCount: input.dependencyCount,
    recoveryKind: input.recoveryKind,
    originKind: 'item',
    actionKind: input.actionKind,
    isRecoverable: input.actionKind === 'restore',
    isReusable: input.isReusable ?? false,
    isLoose: input.isLoose ?? false,
    isFutureContract: false,
  }
}

function relationDetail(
  item: OlysItem,
  links: EntityLink[],
  dependencies: DependencyEdge[],
) {
  const linkCount = countLinks(item, links)
  const dependencyCount = countDependencies(item, dependencies)

  if (linkCount + dependencyCount > 0) {
    return `${linkCount} vínculo(s), ${dependencyCount} dependência(s) preservada(s)`
  }

  return item.archivedAt ?? 'Arquivado com rastreabilidade mínima'
}

function resolveTemplateDetail(item: OlysItem) {
  return `Reutiliza como ${resolveTemplateReuseType(item)}`
}

function countLinks(item: OlysItem, links: EntityLink[]) {
  return links.filter(
    (link) =>
      !link.removedAt &&
      (link.sourceEntityId === item.id || link.targetEntityId === item.id),
  ).length
}

function countDependencies(item: OlysItem, dependencies: DependencyEdge[]) {
  return dependencies.filter(
    (edge) =>
      !edge.removedAt &&
      (edge.predecessorId === item.id || edge.successorId === item.id),
  ).length
}

function buildAttachmentContractItem(): MemoryProjectionItem {
  return {
    id: 'memory-attachments-private-contract',
    title: 'Anexos privados',
    meta: 'Contrato futuro',
    detail: 'Depende de storage privado, metadata, permissão e governança.',
    recoveryKind: 'attachment',
    originKind: 'future_contract',
    actionKind: 'none',
    isRecoverable: false,
    isReusable: false,
    isLoose: false,
    isFutureContract: true,
  }
}

function buildSubareas(input: {
  completed: number
  archived: number
  caixola: number
  templates: number
  attachments: number
  search: number
}): MemorySubarea[] {
  return [
    {
      id: 'home',
      code: 'MEM00',
      label: 'Home de Memória',
      count: input.search,
      description: 'Visão de continuidade e recuperação longitudinal.',
      status: 'available',
    },
    {
      id: 'shortcuts',
      code: 'MEM01',
      label: 'Atalhos',
      count: input.search,
      description: 'Retomadas úteis por origem, entidade, status e ação.',
      status: 'available',
    },
    {
      id: 'caixola',
      code: 'MEM02',
      label: 'Caixola',
      count: input.caixola,
      description: 'Incubação de fragmentos e revisitas sem virar fila oculta.',
      status: 'available',
    },
    {
      id: 'templates',
      code: 'MEM03',
      label: 'Templates',
      count: input.templates,
      description: 'Modelos reutilizáveis e governados, sem loja ou editor complexo.',
      status: 'available',
    },
    {
      id: 'archived',
      code: 'MEM04',
      label: 'Arquivados',
      count: input.archived,
      description: 'Material fora do fluxo ativo, ainda rastreável e recuperável.',
      status: 'available',
    },
    {
      id: 'completed',
      code: 'MEM05',
      label: 'Concluídos',
      count: input.completed,
      description: 'Histórico operacional útil, sem placar de desempenho.',
      status: 'available',
    },
    {
      id: 'attachments',
      code: 'MEM06',
      label: 'Anexos',
      count: input.attachments,
      description: 'Contrato futuro para anexos privados com metadata e permissão.',
      status: 'future_contract',
    },
    {
      id: 'search',
      code: 'MEM07',
      label: 'Busca em Memória',
      count: input.search,
      description: 'Recuperação local por texto, origem, status, entidade e ação.',
      status: 'available',
    },
    {
      id: 'recovery',
      code: 'RECOVERY',
      label: 'Recuperação',
      count: input.archived + input.completed,
      description: 'Reencontrar e restaurar contexto quando fizer sentido.',
      status: 'available',
    },
  ]
}
