import type { InputHTMLAttributes } from 'react'

type AccessFormFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  error?: string
}

export function AccessFormField({
  label,
  error,
  id,
  ...props
}: AccessFormFieldProps) {
  const fieldId = id ?? props.name
  const errorId = error && fieldId ? `${fieldId}-error` : undefined

  return (
    <label className="access-form-field" htmlFor={fieldId}>
      <span>{label}</span>
      <input id={fieldId} aria-describedby={errorId} aria-invalid={Boolean(error)} {...props} />
      {error ? <small id={errorId} role="alert">{error}</small> : null}
    </label>
  )
}
