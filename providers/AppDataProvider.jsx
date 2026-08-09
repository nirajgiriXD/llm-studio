"use client";

/**
 * External dependencies.
 */
import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

/**
 * Internal dependencies.
 */
import { getTodayKey } from "@/lib/format";
import { clampSetting, DEFAULT_SETTINGS } from "@/lib/settings";

// Create a context to store the application data.
export const AppDataContext = createContext({});

const SETTINGS_STORAGE_KEY = "llm-studio:settings";

/**
 * Merge dates into the sidebar list, newest first and without duplicates.
 * @param {string[]} dates Existing dates.
 * @param {string[]} additions Dates to merge in.
 * @returns {string[]} Sorted, unique dates.
 */
const mergeDates = (dates, additions) =>
  Array.from(new Set([...dates, ...additions])).sort((a, b) =>
    b.localeCompare(a)
  );

/**
 * Read the model parameters saved by a previous session.
 *
 * Incognito deliberately resets to off on every load so privacy is never
 * assumed silently — which also keeps this safe to read during the first
 * render, since nothing it returns differs between the server and the client.
 *
 * @returns {Object} Settings to start from.
 */
const readStoredSettings = () => {
  if (typeof window === "undefined") {
    return DEFAULT_SETTINGS;
  }

  try {
    const stored = window.localStorage.getItem(SETTINGS_STORAGE_KEY);

    if (!stored) {
      return DEFAULT_SETTINGS;
    }

    const parsed = JSON.parse(stored);

    return {
      ...DEFAULT_SETTINGS,
      contextSize: clampSetting("contextSize", parsed.contextSize),
      gpuLayers: clampSetting("gpuLayers", parsed.gpuLayers),
      temperature: clampSetting("temperature", parsed.temperature),
    };
  } catch {
    // A corrupt or unavailable store just means we keep the defaults.
    return DEFAULT_SETTINGS;
  }
};

/**
 * Provider component to store and manage the application data.
 * @param {Object} props Component props.
 * @returns {JSX.Element} AppDataProvider component.
 */
const AppDataProvider = ({ children }) => {
  const [models, setModels] = useState([]);
  const [modelsStatus, setModelsStatus] = useState("loading");
  const [selectedModel, setSelectedModel] = useState("");

  const [history, setHistory] = useState({});
  const [historyDates, setHistoryDates] = useState([]);
  const [historyStatus, setHistoryStatus] = useState("loading");

  const [selectedDate, setSelectedDate] = useState(() => getTodayKey());
  const [currentUserMessage, setCurrentUserMessage] = useState("");
  const [isResponseLoading, setIsResponseLoading] = useState(false);
  const [settings, setSettings] = useState(readStoredSettings);

  // Fetch the available models on mount.
  useEffect(() => {
    const controller = new AbortController();

    const initializeModels = async () => {
      try {
        const response = await fetch("/api/models", { signal: controller.signal });

        if (!response.ok) {
          throw new Error("Failed to fetch models.");
        }

        const data = await response.json();

        setModels(data.models ?? []);
        setSelectedModel(data.defaultModel ?? "");
        setModelsStatus("ready");
      } catch (error) {
        if (error.name === "AbortError") {
          return;
        }

        setModelsStatus("error");

        toast.error("Could not load models", {
          description: error.message,
        });
      }
    };

    initializeModels();

    return () => controller.abort();
  }, []);

  // Fetch the stored chat history on mount.
  useEffect(() => {
    const controller = new AbortController();

    const initializeHistory = async () => {
      try {
        const response = await fetch("/api/history", { signal: controller.signal });

        if (!response.ok) {
          throw new Error("Failed to fetch chat history.");
        }

        const { data = {}, date = [] } = await response.json();

        setHistory(data);
        // Today always has a slot, even before its first message.
        setHistoryDates(mergeDates(date, [getTodayKey()]));
        setHistoryStatus("ready");
      } catch (error) {
        if (error.name === "AbortError") {
          return;
        }

        setHistoryDates([getTodayKey()]);
        setHistoryStatus("error");

        toast.error("Could not load chat history", {
          description: error.message,
        });
      }
    };

    initializeHistory();

    return () => controller.abort();
  }, []);

  // Persist committed model parameters and surface a single confirmation.
  const saveSettings = useCallback((next) => {
    setSettings(next);

    try {
      window.localStorage.setItem(
        SETTINGS_STORAGE_KEY,
        JSON.stringify({
          contextSize: next.contextSize,
          gpuLayers: next.gpuLayers,
          temperature: next.temperature,
        })
      );
    } catch {
      // Storage can be unavailable (private mode, quota); settings still apply
      // for this session.
    }
  }, []);

  // Add a message to a conversation, creating the day's slot when needed.
  const appendMessage = useCallback((date, entry) => {
    setHistory((prev) => ({ ...prev, [date]: [...(prev[date] ?? []), entry] }));
    setHistoryDates((prev) => mergeDates(prev, [date]));
  }, []);

  // Replace a message in place, matched on its timestamp.
  const replaceMessage = useCallback((date, timestamp, entry) => {
    setHistory((prev) => ({
      ...prev,
      [date]: (prev[date] ?? []).map((item) =>
        item.timestamp === timestamp ? entry : item
      ),
    }));
  }, []);

  // Drop a message from a conversation.
  const removeMessage = useCallback((date, timestamp) => {
    setHistory((prev) => ({
      ...prev,
      [date]: (prev[date] ?? []).filter((item) => item.timestamp !== timestamp),
    }));
  }, []);

  // Values to be passed to the context.
  const value = useMemo(
    () => ({
      models,
      modelsStatus,
      selectedModel,
      setSelectedModel,
      history,
      historyDates,
      historyStatus,
      appendMessage,
      replaceMessage,
      removeMessage,
      selectedDate,
      setSelectedDate,
      currentUserMessage,
      setCurrentUserMessage,
      isResponseLoading,
      setIsResponseLoading,
      settings,
      saveSettings,
    }),
    [
      models,
      modelsStatus,
      selectedModel,
      history,
      historyDates,
      historyStatus,
      appendMessage,
      replaceMessage,
      removeMessage,
      selectedDate,
      currentUserMessage,
      isResponseLoading,
      settings,
      saveSettings,
    ]
  );

  return (
    <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
  );
};

export default AppDataProvider;
