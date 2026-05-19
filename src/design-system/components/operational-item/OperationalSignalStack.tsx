import type { OperationalItemSignal } from "./operationalItemTypes";

const defaultLabelByKind: Record<OperationalItemSignal["kind"], string> = {
  essential: "Essencial",
  high_priority: "Alta",
  scheduled: "Agenda",
  dependency: "Dependencia",
  overdue: "Atrasado",
  unknown: "Unknown",
  blocked: "Bloqueado",
};

export type OperationalSignalStackProps = {
  signals?: readonly OperationalItemSignal[];
  limit?: number;
};

export function OperationalSignalStack({ signals = [], limit = 4 }: OperationalSignalStackProps) {
  const visibleSignals = signals.slice(0, limit);
  const hiddenCount = Math.max(0, signals.length - visibleSignals.length);

  if (visibleSignals.length === 0) {
    return null;
  }

  return (
    <div className="olys-operational-signals" aria-label="Sinais operacionais">
      {visibleSignals.map((signal, index) => {
        const label = signal.label ?? defaultLabelByKind[signal.kind];

        return (
          <span
            key={`${signal.kind}-${index}`}
            className="olys-operational-signal"
            data-signal={signal.kind}
            aria-label={signal.ariaLabel ?? label}
          >
            {label}
          </span>
        );
      })}
      {hiddenCount > 0 ? (
        <span className="olys-operational-signal" data-signal="more" aria-label={`${hiddenCount} sinais adicionais`}>
          +{hiddenCount}
        </span>
      ) : null}
    </div>
  );
}
