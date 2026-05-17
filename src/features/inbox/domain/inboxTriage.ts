import { EntityType, OlysItem } from '../../../domain/entities/types'

export type InboxTriageAction =
  | 'keep'
  | 'convert'
  | 'complete'
  | 'postpone'
  | 'discard'

type InboxTriageInput = {
  action: InboxTriageAction
  targetType?: EntityType
}

export function applyInboxTriage(
  items: OlysItem[],
  id: string,
  input: InboxTriageInput,
): OlysItem[] {
  return items.map((item) => {
    if (item.id !== id) {
      return item
    }

    if (input.action === 'discard') {
      return {
        ...item,
        state: 'archived',
        inboxStatus: 'converted',
      }
    }

    if (input.action === 'complete') {
      return {
        ...item,
        state: 'completed',
        inboxStatus: 'converted',
      }
    }

    if (input.action === 'postpone') {
      return {
        ...item,
        state: 'paused',
        inboxStatus: 'postponed',
        scheduledLabel: 'Adiado',
      }
    }

    if (input.action === 'convert') {
      return {
        ...item,
        type: input.targetType ?? 'tarefa',
        inboxStatus: 'converted',
        contextLabel: 'Convertido',
      }
    }

    return {
      ...item,
      inboxStatus: 'kept',
      contextLabel: 'Mantido para triagem',
    }
  })
}

export function buildInboxProjection(items: OlysItem[]) {
  const triageItems = items.filter(
    (item) =>
      item.state !== 'archived' &&
      item.state !== 'completed' &&
      (item.type === 'inbox' || item.inboxStatus === 'untriaged'),
  )

  return {
    triageItems,
    readings: {
      pending: triageItems.length,
      statement:
        triageItems.length > 0
          ? 'Entrada aguardando decisao; nao e backlog'
          : 'Inbox limpa; nenhuma entrada competindo por atencao',
    },
  }
}
