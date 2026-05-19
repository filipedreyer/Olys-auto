import { useOperationalStore } from '../../../shared/store/operationalStore'
import { EntityType } from '../../../domain/entities/types'
import { InboxHeader } from '../components/InboxHeader'
import { InboxReadingBand } from '../components/InboxReadingBand'
import { InboxRevisitLayer } from '../components/InboxRevisitLayer'
import { InboxTriageLayer } from '../components/InboxTriageLayer'
import { buildInboxProjection } from '../domain/inboxProjection'

export function InboxScreen() {
  const inboxItems = useOperationalStore((state) => state.inboxItems)
  const triageInboxItem = useOperationalStore((state) => state.triageInboxItem)
  const status = useOperationalStore((state) => state.status)
  const projection = buildInboxProjection(inboxItems)
  const busy = status === 'loading'
  const keepInboxItem = (id: string) => triageInboxItem(id, 'keep')
  const convertInboxItem = (id: string, targetType: EntityType) =>
    triageInboxItem(id, 'convert', targetType)
  const completeInboxItem = (id: string) => triageInboxItem(id, 'complete')
  const postponeInboxItem = (id: string) => triageInboxItem(id, 'postpone')
  const discardInboxItem = (id: string) => triageInboxItem(id, 'discard')

  return (
    <section className="inbox-screen">
      <InboxHeader readings={projection.readings} />
      <InboxReadingBand readings={projection.readings} />
      <InboxTriageLayer
        items={projection.triageItems}
        busy={busy}
        onKeep={keepInboxItem}
        onConvert={convertInboxItem}
        onComplete={completeInboxItem}
        onPostpone={postponeInboxItem}
        onDiscard={discardInboxItem}
      />
      <InboxRevisitLayer
        items={projection.revisitItems}
        busy={busy}
        onConvert={convertInboxItem}
        onComplete={completeInboxItem}
        onDiscard={discardInboxItem}
      />
    </section>
  )
}
