import { centralHeaderCopy } from '../domain/centralPresentation'

export function CentralHeader() {
  return (
    <header className="central-header">
      <div>
        <small>{centralHeaderCopy.eyebrow}</small>
        <h1>{centralHeaderCopy.title}</h1>
        <p>{centralHeaderCopy.statement}</p>
      </div>
      <span>CTR00</span>
    </header>
  )
}
