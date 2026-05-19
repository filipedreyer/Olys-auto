import type { HTMLAttributes, PropsWithChildren } from "react";

export type OlysSurfaceTone = "paper" | "raised" | "subtle";

export type OlysSurfaceProps = PropsWithChildren<
  HTMLAttributes<HTMLElement> & {
    as?: "section" | "article" | "div";
    tone?: OlysSurfaceTone;
  }
>;

export function OlysSurface({ as: Component = "section", tone = "paper", className = "", children, ...props }: OlysSurfaceProps) {
  return (
    <Component className={`olys-surface ${className}`.trim()} data-tone={tone} {...props}>
      {children}
    </Component>
  );
}
