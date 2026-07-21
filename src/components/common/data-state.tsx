import type { ReactNode } from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

type DataStateProps = {
  isLoading: boolean;
  isError: boolean;
  isEmpty: boolean;
  onRetry?: () => void;
  loadingFallback?: ReactNode;
  emptyFallback: ReactNode;
  errorMessage?: string;
  children: ReactNode;
};

export function DataState({
  isLoading,
  isError,
  isEmpty,
  onRetry,
  loadingFallback,
  emptyFallback,
  errorMessage = "Something went wrong while loading data.",
  children,
}: DataStateProps) {
  if (isLoading) {
    return (
      <>
        {loadingFallback ?? (
          <div className="space-y-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        )}
      </>
    );
  }

  if (isError) {
    return (
      <div
        role="alert"
        className="rounded-xl border border-destructive/30 bg-destructive/5 p-6"
      >
        <div className="flex items-start gap-3">
          <AlertCircle className="mt-0.5 size-5 text-destructive" aria-hidden />
          <div className="space-y-3">
            <div>
              <p className="font-medium text-foreground">Could not load content</p>
              <p className="text-sm text-muted-foreground">{errorMessage}</p>
            </div>
            {onRetry ? (
              <Button type="button" variant="outline" size="sm" onClick={onRetry}>
                Try again
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  if (isEmpty) {
    return <>{emptyFallback}</>;
  }

  return <>{children}</>;
}
