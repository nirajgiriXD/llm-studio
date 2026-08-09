"use client";

/**
 * Internal dependencies.
 */
import { BrandMark } from "@/components/BrandMark";
import { formatModelName } from "@/lib/format";

/**
 * Shown while the local model is generating an answer.
 */
export const ThinkingIndicator = ({ model }) => (
  <div className="flex w-full gap-3">
    <div
      className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg border bg-card text-primary shadow-xs"
      aria-hidden="true"
    >
      <BrandMark className="size-3.5" />
    </div>

    <div className="flex min-h-7 items-center gap-2.5 rounded-2xl rounded-tl-sm border bg-card px-3.5 py-2 shadow-xs">
      <span className="flex items-center gap-1" aria-hidden="true">
        {[0, 1, 2].map((index) => (
          <span
            key={index}
            className="size-1.5 rounded-full bg-muted-foreground animate-thinking-dot"
            style={{ animationDelay: `${index * 0.16}s` }}
          />
        ))}
      </span>
      <span className="text-xs text-muted-foreground">
        {model ? `${formatModelName(model)} is thinking…` : "Thinking…"}
      </span>
    </div>
  </div>
);
