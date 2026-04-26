import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";
import { Slot } from "@radix-ui/react-slot";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-forest-500/40 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer tracking-wide",
          "dark:focus:ring-offset-wiki-bg",
          {
            "bg-forest-600 text-white hover:bg-forest-500 hover:shadow-lg hover:shadow-forest-500/20 hover:-translate-y-0.5": variant === "primary",
            "bg-wiki-card-strong border border-wiki-border text-wiki-text hover:border-forest-500/30 hover:text-forest-600 dark:hover:text-forest-400 hover:shadow-md hover:shadow-forest-500/5 hover:-translate-y-0.5": variant === "secondary",
            "border border-wiki-border bg-transparent text-wiki-text hover:border-forest-500/30 hover:bg-forest-50 dark:hover:bg-forest-900/20 hover:text-forest-600 dark:hover:text-forest-400": variant === "outline",
            "text-wiki-secondary hover:text-forest-600 dark:hover:text-forest-400 hover:bg-forest-50 dark:hover:bg-forest-900/20": variant === "ghost",
            "bg-red-600/90 hover:bg-red-500 text-white hover:shadow-lg hover:shadow-red-500/20 hover:-translate-y-0.5": variant === "danger",
          },
          {
            "px-3 py-1.5 text-sm": size === "sm",
            "px-5 py-2.5 text-sm": size === "md",
            "px-7 py-3.5 text-base": size === "lg",
          },
          className
        )}
        style={{ backdropFilter: variant === "secondary" || variant === "outline" ? "blur(12px)" : undefined }}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
export { Button };
export type { ButtonProps };
