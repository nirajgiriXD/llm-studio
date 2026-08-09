"use client";

/**
 * External dependencies.
 */
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

/**
 * Internal dependencies.
 */
import useApp from "@/hooks/useApp";

const useChatHistory = () => {
  const { history, selectedDate, removeMessage } = useApp();
  const [pendingDelete, setPendingDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Sort the chat history based on the timestamp. The stored array is never
  // mutated, so a message removal still produces a new reference.
  const messages = useMemo(
    () =>
      [...(history[selectedDate] ?? [])].sort((a, b) =>
        String(a.timestamp).localeCompare(String(b.timestamp))
      ),
    [history, selectedDate]
  );

  // Function to handle deleting the message, once confirmed.
  const confirmDelete = useCallback(async () => {
    if (!pendingDelete) {
      return;
    }

    const { date, timestamp } = pendingDelete;

    setIsDeleting(true);

    try {
      const response = await fetch("/api/chat/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ selectedDate: date, timestamp }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));

        throw new Error(payload.error || "Failed to delete the message.");
      }

      removeMessage(date, timestamp);
      setPendingDelete(null);

      toast.success("Message deleted");
    } catch (error) {
      toast.error("Could not delete the message", {
        description: error.message,
      });
    } finally {
      setIsDeleting(false);
    }
  }, [pendingDelete, removeMessage]);

  return {
    messages,
    pendingDelete,
    setPendingDelete,
    confirmDelete,
    isDeleting,
  };
};

export default useChatHistory;
