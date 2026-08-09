"use client";

/**
 * External dependencies.
 */
import { useCallback, useRef } from "react";
import { toast } from "sonner";

/**
 * Internal dependencies.
 */
import useApp from "@/hooks/useApp";

const EMPTY_RESPONSE_MESSAGE =
  "The model returned an empty response. Try rephrasing your message, or lower the context size in settings.";

const useChat = () => {
  const inputRef = useRef(null);

  const {
    currentUserMessage,
    setCurrentUserMessage,
    selectedModel,
    selectedDate,
    isResponseLoading,
    setIsResponseLoading,
    appendMessage,
    removeMessage,
    settings,
  } = useApp();

  const { isIncognito, gpuLayers, contextSize, temperature } = settings;

  const canSubmit =
    Boolean(currentUserMessage.trim()) && Boolean(selectedModel) && !isResponseLoading;

  // Function to handle the change in textarea value.
  const handleChange = useCallback(
    (event) => setCurrentUserMessage(event.target.value),
    [setCurrentUserMessage]
  );

  // Ask the model for an answer and record it against the conversation. The
  // failure is stored as a message of its own so it stays visible next to the
  // prompt that caused it and can be retried.
  const generateAnswer = useCallback(
    async (date, prompt) => {
      setIsResponseLoading(true);

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt,
            selectedModel,
            selectedDate: date,
            isIncognito,
            gpuLayers,
            contextSize,
            temperature,
            timestamp: new Date().toISOString(),
          }),
        });

        const payload = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(payload.error || "Failed to generate a response.");
        }

        if (!payload.message?.trim()) {
          throw new Error(EMPTY_RESPONSE_MESSAGE);
        }

        appendMessage(date, {
          agent: selectedModel,
          message: payload.message,
          timestamp: payload.timestamp || new Date().toISOString(),
        });
      } catch (error) {
        appendMessage(date, {
          agent: selectedModel,
          message: error.message,
          timestamp: new Date().toISOString(),
          status: "error",
          prompt,
        });

        toast.error("The model could not answer", {
          description: "Check the console for details, then try again.",
        });
      } finally {
        setIsResponseLoading(false);
      }
    },
    [
      appendMessage,
      contextSize,
      gpuLayers,
      isIncognito,
      selectedModel,
      setIsResponseLoading,
      temperature,
    ]
  );

  // Function to handle the chat message submission.
  const handleSubmit = useCallback(async () => {
    const prompt = currentUserMessage.trim();

    if (!prompt || isResponseLoading) {
      return;
    }

    if (!selectedModel) {
      toast.error("No model selected", {
        description: "Add a .gguf model to the models folder, then reload.",
      });

      return;
    }

    const date = selectedDate;

    setCurrentUserMessage("");

    appendMessage(date, {
      agent: "user",
      message: prompt,
      timestamp: new Date().toISOString(),
    });

    await generateAnswer(date, prompt);

    // Keep the caret in the composer so the next message can be typed straight
    // away.
    inputRef.current?.focus();
  }, [
    appendMessage,
    currentUserMessage,
    generateAnswer,
    isResponseLoading,
    selectedDate,
    selectedModel,
    setCurrentUserMessage,
  ]);

  // Replace a failed answer with a fresh attempt at the same prompt.
  const handleRetry = useCallback(
    async (date, failedMessage) => {
      if (isResponseLoading || !failedMessage?.prompt) {
        return;
      }

      removeMessage(date, failedMessage.timestamp);

      await generateAnswer(date, failedMessage.prompt);
    },
    [generateAnswer, isResponseLoading, removeMessage]
  );

  return {
    handleSubmit,
    handleChange,
    handleRetry,
    inputRef,
    setCurrentUserMessage,
    currentUserMessage,
    isResponseLoading,
    canSubmit,
  };
};

export default useChat;
