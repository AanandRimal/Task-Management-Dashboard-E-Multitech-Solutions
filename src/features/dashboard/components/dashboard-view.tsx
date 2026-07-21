"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  selectDashboardSummary,
  selectTasksQueryMeta,
} from "@/features/dashboard/dashboard.selectors";
import { CompletionRing } from "@/features/dashboard/components/completion-ring";
import { StatCard } from "@/features/dashboard/components/stat-card";
import { useGetTasksQuery } from "@/features/tasks/tasks.api";
import { DataState } from "@/components/common/data-state";
import { EmptyState } from "@/components/common/empty-state";
import { PageHeader } from "@/components/common/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { staggerContainer } from "@/lib/motion";
import { useAppSelector } from "@/store/hooks";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";

export function DashboardView() {
  const { refetch } = useGetTasksQuery();
  const summary = useAppSelector(selectDashboardSummary);
  const meta = useAppSelector(selectTasksQueryMeta);
  const reduceMotion = useReducedMotion();

  return (
    <div className="space-y-8">
      <PageHeader
        title="Overview"
        description="Summary metrics derived from your task list."
      />
      <DataState
        isLoading={meta.isLoading}
        isError={meta.isError}
        isEmpty={meta.isSuccess && summary.total === 0}
        onRetry={() => void refetch()}
        loadingFallback={
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-xl" />
            ))}
          </div>
        }
        emptyFallback={
          <EmptyState
            title="No tasks yet"
            description="Create your first task to populate the dashboard."
            action={
              <Link href={ROUTES.tasks} className={buttonVariants()}>
                Go to tasks
              </Link>
            }
          />
        }
      >
        <motion.div
          className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
          variants={reduceMotion ? undefined : staggerContainer}
          initial="initial"
          animate="animate"
        >
          <StatCard label="Total tasks" value={summary.total} />
          <StatCard
            label="Completed"
            value={summary.completed}
            hint={`${summary.completionRate}% completion rate`}
            adornment={<CompletionRing value={summary.completionRate} />}
          />
          <StatCard label="Pending" value={summary.pending} />
          <StatCard label="High priority" value={summary.highPriority} />
        </motion.div>
      </DataState>
    </div>
  );
}
