"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button, buttonVariants } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { DataState } from "@/components/common/data-state";
import { PageHeader } from "@/components/common/page-header";
import { TaskForm } from "@/features/tasks/components/task-form";
import { PRIORITY_LABELS, STATUS_LABELS } from "@/constants/labels";
import type { CreateTask } from "@/features/tasks/task.schema";
import {
  useDeleteTaskMutation,
  useGetTaskQuery,
  useUpdateTaskMutation,
} from "@/features/tasks/tasks.api";
import { formatDueDate } from "@/lib/utils";
import { ROUTES } from "@/constants/routes";
import { Skeleton } from "@/components/ui/skeleton";

type TaskDetailViewProps = {
  taskId: string;
};

export function TaskDetailView({ taskId }: TaskDetailViewProps) {
  const router = useRouter();
  const { data: task, isLoading, isError, refetch } = useGetTaskQuery(taskId);
  const [updateTask, { isLoading: updating }] = useUpdateTaskMutation();
  const [deleteTask, { isLoading: deleting }] = useDeleteTaskMutation();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [editing, setEditing] = useState(false);

  const handleUpdate = async (values: CreateTask) => {
    if (!task) return;
    try {
      await updateTask({ id: task.id, ...values }).unwrap();
      toast.success("Task updated");
      setEditing(false);
    } catch {
      toast.error("Could not update task");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTask(taskId).unwrap();
      toast.success("Task deleted");
      router.push(ROUTES.tasks);
    } catch {
      toast.error("Could not delete task");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Task detail"
        description="Review and update a single task."
        actions={
          <Link href={ROUTES.tasks} className={buttonVariants({ variant: "outline" })}>
            Back to list
          </Link>
        }
      />

      <DataState
        isLoading={isLoading}
        isError={isError}
        isEmpty={!task && !isLoading}
        onRetry={() => void refetch()}
        loadingFallback={<Skeleton className="h-64 w-full rounded-xl" />}
        emptyFallback={
          <div className="rounded-xl border p-6 text-sm text-muted-foreground">
            Task not found. It may have been deleted.
          </div>
        }
        errorMessage="We could not load this task. Check your connection and try again."
      >
        {task ? (
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            {!editing ? (
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold tracking-tight">{task.title}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {task.description || "No description provided."}
                  </p>
                </div>
                <dl className="grid gap-3 text-sm sm:grid-cols-2">
                  <div>
                    <dt className="text-muted-foreground">Status</dt>
                    <dd className="font-medium">{STATUS_LABELS[task.status]}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Priority</dt>
                    <dd className="font-medium">{PRIORITY_LABELS[task.priority]}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Due date</dt>
                    <dd className="font-mono tabular-nums">{formatDueDate(task.dueDate)}</dd>
                  </div>
                </dl>
                <div className="flex flex-wrap gap-2 pt-2">
                  <Button type="button" onClick={() => setEditing(true)}>
                    Edit task
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => setConfirmOpen(true)}
                  >
                    Delete task
                  </Button>
                </div>
              </div>
            ) : (
              <TaskForm
                initialTask={task}
                submitLabel={updating ? "Saving…" : "Save changes"}
                onSubmit={handleUpdate}
                onCancel={() => setEditing(false)}
              />
            )}
          </div>
        ) : null}
      </DataState>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Delete this task?"
        description="This action cannot be undone. The task will be removed from your list."
        confirmLabel={deleting ? "Deleting…" : "Delete task"}
        onConfirm={() => void handleDelete()}
        isLoading={deleting}
      />
    </div>
  );
}
