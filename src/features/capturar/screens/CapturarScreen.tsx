import { CaptureSurface } from '../components/CaptureSurface'

export function CapturarScreen() {
  return (
    <section className="capturar-screen">
      <header className="screen-header">
        <div>
          <small>Capturar</small>
          <h1>Entrada transversal</h1>
          <p>Mesma superfície do acesso flutuante, preservada como fallback técnico.</p>
        </div>
      </header>

      <CaptureSurface submitLabel="Enviar" />
    </section>
  )
}
