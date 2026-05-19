type TodayCyclePanelProps = {
  dayState: string
  closingNote: string
  busy: boolean
  onOpening: () => void
  onClosing: () => void
  onClosingNoteChange: (value: string) => void
}

export function TodayCyclePanel({
  dayState,
  closingNote,
  busy,
  onOpening,
  onClosing,
  onClosingNoteChange,
}: TodayCyclePanelProps) {
  return (
    <section className="today-cycle-panel" aria-label="Ciclo do dia">
      <div>
        <small>Ciclo do dia</small>
        <strong>{dayState}</strong>
      </div>

      <div className="today-cycle-panel__actions">
        <button type="button" disabled={busy} onClick={onOpening}>
          Abrir o Dia
        </button>
        <label>
          <span>Nota de fechamento</span>
          <input
            aria-label="Nota de fechamento"
            placeholder="Nota de fechamento"
            value={closingNote}
            onChange={(event) => onClosingNoteChange(event.target.value)}
          />
        </label>
        <button type="button" disabled={busy} onClick={onClosing}>
          Fechar o Dia
        </button>
      </div>
    </section>
  )
}
