import type { IdeaOutput } from './ideaTypes'
import { runIdeaSafetyGate } from './ideaSafetyGate'

export function guardIdeaOutputs(outputs: IdeaOutput[]): IdeaOutput[] {
  return outputs.map(guardIdeaOutput)
}

export function guardIdeaOutput(output: IdeaOutput): IdeaOutput {
  const normalized = normalizeOutput(output)
  const safety = runIdeaSafetyGate(normalized)

  if (!safety.allowed) {
    return {
      ...normalized,
      id: `${normalized.id}-blocked`,
      type: 'safety_blocked',
      title: 'Ação bloqueada',
      description: safety.userFacingReason ?? 'A Idea bloqueou esta saída por segurança.',
      action: undefined,
      requiresConfirmation: false,
      confidence: 'low',
      safety,
    }
  }

  return {
    ...normalized,
    safety,
  }
}

function normalizeOutput(output: IdeaOutput): IdeaOutput {
  if (output.type === 'proposed_action' && output.requiresConfirmation !== true) {
    return {
      ...output,
      requiresConfirmation: true,
    }
  }

  if ((output.type === 'reading' || output.type === 'report') && output.action) {
    return {
      ...output,
      action: undefined,
      requiresConfirmation: false,
    }
  }

  if (output.action && output.requiresConfirmation && !output.action.confirmationCopy) {
    return {
      ...output,
      action: {
        ...output.action,
        confirmationCopy: 'Revise a consequência antes de aplicar em fase futura.',
      },
    }
  }

  return output
}

export function unavailableIdeaOutput(sourceSurface: IdeaOutput['sourceSurface']): IdeaOutput {
  return {
    id: `idea-unavailable-${sourceSurface}`,
    type: 'unavailable',
    title: 'IA real indisponível',
    description: 'O app continua funcionando. Nesta fase, Idea usa leitura local determinística e não chama serviço externo.',
    confidence: 'low',
    assumptions: ['Nenhuma integração externa segura foi chamada.'],
    missingInformation: ['Modelo real, versionamento de prompt e Safety Gate produtivo.'],
    sourceSurface,
    createdAt: new Date().toISOString(),
    requiresConfirmation: false,
  }
}
