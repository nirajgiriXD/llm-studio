"use client";

/**
 * External dependencies.
 */
import { useRef } from "react";

/**
 * Internal dependencies.
 */
import useApp from "@/hooks/useApp";
import { toast } from "@/hooks/use-toast";

const useChat = () => {
  const inputRef = useRef(null);

  const {
    currentUserMessage,
    setCurrentUserMessage,
    selectedModel,
    selectedDate,
    isResponseLoading,
    setIsResponseLoading,
    setHistory,
    settings,
  } = useApp();

  const { isIncognito, gpuLayers, contextSize, temperature } = settings;

  // Function to handle the change in textarea value
  const handleChange = (event) => {
    setCurrentUserMessage(event.target.value);
  };

  // Function to handle the chat message submission
  const handleSubmit = async () => {
    let botMessage = "";
    let timestamp = new Date().toISOString();
    const _currentUserMessage = currentUserMessage.trim();

    setCurrentUserMessage("");
    setIsResponseLoading(true);

    setHistory((prev) => {
      const prevData = prev[selectedDate] || [];
      const newData =
        [
          ...prevData,
          { agent: "user", message: _currentUserMessage, timestamp },
        ] || [];

      const data = {
        ...prev,
        [selectedDate]: newData,
      };

      return data;
    });

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({
          prompt: _currentUserMessage,
          selectedModel,
          selectedDate,
          isIncognito,
          gpuLayers,
          contextSize,
          temperature,
        }),
      });

      botMessage = await response.json();
      botMessage = botMessage.message;
    } catch (error) {
      toast({
        title: "Error Fetching Response",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      timestamp = new Date().toISOString();

      setIsResponseLoading(false);

      setHistory((prev) => {
        const prevData = prev[selectedDate] || [];
        const newData =
          [
            ...prevData,
            { agent: selectedModel, message: botMessage, timestamp },
          ] || [];

        const data = {
          ...prev,
          [selectedDate]: newData,
        };

        return data;
      });

      inputRef.current?.blur();
    }
  };

  return {
    handleSubmit,
    handleChange,
    inputRef,
    setCurrentUserMessage,
    currentUserMessage,
    isResponseLoading,
  };
};

export default useChat;
