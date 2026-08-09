"use client";

/**
 * External dependencies.
 */
import { useCallback, useEffect, useMemo, useState } from "react";

/**
 * Internal dependencies.
 */
import useApp from "@/hooks/useApp";
import { toPreview } from "@/lib/format";

const MAX_RESULTS = 40;

const useHistorySearch = () => {
  const { history, selectedDate, setSelectedDate } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");

  // Open the palette from anywhere with the usual shortcut.
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key?.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setIsOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  // Flatten every stored message once, newest conversation first.
  const entries = useMemo(
    () =>
      Object.entries(history)
        .sort(([a], [b]) => b.localeCompare(a))
        .flatMap(([date, messages]) =>
          [...messages]
            .sort((a, b) => String(b.timestamp).localeCompare(String(a.timestamp)))
            .map((message) => ({
              date,
              timestamp: message.timestamp,
              agent: message.agent,
              message: message.message ?? "",
              preview: toPreview(message.message),
            }))
        ),
    [history]
  );

  // Matches for the current query, grouped by conversation date.
  const groups = useMemo(() => {
    const term = query.trim().toLowerCase();

    if (!term) {
      return [];
    }

    const matches = [];

    for (const entry of entries) {
      if (entry.message.toLowerCase().includes(term)) {
        matches.push(entry);
      }

      if (matches.length >= MAX_RESULTS) {
        break;
      }
    }

    return matches.reduce((grouped, entry) => {
      const group = grouped.at(-1);

      if (group?.date === entry.date) {
        group.items.push(entry);
      } else {
        grouped.push({ date: entry.date, items: [entry] });
      }

      return grouped;
    }, []);
  }, [entries, query]);

  const resultCount = useMemo(
    () => groups.reduce((total, group) => total + group.items.length, 0),
    [groups]
  );

  // Navigate to the selected message and bring it into view.
  const handleSelect = useCallback(
    (entry) => {
      setIsOpen(false);
      setQuery("");

      const needsDateChange = entry.date !== selectedDate;

      if (needsDateChange) {
        setSelectedDate(entry.date);
      }

      // Wait for the conversation to paint before scrolling to the message.
      window.setTimeout(
        () => {
          const target = document.querySelector(
            `[data-timestamp="${CSS.escape(entry.timestamp)}"]`
          );

          if (!target) {
            return;
          }

          target.scrollIntoView({ behavior: "smooth", block: "center" });
          target.focus({ preventScroll: true });
        },
        needsDateChange ? 120 : 0
      );
    },
    [selectedDate, setSelectedDate]
  );

  return {
    isOpen,
    setIsOpen,
    query,
    setQuery,
    groups,
    resultCount,
    hasHistory: entries.length > 0,
    handleSelect,
  };
};

export default useHistorySearch;
