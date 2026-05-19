import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  captureDestinations,
  resolveCaptureTarget,
} from "../features/capturar/domain/captureDestination";
import { buildCaptureGridRows } from "../features/capturar/components/capturePresentation";
import { olysShellNavigation } from "../design-system";

const root = process.cwd();

describe("capture surface contract", () => {
  it("uses the canonical Olys sheet for CaptureSheet", () => {
    const source = readSource("src/features/capturar/components/CaptureSheet.tsx");

    expect(source).toContain("OlysSheet");
    expect(source).toContain('className="capture-sheet"');
    expect(source).toContain('panelClassName="capture-sheet__panel"');
    expect(source).toContain("onCaptured={onClose}");
  });

  it("preserves the capture submit boundary and Inbox default", () => {
    const source = readSource("src/features/capturar/components/CaptureSurface.tsx");

    expect(source).toContain("useState<CaptureDestinationId>('inbox')");
    expect(source).toContain("await capture({");
    expect(source).toContain("title,");
    expect(source).toContain("destination,");
    expect(source).toContain("dateStart: dateStart || undefined");
    expect(source).toContain("setDestination('inbox')");
  });

  it("renders CaptureGrid as the canonical 3x4 destination matrix", () => {
    const rows = buildCaptureGridRows(captureDestinations);

    expect(rows).toHaveLength(4);
    rows.forEach((row) => expect(row).toHaveLength(3));
    expect(rows.map((row) => row.map((destination) => destination.id))).toEqual([
      ["inbox", "goal", "project"],
      ["task", "agenda", "note"],
      ["list", "habit", "routine"],
      ["template", "event", "reminder"],
    ]);
  });

  it("keeps the grid accessible and excludes Essential Protected", () => {
    const source = readSource("src/features/capturar/components/CaptureGrid.tsx");

    expect(source).toContain("buildCaptureGridRows");
    expect(source).toContain("aria-pressed");
    expect(source).toContain("data-destination");
    expect(source).not.toContain("essential");
    expect(source).not.toContain("Essencial");
  });

  it("preserves Reminder sufficiency through resolveCaptureTarget", () => {
    expect(
      resolveCaptureTarget({
        title: "Comprar filtro",
        destination: "reminder",
      }),
    ).toEqual({
      kind: "inbox",
      suggestedType: "reminder",
      reason: "reminder_requires_date_or_time",
    });

    expect(
      resolveCaptureTarget({
        title: "Comprar filtro",
        destination: "reminder",
        dateStart: "2026-05-20",
      }),
    ).toEqual({
      kind: "item",
      entityType: "reminder",
    });
  });

  it("keeps Capturar and Idea out of bottom navigation", () => {
    expect(olysShellNavigation.bottom).not.toContain("capturar");
    expect(olysShellNavigation.bottom).not.toContain("idea");
    expect(olysShellNavigation.floating).toEqual(["capturar", "idea"]);
  });

  it("does not change command handlers, repositories or capture domain for presentation work", () => {
    const commandHandlers = readSource("src/shared/commands/operationalCommandHandlers.ts");
    const captureDomain = readSource("src/features/capturar/domain/captureDestination.ts");

    expect(commandHandlers).not.toContain("CaptureGrid");
    expect(commandHandlers).not.toContain("CaptureComposer");
    expect(captureDomain).toContain("reminder_requires_date_or_time");
    expect(captureDomain).toContain("draft.destination ?? 'inbox'");
  });
});

function readSource(path: string) {
  return readFileSync(join(root, path), "utf8");
}
