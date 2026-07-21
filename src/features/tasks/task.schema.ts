import { z } from "zod";

export const TaskStatus = z.enum(["todo", "in_progress", "done"]);
export const TaskPriority = z.enum(["low", "medium", "high"]);

export const TaskSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required").max(120),
  description: z.string().max(2000),
  status: TaskStatus,
  priority: TaskPriority,
  dueDate: z.string().datetime(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const CreateTaskSchema = TaskSchema.pick({
  title: true,
  description: true,
  status: true,
  priority: true,
  dueDate: true,
});

export const UpdateTaskSchema = CreateTaskSchema.partial();

export type TaskStatus = z.infer<typeof TaskStatus>;
export type TaskPriority = z.infer<typeof TaskPriority>;
export type Task = z.infer<typeof TaskSchema>;
export type CreateTask = z.infer<typeof CreateTaskSchema>;
export type UpdateTask = z.infer<typeof UpdateTaskSchema>;
