import type { Task, TaskPriority, TaskStatus } from "@/features/tasks/task.schema";

export type TaskSort = "dueDateAsc" | "dueDateDesc";

export type TaskFilters = {
  search: string;
  status: TaskStatus | "all";
  priority: TaskPriority | "all";
  sort: TaskSort;
};

export function applyFilters(tasks: Task[], filters: TaskFilters): Task[] {
  const query = filters.search.trim().toLowerCase();

  let result = tasks.filter((task) => {
    if (query && !task.title.toLowerCase().includes(query)) {
      return false;
    }
    if (filters.status !== "all" && task.status !== filters.status) {
      return false;
    }
    if (filters.priority !== "all" && task.priority !== filters.priority) {
      return false;
    }
    return true;
  });

  result = sortByDueDate(result, filters.sort);
  return result;
}

export function sortByDueDate(tasks: Task[], sort: TaskSort): Task[] {
  const copy = [...tasks];
  copy.sort((a, b) => {
    const aTime = new Date(a.dueDate).getTime();
    const bTime = new Date(b.dueDate).getTime();
    return sort === "dueDateAsc" ? aTime - bTime : bTime - aTime;
  });
  return copy;
}

export type DashboardSummary = {
  total: number;
  completed: number;
  pending: number;
  highPriority: number;
  completionRate: number;
};

export function summarizeTasks(tasks: Task[]): DashboardSummary {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === "done").length;
  const pending = tasks.filter((t) => t.status !== "done").length;
  const highPriority = tasks.filter((t) => t.priority === "high").length;
  const completionRate = total === 0 ? 0 : Math.round((completed / total) * 100);

  return { total, completed, pending, highPriority, completionRate };
}

export function paginateTasks<T>(items: T[], page: number, pageSize: number): T[] {
  const start = (page - 1) * pageSize;
  return items.slice(start, start + pageSize);
}
