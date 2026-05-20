import type { MemoryProjection } from '../domain/memoryProjection'

type MemoryReadingBandProps = {
  projection: MemoryProjection
}

export function MemoryReadingBand({ projection }: MemoryReadingBandProps) {
  const readings = [
    ['Concluídos', projection.continuity.recentCompletions, 'histórico operacional'],
    ['Arquivados', projection.continuity.archived, 'fora do fluxo ativo'],
    ['Caixola', projection.continuity.caixola, 'incubação separada da Inbox'],
    ['Templates', projection.continuity.reusableTemplates, 'modelos reutilizáveis'],
    ['Recuperáveis', projection.continuity.recoverable, 'contexto restaurável'],
  ] as const

  return (
    <section className="memory-reading-band" aria-label="Leituras de memória">
      {readings.map(([label, value, detail]) => (
        <article key={label} className="memory-reading-card">
          <span>{label}</span>
          <strong>{value}</strong>
          <p>{detail}</p>
        </article>
      ))}
    </section>
  )
}
