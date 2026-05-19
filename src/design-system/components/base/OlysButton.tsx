import type { ButtonHTMLAttributes, ReactNode } from "react";

export type OlysButtonVariant = "primary" | "secondary" | "quiet" | "danger";

export type OlysButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: OlysButtonVariant;
  icon?: ReactNode;
};

export function OlysButton({
  variant = "secondary",
  icon,
  children,
  className = "",
  type = "button",
  ...props
}: OlysButtonProps) {
  return (
    <button className={`olys-button ${className}`.trim()} data-variant={variant} type={type} {...props}>
      {icon}
      {children}
    </button>
  );
}
