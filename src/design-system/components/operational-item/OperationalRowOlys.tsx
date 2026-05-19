import { OperationalActions } from "./OperationalActions";
import { OperationalItemBase, type OperationalItemBaseProps } from "./OperationalItemBase";
import { OperationalSignalStack } from "./OperationalSignalStack";
import type { OperationalItemAction, OperationalItemSignal } from "./operationalItemTypes";

export type OperationalRowOlysProps = Omit<OperationalItemBaseProps, "actions" | "signals" | "variant"> & {
  signals?: readonly OperationalItemSignal[];
  actions?: readonly OperationalItemAction[];
};

export function OperationalRowOlys({
  className = "",
  density = "regular",
  signals,
  actions,
  ...props
}: OperationalRowOlysProps) {
  return (
    <OperationalItemBase
      {...props}
      density={density}
      variant="row"
      className={`olys-operational-row ${className}`.trim()}
      signals={<OperationalSignalStack signals={signals} />}
      actions={<OperationalActions actions={actions} />}
    />
  );
}
