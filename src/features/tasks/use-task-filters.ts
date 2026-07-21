"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";
import {
  hydrateFilters,
  selectFilters,
  setPriorityFilter,
  setSearch,
  setSort,
  setStatusFilter,
  type FiltersState,
} from "@/features/tasks/filters.slice";
import type { TaskPriority, TaskStatus } from "@/features/tasks/task.schema";
import type { TaskSort } from "@/features/tasks/task.utils";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

function parseFiltersFromSearchParams(params: URLSearchParams): FiltersState {
  const status = params.get("status") as TaskStatus | "all" | null;
  const priority = params.get("priority") as TaskPriority | "all" | null;
  const sort = params.get("sort") as TaskSort | null;

  return {
    search: params.get("q") ?? "",
    status: status && ["todo", "in_progress", "done", "all"].includes(status) ? status : "all",
    priority:
      priority && ["low", "medium", "high", "all"].includes(priority) ? priority : "all",
    sort: sort === "dueDateDesc" ? "dueDateDesc" : "dueDateAsc",
  };
}

function filtersToSearchParams(filters: FiltersState): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.search) params.set("q", filters.search);
  if (filters.status !== "all") params.set("status", filters.status);
  if (filters.priority !== "all") params.set("priority", filters.priority);
  if (filters.sort !== "dueDateAsc") params.set("sort", filters.sort);
  return params;
}

export function useTaskFilters() {
  const dispatch = useAppDispatch();
  const filters = useAppSelector(selectFilters);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const hydrated = useRef(false);

  useEffect(() => {
    if (hydrated.current) return;
    const fromUrl = parseFiltersFromSearchParams(searchParams);
    dispatch(hydrateFilters(fromUrl));
    hydrated.current = true;
  }, [dispatch, searchParams]);

  const syncUrl = useCallback(
    (next: FiltersState) => {
      const qs = filtersToSearchParams(next).toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [pathname, router],
  );

  const update = useCallback(
    (partial: Partial<FiltersState>) => {
      const next = { ...filters, ...partial };
      if (partial.search !== undefined) dispatch(setSearch(partial.search));
      if (partial.status !== undefined) dispatch(setStatusFilter(partial.status));
      if (partial.priority !== undefined) dispatch(setPriorityFilter(partial.priority));
      if (partial.sort !== undefined) dispatch(setSort(partial.sort));
      syncUrl(next);
    },
    [dispatch, filters, syncUrl],
  );

  return { filters, update };
}
