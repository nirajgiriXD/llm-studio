"use client";

/**
 * External dependencies.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

/**
 * Copy text to the clipboard and report success for long enough to show it.
 * @param {number} resetAfter Milliseconds before the copied state clears.
 * @returns {{isCopied: boolean, copy: (text: string) => Promise<boolean>}} Copy state and action.
 */
const useCopy = (resetAfter = 1600) => {
  const [isCopied, setIsCopied] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  const copy = useCallback(
    async (text) => {
      try {
        await navigator.clipboard.writeText(text);

        setIsCopied(true);
        window.clearTimeout(timerRef.current);
        timerRef.current = window.setTimeout(() => setIsCopied(false), resetAfter);

        return true;
      } catch {
        toast.error("Could not copy", {
          description: "Clipboard access was blocked by the browser.",
        });

        return false;
      }
    },
    [resetAfter]
  );

  return { isCopied, copy };
};

export default useCopy;
