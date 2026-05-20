import type {
  OperationalItemSignal,
  OperationalItemVisualState,
} from '../../../design-system'
import type {
  GoalProjection,
  ProjectProjection,
  RhythmProjection,
} from '../domain/planningProjection'

export function describeGoalProgress(progress: GoalProjection['qualitativeProgress']) {
  const labels: Record<GoalProjection['qualitativeProgress'], string> = {
    clear: 'Direção clara',
    connected: 'Conectada ao Fazer',
    loose: 'Solta',
    paused: 'Pausada',
  }

  return labels[progress]
}

export function resolveGoalState(
  progress: GoalProjection['qualitativeProgress'],
): OperationalItemVisualState {
  if (progress === 'paused') {
    return 'paused'
  }

  if (progress === 'loose') {
    return 'attention'
  }

  return 'default'
}

export function getGoalSignals(goal: GoalProjection): OperationalItemSignal[] {
  if (goal.qualitativeProgress === 'loose') {
    return [{ kind: 'unknown' }]
  }

  return []
}

export function resolveProjectState(project: ProjectProjection): OperationalItemVisualState {
  if (project.status === 'paused') {
    return 'paused'
  }

  if (project.dependencyRisk > 0) {
    return 'attention'
  }

  return 'default'
}

export function getProjectSignals(project: ProjectProjection): OperationalItemSignal[] {
  return project.dependencyRisk > 0 ? [{ kind: 'dependency' }] : []
}

export function getRhythmLabel(kind: RhythmProjection['kind']) {
  return kind === 'habit' ? 'Hábito' : 'Rotina'
}

export function polishPlanningText(text: string) {
  return text
    .replace(/Direcao/g, 'Direção')
    .replace(/direcao/g, 'direção')
    .replace(/execucao/g, 'execução')
    .replace(/conexao/g, 'conexão')
    .replace(/condicao/g, 'condição')
    .replace(/trajetoria/g, 'trajetória')
    .replace(/sequencia/g, 'sequência')
    .replace(/dependencias/g, 'dependências')
    .replace(/dependencia/g, 'dependência')
    .replace(/habitos/g, 'hábitos')
    .replace(/Habito/g, 'Hábito')
    .replace(/habito/g, 'hábito')
    .replace(/medio/g, 'médio')
}
