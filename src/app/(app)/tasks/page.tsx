import { Suspense } from "react";
import { TasksView } from "@/features/tasks/components/tasks-view";
import { Skeleton } from "@/components/ui/skeleton";

export default function TasksPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-4">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-32 w-full" />
        </div>
      }
    >
      <TasksView />
    </Suspense>
  );
}
