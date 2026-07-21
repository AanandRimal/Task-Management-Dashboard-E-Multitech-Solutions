"use client";

import { Search } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PRIORITY_LABELS, SORT_LABELS, STATUS_LABELS } from "@/constants/labels";
import { useTaskFilters } from "@/features/tasks/use-task-filters";
import { debounce } from "@/lib/utils";

export function TaskFiltersBar() {
  const { filters, update } = useTaskFilters();
  const [draftSearch, setDraftSearch] = useState<string | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const searchValue = draftSearch ?? filters.search;

  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        update({ search: value });
        setDraftSearch(null);
      }, 300),
    [update],
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "/" && !(event.target instanceof HTMLInputElement)) {
        event.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className="grid gap-3 rounded-xl border bg-card p-4 md:grid-cols-[1fr_auto_auto_auto]">
      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          ref={searchRef}
          value={searchValue}
          onChange={(event) => {
            setDraftSearch(event.target.value);
            debouncedSearch(event.target.value);
          }}
          placeholder="Search by title"
          className="pl-9"
          aria-label="Search tasks by title"
        />
        <span className="pointer-events-none absolute top-1/2 right-3 hidden -translate-y-1/2 rounded border px-1.5 py-0.5 text-[10px] text-muted-foreground sm:inline">
          /
        </span>
      </div>
      <Select
        value={filters.status}
        onValueChange={(value) =>
          update({ status: value as typeof filters.status })
        }
      >
        <SelectTrigger className="w-full md:w-[160px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          {Object.entries(STATUS_LABELS).map(([value, label]) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={filters.priority}
        onValueChange={(value) =>
          update({ priority: value as typeof filters.priority })
        }
      >
        <SelectTrigger className="w-full md:w-[160px]">
          <SelectValue placeholder="Priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All priorities</SelectItem>
          {Object.entries(PRIORITY_LABELS).map(([value, label]) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={filters.sort}
        onValueChange={(value) => update({ sort: value as typeof filters.sort })}
      >
        <SelectTrigger className="w-full md:w-[200px]">
          <SelectValue placeholder="Sort" />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(SORT_LABELS).map(([value, label]) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
