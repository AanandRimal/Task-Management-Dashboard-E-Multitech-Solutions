import { summarizeTasks } from "@/features/tasks/task.utils";
import type { Task } from "@/features/tasks/task.schema";
import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@/store/root-reducer";
import { tasksApi } from "@/features/tasks/tasks.api";

const selectTasksQueryResult = (state: RootState) =>
  tasksApi.endpoints.getTasks.select()(state);

export const selectAllTasks = createSelector(
  selectTasksQueryResult,
  (result) => result.data ?? ([] as Task[]),
);

export const selectDashboardSummary = createSelector(selectAllTasks, (tasks) =>
  summarizeTasks(tasks),
);

export const selectTasksQueryMeta = createSelector(selectTasksQueryResult, (result) => ({
  isLoading: result.isLoading,
  isError: result.isError,
  isSuccess: result.isSuccess,
  error: result.error,
}));
