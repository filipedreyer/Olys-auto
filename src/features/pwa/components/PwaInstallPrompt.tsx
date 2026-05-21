import { OlysButton } from '../../../design-system'
import { usePwaInstallState } from '../domain/pwaInstallState'

export function PwaInstallPrompt() {
  const installState = usePwaInstallState()

  if (installState.dismissed) {
    return null
  }

  return (
    <aside className="pwa-install-prompt" aria-label="Instalação PWA">
      <div>
        <small>Instalação</small>
        <p>
          {installState.ready
            ? 'Este browser permite tentar instalar o Olys.'
            : 'Instalação depende do browser. O app continua funcionando no navegador.'}
        </p>
      </div>
      <div className="pwa-install-prompt__actions">
        <OlysButton
          variant="secondary"
          disabled={!installState.ready}
          onClick={() => void installState.install()}
        >
          Instalar
        </OlysButton>
        <OlysButton variant="quiet" onClick={installState.dismiss}>
          Agora não
        </OlysButton>
      </div>
    </aside>
  )
}
