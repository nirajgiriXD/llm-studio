"use client";

/**
 * External dependencies.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowDownIcon, CircleAlertIcon, HardDriveIcon } from "lucide-react";

/**
 * Internal dependencies.
 */
import { BrandMark } from "@/components/BrandMark";
import { ChatMessage } from "@/components/ChatMessage";
import { ThinkingIndicator } from "@/components/ThinkingIndicator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { COMPOSER_INPUT_ID } from "@/components/ChatComposer";
import { formatDateLabel, getTodayKey } from "@/lib/format";
import useApp from "@/hooks/useApp";
import useChat from "@/hooks/useChat";
import useChatHistory from "@/hooks/useChatHistory";

const SUGGESTIONS = [
  "Explain how transformers work, in plain language.",
  "Write a Python function that deduplicates a list of dicts.",
  "Summarise the trade-offs between quantised model formats.",
];

/** Distance from the bottom that still counts as "following along". */
const STICK_THRESHOLD = 96;

/**
 * Placeholder rows shown while stored conversations load.
 */
const ThreadSkeleton = () => (
  <div className="space-y-6" aria-hidden="true">
    {[0, 1, 2].map((row) => (
      <div key={row} className={row % 2 ? "flex flex-row-reverse gap-3" : "flex gap-3"}>
        <Skeleton className="size-7 shrink-0 rounded-lg" />
        <div className="w-full max-w-md space-y-2">
          <Skeleton className="h-16 w-full rounded-2xl" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
    ))}
  </div>
);

