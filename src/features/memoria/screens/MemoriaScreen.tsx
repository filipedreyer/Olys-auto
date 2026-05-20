import { useOperationalStore } from '../../../shared/store/operationalStore'
import { buildMemoryProjection } from '../domain/memoryProjection'
import { MemoryArchiveLayer } from '../components/MemoryArchiveLayer'
import { MemoryAttachmentsLayer } from '../components/MemoryAttachmentsLayer'
import { MemoryCaixolaLayer } from '../components/MemoryCaixolaLayer'
import { MemoryCompletedLayer } from '../components/MemoryCompletedLayer'
import { MemoryHeader } from '../components/MemoryHeader'
import { MemoryReadingBand } from '../components/MemoryReadingBand'
import { MemoryRecoveryLayer } from '../components/MemoryRecoveryLayer'
import { MemorySearchLayer } from '../components/MemorySearchLayer'
import { MemorySubareaGrid } from '../components/MemorySubareaGrid'
import { MemoryTemplatesLayer } from '../components/MemoryTemplatesLayer'

export function MemoriaScreen() {
  const items = useOperationalStore((state) => state.items)
  const inboxItems = useOperationalStore((state) => state.inboxItems)
  const links = useOperationalStore((state) => state.links)
  const dependencies = useOperationalStore((state) => state.dependencies)
  const status = useOperationalStore((state) => state.status)
  const restoreItem = useOperationalStore((state) => state.restoreItem)
  const reuseTemplate = useOperationalStore((state) => state.reuseTemplate)
  const projection = buildMemoryProjection(items, inboxItems, links, dependencies)
  const busy = status === 'loading'

  return (
    <section className="memoria-screen">
      <MemoryHeader projection={projection} />
      <MemoryReadingBand projection={projection} />
      <MemorySubareaGrid subareas={projection.subareas} />

      <MemoryRecoveryLayer
        items={projection.recovery}
        busy={busy}
        onRestore={(id) => void restoreItem(id)}
      />
      <MemoryCaixolaLayer items={projection.caixola} busy={busy} />
      <MemoryTemplatesLayer
        items={projection.templates}
        busy={busy}
        onReuse={(id) => void reuseTemplate(id)}
      />
      <MemoryArchiveLayer
        items={projection.archived}
        busy={busy}
        onRestore={(id) => void restoreItem(id)}
      />
      <MemoryCompletedLayer
        items={projection.completed}
        busy={busy}
        onRestore={(id) => void restoreItem(id)}
      />
      <MemoryAttachmentsLayer items={projection.attachments} />
      <MemorySearchLayer
        items={projection.search}
        busy={busy}
        onRestore={(id) => void restoreItem(id)}
        onReuse={(id) => void reuseTemplate(id)}
      />
    </section>
  )
}
