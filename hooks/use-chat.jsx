"use client";

import useApp from "@/hooks/use-app";
import { toast } from "@/hooks/use-toast";

const getFormattedDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const useChat = () => {
  const {
    currentUserMessage,
    setCurrentUserMessage,
    selectedModel,
    isResponseLoading,
    setIsResponseLoading,
    setHistory,
    isIncognito,
  } = useApp();

  const currentDate = getFormattedDate();

  // Function to handle the change in textarea value
  const handleChange = (event) => {
    setCurrentUserMessage(event.target.value);
  };

  const handleSubmit = async () => {
    let botMessage = "";
    let timestamp = new Date().toISOString();
    const _currentUserMessage = currentUserMessage.trim();

    setCurrentUserMessage("");
    setIsResponseLoading(true);

    setHistory((prev) => {
      const prevData = prev[currentDate] || [];
      const newData = [
        ...prevData,
        { agent: "user", message: _currentUserMessage, timestamp }
      ] || [];

      const data = {
        ...prev,
        [currentDate]: newData,
      };

      return data;
    });

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({
          prompt: _currentUserMessage,
          selectedModel,
          isIncognito,
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
        const prevData = prev[currentDate] || [];
        const newData = [
          ...prevData,
          { agent: "bot", message: botMessage, timestamp }
        ] || [];
  
        const data = {
          ...prev,
          [currentDate]: newData,
        };
  
        return data;
      });
    }
  };

  return {
    handleSubmit,
    handleChange,
    setCurrentUserMessage,
    currentUserMessage,
    isResponseLoading,
  };
};

export default useChat;
