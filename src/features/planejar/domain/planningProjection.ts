import { OlysItem } from '../../../domain/entities/types'
import { calculateDependencies } from '../../fazer/domain/dependencies'
import { buildDirectionReading } from '../../fazer/domain/directionReading'

export function buildPlanningProjection(items: OlysItem[]) {
  const activeProjects = items.filter(
    (item) => item.type === 'projeto' && item.state !== 'archived',
  )
  const dependencies = calculateDependencies(items)
  const direction = buildDirectionReading(items)

  return {
    activeProjects,
    readings: {
      direction,
      dependencies,
      statement:
        activeProjects.length > 0
          ? 'Planejamento orientado por direcao e risco operacional'
          : 'Sem projetos ativos exigindo planejamento agora',
    },
  }
}
