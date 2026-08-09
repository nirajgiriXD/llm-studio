"use client";

/**
 * External dependencies.
 */
import { VenetianMaskIcon } from "lucide-react";

/**
 * Internal dependencies.
 */
import { HistorySearch } from "@/components/HistorySearch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { formatDateLabel, formatFullDate } from "@/lib/format";
import useApp from "@/hooks/useApp";
import useSettings from "@/hooks/useSettings";

export const AppHeader = () => {
  const { selectedDate, history, historyStatus, settings } = useApp();
  const { toggleIncognito } = useSettings();

  const messageCount = history[selectedDate]?.length ?? 0;
  const isReady = historyStatus !== "loading";

  return (
    <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-2 border-b bg-background/80 px-2 backdrop-blur-md sm:px-4">
      <SidebarTrigger className="-ml-0.5 shrink-0" />
      <Separator orientation="vertical" className="mr-1 hidden !h-4 sm:block" />

      <div className="min-w-0 flex-1">
        {isReady ? (
          <>
            <div className="flex items-center gap-2">
              <h1 className="truncate text-sm font-semibold tracking-tight">
                {formatDateLabel(selectedDate)}
              </h1>
              {settings.isIncognito && (
                <Badge variant="secondary" className="gap-1 px-1.5 py-0 text-[11px]">
                  <VenetianMaskIcon className="size-3" aria-hidden="true" />
                  Incognito
                </Badge>
              )}
            </div>
            <p className="truncate text-xs text-muted-foreground">
              <span className="hidden sm:inline">{formatFullDate(selectedDate)} · </span>
              {messageCount} message{messageCount === 1 ? "" : "s"}
            </p>
          </>
        ) : (
          <div className="space-y-1.5">
            <Skeleton className="h-3.5 w-24" />
            <Skeleton className="h-3 w-40" />
          </div>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-1 sm:gap-2">
        <HistorySearch />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={toggleIncognito}
              aria-pressed={settings.isIncognito}
              aria-label={
                settings.isIncognito ? "Turn incognito off" : "Turn incognito on"
              }
              className={
                settings.isIncognito
                  ? "bg-accent text-accent-foreground hover:bg-accent"
                  : "text-muted-foreground"
              }
            >
              <VenetianMaskIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {settings.isIncognito
              ? "Incognito is on — messages are not saved"
              : "Turn on incognito"}
          </TooltipContent>
        </Tooltip>
      </div>
    </header>
  );
};
