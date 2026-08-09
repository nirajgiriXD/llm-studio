"use client";

/**
 * External dependencies.
 */
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

/**
 * Internal dependencies.
 */
import useApp from "@/hooks/useApp";
import {
  clampSetting,
  DEFAULT_SETTINGS,
  isSettingValid,
  SETTINGS_FIELDS,
} from "@/lib/settings";

const NUMERIC_FIELDS = Object.keys(SETTINGS_FIELDS);

const useSettings = () => {
  const { settings, saveSettings } = useApp();
  const [isOpen, setIsOpen] = useState(false);

  // The dialog edits a local draft so nothing takes effect until it is saved,
  // and closing without saving simply discards it. The draft is re-seeded when
  // the dialog opens rather than in an effect.
  const [draft, setDraft] = useState(settings);

  const handleOpenChange = useCallback(
    (open) => {
      if (open) {
        setDraft(settings);
      }

      setIsOpen(open);
    },
    [settings]
  );

  const errors = useMemo(
    () =>
      NUMERIC_FIELDS.reduce((collected, field) => {
        if (!isSettingValid(field, draft[field])) {
          const { min, max, label } = SETTINGS_FIELDS[field];

          collected[field] = `${label} must be between ${min} and ${max}.`;
        }

        return collected;
      }, {}),
    [draft]
  );

  const isValid = Object.keys(errors).length === 0;

  const isDirty = useMemo(
    () =>
      draft.isIncognito !== settings.isIncognito ||
      NUMERIC_FIELDS.some((field) => Number(draft[field]) !== Number(settings[field])),
    [draft, settings]
  );

  const handleValueChange = useCallback((name, value) => {
    setDraft((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleReset = useCallback(() => {
    setDraft((prev) => ({ ...DEFAULT_SETTINGS, isIncognito: prev.isIncognito }));
  }, []);

  const handleSettingsSubmit = useCallback(() => {
    if (!isValid) {
      return;
    }

    saveSettings({
      isIncognito: Boolean(draft.isIncognito),
      ...Object.fromEntries(
        NUMERIC_FIELDS.map((field) => [field, clampSetting(field, draft[field])])
      ),
    });

    setIsOpen(false);

    toast.success("Settings saved", {
      description: "They apply to your next message.",
    });
  }, [draft, isValid, saveSettings]);

  // Incognito is also reachable from the header, where it applies immediately.
  const toggleIncognito = useCallback(() => {
    const isIncognito = !settings.isIncognito;

    saveSettings({ ...settings, isIncognito });

    toast.success(isIncognito ? "Incognito on" : "Incognito off", {
      description: isIncognito
        ? "New messages stay in this session and are not written to disk."
        : "New messages are saved to your chat history again.",
    });
  }, [saveSettings, settings]);

  return {
    settings,
    draft,
    errors,
    isValid,
    isDirty,
    isOpen,
    handleOpenChange,
    handleValueChange,
    handleReset,
    handleSettingsSubmit,
    toggleIncognito,
  };
};

export default useSettings;
