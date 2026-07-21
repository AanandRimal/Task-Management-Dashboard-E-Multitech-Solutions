import type { Task } from "@/features/tasks/task.schema";
import { PRIORITY_LABELS, STATUS_LABELS } from "@/constants/labels";
import { formatDueDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";

const priorityRail: Record<Task["priority"], string> = {
  high: "bg-[var(--priority-high)]",
  medium: "bg-[var(--priority-medium)]",
  low: "bg-[var(--priority-low)]",
};

type TaskCardProps = {
  task: Task;
  className?: string;
};

export function TaskCard({ task, className }: TaskCardProps) {
  return (
    <Link
      href={ROUTES.taskDetail(task.id)}
      className={cn(
        "group relative flex gap-3 rounded-xl border border-border/80 bg-card p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md",
        className,
      )}
    >
      <span
        className={cn("absolute inset-y-3 left-0 w-1 rounded-r-full", priorityRail[task.priority])}
        aria-hidden
      />
      <div className="min-w-0 flex-1 pl-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="truncate font-medium">{task.title}</h3>
          <span className="shrink-0 font-mono text-xs tabular-nums text-muted-foreground">
            {formatDueDate(task.dueDate)}
          </span>
        </div>
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{task.description}</p>
        <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
          <span>{STATUS_LABELS[task.status]}</span>
          <span aria-hidden>·</span>
          <span>{PRIORITY_LABELS[task.priority]} priority</span>
        </div>
      </div>
    </Link>
  );
}
