import { describe, expect, it } from "vitest";
import { applyFilters, summarizeTasks } from "@/features/tasks/task.utils";
import type { Task } from "@/features/tasks/task.schema";

const sample: Task[] = [
  {
    id: "1",
    title: "Alpha release",
    description: "",
    status: "done",
    priority: "high",
    dueDate: "2026-01-01T00:00:00.000Z",
    createdAt: "2025-01-01T00:00:00.000Z",
    updatedAt: "2025-01-01T00:00:00.000Z",
  },
  {
    id: "2",
    title: "Beta testing",
    description: "",
    status: "todo",
    priority: "low",
    dueDate: "2026-02-01T00:00:00.000Z",
    createdAt: "2025-01-01T00:00:00.000Z",
    updatedAt: "2025-01-01T00:00:00.000Z",
  },
];

describe("task.utils", () => {
  it("filters by search and status", () => {
    const result = applyFilters(sample, {
      search: "alpha",
      status: "done",
      priority: "all",
      sort: "dueDateAsc",
    });
    expect(result).toHaveLength(1);
    expect(result[0]?.id).toBe("1");
  });

  it("summarizes dashboard metrics", () => {
    const summary = summarizeTasks(sample);
    expect(summary.total).toBe(2);
    expect(summary.completed).toBe(1);
    expect(summary.pending).toBe(1);
    expect(summary.highPriority).toBe(1);
  });
});
