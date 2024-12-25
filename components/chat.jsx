"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import useChat from "@/hooks/use-chat";

const Chat = () => {
  const {
    currentUserMessage,
    setCurrentUserMessage,
    handleChange,
    handleSubmit,
  } = useChat();

  return (
    <div className="flex flex-col gap-4">
      <Textarea
        placeholder="Type your message here."
        className="bg-white"
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
        <Button onClick={handleSubmit}>Submit</Button>
      </div>
    </div>
  );
};

export default Chat;
