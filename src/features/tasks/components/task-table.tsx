"use client";

import type { Task } from "@/features/tasks/task.schema";
import { PRIORITY_LABELS, STATUS_LABELS } from "@/constants/labels";
import { formatDueDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpdateTaskMutation } from "@/features/tasks/tasks.api";

const priorityRail: Record<Task["priority"], string> = {
  high: "bg-[var(--priority-high)]",
  medium: "bg-[var(--priority-medium)]",
  low: "bg-[var(--priority-low)]",
};

type TaskTableProps = {
  tasks: Task[];
};

export function TaskTable({ tasks }: TaskTableProps) {
  const [updateTask] = useUpdateTaskMutation();

  return (
    <div className="hidden rounded-xl border md:block">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead className="text-right">Due</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task.id} className="group">
              <TableCell>
                <div className="flex items-center gap-3">
                  <span className={cn("h-8 w-1 rounded-full", priorityRail[task.priority])} />
                  <Link
                    href={ROUTES.taskDetail(task.id)}
                    className="font-medium hover:underline"
                  >
                    {task.title}
                  </Link>
                </div>
              </TableCell>
              <TableCell>
                <Select
                  value={task.status}
                  onValueChange={(value) =>
                    void updateTask({ id: task.id, status: value as Task["status"] })
                  }
                >
                  <SelectTrigger className="h-8 w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(STATUS_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>{PRIORITY_LABELS[task.priority]}</TableCell>
              <TableCell className="text-right font-mono text-sm tabular-nums">
                {formatDueDate(task.dueDate)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
