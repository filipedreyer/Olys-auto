import type { ReactNode } from "react";
import { EntityRail, type EntityRailKind } from "./EntityRail";

export type OperationalItemState = "default" | "attention" | "completed" | "blocked" | "paused" | "unknown";

export type OperationalItemBaseProps = {
  entity: EntityRailKind;
  title: string;
  context?: string;
  temporalContext?: string;
  state?: OperationalItemState;
  signals?: ReactNode;
  actions?: ReactNode;
};

export function OperationalItemBase({
  entity,
  title,
  context,
  temporalContext,
  state = "default",
  signals,
  actions,
}: OperationalItemBaseProps) {
  return (
    <article className="olys-operational-item" data-state={state}>
      <EntityRail kind={entity} />
      <div>
        <strong>{title}</strong>
        {context ? <p>{context}</p> : null}
        {temporalContext ? <small>{temporalContext}</small> : null}
        {signals}
      </div>
      {actions ? <div aria-label="Acoes rapidas">{actions}</div> : null}
    </article>
  );
}
