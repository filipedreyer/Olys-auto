import type { ReactNode } from "react";

export type OlysIndicatorTone = "direction" | "capacity" | "attention" | "unknown";

export type OlysIndicatorProps = {
  tone: OlysIndicatorTone;
  label: string;
  icon?: ReactNode;
};

export function OlysIndicator({ tone, label, icon }: OlysIndicatorProps) {
  return (
    <span className="olys-indicator" data-tone={tone}>
      {icon}
      <span>{label}</span>
    </span>
  );
}
