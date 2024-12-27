/**
 * External dependencies.
 */
import { HomeIcon } from "lucide-react";

/**
 * Internal dependencies.
 */
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { AppSidebar } from "@/components/AppSidebar";
import { HistorySearch } from "@/components/HistorySearch";
import { ToggleIncognito } from "@/components/ToggleIncognito";
import { Chat } from "@/components/Chat";
import { ChatHistory } from "@/components/ChatHistory";

const Page = () => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* Header */}
        <header className="flex h-16 items-center border-b px-4 justify-between">
          {/* Breadcrumb */}
          <div className="flex gap-2 items-center shrink-0">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    <HomeIcon size={16} />
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbPage>Chat</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          {/* Actions */}
          <div className="flex gap-4 items-center">
            <ToggleIncognito />
            <HistorySearch />
          </div>
        </header>

        {/* Main content */}
        <div className="flex flex-col h-[calc(100vh-4rem)] gap-4 p-4">
          {/* Chat history section */}
          <div className="flex-1 overflow-y-auto" id="current-chat-history">
            <ChatHistory />
          </div>

          {/* Chat input section */}
          <div className="h-28 flex-shrink-0">
            <Chat />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Page;
