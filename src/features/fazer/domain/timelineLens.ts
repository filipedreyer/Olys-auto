export type TimelineLens = 'calendar' | 'capacity' | 'dependency'

export const timelineLenses: Array<{ id: TimelineLens; label: string }> = [
  { id: 'calendar', label: 'Calendário' },
  { id: 'capacity', label: 'Capacidade' },
  { id: 'dependency', label: 'Dependências' },
]
