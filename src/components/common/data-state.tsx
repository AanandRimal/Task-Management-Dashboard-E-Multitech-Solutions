"use client";

import type { ReactNode } from "react";
import { AlertCircle } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { fade } from "@/lib/motion";

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
  const state = isLoading ? "loading" : isError ? "error" : isEmpty ? "empty" : "content";
  const reduceMotion = useReducedMotion();

  const content = isLoading ? (
    loadingFallback ?? (
      <div className="space-y-3">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    )
  ) : isError ? (
    <div role="alert" className="rounded-xl border border-destructive/30 bg-destructive/5 p-6">
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
  ) : isEmpty ? (
    emptyFallback
  ) : (
    children
  );

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={state}
        variants={reduceMotion ? undefined : fade}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.15 }}
      >
        {content}
      </motion.div>
    </AnimatePresence>
  );
}
