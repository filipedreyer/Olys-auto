import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";

export type BottomNavOlysItem = {
  key: "fazer" | "planejar" | "memoria";
  label: string;
  icon: ReactNode;
  to: string;
  end?: boolean;
};

export type BottomNavOlysProps = {
  items: readonly BottomNavOlysItem[];
};

export function BottomNavOlys({ items }: BottomNavOlysProps) {
  return (
    <nav className="olys-bottom-nav" aria-label="Territorios principais" data-nav-scope="bottom-territories">
      {items.map((item) => (
        <NavLink key={item.key} className="olys-bottom-nav__item" to={item.to} end={item.end}>
          {item.icon}
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
