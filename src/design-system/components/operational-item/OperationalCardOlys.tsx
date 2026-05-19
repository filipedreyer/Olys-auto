import { OperationalActions } from "./OperationalActions";
import { OperationalItemBase, type OperationalItemBaseProps } from "./OperationalItemBase";
import { OperationalSignalStack } from "./OperationalSignalStack";
import type { OperationalItemAction, OperationalItemSignal } from "./operationalItemTypes";

export type OperationalCardOlysProps = Omit<OperationalItemBaseProps, "actions" | "signals" | "variant"> & {
  signals?: readonly OperationalItemSignal[];
  actions?: readonly OperationalItemAction[];
};

export function OperationalCardOlys({
  className = "",
  density = "featured",
  signals,
  actions,
  ...props
}: OperationalCardOlysProps) {
  return (
    <OperationalItemBase
      {...props}
      density={density}
      variant="card"
      className={`olys-operational-card ${className}`.trim()}
      signals={<OperationalSignalStack signals={signals} />}
      actions={<OperationalActions actions={actions} />}
    />
  );
}
