import { OperationalRowState } from '../../../domain/entities/types'

type OperationalRowProps = {
  title: string
  meta?: string
  detail?: string
  state?: OperationalRowState
}

export function OperationalRow({
  title,
  meta,
  detail,
  state = 'default',
}: OperationalRowProps) {
  return (
    <article className={`operational-row operational-row--${state}`}>
      <div className="operational-row__indicator" />

      <div className="operational-row__content">
        <strong>{title}</strong>
        {meta ? <span>{meta}</span> : null}
        {detail ? <small>{detail}</small> : null}
      </div>
    </article>
  )
}
