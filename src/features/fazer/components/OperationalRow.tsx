import { OperationalRowState } from '../../../domain/entities/types'

type OperationalRowProps = {
  title: string
  meta?: string
  detail?: string
  state?: OperationalRowState
  size?: 'regular' | 'featured' | 'secondary' | 'tertiary' | 'compact'
}

export function OperationalRow({
  title,
  meta,
  detail,
  state = 'default',
  size = 'regular',
}: OperationalRowProps) {
  return (
    <article
      className={`operational-row operational-row--${state} operational-row--${size}`}
    >
      <div className="operational-row__indicator" />

      <div className="operational-row__content">
        <strong>{title}</strong>
        {meta ? <span>{meta}</span> : null}
        {detail ? <small>{detail}</small> : null}
      </div>
    </article>
  )
}
