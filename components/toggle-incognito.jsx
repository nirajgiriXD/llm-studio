"use client";

import { Toggle } from "./ui/toggle";
import useApp from "@/hooks/use-app";
import { toast } from "@/hooks/use-toast";
import { Description } from "@radix-ui/react-dialog";
import { VenetianMaskIcon, SmileIcon } from "lucide-react";

const toggleIncognito = () => {
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
    <Toggle
      aria-label="Toggle italic"
      checked={isIncognito}
      variant="outline"
      onClick={handleClick}
    >
      {isIncognito ? <VenetianMaskIcon size={16} /> : <SmileIcon size={16} />}
    </Toggle>
  );
};

export default toggleIncognito;
