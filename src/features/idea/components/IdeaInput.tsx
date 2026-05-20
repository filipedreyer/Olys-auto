import { FormEvent, useState } from 'react'
import { OlysButton } from '../../../design-system'

type IdeaInputProps = {
  onSubmit: (text: string) => void
  onGenerateReading: () => void
}

export function IdeaInput({ onSubmit, onGenerateReading }: IdeaInputProps) {
  const [value, setValue] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onSubmit(value)
    setValue('')
  }

  return (
    <form className="idea-input" onSubmit={handleSubmit}>
      <label>
        <span>Pedido contextual</span>
        <textarea
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Pergunte pelo próximo passo, risco ou reorganização possível"
          rows={3}
        />
      </label>
      <div className="idea-input__actions">
        <OlysButton variant="secondary" type="button" onClick={onGenerateReading}>
          Gerar leitura contextual
        </OlysButton>
        <OlysButton variant="primary" type="submit">
          Enviar
        </OlysButton>
      </div>
    </form>
  )
}
