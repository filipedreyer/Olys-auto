export type TimelineLens = 'calendar' | 'capacity' | 'dependency'

export type TimelineProjection = {
  lens: TimelineLens
  label: string
  description: string
}

export const timelineProjection: TimelineProjection[] = [
  {
    lens: 'capacity',
    label: 'Capacidade estável',
    description: 'Distribuição operacional sustentável para hoje.',
  },
  {
    lens: 'dependency',
    label: 'Dependências críticas',
    description: '2 relações exigem revisão contextual.',
  },
]
