"use client";

import Markdown from "markdown-to-jsx";
import { Card, CardContent } from "./ui/card";
import useApp from "@/hooks/use-app";
import TypingAnimation from "./typing-animation";

const CurrentChatHistory = () => {
  const { history, selectedDate, isReponseLoading } = useApp();

  const sortedHistory = (history[selectedDate] || []).sort((a, b) =>
    a.timestamp.localeCompare(b.timestamp)
  );

  return (
    <div className="space-y-4">
      {sortedHistory.map((history, index) => (
        <div
          key={index}
          className={`flex ${
            history.agent === "user" ? "justify-end" : "justify-start"
          }`}
        >
          <Card
            className={`max-w-xl shadow-none ${
              history.agent === "user" ? "bg-sky-100" : "bg-gray-200"
            }`}
          >
            <CardContent className="p-4">
              <Markdown className="text-sm">{history.message}</Markdown>
              <p className="text-[10px] mt-2 text-slate-600">
                {history.timestamp}
              </p>
            </CardContent>
          </Card>
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
