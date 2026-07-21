"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { listItem, spring } from "@/lib/motion";
import { cn } from "@/lib/utils";

type StatCardProps = {
  label: string;
  value: number | string;
  hint?: string;
  adornment?: ReactNode;
  mono?: boolean;
};

export function StatCard({ label, value, hint, adornment, mono = true }: StatCardProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className="h-full"
      variants={reduceMotion ? undefined : listItem}
      transition={reduceMotion ? undefined : spring}
    >
      <Card className="h-full border-border/80 shadow-sm">
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
          {adornment}
        </CardHeader>
        <CardContent>
          <p
            className={cn(
              "text-3xl font-semibold tracking-tight",
              mono && "font-mono tabular-nums",
            )}
          >
            {value}
          </p>
          {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
        </CardContent>
      </Card>
    </motion.div>
  );
}
