"use client";

/**
 * External dependencies.
 */
import { ClipboardIcon, ClipboardCheckIcon, TrashIcon } from "lucide-react";
import Markdown from "markdown-to-jsx";
import { useState } from "react";

/**
 * Internal dependencies.
 */
import { Card, CardContent } from "@/components/ui/card";

export const ChatCard = ({
  history,
  selectedDate,
  handleCopy,
  handleDelete,
}) => {
  const [isCopying, setIsCopying] = useState(false);

  return (
    <Card
      tabIndex="0"
      data-timestamp={history.timestamp}
      className={`max-w-xl w-full shadow-none ${
        history.agent === "user" ? "bg-sky-100" : "bg-gray-200"
      } border border-gray-200 focus:border-blue-400 focus:outline-none`}
    >
      <CardContent className="p-4">
        {/* Header */}

        {/* Message */}
        <div className="mb-3">
          <Markdown className="text-sm">{history.message}</Markdown>
        </div>

        {/* Footer */}
        <div className="text-[10px] text-slate-600 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>
              {history.agent === "user"
                ? history.agent.charAt(0).toUpperCase() + history.agent.slice(1)
                : history.agent.replace(".gguf", "")}
            </span>
            <span>•</span>
            {history.timestamp}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleDelete(selectedDate, history.timestamp)}
            >
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
