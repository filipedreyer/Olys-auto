import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

describe("operational item contract", () => {
  it("keeps OperationalItemBase as the shared row/card contract", () => {
    const source = readSource("src/design-system/components/operational-item/OperationalItemBase.tsx");

    expect(source).toContain("data-state={state}");
    expect(source).toContain("data-density={density}");
    expect(source).toContain("data-entity={entity}");
    expect(source).toContain("<EntityRail");
    expect(source).toContain("olys-operational-item__signals");
    expect(source).toContain("olys-operational-item__actions");
  });

  it("supports canonical visual states, densities and signals without changing domain types", () => {
    const visualTypes = readSource("src/design-system/components/operational-item/operationalItemTypes.ts");
    const domainTypes = readSource("src/domain/entities/types.ts");

    for (const state of ["default", "attention", "blocked", "paused", "completed", "unknown"]) {
      expect(visualTypes).toContain(`"${state}"`);
    }

    for (const density of ["compact", "regular", "featured", "secondary", "tertiary"]) {
      expect(visualTypes).toContain(`"${density}"`);
    }

    for (const signal of ["essential", "high_priority", "scheduled", "dependency", "overdue", "unknown", "blocked"]) {
      expect(visualTypes).toContain(`"${signal}"`);
    }

    const entityTypeBlock = extractTypeBlock(domainTypes, "EntityType");
    const operationalRowStateBlock = extractTypeBlock(domainTypes, "OperationalRowState");

    expect(entityTypeBlock).not.toContain("'unclassified'");
    expect(operationalRowStateBlock).not.toContain("'unknown'");
  });

  it("keeps OperationalRow as a compatibility wrapper over the canonical DS row", () => {
    const source = readSource("src/features/fazer/components/OperationalRow.tsx");

    expect(source).toContain("OperationalRowOlys");
    expect(source).toContain("entityType = 'unclassified'");
    expect(source).not.toContain("operational-row__indicator");
    expect(source).toContain("signals={resolvedSignals}");
  });

  it("passes entity type into the carousel when the OlysItem is available", () => {
    const source = readSource("src/features/fazer/components/OperationalCarousel.tsx");

    expect(source).toContain("OperationalCardOlys");
    expect(source).toContain("toTodayItemViewModel");
    expect(source).toContain("item,");
    expect(source).toContain("entity={viewModel.entity}");
  });

  it("keeps Timeline projection untouched and uses explicit unclassified fallback in the screen", () => {
    const projection = readSource("src/features/fazer/domain/timelineProjection.ts");
    const screen = readSource("src/features/fazer/screens/TimelineScreen.tsx");

    expect(projection).not.toContain("entityType:");
    expect(screen).toContain('entityType="unclassified"');
  });

  it("does not introduce hardcoded hex colors inside operational item DS components", () => {
    const files = listFiles(join(root, "src/design-system/components/operational-item")).filter((file) =>
      file.endsWith(".tsx"),
    );

    for (const file of files) {
      const source = readFileSync(file, "utf8");
      expect(source, file).not.toMatch(/#[0-9a-fA-F]{3,8}/);
    }
  });

  it("does not route DS visual concerns into command handlers or repositories", () => {
    const guardedFiles = [
      "src/shared/commands/operationalCommandHandlers.ts",
      ...listFiles(join(root, "src/shared/repositories")).map((file) => relativeFromRoot(file)),
    ];

    for (const file of guardedFiles) {
      const source = readSource(file);
      expect(source, file).not.toContain("design-system");
      expect(source, file).not.toContain("OperationalRowOlys");
      expect(source, file).not.toContain("OperationalItemBase");
    }
  });
});

function readSource(path: string) {
  return readFileSync(join(root, path), "utf8");
}

function listFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = join(directory, entry.name);
    return entry.isDirectory() ? listFiles(fullPath) : [fullPath];
  });
}

function relativeFromRoot(path: string) {
  return path.replace(`${root}\\`, "").replace(/\\/g, "/");
}

function extractTypeBlock(source: string, typeName: string) {
  const start = source.indexOf(`export type ${typeName}`);
  const rest = source.slice(start);
  const nextExport = rest.indexOf("\nexport ", 1);
  return nextExport === -1 ? rest : rest.slice(0, nextExport);
}
