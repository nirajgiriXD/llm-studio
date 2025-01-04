"use client";

/**
 * External dependencies.
 */
import { VenetianMaskIcon } from "lucide-react";

/**
 * Internal dependencies.
 */
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import useChat from "@/hooks/useChat";
import useSettings from "@/hooks/useSettings";

export const Chat = () => {
  const {
    currentUserMessage,
    setCurrentUserMessage,
    inputRef,
    handleChange,
    handleSubmit,
  } = useChat();

  const { settings } = useSettings();

  return (
    <div className="flex flex-col gap-4">
      <Textarea
        placeholder="Type your message here."
        className="bg-white"
        ref={inputRef}
        value={currentUserMessage}
        onChange={handleChange}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.ctrlKey) {
            // Prevent newline
            e.preventDefault();

            // Call the submit function when the user presses the Enter key
            handleSubmit();
          } else if (e.key === "Enter" && e.ctrlKey) {
            setCurrentUserMessage((prev) => prev + "\n");
          }
        }}
      />

      <div className="flex justify-end">
        <Button onClick={handleSubmit}>
            Submit
            {settings.isIncognito && <VenetianMaskIcon size={16} />}
        </Button>
      </div>
    </div>
  );
};