import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'

type EntitySheetContextValue = {
  activeEntityId?: string
  openEntitySheet: (id: string) => void
  closeEntitySheet: () => void
}

const EntitySheetContext = createContext<EntitySheetContextValue | undefined>(undefined)

export function EntitySheetProvider({ children }: PropsWithChildren) {
  const [activeEntityId, setActiveEntityId] = useState<string | undefined>()
  const openEntitySheet = useCallback((id: string) => setActiveEntityId(id), [])
  const closeEntitySheet = useCallback(() => setActiveEntityId(undefined), [])
  const value = useMemo(
    () => ({
      activeEntityId,
      openEntitySheet,
      closeEntitySheet,
    }),
    [activeEntityId, closeEntitySheet, openEntitySheet],
  )

  return (
    <EntitySheetContext.Provider value={value}>
      {children}
    </EntitySheetContext.Provider>
  )
}

export function useEntitySheet() {
  const value = useContext(EntitySheetContext)

  if (!value) {
    throw new Error('useEntitySheet must be used within EntitySheetProvider')
  }

  return value
}

export function useOptionalEntitySheet() {
  return useContext(EntitySheetContext)
}
