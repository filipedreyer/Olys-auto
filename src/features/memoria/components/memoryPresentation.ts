import type { MemoryProjectionItem, MemorySubarea } from '../domain/memoryProjection'

export function formatMemoryStatus(item: MemoryProjectionItem) {
  if (item.isFutureContract) {
    return 'Contrato futuro'
  }

  if (item.inboxStatus === 'postponed') {
    return 'Revisita controlada'
  }

  if (item.inboxStatus === 'kept') {
    return 'Mantido'
  }

  if (item.status === 'completed') {
    return 'Concluído'
  }

  if (item.status === 'archived') {
    return 'Arquivado'
  }

  if (item.status === 'active') {
    return 'Ativo'
  }

  return item.meta
}

export function formatMemoryOrigin(item: MemoryProjectionItem) {
  if (item.originKind === 'inbox') {
    return `Origem: Inbox${item.sourceContext ? ` / ${item.sourceContext}` : ''}`
  }

  if (item.originKind === 'future_contract') {
    return 'Origem: contrato governado futuro'
  }

  return item.sourceContext ? `Origem: ${item.sourceContext}` : 'Origem: item operacional'
}

export function formatMemoryAction(item: MemoryProjectionItem) {
  if (item.actionKind === 'restore') {
    return 'Restaurar contexto'
  }

  if (item.actionKind === 'reuse') {
    return 'Reutilizar modelo'
  }

  if (item.actionKind === 'review') {
    return 'Revisar contexto'
  }

  if (item.actionKind === 'open') {
    return 'Abrir'
  }

  return 'Sem ação nesta fase'
}

export function formatMemoryRelation(item: MemoryProjectionItem) {
  const linkCount = item.linkCount ?? 0
  const dependencyCount = item.dependencyCount ?? 0

  if (linkCount === 0 && dependencyCount === 0) {
    return undefined
  }

  return `${linkCount} vínculo(s), ${dependencyCount} dependência(s)`
}

export function subareaTone(subarea: MemorySubarea) {
  if (subarea.status === 'future_contract') {
    return 'future'
  }

  if (subarea.id === 'caixola') {
    return 'incubation'
  }

  if (subarea.id === 'templates') {
    return 'reuse'
  }

  return 'default'
}

export function itemSearchText(item: MemoryProjectionItem) {
  return [
    item.title,
    item.meta,
    item.detail,
    item.entityType,
    item.status,
    item.sourceContext,
    item.recoveryKind,
    item.originKind,
    item.actionKind,
    item.inboxStatus,
    item.suggestedType,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
}
