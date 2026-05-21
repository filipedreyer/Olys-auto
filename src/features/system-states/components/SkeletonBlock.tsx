type SkeletonBlockProps = {
  label?: string
}

export function SkeletonBlock({ label = 'Carregando contexto' }: SkeletonBlockProps) {
  return (
    <div className="skeleton-block" role="status" aria-label={label}>
      <span />
      <span />
      <span />
    </div>
  )
}
