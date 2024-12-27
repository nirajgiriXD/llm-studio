"use client";

import { ClipboardIcon, ClipboardCheckIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import Markdown from "markdown-to-jsx";
import { Card, CardContent } from "./ui/card";

const ChatCard = ({ history, selectedDate, handleCopy, handleDelete }) => {
  const [isCopying, setIsCopying] = useState(false);

  return (
    <Card
      className={`max-w-xl w-full shadow-none ${
        history.agent === "user" ? "bg-sky-100" : "bg-gray-200"
      }`}
    >
      <CardContent className="p-4">
        {/* Header */}
        

        {/* Message */}
        <div className="mb-3">
          <Markdown className="text-sm">{history.message}</Markdown>
        </div>

        {/* Footer */}
        <div className="text-[10px] text-slate-600 flex items-center justify-between">
          <div>
            {history.agent !== "user" && (
              <>
                {history.agent.replace(".gguf", "")}
                <span className="mx-2">•</span>
              </>
            )}
            {history.timestamp}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => handleDelete(selectedDate, history.timestamp)}>
              <TrashIcon size={12} color="#9f1239" />
            </button>
            <button
              onClick={() => handleCopy(history.message, setIsCopying)}
              disabled={isCopying}
            >
              {isCopying ? (
                <ClipboardCheckIcon size={12} />
              ) : (
                <ClipboardIcon size={12} />
              )}
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatCard;
