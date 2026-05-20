export type ReplanningContract = {
  kind: 'coherence_operation'
  requiresConfirmation: true
  persistsAutomatically: false
  preservesTraceability: true
  description: string
  guardrails: string[]
}

export const weeklyReplanningContract: ReplanningContract = {
  kind: 'coherence_operation',
  requiresConfirmation: true,
  persistsAutomatically: false,
  preservesTraceability: true,
  description: 'Replanejamento reorganiza coerência com confirmação explícita; não limpa fila acumulada.',
  guardrails: [
    'Não reorganizar automaticamente.',
    'Não alterar ordering canônico sem confirmação.',
    'Não apagar contexto para parecer limpo.',
    'Registrar motivo quando virar ação real futura.',
  ],
}

export const temporaryManualOrderingContract = {
  requiresTraceability: true,
  persistsAutomatically: false,
  description: 'Ordenação manual temporária precisa deixar rastro e não substituir regra canônica em silêncio.',
} as const
