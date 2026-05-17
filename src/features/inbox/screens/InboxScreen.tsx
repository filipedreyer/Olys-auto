import { mockTodayItems } from '../../fazer/domain/mockTodayItems'

export function InboxScreen() {
  return (
    <section className="inbox-screen">
      <header className="inbox-screen__header">
        <small>Inbox</small>
        <h1>Triagem</h1>
      </header>

      <section className="inbox-screen__list">
        {mockTodayItems.map((item) => (
          <article key={item.id} className="inbox-item">
            <strong>{item.title}</strong>
            <span>{item.type}</span>
          </article>
        ))}
      </section>
    </section>
  )
}
