import * as React from "react";
import { cn } from "@/lib/utils";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "secondary" | "ghost";
  size?: "default" | "sm" | "lg";
};

export function Button({ className, variant = "default", size = "default", ...props }: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 disabled:pointer-events-none disabled:opacity-50",
    variant === "default" && "bg-cyan-500 text-slate-950 hover:bg-cyan-400",
    variant === "secondary" && "bg-slate-800 text-slate-100 hover:bg-slate-700",
    variant === "ghost" && "bg-transparent text-slate-300 hover:bg-slate-800",
    size === "sm" && "h-8 px-3 text-xs",
    size === "lg" && "h-11 px-5 text-sm",
    size === "default" && "h-10 px-4 text-sm",
    className,
  );

  return <button className={classes} {...props} />;
}
