"use client";

/**
 * External dependencies.
 */
import { VenetianMaskIcon, SmileIcon } from "lucide-react";
import { useCallback } from "react";

/**
 * Internal dependencies.
 */
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Toggle } from "@/components/ui/toggle";
import { toast } from "@/hooks/use-toast";
import useApp from "@/hooks/useApp";

export const ToggleIncognito = () => {
  const { isIncognito, setIsIncognito } = useApp();

  const handleClick = useCallback(() => {
    const _isIncognito = !isIncognito;
    setIsIncognito(_isIncognito);

    toast({
      title: `Incognito Mode Is ${_isIncognito ? "Enabled" : "Disabled"}`,
      description: `Your browsing history will ${
        _isIncognito ? "not" : ""
      } be saved.`,
      status: "info",
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setIsIncognito]);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Toggle
            aria-label="Toggle Incognito Mode"
            checked={isIncognito}
            variant="outline"
            onClick={handleClick}
          >
            {isIncognito ? (
              <VenetianMaskIcon size={16} />
            ) : (
              <SmileIcon size={16} />
            )}
          </Toggle>
        </TooltipTrigger>
        <TooltipContent>
          <p>Toggle Incognito Mode</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
