import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { olysShellNavigation } from "../design-system";

const root = process.cwd();

describe("global shell contract", () => {
  it("keeps bottom navigation restricted to the three canonical territories", () => {
    expect(olysShellNavigation.bottom).toEqual(["fazer", "planejar", "memoria"]);
    expect(olysShellNavigation.bottom).not.toContain("capturar");
    expect(olysShellNavigation.bottom).not.toContain("idea");
    expect(olysShellNavigation.bottom).not.toContain("inbox");
  });

  it("keeps Capturar and Idea as transversal floating actions", () => {
    expect(olysShellNavigation.floating).toEqual(["capturar", "idea"]);
  });

  it("types BottomNavOlys so it cannot accept non-territory keys", () => {
    const source = readFileSync(join(root, "src/design-system/components/shell/BottomNavOlys.tsx"), "utf8");

    expect(source).toContain('key: "fazer" | "planejar" | "memoria"');
    expect(source).toContain("NavLink");
    expect(source).not.toContain('"capturar"');
    expect(source).not.toContain('"idea"');
    expect(source).not.toContain('"inbox"');
  });

  it("renders the shell regions with contract-specific components", () => {
    const source = readFileSync(join(root, "src/app/shell/AppShell.tsx"), "utf8");

    expect(source).toContain("<TopBarOlys");
    expect(source).toContain("<BottomNavOlys");
    expect(source).toContain("<FloatingActionPair");
    expect(source).toContain("<CaptureSheet");
    expect(source).toContain("<OlysSheet");
  });

  it("does not route Capturar, Idea or Inbox through bottom navigation", () => {
    const source = readFileSync(join(root, "src/app/shell/AppShell.tsx"), "utf8");
    const bottomNavBlock = source.slice(source.indexOf("const bottomNavItems"), source.indexOf("export function AppShell"));

    expect(bottomNavBlock).toContain("'/fazer/hoje'");
    expect(bottomNavBlock).toContain("'/planejar'");
    expect(bottomNavBlock).toContain("'/memoria'");
    expect(bottomNavBlock).not.toContain("capturar");
    expect(bottomNavBlock).not.toContain("idea");
    expect(bottomNavBlock).not.toContain("inbox");
  });

  it("keeps Capturar and Idea out of TopBarOlys actions", () => {
    const source = readFileSync(join(root, "src/app/shell/AppShell.tsx"), "utf8");
    const topBarBlock = source.slice(source.indexOf("<TopBarOlys"), source.indexOf("<main"));

    expect(topBarBlock).toContain("acesso=");
    expect(topBarBlock).toContain("inbox=");
    expect(topBarBlock).toContain("search=");
    expect(topBarBlock).not.toContain("olysAssets.nav.capturar");
    expect(topBarBlock).not.toContain("olysAssets.nav.idea");
    expect(topBarBlock).not.toContain("setCaptureOpen");
    expect(topBarBlock).not.toContain("setIdeaOpen");
  });

  it("protects shell token usage and light canonical mode", () => {
    const globals = readFileSync(join(root, "src/styles/globals.css"), "utf8");

    expect(globals).toContain('@import "../design-system/tokens/olys-tokens.css";');
    expect(globals).toContain("--olys-safe-area-bottom");
    expect(globals).toContain(".olys-bottom-nav");
    expect(globals).toContain(".olys-floating-action-pair");
    expect(globals).not.toContain("color-scheme: dark");
  });
});
