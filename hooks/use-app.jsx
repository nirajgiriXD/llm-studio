"use client";

import { useContext } from "react";
import { AppDataContext } from "@/providers/AppDataProvider";

const useApp = () => {
  return useContext(AppDataContext);
};

export default useApp;
