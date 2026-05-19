export type OperationalItemVisualEntity =
  | "goal"
  | "project"
  | "task"
  | "habit"
  | "routine"
  | "agenda"
  | "event"
  | "reminder"
  | "note"
  | "list"
  | "template"
  | "unclassified";

export type OperationalItemVisualState =
  | "default"
  | "attention"
  | "blocked"
  | "paused"
  | "completed"
  | "unknown";

export type OperationalItemDensity =
  | "compact"
  | "regular"
  | "featured"
  | "secondary"
  | "tertiary";

export type OperationalItemSignalKind =
  | "essential"
  | "high_priority"
  | "scheduled"
  | "dependency"
  | "overdue"
  | "unknown"
  | "blocked";

export type OperationalItemSignal = {
  kind: OperationalItemSignalKind;
  label?: string;
  ariaLabel?: string;
};

export type OperationalItemActionKind =
  | "complete"
  | "review"
  | "open"
  | "defer"
  | "more";

export type OperationalItemAction = {
  kind: OperationalItemActionKind;
  label?: string;
  ariaLabel?: string;
  disabled?: boolean;
  onSelect?: () => void;
};

export type OperationalItemTone = "neutral" | "risk" | "done" | "muted";
