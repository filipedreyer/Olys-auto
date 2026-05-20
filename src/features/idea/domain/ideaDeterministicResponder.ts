import type { IdeaContextSummary, IdeaOutput } from './ideaTypes'
import { guardIdeaOutputs, unavailableIdeaOutput } from './ideaOutputGuards'

export function buildDeterministicIdeaOutputs(
  context: IdeaContextSummary,
  prompt?: string,
): IdeaOutput[] {
  const createdAt = new Date().toISOString()
  const outputs: IdeaOutput[] = [
    buildReading(context, createdAt),
    buildSurfaceOutput(context, createdAt),
  ]

  const proposed = buildProposedAction(context, createdAt, prompt)

  if (proposed) {
    outputs.push(proposed)
  }

  outputs.push(unavailableIdeaOutput(context.surface))

  return guardIdeaOutputs(outputs)
}

function buildReading(context: IdeaContextSummary, createdAt: string): IdeaOutput {
  return {
    id: `idea-reading-${context.surface}`,
    type: 'reading',
    title: 'Leitura contextual',
    description: resolveReadingDescription(context),
    confidence: context.hasUnknown ? 'medium' : 'high',
    assumptions: ['A leitura usa apenas contexto já carregado nesta sessão.'],
    missingInformation: context.hasUnknown ? ['Há lacunas marcadas como unknown.'] : [],
    sourceSurface: context.surface,
    createdAt,
    requiresConfirmation: false,
  }
}

function buildSurfaceOutput(context: IdeaContextSummary, createdAt: string): IdeaOutput {
  if (context.surface === 'timeline') {
    return {
      id: 'idea-report-timeline',
      type: 'report',
      title: 'Relatório curto da Timeline',
      description: context.hasTimelinePressure
        ? 'Há pressão operacional por dependências ou informação incompleta. Não há cálculo novo de capacidade aqui.'
        : 'A Timeline não sinaliza pressão forte no contexto carregado.',
      confidence: context.hasUnknown ? 'medium' : 'high',
      assumptions: ['Capacidade e dependências vêm das leituras já disponíveis no app.'],
      missingInformation: context.hasUnknown ? ['Duração ou vínculo incompleto em parte dos itens.'] : [],
      sourceSurface: context.surface,
      createdAt,
      requiresConfirmation: false,
    }
  }

  if (context.surface === 'memory') {
    return {
      id: 'idea-report-memory',
      type: 'report',
      title: 'Recuperação longitudinal',
      description: context.hasMemoryRecoverable
        ? 'Há contexto recuperável. A ação segura agora é revisar antes de restaurar ou reutilizar.'
        : 'A Memória ainda tem pouco material recuperável no contexto carregado.',
      confidence: 'medium',
      assumptions: ['Arquivados, concluídos e templates foram lidos como sinais de recuperação.'],
      missingInformation: [],
      sourceSurface: context.surface,
      createdAt,
      requiresConfirmation: false,
    }
  }

  return {
    id: `idea-suggestion-${context.surface}`,
    type: 'suggestion',
    title: resolveSuggestionTitle(context),
    description: resolveSuggestionDescription(context),
    confidence: context.hasUnknown ? 'medium' : 'high',
    assumptions: ['Sugestão não executa mudança e não substitui decisão humana.'],
    missingInformation: context.hasUnknown ? ['Faltam dados para uma recomendação mais específica.'] : [],
    sourceSurface: context.surface,
    createdAt,
    action: {
      actionType: 'review',
      label: 'Revisar contexto',
      reversible: true,
      confirmationCopy: 'Revisar não altera dados.',
    },
    requiresConfirmation: false,
  }
}

