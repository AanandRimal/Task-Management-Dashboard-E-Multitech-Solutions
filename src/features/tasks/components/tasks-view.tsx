"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DataState } from "@/components/common/data-state";
import { EmptyState } from "@/components/common/empty-state";
import { PageHeader } from "@/components/common/page-header";
import { TaskCard } from "@/features/tasks/components/task-card";
import { TaskFiltersBar } from "@/features/tasks/components/task-filters";
import { TaskForm } from "@/features/tasks/components/task-form";
import { TaskTable } from "@/features/tasks/components/task-table";
import type { CreateTask } from "@/features/tasks/task.schema";
import { applyFilters, paginateTasks } from "@/features/tasks/task.utils";
import { useCreateTaskMutation, useGetTasksQuery } from "@/features/tasks/tasks.api";
import { useTaskFilters } from "@/features/tasks/use-task-filters";
import { listItem } from "@/lib/motion";
import { useEffect } from "react";
import { openModal, closeModal } from "@/store/ui.slice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

const PAGE_SIZE = 8;

export function TasksView() {
  const dispatch = useAppDispatch();
  const activeModal = useAppSelector((state) => state.ui.activeModal);
  const { data: tasks = [], isLoading, isError, refetch } = useGetTasksQuery();
  const { filters } = useTaskFilters();
  const [createTask, { isLoading: creating }] = useCreateTaskMutation();
  const reduceMotion = useReducedMotion();

  const filtered = useMemo(() => applyFilters(tasks, filters), [tasks, filters]);
  const filterKey = `${filters.search}|${filters.status}|${filters.priority}|${filters.sort}`;
  const [pageByFilter, setPageByFilter] = useState<Record<string, number>>({});
  const page = pageByFilter[filterKey] ?? 1;
  const setPage = (next: number | ((current: number) => number)) => {
    setPageByFilter((prev) => ({
      ...prev,
      [filterKey]:
        typeof next === "function" ? next(prev[filterKey] ?? 1) : next,
    }));
  };
  const pageItems = useMemo(
    () => paginateTasks(filtered, page, PAGE_SIZE),
    [filtered, page],
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "c" && !(event.target instanceof HTMLInputElement)) {
        event.preventDefault();
        dispatch(openModal("createTask"));
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [dispatch]);

  const handleCreate = async (values: CreateTask) => {
    try {
      await createTask(values).unwrap();
      toast.success("Task created");
      dispatch(closeModal());
    } catch {
      toast.error("Could not create task");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tasks"
        description="Browse, filter, and manage work items."
        actions={
          <Button type="button" onClick={() => dispatch(openModal("createTask"))}>
            <Plus className="size-4" aria-hidden />
            Create task
          </Button>
        }
      />

      <TaskFiltersBar />

      <DataState
        isLoading={isLoading}
        isError={isError}
        isEmpty={!isLoading && filtered.length === 0}
        onRetry={() => void refetch()}
        emptyFallback={
          <EmptyState
            title="No matching tasks"
            description="Adjust filters or create a new task to get started."
            action={
              <Button type="button" onClick={() => dispatch(openModal("createTask"))}>
                Create task
              </Button>
            }
          />
        }
      >
        <>
          <TaskTable tasks={pageItems} />
          <div className="grid gap-3 md:hidden">
            <AnimatePresence mode="popLayout">
              {pageItems.map((task) => (
                <motion.div
                  key={task.id}
                  layout={!reduceMotion}
                  variants={reduceMotion ? undefined : listItem}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <TaskCard task={task} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {totalPages > 1 ? (
            <div className="flex items-center justify-between pt-2 text-sm">
              <p className="text-muted-foreground">
                Page {page} of {totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Previous
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          ) : null}
        </>
      </DataState>

      <Dialog
        open={activeModal === "createTask"}
        onOpenChange={(open) => dispatch(open ? openModal("createTask") : closeModal())}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create task</DialogTitle>
          </DialogHeader>
          <TaskForm
            submitLabel={creating ? "Creating…" : "Create task"}
            onSubmit={handleCreate}
            onCancel={() => dispatch(closeModal())}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
