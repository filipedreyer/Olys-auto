export const accessTrustCopy = [
  'Olys separa acesso do ambiente operacional.',
  'Sem configuração válida, o app explica a limitação em vez de esconder falha.',
  'Nenhum dado operacional é apagado silenciosamente por esta tela.',
] as const

export const onboardingSteps = [
  {
    title: 'Capturar sem organizar tudo agora',
    description: 'Tire da cabeça e deixe a triagem decidir depois, sem transformar entrada em tarefa automaticamente.',
  },
  {
    title: 'Fazer com capacidade e direção',
    description: 'O dia começa por leitura operacional, não por uma fila infinita.',
  },
  {
    title: 'Revisar continuidade sem medir performance',
    description: 'Memória e revisão semanal ajudam a retomar contexto sem criar placar.',
  },
] as const

export function getAuthModeLabel(mode: 'supabase' | 'local') {
  return mode === 'local' ? 'Modo local degradado' : 'Supabase configurado'
}
