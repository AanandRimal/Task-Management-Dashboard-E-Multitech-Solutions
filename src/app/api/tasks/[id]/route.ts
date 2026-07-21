import {
  deleteTask,
  getTaskById,
  updateTask,
  withLatency,
} from "@/lib/api/repository";
import { UpdateTaskSchema } from "@/features/tasks/task.schema";
import { NextResponse } from "next/server";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const task = getTaskById(id);
  if (!task) {
    return NextResponse.json({ message: "Task not found" }, { status: 404 });
  }
  return NextResponse.json(await withLatency(task));
}

export async function PATCH(request: Request, context: RouteContext) {
  const { id } = await context.params;
  try {
    const body: unknown = await request.json();
    const parsed = UpdateTaskSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { message: "Invalid update payload", issues: parsed.error.flatten() },
        { status: 400 },
      );
    }
    const updated = updateTask(id, parsed.data);
    if (!updated) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 });
    }
    return NextResponse.json(await withLatency(updated));
  } catch {
    return NextResponse.json({ message: "Failed to update task" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const removed = deleteTask(id);
  if (!removed) {
    return NextResponse.json({ message: "Task not found" }, { status: 404 });
  }
  return NextResponse.json(await withLatency({ id }));
}
