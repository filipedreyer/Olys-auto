import { CaptureSurface } from './CaptureSurface'

type CaptureSheetProps = {
  open: boolean
  onClose: () => void
}

export function CaptureSheet({ open, onClose }: CaptureSheetProps) {
  if (!open) {
    return null
  }

  return (
    <div className="capture-sheet" role="dialog" aria-modal="true">
      <button
        className="capture-sheet__backdrop"
        type="button"
        aria-label="Fechar captura"
        onClick={onClose}
      />
      <section className="capture-sheet__panel" aria-label="Capturar">
        <header className="capture-sheet__header">
          <div>
            <small>Capturar</small>
            <h2>Entrada transversal</h2>
          </div>
          <button type="button" onClick={onClose}>
            Fechar
          </button>
        </header>

        <CaptureSurface onCaptured={onClose} />
      </section>
    </div>
  )
}
