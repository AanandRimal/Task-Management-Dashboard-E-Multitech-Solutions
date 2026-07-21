import type { TaskPriority, TaskStatus } from "@/features/tasks/task.schema";

export const STATUS_LABELS: Record<TaskStatus, string> = {
  todo: "To do",
  in_progress: "In progress",
  done: "Done",
};

export const PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

export const SORT_LABELS = {
  dueDateAsc: "Due date (earliest)",
  dueDateDesc: "Due date (latest)",
} as const;
