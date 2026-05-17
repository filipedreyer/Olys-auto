type OperationalRowProps = {
  title: string
  meta?: string
  state?: 'default' | 'attention' | 'completed'
}

export function OperationalRow({
  title,
  meta,
  state = 'default',
}: OperationalRowProps) {
  return (
    <article className={`operational-row operational-row--${state}`}>
      <div className="operational-row__indicator" />

      <div className="operational-row__content">
        <strong>{title}</strong>

        {meta ? <span>{meta}</span> : null}
      </div>
    </article>
  )
}
