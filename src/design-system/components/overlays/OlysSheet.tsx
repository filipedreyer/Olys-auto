import type { PropsWithChildren, ReactNode } from "react";

export type OlysSheetProps = PropsWithChildren<{
  open: boolean;
  title: string;
  onClose: () => void;
  actions?: ReactNode;
}>;

export function OlysSheet({ open, title, onClose, actions, children }: OlysSheetProps) {
  if (!open) {
    return null;
  }

  return (
    <>
      <button className="olys-sheet-backdrop" type="button" aria-label="Fechar camada" onClick={onClose} />
      <section className="olys-sheet" role="dialog" aria-modal="true" aria-label={title} tabIndex={-1}>
        <header>
          <h2>{title}</h2>
          <button className="olys-button" type="button" onClick={onClose}>
            Fechar
          </button>
        </header>
        {children}
        {actions ? <footer>{actions}</footer> : null}
      </section>
    </>
  );
}
