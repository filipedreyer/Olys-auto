import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

describe("today screen contract", () => {
  it("keeps Hoje controlled by buildTodayProjection", () => {
    const source = readSource("src/features/fazer/screens/HojeScreen.tsx");

    expect(source).toContain("buildTodayProjection(items, conditions, dependencies)");
    expect(source).not.toContain("orderForToday");
    expect(source).not.toContain("isEligibleForNow");
    expect(source).not.toContain("buildCapacityReading");
    expect(source).not.toContain("calculateDependencies");
  });

  it("uses a dedicated NowStage and OperationalCardOlys for Agora", () => {
    const hoje = readSource("src/features/fazer/screens/HojeScreen.tsx");
    const nowStage = readSource("src/features/fazer/components/NowStage.tsx");
    const carousel = readSource("src/features/fazer/components/OperationalCarousel.tsx");

    expect(hoje).toContain("<NowStage");
    expect(nowStage).toContain("<OperationalCarousel");
    expect(carousel).toContain("OperationalCardOlys");
    expect(carousel).toContain("reason: 'now'");
  });

  it("keeps Cabe hoje on canonical rows", () => {
    const source = readSource("src/features/fazer/components/TodaySecondaryLayer.tsx");

    expect(source).toContain("<OperationalRow");
    expect(source).toContain("entityType={item.entityType}");
    expect(source).toContain("state={item.status === 'paused' ? 'paused' : 'default'}");
  });

  it("distinguishes attention from blocked rows", () => {
    const source = readSource("src/features/fazer/components/AttentionLayer.tsx");

    expect(source).toContain('state="attention"');
    expect(source).toContain('state="blocked"');
  });

  it("renders completed as a low-weight layer when projection provides data", () => {
    const hoje = readSource("src/features/fazer/screens/HojeScreen.tsx");
    const completed = readSource("src/features/fazer/components/CompletedLayer.tsx");

    expect(hoje).toContain("<CompletedLayer");
    expect(hoje).toContain("items={projection.completed}");
    expect(completed).toContain('state="completed"');
    expect(completed).toContain("return null");
  });

  it("preserves openDay and closeDay handlers", () => {
    const source = readSource("src/features/fazer/screens/HojeScreen.tsx");

    expect(source).toContain("openDay(today)");
    expect(source).toContain("closeDay(today, closingNote)");
    expect(source).toContain("<TodayCyclePanel");
  });

  it("uses readings as indicators without recalculating them", () => {
    const hoje = readSource("src/features/fazer/screens/HojeScreen.tsx");
    const indicators = readSource("src/features/fazer/components/TodayIndicators.tsx");

    expect(hoje).toContain("<TodayIndicators");
    expect(indicators).toContain("OlysIndicator");
    expect(indicators).not.toContain("buildCapacityReading");
    expect(indicators).not.toContain("buildDirectionReading");
  });

  it("does not import repositories, command handlers, Capturar or Idea into Hoje", () => {
    const source = readSource("src/features/fazer/screens/HojeScreen.tsx");

    expect(source).not.toContain("repositories");
    expect(source).not.toContain("operationalCommandHandlers");
    expect(source).not.toContain("CaptureSheet");
    expect(source).not.toContain("FloatingActionPair");
  });

  it("does not redesign Timeline in this phase", () => {
    const source = readSource("src/features/fazer/screens/TimelineScreen.tsx");

    expect(source).toContain("TimelineHeader");
    expect(source).toContain("TimelineReadings");
    expect(source).toContain("TimelineSurface");
  });
});

function readSource(path: string) {
  return readFileSync(join(root, path), "utf8");
}
