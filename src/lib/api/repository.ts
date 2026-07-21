import { SEED_TASKS } from "@/lib/api/seed";
import {
  CreateTaskSchema,
  TaskSchema,
  UpdateTaskSchema,
  type CreateTask,
  type Task,
  type UpdateTask,
} from "@/features/tasks/task.schema";

const globalForTasks = globalThis as unknown as { __taskStore?: Map<string, Task> };

function getStore(): Map<string, Task> {
  if (!globalForTasks.__taskStore) {
    globalForTasks.__taskStore = new Map(SEED_TASKS.map((t) => [t.id, { ...t }]));
  }
  return globalForTasks.__taskStore;
}

export async function withLatency<T>(value: T, ms = 250): Promise<T> {
  await new Promise((resolve) => setTimeout(resolve, ms));
  return value;
}

export function listTasks(filters?: {
  status?: string;
  priority?: string;
  search?: string;
}): Task[] {
  let tasks = Array.from(getStore().values());

  if (filters?.search) {
    const q = filters.search.toLowerCase();
    tasks = tasks.filter((t) => t.title.toLowerCase().includes(q));
  }
  if (filters?.status && filters.status !== "all") {
    tasks = tasks.filter((t) => t.status === filters.status);
  }
  if (filters?.priority && filters.priority !== "all") {
    tasks = tasks.filter((t) => t.priority === filters.priority);
  }

  return tasks.sort(
    (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
  );
}

export function getTaskById(id: string): Task | undefined {
  return getStore().get(id);
}

export function createTask(input: CreateTask): Task {
  const parsed = CreateTaskSchema.parse(input);
  const now = new Date().toISOString();
  const task: Task = TaskSchema.parse({
    ...parsed,
    id: `tsk_${crypto.randomUUID().slice(0, 8)}`,
    createdAt: now,
    updatedAt: now,
  });
  getStore().set(task.id, task);
  return task;
}

export function updateTask(id: string, patch: UpdateTask): Task | null {
  const existing = getStore().get(id);
  if (!existing) return null;
  const parsed = UpdateTaskSchema.parse(patch);
  const updated: Task = TaskSchema.parse({
    ...existing,
    ...parsed,
    updatedAt: new Date().toISOString(),
  });
  getStore().set(id, updated);
  return updated;
}

export function deleteTask(id: string): boolean {
  return getStore().delete(id);
}
