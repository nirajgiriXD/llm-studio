"use client";

/**
 * External dependencies.
 */
import { useCallback, useState } from "react";

/**
 * Internal dependencies.
 */
import { toast } from "@/hooks/use-toast";
import useApp from "@/hooks/useApp";

const useSettings = () => {
  const { settings, setSettings } = useApp();

  const handleValueChange = useCallback((name, value) => {
    if (name === "_isIncognito") {
      setSettings((prev) => ({ ...prev, _isIncognito: value === "enable" }));
    } else {
      setSettings((prev) => ({ ...prev, [name]: value }));
    }
  }, [setSettings]);

  const handleSettingsSubmit = useCallback(() => {
    setSettings((prev) => ({
      ...prev,
      isIncognito: prev._isIncognito,
      contextSize: prev._contextSize,
      gpuLayers: prev._gpuLayers,
      temperature: prev._temperature,
    }));

    toast({
      title: "Settings Saved",
      description: "Your settings have been saved successfully.",
    });
  }, [setSettings]);

  return { settings, handleValueChange, handleSettingsSubmit };
};

export default useSettings;
