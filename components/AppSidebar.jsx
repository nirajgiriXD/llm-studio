"use client";

/**
 * External dependencies.
 */
import { useMemo } from "react";
import { CircleAlertIcon } from "lucide-react";

/**
 * Internal dependencies.
 */
import { BrandMark } from "@/components/BrandMark";
import { ModelSwitcher } from "@/components/ModelSwitcher";
import { Settings } from "@/components/Settings";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarRail,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
import { formatDateLabel, formatFullDate, groupHistoryDates } from "@/lib/format";
import useApp from "@/hooks/useApp";

export const AppSidebar = ({ ...props }) => {
  const { history, historyDates, historyStatus, selectedDate, setSelectedDate } =
    useApp();
  const { isMobile, setOpenMobile } = useSidebar();

  const groups = useMemo(() => groupHistoryDates(historyDates), [historyDates]);

  const selectConversation = (date) => {
    setSelectedDate(date);

    // On phones the sidebar covers the conversation, so get out of the way.
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <Sidebar {...props}>
      <SidebarHeader className="gap-0">
        <div className="flex items-center gap-2.5 px-2 py-1.5">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground shadow-sm">
            <BrandMark className="size-4" />
          </div>
          <div className="grid min-w-0 leading-tight">
            <span className="truncate text-sm font-semibold tracking-tight">
              LLM Studio
            </span>
            <span className="truncate text-xs text-muted-foreground">
              Running locally
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarSeparator className="mx-0" />

      <SidebarContent className="scrollbar-subtle">
        <ModelSwitcher />

        {historyStatus === "loading" && (
          <SidebarGroup>
            <SidebarGroupLabel>History</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {Array.from({ length: 5 }).map((_, index) => (
                  <SidebarMenuItem key={index}>
                    <SidebarMenuSkeleton />
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {historyStatus === "error" && (
          <SidebarGroup>
            <SidebarGroupLabel>History</SidebarGroupLabel>
            <SidebarGroupContent>
              <div className="flex items-start gap-2 rounded-md border border-dashed px-3 py-2.5 text-xs text-muted-foreground">
                <CircleAlertIcon
                  className="mt-0.5 size-3.5 shrink-0 text-destructive"
                  aria-hidden="true"
                />
                <span>
                  Saved conversations could not be loaded. Today&apos;s chat still
                  works.
                </span>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {historyStatus === "ready" &&
          groups.map(({ label, dates }) => (
            <SidebarGroup key={label}>
              <SidebarGroupLabel>{label}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {dates.map((date) => {
                    const count = history[date]?.length ?? 0;
                    const isActive = date === selectedDate;

                    return (
                      <SidebarMenuItem key={date}>
                        <SidebarMenuButton
                          isActive={isActive}
                          aria-current={isActive ? "page" : undefined}
                          onClick={() => selectConversation(date)}
                          title={formatFullDate(date)}
                        >
                          <span className="truncate">{formatDateLabel(date)}</span>
                        </SidebarMenuButton>
                        {count > 0 && (
                          <SidebarMenuBadge className="tabular-nums">
                            <span className="sr-only">{count} messages</span>
                            <span aria-hidden="true">{count}</span>
                          </SidebarMenuBadge>
                        )}
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
      </SidebarContent>

      <SidebarSeparator className="mx-0" />

      <SidebarFooter>
        <div className="flex items-center justify-between gap-1 px-1">
          <Settings variant="sidebar" />
          <ThemeToggle />
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
};
