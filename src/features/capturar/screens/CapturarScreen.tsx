import { CaptureSurface } from '../components/CaptureSurface'

export function CapturarScreen() {
  return (
    <section className="capturar-screen">
      <header className="screen-header">
        <div>
          <small>Capturar</small>
          <h1>Entrada transversal</h1>
        </div>
      </header>

      <CaptureSurface />
    </section>
  )
}