function buildProposedAction(
  context: IdeaContextSummary,
  createdAt: string,
  prompt?: string,
): IdeaOutput | undefined {
  if (context.hasInboxPending) {
    return {
      id: 'idea-action-review-inbox',
      type: 'proposed_action',
      title: 'Ação proposta: revisar Inbox',
      description: 'Parece haver entrada aguardando decisão. A Idea pode preparar uma revisão, mas não converte nada nesta fase.',
      confidence: 'medium',
      assumptions: ['Inbox continua triagem, não backlog.'],
      missingInformation: ['Tipo final e decisão humana sobre destino.'],
      sourceSurface: context.surface,
      createdAt,
      action: {
        actionType: 'convert',
        label: 'Preparar conversão para revisão',
        reversible: true,
        destructive: false,
        confirmationCopy: 'Em fase futura, isso abriria uma confirmação antes de converter uma entrada. Nesta fase nada será persistido.',
      },
      requiresConfirmation: true,
    }
  }

  if (context.hasBlocked) {
    return {
      id: 'idea-action-highlight-risk',
      type: 'proposed_action',
      title: 'Ação proposta: destacar risco',
      description: 'Há bloqueio ou dependência ativa. A proposta é apenas destacar para revisão humana.',
      confidence: 'medium',
      assumptions: ['Dependência não é vínculo contextual.'],
      missingInformation: context.hasUnknown ? ['Há informação incompleta associada ao risco.'] : [],
      sourceSurface: context.surface,
      createdAt,
      action: {
        actionType: 'highlight',
        label: 'Destacar para revisão',
        reversible: true,
        destructive: false,
        confirmationCopy: 'Destacar risco não será persistido nesta fase.',
      },
      requiresConfirmation: true,
    }
  }

  if (prompt && prompt.trim()) {
    return {
      id: 'idea-action-review-prompt',
      type: 'proposed_action',
      title: 'Ação proposta: transformar pedido em revisão',
      description: 'O pedido pode orientar uma revisão contextual, mas qualquer mudança real precisa confirmação posterior.',
      confidence: 'low',
      assumptions: ['Texto do usuário não foi persistido.'],
      missingInformation: ['Entidade alvo e impacto operacional.'],
      sourceSurface: context.surface,
      createdAt,
      action: {
        actionType: 'review',
        label: 'Manter como sugestão de revisão',
        reversible: true,
        destructive: false,
        confirmationCopy: 'A revisão fica apenas como sugestão nesta fase.',
      },
      requiresConfirmation: true,
    }
  }

  return undefined
}

function resolveReadingDescription(context: IdeaContextSummary) {
  if (context.surface === 'today') {
    return context.hasBlocked || context.hasUnknown
      ? 'Há sinais que pedem revisão antes de empurrar mais execução para o dia.'
      : 'O contexto carregado não mostra bloqueio crítico. A próxima decisão deve continuar humana.'
  }

  if (context.surface === 'planning') {
    return context.hasPlanningDirection
      ? 'Existe direção carregada em metas, projetos, hábitos ou rotinas. A leitura deve conectar isso ao Fazer, sem virar dashboard.'
      : 'Ainda há pouca direção carregada para conectar trajetória e execução.'
  }

  if (context.surface === 'capture') {
    return 'Capturar aceita entrada imperfeita. Se faltar estrutura, o caminho seguro continua sendo Inbox.'
  }

  return context.selectedContextSummary
}

function resolveSuggestionTitle(context: IdeaContextSummary) {
  if (context.surface === 'capture') return 'Sugestão de estruturação'
  if (context.surface === 'inbox') return 'Sugestão de triagem'
  if (context.surface === 'planning') return 'Sugestão de continuidade'

  return 'Sugestão contextual'
}

function resolveSuggestionDescription(context: IdeaContextSummary) {
  if (context.surface === 'capture') {
    return 'Posso sugerir um destino ou próximos campos, mas a captura continua livre e nenhuma entidade será criada automaticamente.'
  }

  if (context.surface === 'inbox') {
    return 'Revise entradas pendentes uma por vez. Converter exige decisão humana e confirmação.'
  }

  if (context.surface === 'planning') {
    return 'Compare direção e execução atual antes de criar mais trabalho. Não há score ou OKR automático aqui.'
  }

  return 'Use esta leitura para revisar o contexto. A Idea não aplica mudanças nesta fase.'
}
