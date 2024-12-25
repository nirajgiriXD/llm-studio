/**
 * External dependencies.
 */
import { useState, useRef, useEffect } from "react";

/**
 * Internal dependencies.
 */
import useApp from "./use-app";

export function useHistorySearch() {
  const [query, setQuery] = useState("");
  const [options, setOptions] = useState([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const containerRef = useRef(null);
  const inputRef = useRef(null);

  const { history } = useApp();

  // Set the query based on the input value
  const handleInputChange = (e) => {
    const { value } = e.target;

    setQuery(value);
    setIsDropdownVisible(!!value);
  };

  // Navigate to the selected page if the page exists
  const handleOptionSelect = (value) => {
    if (value) {
      setQuery("");
      setIsDropdownVisible(false);

      // Remove focus from the input
      inputRef.current?.blur();

      console.log("Selected option:", value);
    }
  };

  useEffect(() => {
    const initializeSearchOptions = () => {
      const mappedHistoryData = Object.values(history).flat().map((entry) => ({
        title: entry.message,
        value: entry.timestamp,
      }));

      setOptions(mappedHistoryData);
    };

    initializeSearchOptions();
  }, [history]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsDropdownVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return {
    query,
    options,
    inputRef,
    containerRef,
    isDropdownVisible,
    handleInputChange,
    handleOptionSelect,
  };
}
