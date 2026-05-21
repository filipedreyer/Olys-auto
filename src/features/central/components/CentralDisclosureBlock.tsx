import type { PropsWithChildren } from 'react'

type CentralDisclosureBlockProps = PropsWithChildren<{
  title: string
  tone?: 'neutral' | 'attention' | 'danger'
}>

export function CentralDisclosureBlock({
  title,
  tone = 'neutral',
  children,
}: CentralDisclosureBlockProps) {
  return (
    <aside className="central-disclosure-block" data-tone={tone}>
      <strong>{title}</strong>
      <div>{children}</div>
    </aside>
  )
}
