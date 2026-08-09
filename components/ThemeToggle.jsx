"use client";

/**
 * External dependencies.
 */
import { CheckIcon, MonitorIcon, MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";

/**
 * Internal dependencies.
 */
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import useIsHydrated from "@/hooks/useIsHydrated";

const THEMES = [
  { value: "light", label: "Light", icon: SunIcon },
  { value: "dark", label: "Dark", icon: MoonIcon },
  { value: "system", label: "System", icon: MonitorIcon },
];

export const ThemeToggle = ({ className }) => {
  const { theme, setTheme, resolvedTheme } = useTheme();

  // The active theme is only known in the browser, so the trigger renders a
  // stable placeholder until then rather than mismatching on hydration.
  const isHydrated = useIsHydrated();

  const ActiveIcon = isHydrated && resolvedTheme === "dark" ? MoonIcon : SunIcon;

  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              className={className}
              aria-label={
                isHydrated ? `Theme: ${theme ?? "system"}. Change theme` : "Change theme"
              }
            >
              <ActiveIcon />
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent>Theme</TooltipContent>
      </Tooltip>

      <DropdownMenuContent align="end" className="w-40">
        {THEMES.map(({ value, label, icon: Icon }) => (
          <DropdownMenuItem key={value} onSelect={() => setTheme(value)}>
            <Icon />
            {label}
            {isHydrated && theme === value && (
              <CheckIcon className="ml-auto size-4 text-muted-foreground" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
