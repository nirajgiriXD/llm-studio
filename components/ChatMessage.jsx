"use client";

/**
 * External dependencies.
 */
import { memo } from "react";
import {
  CheckIcon,
  CopyIcon,
  RefreshCwIcon,
  TriangleAlertIcon,
  Trash2Icon,
  UserIcon,
} from "lucide-react";

/**
 * Internal dependencies.
 */
import { BrandMark } from "@/components/BrandMark";
import { Markdown } from "@/components/Markdown";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  formatMessageDateTime,
  formatMessageTime,
  formatModelName,
} from "@/lib/format";
import useCopy from "@/hooks/useCopy";

/**
 * A single turn in the conversation.
 *
 * The row keeps its `data-timestamp` and focusability so search results can
 * scroll to it and land keyboard focus on the right message.
 */
export const ChatMessage = memo(function ChatMessage({
  message,
  isBusy,
  onDelete,
  onRetry,
}) {
  const { isCopied, copy } = useCopy();

  const isUser = message.agent === "user";
  const isError = message.status === "error";
  const author = isUser ? "You" : formatModelName(message.agent) || "Model";

  return (
    <article
      tabIndex={0}
      data-timestamp={message.timestamp}
      aria-label={`${author} at ${formatMessageDateTime(message.timestamp)}`}
      className={cn(
        "group/message flex w-full gap-3 scroll-mt-6 rounded-2xl outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
        isUser && "flex-row-reverse"
      )}
    >
      <div
        className={cn(
          "mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg border shadow-xs",
          isUser ? "bg-primary text-primary-foreground" : "bg-card text-primary",
          isError && "border-destructive/40 bg-destructive/10 text-destructive"
        )}
        aria-hidden="true"
      >
        {isUser ? (
          <UserIcon className="size-3.5" />
        ) : isError ? (
          <TriangleAlertIcon className="size-3.5" />
        ) : (
          <BrandMark className="size-3.5" />
        )}
      </div>

      <div
        className={cn(
          "flex min-w-0 max-w-[min(46rem,88%)] flex-col gap-1",
          isUser && "items-end"
        )}
      >
        <div
          className={cn(
            "w-fit max-w-full rounded-2xl px-3.5 py-2.5 shadow-xs",
            isUser
              ? "rounded-tr-sm bg-primary text-primary-foreground"
              : "rounded-tl-sm border bg-card",
            isError && "border-destructive/40 bg-destructive/5 text-foreground"
          )}
        >
          {isError && (
            <p className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-destructive">
              <TriangleAlertIcon className="size-3.5" aria-hidden="true" />
              Generation failed
            </p>
          )}

          {isUser || isError ? (
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {message.message}
            </p>
          ) : (
            <Markdown>{message.message}</Markdown>
          )}

          {isError && message.prompt && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-3"
              disabled={isBusy}
              onClick={() => onRetry(message)}
            >
              <RefreshCwIcon />
              Try again
            </Button>
          )}
        </div>

        <div
          className={cn(
            "flex items-center gap-1 px-1 text-xs text-muted-foreground",
            isUser && "flex-row-reverse"
          )}
        >
          <span className="truncate">{author}</span>
          <span aria-hidden="true">·</span>
          <time
            dateTime={message.timestamp}
            title={formatMessageDateTime(message.timestamp)}
            className="tabular-nums"
          >
            {formatMessageTime(message.timestamp)}
          </time>

          {/* Actions stay mounted so they remain reachable by keyboard, and
              become visible on hover, focus or touch. */}
          <div
            className={cn(
              "flex items-center transition-opacity",
              "opacity-100 sm:opacity-0",
              "sm:group-hover/message:opacity-100 sm:group-focus-within/message:opacity-100"
            )}
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => copy(message.message)}
                  aria-label={isCopied ? "Message copied" : "Copy message"}
                >
                  {isCopied ? <CheckIcon className="text-success" /> : <CopyIcon />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{isCopied ? "Copied" : "Copy"}</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  className="text-muted-foreground hover:text-destructive"
                  onClick={() => onDelete(message)}
                  aria-label="Delete message"
                >
                  <Trash2Icon />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Delete</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </article>
  );
});
