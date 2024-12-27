"use client";

import { Toggle } from "./ui/toggle";
import useApp from "@/hooks/use-app";
import { toast } from "@/hooks/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { VenetianMaskIcon, SmileIcon } from "lucide-react";

const toggleIncognito = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { isIncognito, setIsIncognito } = useApp();

  const handleClick = () => {
    const _isIncognito = !isIncognito;
    setIsIncognito(_isIncognito);
    toast({
      title: `Incognito Mode Is ${_isIncognito ? "Enabled" : "Disabled"}`,
      description: `Your browsing history will ${_isIncognito ? "not" : ""} be saved.`,
      status: "info",
    });
  };

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
            {isIncognito ? <VenetianMaskIcon size={16} /> : <SmileIcon size={16} />}
          </Toggle>
        </TooltipTrigger>
        <TooltipContent>
          <p>Toggle Incognito Mode</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default toggleIncognito;
