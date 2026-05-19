import type { InboxProjection } from '../domain/inboxProjection'

type InboxHeaderProps = {
  readings: InboxProjection['readings']
}

export function InboxHeader({ readings }: InboxHeaderProps) {
  const total = readings.pending + readings.revisit

  return (
    <header className="inbox-header">
      <div>
        <small>Inbox</small>
        <h1>Fronteira de decisão</h1>
        <p>{readings.statement}</p>
      </div>
      <span className="inbox-header__count" aria-label={`${total} entradas na Inbox`}>
        {total} entrada(s)
      </span>
    </header>
  )
}
