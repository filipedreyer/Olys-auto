import { describe, expect, it } from "vitest";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { olysAssets, olysCaptureGrid, olysShellNavigation } from "../design-system";

const root = process.cwd();

describe("design system foundation", () => {
  it("defines canonical Olys tokens and keeps legacy app vars as compatibility aliases", () => {
    const tokensPath = join(root, "src/design-system/tokens/olys-tokens.css");
    const tokens = readFileSync(tokensPath, "utf8");

    expect(tokens).toContain("--olys-brand-black: #0C0D0D");
    expect(tokens).toContain("--olys-brand-teal: #0D848B");
    expect(tokens).toContain("--olys-brand-teal-light: #0FB5BE");
    expect(tokens).toContain("--olys-brand-teal-pale: #E0F5F6");
    expect(tokens).toContain("--olys-brand-ia-violet: #7C4DFF");
    expect(tokens).toContain("--olys-brand-paper: #FFFFFF");
    expect(tokens).toContain("--olys-brand-off-white: #F7F5F1");
    expect(tokens).toContain("--olys-state-attention");
    expect(tokens).toContain("--olys-state-critical");
    expect(tokens).toContain("--olys-state-positive");
    expect(tokens).toContain("--olys-state-disabled");
    expect(tokens).toContain("--olys-state-unknown");
    expect(tokens).toContain("--olys-state-blocked");
    expect(tokens).toContain("--olys-state-partial");
    expect(tokens).toContain("@deprecated compatibility aliases");
  });

  it("keeps global CSS connected to DS tokens without dark mode as canonical default", () => {
    const globals = readFileSync(join(root, "src/styles/globals.css"), "utf8");

    expect(globals).toContain('@import "../design-system/tokens/olys-tokens.css";');
    expect(globals).toContain("color-scheme: light");
    expect(globals).not.toContain("color-scheme: dark");
  });

  it("exposes assets by semantic role instead of loose file paths", () => {
    expect(olysAssets.logo.primary).toContain("olys_logo_primary.svg");
    expect(olysAssets.nav.fazer).toContain("icon-nav-fazer.svg");
    expect(olysAssets.nav.capturar).toContain("icon-nav-capturar.svg");
    expect(olysAssets.floatingActionPair.ideaRelevant).toContain("idea_relevant.svg");
    expect(olysAssets.rails.row.task).toContain("row_entity_rail_4x34_tarefa.svg");
    expect(olysAssets.indicators.capacity).toContain("capacity_normal.svg");
  });

  it("preserves shell and capture contracts as constants", () => {
    expect(olysShellNavigation.bottom).toEqual(["fazer", "planejar", "memoria"]);
    expect(olysShellNavigation.floating).toEqual(["capturar", "idea"]);
    expect(olysCaptureGrid).toEqual([
      ["inbox", "goal", "project"],
      ["task", "agenda", "note"],
      ["list", "habit", "routine"],
      ["template", "event", "reminder"],
    ]);
  });

  it("creates all required normative contracts", () => {
    const contractsPath = join(root, "src/design-system/contracts");
    const expected = [
      "source-of-truth.md",
      "shell-global.contract.md",
      "operational-item.contract.md",
      "today.contract.md",
      "capture-inbox.contract.md",
      "timeline.contract.md",
      "idea.contract.md",
      "anti-regression.contract.md",
    ];

    for (const file of expected) {
      expect(existsSync(join(contractsPath, file))).toBe(true);
    }
  });

  it("does not introduce hardcoded hex colors inside DS React component stubs", () => {
    const componentRoot = join(root, "src/design-system/components");
    const files = listFiles(componentRoot).filter((file) => file.endsWith(".tsx"));

    for (const file of files) {
      const source = readFileSync(file, "utf8");
      expect(source, file).not.toMatch(/#[0-9a-fA-F]{3,8}/);
    }
  });
});

function listFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = join(directory, entry.name);
    return entry.isDirectory() ? listFiles(fullPath) : [fullPath];
  });
}
