'use client';

import { toast } from "@/hooks/use-toast";
import { createContext, useEffect, useState } from "react";

export const AppDataContext = createContext({});

const getFormattedDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const AppDataProvider = ({ children }) => {
  const [selectedModel, setSelectedModel] = useState("");
  const [models, setModels] = useState([]);
  const [history, setHistory] = useState({});
  const [historyDates, setHistoryDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(getFormattedDate());
  const [currentUserMessage, setCurrentUserMessage] = useState("");
  const [isReponseLoading, setIsResponseLoading] = useState(false);
  const [isIncognito, setIsIncognito] = useState(false);

  // Fetch models data (`models`, `selectedModel`) on component mount
  useEffect(() => {
    const initializeModels = async () => {
      try {
        const response = await fetch("/api/models");

        if (!response.ok) {
          throw new Error("Failed to fetch models");
        }

        const data = await response.json();

        setModels(data.models);
        setSelectedModel(data.defaultModel);
      } catch (error) {
        toast({
          title: "Failed To Fetch Models",
          description: error.message,
          variant: "destructive",
        });
      }
    };

    initializeModels();
  }, []);

  // Fetch history data (`history`, `historyDates`) on component mount
  useEffect(() => {
    const initializeHistory = async () => {
      const formattedDate = getFormattedDate();
      try {
        const response = await fetch('/api/history');

        if (!response.ok) {
          throw new Error("Failed to fetch history");
        }

        const { data = {}, date = [] } = await response.json();

        if (!date.includes(formattedDate)) {
            date.push(formattedDate);
        }

        setHistory(data);
        setHistoryDates(date.sort((a,b) => b.localeCompare(a)));
      } catch (error) {
        toast({
          title: "Failed To Fetch History",
          description: error.message || "An error occurred while fetching history",
          variant: "destructive",
        });
      }
    };

    initializeHistory();
  }, []);

  const value = {
    models,
    selectedModel,
    setSelectedModel,
    historyDates,
    history,
    setHistory,
    currentUserMessage,
    setCurrentUserMessage,
    isReponseLoading,
    setIsResponseLoading,
    selectedDate,
    setSelectedDate,
    isIncognito,
    setIsIncognito,
  };

  return (
    <AppDataContext.Provider value={value}>
      {children}
    </AppDataContext.Provider>
  );
};

export default AppDataProvider;