export const ChatThread = () => {
  const {
    selectedDate,
    selectedModel,
    models,
    modelsStatus,
    historyStatus,
    isResponseLoading,
    setCurrentUserMessage,
  } = useApp();

  const { messages, pendingDelete, setPendingDelete, confirmDelete, isDeleting } =
    useChatHistory();
  const { handleRetry } = useChat();

  const scrollRef = useRef(null);
  const contentRef = useRef(null);
  const isAtBottomRef = useRef(true);
  const [showJumpToLatest, setShowJumpToLatest] = useState(false);

  const scrollToBottom = useCallback((behavior = "smooth") => {
    const element = scrollRef.current;

    if (element) {
      element.scrollTo({ top: element.scrollHeight, behavior });
    }
  }, []);

  // Subscribe to the two things that move the conversation: the reader
  // scrolling, and the content growing as messages arrive. Staying pinned to
  // the newest message is opt-out — scrolling up stops the view from jumping.
  useEffect(() => {
    const viewport = scrollRef.current;
    const content = contentRef.current;

    if (!viewport || !content) {
      return undefined;
    }

    const sync = () => {
      const distance = viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight;

      isAtBottomRef.current = distance < STICK_THRESHOLD;
      setShowJumpToLatest(!isAtBottomRef.current);
    };

    const observer = new ResizeObserver(() => {
      if (isAtBottomRef.current) {
        viewport.scrollTo({ top: viewport.scrollHeight, behavior: "smooth" });
      }

      sync();
    });

    observer.observe(content);
    viewport.addEventListener("scroll", sync, { passive: true });

    return () => {
      observer.disconnect();
      viewport.removeEventListener("scroll", sync);
    };
  }, []);

  // Jump straight to the end when a different conversation is opened.
  useEffect(() => {
    isAtBottomRef.current = true;
    scrollToBottom("auto");
  }, [historyStatus, selectedDate, scrollToBottom]);

  const applySuggestion = useCallback(
    (suggestion) => {
      setCurrentUserMessage(suggestion);
      document.getElementById(COMPOSER_INPUT_ID)?.focus();
    },
    [setCurrentUserMessage]
  );

  // Stable handlers keep the memoised message rows from re-rendering on every
  // keystroke in the composer.
  const requestDelete = useCallback(
    (message) => setPendingDelete({ date: selectedDate, timestamp: message.timestamp }),
    [selectedDate, setPendingDelete]
  );

  const retryMessage = useCallback(
    (message) => handleRetry(selectedDate, message),
    [handleRetry, selectedDate]
  );

  const isEmpty = messages.length === 0 && !isResponseLoading;
  const isToday = selectedDate === getTodayKey();

  return (
    <div className="relative min-h-0 flex-1">
      <div
        ref={scrollRef}
        className="scrollbar-subtle absolute inset-0 overflow-y-auto overscroll-contain"
      >
        <div
          ref={contentRef}
          className="mx-auto flex min-h-full w-full max-w-3xl flex-col px-3 py-6 sm:px-6"
        >
          {historyStatus === "loading" && <ThreadSkeleton />}

          {historyStatus === "error" && isEmpty && (
            <Empty className="my-auto">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <CircleAlertIcon />
                </EmptyMedia>
                <EmptyTitle>Saved conversations could not be loaded</EmptyTitle>
                <EmptyDescription>
                  Check that the <span className="font-medium">history</span> folder is
                  readable. You can still chat — today&apos;s messages will be saved
                  once it is.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button variant="outline" onClick={() => window.location.reload()}>
                  Reload
                </Button>
              </EmptyContent>
            </Empty>
          )}

          {historyStatus === "ready" && isEmpty && modelsStatus !== "loading" && (
            <Empty className="my-auto">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  {models.length === 0 ? <HardDriveIcon /> : <BrandMark className="size-5" />}
                </EmptyMedia>
                <EmptyTitle>
                  {models.length === 0
                    ? "No models installed"
                    : isToday
                      ? "Start a conversation"
                      : `Nothing saved for ${formatDateLabel(selectedDate)}`}
                </EmptyTitle>
                <EmptyDescription>
                  {models.length === 0 ? (
                    <>
                      Drop a{" "}
                      <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
                        .gguf
                      </code>{" "}
                      model into the <span className="font-medium">models</span> folder
                      at the project root, then reload this page.
                    </>
                  ) : isToday ? (
                    "Everything runs on your machine — nothing leaves it. Ask anything, or pick a starting point below."
                  ) : (
                    "Nothing was saved on this day. Anything you send is added to this conversation."
                  )}
                </EmptyDescription>
              </EmptyHeader>

              {models.length > 0 && (
                <EmptyContent className="max-w-md">
                  {SUGGESTIONS.map((suggestion) => (
                    <Button
                      key={suggestion}
                      variant="outline"
                      onClick={() => applySuggestion(suggestion)}
                      className="h-auto w-full justify-start py-2.5 text-left text-sm font-normal whitespace-normal"
                    >
                      {suggestion}
                    </Button>
                  ))}
                </EmptyContent>
              )}
            </Empty>
          )}

          {messages.length > 0 && (
            <div role="log" aria-label="Conversation" className="space-y-6">
              {messages.map((message) => (
                <ChatMessage
                  key={`${message.timestamp}-${message.agent}`}
                  message={message}
                  isBusy={isResponseLoading}
                  onDelete={requestDelete}
                  onRetry={retryMessage}
                />
              ))}
            </div>
          )}

          {isResponseLoading && (
            <div className={messages.length > 0 ? "mt-6" : "mt-auto"}>
              <ThinkingIndicator model={selectedModel} />
            </div>
          )}
        </div>
      </div>

      {/* Announce generation progress without reading the whole answer aloud. */}
      <p className="sr-only" role="status" aria-live="polite">
        {isResponseLoading ? "Generating a response…" : ""}
      </p>

      {showJumpToLatest && (
        <Button
          variant="outline"
          size="icon"
          onClick={() => scrollToBottom()}
          aria-label="Jump to the latest message"
          className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full shadow-md"
        >
          <ArrowDownIcon />
        </Button>
      )}

      <AlertDialog
        open={Boolean(pendingDelete)}
        onOpenChange={(open) => !open && setPendingDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this message?</AlertDialogTitle>
            <AlertDialogDescription>
              It will be removed from this conversation and from the saved history
              file. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={(event) => {
                event.preventDefault();
                confirmDelete();
              }}
              disabled={isDeleting}
            >
              {isDeleting && <Spinner />}
              Delete message
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
