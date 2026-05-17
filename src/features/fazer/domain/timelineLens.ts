export type TimelineLens = 'calendar' | 'capacity' | 'dependency'

export const timelineLenses: Array<{ id: TimelineLens; label: string }> = [
  { id: 'calendar', label: 'Calendario' },
  { id: 'capacity', label: 'Capacidade' },
  { id: 'dependency', label: 'Dependencias' },
]
