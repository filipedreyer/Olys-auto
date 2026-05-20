type DiaryClosingFieldProps = {
  value: string
  disabled?: boolean
  onChange: (value: string) => void
}

export function DiaryClosingField({
  value,
  disabled = false,
  onChange,
}: DiaryClosingFieldProps) {
  return (
    <label className="diary-closing-field">
      <span>Registro mínimo</span>
      <textarea
        aria-label="Registro mínimo de fechamento"
        disabled={disabled}
        placeholder="Contexto mínimo para retomar depois"
        rows={3}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      <small>Não precisa explicar o dia inteiro.</small>
    </label>
  )
}
