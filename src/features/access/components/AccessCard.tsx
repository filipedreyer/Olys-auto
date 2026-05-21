import type { PropsWithChildren, ReactNode } from 'react'

type AccessCardProps = PropsWithChildren<{
  eyebrow: string
  title: string
  description: string
  aside?: ReactNode
}>

export function AccessCard({
  eyebrow,
  title,
  description,
  aside,
  children,
}: AccessCardProps) {
  return (
    <section className="access-card">
      <header>
        <small>{eyebrow}</small>
        <h1>{title}</h1>
        <p>{description}</p>
      </header>
      {children}
      {aside}
    </section>
  )
}
