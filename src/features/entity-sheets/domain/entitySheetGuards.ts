import type { OlysItem } from '../../../domain/entities/types'
import type { EntitySheetField } from './entitySheetTypes'

const blockedPatchKeys = new Set([
  'id',
  'userId',
  'entityType',
  'createdAt',
  'links',
  'dependencies',
  'publicAttachmentUrl',
  'attachmentUrl',
  'storagePath',
  'projectStageEntity',
  'milestoneEntity',
  'riskEntity',
  'eventPrepEntity',
])

export type EntitySheetGuardResult = {
  allowed: boolean
  reason?: string
}

export function canEditEntitySheetField(field: EntitySheetField): EntitySheetGuardResult {
  if (field.role !== 'editable' || !field.editable) {
    return {
      allowed: false,
      reason: 'Campos derivados, históricos e contratos futuros não são editáveis.',
    }
  }

  if (blockedPatchKeys.has(field.key)) {
    return {
      allowed: false,
      reason: 'Campo protegido pela ontologia do Olys.',
    }
  }

  return { allowed: true }
}

export function validateEntitySheetPatch(
  item: OlysItem,
  patch: Partial<OlysItem> & Record<string, unknown>,
): EntitySheetGuardResult {
  const patchKeys = Object.keys(patch)

  if (patchKeys.length === 0) {
    return {
      allowed: false,
      reason: 'Patch vazio não é uma edição controlada.',
    }
  }

  if (item.status === 'deleted') {
    return {
      allowed: false,
      reason: 'Item removido não aceita edição direta; restauração é ação separada.',
    }
  }

  const blockedKey = patchKeys.find((key) => blockedPatchKeys.has(key))

  if (blockedKey) {
    return {
      allowed: false,
      reason: `${blockedKey} não pode ser editado por Entity Sheet.`,
    }
  }

  if ('metadata' in patch) {
    return {
      allowed: false,
      reason: 'Metadata livre não é formulário universal; precisa de contrato específico.',
    }
  }

  return { allowed: true }
}

export function canCreatePublicAttachment() {
  return {
    allowed: false,
    reason: 'Anexos exigem storage privado, metadata e permissões; URL pública é bloqueada.',
  } satisfies EntitySheetGuardResult
}

export function canCreateDerivedEntity(kind: 'project_stage' | 'milestone' | 'risk' | 'event_prep') {
  return {
    allowed: false,
    reason: `${kind} é contrato/metadata controlada, não entidade nova.`,
  } satisfies EntitySheetGuardResult
}
