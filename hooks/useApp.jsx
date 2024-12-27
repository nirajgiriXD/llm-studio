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
  return useContext(AppDataContext);
};

export default useApp;
