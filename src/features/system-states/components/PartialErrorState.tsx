import { getPartialErrorCopy } from '../domain/systemStatePresentation'

export function PartialErrorState({ detail }: { detail?: string }) {
  return (
    <section className="partial-error-state" role="alert">
      <strong>Erro parcial</strong>
      <p>{detail ?? getPartialErrorCopy()}</p>
    </section>
  )
}
