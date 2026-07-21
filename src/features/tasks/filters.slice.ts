import type { TaskPriority, TaskStatus } from "@/features/tasks/task.schema";
import type { TaskSort } from "@/features/tasks/task.utils";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type FiltersState = {
  search: string;
  status: TaskStatus | "all";
  priority: TaskPriority | "all";
  sort: TaskSort;
};

const initialState: FiltersState = {
  search: "",
  status: "all",
  priority: "all",
  sort: "dueDateAsc",
};

const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
    },
    setStatusFilter(state, action: PayloadAction<FiltersState["status"]>) {
      state.status = action.payload;
    },
    setPriorityFilter(state, action: PayloadAction<FiltersState["priority"]>) {
      state.priority = action.payload;
    },
    setSort(state, action: PayloadAction<TaskSort>) {
      state.sort = action.payload;
    },
    resetFilters(state) {
      state.search = "";
      state.status = "all";
      state.priority = "all";
      state.sort = "dueDateAsc";
    },
    hydrateFilters(_state, action: PayloadAction<FiltersState>) {
      return action.payload;
    },
  },
});

export const {
  setSearch,
  setStatusFilter,
  setPriorityFilter,
  setSort,
  resetFilters,
  hydrateFilters,
} = filtersSlice.actions;

export const filtersReducer = filtersSlice.reducer;

export const selectFilters = (state: { filters: FiltersState }) => state.filters;
