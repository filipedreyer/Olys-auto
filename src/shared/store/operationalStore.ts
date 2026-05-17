import { create } from 'zustand'
import { EntityType, OlysItem } from '../../domain/entities/types'
import { mockTodayItems } from '../../features/fazer/domain/mockTodayItems'
import {
  applyInboxTriage,
  InboxTriageAction,
} from '../../features/inbox/domain/inboxTriage'

type CaptureInput = {
  title: string
  type?: EntityType
}

type OperationalStore = {
  items: OlysItem[]
  capture: (input: CaptureInput) => void
  triageInboxItem: (
    id: string,
    action: InboxTriageAction,
    targetType?: EntityType,
  ) => void
}

export const useOperationalStore = create<OperationalStore>((set) => ({
  items: mockTodayItems,
  capture: ({ title, type }) => {
    const trimmedTitle = title.trim()

    if (!trimmedTitle) {
      return
    }

    const resolvedType = type ?? 'inbox'

    set((state) => ({
      items: [
        {
          id: crypto.randomUUID(),
          type: resolvedType,
          title: trimmedTitle,
          state: 'active',
          contextLabel: resolvedType === 'inbox' ? 'Inbox' : 'Captura',
          scheduledLabel: resolvedType === 'lembrete' ? 'Sem janela fixa' : undefined,
          createdAtLabel: 'Agora',
          inboxStatus: resolvedType === 'inbox' ? 'untriaged' : undefined,
          durationMinutes: null,
          capacityDemand: 'unknown',
        },
        ...state.items,
      ],
    }))
  },
  triageInboxItem: (id, action, targetType) => {
    set((state) => ({
      items: applyInboxTriage(state.items, id, { action, targetType }),
    }))
  },
}))
