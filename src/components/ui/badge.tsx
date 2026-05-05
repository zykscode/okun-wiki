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
          "bg-forest-600/10 text-forest-600 dark:bg-forest-500/20 dark:text-forest-400 font-medium":
            variant === "primary",
          "bg-forest-600/10 text-forest-600 dark:text-forest-500": variant === "cyan",
          "bg-wiki-elevated text-wiki-secondary": variant === "earth",
          "border border-wiki-border text-wiki-muted": variant === "outline",
        },
        className,
      )}
      {...props}
    />
  );
}
