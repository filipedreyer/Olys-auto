import { accessTrustCopy } from '../domain/accessPresentation'

export function AccessTrustBlock() {
  return (
    <aside className="access-trust-block" aria-label="Confiança e privacidade">
      <small>Confiança</small>
      {accessTrustCopy.map((copy) => (
        <p key={copy}>{copy}</p>
      ))}
    </aside>
  )
}
