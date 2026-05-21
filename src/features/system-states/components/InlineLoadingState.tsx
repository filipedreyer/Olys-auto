export function InlineLoadingState({ label = 'Carregando' }: { label?: string }) {
  return (
    <p className="inline-loading-state" role="status">
      {label}
    </p>
  )
}
