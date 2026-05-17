import { PropsWithChildren } from 'react'

type SurfaceSectionProps = PropsWithChildren<{
  title: string
}>

export function SurfaceSection({ title, children }: SurfaceSectionProps) {
  return (
    <section className="surface-section">
      <header className="surface-section__header">
        <h2>{title}</h2>
      </header>

      <div className="surface-section__content">{children}</div>
    </section>
  )
}
