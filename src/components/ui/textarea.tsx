import { cn } from "@/lib/utils";
import { TextareaHTMLAttributes, forwardRef } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-wiki-text mb-1.5">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={id}
          className={cn(
            "w-full rounded-xl border border-wiki-border bg-wiki-input px-4 py-2.5 text-sm text-wiki-text placeholder:text-wiki-muted focus:outline-none focus:ring-2 focus:ring-forest-500/30 focus:border-forest-500 transition-all duration-200 min-h-[100px] theme-transition",
            error && "border-red-500 focus:ring-red-500/30",
            className
          )}
          style={{ backdropFilter: "blur(12px)" }}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
export { Textarea };
