"use client";

import { motion, useReducedMotion } from "framer-motion";
import { LoginForm } from "@/features/auth/components/login-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { listItem } from "@/lib/motion";

export default function LoginPage() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--surface-muted)] px-4 py-10">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <motion.div
        className="w-full max-w-md"
        variants={reduceMotion ? undefined : listItem}
        initial="initial"
        animate="animate"
      >
        <Card className="border-border/80 shadow-md">
          <CardHeader>
            <CardTitle className="text-2xl tracking-tight">Sign in</CardTitle>
            <CardDescription>Access your task dashboard.</CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
