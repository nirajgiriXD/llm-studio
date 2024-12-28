"use client";

/**
 * External dependencies.
 */
import { createContext, useEffect, useState } from "react";

/**
 * Internal dependencies.
 */
import { toast } from "@/hooks/use-toast";

// Create a context to store the application data
export const AppDataContext = createContext({});

/**
 * Get formatted date in `YYYY-MM-DD` format.
 * @returns {string} Formatted date.
 */
const getFormattedDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/**
 * Provider component to store and manage the application data.
 * @param {Object} props Component props.
 * @returns {JSX.Element} AppDataProvider component.
 */
const AppDataProvider = ({ children }) => {
  const [selectedModel, setSelectedModel] = useState("");
  const [models, setModels] = useState([]);
  const [history, setHistory] = useState({});
  const [historyDates, setHistoryDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(getFormattedDate());
  const [currentUserMessage, setCurrentUserMessage] = useState("");
  const [isReponseLoading, setIsResponseLoading] = useState(false);
  const [settings, setSettings] = useState({
    isIncognito: false,
    contextSize: 512,
    gpuLayers: 32,
    temperature: 0.7,
    _isIncognito: false,
    _contextSize: 512,
    _gpuLayers: 33,
    _temperature: 0.7,
  });

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
        const response = await fetch("/api/history");

        if (!response.ok) {
          throw new Error("Failed to fetch history");
        }

        const { data = {}, date = [] } = await response.json();

        // Add today's date to the history dates if not present
        if (!date.includes(formattedDate)) {
          date.push(formattedDate);
        }

        setHistory(data);
        setHistoryDates(date.sort((a, b) => b.localeCompare(a)));
      } catch (error) {
        toast({
          title: "Failed To Fetch History",
          description:
            error.message || "An error occurred while fetching history",
          variant: "destructive",
        });
      }
    };

    initializeHistory();
  }, []);

  // Values to be passed to the context
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
    settings,
    setSettings,
  };

  return (
    <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
  );
};

export default AppDataProvider;
