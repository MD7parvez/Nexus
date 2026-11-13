import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Badge({ className, variant = "default", children }: { className?: string; variant?: "default" | "success" | "warning" | "danger"; children: ReactNode }) {
  const base = "inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide";
  const variants = {
    default: "border-sky-400/40 bg-sky-500/10 text-sky-200",
    success: "border-emerald-400/40 bg-emerald-500/10 text-emerald-200",
    warning: "border-amber-400/40 bg-amber-500/10 text-amber-200",
    danger: "border-rose-400/40 bg-rose-500/10 text-rose-200",
  };

  return <span className={cn(base, variants[variant], className)}>{children}</span>;
}
