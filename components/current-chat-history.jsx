"use client";

import { useCallback } from "react";
import useApp from "@/hooks/use-app";
import ChatCard from "./chat-card";
import TypingAnimation from "./typing-animation";
import { toast } from "@/hooks/use-toast";

const CurrentChatHistory = () => {
  const { history, selectedDate, isReponseLoading, setHistory } = useApp();

  const sortedHistory = (history[selectedDate] || []).sort((a, b) =>
    a.timestamp.localeCompare(b.timestamp)
  );

  const handleCopy = useCallback((message, setIsCopying) => {
    setIsCopying(true);

    // Copy to clipboard
    navigator.clipboard.writeText(message);

    setTimeout(() => {
      setIsCopying(false);
    }, 1000);
  }, []);

  const handleDelete = useCallback(async (selectedDate, timestamp) => {
    const isConfirmed = confirm(`Are you sure you want to delete this message?`);

    if (!isConfirmed) {
      return;
    }

    try {
      const response = await fetch("/api/chat/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ selectedDate, timestamp }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete message.");
      }

      setHistory((prev) => {
        const data = { ...prev };
        const newData = data[selectedDate].filter((item) => item.timestamp !== timestamp);

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
  }, []);

  return (
    <div className="space-y-4">
      {sortedHistory.map((history, index) => (
        <div
          key={index}
          className={`flex ${
            history.agent === "user" ? "justify-end" : "justify-start"
          }`}
        >
          <ChatCard history={history} selectedDate={selectedDate} handleCopy={handleCopy} handleDelete={handleDelete} />
        </div>
      ))}

      {isReponseLoading && (
        <div className="py-4">
          <TypingAnimation />
        </div>
      )}
    </div>
  );
};

export default CurrentChatHistory;
