import type { ReactNode } from "react";
import { EntityRail } from "./EntityRail";
import type {
  OperationalItemDensity,
  OperationalItemVisualEntity,
  OperationalItemVisualState,
} from "./operationalItemTypes";

export type OperationalItemState = OperationalItemVisualState;

export type OperationalItemBaseProps = {
  entity: OperationalItemVisualEntity;
  title: string;
  context?: string;
  temporalContext?: string;
  detail?: string;
  state?: OperationalItemVisualState;
  density?: OperationalItemDensity;
  signals?: ReactNode;
  actions?: ReactNode;
  reason?: string;
  className?: string;
  variant?: "row" | "card";
};

export function OperationalItemBase({
  entity,
  title,
  context,
  temporalContext,
  detail,
  state = "default",
  density = "regular",
  signals,
  actions,
  reason,
  className = "",
  variant = "row",
}: OperationalItemBaseProps) {
  return (
    <article
      className={`olys-operational-item ${className}`.trim()}
      data-density={density}
      data-entity={entity}
      data-state={state}
      data-variant={variant}
    >
      <EntityRail kind={entity} density={density} variant={variant} />
      <div className="olys-operational-item__body">
        <div className="olys-operational-item__main">
          <strong className="olys-operational-item__title">{title}</strong>
          {context ? <span className="olys-operational-item__context">{context}</span> : null}
          {temporalContext ? <small className="olys-operational-item__time">{temporalContext}</small> : null}
          {detail ? <p className="olys-operational-item__detail">{detail}</p> : null}
          {reason ? <small className="olys-operational-item__reason">{reason}</small> : null}
        </div>
        {signals ? <div className="olys-operational-item__signals">{signals}</div> : null}
      </div>
      {actions ? <div className="olys-operational-item__actions">{actions}</div> : null}
    </article>
  );
}
