import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-250 focus:outline-none focus:ring-2 focus:ring-coral-500/40 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer",
          "dark:focus:ring-offset-wiki-bg",
          {
            "bg-gradient-to-r from-coral-500 to-coral-700 text-white hover:shadow-lg hover:shadow-coral-500/25 hover:-translate-y-0.5": variant === "primary",
            "bg-wiki-card-strong border border-wiki-border text-wiki-text hover:border-wiki-border-accent hover:shadow-lg hover:shadow-coral-500/10 hover:-translate-y-0.5": variant === "secondary",
            "border border-wiki-border bg-wiki-card text-wiki-text hover:border-wiki-border-accent hover:bg-wiki-hover": variant === "outline",
            "text-wiki-secondary hover:text-wiki-text hover:bg-wiki-hover": variant === "ghost",
            "bg-gradient-to-r from-red-600 to-red-800 text-white hover:shadow-lg hover:shadow-red-600/25 hover:-translate-y-0.5": variant === "danger",
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
