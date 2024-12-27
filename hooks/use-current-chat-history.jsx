"use client";

import { useCallback, useMemo } from "react";
import { toast } from "./use-toast";

const useCurrentChatHistory = ({ history, setHistory, selectedDate }) => {
  const sortedHistory = useMemo(
    () =>
      (history[selectedDate] || []).sort((a, b) =>
        a.timestamp.localeCompare(b.timestamp)
      ),
    [history, selectedDate]
  );

  const handleCopy = useCallback((message, setIsCopying) => {
    setIsCopying(true);

    // Copy to clipboard
    navigator.clipboard.writeText(message);

    setTimeout(() => {
      setIsCopying(false);
    }, 1000);
  }, []);

  const handleDelete = useCallback(async (date, timestamp) => {
    const isConfirmed = confirm(
      `Are you sure you want to delete this message?`
    );

    if (!isConfirmed) {
      return;
    }

    try {
      const response = await fetch("/api/chat/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ selectedDate: date, timestamp }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete message.");
      }

      setHistory((prev) => {
        const data = { ...prev };
        const newData = data[selectedDate].filter(
          (item) => item.timestamp !== timestamp
        );

        data[selectedDate] = newData;

        return data;
      });

      toast({
        title: "Message Deleted Successfully",
        description: "Message has been deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Failed To Delete Message",
        description: error.message,
        variant: "destructive",
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { sortedHistory, handleCopy, handleDelete };
};

export default useCurrentChatHistory;
