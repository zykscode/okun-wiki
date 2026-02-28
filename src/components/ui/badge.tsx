import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "primary" | "earth" | "outline" | "cyan";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
        {
          "bg-wiki-hover text-wiki-secondary": variant === "default",
          "bg-coral-500/15 text-coral-500 dark:text-coral-400": variant === "primary",
          "bg-cyan-500/15 text-cyan-600 dark:text-cyan-500": variant === "cyan",
          "bg-wiki-elevated text-wiki-secondary": variant === "earth",
          "border border-wiki-border text-wiki-muted": variant === "outline",
        },
        className
      )}
      {...props}
    />
  );
}
