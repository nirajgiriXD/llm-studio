"use client";

/**
 * External dependencies.
 */
import { useContext } from "react";

/**
 * Internal dependencies.
 */
import { AppDataContext } from "@/providers/AppDataProvider";

const useApp = () => {
  const context = useContext(AppDataContext);

  if (!context) {
    throw new Error("useApp must be used within an AppDataProvider.");
  }

  return context;
};

export default useApp;
