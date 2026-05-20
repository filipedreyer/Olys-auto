import type { IdeaOutput, IdeaSafetyResult } from './ideaTypes'

const PERSISTENT_ACTIONS = ['create', 'defer', 'convert', 'link', 'keep']
const BLOCKED_PAYLOAD_KEYS = ['rawPrompt', 'rawResponse', 'freeText', 'password', 'token', 'secret']
const AUTOEXECUTION_TERMS = ['vou aplicar', 'apliquei', 'executado automaticamente', 'sem confirmar']
const SENSITIVE_RISK_TERMS = ['autoagress', 'suic', 'violencia', 'autoles']

export function runIdeaSafetyGate(output: IdeaOutput): IdeaSafetyResult {
  if (output.type === 'reading' || output.type === 'report' || output.type === 'unavailable') {
    return output.action ? block('non_action_output_has_action', 'Esta leitura não pode carregar ação persistente.') : allow()
  }

  if (output.type === 'safety_blocked') {
    return block(output.safety?.reasonCode ?? 'already_blocked', output.safety?.userFacingReason ?? 'A saída foi bloqueada por segurança.')
  }

  if (!output.action) {
    return output.type === 'proposed_action'
      ? block('missing_action', 'A ação proposta não descreve uma ação revisável.')
      : allow()
  }

  if (
    PERSISTENT_ACTIONS.includes(output.action.actionType) &&
    output.requiresConfirmation !== true
  ) {
    return block('persistent_without_confirmation', 'Ação persistente precisa de confirmação antes de qualquer aplicação.')
  }

  if (output.action.destructive && output.requiresConfirmation !== true) {
    return block('destructive_without_confirmation', 'Ação destrutiva precisa de confirmação explícita.')
  }

  if (output.action.payload && hasBlockedPayloadKey(output.action.payload)) {
    return block('unsafe_payload', 'A proposta contém campos que não devem ser operacionalizados pela Idea.')
  }

  if (!output.action.confirmationCopy && output.requiresConfirmation) {
    return block('missing_confirmation_copy', 'A proposta precisa explicar o que seria confirmado.')
  }

  if (containsAny(`${output.title} ${output.description} ${output.action.label}`, AUTOEXECUTION_TERMS)) {
    return block('autoexecution_language', 'A Idea não pode sugerir que aplicou uma ação automaticamente.')
  }

  if (containsAny(`${output.title} ${output.description}`, SENSITIVE_RISK_TERMS)) {
    return block('sensitive_risk_content', 'Conteúdo de risco não pode ser operacionalizado pela Idea.')
  }

  return allow()
}

function allow(): IdeaSafetyResult {
  return { allowed: true, severity: 'info' }
}

function block(reasonCode: string, userFacingReason: string): IdeaSafetyResult {
  return {
    allowed: false,
    reasonCode,
    userFacingReason,
    severity: 'warning',
  }
}

function hasBlockedPayloadKey(payload: Record<string, unknown>): boolean {
  return Object.keys(payload).some((key) => BLOCKED_PAYLOAD_KEYS.includes(key))
}

function containsAny(value: string, terms: string[]) {
  const normalized = value.toLowerCase()

  return terms.some((term) => normalized.includes(term))
}
