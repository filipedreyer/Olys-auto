import { EntityType, InboxItem, InboxStatus } from '../../../domain/entities/types'

export type InboxProjectionItem = {
  id: string
  text: string
  origin: string
  capturedAt: string
  suggestedType?: EntityType
  status: InboxStatus
  sourceId: string
  detail: string
}

export type InboxProjection = {
  triageItems: InboxProjectionItem[]
  revisitItems: InboxProjectionItem[]
  readings: {
    pending: number
    revisit: number
    postponed: number
    statement: string
  }
}

export function buildInboxProjection(inboxItems: InboxItem[]): InboxProjection {
  const projectionItems = inboxItems.map(toProjectionItem)
  const triageItems = projectionItems.filter((item) =>
    ['new', 'error'].includes(item.status),
  )
  const revisitItems = projectionItems.filter((item) =>
    ['kept', 'postponed'].includes(item.status),
  )
  const postponed = revisitItems.filter((item) => item.status === 'postponed').length

  return {
    triageItems,
    revisitItems,
    readings: {
      pending: triageItems.length,
      revisit: revisitItems.length,
      postponed,
      statement: buildStatement(triageItems.length, revisitItems.length),
    },
  }
}

function toProjectionItem(item: InboxItem): InboxProjectionItem {
  return {
    id: item.id,
    text: item.text,
    origin: item.sourceContext,
    capturedAt: item.createdAt,
    suggestedType: item.suggestedType,
    status: item.status,
    sourceId: item.id,
    detail: buildDetail(item),
  }
}

function buildDetail(item: InboxItem) {
  if (item.status === 'kept') {
    return 'Mantido para revisita controlada, fora da fila ativa'
  }

  if (item.status === 'postponed') {
    return 'Adiado para revisita operacional'
  }

  if (item.suggestedType) {
    return `Tipo sugerido: ${item.suggestedType}`
  }

  return 'Decidir destino antes de virar trabalho'
}

function buildStatement(pending: number, revisit: number) {
  if (pending > 0) {
    return 'Entrada aguardando triagem; nao e backlog'
  }

  if (revisit > 0) {
    return 'Sem triagem nova; ha revisita controlada fora da fila'
  }

  return 'Inbox limpa; nenhuma entrada competindo por atencao'
}
