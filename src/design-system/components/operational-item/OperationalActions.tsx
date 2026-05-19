import type { OperationalItemAction } from "./operationalItemTypes";

const defaultLabelByKind: Record<OperationalItemAction["kind"], string> = {
  complete: "Concluir",
  review: "Revisar",
  open: "Abrir",
  defer: "Adiar",
  more: "Mais",
};

export type OperationalActionsProps = {
  actions?: readonly OperationalItemAction[];
};

export function OperationalActions({ actions = [] }: OperationalActionsProps) {
  if (actions.length === 0) {
    return null;
  }

  return (
    <div className="olys-operational-actions" aria-label="Acoes rapidas">
      {actions.map((action) => {
        const label = action.label ?? defaultLabelByKind[action.kind];

        return (
          <button
            key={action.kind}
            className="olys-operational-action"
            type="button"
            aria-label={action.ariaLabel ?? label}
            disabled={action.disabled}
            onClick={action.onSelect}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
