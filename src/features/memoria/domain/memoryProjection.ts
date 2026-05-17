import { OlysItem } from '../../../domain/entities/types'

export function buildMemoryProjection(items: OlysItem[]) {
  const active = items.filter((item) => item.state === 'active')
  const completed = items.filter((item) => item.state === 'completed')
  const archived = items.filter((item) => item.state === 'archived')
  const notes = items.filter((item) => item.type === 'nota')

  return {
    groups: [
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
        description: 'Material fora do fluxo, ainda disponivel para contexto.',
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
