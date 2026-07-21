export const spring = { type: "spring", stiffness: 400, damping: 32 } as const;

export const fade = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const listItem = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

export const staggerContainer = {
  animate: {
    transition: { staggerChildren: 0.05 },
  },
};

export function motionSafe<T extends Record<string, unknown>>(
  variants: T,
  prefersReducedMotion: boolean,
): T {
  if (prefersReducedMotion) {
    return { animate: { transition: { duration: 0 } } } as unknown as T;
  }
  return variants;
}
