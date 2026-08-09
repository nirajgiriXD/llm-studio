"use client";

/**
 * External dependencies.
 */
import { useEffect } from "react";
import { ArrowUpIcon, VenetianMaskIcon } from "lucide-react";

/**
 * Internal dependencies.
 */
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import useApp from "@/hooks/useApp";
import useChat from "@/hooks/useChat";

/** Shared so the empty state can hand focus to the composer. */
export const COMPOSER_INPUT_ID = "chat-composer-input";

const MAX_TEXTAREA_HEIGHT = 200;

export const ChatComposer = () => {
  const { models, modelsStatus, settings } = useApp();
  const {
    currentUserMessage,
    handleChange,
    handleSubmit,
    inputRef,
    isResponseLoading,
    canSubmit,
  } = useChat();

  const hasModels = models.length > 0;
  const isDisabled = modelsStatus === "loading" || !hasModels;

  // Grow the textarea with its content, up to a fixed ceiling.
  useEffect(() => {
    const element = inputRef.current;

    if (!element) {
      return;
    }

    element.style.height = "auto";
    element.style.height = `${Math.min(element.scrollHeight, MAX_TEXTAREA_HEIGHT)}px`;
  }, [currentUserMessage, inputRef]);

  const onKeyDown = (event) => {
    // Enter sends; Shift+Enter and Ctrl+Enter insert a newline, which the
    // textarea already does on its own.
    if (event.key === "Enter" && !event.shiftKey && !event.ctrlKey && !event.metaKey) {
      event.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="shrink-0 border-t bg-background/80 backdrop-blur-md">
      <div className="mx-auto w-full max-w-3xl px-3 pt-3 pb-3 sm:px-6 sm:pt-4">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            handleSubmit();
          }}
        >
          <div className="rounded-2xl border bg-card shadow-xs transition-[border-color,box-shadow] focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/40">
            <label htmlFor={COMPOSER_INPUT_ID} className="sr-only">
              Message the model
            </label>

            <Textarea
              id={COMPOSER_INPUT_ID}
              ref={inputRef}
              rows={1}
              value={currentUserMessage}
              onChange={handleChange}
              onKeyDown={onKeyDown}
              disabled={isDisabled}
              aria-describedby="composer-hint"
              placeholder={
                hasModels
                  ? "Ask anything…"
                  : "Add a .gguf model to the models folder to start chatting"
              }
              className="max-h-50 min-h-11 resize-none border-0 bg-transparent px-4 py-3 text-sm shadow-none focus-visible:ring-0 dark:bg-transparent"
            />

            <div className="flex items-center gap-2 px-2.5 pb-2.5">
              <p
                id="composer-hint"
                className="hidden items-center gap-1.5 text-xs text-muted-foreground sm:flex"
              >
                <Kbd>Enter</Kbd> to send
                <span aria-hidden="true">·</span>
                <Kbd>Shift</Kbd>
                <Kbd>Enter</Kbd> for a new line
              </p>

              <div className="ml-auto flex items-center gap-2">
                {settings.isIncognito && (
                  <Badge variant="secondary" className="gap-1 px-1.5 py-0 text-[11px]">
                    <VenetianMaskIcon className="size-3" aria-hidden="true" />
                    Incognito
                  </Badge>
                )}

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="submit"
                      size="icon-sm"
                      className="rounded-full"
                      disabled={!canSubmit}
                      aria-label={
                        isResponseLoading ? "Generating a response" : "Send message"
                      }
                    >
                      {isResponseLoading ? <Spinner /> : <ArrowUpIcon />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {isResponseLoading ? "Generating…" : "Send"}
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>
        </form>

        <p className="mt-2 text-center text-[11px] text-muted-foreground">
          {settings.isIncognito
            ? "Incognito is on — this conversation is not written to disk."
            : "Runs entirely on this machine. Responses can be inaccurate."}
        </p>
      </div>
    </div>
  );
};
