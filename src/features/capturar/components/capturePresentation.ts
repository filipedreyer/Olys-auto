import {
  CaptureDestination,
  CaptureDestinationId,
  captureDestinations,
} from '../domain/captureDestination'

export type CaptureDestinationEmphasis =
  | 'primary'
  | 'emphasis'
  | 'secondary'
  | 'default'

export type CaptureDestinationPresentation = {
  label: string
  description: string
  emphasis: CaptureDestinationEmphasis
}

export const captureGridLayout: CaptureDestinationId[][] = [
  ['inbox', 'goal', 'project'],
  ['task', 'agenda', 'note'],
  ['list', 'habit', 'routine'],
  ['template', 'event', 'reminder'],
]

const destinationPresentation: Record<
  CaptureDestinationId,
  CaptureDestinationPresentation
> = {
  inbox: {
    label: 'Inbox',
    description: 'Sem classificar agora',
    emphasis: 'primary',
  },
  goal: {
    label: 'Meta',
    description: 'Direção de médio prazo',
    emphasis: 'default',
  },
  project: {
    label: 'Projeto',
    description: 'Entrega com começo e fim',
    emphasis: 'default',
  },
  task: {
    label: 'Tarefa',
    description: 'Próxima ação',
    emphasis: 'emphasis',
  },
  agenda: {
    label: 'Agenda',
    description: 'Compromisso ou janela',
    emphasis: 'emphasis',
  },
  note: {
    label: 'Nota',
    description: 'Registro solto',
    emphasis: 'emphasis',
  },
  list: {
    label: 'Lista',
    description: 'Conjunto de itens',
    emphasis: 'default',
  },
  habit: {
    label: 'Hábito',
    description: 'Recorrência comportamental',
    emphasis: 'default',
  },
  routine: {
    label: 'Rotina',
    description: 'Sequência recorrente',
    emphasis: 'default',
  },
  template: {
    label: 'Template',
    description: 'Modelo reutilizável',
    emphasis: 'secondary',
  },
  event: {
    label: 'Evento',
    description: 'Acontecimento',
    emphasis: 'default',
  },
  reminder: {
    label: 'Lembrete',
    description: 'Precisa de data',
    emphasis: 'default',
  },
}

export function getCaptureDestinationPresentation(
  id: CaptureDestinationId,
): CaptureDestinationPresentation {
  return destinationPresentation[id]
}

export function buildCaptureGridRows(
  destinations: CaptureDestination[] = captureDestinations,
) {
  const destinationsById = new Map(
    destinations.map((destination) => [destination.id, destination]),
  )

  return captureGridLayout.map((row) =>
    row
      .map((id) => destinationsById.get(id))
      .filter((destination): destination is CaptureDestination =>
        Boolean(destination),
      ),
  )
}
