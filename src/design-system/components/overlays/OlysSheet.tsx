import type { PropsWithChildren, ReactNode } from "react";

export type OlysSheetProps = PropsWithChildren<{
  open: boolean;
  title: string;
  onClose: () => void;
  eyebrow?: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
  panelClassName?: string;
  closeLabel?: string;
  closeAriaLabel?: string;
}>;

export function OlysSheet({
  open,
  title,
  onClose,
  eyebrow,
  description,
  actions,
  className,
  panelClassName,
  closeLabel = "Fechar",
  closeAriaLabel = "Fechar camada",
  children,
}: OlysSheetProps) {
  if (!open) {
    return null;
  }

  return (
    <div className={["olys-sheet-layer", className].filter(Boolean).join(" ")}>
      <button className="olys-sheet-backdrop" type="button" aria-label={closeAriaLabel} onClick={onClose} />
      <section
        className={["olys-sheet", panelClassName].filter(Boolean).join(" ")}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
      >
        <header className="olys-sheet__header">
          <div className="olys-sheet__heading">
            {eyebrow ? <small>{eyebrow}</small> : null}
            <h2>{title}</h2>
            {description ? <p>{description}</p> : null}
          </div>
          <button className="olys-button" type="button" onClick={onClose} aria-label={closeAriaLabel}>
            {closeLabel}
          </button>
        </header>
        <div className="olys-sheet__body">{children}</div>
        {actions ? <footer className="olys-sheet__footer">{actions}</footer> : null}
      </section>
    </div>
  );
}
