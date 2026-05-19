export { olysAssets } from "./assets/manifest";
export type { OlysAssetManifest } from "./assets/manifest";

export { OlysIcon } from "./components/base/OlysIcon";
export type { OlysIconProps } from "./components/base/OlysIcon";
export { OlysButton } from "./components/base/OlysButton";
export type { OlysButtonProps, OlysButtonVariant } from "./components/base/OlysButton";
export { OlysSurface } from "./components/base/OlysSurface";
export type { OlysSurfaceProps, OlysSurfaceTone } from "./components/base/OlysSurface";
export { TopBarOlys } from "./components/shell/TopBarOlys";
export type { TopBarOlysProps } from "./components/shell/TopBarOlys";
export { BottomNavOlys } from "./components/shell/BottomNavOlys";
export type { BottomNavOlysItem, BottomNavOlysProps } from "./components/shell/BottomNavOlys";
export { FloatingActionPair } from "./components/shell/FloatingActionPair";
export type { FloatingActionPairProps } from "./components/shell/FloatingActionPair";
export { EntityRail } from "./components/operational-item/EntityRail";
export type { EntityRailKind, EntityRailProps } from "./components/operational-item/EntityRail";
export { OperationalItemBase } from "./components/operational-item/OperationalItemBase";
export type { OperationalItemBaseProps, OperationalItemState } from "./components/operational-item/OperationalItemBase";
export { OperationalSignalStack } from "./components/operational-item/OperationalSignalStack";
export type { OperationalSignalStackProps } from "./components/operational-item/OperationalSignalStack";
export { OperationalActions } from "./components/operational-item/OperationalActions";
export type { OperationalActionsProps } from "./components/operational-item/OperationalActions";
export { OperationalRowOlys } from "./components/operational-item/OperationalRowOlys";
export type { OperationalRowOlysProps } from "./components/operational-item/OperationalRowOlys";
export { OperationalCardOlys } from "./components/operational-item/OperationalCardOlys";
export type { OperationalCardOlysProps } from "./components/operational-item/OperationalCardOlys";
export type {
  OperationalItemAction,
  OperationalItemActionKind,
  OperationalItemDensity,
  OperationalItemSignal,
  OperationalItemSignalKind,
  OperationalItemTone,
  OperationalItemVisualEntity,
  OperationalItemVisualState,
} from "./components/operational-item/operationalItemTypes";
export { OlysIndicator } from "./components/indicators/OlysIndicator";
export type { OlysIndicatorProps, OlysIndicatorTone } from "./components/indicators/OlysIndicator";
export { OlysSheet } from "./components/overlays/OlysSheet";
export type { OlysSheetProps } from "./components/overlays/OlysSheet";

export const olysTokenFiles = {
  css: "src/design-system/tokens/olys-tokens.css",
} as const;

export const olysShellNavigation = {
  bottom: ["fazer", "planejar", "memoria"],
  floating: ["capturar", "idea"],
  top: ["menu", "acesso", "inbox", "busca"],
} as const;

export const olysCaptureGrid = [
  ["inbox", "goal", "project"],
  ["task", "agenda", "note"],
  ["list", "habit", "routine"],
  ["template", "event", "reminder"],
] as const;

export type OlysVisualEntity =
  | "inbox"
  | "goal"
  | "project"
  | "task"
  | "agenda"
  | "note"
  | "list"
  | "habit"
  | "routine"
  | "template"
  | "event"
  | "reminder"
  | "unclassified";
