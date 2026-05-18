import { create } from 'zustand'
import {
  closeDay,
  openDay,
} from '../../domain/commands/dailySessionCommands'
import {
  applyEssentialProtected,
  archiveItem,
  completeItem,
  createItem,
  removeEssentialProtected,
  restoreItem,
  softDeleteItem,
  updateItem,
} from '../../domain/commands/itemCommands'
import { createLink, removeLink } from '../../domain/commands/linkCommands'
import {
  createDependency,
  removeDependency,
} from '../../domain/commands/dependencyCommands'
import {
  DailySession,
  DependencyEdge,
  EntityCondition,
  EntityLink,
  EntityType,
  InboxItem,
  OlysItem,
} from '../../domain/entities/types'
import {
  seedConditions,
  seedDependencyEdges,
  seedEntityLinks,
  seedInboxItems,
  seedItems,
  seedUserId,
} from '../../domain/entities/seedData'
import {
  applyInboxTriage,
  createInboxItem,
  InboxTriageAction,
} from '../../features/inbox/domain/inboxTriage'

type CaptureInput = {
  title: string
  type?: EntityType
}

type OperationalStore = {
  userId: string
  items: OlysItem[]
  inboxItems: InboxItem[]
  conditions: EntityCondition[]
  links: EntityLink[]
  dependencies: DependencyEdge[]
  dailySessions: DailySession[]
  capture: (input: CaptureInput) => void
  triageInboxItem: (
    id: string,
    action: InboxTriageAction,
    targetType?: EntityType,
  ) => void
  completeItem: (id: string) => void
  archiveItem: (id: string) => void
  restoreItem: (id: string) => void
  softDeleteItem: (id: string) => void
  applyEssentialProtected: (id: string) => void
  removeEssentialProtected: (id: string) => void
  createDependency: (input: {
    predecessorId: string
    successorId: string
    justification: string
    impact: string
  }) => void
  removeDependency: (id: string) => void
  createLink: (input: { sourceEntityId: string; targetEntityId: string }) => void
  removeLink: (id: string) => void
  openDay: (date: string) => void
  closeDay: (date: string, closingNote: string) => void
}

export const useOperationalStore = create<OperationalStore>((set, get) => ({
  userId: seedUserId,
  items: seedItems,
  inboxItems: seedInboxItems,
  conditions: seedConditions,
  links: seedEntityLinks,
  dependencies: seedDependencyEdges,
  dailySessions: [],
  capture: ({ title, type }) => {
    const userId = get().userId

    if (type) {
      set((state) => ({
        items: createItem(state.items, {
          userId,
          entityType: type,
          title,
          sourceContext: 'capture',
          durationMinutes: null,
        }),
      }))
      return
    }

    set((state) => ({
      inboxItems: createInboxItem(state.inboxItems, {
        userId,
        text: title,
        sourceContext: 'capture',
      }),
    }))
  },
  triageInboxItem: (id, action, targetType) => {
    set((state) =>
      applyInboxTriage(state.inboxItems, state.items, id, {
        action,
        targetType,
      }),
    )
  },
  completeItem: (id) => {
    set((state) => ({ items: completeItem(state.items, id) }))
  },
  archiveItem: (id) => {
    set((state) => ({ items: archiveItem(state.items, id) }))
  },
  restoreItem: (id) => {
    set((state) => ({ items: restoreItem(state.items, id) }))
  },
  softDeleteItem: (id) => {
    set((state) => ({ items: softDeleteItem(state.items, id) }))
  },
  applyEssentialProtected: (id) => {
    set((state) => {
      const item = state.items.find((candidate) => candidate.id === id)

      return item
        ? { conditions: applyEssentialProtected(state.conditions, item) }
        : state
    })
  },
  removeEssentialProtected: (id) => {
    set((state) => ({
      conditions: removeEssentialProtected(state.conditions, id),
    }))
  },
  createDependency: (input) => {
    set((state) => {
      const result = createDependency(state.items, state.dependencies, {
        ...input,
        userId: state.userId,
        type: 'blocks',
        source: 'manual',
      })

      return result.error ? state : { dependencies: result.edges }
    })
  },
  removeDependency: (id) => {
    set((state) => ({ dependencies: removeDependency(state.dependencies, id) }))
  },
  createLink: (input) => {
    set((state) => ({
      links: createLink(state.links, {
        ...input,
        userId: state.userId,
        linkType: 'relates_to',
      }),
    }))
  },
  removeLink: (id) => {
    set((state) => ({ links: removeLink(state.links, id) }))
  },
  openDay: (date) => {
    set((state) => ({
      dailySessions: openDay(state.dailySessions, {
        userId: state.userId,
        date,
      }),
    }))
  },
  closeDay: (date, closingNote) => {
    set((state) => ({
      dailySessions: closeDay(state.dailySessions, {
        userId: state.userId,
        date,
        closingNote,
      }),
    }))
  },
}))

export { updateItem }
