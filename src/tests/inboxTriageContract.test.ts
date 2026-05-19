import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { InboxItem, OlysItem } from "../domain/entities/types";
import { buildInboxProjection } from "../features/inbox/domain/inboxProjection";
import { applyInboxTriage } from "../features/inbox/domain/inboxTriage";

const root = process.cwd();

describe("inbox triage contract", () => {
  it("keeps InboxScreen controlled by buildInboxProjection without repository or command imports", () => {
    const source = readSource("src/features/inbox/screens/InboxScreen.tsx");

    expect(source).toContain("buildInboxProjection(inboxItems)");
    expect(source).not.toContain("repositories");
    expect(source).not.toContain("operationalCommandHandlers");
    expect(source).not.toContain("OperationalRow");
  });

  it("preserves all triage actions and keeps revisit reduced", () => {
    const actions = readSource("src/features/inbox/components/InboxTriageActions.tsx");
    const revisit = readSource("src/features/inbox/components/InboxRevisitLayer.tsx");

    expect(actions).toContain("Manter");
    expect(actions).toContain("getConvertLabel");
    expect(actions).toContain("Concluir");
    expect(actions).toContain("Adiar");
    expect(actions).toContain("Descartar");
    expect(actions).toContain("mode === 'triage'");
    expect(actions).toContain("suggestedType ?? 'task'");
    expect(revisit).toContain('mode="revisit"');
    expect(revisit).not.toContain("onKeep={");
  });

  it("represents InboxItem as transitional input, not as OlysItem", () => {
    const item = readSource("src/features/inbox/components/InboxTriageItem.tsx");

    expect(item).toContain('data-inbox-item="true"');
    expect(item).toContain("InboxItem");
    expect(item).not.toContain("OlysItem");
    expect(item).not.toContain("entityType=");
  });

  it("does not expose backlog or Essential Protected as Inbox structure", () => {
    const files = [
      "src/features/inbox/screens/InboxScreen.tsx",
      "src/features/inbox/components/InboxHeader.tsx",
      "src/features/inbox/components/InboxTriageLayer.tsx",
      "src/features/inbox/components/InboxRevisitLayer.tsx",
      "src/features/inbox/components/InboxTriageItem.tsx",
      "src/features/inbox/components/InboxTriageActions.tsx",
    ].map(readSource).join("\n");

    expect(files.toLowerCase()).not.toContain("backlog");
    expect(files).not.toContain("Essencial protegido");
    expect(files).not.toContain("essential_protected");
  });

  it("separates new/error triage items from kept/postponed revisit items", () => {
    const projection = buildInboxProjection([
      makeInboxItem("new-1", "new"),
      makeInboxItem("error-1", "error"),
      makeInboxItem("kept-1", "kept"),
      makeInboxItem("postponed-1", "postponed"),
      makeInboxItem("converted-1", "converted"),
    ]);

    expect(projection.triageItems.map((item) => item.id)).toEqual([
      "new-1",
      "error-1",
    ]);
    expect(projection.revisitItems.map((item) => item.id)).toEqual([
      "kept-1",
      "postponed-1",
    ]);
    expect(projection.readings.postponed).toBe(1);
  });

  it("preserves triage statuses through applyInboxTriage", () => {
    const inboxItems = [makeInboxItem("inbox-1", "new")];
    const items: OlysItem[] = [];

    expect(applyInboxTriage(inboxItems, items, "inbox-1", { action: "keep" }).inboxItems[0].status).toBe("kept");
    expect(applyInboxTriage(inboxItems, items, "inbox-1", { action: "complete" }).inboxItems[0].status).toBe("completed");
    expect(applyInboxTriage(inboxItems, items, "inbox-1", { action: "discard" }).inboxItems[0].status).toBe("discarded");
    expect(applyInboxTriage(inboxItems, items, "inbox-1", { action: "postpone" }).inboxItems[0].status).toBe("postponed");
    expect(applyInboxTriage(inboxItems, items, "inbox-1", { action: "convert", targetType: "note" }).inboxItems[0].status).toBe("converted");
  });

  it("preserves postpone revisit metadata", () => {
    const result = applyInboxTriage(
      [makeInboxItem("inbox-1", "new")],
      [],
      "inbox-1",
      { action: "postpone" },
    );
    const postponed = result.inboxItems[0];

    expect(postponed.needsRevisit).toBe(true);
    expect(postponed.metadata).toMatchObject({
      inbox_postponed: true,
      inbox_needs_revisit: true,
      inbox_source_id: "inbox-1",
    });
    expect(postponed.metadata?.inbox_postponed_at).toBeDefined();
  });

  it("preserves conversion source traceability", () => {
    const result = applyInboxTriage(
      [makeInboxItem("inbox-1", "new", "reminder")],
      [],
      "inbox-1",
      { action: "convert", targetType: "reminder" },
    );
    const convertedInbox = result.inboxItems[0];
    const createdItem = result.items[0];

    expect(convertedInbox.convertedItemId).toBe(createdItem.id);
    expect(createdItem.entityType).toBe("reminder");
    expect(createdItem.sourceContext).toBe("inbox:inbox-1");
    expect(createdItem.metadata).toMatchObject({
      inbox_source_id: "inbox-1",
      inbox_source_context: "capture",
    });
  });
});

function readSource(path: string) {
  return readFileSync(join(root, path), "utf8");
}

function makeInboxItem(
  id: string,
  status: InboxItem["status"],
  suggestedType?: InboxItem["suggestedType"],
): InboxItem {
  return {
    id,
    userId: "user-1",
    text: `Entrada ${id}`,
    status,
    sourceContext: "capture",
    suggestedType,
    createdAt: "2026-05-19T00:00:00.000Z",
    updatedAt: "2026-05-19T00:00:00.000Z",
  };
}
