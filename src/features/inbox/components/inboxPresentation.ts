import { EntityType, InboxStatus } from '../../../domain/entities/types'

export type InboxLayerMode = 'triage' | 'revisit'

const suggestedTypeLabels: Record<EntityType, string> = {
  goal: 'Meta',
  project: 'Projeto',
  task: 'Tarefa',
  habit: 'Hábito',
  routine: 'Rotina',
  agenda: 'Agenda',
  event: 'Evento',
  reminder: 'Lembrete',
  note: 'Nota',
  list: 'Lista',
  template: 'Template',
}

const statusLabels: Record<InboxStatus, string> = {
  new: 'Nova',
  kept: 'Mantida',
  converted: 'Convertida',
  completed: 'Concluída',
  postponed: 'Adiada',
  discarded: 'Descartada',
  archived: 'Arquivada',
  error: 'Erro',
}

export function getSuggestedTypeLabel(type?: EntityType) {
  return type ? suggestedTypeLabels[type] : 'Tarefa'
}

export function getConvertLabel(type?: EntityType) {
  return `Converter como ${getSuggestedTypeLabel(type)}`
}

export function getInboxStatusLabel(status: InboxStatus) {
  return statusLabels[status]
}

export function getInboxDecisionHint(mode: InboxLayerMode, status: InboxStatus) {
  if (mode === 'revisit') {
    return status === 'postponed'
      ? 'Revisita preservada; decidir sem puxar para execução automaticamente.'
      : 'Mantida fora da fila ativa; revisar quando houver contexto.'
  }

  if (status === 'error') {
    return 'Entrada com erro; precisa de decisão antes de qualquer conversão.'
  }

  return 'Decidir destino antes de virar trabalho.'
}
