import { createTask, listTasks, withLatency } from "@/lib/api/repository";
import { CreateTaskSchema } from "@/features/tasks/task.schema";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tasks = await withLatency(
      listTasks({
        status: searchParams.get("status") ?? undefined,
        priority: searchParams.get("priority") ?? undefined,
        search: searchParams.get("search") ?? undefined,
      }),
    );
    return NextResponse.json(tasks);
  } catch {
    return NextResponse.json({ message: "Failed to load tasks" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const parsed = CreateTaskSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { message: "Invalid task payload", issues: parsed.error.flatten() },
        { status: 400 },
      );
    }
    const task = await withLatency(createTask(parsed.data));
    return NextResponse.json(task, { status: 201 });
  } catch {
    return NextResponse.json({ message: "Failed to create task" }, { status: 500 });
  }
}
