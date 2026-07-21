"use client";

import { motion, useReducedMotion } from "framer-motion";
import { CheckCircle2, KanbanSquare, LayoutDashboard, ListTodo } from "lucide-react";
import { LoginForm } from "@/features/auth/components/login-form";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { listItem } from "@/lib/motion";

const highlights = [
  { icon: ListTodo, text: "Track every task from backlog to done" },
  { icon: KanbanSquare, text: "Organize work the way your team thinks" },
  { icon: CheckCircle2, text: "See what's on track at a glance" },
];

export default function LoginPage() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-primary p-10 text-primary-foreground lg:flex">
        <div
          className="pointer-events-none absolute inset-0 opacity-90"
          style={{
            background:
              "radial-gradient(circle at 15% 15%, color-mix(in oklab, var(--primary-foreground) 18%, transparent), transparent 45%), radial-gradient(circle at 85% 85%, color-mix(in oklab, var(--primary-foreground) 14%, transparent), transparent 50%)",
          }}
          aria-hidden
        />

        <div className="relative flex items-center gap-2 text-lg font-semibold tracking-tight">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary-foreground/15">
            <LayoutDashboard className="size-4.5" aria-hidden />
          </span>
          Task Dashboard
        </div>

        <div className="relative space-y-8">
          <blockquote className="max-w-md text-3xl leading-tight font-semibold text-balance">
            Plan the work. Track the progress. Ship on time.
          </blockquote>
          <ul className="space-y-3">
            {highlights.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-sm text-primary-foreground/90">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary-foreground/15">
                  <Icon className="size-3.5" aria-hidden />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-primary-foreground/70">
          A calmer way to manage your team&apos;s tasks.
        </p>
      </div>

      <div className="relative flex flex-col items-center justify-center bg-background px-4 py-10">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        <motion.div
          className="w-full max-w-sm"
          variants={reduceMotion ? undefined : listItem}
          initial="initial"
          animate="animate"
        >
          <div className="mb-8 flex items-center gap-2 text-lg font-semibold tracking-tight lg:hidden">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <LayoutDashboard className="size-4.5" aria-hidden />
            </span>
            Task Dashboard
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
          <p className="mt-1 mb-6 text-sm text-muted-foreground">
            Sign in to access your task dashboard.
          </p>
          <LoginForm />
        </motion.div>
      </div>
    </div>
  );
}
