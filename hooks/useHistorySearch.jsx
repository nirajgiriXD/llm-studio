"use client";

/**
 * External dependencies.
 */
import { useState, useEffect } from "react";

/**
 * Internal dependencies.
 */
import useApp from "@/hooks/useApp";

const useHistorySearch = () => {
  const [query, setQuery] = useState("");
  const [options, setOptions] = useState([]);
  const [mappedHistoryData, setMappedHistoryData] = useState([]);

  const { history, setSelectedDate } = useApp();

  // Set the query based on the input value
  const handleInputChange = (input) => {
    if (input) {
      const filteredValue = input.trim().toLowerCase();
      setQuery(filteredValue);
    }
  };

  // Navigate to the selected chat
  const handleOptionSelect = (option) => {
    if (!option) {
      return;
    }

    const { value: timestamp, date } = option;

    setQuery("");
    setSelectedDate(date);

    // Scroll to the div with id as timestamp
    setTimeout(() => {
      const targetElement = document.querySelector(
        `[data-timestamp="${timestamp}"]`
      );
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth", block: "center" });

        // Delay focusing to allow the scroll to complete
        setTimeout(() => targetElement.focus(), 800);
      }
    }, 200);
  };

  // Filter the options based on the query
  useEffect(() => {
    if (!query) {
      setOptions([]);
      return;
    }

    const filteredOptions = mappedHistoryData
      .filter((option) => option.label.toLowerCase().includes(query))
      .slice(0, 5);

    setOptions(filteredOptions);
  }, [query, mappedHistoryData]);

  // Map the history data to the options format
  useEffect(() => {
    const initializeSearchOptions = () => {
      const data = Object.entries(history).flatMap(([key, entries]) =>
        entries.map((entry) => ({
          label: entry.message,
          value: entry.timestamp,
          date: key,
        }))
      );

      setMappedHistoryData(data);
    };

    initializeSearchOptions();
  }, [history]);

  return {
    query,
    options,
    handleInputChange,
    handleOptionSelect,
  };
};

export default useHistorySearch;
