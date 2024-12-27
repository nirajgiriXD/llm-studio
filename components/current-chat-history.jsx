"use client";

import useApp from "@/hooks/use-app";
import ChatCard from "./chat-card";
import TypingAnimation from "./typing-animation";
import useCurrentChatHistory from "@/hooks/use-current-chat-history";

const CurrentChatHistory = () => {
  const { history, selectedDate, isReponseLoading, setHistory } = useApp();

  const { sortedHistory, handleCopy, handleDelete } = useCurrentChatHistory({
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

export default CurrentChatHistory;
