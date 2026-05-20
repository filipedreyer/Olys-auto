import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

describe("planning surface contract", () => {
  it("keeps PlanejarScreen controlled by buildPlanningProjection without infrastructure imports", () => {
    const source = readSource("src/features/planejar/screens/PlanejarScreen.tsx");

    expect(source).toContain("buildPlanningProjection(items, conditions, dependencies, links)");
    expect(source).not.toContain("repositories");
    expect(source).not.toContain("operationalCommandHandlers");
    expect(source).not.toContain("create(");
  });

  it("keeps Planejar isolated from Timeline, Capturar and Inbox presentation components", () => {
    const source = readSource("src/features/planejar/screens/PlanejarScreen.tsx");

    expect(source).not.toContain("Timeline");
    expect(source).not.toContain("Capture");
    expect(source).not.toContain("Inbox");
  });

  it("renders the canonical planning layers from projection slices", () => {
    const source = readSource("src/features/planejar/screens/PlanejarScreen.tsx");

    expect(source).toContain("<PlanningReadings");
    expect(source).toContain("<PlanningGoalsLayer goals={projection.goals}");
    expect(source).toContain("<PlanningProjectsLayer projects={projection.projects}");
    expect(source).toContain("<PlanningRhythmsLayer rhythms={projection.rhythms}");
  });

  it("uses real entity rails for goals, projects, habits and routines", () => {
    const goals = readSource("src/features/planejar/components/PlanningGoalsLayer.tsx");
    const projects = readSource("src/features/planejar/components/PlanningProjectsLayer.tsx");
    const rhythms = readSource("src/features/planejar/components/PlanningRhythmsLayer.tsx");
    const row = readSource("src/features/planejar/components/PlanningEntityRow.tsx");

    expect(goals).toContain('entityType="goal"');
    expect(projects).toContain('entityType="project"');
    expect(rhythms).toContain("entityType={rhythm.kind}");
    expect(row).toContain("<OperationalRow");
    expect(row).toContain("entityType={entityType}");
  });

  it("lets dependencyRisk affect presentation without recalculating dependencies", () => {
    const projects = readSource("src/features/planejar/components/PlanningProjectsLayer.tsx");
    const presentation = readSource("src/features/planejar/components/planningPresentation.ts");

    expect(projects).toContain("project.dependencyRisk > 0");
    expect(presentation).toContain("project.dependencyRisk > 0");
    expect(projects).not.toContain("calculateDependencies");
    expect(presentation).not.toContain("calculateDependencies");
  });

  it("keeps rhythms contextual, not gamified or checklist-based", () => {
    const rhythms = readSource("src/features/planejar/components/PlanningRhythmsLayer.tsx");

    expect(rhythms).not.toContain("streak");
    expect(rhythms).not.toContain("score");
    expect(rhythms).not.toContain("checklist");
    expect(rhythms).toContain("Recorrência");
  });

  it("does not introduce dashboard, OKR, kanban or backlog structure", () => {
    const planejarSource = [
      "src/features/planejar/screens/PlanejarScreen.tsx",
      "src/features/planejar/components/PlanningHeader.tsx",
      "src/features/planejar/components/PlanningReadings.tsx",
      "src/features/planejar/components/PlanningGoalsLayer.tsx",
      "src/features/planejar/components/PlanningProjectsLayer.tsx",
      "src/features/planejar/components/PlanningRhythmsLayer.tsx",
      "src/features/planejar/components/PlanningEntityRow.tsx",
      "src/features/planejar/components/planningPresentation.ts",
    ].map(readSource).join("\n").toLowerCase();

    expect(planejarSource).not.toContain("okr");
    expect(planejarSource).not.toContain("kanban");
    expect(planejarSource).not.toContain("backlog");
    expect(planejarSource).not.toContain("dashboard");
  });

  it("does not rewrite planning projection logic in this phase", () => {
    const projection = readSource("src/features/planejar/domain/planningProjection.ts");

    expect(projection).toContain("qualitativeProgress: 'clear' | 'connected' | 'loose' | 'paused'");
    expect(projection).toContain("activeOperationalItems");
    expect(projection).toContain("dependencyRisk");
    expect(projection).toContain("buildGoalProjection");
    expect(projection).toContain("buildProjectProjection");
  });

  it("keeps adjacent recovered surfaces untouched in this phase", () => {
    expect(readSource("src/features/fazer/screens/HojeScreen.tsx")).toContain("NowStage");
    expect(readSource("src/features/fazer/screens/TimelineScreen.tsx")).toContain("TimelineSurface");
    expect(readSource("src/features/capturar/components/CaptureSurface.tsx")).toContain("CaptureComposer");
    expect(readSource("src/features/inbox/screens/InboxScreen.tsx")).toContain("InboxTriageLayer");
    expect(readSource("src/app/shell/AppShell.tsx")).toContain("FloatingActionPair");
  });
});

function readSource(path: string) {
  return readFileSync(join(root, path), "utf8");
}
