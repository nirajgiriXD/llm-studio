"use client";

/**
 * External dependencies.
 */
import { SearchIcon } from "lucide-react";

/**
 * Internal dependencies.
 */
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  formatDateLabel,
  formatMessageTime,
  formatModelName,
} from "@/lib/format";
import useHistorySearch from "@/hooks/useHistorySearch";
import useIsHydrated from "@/hooks/useIsHydrated";

/**
 * The shortcut hint depends on the platform, which the server cannot know.
 * @returns {string} `⌘` on Apple platforms, otherwise `Ctrl`.
 */
const getModifierKey = () =>
  /mac|iphone|ipad|ipod/i.test(window.navigator.userAgent) ? "⌘" : "Ctrl";

/**
 * Full-history search, opened from the header or with the usual shortcut.
 */
export const HistorySearch = () => {
  const {
    isOpen,
    setIsOpen,
    query,
    setQuery,
    groups,
    resultCount,
    hasHistory,
    handleSelect,
  } = useHistorySearch();

  const isHydrated = useIsHydrated();
  const modifierKey = isHydrated ? getModifierKey() : null;

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setIsOpen(true)}
        className="hidden h-9 w-56 justify-start gap-2 px-3 font-normal text-muted-foreground md:flex lg:w-64"
      >
        <SearchIcon className="shrink-0 opacity-60" />
        <span className="truncate">Search chats…</span>
        {modifierKey && (
          <KbdGroup className="ml-auto">
            <Kbd>{modifierKey}</Kbd>
            <Kbd>K</Kbd>
          </KbdGroup>
        )}
      </Button>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon-sm"
            className="md:hidden"
            onClick={() => setIsOpen(true)}
            aria-label="Search chats"
          >
            <SearchIcon />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Search chats</TooltipContent>
      </Tooltip>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent
          showCloseButton={false}
          className="overflow-hidden p-0 sm:max-w-2xl"
        >
          <DialogHeader className="sr-only">
            <DialogTitle>Search chats</DialogTitle>
            <DialogDescription>
              Search every saved message and jump straight to it.
            </DialogDescription>
          </DialogHeader>

          {/* Filtering happens in the hook so results can be grouped by day. */}
          <Command shouldFilter={false} className="**:[[cmdk-input-wrapper]]:h-12">
            <CommandInput
              value={query}
              onValueChange={setQuery}
              placeholder="Search your chat history…"
            />

            <CommandList className="scrollbar-subtle max-h-[min(24rem,60svh)]">
              {!query.trim() ? (
                <p className="px-4 py-10 text-center text-sm text-muted-foreground">
                  {hasHistory
                    ? "Start typing to search every saved message."
                    : "No saved messages yet. Send a message to build your history."}
                </p>
              ) : resultCount === 0 ? (
                <p className="px-4 py-10 text-center text-sm text-muted-foreground">
                  No messages match{" "}
                  <span className="font-medium text-foreground">
                    “{query.trim()}”
                  </span>
                  .
                </p>
              ) : (
                groups.map((group) => (
                  <CommandGroup key={group.date} heading={formatDateLabel(group.date)}>
                    {group.items.map((item) => (
                      <CommandItem
                        key={`${item.date}-${item.timestamp}`}
                        value={`${item.date}-${item.timestamp}`}
                        onSelect={() => handleSelect(item)}
                        className="flex-col items-start gap-1 py-2.5"
                      >
                        <span className="line-clamp-2 text-sm">{item.preview}</span>
                        <span className="text-xs text-muted-foreground">
                          {item.agent === "user"
                            ? "You"
                            : formatModelName(item.agent)}{" "}
                          · {formatMessageTime(item.timestamp)}
                        </span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                ))
              )}
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>
    </>
  );
};
