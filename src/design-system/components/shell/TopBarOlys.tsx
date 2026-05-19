import type { ReactNode } from "react";
import { olysAssets } from "../../assets/manifest";
import { OlysIcon } from "../base/OlysIcon";

export type TopBarOlysProps = {
  menu: ReactNode;
  acesso: ReactNode;
  inbox: ReactNode;
  search: ReactNode;
};

export function TopBarOlys({ menu, acesso, inbox, search }: TopBarOlysProps) {
  return (
    <header className="olys-top-bar" aria-label="Barra superior Olys" data-nav-scope="top-global">
      <div className="olys-top-bar__brand">
        {menu}
        <OlysIcon className="olys-top-bar__logo" src={olysAssets.logo.primary} label="Olys" />
      </div>
      <nav className="olys-top-bar__actions" aria-label="Acoes globais">
        {acesso}
        {inbox}
        {search}
      </nav>
    </header>
  );
}
