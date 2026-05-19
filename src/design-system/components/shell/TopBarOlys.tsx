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
    <header className="olys-top-bar" aria-label="Barra superior Olys">
      {menu}
      <OlysIcon src={olysAssets.logo.primary} label="Olys" />
      <nav aria-label="Acoes globais">
        {acesso}
        {inbox}
        {search}
      </nav>
    </header>
  );
}
