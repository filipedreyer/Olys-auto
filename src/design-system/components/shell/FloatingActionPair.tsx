import type { ReactNode } from "react";

export type FloatingActionPairProps = {
  capturar: ReactNode;
  idea: ReactNode;
};

export function FloatingActionPair({ capturar, idea }: FloatingActionPairProps) {
  return (
    <div className="olys-floating-action-pair" aria-label="Acoes transversais">
      {capturar}
      {idea}
    </div>
  );
}
