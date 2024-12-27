"use client";

import { VersionSwitcher } from "@/components/version-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import useApp from "@/hooks/use-app";

export function AppSidebar({ ...props }) {
  const { models, selectedModel, historyDates, selectedDate, setSelectedDate } =
    useApp();

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <VersionSwitcher models={models} defaultModel={selectedModel} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>History</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {historyDates.map((date) => (
                <SidebarMenuItem key={date}>
                  <SidebarMenuButton asChild>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedDate(date);
                      }}
                      className={date === selectedDate ? "bg-slate-100" : ""}
                    >
                      {date}
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
