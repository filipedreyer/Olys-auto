import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { DependencyEdge, OlysItem } from "../domain/entities/types";
import { buildTimelineProjection } from "../features/fazer/domain/timelineProjection";
import { timelineLenses } from "../features/fazer/domain/timelineLens";

const root = process.cwd();

describe("timeline contract", () => {
  it("keeps TimelineScreen controlled by buildTimelineProjection without infrastructure imports", () => {
    const source = readSource("src/features/fazer/screens/TimelineScreen.tsx");

    expect(source).toContain("buildTimelineProjection(");
    expect(source).not.toContain("repositories");
    expect(source).not.toContain("operationalCommandHandlers");
    expect(source).not.toContain("create(");
  });

  it("preserves calendar, capacity and dependency lenses", () => {
    expect(timelineLenses.map((lens) => lens.id)).toEqual([
      "calendar",
      "capacity",
      "dependency",
    ]);
  });

  it("keeps Timeline lenses as presentation components, not recalculation points", () => {
    const capacity = readSource("src/features/fazer/components/timeline/TimelineCapacityLens.tsx");
    const dependency = readSource("src/features/fazer/components/timeline/TimelineDependencyLens.tsx");
    const calendar = readSource("src/features/fazer/components/timeline/TimelineCalendarLens.tsx");

    expect(capacity).not.toContain("buildCapacityReading");
    expect(capacity).not.toContain("committedMinutes +");
    expect(dependency).not.toContain("calculateDependencies");
    expect(dependency).not.toContain("createDependency");
    expect(calendar).toContain("TimelineEntryRow");
    expect(calendar).not.toContain('entityType="unclassified"');
  });

  it("enriches item entries with entity and temporal data already present on OlysItem", () => {
    const projection = buildTimelineProjection([makeItem("task-1")], [], [], "calendar");
    const entry = projection.entries[0];

    expect(entry.entryKind).toBe("item");
    expect(entry.entityType).toBe("task");
    expect(entry.status).toBe("active");
    expect(entry.dateStart).toBe("2026-05-19");
    expect(entry.startAt).toBe("09:00");
    expect(entry.endAt).toBe("10:00");
    expect(entry.durationMinutes).toBe(60);
  });

  it("preserves capacity unknown instead of inventing duration", () => {
    const projection = buildTimelineProjection([
      makeItem("task-unknown", { durationMinutes: null }),
    ], [], [], "capacity");
    const entry = projection.entries[0];

    expect(entry.entryKind).toBe("item");
    expect(entry.durationMinutes).toBeNull();
    expect(entry.label).toContain("unknown");
    expect(entry.detail).toContain("nenhuma duração foi inventada");
  });

  it("preserves dependency predecessor, successor and impact", () => {
    const predecessor = makeItem("predecessor", { title: "Preparar base" });
    const successor = makeItem("successor", { title: "Executar sequência" });
    const dependency: DependencyEdge = {
      id: "edge-1",
      userId: "user-1",
      predecessorId: predecessor.id,
      successorId: successor.id,
      type: "blocks",
      status: "active",
      source: "manual",
      justification: "Ordem operacional",
      impact: "Sem base, a sequência trava",
      createdAt: "2026-05-19T00:00:00.000Z",
    };
    const projection = buildTimelineProjection([predecessor, successor], [], [dependency], "dependency");
    const entry = projection.entries[0];

    expect(entry.entryKind).toBe("dependency");
    expect(entry.predecessorTitle).toBe("Preparar base");
    expect(entry.successorTitle).toBe("Executar sequência");
    expect(entry.dependencyType).toBe("blocks");
    expect(entry.dependencyImpact).toBe("Sem base, a sequência trava");
    expect(entry.dependencyStatus).toBe("active");
    expect(entry.tone).toBe("blocked");
  });

  it("keeps adjacent recovered surfaces untouched in this phase", () => {
    expect(readSource("src/features/fazer/screens/HojeScreen.tsx")).toContain("NowStage");
    expect(readSource("src/features/capturar/components/CaptureSurface.tsx")).toContain("CaptureComposer");
    expect(readSource("src/features/inbox/screens/InboxScreen.tsx")).toContain("InboxTriageLayer");
    expect(readSource("src/app/shell/AppShell.tsx")).toContain("FloatingActionPair");
  });
});

function readSource(path: string) {
  return readFileSync(join(root, path), "utf8");
}

function makeItem(id: string, patch: Partial<OlysItem> = {}): OlysItem {
  return {
    id,
    userId: "user-1",
    entityType: "task",
    title: "Item temporal",
    status: "active",
    priority: 1,
    dateStart: "2026-05-19",
    startAt: "09:00",
    endAt: "10:00",
    durationMinutes: 60,
    sourceContext: "test",
    createdAt: "2026-05-19T00:00:00.000Z",
    updatedAt: "2026-05-19T00:00:00.000Z",
    ...patch,
  };
}
