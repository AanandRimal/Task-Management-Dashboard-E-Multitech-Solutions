"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PRIORITY_LABELS, STATUS_LABELS } from "@/constants/labels";
import {
  CreateTaskSchema,
  type CreateTask,
  type Task,
} from "@/features/tasks/task.schema";

type TaskFormProps = {
  initialTask?: Task;
  submitLabel: string;
  onSubmit: (values: CreateTask) => Promise<void> | void;
  onCancel?: () => void;
};

export function TaskForm({ initialTask, submitLabel, onSubmit, onCancel }: TaskFormProps) {
  const form = useForm<CreateTask>({
    resolver: zodResolver(CreateTaskSchema),
    defaultValues: {
      title: initialTask?.title ?? "",
      description: initialTask?.description ?? "",
      status: initialTask?.status ?? "todo",
      priority: initialTask?.priority ?? "medium",
      dueDate: initialTask?.dueDate ?? new Date().toISOString(),
    },
  });

  useEffect(() => {
    if (initialTask) {
      form.reset({
        title: initialTask.title,
        description: initialTask.description,
        status: initialTask.status,
        priority: initialTask.priority,
        dueDate: initialTask.dueDate,
      });
    }
  }, [form, initialTask]);

  const handleSubmit = form.handleSubmit(async (values) => {
    await onSubmit(values);
  });

  const dueLocalValue = (() => {
    const raw = form.watch("dueDate");
    try {
      const d = new Date(raw);
      const pad = (n: number) => String(n).padStart(2, "0");
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    } catch {
      return "";
    }
  })();

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" {...form.register("title")} />
        {form.formState.errors.title ? (
          <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>
        ) : null}
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" rows={4} {...form.register("description")} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Status</Label>
          <Select
            value={form.watch("status")}
            onValueChange={(value) =>
              form.setValue("status", value as CreateTask["status"], { shouldValidate: true })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(STATUS_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Priority</Label>
          <Select
            value={form.watch("priority")}
            onValueChange={(value) =>
              form.setValue("priority", value as CreateTask["priority"], { shouldValidate: true })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(PRIORITY_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="dueDate">Due date</Label>
        <Input
          id="dueDate"
          type="datetime-local"
          value={dueLocalValue}
          onChange={(event) => {
            const next = new Date(event.target.value);
            if (!Number.isNaN(next.getTime())) {
              form.setValue("dueDate", next.toISOString(), { shouldValidate: true });
            }
          }}
        />
      </div>
      <div className="flex justify-end gap-2 pt-2">
        {onCancel ? (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        ) : null}
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? (
            <Loader2 className="size-4 animate-spin" aria-hidden />
          ) : null}
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
