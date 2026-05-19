import type { InboxProjection } from '../domain/inboxProjection'

type InboxReadingBandProps = {
  readings: InboxProjection['readings']
}

export function InboxReadingBand({ readings }: InboxReadingBandProps) {
  return (
    <section className="inbox-reading-band" aria-label="Leitura da Inbox">
      <article className="inbox-reading-card inbox-reading-card--primary">
        <span>Triagem nova</span>
        <strong>{readings.pending}</strong>
      </article>
      <article className="inbox-reading-card">
        <span>Revisita</span>
        <strong>{readings.revisit}</strong>
      </article>
      <article className="inbox-reading-card inbox-reading-card--quiet">
        <span>Adiadas</span>
        <strong>{readings.postponed}</strong>
      </article>
      <p>{readings.statement}</p>
    </section>
  )
}
