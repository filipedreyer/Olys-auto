import { OlysItem } from '../../../domain/entities/types'

export const mockTodayItems: OlysItem[] = [
  {
    id: '1',
    type: 'tarefa',
    title: 'Revisar estrutura operacional do release',
    state: 'active',
    essentialProtected: true,
    contextLabel: 'Marketing Ops',
  },
  {
    id: '2',
    type: 'projeto',
    title: 'Consolidar projections do Hoje',
    state: 'active',
    contextLabel: 'Fazer',
  },
  {
    id: '3',
    type: 'tarefa',
    title: 'Validar dependências críticas',
    state: 'active',
    hasDependencyRisk: true,
    dueLabel: 'Há 5 dias',
  },
]
