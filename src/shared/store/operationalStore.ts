import { create } from 'zustand'
import {
  archiveItem,
  applyEssentialProtected,
  captureInput,
  closeDay,
  completeItem,
  convertInboxItem,
  createDependency,
  createLink,
  loadOperationalSnapshot,
  openDay,
  postponeInboxItem,
  removeDependency,
  removeEssentialProtected,
  removeLink,
  restoreItem,
  softDeleteItem,
  triageInboxItem as triageInboxCommand,
  updateItem,
} from '../commands/operationalCommandHandlers'
import { seedUserId } from '../../domain/entities/seedData'
import {
  DailySession,
  DependencyEdge,
  EntityCondition,
  EntityLink,
  EntityType,
  InboxItem,
  OlysItem,
} from '../../domain/entities/types'
import { InboxTriageAction } from '../../features/inbox/domain/inboxTriage'

type CaptureInput = {
  title: string
  type?: EntityType
}

type StoreStatus = 'idle' | 'loading' | 'ready' | 'error'

type OperationalStore = {
  status: StoreStatus
  error?: string
  userId: string
  items: OlysItem[]
  inboxItems: InboxItem[]
  conditions: EntityCondition[]
  links: EntityLink[]
  dependencies: DependencyEdge[]
  dailySessions: DailySession[]
  hydrate: (userId: string) => Promise<void>
  clearForUnauthenticated: () => void
  capture: (input: CaptureInput) => Promise<void>
  triageInboxItem: (
    id: string,
    action: InboxTriageAction,
    targetType?: EntityType,
  ) => Promise<void>
  completeItem: (id: string) => Promise<void>
  archiveItem: (id: string) => Promise<void>
  restoreItem: (id: string) => Promise<void>
  softDeleteItem: (id: string) => Promise<void>
  applyEssentialProtected: (id: string) => Promise<void>
  removeEssentialProtected: (id: string) => Promise<void>
  createDependency: (input: {
    predecessorId: string
    successorId: string
    justification: string
    impact: string
  }) => Promise<void>
  removeDependency: (id: string) => Promise<void>
  createLink: (input: { sourceEntityId: string; targetEntityId: string }) => Promise<void>
  removeLink: (id: string) => Promise<void>
  openDay: (date: string) => Promise<void>
  closeDay: (date: string, closingNote: string) => Promise<void>
}

type StoreSet = (
  partial:
    | OperationalStore
    | Partial<OperationalStore>
    | ((state: OperationalStore) => OperationalStore | Partial<OperationalStore>),
  replace?: false,
) => void

export const useOperationalStore = create<OperationalStore>((set, get) => ({
  status: 'idle',
  userId: seedUserId,
  items: [],
  inboxItems: [],
  conditions: [],
  links: [],
  dependencies: [],
  dailySessions: [],
  hydrate: async (userId) => {
    set({ status: 'loading', error: undefined, userId })

    try {
      const snapshot = await loadOperationalSnapshot(userId)

      set({
        ...snapshot,
        status: 'ready',
        error: undefined,
      })
    } catch (error) {
      set({
        status: 'error',
        error: error instanceof Error ? error.message : 'Persistence error',
      })
    }
  },
  clearForUnauthenticated: () => {
    set({
      status: 'ready',
      items: [],
      inboxItems: [],
      conditions: [],
      links: [],
      dependencies: [],
      dailySessions: [],
      error: undefined,
    })
  },
  capture: async (input) => {
    await runAndApply(set, () =>
      captureInput({
        userId: get().userId,
        ...input,
      }),
    )
  },
  triageInboxItem: async (id, action, targetType) => {
    await runAndApply(set, () => {
      const userId = get().userId

      if (action === 'convert') {
        return convertInboxItem(userId, id, targetType)
      }

      if (action === 'postpone') {
        return postponeInboxItem(userId, id)
      }

      return triageInboxCommand(userId, id, action)
    })
  },
  completeItem: async (id) => {
    await runAndApply(set, () => completeItem(get().userId, id))
  },
  archiveItem: async (id) => {
    await runAndApply(set, () => archiveItem(get().userId, id))
  },
  restoreItem: async (id) => {
    await runAndApply(set, () => restoreItem(get().userId, id))
  },
  softDeleteItem: async (id) => {
    await runAndApply(set, () => softDeleteItem(get().userId, id))
  },
  applyEssentialProtected: async (id) => {
    await runAndApply(set, () => applyEssentialProtected(get().userId, id))
  },
  removeEssentialProtected: async (id) => {
    await runAndApply(set, () => removeEssentialProtected(get().userId, id))
  },
  createDependency: async (input) => {
    await runAndApply(set, () =>
      createDependency({
        userId: get().userId,
        ...input,
      }),
    )
  },
  removeDependency: async (id) => {
    await runAndApply(set, () => removeDependency(get().userId, id))
  },
  createLink: async (input) => {
    await runAndApply(set, () =>
      createLink({
        userId: get().userId,
        ...input,
      }),
    )
  },
  removeLink: async (id) => {
    await runAndApply(set, () => removeLink(get().userId, id))
  },
  openDay: async (date) => {
    await runAndApply(set, () => openDay(get().userId, date))
  },
  closeDay: async (date, closingNote) => {
    await runAndApply(set, () => closeDay(get().userId, date, closingNote))
  },
}))

async function runAndApply(
  set: StoreSet,
  action: () => Promise<Awaited<ReturnType<typeof loadOperationalSnapshot>>>,
) {
  set({ status: 'loading', error: undefined })

  try {
    const snapshot = await action()

    set({
      ...snapshot,
      status: 'ready',
      error: undefined,
    })
  } catch (error) {
    set({
      status: 'error',
      error: error instanceof Error ? error.message : 'Persistence error',
    })
  }
}

export { updateItem }
