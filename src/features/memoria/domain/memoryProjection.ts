import {
  DependencyEdge,
  EntityLink,
  InboxItem,
  OlysItem,
} from '../../../domain/entities/types'

export type MemoryProjectionItem = {
  id: string
  title: string
  meta: string
  detail: string
}

export type MemoryProjection = {
  archived: MemoryProjectionItem[]
  completed: MemoryProjectionItem[]
  caixola: MemoryProjectionItem[]
  templates: MemoryProjectionItem[]
  recovery: MemoryProjectionItem[]
  continuity: {
    recentCompletions: number
    recoverable: number
    reusableTemplates: number
    statement: string
  }
  groups: Array<{
    id: string
    label: string
    count: number
    description: string
  }>
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

  return {
    archived: archived.map((item) =>
      toProjectionItem(item, 'Arquivado', relationDetail(item, links, dependencies)),
    ),
    completed: completed.map((item) =>
      toProjectionItem(item, 'Concluido', item.completedAt ?? 'Historico recuperavel'),
    ),
    caixola,
    templates: templates.map((item) =>
      toProjectionItem(item, 'Template', resolveTemplateDetail(item)),
    ),
    recovery: recovery.map((item) =>
      toProjectionItem(item, 'Recuperacao', 'Pode restaurar contexto sem virar arquivo morto'),
    ),
    continuity: {
      recentCompletions: completed.length,
      recoverable: recovery.length,
      reusableTemplates: templates.length,
      statement:
        recovery.length > 0 || caixola.length > 0
          ? 'Memoria preserva continuidade e recuperacao contextual'
          : 'Memoria ainda sem material longitudinal relevante',
    },
    groups: [
      {
        id: 'completed',
        label: 'Concluidos',
        count: completed.length,
        description: 'Historico util, recuperavel e sem gamificacao.',
      },
      {
        id: 'archived',
        label: 'Arquivados',
        count: archived.length,
        description: 'Material fora do fluxo ativo, ainda rastreavel.',
      },
      {
        id: 'caixola',
        label: 'Caixola',
        count: caixola.length,
        description: 'Fragmentos e notas soltas sem virar backlog oculto.',
      },
      {
        id: 'templates',
        label: 'Templates',
        count: templates.length,
        description: 'Estruturas reutilizaveis sem editor complexo.',
      },
      {
        id: 'recovery',
        label: 'Recuperacao',
        count: recovery.length,
        description: 'Reencontrar e restaurar contexto quando fizer sentido.',
      },
    ],
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

function buildCaixola(items: OlysItem[], inboxItems: InboxItem[]) {
  const looseNotes = items
    .filter(
      (item) =>
        item.entityType === 'note' &&
        item.status === 'active' &&
        !item.parentId,
    )
    .map((item) =>
      toProjectionItem(item, 'Nota solta', 'Fragmento com recuperacao operacional'),
    )
  const parkedInbox = inboxItems
    .filter((item) => ['kept', 'postponed'].includes(item.status))
    .map((item) => ({
      id: item.id,
      title: item.text,
      meta: item.status,
      detail: 'Entrada em espera controlada, separada da Memoria final',
    }))

  return [...looseNotes, ...parkedInbox]
}

function toProjectionItem(
  item: OlysItem,
  meta: string,
  detail: string,
): MemoryProjectionItem {
  return {
    id: item.id,
    title: item.title,
    meta,
    detail,
  }
}

function relationDetail(
  item: OlysItem,
  links: EntityLink[],
  dependencies: DependencyEdge[],
) {
  const linkCount = links.filter(
    (link) =>
      !link.removedAt &&
      (link.sourceEntityId === item.id || link.targetEntityId === item.id),
  ).length
  const dependencyCount = dependencies.filter(
    (edge) =>
      !edge.removedAt &&
      (edge.predecessorId === item.id || edge.successorId === item.id),
  ).length

  if (linkCount + dependencyCount > 0) {
    return `${linkCount} vinculo(s), ${dependencyCount} dependencia(s) preservada(s)`
  }

  return item.archivedAt ?? 'Arquivado com rastreabilidade minima'
}

function resolveTemplateDetail(item: OlysItem) {
  return `Reutiliza como ${resolveTemplateReuseType(item)}`
}
