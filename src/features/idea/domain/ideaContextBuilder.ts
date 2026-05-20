import type { IdeaContextInput, IdeaContextSummary, IdeaSurfaceContext } from './ideaTypes'

const MAX_PREVIEW_LENGTH = 96

export function buildIdeaContext(input: IdeaContextInput): IdeaContextSummary {
  const surface = resolveIdeaSurface(input.currentPath)
  const inboxPending = input.inboxItems.filter((item) =>
    ['new', 'error'].includes(item.status),
  ).length
  const blockedConditions = input.conditions.filter(
    (condition) => !condition.removedAt && condition.conditionType === 'blocked',
  ).length
  const unknownConditions = input.conditions.filter(
    (condition) => !condition.removedAt && condition.conditionType === 'unknown',
  ).length
  const activeDependencies = input.dependencies.filter(
    (dependency) => !dependency.removedAt && dependency.status === 'active',
  ).length
  const completed = input.items.filter((item) => item.status === 'completed').length
  const archived = input.items.filter((item) => item.status === 'archived').length
  const templates = input.items.filter(
    (item) => item.entityType === 'template' && item.status !== 'deleted',
  ).length
  const directionalItems = input.items.filter((item) =>
    ['goal', 'project', 'habit', 'routine'].includes(item.entityType),
  ).length
  const memoryRecoverable = completed + archived
  const relevantSignals = buildSignals({
    surface,
    inboxPending,
    blockedConditions,
    unknownConditions,
    activeDependencies,
    completed,
    archived,
    templates,
    directionalItems,
  })

  return {
    surface,
    counts: {
      items: input.items.length,
      inboxPending,
      blockedConditions,
      unknownConditions,
      activeDependencies,
      links: input.links.filter((link) => !link.removedAt).length,
      completed,
      archived,
      templates,
      memoryRecoverable,
      directionalItems,
    },
    relevantSignals,
    selectedContextSummary: buildSummary(surface, relevantSignals),
    hasUnknown: unknownConditions > 0,
    hasBlocked: blockedConditions > 0 || activeDependencies > 0,
    hasInboxPending: inboxPending > 0,
    hasMemoryRecoverable: memoryRecoverable > 0,
    hasPlanningDirection: directionalItems > 0,
    hasTimelinePressure: activeDependencies > 0 || unknownConditions > 0,
    userPromptPreview: truncate(input.textInput),
  }
}

export function resolveIdeaSurface(currentPath: string): IdeaSurfaceContext {
  if (currentPath.startsWith('/fazer/timeline')) return 'timeline'
  if (currentPath.startsWith('/fazer/hoje') || currentPath === '/hoje') return 'today'
  if (currentPath.startsWith('/capturar')) return 'capture'
  if (currentPath.startsWith('/memoria/inbox') || currentPath === '/inbox') return 'inbox'
  if (currentPath.startsWith('/planejar')) return 'planning'
  if (currentPath.startsWith('/memoria')) return 'memory'
  if (currentPath === '/') return 'global'

  return 'unknown'
}

function buildSignals(input: {
  surface: IdeaSurfaceContext
  inboxPending: number
  blockedConditions: number
  unknownConditions: number
  activeDependencies: number
  completed: number
  archived: number
  templates: number
  directionalItems: number
}) {
  const signals: string[] = []

  signals.push(`Superfície: ${input.surface}`)

  if (input.inboxPending > 0) signals.push(`${input.inboxPending} entrada(s) aguardando triagem`)
  if (input.blockedConditions > 0) signals.push(`${input.blockedConditions} bloqueio(s) sinalizado(s)`)
  if (input.unknownConditions > 0) signals.push(`${input.unknownConditions} lacuna(s) de informação`)
  if (input.activeDependencies > 0) signals.push(`${input.activeDependencies} dependência(s) ativa(s)`)
  if (input.completed + input.archived > 0) signals.push(`${input.completed + input.archived} item(ns) recuperável(is)`)
  if (input.templates > 0) signals.push(`${input.templates} template(s) reutilizável(is)`)
  if (input.directionalItems > 0) signals.push(`${input.directionalItems} item(ns) de direção`)

  return signals.slice(0, 5)
}

function buildSummary(surface: IdeaSurfaceContext, signals: string[]) {
  if (signals.length === 0) {
    return `Idea está lendo a superfície ${surface} com contexto mínimo carregado.`
  }

  return signals.join(' / ')
}

function truncate(text?: string) {
  if (!text) return undefined

  const normalized = text.trim().replace(/\s+/g, ' ')

  if (!normalized) return undefined

  return normalized.length > MAX_PREVIEW_LENGTH
    ? `${normalized.slice(0, MAX_PREVIEW_LENGTH)}...`
    : normalized
}
