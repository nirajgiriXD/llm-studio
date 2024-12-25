import { HomeIcon } from 'lucide-react';
import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { HistorySearch } from '@/components/history-search';
import Chat from '@/components/chat';
import CurrentChatHistory from '@/components/current-chat-history';

export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 items-center border-b px-4 justify-between">
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
                <BreadcrumbItem>
                  <BreadcrumbPage>Chat</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div>
            <HistorySearch />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="h-full flex flex-col gap-4">
            {/* Chat history section */}
            <div className="flex-1 overflow-y-auto">
              <CurrentChatHistory />
            </div>

            {/* Chat input section */}
            <div className="flex-shrink-0">
              <Chat />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
