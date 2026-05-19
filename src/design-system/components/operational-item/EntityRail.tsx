import type { OperationalItemDensity, OperationalItemVisualEntity } from "./operationalItemTypes";

export type EntityRailKind = OperationalItemVisualEntity;

const railTokenByKind: Record<EntityRailKind, string> = {
  task: "var(--olys-entity-task)",
  project: "var(--olys-entity-project)",
  goal: "var(--olys-entity-goal)",
  note: "var(--olys-entity-note)",
  list: "var(--olys-entity-list)",
  habit: "var(--olys-entity-habit)",
  routine: "var(--olys-entity-routine)",
  event: "var(--olys-entity-event)",
  reminder: "var(--olys-entity-reminder)",
  agenda: "var(--olys-entity-agenda)",
  template: "var(--olys-entity-template)",
  unclassified: "var(--olys-entity-unclassified)",
};

export type EntityRailProps = {
  kind: EntityRailKind;
  density?: OperationalItemDensity;
  variant?: "row" | "card";
};

export function EntityRail({ kind, density = "regular", variant = "row" }: EntityRailProps) {
  return (
    <span
      className="olys-entity-rail"
      aria-hidden="true"
      data-density={density}
      data-entity={kind}
      data-variant={variant}
      style={{ background: railTokenByKind[kind] }}
    />
  );
}
