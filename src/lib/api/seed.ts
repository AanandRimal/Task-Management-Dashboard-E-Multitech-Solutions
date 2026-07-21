import type { Task } from "@/features/tasks/task.schema";

function daysFromNow(days: number, hour = 17): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
}

function daysAgo(days: number): string {
  return daysFromNow(-days);
}

/** Seed tasks — varied status, priority, and due dates for demo filters. */
export const SEED_TASKS: Task[] = [
  {
    id: "tsk_01",
    title: "Finalize Q3 roadmap review",
    description: "Collect input from design and engineering leads before the leadership sync.",
    status: "in_progress",
    priority: "high",
    dueDate: daysFromNow(2),
    createdAt: daysAgo(5),
    updatedAt: daysAgo(1),
  },
  {
    id: "tsk_02",
    title: "Update onboarding checklist",
    description: "Align new hire docs with the revised security training module.",
    status: "todo",
    priority: "medium",
    dueDate: daysFromNow(7),
    createdAt: daysAgo(3),
    updatedAt: daysAgo(3),
  },
  {
    id: "tsk_03",
    title: "Ship dashboard empty states",
    description: "Replace placeholder copy with actionable invitations on list and detail views.",
    status: "done",
    priority: "medium",
    dueDate: daysAgo(2),
    createdAt: daysAgo(10),
    updatedAt: daysAgo(1),
  },
  {
    id: "tsk_04",
    title: "Audit API error responses",
    description: "Ensure route handlers return consistent JSON shapes for 400/404/500.",
    status: "todo",
    priority: "high",
    dueDate: daysFromNow(1),
    createdAt: daysAgo(2),
    updatedAt: daysAgo(2),
  },
  {
    id: "tsk_05",
    title: "Prepare stakeholder demo",
    description: "Walk through task filters, theme toggle, and optimistic status updates.",
    status: "in_progress",
    priority: "high",
    dueDate: daysFromNow(4),
    createdAt: daysAgo(6),
    updatedAt: daysAgo(0),
  },
  {
    id: "tsk_06",
    title: "Refine mobile task cards",
    description: "Tighten spacing on small breakpoints and keep priority rail visible.",
    status: "todo",
    priority: "low",
    dueDate: daysFromNow(14),
    createdAt: daysAgo(4),
    updatedAt: daysAgo(4),
  },
  {
    id: "tsk_07",
    title: "Document persist whitelist",
    description: "Note in README why API cache and transient UI slices are excluded.",
    status: "done",
    priority: "low",
    dueDate: daysAgo(5),
    createdAt: daysAgo(8),
    updatedAt: daysAgo(3),
  },
  {
    id: "tsk_08",
    title: "Review keyboard shortcuts",
    description: "Verify c opens create dialog and / focuses search without breaking inputs.",
    status: "in_progress",
    priority: "medium",
    dueDate: daysFromNow(3),
    createdAt: daysAgo(1),
    updatedAt: daysAgo(0),
  },
  {
    id: "tsk_09",
    title: "Sync filter state with URL",
    description: "Shareable filtered views should survive refresh and back navigation.",
    status: "done",
    priority: "medium",
    dueDate: daysAgo(1),
    createdAt: daysAgo(7),
    updatedAt: daysAgo(2),
  },
  {
    id: "tsk_10",
    title: "Add Playwright happy path",
    description: "Login, create a task, assert it appears in the list.",
    status: "todo",
    priority: "low",
    dueDate: daysFromNow(10),
    createdAt: daysAgo(2),
    updatedAt: daysAgo(2),
  },
  {
    id: "tsk_11",
    title: "Tune motion for reduced preference",
    description: "Respect prefers-reduced-motion for list stagger and dialog enter.",
    status: "todo",
    priority: "medium",
    dueDate: daysFromNow(6),
    createdAt: daysAgo(5),
    updatedAt: daysAgo(5),
  },
  {
    id: "tsk_12",
    title: "Close sprint retro action items",
    description: "Two follow-ups from last retro: clearer PR templates and smaller commits.",
    status: "done",
    priority: "high",
    dueDate: daysAgo(4),
    createdAt: daysAgo(12),
    updatedAt: daysAgo(4),
  },
  {
    id: "tsk_13",
    title: "Validate create form edge cases",
    description: "Empty title, long description, and past due dates should surface clear errors.",
    status: "todo",
    priority: "medium",
    dueDate: daysFromNow(5),
    createdAt: daysAgo(1),
    updatedAt: daysAgo(1),
  },
];
