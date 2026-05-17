type FocusIndicatorProps = {
  label: string
}

export function FocusIndicator({ label }: FocusIndicatorProps) {
  return <span className="focus-indicator">{label}</span>
}
