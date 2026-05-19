import type { ReactNode } from "react";

export type BottomNavOlysItem = {
  key: "fazer" | "planejar" | "memoria";
  label: string;
  icon: ReactNode;
  active?: boolean;
};

export type BottomNavOlysProps = {
  items: readonly BottomNavOlysItem[];
};

export function BottomNavOlys({ items }: BottomNavOlysProps) {
  return (
    <nav className="olys-bottom-nav" aria-label="Territorios principais">
      {items.map((item) => (
        <button key={item.key} className="olys-button" type="button" aria-current={item.active ? "page" : undefined}>
          {item.icon}
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
