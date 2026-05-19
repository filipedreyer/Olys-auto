import { OlysSheet } from '../../../design-system'
import { CaptureSurface } from './CaptureSurface'

type CaptureSheetProps = {
  open: boolean
  onClose: () => void
}

export function CaptureSheet({ open, onClose }: CaptureSheetProps) {
  return (
    <OlysSheet
      open={open}
      title="Entrada transversal"
      eyebrow="Capturar"
      description="Sem tipo explícito, entra na Inbox."
      onClose={onClose}
      className="capture-sheet"
      panelClassName="capture-sheet__panel"
      closeAriaLabel="Fechar captura"
    >
      <CaptureSurface onCaptured={onClose} submitLabel="Enviar" />
    </OlysSheet>
  )
}
