import { InboxItem, OlysItem } from '../../../domain/entities/types'

export function buildMemoryProjection(items: OlysItem[], inboxItems: InboxItem[]) {
  const active = items.filter((item) => item.status === 'active')
  const completed = items.filter((item) => item.status === 'completed')
  const archived = items.filter((item) => item.status === 'archived')
  const notes = items.filter((item) => item.entityType === 'note')
  const inbox = inboxItems.filter((item) =>
    ['new', 'kept', 'postponed', 'error'].includes(item.status),
  )

  return {
    groups: [
      {
        id: 'inbox',
        label: 'Inbox',
        count: inbox.length,
        description: 'Entradas ainda em triagem; nao e backlog.',
      },
      {
        id: 'active',
        label: 'Ativos',
        count: active.length,
        description: 'Entidades recuperaveis que ainda participam do sistema.',
      },
      {
        id: 'completed',
        label: 'Concluidos',
        count: completed.length,
        description: 'Historico preservado sem competir com execucao.',
      },
      {
        id: 'archived',
        label: 'Arquivados',
        count: archived.length,
        description: 'Material fora do fluxo ativo, ainda recuperavel.',
      },
      {
        id: 'notes',
        label: 'Notas',
        count: notes.length,
        description: 'Memoria solta aguardando sentido operacional.',
      },
    ],
  }
}
