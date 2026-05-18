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
  readings: {
    pending: number
    postponed: number
    statement: string
  }
}

export function buildInboxProjection(inboxItems: InboxItem[]): InboxProjection {
  const triageItems = inboxItems
    .filter((item) => ['new', 'kept', 'postponed', 'error'].includes(item.status))
    .map((item) => ({
      id: item.id,
      text: item.text,
      origin: item.sourceContext,
      capturedAt: item.createdAt,
      suggestedType: item.suggestedType,
      status: item.status,
      sourceId: item.id,
      detail: buildDetail(item),
    }))

  const postponed = triageItems.filter((item) => item.status === 'postponed').length

  return {
    triageItems,
    readings: {
      pending: triageItems.length,
      postponed,
      statement:
        triageItems.length > 0
          ? 'Entrada aguardando triagem; nao e backlog'
          : 'Inbox limpa; nenhuma entrada competindo por atencao',
    },
  }
}

function buildDetail(item: InboxItem) {
  if (item.suggestedType) {
    return `Tipo sugerido: ${item.suggestedType}`
  }

  if (item.status === 'postponed') {
    return 'Adiado para revisita operacional'
  }

  return 'Decidir destino antes de virar trabalho'
}
