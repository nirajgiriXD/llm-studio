"use client";

/**
 * Internal dependencies.
 */
import { ChatCard } from "@/components/ChatCard";
import { TypingAnimation } from "@/components/TypingAnimation";
import useApp from "@/hooks/useApp";
import useChatHistory from "@/hooks/useChatHistory";

export const ChatHistory = () => {
  const { history, selectedDate, isReponseLoading, setHistory } = useApp();

  const { sortedHistory, handleCopy, handleDelete } = useChatHistory({
    history,
    setHistory,
    selectedDate,
  });

  return (
    <div className="space-y-4 m-2">
      {sortedHistory.map((history) => (
        <div
          key={history.timestamp}
          className={`flex ${
            history.agent === "user" ? "justify-end" : "justify-start"
          }`}
        >
          <ChatCard
            history={history}
            selectedDate={selectedDate}
            handleCopy={handleCopy}
            handleDelete={handleDelete}
          />
        </div>
      ))}

      {isReponseLoading && (
        <div className="">
          <TypingAnimation />
        </div>
      )}
    </div>
  );
};
