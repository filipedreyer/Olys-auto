import type { ImgHTMLAttributes } from "react";

export type OlysIconProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "alt" | "src"> & {
  src: string;
  label?: string;
  decorative?: boolean;
};

export function OlysIcon({ src, label, decorative = false, className = "", ...props }: OlysIconProps) {
  const accessibilityProps = decorative
    ? { alt: "", "aria-hidden": true }
    : { alt: label ?? "", "aria-label": label };

  return <img className={`olys-icon ${className}`.trim()} src={src} {...accessibilityProps} {...props} />;
}
