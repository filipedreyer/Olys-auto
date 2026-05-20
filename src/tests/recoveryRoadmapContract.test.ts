import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

describe("recovery roadmap documentation contract", () => {
  it("keeps visual matrix, legacy integration and remaining roadmap documents in the repo", () => {
    const expected = [
      "docs/recovery/remaining-phases-roadmap.md",
      "docs/recovery/visual-matrix/visual-matrix-summary.md",
      "docs/recovery/visual-matrix/visual-matrix-screen-inventory.md",
      "docs/recovery/legacy-integration/legacy-integration-summary.md",
      "docs/recovery/legacy-integration/legacy-to-remaining-phases-map.md",
      "docs/recovery/legacy-integration/legacy-guardrails.md",
    ];

    for (const path of expected) {
      expect(existsSync(join(root, path)), path).toBe(true);
    }
  });

  it("keeps the remaining roadmap anchored in the required territories and screen ids", () => {
    const roadmap = readDoc("docs/recovery/remaining-phases-roadmap.md");

    for (const term of ["Memoria", "Idea", "Entity Sheets", "Acesso", "Central", "Admin", "QA"]) {
      expect(roadmap).toContain(term);
    }

    expectAll(roadmap, ["MEM00", "MEM01", "MEM02", "MEM03", "MEM04", "MEM05", "MEM06", "MEM07"]);
    expectAll(roadmap, ["IA01", "IA02", "IA03", "IA04", "IA05"]);
    expectAll(roadmap, ["ENT00", "ENT01", "ENT02", "ENT03", "ENT04", "ENT05", "ENT06", "ENT07", "ENT08", "ENT09"]);
    expectAll(roadmap, ["AC01", "AC02", "AC03", "AC04", "AC05", "AC06", "AC07"]);
    expectAll(roadmap, ["CTR00", "CTR01", "CTR02", "CTR03", "CTR04", "CTR05", "CTR06", "CTR07"]);
    expectAll(roadmap, ["ADM00", "ADM01", "ADM02", "ADM03", "ADM04", "ADM05", "ADM06"]);
    expectAll(roadmap, ["SYS01", "SYS02"]);
    expectAll(roadmap, ["PL05", "PL06"]);
  });

  it("keeps legacy guardrails blocking the known architectural regressions", () => {
    const guardrails = readDoc("docs/recovery/legacy-integration/legacy-guardrails.md");

    expect(guardrails).toContain("importacao de codigo legado");
    expect(guardrails).toContain("EntitySheet monolitica");
    expect(guardrails).toContain("storage publico para anexos");
    expect(guardrails).toContain("IA com acao persistente sem confirmacao");
    expect(guardrails).toContain("Orbita");
    expect(guardrails).toContain("dashboard");
    expect(guardrails).toContain("backlog");
    expect(guardrails).toContain("PM tool");
    expect(guardrails).toContain("knowledge base generica");
  });

  it("keeps future contracts available without requiring runtime changes", () => {
    const expected = [
      "src/design-system/contracts/memory.contract.md",
      "src/design-system/contracts/entity-sheets.contract.md",
      "src/design-system/contracts/access.contract.md",
      "src/design-system/contracts/central.contract.md",
      "src/design-system/contracts/admin.contract.md",
      "src/design-system/contracts/qa-architecture.contract.md",
      "src/design-system/contracts/planning.contract.md",
    ];

    for (const path of expected) {
      expect(existsSync(join(root, path)), path).toBe(true);
    }
  });
});

function readDoc(path: string) {
  return readFileSync(join(root, path), "utf8");
}

function expectAll(source: string, values: string[]) {
  for (const value of values) {
    expect(source).toContain(value);
  }
}
